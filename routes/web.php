<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;
use Inertia\Inertia;

Route::post('/language-switch', function (Request $request) {
    $request->validate([
        'language' => 'required|string|in:en,fr',
    ]);

    // Store the locale in session
    session(['locale' => $request->language]);

    // Set the application locale
    app()->setLocale($request->language);

    // Return a JSON response for API calls
    if ($request->expectsJson()) {
        return response()->json([
            'success' => true,
            'locale' => $request->language
        ]);
    }

    // Redirect back for regular requests
    return redirect()->back()->with('locale_changed', true);
})->name('language.switch');

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

use App\Services\RawgService;

Route::get('/', function () {
    if (Auth::check()) {
        return redirect()->route('dashboard');
    }

    $rawgService = app(RawgService::class);
    $jeuController = app(App\Http\Controllers\JeuController::class);

    // Get recent releases from RAWG API (sorted by release date, newest first)
    $recentReleasesCacheKey = 'welcome_recent_releases';

    // Clear cache to ensure fresh data after the fix
    \Illuminate\Support\Facades\Cache::forget($recentReleasesCacheKey);

    $recentReleases = \Illuminate\Support\Facades\Cache::remember($recentReleasesCacheKey, 3600, function() use ($rawgService) {
        try {
            // Calculate date range for recent releases (last 2 years)
            $currentDate = now();
            $twoYearsAgo = $currentDate->copy()->subYears(2);

            // Get recent releases from RAWG API with date filter
            $recentReleasesResponse = $rawgService->searchGames('', [
                'ordering' => '-released',
                'page_size' => 8, // Get more games to filter out any without proper dates
                'dates' => $twoYearsAgo->format('Y-m-d') . ',' . $currentDate->format('Y-m-d'), // Filter for last 2 years
                'metacritic' => '70,100', // Only games with decent ratings to ensure quality
            ]);

            // Extract the results array from the response
            $recentGames = isset($recentReleasesResponse['results']) ? $recentReleasesResponse['results'] : [];

            // Filter and sort games to ensure they have valid release dates and are truly recent
            $filteredGames = collect($recentGames)
                ->filter(function($game) use ($twoYearsAgo) {
                    // Ensure game has a release date and it's within the last 2 years
                    if (!isset($game['released']) || empty($game['released'])) {
                        return false;
                    }

                    try {
                        $releaseDate = new \DateTime($game['released']);
                        return $releaseDate >= $twoYearsAgo->toDateTime();
                    } catch (\Exception $e) {
                        return false;
                    }
                })
                ->sortByDesc(function($game) {
                    // Sort by release date, newest first
                    return $game['released'];
                })
                ->take(4) // Take only the 4 most recent
                ->values();

            // Log the results for debugging
            \Illuminate\Support\Facades\Log::info('RAWG API Recent Releases:', [
                'total_returned' => count($recentGames),
                'filtered_count' => $filteredGames->count(),
                'date_range' => $twoYearsAgo->format('Y-m-d') . ' to ' . $currentDate->format('Y-m-d'),
                'sample' => $filteredGames->take(2)->map(function($game) {
                    return [
                        'name' => $game['name'] ?? 'Unknown',
                        'released' => $game['released'] ?? 'No date',
                        'rating' => $game['rating'] ?? 'No rating'
                    ];
                })->toArray()
            ]);

            return $filteredGames;
        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::error('Error fetching recent releases from RAWG API: ' . $e->getMessage());
            return collect([]);
        }
    });

    // Fallback data for recent releases if API call fails
    if ($recentReleases->isEmpty()) {
        \Illuminate\Support\Facades\Log::warning('No recent releases found from API, using fallback data');

        // Fallback data for recent releases - only truly recent games (2023-2024)
        $recentReleases = collect([
            [
                'id' => 799265,
                'name' => 'Dragon\'s Dogma 2',
                'background_image' => 'https://media.rawg.io/media/games/a79/a79d2fc90c4dbf07a8580b19600fd61d.jpg',
                'released' => '2024-03-22',
                'rating' => 4.2,
                'genres' => [['name' => 'RPG'], ['name' => 'Action']],
            ],
            [
                'id' => 3328,
                'name' => 'The Witcher 3: Wild Hunt',
                'background_image' => 'https://media.rawg.io/media/games/618/618c2031a07bbff6b4f611f10b6bcdbc.jpg',
                'released' => '2015-05-18',
                'rating' => 4.7,
                'genres' => [['name' => 'RPG'], ['name' => 'Adventure']],
            ],
            [
                'id' => 32,
                'name' => 'Destiny 2',
                'background_image' => 'https://media.rawg.io/media/games/34b/34b1f1850a1c06fd971bc6ab3ac0ce0e.jpg',
                'released' => '2017-09-06',
                'rating' => 3.8,
                'genres' => [['name' => 'Action'], ['name' => 'Shooter']],
            ],
                        [
                'id' => 58550,
                'name' => 'Starfield',
                'background_image' => 'https://media.rawg.io/media/games/ba8/ba82c971336adfd290e4c0eab6504fcf.jpg',
                'released' => '2023-09-06',
                'rating' => 3.8,
                'genres' => [['name' => 'RPG'], ['name' => 'Adventure']],
            ]

        ])
        // Sort fallback data by release date, newest first
        ->sortByDesc('released')
        ->take(4)
        ->values();
    }

    // Get top games from RAWG API (sorted by rating, highest first)
    $topGamesCacheKey = 'welcome_top_games';
    $topGames = \Illuminate\Support\Facades\Cache::remember($topGamesCacheKey, 3600, function() use ($rawgService) {
        try {
            // Get top games from RAWG API
            $topGamesResponse = $rawgService->searchGames('', [
                'ordering' => '-rating',
                'page_size' => 4,
                'metacritic' => '85,100' // Only games with high metacritic scores
            ]);

            // Extract the results array from the response
            $topRatedGames = isset($topGamesResponse['results']) ? $topGamesResponse['results'] : [];

            // Log the results for debugging
            \Illuminate\Support\Facades\Log::info('RAWG API Top Games:', [
                'count' => count($topRatedGames),
                'sample' => !empty($topRatedGames) ? array_slice($topRatedGames, 0, 2) : 'No games returned'
            ]);

            return collect($topRatedGames);
        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::error('Error fetching top games from RAWG API: ' . $e->getMessage());
            return collect([]);
        }
    });

    // Fallback data for top games if API call fails
    if ($topGames->isEmpty()) {
        \Illuminate\Support\Facades\Log::warning('No top games found from API, using fallback data');

        // Fallback data for top games
        $topGames = collect([

            [
                'id' => 4200,
                'name' => 'Portal 2',
                'background_image' => 'https://media.rawg.io/media/games/328/3283617cb7d75d67257fc58339188742.jpg',
                'released' => '2011-04-18',
                'rating' => 4.6,
                'genres' => [['name' => 'Puzzle'], ['name' => 'Adventure']],
            ],

            [
                'id' => 3498,
                'name' => 'Grand Theft Auto V',
                'background_image' => 'https://media.rawg.io/media/games/456/456dea5e1c7e3cd07060c14e96612001.jpg',
                'released' => '2013-09-17',
                'rating' => 4.5,
                'genres' => [['name' => 'Action'], ['name' => 'Adventure']],
            ],
            [
                'id' => 5286,
                'name' => 'Tomb Raider (2013)',
                'background_image' => 'https://media.rawg.io/media/games/021/021c4e21a1824d2526f925eff6324653.jpg',
                'released' => '2013-03-05',
                'rating' => 4.1,
                'genres' => [['name' => 'Action'], ['name' => 'Adventure']],
            ],
            [
                'id' => 4291,
                'name' => 'Counter-Strike: Global Offensive',
                'background_image' => 'https://media.rawg.io/media/games/736/73619bd336c894d6941d926bfd563946.jpg',
                'released' => '2012-08-21',
                'rating' => 3.9,
                'genres' => [['name' => 'Action'], ['name' => 'Shooter']],
            ]
        ]);
    }

    // Get indie games from developers
    $indieGames = $jeuController->getIndieGames(new Request(['limit' => 6]));
    $formattedIndieGames = $indieGames->map(function ($game) {
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
        ];
    });

    // We'll let the client-side handle image fallbacks
    $processedRecentReleases = $recentReleases;

    // We'll let the client-side handle image fallbacks
    $processedTopGames = $topGames;

    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
        'recentReleases' => $processedRecentReleases->values(),
        'topGames' => $processedTopGames->values(),
        'indieGames' => $formattedIndieGames,
    ]);
});

Route::get('/dashboard', function () {
    $user = \Illuminate\Support\Facades\Auth::user();

    // Get the user's role from the database
    $userRole = $user->role;

    // Simple role check based on the role column
    if ($userRole === 'admin') {
        return redirect()->route('admin.dashboard');
    } elseif ($userRole === 'developer' || $user->is_developer) {
        return redirect()->route('developer.dashboard');
    } else {
        return redirect()->route('user.dashboard');
    }
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';

// Direct logout route to handle the DirectLogoutButton component
Route::get('/logout-redirect', function () {
    // Verify the user is authenticated
    if (!Auth::check()) {
        return redirect('/');
    }

    // Perform the logout
    Auth::guard('web')->logout();
    request()->session()->invalidate();
    request()->session()->regenerateToken();

    return redirect('/');
})->name('logout.redirect');

// Game routes
Route::get('/jeux', [App\Http\Controllers\JeuController::class, 'index'])->name('jeux.index');
Route::get('/jeux/indie', [App\Http\Controllers\JeuController::class, 'indieGames'])->name('jeux.indie');
Route::get('/jeux/{id}', [App\Http\Controllers\JeuController::class, 'show'])->name('jeux.show');

// Test routes
Route::get('/test', function () {
    return Inertia::render('Test', [
        'locale' => app()->getLocale(),
    ]);
})->name('test');

Route::get('/jeux/test', function () {
    return Inertia::render('Jeux/Test', [
        'locale' => app()->getLocale(),
    ]);
})->name('jeux.test');

// Test route for Developer Dashboard
Route::get('/test-developer-dashboard', function () {
    // Mock data for testing
    $stats = [
        'total' => 10,
        'pending' => 3,
        'published' => 5,
        'rejected' => 2,
        'drafts' => 0,
    ];

    $recentActivity = [];

    return Inertia::render('Developer/Dashboard', [
        'stats' => $stats,
        'recentActivity' => $recentActivity,
    ]);
})->middleware(['auth', 'verified'])->name('test.developer.dashboard');

// Debug route
Route::get('/debug-inertia', function () {
    $pages = glob(resource_path('js/Pages/**/*.jsx'));
    $pagesList = [];

    foreach ($pages as $page) {
        $relativePath = str_replace(resource_path('js/Pages/'), '', $page);
        $relativePath = str_replace('.jsx', '', $relativePath);
        $pagesList[] = $relativePath;
    }

    return response()->json([
        'pages' => $pagesList,
        'locale' => app()->getLocale(),
    ]);
});

// Route to get 4 best recent games from RAWG API
Route::get('/api/recent-games', function () {
    $rawgService = app(App\Services\RawgService::class);
    
    // Calculate date range for recent releases (last 2 years)
    $currentDate = now();
    $twoYearsAgo = $currentDate->copy()->subYears(2);
    
    // Get recent releases from RAWG API with date filter
    $recentReleasesResponse = $rawgService->searchGames('', [
        'ordering' => '-released',
        'page_size' => 8, // Get more games to filter out any without proper dates
        'dates' => $twoYearsAgo->format('Y-m-d') . ',' . $currentDate->format('Y-m-d'), // Filter for last 2 years
        'metacritic' => '70,100', // Only games with decent ratings to ensure quality
    ]);
    
    // Extract the results array from the response
    $recentGames = isset($recentReleasesResponse['results']) ? $recentReleasesResponse['results'] : [];
    
    // Filter and sort games to ensure they have valid release dates and are truly recent
    $filteredGames = collect($recentGames)
        ->filter(function($game) use ($twoYearsAgo) {
            // Ensure game has a release date and it's within the last 2 years
            if (!isset($game['released']) || empty($game['released'])) {
                return false;
            }
            
            try {
                $releaseDate = new \DateTime($game['released']);
                return $releaseDate >= $twoYearsAgo->toDateTime();
            } catch (\Exception $e) {
                return false;
            }
        })
        ->sortByDesc(function($game) {
            // Sort by release date, newest first
            return $game['released'];
        })
        ->take(4) // Take only the 4 most recent
        ->values()
        ->map(function($game) {
            // Format the game data according to the requested structure
            return [
                'id' => $game['id'],
                'name' => $game['name'],
                'background_image' => $game['background_image'] ?? null,
                'released' => $game['released'] ?? null,
                'rating' => $game['rating'] ?? null,
                'genres' => array_map(function($genre) {
                    return ['name' => $genre['name']];
                }, $game['genres'] ?? []),
            ];
        });
    
    // Fallback data if API call fails or returns no results
    if ($filteredGames->isEmpty()) {
        $filteredGames = collect([
            [
                'id' => 799265,
                'name' => 'Dragon\'s Dogma 2',
                'background_image' => 'https://media.rawg.io/media/games/a79/a79d2fc90c4dbf07a8580b19600fd61d.jpg',
                'released' => '2024-03-22',
                'rating' => 4.2,
                'genres' => [['name' => 'RPG'], ['name' => 'Action']],
            ],
            [
                'id' => 3328,
                'name' => 'The Witcher 3: Wild Hunt',
                'background_image' => 'https://media.rawg.io/media/games/618/618c2031a07bbff6b4f611f10b6bcdbc.jpg',
                'released' => '2015-05-18',
                'rating' => 4.7,
                'genres' => [['name' => 'RPG'], ['name' => 'Adventure']],
            ],
            [
                'id' => 32,
                'name' => 'Destiny 2',
                'background_image' => 'https://media.rawg.io/media/games/34b/34b1f1850a1c06fd971bc6ab3ac0ce0e.jpg',
                'released' => '2017-09-06',
                'rating' => 3.8,
                'genres' => [['name' => 'Action'], ['name' => 'Shooter']],
            ],
            [
                'id' => 766,
                'name' => 'Baldur\'s Gate 3',
                'background_image' => 'https://media.rawg.io/media/games/699/69907ecf13f172e9e144479db11aeb5f.jpg',
                'released' => '2023-08-03',
                'rating' => 4.5,
                'genres' => [['name' => 'RPG'], ['name' => 'Adventure']],
            ]
        ]);
    }
    
    return response()->json($filteredGames);
});

// PDF Test Routes
Route::get('/test-pdf/{jeu}', [App\Http\Controllers\JeuController::class, 'generatePDF'])->name('test.pdf');

// PDF Test Routes for authenticated users
Route::middleware(['auth'])->group(function () {
    Route::get('/user-test-pdf/{jeu}', [App\Http\Controllers\JeuController::class, 'generatePDF'])->name('user.test.pdf');
    Route::get('/user-email-test', [App\Http\Controllers\EmailTestController::class, 'sendToSelf'])->name('user.email-test');
});

// PDF Test Routes for developers
Route::middleware(['auth', 'role:developer,admin'])->group(function () {
    Route::get('/developer-test-pdf/{jeu}', [App\Http\Controllers\JeuController::class, 'generatePDF'])->name('developer.test.pdf');
    Route::get('/developer-email-test', [App\Http\Controllers\EmailTestController::class, 'sendToSelf'])->name('developer.email-test');
    Route::get('/developer-test-xml/{jeu}', [App\Http\Controllers\XmlController::class, 'exportGame'])->name('developer.test.xml');
    Route::get('/developer-export-xml', [App\Http\Controllers\XmlController::class, 'exportUserData'])->name('developer.export.xml');
});

// PDF Test Routes for admins
Route::middleware(['auth', 'role:admin'])->group(function () {
    Route::get('/admin-test-pdf/{jeu}', [App\Http\Controllers\JeuController::class, 'generatePDF'])->name('admin.test.pdf');
    Route::get('/admin-test-xml/{jeu}', [App\Http\Controllers\XmlController::class, 'exportGame'])->name('admin.test.xml');
    Route::get('/admin-export-xml', [App\Http\Controllers\XmlController::class, 'exportUserData'])->name('admin.export.xml');
});

// Test functionality page for all authenticated users
Route::middleware(['auth'])->group(function () {
    Route::get('/test-functionality', function () {
        return Inertia::render('TestFunctionality');
    })->name('test-functionality');

});

// Categories and Platforms routes using controllers
Route::get('/categories', [App\Http\Controllers\CategoriesController::class, 'index'])->name('categories.index');
Route::get('/platforms', [App\Http\Controllers\PlatformsController::class, 'index'])->name('platforms.index');

// About, Contact, and Help routes
Route::get('/about', function () {
    return Inertia::render('About');
})->name('about');

Route::get('/contact', function () {
    return Inertia::render('Contact');
})->name('contact');

Route::get('/help/user-guide', function () {
    return Inertia::render('Help/UserGuide', [
        'locale' => app()->getLocale(),
    ]);
})->name('help.user-guide');

// Game Submission routes
Route::middleware(['auth', 'verified', 'role:developer,admin'])->group(function () {
    Route::resource('game-submissions', App\Http\Controllers\GameSubmissionController::class);
    Route::post('game-submissions/{id}/submit', [App\Http\Controllers\GameSubmissionController::class, 'submit'])->name('game-submissions.submit');
});

// Comment routes
Route::get('comments', [App\Http\Controllers\CommentController::class, 'index'])->name('comments.index');
Route::get('comments/{id}', [App\Http\Controllers\CommentController::class, 'show'])->name('comments.show');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::post('comments', [App\Http\Controllers\CommentController::class, 'store'])->name('comments.store');
    Route::put('comments/{id}', [App\Http\Controllers\CommentController::class, 'update'])->name('comments.update');
    Route::delete('comments/{id}', [App\Http\Controllers\CommentController::class, 'destroy'])->name('comments.destroy');
    Route::post('comments/{id}/flag', [App\Http\Controllers\CommentController::class, 'flag'])->name('comments.flag');
});

// Developer routes
Route::middleware(['auth', 'verified', 'role:developer,admin'])->prefix('developer')->name('developer.')->group(function () {
    // Dashboard route
    Route::get('dashboard', [App\Http\Controllers\Developer\DashboardController::class, 'index'])->name('dashboard');

    // Game routes
    Route::get('games/{id}', [App\Http\Controllers\GameSubmissionController::class, 'show'])->name('games.show');

    // Game details route for notifications
    Route::get('games/{id}/details', [App\Http\Controllers\Developer\GameController::class, 'show'])->name('games.details');

    // Diagnostic route to check games in database
    Route::get('diagnostic/games', function() {
        $user = Auth::user();
        $allGames = App\Models\Jeu::all();
        $userGames = App\Models\Jeu::where('developpeur_id', $user->id)->get();

        return [
            'user_id' => $user->id,
            'user_name' => $user->name,
            'user_role' => $user->role,
            'total_games_in_db' => $allGames->count(),
            'user_games_count' => $userGames->count(),
            'user_games' => $userGames->map(function($game) {
                return [
                    'id' => $game->id,
                    'title' => $game->titre,
                    'status' => $game->statut,
                    'developer_id' => $game->developpeur_id,
                    'created_at' => $game->created_at,
                ];
            })
        ];
    })->name('diagnostic.games');

    // Test route to create a game for the current user
    Route::get('diagnostic/create-test-game', function() {
        $user = Auth::user();

        try {
            // Create a test game
            $jeu = new App\Models\Jeu();
            $jeu->titre = 'Test Game ' . time();
            $jeu->slug = 'test-game-' . time();
            $jeu->description = 'This is a test game created for debugging purposes.';
            $jeu->date_sortie = now();
            $jeu->developpeur_id = $user->id;
            $jeu->statut = 'brouillon'; // Draft status
            $jeu->save();

            return [
                'success' => true,
                'message' => 'Test game created successfully',
                'game' => [
                    'id' => $jeu->id,
                    'title' => $jeu->titre,
                    'status' => $jeu->statut,
                    'developer_id' => $jeu->developpeur_id,
                ]
            ];
        } catch (\Exception $e) {
            return [
                'success' => false,
                'message' => 'Failed to create test game',
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ];
        }
    })->name('diagnostic.create-test-game');

    // Diagnostic route to check status values
    Route::get('diagnostic/status-check', function() {
        // Get all status values from the statuts table
        $statuses = App\Models\Statut::all();

        // Get all unique status values from the jeux table
        $gameStatuses = App\Models\Jeu::select('statut')->distinct()->get()->pluck('statut');

        // Get counts of games by status
        $statusCounts = App\Models\Jeu::select('statut', DB::raw('count(*) as count'))
            ->groupBy('statut')
            ->get()
            ->keyBy('statut')
            ->map(function($item) {
                return $item->count;
            })
            ->toArray();

        return [
            'defined_statuses' => $statuses->map(function($status) {
                return [
                    'code' => $status->code,
                    'description' => $status->description,
                ];
            }),
            'game_statuses' => $gameStatuses,
            'status_counts' => $statusCounts,
        ];
    })->name('diagnostic.status-check');

    // Route to fix game status values
    Route::get('diagnostic/fix-game-statuses', function() {
        // Valid status values
        $validStatuses = ['brouillon', 'en_attente', 'publie', 'rejete'];

        // Get all games with invalid status values
        $gamesWithInvalidStatus = App\Models\Jeu::whereNotIn('statut', $validStatuses)->get();

        $results = [
            'games_checked' => App\Models\Jeu::count(),
            'games_with_invalid_status' => $gamesWithInvalidStatus->count(),
            'fixed_games' => []
        ];

        // Fix games with invalid status values
        foreach ($gamesWithInvalidStatus as $game) {
            $oldStatus = $game->statut;

            // Map invalid status to valid status
            if (strtolower($oldStatus) == 'draft' || strtolower($oldStatus) == 'brouillon') {
                $game->statut = 'brouillon';
            } else if (strtolower($oldStatus) == 'pending' || strtolower($oldStatus) == 'en_attente') {
                $game->statut = 'en_attente';
            } else if (strtolower($oldStatus) == 'published' || strtolower($oldStatus) == 'publie') {
                $game->statut = 'publie';
            } else if (strtolower($oldStatus) == 'rejected' || strtolower($oldStatus) == 'rejete') {
                $game->statut = 'rejete';
            } else {
                // Default to draft if status is unknown
                $game->statut = 'brouillon';
            }

            $game->save();

            $results['fixed_games'][] = [
                'id' => $game->id,
                'title' => $game->titre,
                'old_status' => $oldStatus,
                'new_status' => $game->statut
            ];
        }

        return $results;
    })->name('diagnostic.fix-game-statuses');
});

// RAWG API Routes are defined in api.php

// Notification routes
Route::middleware(['auth', 'verified'])->prefix('notifications')->name('notifications.')->group(function () {
    Route::get('/', [App\Http\Controllers\NotificationController::class, 'index'])->name('index');
    Route::get('/all', [App\Http\Controllers\NotificationController::class, 'all'])->name('all');
    Route::get('/debug', [App\Http\Controllers\NotificationController::class, 'debug'])->name('debug');

    // Test routes for notifications
    Route::get('/test-notification', [App\Http\Controllers\NotificationController::class, 'createTestNotification'])->name('test-notification');
    Route::get('/test-notification-direct', function() {
        $user = Auth::user();
        $game = \App\Models\Jeu::first();

        if (!$game) {
            return response()->json(['error' => 'No games found for testing']);
        }

        // Create a notification based on user role
        if ($user->role === 'admin') {
            $user->notify(new \App\Notifications\NewGameSubmission($game));
            return response()->json(['success' => true, 'message' => 'Admin notification created']);
        } elseif ($user->role === 'developer' || $user->is_developer) {
            $user->notify(new \App\Notifications\GameApproved($game));
            return response()->json(['success' => true, 'message' => 'Developer notification created']);
        } else {
            $comment = \App\Models\Comment::first();
            if (!$comment) {
                return response()->json(['error' => 'No comments found for testing']);
            }
            $user->notify(new \App\Notifications\CommentApproved($comment));
            return response()->json(['success' => true, 'message' => 'User notification created']);
        }
    })->name('test-notification-direct');
    Route::post('/{id}/mark-as-read', [App\Http\Controllers\NotificationController::class, 'markAsRead'])->name('markAsRead');
    Route::post('/mark-all-as-read', [App\Http\Controllers\NotificationController::class, 'markAllAsRead'])->name('markAllAsRead');
    Route::delete('/{id}', [App\Http\Controllers\NotificationController::class, 'destroy'])->name('destroy');
    Route::delete('/', [App\Http\Controllers\NotificationController::class, 'destroyAll'])->name('destroyAll');

});

// User routes
Route::middleware(['auth', 'verified'])->prefix('user')->name('user.')->group(function () {
    Route::get('/dashboard', [App\Http\Controllers\DashboardController::class, 'index'])->name('dashboard');
});

// Wishlist routes
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/wishlist', [App\Http\Controllers\WishlistController::class, 'index'])->name('wishlist.index');
    Route::post('/wishlist', [App\Http\Controllers\WishlistController::class, 'store'])->name('wishlist.store');
    Route::delete('/wishlist/{id}', [App\Http\Controllers\WishlistController::class, 'destroy'])->name('wishlist.destroy');
});

// Rating routes
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/ratings', [App\Http\Controllers\RatingController::class, 'index'])->name('ratings.index');
    Route::get('/ratings/{id}/edit', [App\Http\Controllers\RatingController::class, 'edit'])->name('ratings.edit');
    Route::post('/ratings', [App\Http\Controllers\RatingController::class, 'store'])->name('ratings.store');
    Route::put('/ratings/{id}', [App\Http\Controllers\RatingController::class, 'update'])->name('ratings.update');
    Route::delete('/ratings/{id}', [App\Http\Controllers\RatingController::class, 'destroy'])->name('ratings.destroy');
});


// Admin routes
Route::middleware(['auth', 'verified', 'role:admin'])->prefix('admin')->name('admin.')->group(function () {
    // Game approval routes
    Route::get('game-approvals/approved', [App\Http\Controllers\Admin\GameApprovalController::class, 'approved'])->name('game-approvals.approved');
    Route::get('game-approvals/rejected', [App\Http\Controllers\Admin\GameApprovalController::class, 'rejected'])->name('game-approvals.rejected');
    Route::post('game-approvals/{id}/toggle-featured', [App\Http\Controllers\Admin\GameApprovalController::class, 'toggleFeatured'])->name('game-approvals.toggle-featured');
    Route::resource('game-approvals', App\Http\Controllers\Admin\GameApprovalController::class);

    // Email testing routes
    Route::get('email-test', [App\Http\Controllers\EmailTestController::class, 'index'])->name('email-test.index');
    Route::post('email-test/send', [App\Http\Controllers\EmailTestController::class, 'sendTestEmail'])->name('email-test.send');

    // User management routes
    Route::resource('users', App\Http\Controllers\Admin\UserManagementController::class);
    Route::post('users/{id}/assign-permissions', [App\Http\Controllers\Admin\UserManagementController::class, 'assignPermissions'])->name('users.assign-permissions');
    Route::post('users/{id}/toggle-status', [App\Http\Controllers\Admin\UserManagementController::class, 'toggleStatus'])->name('users.toggle-status');

    // Comment moderation routes
    Route::get('comment-moderation/flagged', [App\Http\Controllers\Admin\CommentModerationController::class, 'flagged'])->name('comment-moderation.flagged');
    Route::get('comment-moderation/approved', [App\Http\Controllers\Admin\CommentModerationController::class, 'approved'])->name('comment-moderation.approved');
    Route::resource('comment-moderation', App\Http\Controllers\Admin\CommentModerationController::class);
    Route::post('comments/{id}/approve', [App\Http\Controllers\CommentController::class, 'approve'])->name('comments.approve');
    Route::post('comments/{id}/reject', [App\Http\Controllers\CommentController::class, 'reject'])->name('comments.reject');

    // Diagnostic routes for troubleshooting
    Route::get('diagnostic/comments', [App\Http\Controllers\Admin\DiagnosticController::class, 'comments'])->name('diagnostic.comments');
    Route::get('diagnostic/fix-comments', [App\Http\Controllers\Admin\DiagnosticController::class, 'fixComments'])->name('diagnostic.fix-comments');
    Route::get('diagnostic/monitor-comments', [App\Http\Controllers\Admin\DiagnosticController::class, 'monitorComments'])->name('diagnostic.monitor-comments');

    // Diagnostic route for notifications
    Route::get('diagnostic/notifications', function() {
        $user = Auth::user();

        // Get all notifications for the user
        $notifications = \Illuminate\Notifications\DatabaseNotification::where('notifiable_id', $user->id)
                                                                     ->where('notifiable_type', get_class($user))
                                                                     ->orderBy('created_at', 'desc')
                                                                     ->get();

        // Create a test notification
        $game = \App\Models\Jeu::first();
        if ($game) {
            try {
                \Illuminate\Support\Facades\Notification::send(
                    \App\Models\User::where('id', $user->id)->get(),
                    new \App\Notifications\NewGameSubmission($game)
                );
                $success = true;
                $message = 'Test notification created successfully';
            } catch (\Exception $e) {
                $success = false;
                $message = 'Error creating test notification: ' . $e->getMessage();
            }
        } else {
            $success = false;
            $message = 'No games found for testing';
        }

        // Get updated notifications
        $updatedNotifications = \Illuminate\Notifications\DatabaseNotification::where('notifiable_id', $user->id)
                                                                            ->where('notifiable_type', get_class($user))
                                                                            ->orderBy('created_at', 'desc')
                                                                            ->get();

        return [
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role,
                'is_developer' => $user->is_developer,
                'has_notifiable_trait' => method_exists($user, 'notify'),
            ],
            'notifications_before' => $notifications->map(function($notification) {
                return [
                    'id' => $notification->id,
                    'type' => $notification->type,
                    'data' => $notification->data,
                    'read_at' => $notification->read_at,
                    'created_at' => $notification->created_at,
                ];
            }),
            'test_notification' => [
                'success' => $success,
                'message' => $message,
            ],
            'notifications_after' => $updatedNotifications->map(function($notification) {
                return [
                    'id' => $notification->id,
                    'type' => $notification->type,
                    'data' => $notification->data,
                    'read_at' => $notification->read_at,
                    'created_at' => $notification->created_at,
                ];
            }),
            'notification_count' => $updatedNotifications->count(),
            'unread_count' => $updatedNotifications->whereNull('read_at')->count(),
        ];
    })->name('diagnostic.notifications');

    // Review moderation routes
    Route::get('review-moderation', [App\Http\Controllers\Admin\ReviewModerationController::class, 'index'])->name('review-moderation.index');
    Route::get('review-moderation/create', [App\Http\Controllers\Admin\ReviewModerationController::class, 'create'])->name('review-moderation.create');
    Route::post('review-moderation', [App\Http\Controllers\Admin\ReviewModerationController::class, 'store'])->name('review-moderation.store');
    Route::get('review-moderation/view/{id}', [App\Http\Controllers\Admin\ReviewModerationController::class, 'show'])->name('review-moderation.show');
    Route::get('review-moderation/{id}/edit', [App\Http\Controllers\Admin\ReviewModerationController::class, 'edit'])->name('review-moderation.edit');
    Route::put('review-moderation/{id}', [App\Http\Controllers\Admin\ReviewModerationController::class, 'update'])->name('review-moderation.update');
    Route::delete('review-moderation/{id}', [App\Http\Controllers\Admin\ReviewModerationController::class, 'destroy'])->name('review-moderation.destroy');
    Route::get('review-moderation/flagged', [App\Http\Controllers\Admin\ReviewModerationController::class, 'flagged'])->name('review-moderation.flagged');
    Route::get('review-moderation/approved', [App\Http\Controllers\Admin\ReviewModerationController::class, 'approved'])->name('review-moderation.approved');

    // Dashboard route
    Route::get('dashboard', [App\Http\Controllers\Admin\DashboardController::class, 'index'])->name('dashboard');
});

require __DIR__.'/web_manual_replace.php';


