<?php

namespace App\Http\Controllers;

use App\Models\Jeu;
use App\Models\Evaluation;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class DashboardController extends Controller
{
    /**
     * Create a new controller instance.
     */
    public function __construct()
    {
        $this->middleware(['auth', 'verified']);
    }

    /**
     * Display the user dashboard.
     */
    public function index()
    {
        $user = Auth::user();

        // Get user's wishlist (limited to 5 for dashboard preview)
        $wishlistItems = $user->wishlist()
            ->with(['genres', 'plateformes'])
            ->orderBy('wishlists.created_at', 'desc')
            ->take(5)
            ->get();

        $wishlist = $wishlistItems->map(function ($game) {
            return [
                'id' => $game->id,
                'title' => $game->titre,
                'image' => $game->image_arriere_plan ?? null,
                'rating' => $game->rating,
                'added_at' => $game->pivot->created_at->diffForHumans(),
                'genres' => $game->genres->map(function ($genre) {
                    return [
                        'id' => $genre->id,
                        'name' => $genre->nom,
                    ];
                }),
                'platforms' => $game->plateformes->map(function ($platform) {
                    return [
                        'id' => $platform->id,
                        'name' => $platform->nom,
                    ];
                }),
            ];
        });

        // Get user's ratings (limited to 5 for dashboard preview)
        $ratingItems = $user->evaluations()
            ->with('jeu')
            ->orderBy('created_at', 'desc')
            ->take(5)
            ->get();

        $ratings = $ratingItems->map(function ($rating) {
            return [
                'id' => $rating->id,
                'game_id' => $rating->jeu_id,
                'game_title' => $rating->jeu ? $rating->jeu->titre : 'Unknown Game',
                'game_image' => $rating->jeu ? $rating->jeu->image_arriere_plan : null,
                'rating' => $rating->note,
                'comment' => $rating->commentaire,
                'date' => $rating->created_at->diffForHumans(),
                'created_at' => $rating->created_at->format('Y-m-d H:i:s'),
            ];
        });

        // Get recently played games (based on ratings)
        $recentGames = $ratings->take(5)->map(function ($rating) {
            return [
                'id' => $rating['game_id'],
                'title' => $rating['game_title'],
                'image' => $rating['game_image'],
                'rating' => $rating['rating'],
                'played_at' => $rating['date'],
            ];
        });

        // Get recommended games for users
        $recommendedGames = empty($ratings->toArray()) ?
            $this->getPopularGames() :
            $this->getRecommendedGames($user);

        // Calculate user stats
        $stats = [
            'gamesPlayed' => $user->evaluations()->count(),
            'reviewsWritten' => $user->evaluations()->whereNotNull('commentaire')->count(),
            'wishlistedGames' => $user->wishlist()->count(),
        ];

        return Inertia::render('Dashboard', [
            'wishlist' => $wishlist,
            'ratings' => $ratings,
            'recommendedGames' => $recommendedGames,
            'recentGames' => $recentGames,
            'stats' => $stats,
        ]);
    }

    /**
     * Get recommended games based on user's ratings and preferences.
     *
     * @param User $user The user to get recommendations for
     * @return array
     */
    private function getRecommendedGames($user)
    {
        // In a real implementation, this would use a recommendation algorithm
        // For now, we'll just get some popular games that the user hasn't rated yet
        $ratedGameIds = $user->evaluations()->pluck('jeu_id')->toArray();
        $wishlistedGameIds = $user->wishlist()->pluck('jeux.id')->toArray();

        // Get games that the user hasn't rated or wishlisted yet
        $recommendedGames = Jeu::where('statut', 'publie')
            ->whereNotIn('id', array_merge($ratedGameIds, $wishlistedGameIds))
            ->orderBy('rating', 'desc')
            ->take(4)
            ->get();

        // If we don't have enough recommendations, fall back to popular games
        if ($recommendedGames->count() < 4) {
            return $this->getPopularGames();
        }

        return $recommendedGames->map(function ($game) {
            return [
                'id' => $game->id,
                'title' => $game->titre,
                'image' => $game->image_arriere_plan ?? null,
                'rating' => $game->rating,
            ];
        })->toArray();
    }

    /**
     * Get popular games to recommend to new users.
     *
     * This provides a starting point for new users who haven't rated any games yet.
     */
    private function getPopularGames()
    {
        // Try to get popular games from the database first
        $dbGames = Jeu::where('statut', 'publie')
            ->orderBy('rating', 'desc')
            ->take(4)
            ->get();

        if ($dbGames->count() >= 4) {
            return $dbGames->map(function ($game) {
                return [
                    'id' => $game->id,
                    'title' => $game->titre,
                    'image' => $game->image_arriere_plan ?? null,
                    'rating' => $game->rating,
                ];
            })->toArray();
        }

        // Fallback to hardcoded list if database doesn't have enough games
        return [
            [
                'id' => 1,
                'title' => 'The Legend of Zelda: Breath of the Wild',
                'image' => 'https://media.rawg.io/media/games/cc1/cc196a5ad763955d6532cdba236f730c.jpg',
                'rating' => 4.8,
            ],
            [
                'id' => 2,
                'title' => 'Red Dead Redemption 2',
                'image' => 'https://media.rawg.io/media/games/511/5118aff5091cb3efec399c808f8c598f.jpg',
                'rating' => 4.7,
            ],
            [
                'id' => 3,
                'title' => 'The Witcher 3: Wild Hunt',
                'image' => 'https://media.rawg.io/media/games/618/618c2031a07bbff6b4f611f10b6bcdbc.jpg',
                'rating' => 4.7,
            ],
            [
                'id' => 4,
                'title' => 'God of War',
                'image' => 'https://media.rawg.io/media/games/4be/4be6a6ad0364751a96229c56bf69be59.jpg',
                'rating' => 4.6,
            ],
        ];
    }
}
