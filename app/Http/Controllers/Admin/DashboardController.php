<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Comment;
use App\Models\Evaluation;
use App\Models\Jeu;
use App\Models\User;
use Inertia\Inertia;

class DashboardController extends Controller
{
    /**
     * Create a new controller instance.
     */
    public function __construct()
    {
        $this->middleware(['auth', 'verified', 'role:admin']);
    }

    /**
     * Display the admin dashboard.
     */
    public function index()
    {
        // Get counts for different statistics (include all developer-submitted games)
        $stats = [
            'total_users' => User::count(),
            'total_games' => Jeu::whereNotNull('developpeur_id')->count(),
            'total_comments' => Comment::count(),
            'total_reviews' => Evaluation::count(),
            'total_reviews_with_comments' => Evaluation::whereNotNull('commentaire')->count(),
            'pending_games' => Jeu::where('statut', 'en_attente')
                ->whereNotNull('developpeur_id')
                ->count(),
            'approved_games' => Jeu::where('statut', 'publie')
                ->whereNotNull('developpeur_id')
                ->count(),
            'rejected_games' => Jeu::where('statut', 'rejete')
                ->whereNotNull('developpeur_id')
                ->count(),
            'pending_comments' => Comment::where('is_approved', false)->where('is_flagged', false)->count(),
            'flagged_comments' => Comment::where('is_flagged', true)->count(),
            'pending_reviews' => Evaluation::where('is_approved', false)
                ->where('is_flagged', false)
                ->whereNotNull('commentaire')
                ->count(),
            'flagged_reviews' => Evaluation::where('is_flagged', true)
                ->whereNotNull('commentaire')
                ->count(),
        ];

        // Log the stats for debugging
        \Illuminate\Support\Facades\Log::info('Admin dashboard stats: ' . json_encode($stats));

        // Get recent activity
        $recentActivity = $this->getRecentActivity();

        // Add links to activities for easier navigation
        $recentActivity = collect($recentActivity)->map(function ($activity) {
            // Skip if id is null
            if (!isset($activity['id']) || $activity['id'] === null) {
                $activity['link'] = '#';
                return $activity;
            }

            // Log the activity for debugging
            \Illuminate\Support\Facades\Log::info('Processing activity for links:', [
                'id' => $activity['id'],
                'type' => $activity['type'],
                'content' => isset($activity['content']) ? substr($activity['content'], 0, 50) . (strlen($activity['content']) > 50 ? '...' : '') : 'No content',
            ]);

            if ($activity['type'] === 'game') {
                $activity['link'] = route('admin.game-approvals.show', $activity['id']);
            } elseif ($activity['type'] === 'comment') {
                $activity['link'] = route('admin.comment-moderation.show', $activity['id']);
            } elseif ($activity['type'] === 'review') {
                // For reviews, the ID is a composite key in the format "utilisateur_id_jeu_id"
                if (isset($activity['raw_id']) && $activity['raw_id']) {
                    $activity['link'] = route('admin.review-moderation.show', ['id' => $activity['raw_id']]);
                } else {
                    $activity['link'] = '#';
                }
            } elseif ($activity['type'] === 'user') {
                $activity['link'] = route('admin.users.show', $activity['id']);
            } else {
                $activity['link'] = '#';
            }
            return $activity;
        })->toArray();

        return Inertia::render('Admin/Dashboard', [
            'stats' => $stats,
            'recentActivity' => $recentActivity,
            'timestamp' => now()->timestamp, // Add timestamp for cache busting
        ]);
    }

    /**
     * Get recent activity for the dashboard.
     */
    private function getRecentActivity()
    {
        // Get recent game submissions (all developer-submitted games)
        $recentGames = Jeu::with('developpeur')
            ->whereNotNull('developpeur_id')
            // No filtering by rawg_id to ensure all games appear
            ->orderBy('created_at', 'desc')
            ->take(5)
            ->get()
            ->map(function ($game) {
                return [
                    'id' => $game->id,
                    'type' => 'game',
                    'title' => $game->titre,
                    'status' => $game->statut,
                    'user' => $game->developpeur ? $game->developpeur->name : 'Unknown',
                    'date' => $game->created_at->diffForHumans(),
                ];
            });

        // Get recent comments
        $recentComments = Comment::with(['user', 'jeu'])
            ->orderBy('created_at', 'desc')
            ->take(5)
            ->get()
            ->map(function ($comment) {
                // Log the comment for debugging
                \Illuminate\Support\Facades\Log::info('Processing comment for activity feed:', [
                    'id' => $comment->id,
                    'content' => substr($comment->content, 0, 50) . (strlen($comment->content) > 50 ? '...' : ''),
                    'is_approved' => $comment->is_approved,
                    'is_flagged' => $comment->is_flagged,
                ]);

                return [
                    'id' => $comment->id,
                    'type' => 'comment',
                    'content' => $comment->content ? substr($comment->content, 0, 150) . (strlen($comment->content) > 150 ? '...' : '') : 'No content',
                    'status' => $comment->is_approved ? 'approved' : ($comment->is_flagged ? 'flagged' : 'pending'),
                    'user' => $comment->user ? $comment->user->name : 'Unknown',
                    'user_email' => $comment->user ? $comment->user->email : '',
                    'game' => $comment->jeu ? $comment->jeu->titre : 'Unknown',
                    'game_id' => $comment->jeu ? $comment->jeu->id : null,
                    'date' => $comment->created_at->diffForHumans(),
                    'created_at' => $comment->created_at->format('Y-m-d H:i:s'),
                ];
            });

        // Get recent reviews with comments
        $recentReviews = Evaluation::with(['utilisateur', 'jeu'])
            ->whereNotNull('commentaire') // Only get reviews with comments
            ->orderBy('created_at', 'desc')
            ->take(5)
            ->get()
            ->map(function ($review) {
                // Make sure we have a valid ID
                if (!$review || !$review->id) {
                    return null;
                }

                return [
                    'id' => $review->id, // This is the virtual ID (utilisateur_id_jeu_id)
                    'raw_id' => $review->utilisateur_id . '_' . $review->jeu_id, // Raw ID for route generation
                    'type' => 'review',
                    'content' => $review->commentaire ? substr($review->commentaire, 0, 100) . (strlen($review->commentaire) > 100 ? '...' : '') : '',
                    'rating' => $review->note ?? 0,
                    'status' => $review->is_approved ? 'approved' : ($review->is_flagged ? 'flagged' : 'pending'),
                    'user' => $review->utilisateur ? $review->utilisateur->name : 'Unknown',
                    'game' => $review->jeu ? $review->jeu->titre : 'Unknown',
                    'date' => $review->created_at ? $review->created_at->diffForHumans() : 'Unknown',
                ];
            })
            ->filter(); // Remove any null values

        // Log the recent reviews for debugging
        \Illuminate\Support\Facades\Log::info('Recent reviews count: ' . $recentReviews->count());

        // Get recent user registrations
        $recentUsers = User::orderBy('created_at', 'desc')
            ->take(5)
            ->get()
            ->map(function ($user) {
                return [
                    'id' => $user->id,
                    'type' => 'user',
                    'name' => $user->name,
                    'email' => $user->email,
                    'role' => $user->role,
                    'date' => $user->created_at->diffForHumans(),
                ];
            });

        // Merge and sort by date
        return $recentGames->concat($recentComments)->concat($recentReviews)->concat($recentUsers)
            ->sortByDesc('date')
            ->take(10)
            ->values()
            ->all();
    }
}
