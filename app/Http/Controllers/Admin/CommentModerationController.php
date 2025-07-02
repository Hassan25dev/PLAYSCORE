<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Comment;
use App\Models\Evaluation;
use App\Models\Jeu;
use App\Models\User;
use App\Notifications\CommentApproved;
use App\Notifications\CommentRejected;
use App\Notifications\EvaluationApproved;
use App\Notifications\EvaluationRejected;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class CommentModerationController extends Controller
{
    /**
     * Create a new controller instance.
     */
    public function __construct()
    {
        $this->middleware(['auth', 'verified', 'role:admin,moderator']);
    }

    /**
     * Display a listing of comments pending moderation.
     */
    public function index()
    {
        // Log all comments for debugging
        Log::info('All comments: ' . Comment::count());
        Log::info('All evaluations with comments: ' . Evaluation::whereNotNull('commentaire')->count());

        // Get all comments for detailed inspection
        $allComments = Comment::orderBy('created_at', 'desc')->take(10)->get();
        Log::info('Recent comments details:', $allComments->map(function($comment) {
            return [
                'id' => $comment->id,
                'user_id' => $comment->user_id,
                'user_name' => $comment->user ? $comment->user->name : 'Unknown',
                'jeu_id' => $comment->jeu_id,
                'content' => substr($comment->content, 0, 50) . (strlen($comment->content) > 50 ? '...' : ''),
                'is_approved' => $comment->is_approved,
                'is_flagged' => $comment->is_flagged,
                'created_at' => $comment->created_at
            ];
        })->toArray());

        // Get recent evaluations with comments for inspection
        $recentEvaluations = Evaluation::whereNotNull('commentaire')
            ->orderBy('created_at', 'desc')
            ->take(10)
            ->get();
        Log::info('Recent evaluations with comments:', $recentEvaluations->map(function($eval) {
            $user = User::find($eval->utilisateur_id);
            $jeu = Jeu::find($eval->jeu_id);
            return [
                'id' => $eval->id,
                'utilisateur_id' => $eval->utilisateur_id,
                'user_name' => $user ? $user->name : 'Unknown',
                'jeu_id' => $eval->jeu_id,
                'jeu_title' => $jeu ? $jeu->titre : 'Unknown',
                'note' => $eval->note,
                'commentaire' => substr($eval->commentaire, 0, 50) . (strlen($eval->commentaire) > 50 ? '...' : ''),
                'is_approved' => $eval->is_approved,
                'is_flagged' => $eval->is_flagged,
                'created_at' => $eval->created_at
            ];
        })->toArray());

        // Log counts for debugging
        Log::info('Comments with is_approved=false: ' . Comment::where('is_approved', false)->count());
        Log::info('Evaluations with is_approved=false: ' . Evaluation::where('is_approved', false)->whereNotNull('commentaire')->count());

        // Get pending comments from the comments table
        $pendingComments = Comment::where('is_approved', false)
            ->with(['user', 'jeu'])
            ->orderBy('created_at', 'desc')
            ->get();

        // Get pending evaluations with comments
        $pendingEvaluations = Evaluation::where('is_approved', false)
            ->whereNotNull('commentaire')
            ->orderBy('created_at', 'desc')
            ->get();

        // Convert evaluations to a format compatible with comments
        $convertedEvaluations = $pendingEvaluations->map(function($eval) {
            $user = User::find($eval->utilisateur_id);
            $jeu = Jeu::find($eval->jeu_id);

            // Create a comment-like object from the evaluation
            return (object)[
                'id' => 'eval_' . $eval->utilisateur_id . '_' . $eval->jeu_id, // Create a unique ID
                'user_id' => $eval->utilisateur_id,
                'user' => $user,
                'jeu_id' => $eval->jeu_id,
                'jeu' => $jeu,
                'content' => '[Rating: ' . $eval->note . '/5] ' . $eval->commentaire,
                'is_approved' => $eval->is_approved,
                'is_flagged' => $eval->is_flagged,
                'created_at' => $eval->created_at,
                'is_evaluation' => true, // Flag to identify this as an evaluation
            ];
        });

        // Merge comments and evaluations
        $allPendingItems = $pendingComments->concat($convertedEvaluations)
            ->sortByDesc('created_at')
            ->values(); // Re-index the collection

        // Paginate the merged collection manually
        $page = request()->input('page', 1);
        $perPage = 10;
        $total = $allPendingItems->count();
        $items = $allPendingItems->forPage($page, $perPage);

        // Create a custom paginator
        $pendingItems = new \Illuminate\Pagination\LengthAwarePaginator(
            $items,
            $total,
            $perPage,
            $page,
            ['path' => request()->url(), 'query' => request()->query()]
        );

        // Generate pagination links
        $pendingItems->withPath(request()->url());
        $pendingItems->appends(request()->query());

        // Convert to array to ensure proper serialization for Inertia
        $pendingItemsArray = [
            'data' => $items->values()->toArray(),
            'links' => $pendingItems->linkCollection()->toArray(),
            'current_page' => $pendingItems->currentPage(),
            'from' => $pendingItems->firstItem(),
            'to' => $pendingItems->lastItem(),
            'total' => $pendingItems->total(),
            'per_page' => $pendingItems->perPage(),
            'last_page' => $pendingItems->lastPage(),
        ];

        // Log the combined pending items
        Log::info('Combined pending items count: ' . $total);

        // Get counts for different statuses - include both comments and evaluations
        $counts = [
            'pending' => Comment::where('is_approved', false)->count() +
                         Evaluation::where('is_approved', false)->whereNotNull('commentaire')->count(),
            'approved' => Comment::where('is_approved', true)->count() +
                          Evaluation::where('is_approved', true)->whereNotNull('commentaire')->count(),
            'flagged' => Comment::where('is_flagged', true)->count() +
                         Evaluation::where('is_flagged', true)->whereNotNull('commentaire')->count(),
            'total' => Comment::count() + Evaluation::whereNotNull('commentaire')->count(),
        ];

        // Log the counts for debugging
        Log::info('Combined counts: ' . json_encode($counts));

        return Inertia::render('Admin/CommentModeration/Index', [
            'pendingComments' => $pendingItemsArray, // Use the formatted array for Inertia
            'counts' => $counts,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     * Not used in this controller.
     */
    public function create()
    {
        abort(404);
    }

    /**
     * Store a newly created resource in storage.
     * Not used in this controller.
     */
    public function store(Request $request)
    {
        abort(404);
    }

    /**
     * Display the specified comment or evaluation for moderation.
     */
    public function show(string $id)
    {
        // Check if this is an evaluation ID (format: eval_user_id_game_id)
        if (strpos($id, 'eval_') === 0) {
            // Parse the evaluation ID
            $parts = explode('_', $id);
            if (count($parts) !== 3) {
                abort(404, 'Invalid evaluation ID format');
            }

            $userId = (int)$parts[1];
            $gameId = (int)$parts[2];

            // Find the evaluation
            $evaluation = Evaluation::where('utilisateur_id', $userId)
                ->where('jeu_id', $gameId)
                ->whereNotNull('commentaire')
                ->first();

            if (!$evaluation) {
                abort(404, 'Evaluation not found');
            }

            // Get the user and game
            $user = User::find($userId);
            $jeu = Jeu::find($gameId);

            // Convert to a comment-like format for the view
            $comment = (object)[
                'id' => $id,
                'user_id' => $userId,
                'user' => $user,
                'jeu_id' => $gameId,
                'jeu' => $jeu,
                'content' => '[Rating: ' . $evaluation->note . '/5] ' . $evaluation->commentaire,
                'is_approved' => $evaluation->is_approved,
                'is_flagged' => $evaluation->is_flagged,
                'flag_reason' => $evaluation->flag_reason,
                'created_at' => $evaluation->created_at,
                'is_evaluation' => true,
                'evaluation' => $evaluation,
            ];
        } else {
            // Regular comment
            $comment = Comment::with(['user', 'jeu', 'parent', 'replies.user'])
                ->findOrFail($id);
        }

        return Inertia::render('Admin/CommentModeration/Show', [
            'comment' => $comment,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     * Not used in this controller.
     */
    public function edit(string $id)
    {
        abort(404);
    }

    /**
     * Update the specified comment or evaluation's moderation status.
     */
    public function update(Request $request, string $id)
    {
        $validated = $request->validate([
            'action' => 'required|string|in:approve,reject',
            'reason' => 'nullable|string|max:1000',
        ]);

        // Check if this is an evaluation ID (format: eval_user_id_game_id)
        if (strpos($id, 'eval_') === 0) {
            // Parse the evaluation ID
            $parts = explode('_', $id);
            if (count($parts) !== 3) {
                abort(404, 'Invalid evaluation ID format');
            }

            $userId = (int)$parts[1];
            $gameId = (int)$parts[2];

            // Find the evaluation
            $evaluation = Evaluation::where('utilisateur_id', $userId)
                ->where('jeu_id', $gameId)
                ->whereNotNull('commentaire')
                ->first();

            if (!$evaluation) {
                abort(404, 'Evaluation not found');
            }

            if ($validated['action'] === 'approve') {
                // Approve the evaluation
                $evaluation->is_approved = true;
                $evaluation->is_flagged = false;
                $evaluation->flag_reason = null;
                $evaluation->save();

                Log::info('Evaluation approved:', [
                    'user_id' => $evaluation->utilisateur_id,
                    'jeu_id' => $evaluation->jeu_id,
                    'is_approved' => $evaluation->is_approved,
                    'is_flagged' => $evaluation->is_flagged,
                ]);

                // Notify the user that their evaluation was approved
                try {
                    $user = User::find($evaluation->utilisateur_id);
                    if ($user) {
                        $user->notify(new EvaluationApproved($evaluation));
                        Log::info('Evaluation approval notification sent to user:', [
                            'user_id' => $user->id,
                            'user_name' => $user->name,
                            'evaluation_id' => $evaluation->utilisateur_id . '_' . $evaluation->jeu_id,
                        ]);
                    } else {
                        Log::warning('User not found for evaluation approval notification:', [
                            'user_id' => $evaluation->utilisateur_id,
                        ]);
                    }
                } catch (\Exception $e) {
                    Log::error('Failed to send evaluation approval notification: ' . $e->getMessage(), [
                        'user_id' => $evaluation->utilisateur_id,
                        'evaluation_id' => $evaluation->utilisateur_id . '_' . $evaluation->jeu_id,
                    ]);
                }

                return redirect()->route('admin.comment-moderation.index')
                    ->with('success', __('admin.comment_moderation.comment_approved'));
            }
            elseif ($validated['action'] === 'reject') {
                // Reject the evaluation
                $evaluation->is_approved = false;
                $evaluation->is_flagged = true;

                if ($request->filled('reason')) {
                    $evaluation->flag_reason = $validated['reason'];
                } else {
                    // Set a default reason if none provided
                    $evaluation->flag_reason = 'Rejected by moderator';
                }

                $evaluation->save();

                Log::info('Evaluation rejected:', [
                    'user_id' => $evaluation->utilisateur_id,
                    'jeu_id' => $evaluation->jeu_id,
                    'is_approved' => $evaluation->is_approved,
                    'is_flagged' => $evaluation->is_flagged,
                    'reason' => $evaluation->flag_reason,
                ]);

                // Notify the user that their evaluation was rejected
                try {
                    $user = User::find($evaluation->utilisateur_id);
                    if ($user) {
                        $user->notify(new EvaluationRejected($evaluation, $evaluation->flag_reason));
                        Log::info('Evaluation rejection notification sent to user:', [
                            'user_id' => $user->id,
                            'user_name' => $user->name,
                            'evaluation_id' => $evaluation->utilisateur_id . '_' . $evaluation->jeu_id,
                            'reason' => $evaluation->flag_reason,
                        ]);
                    } else {
                        Log::warning('User not found for evaluation rejection notification:', [
                            'user_id' => $evaluation->utilisateur_id,
                        ]);
                    }
                } catch (\Exception $e) {
                    Log::error('Failed to send evaluation rejection notification: ' . $e->getMessage(), [
                        'user_id' => $evaluation->utilisateur_id,
                        'evaluation_id' => $evaluation->utilisateur_id . '_' . $evaluation->jeu_id,
                    ]);
                }

                return redirect()->route('admin.comment-moderation.index')
                    ->with('success', __('admin.comment_moderation.comment_rejected'));
            }
        } else {
            // Regular comment
            $comment = Comment::findOrFail($id);

            if ($validated['action'] === 'approve') {
                // Approve the comment
                $comment->is_approved = true;
                $comment->is_flagged = false;
                $comment->flag_reason = null;
                $comment->save();

                Log::info('Comment approved:', [
                    'id' => $comment->id,
                    'user_id' => $comment->user_id,
                    'jeu_id' => $comment->jeu_id,
                    'is_approved' => $comment->is_approved,
                    'is_flagged' => $comment->is_flagged,
                ]);

                // Notify the user that their comment was approved
                try {
                    $comment->user->notify(new CommentApproved($comment));
                    Log::info('Comment approval notification sent to user:', [
                        'user_id' => $comment->user_id,
                        'user_name' => $comment->user->name,
                        'comment_id' => $comment->id,
                    ]);
                } catch (\Exception $e) {
                    Log::error('Failed to send comment approval notification: ' . $e->getMessage(), [
                        'user_id' => $comment->user_id,
                        'comment_id' => $comment->id,
                    ]);
                }

                return redirect()->route('admin.comment-moderation.index')
                    ->with('success', __('admin.comment_moderation.comment_approved'));
            }
            elseif ($validated['action'] === 'reject') {
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
                Log::info('Comment rejected:', [
                    'id' => $comment->id,
                    'user_id' => $comment->user_id,
                    'jeu_id' => $comment->jeu_id,
                    'is_approved' => $comment->is_approved,
                    'is_flagged' => $comment->is_flagged,
                    'reason' => $comment->flag_reason,
                ]);

                // Notify the user that their comment was rejected
                try {
                    $comment->user->notify(new CommentRejected($comment, $comment->flag_reason));
                    Log::info('Comment rejection notification sent to user:', [
                        'user_id' => $comment->user_id,
                        'user_name' => $comment->user->name,
                        'comment_id' => $comment->id,
                        'reason' => $comment->flag_reason,
                    ]);
                } catch (\Exception $e) {
                    Log::error('Failed to send comment rejection notification: ' . $e->getMessage(), [
                        'user_id' => $comment->user_id,
                        'comment_id' => $comment->id,
                    ]);
                }

                return redirect()->route('admin.comment-moderation.index')
                    ->with('success', __('admin.comment_moderation.comment_rejected'));
            }
        }

        return redirect()->route('admin.comment-moderation.index')
            ->with('error', __('admin.messages.operation_failed'));
    }

    /**
     * Remove the specified comment or evaluation.
     */
    public function destroy(string $id)
    {
        // Check if this is an evaluation ID (format: eval_user_id_game_id)
        if (strpos($id, 'eval_') === 0) {
            // Parse the evaluation ID
            $parts = explode('_', $id);
            if (count($parts) !== 3) {
                abort(404, 'Invalid evaluation ID format');
            }

            $userId = (int)$parts[1];
            $gameId = (int)$parts[2];

            // Find the evaluation
            $evaluation = Evaluation::where('utilisateur_id', $userId)
                ->where('jeu_id', $gameId)
                ->whereNotNull('commentaire')
                ->first();

            if (!$evaluation) {
                abort(404, 'Evaluation not found');
            }

            // Clear the comment but keep the rating
            $evaluation->commentaire = null;
            $evaluation->is_approved = true; // Auto-approve the rating without comment
            $evaluation->is_flagged = false;
            $evaluation->flag_reason = null;
            $evaluation->save();

            Log::info('Evaluation comment removed:', [
                'user_id' => $evaluation->utilisateur_id,
                'jeu_id' => $evaluation->jeu_id,
            ]);
        } else {
            // Regular comment
            $comment = Comment::findOrFail($id);
            $comment->delete();

            Log::info('Comment deleted:', [
                'id' => $id,
            ]);
        }

        return redirect()->route('admin.comment-moderation.index')
            ->with('success', __('admin.comment_moderation.comment_deleted'));
    }

    /**
     * Display a list of flagged comments and evaluations.
     */
    public function flagged()
    {
        // Get flagged comments
        $flaggedComments = Comment::where('is_flagged', true)
            ->with(['user', 'jeu'])
            ->orderBy('created_at', 'desc')
            ->get();

        // Get flagged evaluations with comments
        $flaggedEvaluations = Evaluation::where('is_flagged', true)
            ->whereNotNull('commentaire')
            ->orderBy('created_at', 'desc')
            ->get();

        // Convert evaluations to a format compatible with comments
        $convertedEvaluations = $flaggedEvaluations->map(function($eval) {
            $user = User::find($eval->utilisateur_id);
            $jeu = Jeu::find($eval->jeu_id);

            // Create a comment-like object from the evaluation
            return (object)[
                'id' => 'eval_' . $eval->utilisateur_id . '_' . $eval->jeu_id, // Create a unique ID
                'user_id' => $eval->utilisateur_id,
                'user' => $user,
                'jeu_id' => $eval->jeu_id,
                'jeu' => $jeu,
                'content' => '[Rating: ' . $eval->note . '/5] ' . $eval->commentaire,
                'is_approved' => $eval->is_approved,
                'is_flagged' => $eval->is_flagged,
                'flag_reason' => $eval->flag_reason,
                'created_at' => $eval->created_at,
                'is_evaluation' => true, // Flag to identify this as an evaluation
            ];
        });

        // Merge comments and evaluations
        $allFlaggedItems = $flaggedComments->concat($convertedEvaluations)
            ->sortByDesc('created_at')
            ->values(); // Re-index the collection

        // Paginate the merged collection manually
        $page = request()->input('page', 1);
        $perPage = 10;
        $total = $allFlaggedItems->count();
        $items = $allFlaggedItems->forPage($page, $perPage);

        // Create a custom paginator
        $flaggedItems = new \Illuminate\Pagination\LengthAwarePaginator(
            $items,
            $total,
            $perPage,
            $page,
            ['path' => request()->url(), 'query' => request()->query()]
        );

        // Generate pagination links
        $flaggedItems->withPath(request()->url());
        $flaggedItems->appends(request()->query());

        // Convert to array to ensure proper serialization for Inertia
        $flaggedItemsArray = [
            'data' => $items->values()->toArray(),
            'links' => $flaggedItems->linkCollection()->toArray(),
            'current_page' => $flaggedItems->currentPage(),
            'from' => $flaggedItems->firstItem(),
            'to' => $flaggedItems->lastItem(),
            'total' => $flaggedItems->total(),
            'per_page' => $flaggedItems->perPage(),
            'last_page' => $flaggedItems->lastPage(),
        ];

        // Get counts for different statuses - include both comments and evaluations
        $counts = [
            'pending' => Comment::where('is_approved', false)->count() +
                         Evaluation::where('is_approved', false)->whereNotNull('commentaire')->count(),
            'approved' => Comment::where('is_approved', true)->count() +
                          Evaluation::where('is_approved', true)->whereNotNull('commentaire')->count(),
            'flagged' => Comment::where('is_flagged', true)->count() +
                         Evaluation::where('is_flagged', true)->whereNotNull('commentaire')->count(),
            'total' => Comment::count() + Evaluation::whereNotNull('commentaire')->count(),
        ];

        return Inertia::render('Admin/CommentModeration/Flagged', [
            'flaggedComments' => $flaggedItemsArray, // Use the formatted array for Inertia
            'counts' => $counts,
        ]);
    }

    /**
     * Display a list of approved comments and evaluations.
     */
    public function approved()
    {
        // Get approved comments
        $approvedComments = Comment::where('is_approved', true)
            ->with(['user', 'jeu'])
            ->orderBy('created_at', 'desc')
            ->get();

        // Get approved evaluations with comments
        $approvedEvaluations = Evaluation::where('is_approved', true)
            ->whereNotNull('commentaire')
            ->orderBy('created_at', 'desc')
            ->get();

        // Convert evaluations to a format compatible with comments
        $convertedEvaluations = $approvedEvaluations->map(function($eval) {
            $user = User::find($eval->utilisateur_id);
            $jeu = Jeu::find($eval->jeu_id);

            // Create a comment-like object from the evaluation
            return (object)[
                'id' => 'eval_' . $eval->utilisateur_id . '_' . $eval->jeu_id, // Create a unique ID
                'user_id' => $eval->utilisateur_id,
                'user' => $user,
                'jeu_id' => $eval->jeu_id,
                'jeu' => $jeu,
                'content' => '[Rating: ' . $eval->note . '/5] ' . $eval->commentaire,
                'is_approved' => $eval->is_approved,
                'is_flagged' => $eval->is_flagged,
                'flag_reason' => $eval->flag_reason,
                'created_at' => $eval->created_at,
                'is_evaluation' => true, // Flag to identify this as an evaluation
            ];
        });

        // Merge comments and evaluations
        $allApprovedItems = $approvedComments->concat($convertedEvaluations)
            ->sortByDesc('created_at')
            ->values(); // Re-index the collection

        // Paginate the merged collection manually
        $page = request()->input('page', 1);
        $perPage = 10;
        $total = $allApprovedItems->count();
        $items = $allApprovedItems->forPage($page, $perPage);

        // Create a custom paginator
        $approvedItems = new \Illuminate\Pagination\LengthAwarePaginator(
            $items,
            $total,
            $perPage,
            $page,
            ['path' => request()->url(), 'query' => request()->query()]
        );

        // Generate pagination links
        $approvedItems->withPath(request()->url());
        $approvedItems->appends(request()->query());

        // Convert to array to ensure proper serialization for Inertia
        $approvedItemsArray = [
            'data' => $items->values()->toArray(),
            'links' => $approvedItems->linkCollection()->toArray(),
            'current_page' => $approvedItems->currentPage(),
            'from' => $approvedItems->firstItem(),
            'to' => $approvedItems->lastItem(),
            'total' => $approvedItems->total(),
            'per_page' => $approvedItems->perPage(),
            'last_page' => $approvedItems->lastPage(),
        ];

        // Get counts for different statuses - include both comments and evaluations
        $counts = [
            'pending' => Comment::where('is_approved', false)->count() +
                         Evaluation::where('is_approved', false)->whereNotNull('commentaire')->count(),
            'approved' => Comment::where('is_approved', true)->count() +
                          Evaluation::where('is_approved', true)->whereNotNull('commentaire')->count(),
            'flagged' => Comment::where('is_flagged', true)->count() +
                         Evaluation::where('is_flagged', true)->whereNotNull('commentaire')->count(),
            'total' => Comment::count() + Evaluation::whereNotNull('commentaire')->count(),
        ];

        return Inertia::render('Admin/CommentModeration/Approved', [
            'approvedComments' => $approvedItemsArray, // Use the formatted array for Inertia
            'counts' => $counts,
        ]);
    }
}
