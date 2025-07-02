<?php

namespace App\Http\Controllers;

use App\Models\Comment;
use App\Models\Jeu;
use App\Models\User;
use App\Notifications\NewCommentSubmission;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Notification;

class CommentController extends Controller
{
    /**
     * Create a new controller instance.
     */
    public function __construct()
    {
        $this->middleware(['auth', 'verified'])->except(['index', 'show']);
    }
    /**
     * Display a listing of the comments for a game.
     */
    public function index(Request $request)
    {
        $jeuId = $request->input('jeu_id');

        if (!$jeuId) {
            return response()->json(['error' => 'Game ID is required'], 400);
        }

        $jeu = Jeu::findOrFail($jeuId);

        $comments = Comment::where('jeu_id', $jeuId)
            ->where('is_approved', true)
            ->whereNull('parent_id') // Only get top-level comments
            ->with(['user', 'replies.user'])
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        return response()->json([
            'comments' => $comments,
            'jeu' => [
                'id' => $jeu->id,
                'titre' => $jeu->titre,
            ],
        ]);
    }

    /**
     * Show the form for creating a new comment.
     * Not used in API-based implementation.
     */
    public function create()
    {
        abort(404);
    }

    /**
     * Store a newly created comment.
     */
    public function store(Request $request)
    {
        // Validate the request
        $validated = $request->validate([
            'jeu_id' => 'required|exists:jeux,id',
            'content' => 'required|string|max:1000',
            'parent_id' => 'nullable|exists:comments,id',
        ]);

        // Create the comment
        $comment = new Comment();
        $comment->user_id = Auth::id();
        $comment->jeu_id = $validated['jeu_id'];
        $comment->content = $validated['content'];
        $comment->is_flagged = false; // Explicitly set is_flagged to false
        $comment->flag_reason = null; // Explicitly set flag_reason to null

        // Set parent_id if this is a reply
        if (isset($validated['parent_id'])) {
            $comment->parent_id = $validated['parent_id'];
        }

        // Set approval status based on user role
        // Admins and moderators can post without approval
        if (Auth::user()->role === 'admin' || Auth::user()->role === 'moderator') {
            $comment->is_approved = true;
        } else {
            $comment->is_approved = false;
            // Double-check that is_flagged is false for new comments
            $comment->is_flagged = false;
        }

        // Log the user information for debugging
        Log::info('User submitting comment:', [
            'user_id' => Auth::id(),
            'user_name' => Auth::user()->name,
            'user_email' => Auth::user()->email,
            'user_role' => Auth::user()->role,
        ]);

        // Log the comment data before saving
        Log::info('Comment data before saving:', [
            'jeu_id' => $comment->jeu_id,
            'content' => substr($comment->content, 0, 50) . (strlen($comment->content) > 50 ? '...' : ''),
            'is_approved' => $comment->is_approved,
            'is_flagged' => $comment->is_flagged,
            'parent_id' => $comment->parent_id,
        ]);

        // Log before saving
        Log::info('Comment before save:', [
            'user_id' => $comment->user_id,
            'user_name' => Auth::user()->name,
            'user_email' => Auth::user()->email,
            'user_role' => Auth::user()->role,
            'jeu_id' => $comment->jeu_id,
            'content' => substr($comment->content, 0, 50) . (strlen($comment->content) > 50 ? '...' : ''),
            'is_approved' => $comment->is_approved,
            'is_flagged' => $comment->is_flagged,
        ]);

        $comment->save();

        // Log the saved comment with ID for debugging
        Log::info('Comment saved:', [
            'id' => $comment->id,
            'user_id' => $comment->user_id,
            'user_name' => Auth::user()->name,
            'user_email' => Auth::user()->email,
            'jeu_id' => $comment->jeu_id,
            'content' => substr($comment->content, 0, 50) . (strlen($comment->content) > 50 ? '...' : ''),
            'is_approved' => $comment->is_approved,
            'is_flagged' => $comment->is_flagged,
            'created_at' => $comment->created_at
        ]);

        // Double-check the comment status after saving
        $savedComment = Comment::find($comment->id);
        Log::info('Comment status after retrieving from database:', [
            'id' => $savedComment->id,
            'is_approved' => $savedComment->is_approved,
            'is_flagged' => $savedComment->is_flagged,
        ]);

        // If the comment needs approval, notify admins
        if (!$comment->is_approved) {
            try {
                // Notify admins about the new comment
                $admins = User::where('role', 'admin')->get();
                if ($admins->count() > 0) {
                    Notification::send($admins, new NewCommentSubmission($comment));
                    Log::info('Notifications sent to ' . $admins->count() . ' admins for comment: ' . $comment->id);
                } else {
                    Log::warning('No admins found to notify about new comment: ' . $comment->id);
                }
            } catch (\Exception $e) {
                // Log the error but don't fail the request
                Log::error('Failed to send notifications for comment submission: ' . $e->getMessage());
            }
        }

        // Return the comment with user data
        return response()->json([
            'comment' => Comment::with('user')->find($comment->id),
            'message' => __('comments.messages.added'),
        ]);
    }

    /**
     * Display the specified comment with its replies.
     */
    public function show(string $id)
    {
        $comment = Comment::with(['user', 'replies.user'])
            ->findOrFail($id);

        // Only show approved comments unless user is admin/moderator
        if (!$comment->is_approved &&
            !(Auth::check() && (Auth::user()->role === 'admin' || Auth::user()->role === 'moderator'))) {
            abort(404);
        }

        return response()->json([
            'comment' => $comment,
        ]);
    }

    /**
     * Show the form for editing the specified comment.
     * Not used in API-based implementation.
     */
    public function edit(string $id)
    {
        abort(404);
    }

    /**
     * Update the specified comment.
     */
    public function update(Request $request, string $id)
    {
        $comment = Comment::findOrFail($id);

        // Check if the user is authorized to update this comment
        if (Auth::id() !== $comment->user_id &&
            !(Auth::user()->role === 'admin' || Auth::user()->role === 'moderator')) {
            abort(403, 'Unauthorized action.');
        }

        // Validate the request
        $validated = $request->validate([
            'content' => 'required|string|max:1000',
        ]);

        // Update the comment
        $comment->content = $validated['content'];

        // If a moderator or admin is editing, they can approve it
        if ((Auth::user()->role === 'admin' || Auth::user()->role === 'moderator') &&
            $request->has('is_approved')) {
            $comment->is_approved = $request->boolean('is_approved');
        }

        $comment->save();

        return response()->json([
            'comment' => $comment->fresh(['user', 'replies.user']),
            'message' => __('comments.messages.updated'),
        ]);
    }

    /**
     * Remove the specified comment.
     */
    public function destroy(string $id)
    {
        $comment = Comment::findOrFail($id);

        // Check if the user is authorized to delete this comment
        if (Auth::id() !== $comment->user_id &&
            !(Auth::user()->role === 'admin' || Auth::user()->role === 'moderator')) {
            abort(403, 'Unauthorized action.');
        }

        // Delete the comment
        $comment->delete();

        return response()->json([
            'message' => __('comments.messages.deleted'),
        ]);
    }

    /**
     * Flag a comment as inappropriate.
     */
    public function flag(Request $request, string $id)
    {
        $comment = Comment::findOrFail($id);

        // Validate the request
        $validated = $request->validate([
            'flag_reason' => 'required|string|max:255',
        ]);

        // Flag the comment
        $comment->is_flagged = true;
        $comment->flag_reason = $validated['flag_reason'];
        $comment->save();

        return response()->json([
            'message' => __('comments.messages.flagged'),
        ]);
    }

    /**
     * Approve a comment.
     */
    public function approve(string $id)
    {
        $comment = Comment::findOrFail($id);

        // Check if the user is authorized to approve comments
        if (!(Auth::user()->role === 'admin' || Auth::user()->role === 'moderator')) {
            abort(403, 'Unauthorized action.');
        }

        // Approve the comment
        $comment->is_approved = true;
        $comment->is_flagged = false;
        $comment->flag_reason = null;
        $comment->save();

        // Notify the user that their comment was approved
        $comment->user->notify(new \App\Notifications\CommentApproved($comment));

        return response()->json([
            'comment' => $comment->fresh(['user']),
            'message' => __('comments.messages.approved'),
        ]);
    }

    /**
     * Reject a comment.
     */
    public function reject(Request $request, string $id)
    {
        $comment = Comment::findOrFail($id);

        // Check if the user is authorized to reject comments
        if (!(Auth::user()->role === 'admin' || Auth::user()->role === 'moderator')) {
            abort(403, 'Unauthorized action.');
        }

        // Validate the request
        $validated = $request->validate([
            'reason' => 'nullable|string|max:1000',
        ]);

        // Reject the comment
        $comment->is_approved = false;
        $comment->is_flagged = true;  // Set is_flagged to true for rejected comments

        if ($request->filled('reason')) {
            $comment->flag_reason = $validated['reason'];
        } else {
            // Set a default reason if none provided
            $comment->flag_reason = 'Rejected by moderator';
        }

        $comment->save();

        // Log the update for debugging
        \Illuminate\Support\Facades\Log::info('Comment rejected via API:', [
            'id' => $comment->id,
            'user_id' => $comment->user_id,
            'jeu_id' => $comment->jeu_id,
            'is_approved' => $comment->is_approved,
            'is_flagged' => $comment->is_flagged,
            'reason' => $comment->flag_reason,
        ]);

        // Notify the user that their comment was rejected
        $comment->user->notify(new \App\Notifications\CommentRejected($comment, $request->input('reason')));

        return response()->json([
            'comment' => $comment->fresh(['user']),
            'message' => __('comments.messages.rejected'),
        ]);
    }
}
