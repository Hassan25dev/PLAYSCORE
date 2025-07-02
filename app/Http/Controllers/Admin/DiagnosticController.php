<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Comment;
use App\Models\Evaluation;
use App\Models\Jeu;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class DiagnosticController extends Controller
{
    /**
     * Create a new controller instance.
     */
    public function __construct()
    {
        $this->middleware(['auth', 'verified', 'role:admin']);
    }

    /**
     * Display diagnostic information about comments.
     */
    public function comments()
    {
        // Get all comments
        $allComments = Comment::with(['user', 'jeu'])->get();

        // Get pending comments
        $pendingComments = Comment::where('is_approved', false)
            ->where('is_flagged', false)
            ->with(['user', 'jeu'])
            ->get();

        // Get flagged comments
        $flaggedComments = Comment::where('is_flagged', true)
            ->with(['user', 'jeu'])
            ->get();

        // Get approved comments
        $approvedComments = Comment::where('is_approved', true)
            ->with(['user', 'jeu'])
            ->get();

        return [
            'total_comments' => $allComments->count(),
            'pending_comments' => $pendingComments->count(),
            'flagged_comments' => $flaggedComments->count(),
            'approved_comments' => $approvedComments->count(),
            'comments_by_user' => $allComments->groupBy('user_id')->map(function ($comments) {
                return $comments->count();
            }),
            'comments_by_game' => $allComments->groupBy('jeu_id')->map(function ($comments) {
                return $comments->count();
            }),
            'recent_comments' => $allComments->sortByDesc('created_at')->take(10)->map(function ($comment) {
                return [
                    'id' => $comment->id,
                    'content' => $comment->content,
                    'user' => $comment->user ? $comment->user->name : 'Unknown',
                    'user_email' => $comment->user ? $comment->user->email : 'Unknown',
                    'game' => $comment->jeu ? $comment->jeu->titre : 'Unknown',
                    'is_approved' => $comment->is_approved,
                    'is_flagged' => $comment->is_flagged,
                    'created_at' => $comment->created_at->format('Y-m-d H:i:s'),
                ];
            }),
        ];
    }

    /**
     * Fix comments that might have issues.
     */
    public function fixComments()
    {
        // Get all comments
        $allComments = Comment::all();

        $fixedComments = [];
        $errors = [];

        foreach ($allComments as $comment) {
            try {
                // Check if the comment has a valid user
                if (!$comment->user_id || !User::find($comment->user_id)) {
                    $comment->delete();
                    $fixedComments[] = [
                        'id' => $comment->id,
                        'action' => 'deleted',
                        'reason' => 'Invalid user ID',
                    ];
                    continue;
                }

                // Check if the comment has a valid game
                if (!$comment->jeu_id || !Jeu::find($comment->jeu_id)) {
                    $comment->delete();
                    $fixedComments[] = [
                        'id' => $comment->id,
                        'action' => 'deleted',
                        'reason' => 'Invalid game ID',
                    ];
                    continue;
                }

                // Check if the comment has both is_approved and is_flagged set to true
                if ($comment->is_approved && $comment->is_flagged) {
                    $comment->is_flagged = false;
                    $comment->save();
                    $fixedComments[] = [
                        'id' => $comment->id,
                        'action' => 'updated',
                        'reason' => 'Both is_approved and is_flagged were true',
                    ];
                }
            } catch (\Exception $e) {
                $errors[] = [
                    'id' => $comment->id,
                    'error' => $e->getMessage(),
                ];
            }
        }

        return [
            'total_comments' => $allComments->count(),
            'fixed_comments' => $fixedComments,
            'errors' => $errors,
        ];
    }

    /**
     * Monitor comments for debugging purposes.
     */
    public function monitorComments()
    {
        // Get all comments
        $allComments = Comment::with(['user', 'jeu'])->get();

        // Log all comments for debugging
        Log::info('All comments: ' . $allComments->count());

        // Get pending comments
        $pendingComments = Comment::where('is_approved', false)
            ->where('is_flagged', false)
            ->with(['user', 'jeu'])
            ->get();

        // Get flagged comments
        $flaggedComments = Comment::where('is_flagged', true)
            ->with(['user', 'jeu'])
            ->get();

        // Get approved comments
        $approvedComments = Comment::where('is_approved', true)
            ->with(['user', 'jeu'])
            ->get();

        return [
            'total_comments' => $allComments->count(),
            'pending_comments' => $pendingComments->count(),
            'flagged_comments' => $flaggedComments->count(),
            'approved_comments' => $approvedComments->count(),
            'comments' => $allComments->map(function ($comment) {
                return [
                    'id' => $comment->id,
                    'content' => $comment->content,
                    'user' => $comment->user ? $comment->user->name : 'Unknown',
                    'user_email' => $comment->user ? $comment->user->email : 'Unknown',
                    'game' => $comment->jeu ? $comment->jeu->titre : 'Unknown',
                    'is_approved' => $comment->is_approved,
                    'is_flagged' => $comment->is_flagged,
                    'created_at' => $comment->created_at->format('Y-m-d H:i:s'),
                ];
            }),
            'pending_comments_list' => $pendingComments->map(function ($comment) {
                return [
                    'id' => $comment->id,
                    'content' => $comment->content,
                    'user' => $comment->user ? $comment->user->name : 'Unknown',
                    'user_email' => $comment->user ? $comment->user->email : 'Unknown',
                    'game' => $comment->jeu ? $comment->jeu->titre : 'Unknown',
                    'is_approved' => $comment->is_approved,
                    'is_flagged' => $comment->is_flagged,
                    'created_at' => $comment->created_at->format('Y-m-d H:i:s'),
                ];
            }),
        ];
    }
}
