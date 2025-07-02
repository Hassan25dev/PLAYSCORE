<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Evaluation;
use App\Notifications\EvaluationApproved;
use App\Notifications\EvaluationRejected;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class ReviewModerationController extends Controller
{
    /**
     * Create a new controller instance.
     */
    public function __construct()
    {
        $this->middleware(['auth', 'verified', 'role:admin']);
    }

    /**
     * Display a listing of reviews pending moderation.
     */
    public function index()
    {
        // Log all evaluations for debugging
        \Illuminate\Support\Facades\Log::info('All evaluations: ' . Evaluation::count());

        // Log evaluations with comments
        \Illuminate\Support\Facades\Log::info('Evaluations with comments: ' .
            Evaluation::whereNotNull('commentaire')->count());

        // Log evaluations with is_approved=false
        \Illuminate\Support\Facades\Log::info('Evaluations with is_approved=false: ' .
            Evaluation::where('is_approved', false)->count());

        // Log evaluations with is_flagged=false
        \Illuminate\Support\Facades\Log::info('Evaluations with is_flagged=false: ' .
            Evaluation::where('is_flagged', false)->count());

        // Log the combined query
        \Illuminate\Support\Facades\Log::info('Evaluations with is_approved=false AND is_flagged=false: ' .
            Evaluation::where('is_approved', false)->where('is_flagged', false)->count());

        // Get pending reviews
        $pendingReviews = Evaluation::where('is_approved', false)
            ->where('is_flagged', false)
            ->whereNotNull('commentaire') // Only get reviews with comments
            ->with(['utilisateur', 'jeu'])
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        // Log the pending reviews for debugging
        \Illuminate\Support\Facades\Log::info('Pending reviews: ' . json_encode($pendingReviews));

        // Get counts for different statuses
        $counts = [
            'pending' => Evaluation::where('is_approved', false)
                ->where('is_flagged', false)
                ->whereNotNull('commentaire')
                ->count(),
            'approved' => Evaluation::where('is_approved', true)
                ->whereNotNull('commentaire')
                ->count(),
            'flagged' => Evaluation::where('is_flagged', true)
                ->whereNotNull('commentaire')
                ->count(),
            'total' => Evaluation::whereNotNull('commentaire')->count(),
        ];

        // Log the counts for debugging
        \Illuminate\Support\Facades\Log::info('Review counts: ' . json_encode($counts));

        return Inertia::render('Admin/ReviewModeration/Index', [
            'pendingReviews' => $pendingReviews,
            'counts' => $counts,
        ]);
    }

    /**
     * Display the specified review for moderation.
     */
    public function show(string $id)
    {
        // Parse the composite ID (format: utilisateur_id_jeu_id)
        $parts = explode('_', $id);

        if (count($parts) !== 2 || !is_numeric($parts[0]) || !is_numeric($parts[1])) {
            abort(404, 'Invalid review ID format');
        }

        $userId = (int)$parts[0];
        $gameId = (int)$parts[1];

        // Find the review using the composite key
        $review = Evaluation::where('utilisateur_id', $userId)
            ->where('jeu_id', $gameId)
            ->whereNotNull('commentaire') // Only get reviews with comments
            ->with(['utilisateur', 'jeu'])
            ->firstOrFail();

        // Log the review details for debugging
        \Illuminate\Support\Facades\Log::info('Found review:', [
            'id' => $review->id,
            'utilisateur_id' => $review->utilisateur_id,
            'jeu_id' => $review->jeu_id,
            'is_approved' => $review->is_approved,
            'is_flagged' => $review->is_flagged,
        ]);

        return Inertia::render('Admin/ReviewModeration/Show', [
            'review' => $review,
        ]);
    }

    /**
     * Update the specified review's moderation status.
     */
    public function update(Request $request, string $id)
    {
        // Parse the composite ID (format: utilisateur_id_jeu_id)
        $parts = explode('_', $id);

        if (count($parts) !== 2 || !is_numeric($parts[0]) || !is_numeric($parts[1])) {
            abort(404, 'Invalid review ID format');
        }

        $userId = (int)$parts[0];
        $gameId = (int)$parts[1];

        // Find the review using the composite key
        $review = Evaluation::where('utilisateur_id', $userId)
            ->where('jeu_id', $gameId)
            ->whereNotNull('commentaire') // Only get reviews with comments
            ->firstOrFail();

        $validated = $request->validate([
            'action' => 'required|string|in:approve,reject',
            'reason' => 'nullable|string|max:1000',
        ]);

        if ($validated['action'] === 'approve') {
            // Approve the review
            $review->is_approved = true;
            $review->is_flagged = false;
            $review->flag_reason = null;
            $review->save();

            // Log the update for debugging
            Log::info('Review approved:', [
                'id' => $review->id,
                'utilisateur_id' => $review->utilisateur_id,
                'jeu_id' => $review->jeu_id,
                'is_approved' => $review->is_approved,
                'is_flagged' => $review->is_flagged,
            ]);

            // Notify the user that their evaluation was approved
            try {
                $review->utilisateur->notify(new EvaluationApproved($review));
                Log::info('Evaluation approval notification sent to user: ' . $review->utilisateur->id);
            } catch (\Exception $e) {
                Log::error('Failed to send evaluation approval notification: ' . $e->getMessage());
            }

            return redirect()->route('admin.review-moderation.index')
                ->with('success', __('admin.review_moderation.review_approved'));
        }
        elseif ($validated['action'] === 'reject') {
            // Reject the review
            $review->is_approved = false;
            $review->is_flagged = true;

            if ($request->filled('reason')) {
                $review->flag_reason = $validated['reason'];
            } else {
                // Set a default reason if none provided
                $review->flag_reason = 'Rejected by moderator';
            }

            $review->save();

            // Log the update for debugging
            Log::info('Review rejected:', [
                'id' => $review->id,
                'utilisateur_id' => $review->utilisateur_id,
                'jeu_id' => $review->jeu_id,
                'is_approved' => $review->is_approved,
                'is_flagged' => $review->is_flagged,
                'reason' => $review->flag_reason,
            ]);

            // Notify the user that their evaluation was rejected
            try {
                $review->utilisateur->notify(new EvaluationRejected($review, $review->flag_reason));
                Log::info('Evaluation rejection notification sent to user: ' . $review->utilisateur->id);
            } catch (\Exception $e) {
                Log::error('Failed to send evaluation rejection notification: ' . $e->getMessage());
            }

            return redirect()->route('admin.review-moderation.index')
                ->with('success', __('admin.review_moderation.review_rejected'));
        }

        return redirect()->route('admin.review-moderation.index')
            ->with('error', __('admin.messages.operation_failed'));
    }

    /**
     * Remove the specified review.
     */
    public function destroy(string $id)
    {
        // Parse the composite ID (format: utilisateur_id_jeu_id)
        $parts = explode('_', $id);

        if (count($parts) !== 2 || !is_numeric($parts[0]) || !is_numeric($parts[1])) {
            abort(404, 'Invalid review ID format');
        }

        $userId = (int)$parts[0];
        $gameId = (int)$parts[1];

        // Find the review using the composite key
        $review = Evaluation::where('utilisateur_id', $userId)
            ->where('jeu_id', $gameId)
            ->whereNotNull('commentaire') // Only get reviews with comments
            ->firstOrFail();

        // Log before deletion
        \Illuminate\Support\Facades\Log::info('Deleting review:', [
            'id' => $review->id,
            'utilisateur_id' => $review->utilisateur_id,
            'jeu_id' => $review->jeu_id,
        ]);

        $review->delete();

        return redirect()->route('admin.review-moderation.index')
            ->with('success', __('admin.review_moderation.review_deleted'));
    }

    /**
     * Display a list of flagged reviews.
     */
    public function flagged()
    {
        $flaggedReviews = Evaluation::where('is_flagged', true)
            ->whereNotNull('commentaire') // Only get reviews with comments
            ->with(['utilisateur', 'jeu'])
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        // Log the flagged reviews for debugging
        \Illuminate\Support\Facades\Log::info('Flagged reviews count: ' . $flaggedReviews->total());

        return Inertia::render('Admin/ReviewModeration/Flagged', [
            'flaggedReviews' => $flaggedReviews,
        ]);
    }

    /**
     * Display a list of approved reviews.
     */
    public function approved()
    {
        $approvedReviews = Evaluation::where('is_approved', true)
            ->whereNotNull('commentaire') // Only get reviews with comments
            ->with(['utilisateur', 'jeu'])
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        // Log the approved reviews for debugging
        \Illuminate\Support\Facades\Log::info('Approved reviews count: ' . $approvedReviews->total());

        return Inertia::render('Admin/ReviewModeration/Approved', [
            'approvedReviews' => $approvedReviews,
        ]);
    }
}
