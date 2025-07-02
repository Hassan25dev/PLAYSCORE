<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreGameRequest;
use App\Http\Requests\UpdateGameRequest;
use App\Models\Jeu;
use App\Models\User;
use App\Services\RawgService;
use Illuminate\Http\Request;
use App\Mail\GamePublishedNotification;
use Barryvdh\DomPDF\Facade\Pdf;
use Carbon\Carbon;
use Inertia\Inertia;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;

class JeuController extends Controller
{
    // Injecter le service RAWG dans le contrôleur
    protected $rawgService;

    public function __construct(RawgService $rawgService)
    {
        $this->rawgService = $rawgService;
    }

    // Afficher tous les jeux avec pagination et filtres
    public function index(Request $request)
    {
        $today = date('Y-m-d');
        $dateFrom = '2018-01-01';

        // Récupérer les paramètres de l'URL
        $sort = $request->input('sort', 'popularity');
        $search = $request->input('search', '');
        $page = $request->input('page', 1);

        // Log the request parameters for debugging
        Log::info('JeuController index request:', [
            'sort' => $sort,
            'search' => $search,
            'page' => $page
        ]);

        // Use the RAWG API to get games
        $params = [
            'page' => $page,
            'page_size' => 20
        ];

        // Set ordering based on sort parameter
        if ($sort === 'recent') {
            $params['ordering'] = '-released';
            Log::info('Sorting by release date (newest first)');
        } elseif ($sort === 'rating') {
            $params['ordering'] = '-rating';
            Log::info('Sorting by rating (highest first)');
        } else {
            // Default to popularity
            $params['ordering'] = '-added';
            Log::info('Sorting by popularity (default)');
        }

        // Add search parameter if provided
        if (!empty($search)) {
            $params['search'] = $search;
            Log::info('Searching for: ' . $search);
        }

        // Call the RAWG API through our service
        $rawgGamesResponse = $this->rawgService->searchGames($search, $params);

        Log::info('RAWG Games Response:', [
            'count' => isset($rawgGamesResponse['count']) ? $rawgGamesResponse['count'] : 'not set',
            'results_count' => isset($rawgGamesResponse['results']) ? count($rawgGamesResponse['results']) : 'not set'
        ]);

        // Extract the results array from the response
        $rawgGames = isset($rawgGamesResponse['results']) ? $rawgGamesResponse['results'] : [];

        // Check if we have valid data
        if (empty($rawgGames)) {
            Log::warning('No games returned from RAWG API or invalid response format');
            $rawgGames = []; // Ensure it's an empty array for the next steps
        }

        // Convert to collection for sorting
        $gamesCollection = collect($rawgGames);

        // Sort games based on the sort parameter
        if ($sort === 'recent') {
            $gamesCollection = $gamesCollection->sortByDesc('released');
            Log::info('Sorting games by release date (newest first)');
        } elseif ($sort === 'rating') {
            $gamesCollection = $gamesCollection->sortByDesc('rating');
            Log::info('Sorting games by rating (highest first)');
        } else {
            // Default sort by popularity
            Log::info('Sorting games by popularity (default)');
        }

        // Convert back to array
        $rawgGames = $gamesCollection->values()->all();

        $jeux = [
            'data' => array_map(function ($game) {
                // Ensure all required keys exist with fallbacks
                return [
                    'id' => $game['id'] ?? 0,
                    'name' => $game['name'] ?? 'Unknown Game',
                    'background_image' => $game['background_image'] ?? null,
                    'released' => $game['released'] ?? null,
                    'rating' => $game['rating'] ?? null,
                ];
            }, $rawgGames),
            'prev_page_url' => $rawgGamesResponse['previous'] ?? null,
            'next_page_url' => $rawgGamesResponse['next'] ?? null,
        ];

        Log::info('Adapted Jeux (no cache with date filter):', $jeux);

        return Inertia::render('Jeux/Index', [
            'jeux' => $jeux,
        ]);
    }

    // Afficher les détails d'un jeu
    // Ajoutez cet import en haut du fichier si pas déjà pré
   // Ajoutez cet import en haut du fichier si pas déjà présent
// use Carbon\Carbon;

public function show($id)
{
    if (!$id || !is_numeric($id)) {
        abort(404, 'Jeu non trouvé');
    }

    // Use a single cache key for the entire game details page
    $cacheKey = "game_details_page_{$id}";

    // Check if we have the complete page data in cache
    if (Cache::has($cacheKey)) {
        $cachedData = Cache::get($cacheKey);
        $jeu = $cachedData['jeu'];
        $gameDetails = $cachedData['gameDetails'];
        $screenshots = $cachedData['screenshots'];
    } else {
        // First, check if this is a database ID - use eager loading to reduce queries
        $jeu = Jeu::with(['genres', 'plateformes'])->find($id);
        $rawgId = null;
        $gameDetails = null;
        $screenshots = [];

        if ($jeu) {
            // This is a database ID, get the RAWG ID from the database
            $rawgId = $jeu->rawg_id;

            // If we have a RAWG ID, get the details from RAWG API
            if ($rawgId) {
                try {
                    // Cache individual game details for 1 day (86400 seconds)
                    $gameDetails = Cache::remember("rawg_game_{$rawgId}_details", 86400, function () use ($rawgId) {
                                    $data = $this->rawgService->getGame((int)$rawgId);
            Log::info("RAWG API getGame data for rawgId {$rawgId}:", ['data' => $data]);
            return $data;

                    });

                    // Get screenshots - cache for 1 day
                    $screenshots = Cache::remember("rawg_game_{$rawgId}_screenshots", 86400, function () use ($rawgId) {
                        try {
                            $response = Http::get("https://api.rawg.io/api/games/{$rawgId}/screenshots", [
                                'key' => config('services.rawg.key'),
                            ]);
                            if ($response->successful()) {
                                return $response->json()['results'] ?? [];
                            }
                        } catch (\Exception $e) {
                            Log::error('RAWG API Screenshots Error: ' . $e->getMessage());
                        }
                        return [];
                    });
                } catch (\Exception $e) {
                    Log::error('Error fetching RAWG data: ' . $e->getMessage());
                    // Continue with local data
                }
            }

            // If we couldn't get RAWG details, create a basic game details array from our database
            if (!$gameDetails) {
                $gameDetails = [
                    'id' => $jeu->id,
                    'name' => $jeu->titre,
                    'description_raw' => $jeu->description,
                    'released' => $jeu->date_sortie,
                    'background_image' => $jeu->image_arriere_plan,
                    'video_path' => $jeu->video_path,
                    'video_url' => $jeu->video_url,
                    'rating' => $jeu->rating,
                    'ratings_count' => $jeu->evaluations->count(),
                    // Add more fields as needed
                    'genres' => $jeu->genres->map(function ($genre) {
                        return ['id' => $genre->id, 'name' => $genre->nom];
                    })->toArray(),
                    'platforms' => $jeu->plateformes->map(function ($platform) {
                        return ['platform' => ['id' => $platform->id, 'name' => $platform->nom]];
                    })->toArray(),
                ];
            }
        } else {
            // This is a RAWG ID, not a database ID
            $rawgId = $id;

            try {
                // Cache individual game details for 1 day
                $gameDetails = Cache::remember("rawg_game_{$rawgId}_details", 86400, function () use ($rawgId) {
                    return $this->rawgService->getGame((int)$rawgId);
                });

                // CORRECTION: Au lieu de faire abort(404) si gameDetails est null,
                // on va créer un jeu avec des données par défaut
                if (!$gameDetails) {
                    Log::warning("Game not found in RAWG API, creating placeholder", ['rawg_id' => $rawgId]);
                    
                    // Créer des données par défaut pour le jeu
                    $gameDetails = [
                        'id' => $rawgId,
                        'name' => "Jeu #{$rawgId}",
                        'description_raw' => 'Description non disponible',
                        'released' => null,
                        'background_image' => null,
                        'rating' => 0,
                        'ratings_count' => 0,
                        'genres' => [],
                        'platforms' => [],
                    ];
                }

                // Get screenshots - cache for 1 day
                $screenshots = Cache::remember("rawg_game_{$rawgId}_screenshots", 86400, function () use ($rawgId) {
                    try {
                        $response = Http::get("https://api.rawg.io/api/games/{$rawgId}/screenshots", [
                            'key' => config('services.rawg.key'),
                        ]);
                        if ($response->successful()) {
                            return $response->json()['results'] ?? [];
                        }
                    } catch (\Exception $e) {
                        Log::error('RAWG API Screenshots Error: ' . $e->getMessage());
                    }
                    return [];
                });
            } catch (\Exception $e) {
                Log::error('Error fetching RAWG data: ' . $e->getMessage());
                
                // CORRECTION: Au lieu de faire abort(404), créer des données par défaut
                $gameDetails = [
                    'id' => $rawgId,
                    'name' => "Jeu #{$rawgId}",
                    'description_raw' => 'Description non disponible',
                    'released' => null,
                    'background_image' => null,
                    'rating' => 0,
                    'ratings_count' => 0,
                    'genres' => [],
                    'platforms' => [],
                ];
                $screenshots = [];
            }

            // Find the game in our database or create it
            $slug = Str::slug($gameDetails['name'] ?? 'unknown-game-' . $rawgId);

            // Check if the release date is valid (not too far in the future)
            $releaseDate = $gameDetails['released'] ?? null;
            if ($releaseDate) {
                $releaseYear = (int)substr($releaseDate, 0, 4);
                $currentYear = (int)date('Y');

                // If the release date is more than 5 years in the future, it's likely a placeholder
                if ($releaseYear > $currentYear + 5) {
                    $releaseDate = null;
                }
            }

            // Préparer toutes les données disponibles pour la sauvegarde
            $gameData = [
                'slug' => $slug,
                'titre' => $gameDetails['name'] ?? "Jeu #{$rawgId}",
                'description' => $gameDetails['description_raw'] ?? 'Description non disponible',
                'date_sortie' => $releaseDate,
                'image_arriere_plan' => $gameDetails['background_image'] ?? null,
                'statut' => 'publie',
                // Ajouter plus de données RAWG
                'rating' => $gameDetails['rating'] ?? 0,
                'rating_top' => $gameDetails['rating_top'] ?? 0,
                'ratings_count' => $gameDetails['ratings_count'] ?? 0,
                'metacritic' => $gameDetails['metacritic'] ?? null,
                'playtime' => $gameDetails['playtime'] ?? null,
                'suggestions_count' => $gameDetails['suggestions_count'] ?? 0,
                'added' => $gameDetails['added'] ?? 0,
                'updated' => isset($gameDetails['updated']) ? Carbon::parse($gameDetails['updated']) : null,
                'esrb_rating' => isset($gameDetails['esrb_rating']['name']) ? $gameDetails['esrb_rating']['name'] : null,
                'website' => $gameDetails['website'] ?? null,
                'reddit_url' => $gameDetails['reddit_url'] ?? null,
                'reddit_name' => $gameDetails['reddit_name'] ?? null,
                'reddit_description' => $gameDetails['reddit_description'] ?? null,
                'reddit_logo' => $gameDetails['reddit_logo'] ?? null,
                'reddit_count' => $gameDetails['reddit_count'] ?? 0,
                'twitch_count' => $gameDetails['twitch_count'] ?? 0,
                'youtube_count' => $gameDetails['youtube_count'] ?? 0,
                'reviews_text_count' => $gameDetails['reviews_text_count'] ?? 0,
                'reviews_count' => $gameDetails['reviews_count'] ?? 0,
                'saturated_color' => $gameDetails['saturated_color'] ?? null,
                'dominant_color' => $gameDetails['dominant_color'] ?? null,
                // Stocker les données JSON pour les relations complexes
                'rawg_genres' => isset($gameDetails['genres']) ? json_encode($gameDetails['genres']) : null,
                'rawg_platforms' => isset($gameDetails['platforms']) ? json_encode($gameDetails['platforms']) : null,
                'rawg_stores' => isset($gameDetails['stores']) ? json_encode($gameDetails['stores']) : null,
                'rawg_developers' => isset($gameDetails['developers']) ? json_encode($gameDetails['developers']) : null,
                'rawg_publishers' => isset($gameDetails['publishers']) ? json_encode($gameDetails['publishers']) : null,
                'rawg_tags' => isset($gameDetails['tags']) ? json_encode($gameDetails['tags']) : null,
                'rawg_screenshots' => !empty($screenshots) ? json_encode($screenshots) : null,
            ];

            $jeu = Jeu::firstOrCreate(
                ['rawg_id' => $rawgId],
                $gameData
            );

            // Si le jeu existe déjà, mettre à jour avec les nouvelles données
            if ($jeu->wasRecentlyCreated === false) {
                // Optionnel : mettre à jour les données existantes
                // $jeu->update($gameData);
                Log::info("Game already exists in database", ['jeu_id' => $jeu->id, 'rawg_id' => $rawgId]);
            } else {
                Log::info("New game created from RAWG data", ['jeu_id' => $jeu->id, 'rawg_id' => $rawgId]);
            }
        }

        // Cache the complete page data for 1 hour (3600 seconds)
        Cache::put($cacheKey, [
            'jeu' => $jeu,
            'gameDetails' => $gameDetails,
            'screenshots' => $screenshots
        ], 3600);
    }

    // Increment the view counter for the game
    if (isset($jeu) && $jeu->exists) {
        $jeu->increment('views');
    }

    // Get user-specific data if authenticated
    $userInteractions = null;
    if (auth()->check()) {

        $user = Auth::user();

        // Get the user model with the correct namespace
        $userModel = User::find($user->id);

        try {
            $userInteractions = [
                'inWishlist' => $userModel->wishlist()->wherePivot('jeu_id', $jeu->id)->exists(),
                'userRating' => $userModel->evaluations()->where('jeu_id', $jeu->id)->value('note'),
                'gameId' => $jeu->id,
            ];

            // Log successful interaction retrieval
            Log::info('User interactions retrieved successfully', [
                'user_id' => $user->id,
                'jeu_id' => $jeu->id,
                'interactions' => $userInteractions
            ]);
        } catch (\Exception $e) {
            // Log the error for debugging
            Log::error('Error retrieving user interactions', [
                'user_id' => $user->id,
                'jeu_id' => $jeu->id,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            // Provide a fallback
            $userInteractions = [
                'inWishlist' => false,
                'userRating' => null,
                'gameId' => $jeu->id,
            ];
        }
    }

    // Get reviews/evaluations for the game if it exists in our database
    $reviews = [];
    if (isset($jeu) && $jeu->exists) {
        // Only get approved reviews unless the user is an admin or moderator
        $reviewsQuery = $jeu->evaluations()->with('utilisateur');

        if (auth()->check() && (auth()->user()->role === 'admin' || auth()->user()->role === 'moderator')) {
            // Admins and moderators can see all reviews
            $reviewsQuery->orderBy('created_at', 'desc');
        } else {
            // Regular users can only see approved reviews
            $reviewsQuery->where('is_approved', true)->orderBy('created_at', 'desc');
        }

        $reviews = $reviewsQuery->get()->map(function ($evaluation) {
            return [
                'id' => $evaluation->id,
                'rating' => $evaluation->note,
                'comment' => $evaluation->commentaire,
                'user_name' => $evaluation->utilisateur ? $evaluation->utilisateur->name : 'Utilisateur anonyme',
                'user_id' => $evaluation->utilisateur_id,
                'is_approved' => $evaluation->is_approved,
                'created_at' => $evaluation->created_at,
                'updated_at' => $evaluation->updated_at,
            ];
        });
    }

    
    return Inertia::render('Jeux/Show', [
        'gameDetails' => $gameDetails,
        'screenshots' => $screenshots,
        'userInteractions' => $userInteractions,
        'reviews' => $reviews,
    ]);
}
    // Formulaire de création
    public function create()
    {
        return view('jeux.create');
    }

    // Enregistrer un nouveau jeu (via StoreGameRequest)
    public function store(StoreGameRequest $request)
    {
        $validated = $request->validated();

        // Si un ID RAWG est fourni, synchroniser avec l'API RAWG
        if ($request->has('rawg_id')) {
            $rawgData = $this->rawgService->getGame($request->input('rawg_id'));

            if (!$rawgData) {
                return back()->withErrors(['error' => __('errors.rawg_not_found')]);
            }

            // Check if the release date is valid (not too far in the future)
            $releaseDate = $rawgData['released'] ?? null;
            if ($releaseDate) {
                $releaseYear = (int)substr($releaseDate, 0, 4);
                $currentYear = (int)date('Y');

                // If the release date is more than 5 years in the future, it's likely a placeholder
                if ($releaseYear > $currentYear + 5) {
                    $releaseDate = null;
                }
            }

            $validated = array_merge($validated, [
                'titre' => $rawgData['name'],
                'description' => $rawgData['description'],
                'date_sortie' => $releaseDate,
                'image_arriere_plan' => $rawgData['background_image'],
            ]);
        }

        // Créer le jeu avec le développeur actuel
        $jeu = Jeu::create($validated + ['developpeur_id' => auth()->user()->id]);

        return redirect()->route('jeux.show', $jeu)->with('success', __('jeux.created_success'));
    }

    // Modifier un jeu (via UpdateGameRequest)
    public function edit(Jeu $jeu)
    {
        return view('jeux.edit', compact('jeu'));
    }

    // Mettre à jour un jeu
    public function update(UpdateGameRequest $request, Jeu $jeu)
    {
        $jeu->update($request->validated());

        return redirect()->route('jeux.show', $jeu)->with('success', __('jeux.updated_success'));
    }

    // Supprimer un jeu
    public function destroy(Jeu $jeu)
    {
        $jeu->delete();

        return redirect()->route('jeux.index')->with('success', __('jeux.deleted_success'));
    }

    public function generatePDF($id)
    {
        $jeu = Jeu::find($id);
        if (!$jeu) {
            return response()->json(['message' => __('messages.game_not_found')], 404);
        }

        // Map the Jeu model to match the game template structure
        $game = (object)[
            'title' => $jeu->titre,
            'description' => $jeu->description,
            'release_date' => \Carbon\Carbon::parse($jeu->date_sortie),
            'genres' => $jeu->genres ?? collect(),
            'platforms' => $jeu->plateformes ?? collect(),
            'rating' => $jeu->rating ?? 0
        ];

        $pdf = Pdf::loadView('pdf.game', ['game' => $game]);
        return $pdf->download($jeu->titre . '.pdf');
    }

    /**
     * Get indie games submitted by developers and approved by admins.
     *
     * @param Request $request
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function getIndieGames(Request $request)
    {
        $limit = $request->input('limit', 10);

        // Get approved games from developers that have the 'indie' tag
        $indieGames = Jeu::where('statut', 'publie')
            ->whereNotNull('developpeur_id')
            ->whereHas('tags', function ($query) {
                $query->where('slug', 'indie');
            })
            ->with(['developpeur', 'genres', 'plateformes', 'tags'])
            ->orderBy('approved_at', 'desc')
            ->limit($limit)
            ->get();

        return $indieGames;
    }

    /**
     * Display a page with indie games.
     *
     * @param Request $request
     * @return \Inertia\Response
     */
    public function indieGames(Request $request)
    {
        $indieGames = $this->getIndieGames($request->merge(['limit' => 20]));

        return Inertia::render('Jeux/IndieGames', [
            'indieGames' => $indieGames->map(function ($game) {
                return [
                    'id' => $game->id,
                    'name' => $game->titre,
                    'background_image' => $game->image_arriere_plan,
                    'released' => $game->date_sortie,
                    'rating' => $game->rating,
                    'developer' => $game->developpeur ? $game->developpeur->name : null,
                    'video_path' => $game->video_path,
                    'video_url' => $game->video_url,
                    'description' => $game->description,
                    'genres' => $game->genres->map(function ($genre) {
                        return ['name' => $genre->nom];
                    }),
                    'platforms' => $game->plateformes->map(function ($platform) {
                        return ['platform' => ['name' => $platform->nom]];
                    }),
                ];
            }),
        ]);
    }
}
