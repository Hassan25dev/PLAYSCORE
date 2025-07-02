<?php

namespace App\Http\Controllers\Developer;

use App\Http\Controllers\Controller;
use App\Models\Jeu;
use App\Models\Comment;
use App\Models\Evaluation;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class DashboardController extends Controller
{
    /**
     * Create a new controller instance.
     */
    public function __construct()
    {
        $this->middleware(['auth', 'verified', 'role:developer']);
    }

    /**
     * Display the developer dashboard.
     */
    public function index()
    {
        $user = Auth::user();

        // Get counts for different statistics
        $submissions = Jeu::where('developpeur_id', $user->id)->get();
        $publishedGames = $submissions->where('statut', 'publie');

        // Calculate real metrics
        $totalComments = 0;
        $totalViews = 0;
        $totalRatings = 0;
        $sumRatings = 0;

        // Get all game IDs for this developer
        $gameIds = $publishedGames->pluck('id')->toArray();

        // Count all approved regular comments for all games by this developer
        $regularComments = Comment::whereIn('jeu_id', $gameIds)
            ->where('is_approved', true)
            ->count();

        // Count all approved evaluations with comments for all games by this developer
        $evaluationComments = Evaluation::whereIn('jeu_id', $gameIds)
            ->where('is_approved', true)
            ->whereNotNull('commentaire')
            ->count();

        // Total comments is the sum of regular comments and evaluation comments
        $totalComments = $regularComments + $evaluationComments;

        // Count all approved evaluations for all games by this developer
        $evaluations = Evaluation::whereIn('jeu_id', $gameIds)
            ->where('is_approved', true)
            ->get();

        $totalRatings = $evaluations->count();
        $sumRatings = $evaluations->sum('note');

        // Sum views from all published games
        foreach ($publishedGames as $game) {
            $totalViews += $game->views;
        }

        // Calculate average rating (avoid division by zero)
        $avgRating = $totalRatings > 0 ? round($sumRatings / $totalRatings, 1) : 0;

        $stats = [
            'total' => $submissions->count(),
            'pending' => $submissions->where('statut', 'en_attente')->count(),
            'published' => $publishedGames->count(),
            'rejected' => $submissions->where('statut', 'rejete')->count(),
            'drafts' => $submissions->where('statut', 'brouillon')->count(),
            'avg_rating' => $avgRating,
            'total_comments' => $totalComments,
            'total_views' => $totalViews,
        ];

        // Get recent activity
        $recentActivity = $this->getRecentActivity($user->id);

        return Inertia::render('Developer/Dashboard', [
            'stats' => $stats,
            'recentActivity' => $recentActivity,
        ]);
    }

    /**
     * Get recent activity for the dashboard.
     */
    private function getRecentActivity($userId)
    {
        // Get recent game submissions
        $recentGames = Jeu::where('developpeur_id', $userId)
            ->orderBy('created_at', 'desc')
            ->take(5)
            ->get()
            ->map(function ($game) {
                $description = '';
                $status = $game->statut;
                $link = route('game-submissions.show', $game->id);

                switch ($game->statut) {
                    case 'brouillon':
                        $description = __('developer.activity.draft_created');
                        break;
                    case 'en_attente':
                        $description = __('developer.activity.game_submitted');
                        break;
                    case 'publie':
                        $description = __('developer.activity.game_approved');
                        break;
                    case 'rejete':
                        $description = __('developer.activity.game_rejected');
                        break;
                }

                return [
                    'id' => $game->id,
                    'type' => 'game',
                    'title' => $game->titre,
                    'description' => $description,
                    'status' => $status,
                    'date' => $game->updated_at->diffForHumans(),
                    'link' => $link,
                ];
            });

        // Get ALL recent comments on developer's games (both approved and unapproved)
        $recentComments = Comment::whereHas('jeu', function ($query) use ($userId) {
                $query->where('developpeur_id', $userId);
            })
            ->orderBy('created_at', 'desc')
            ->take(5)
            ->get()
            ->map(function ($comment) {
                $status = $comment->is_approved ? 'approved' : ($comment->is_flagged ? 'flagged' : 'pending');

                return [
                    'id' => $comment->id,
                    'type' => 'comment',
                    'title' => $comment->jeu ? $comment->jeu->titre : 'Unknown Game',
                    'description' => __('developer.activity.new_comment', ['user' => $comment->user ? $comment->user->name : 'Unknown']),
                    'status' => $status,
                    'date' => $comment->created_at->diffForHumans(),
                    'link' => route('game-submissions.show', $comment->jeu_id),
                    'content' => substr($comment->content, 0, 100) . (strlen($comment->content) > 100 ? '...' : ''),
                ];
            });

        // Get ALL recent ratings on developer's games (both approved and unapproved)
        $recentRatings = Evaluation::whereHas('jeu', function ($query) use ($userId) {
                $query->where('developpeur_id', $userId);
            })
            ->orderBy('created_at', 'desc')
            ->take(5)
            ->get()
            ->map(function ($rating) {
                $status = $rating->is_approved ? 'approved' : ($rating->is_flagged ? 'flagged' : 'pending');
                $description = empty($rating->commentaire)
                    ? __('developer.activity.new_rating', ['user' => $rating->utilisateur ? $rating->utilisateur->name : 'Unknown', 'rating' => $rating->note])
                    : __('developer.activity.new_rating_with_comment', ['user' => $rating->utilisateur ? $rating->utilisateur->name : 'Unknown', 'rating' => $rating->note]);

                // Create a unique ID for evaluations with comments (similar to admin dashboard)
                $rawId = $rating->commentaire ? $rating->utilisateur_id . '_' . $rating->jeu_id : null;

                return [
                    'id' => $rating->id,
                    'raw_id' => $rawId, // Add raw_id for evaluations with comments
                    'type' => $rating->commentaire ? 'review' : 'rating', // Use 'review' type for consistency with admin dashboard
                    'title' => $rating->jeu ? $rating->jeu->titre : 'Unknown Game',
                    'description' => $description,
                    'status' => $status,
                    'date' => $rating->created_at->diffForHumans(),
                    'link' => route('game-submissions.show', $rating->jeu_id),
                    'rating' => $rating->note,
                    'content' => $rating->commentaire ? substr($rating->commentaire, 0, 100) . (strlen($rating->commentaire) > 100 ? '...' : '') : null,
                    'user' => $rating->utilisateur ? $rating->utilisateur->name : 'Unknown', // Add user name for consistency
                    'game' => $rating->jeu ? $rating->jeu->titre : 'Unknown Game', // Add game title for consistency
                ];
            });

        // Merge and sort by date
        return $recentGames->concat($recentComments)->concat($recentRatings)
            ->sortByDesc('date')
            ->take(10)
            ->values()
            ->all();
    }
}
