<?php

namespace App\Http\Controllers;

use App\Models\Jeu;
use App\Models\User;
use App\Models\Wishlist;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class WishlistController extends Controller
{
    /**
     * Create a new controller instance.
     */
    public function __construct()
    {
        $this->middleware(['auth', 'verified']);
    }

    /**
     * Display the user's wishlist.
     */
    public function index()
    {
        $user = Auth::user();

        // Get user's wishlist with pagination using the Jeu model with a join
        $wishlistQuery = Jeu::join('wishlists', 'jeux.id', '=', 'wishlists.jeu_id')
            ->where('wishlists.user_id', $user->id)
            ->select('jeux.*', 'wishlists.created_at as wishlist_created_at')
            ->with(['genres', 'plateformes'])
            ->orderBy('wishlists.created_at', 'desc');

        $wishlist = $wishlistQuery->paginate(12);

        $wishlistItems = $wishlist->map(function ($game) {
            return [
                'id' => $game->id,
                'title' => $game->titre,
                'image' => $game->image_arriere_plan ?? null,  // Using correct field name
                'rating' => $game->rating,
                'added_at' => \Carbon\Carbon::parse($game->wishlist_created_at)->diffForHumans(),
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

        return Inertia::render('User/Wishlist', [
            'wishlist' => $wishlistItems,
            'pagination' => [
                'total' => $wishlist->total(),
                'per_page' => $wishlist->perPage(),
                'current_page' => $wishlist->currentPage(),
                'last_page' => $wishlist->lastPage(),
            ],
        ]);
    }

    /**
     * Add a game to the user's wishlist.
     */
    public function store(Request $request)
    {
        $request->validate([
            'game_id' => 'required|exists:jeux,id',
        ]);

        $user = Auth::user();
        $gameId = $request->input('game_id');

        // Check if the game is already in the wishlist using the pivot table
        $existingWishlistItem = DB::table('wishlists')
            ->where('user_id', $user->id)
            ->where('jeu_id', $gameId)
            ->exists();

        if (!$existingWishlistItem) {
            // Add to wishlist using direct DB insert
            DB::table('wishlists')->insert([
                'user_id' => $user->id,
                'jeu_id' => $gameId,
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            return redirect()->back()->with('success', 'Game added to wishlist successfully.');
        }

        return redirect()->back()->with('info', 'Game is already in your wishlist.');
    }

    /**
     * Remove a game from the user's wishlist.
     */
    public function destroy($gameId)
    {
        $user = Auth::user();

        // Remove from wishlist using direct DB delete
        DB::table('wishlists')
            ->where('user_id', $user->id)
            ->where('jeu_id', $gameId)
            ->delete();

        return redirect()->back()->with('success', 'Game removed from wishlist successfully.');
    }
}