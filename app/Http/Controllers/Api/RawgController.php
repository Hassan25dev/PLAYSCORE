<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\RawgService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class RawgController extends Controller
{
    protected $rawgService;

    /**
     * Create a new controller instance.
     */
    public function __construct(RawgService $rawgService)
    {
        // Middleware is applied in the routes file
        $this->rawgService = $rawgService;
    }

    /**
     * Search for games in the RAWG API.
     */
    public function search(Request $request)
    {
        $query = $request->input('query');

        if (empty($query)) {
            return response()->json(['results' => []]);
        }

        // Cache the results for 1 hour to avoid hitting the API rate limit
        $cacheKey = 'rawg_search_' . md5($query);

        return response()->json(
            Cache::remember($cacheKey, 3600, function () use ($query) {
                return $this->rawgService->searchGames($query);
            })
        );
    }

    /**
     * Get details for a specific game from the RAWG API.
     */
    public function getGame($id)
    {
        if (empty($id)) {
            return response()->json(['error' => 'Game ID is required'], 400);
        }

        // Cache the results for 1 day
        $cacheKey = 'rawg_game_' . $id;

        return response()->json(
            Cache::remember($cacheKey, 86400, function () use ($id) {
                return $this->rawgService->getGame($id);
            })
        );
    }

    /**
     * Proxy for fetching games list from RAWG API.
     */
    public function getGames(Request $request)
    {
        $page = $request->input('page', 1);
        $search = $request->input('search', '');
        $genres = $request->input('genres', '');
        $platforms = $request->input('platforms', '');
        $sort = $request->input('sort', '');

        // Create a unique cache key based on the parameters using JSON encoding for better uniqueness
        $cacheKey = 'rawg_games_' . md5(json_encode([
            'page' => $page,
            'search' => $search,
            'genres' => $genres,
            'platforms' => $platforms,
            'sort' => $sort
        ]));

        // Log the request parameters for debugging
        Log::info('RAWG getGames request:', [
            'page' => $page,
            'search' => $search,
            'genres' => $genres,
            'platforms' => $platforms,
            'sort' => $sort,
            'cache_key' => $cacheKey
        ]);

        try {
            // Get the results from the RAWG API - use shorter cache time (15 minutes) for filtered results
            $cacheDuration = (!empty($genres) || !empty($platforms)) ? 900 : 3600;
            $results = Cache::remember($cacheKey, $cacheDuration, function () use ($page, $search, $genres, $platforms, $sort) {
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

                if (!empty($search)) {
                    $params['search'] = $search;
                }

                if (!empty($genres)) {
                    $params['genres'] = $genres;
                }

                if (!empty($platforms)) {
                    $params['platforms'] = $platforms;
                }

                // Log the parameters being sent to the RAWG API
                Log::info('Calling RAWG API with params:', $params);

                $games = $this->rawgService->searchGames($search, $params);

                // Log the results for debugging
                Log::info('RAWG API results:', [
                    'count' => count($games),
                    'sample' => !empty($games) ? array_slice($games, 0, 2) : 'No games returned'
                ]);

                return $games;
            });

            // If no results from RAWG API, use fallback data
            if (empty($results)) {
                Log::warning('No results from RAWG API, using fallback data');
                $results = $this->getFallbackGames();
            }

            // Check if results is already in the expected format with pagination metadata
            if (is_array($results) && isset($results['results']) && isset($results['count'])) {
                // Results already has the expected structure, return it as is
                // Log the count for debugging
                Log::info('RawgController returning structured results with count:', [
                    'count' => $results['count'],
                    'results_count' => count($results['results'])
                ]);

                return response()->json($results)
                    ->header('Cache-Control', 'no-cache, no-store, must-revalidate')
                    ->header('Pragma', 'no-cache')
                    ->header('Expires', '0');
            } else {
                // Results is just an array of games, wrap it with pagination metadata
                // For fallback data, we should still provide a reasonable total count
                // Let's assume there are 500 games total (25 pages of 20 games)
                $totalCount = 500;

                Log::info('RawgController returning array results with fallback count:', [
                    'count' => $totalCount,
                    'results_count' => count($results)
                ]);

                return response()->json([
                    'results' => $results,
                    'count' => $totalCount,
                    'next' => $page < ceil($totalCount / 20) ? "/api/rawg/games?page=" . ($page + 1) : null,
                    'previous' => $page > 1 ? "/api/rawg/games?page=" . ($page - 1) : null
                ])->header('Cache-Control', 'no-cache, no-store, must-revalidate')
                  ->header('Pragma', 'no-cache')
                  ->header('Expires', '0');
            }
        } catch (\Exception $e) {
            Log::error('Error in getGames: ' . $e->getMessage(), [
                'exception' => get_class($e),
                'trace' => $e->getTraceAsString()
            ]);

            // Return fallback data in case of error
            $fallbackGames = $this->getFallbackGames();

            // For fallback data, we should still provide a reasonable total count
            // Let's assume there are 500 games total (25 pages of 20 games)
            $totalCount = 500;

            // Calculate total pages based on page size of 20
            $totalPages = ceil($totalCount / 20);

            Log::info('RawgController returning error fallback with count:', [
                'count' => $totalCount,
                'results_count' => count($fallbackGames),
                'total_pages' => $totalPages
            ]);

            return response()->json([
                'results' => $fallbackGames,
                'count' => $totalCount,
                'next' => $page < $totalPages ? "/api/rawg/games?page=" . ($page + 1) : null,
                'previous' => $page > 1 ? "/api/rawg/games?page=" . ($page - 1) : null,
                'error' => 'An error occurred while fetching games. Using fallback data.'
            ])->header('Cache-Control', 'no-cache, no-store, must-revalidate')
              ->header('Pragma', 'no-cache')
              ->header('Expires', '0');
        }
    }

    /**
     * Get fallback games data when RAWG API fails.
     */
    private function getFallbackGames()
    {
        return [
            [
                'id' => 3328,
                'name' => 'The Witcher 3: Wild Hunt',
                'background_image' => 'https://media.rawg.io/media/games/618/618c2031a07bbff6b4f611f10b6bcdbc.jpg',
                'released' => '2015-05-18',
                'rating' => 4.7,
            ],
            [
                'id' => 3498,
                'name' => 'Grand Theft Auto V',
                'background_image' => 'https://media.rawg.io/media/games/456/456dea5e1c7e3cd07060c14e96612001.jpg',
                'released' => '2013-09-17',
                'rating' => 4.5,
            ],
            [
                'id' => 4200,
                'name' => 'Portal 2',
                'background_image' => 'https://media.rawg.io/media/games/328/3283617cb7d75d67257fc58339188742.jpg',
                'released' => '2011-04-18',
                'rating' => 4.6,
            ],
            [
                'id' => 5286,
                'name' => 'Tomb Raider (2013)',
                'background_image' => 'https://media.rawg.io/media/games/021/021c4e21a1824d2526f925eff6324653.jpg',
                'released' => '2013-03-05',
                'rating' => 4.1,
            ],
            [
                'id' => 4291,
                'name' => 'Counter-Strike: Global Offensive',
                'background_image' => 'https://media.rawg.io/media/games/736/73619bd336c894d6941d926bfd563946.jpg',
                'released' => '2012-08-21',
                'rating' => 3.9,
            ],
            [
                'id' => 13536,
                'name' => 'Portal',
                'background_image' => 'https://media.rawg.io/media/games/7fa/7fa0b586293c5861ee32490e953a4996.jpg',
                'released' => '2007-10-09',
                'rating' => 4.5,
            ],
            [
                'id' => 12020,
                'name' => 'Left 4 Dead 2',
                'background_image' => 'https://media.rawg.io/media/games/d58/d588947d4286e7b5e0e12e1bea7d9844.jpg',
                'released' => '2009-11-17',
                'rating' => 4.1,
            ],
            [
                'id' => 5679,
                'name' => 'The Elder Scrolls V: Skyrim',
                'background_image' => 'https://media.rawg.io/media/games/7cf/7cfc9220b401b7a300e409e539c9afd5.jpg',
                'released' => '2011-11-11',
                'rating' => 4.4,
            ],
            [
                'id' => 4062,
                'name' => 'BioShock Infinite',
                'background_image' => 'https://media.rawg.io/media/games/fc1/fc1307a2774506b5bd65d7e8424664a7.jpg',
                'released' => '2013-03-26',
                'rating' => 4.4,
            ],
            [
                'id' => 802,
                'name' => 'Borderlands 2',
                'background_image' => 'https://media.rawg.io/media/games/588/588c6bdff3d4baf66ec36b1c05b793bf.jpg',
                'released' => '2012-09-18',
                'rating' => 4.0,
            ],
            [
                'id' => 3070,
                'name' => 'Fallout 4',
                'background_image' => 'https://media.rawg.io/media/games/d82/d82990b9c67ba0d2d09d4e6fa88885a7.jpg',
                'released' => '2015-11-09',
                'rating' => 3.8,
            ],
            [
                'id' => 28,
                'name' => 'Red Dead Redemption 2',
                'background_image' => 'https://media.rawg.io/media/games/511/5118aff5091cb3efec399c808f8c598f.jpg',
                'released' => '2018-10-26',
                'rating' => 4.6,
            ],
            [
                'id' => 32,
                'name' => 'Destiny 2',
                'background_image' => 'https://media.rawg.io/media/games/34b/34b1f1850a1c06fd971bc6ab3ac0ce0e.jpg',
                'released' => '2017-09-06',
                'rating' => 3.6,
            ],
            [
                'id' => 58175,
                'name' => 'God of War',
                'background_image' => 'https://media.rawg.io/media/games/4be/4be6a6ad0364751a96229c56bf69be59.jpg',
                'released' => '2018-04-20',
                'rating' => 4.6,
            ],
            [
                'id' => 3939,
                'name' => 'PAYDAY 2',
                'background_image' => 'https://media.rawg.io/media/games/73e/73eecb8909e0c39fb246f1c73e30ad92.jpg',
                'released' => '2013-08-13',
                'rating' => 3.5,
            ],
            [
                'id' => 278,
                'name' => 'Horizon Zero Dawn',
                'background_image' => 'https://media.rawg.io/media/games/b7d/b7d3f1715fa8381a4e780173a197a615.jpg',
                'released' => '2017-02-28',
                'rating' => 4.3,
            ],
            [
                'id' => 4459,
                'name' => 'Grand Theft Auto IV',
                'background_image' => 'https://media.rawg.io/media/games/4a0/4a0a1316102366260e6f38fd2a9cfdce.jpg',
                'released' => '2008-04-29',
                'rating' => 4.2,
            ],
            [
                'id' => 3272,
                'name' => 'Rocket League',
                'background_image' => 'https://media.rawg.io/media/games/8cc/8cce7c0e99dcc43d66c8efd42f9d03e3.jpg',
                'released' => '2015-07-07',
                'rating' => 3.9,
            ],
            [
                'id' => 41494,
                'name' => 'Cyberpunk 2077',
                'background_image' => 'https://media.rawg.io/media/games/26d/26d4437715bee60138dab4a7c8c59c92.jpg',
                'released' => '2020-12-10',
                'rating' => 4.1,
            ],
            [
                'id' => 422,
                'name' => 'Terraria',
                'background_image' => 'https://media.rawg.io/media/games/f46/f466571d536f2e3ea9e815ad17177501.jpg',
                'released' => '2011-05-16',
                'rating' => 4.0,
            ]
        ];
    }
    /**
     * Debug endpoint to check the raw RAWG API response
     */
    public function debugRawgApi(Request $request)
    {
        try {
            $apiKey = config('services.rawg.key');
            $response = Http::timeout(10)
                ->withHeaders([
                    'Accept' => 'application/json',
                    'User-Agent' => 'PlayScore/3.0'
                ])
                ->get('https://api.rawg.io/api/games', [
                    'key' => $apiKey,
                    'page' => $request->input('page', 1),
                    'page_size' => 20
                ]);

            if ($response->successful()) {
                $data = $response->json();

                // Log the full response for debugging
                Log::info('RAWG API Debug Response', [
                    'count' => $data['count'] ?? 'not present',
                    'next' => $data['next'] ?? 'not present',
                    'previous' => $data['previous'] ?? 'not present',
                    'results_count' => isset($data['results']) ? count($data['results']) : 'no results',
                ]);

                return response()->json([
                    'raw_response' => $data,
                    'count' => $data['count'] ?? null,
                    'next' => $data['next'] ?? null,
                    'previous' => $data['previous'] ?? null,
                    'results_count' => isset($data['results']) ? count($data['results']) : 0,
                ]);
            }

            return response()->json([
                'error' => 'API request failed',
                'status' => $response->status(),
                'body' => $response->body()
            ], 500);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Exception occurred',
                'message' => $e->getMessage()
            ], 500);
        }
    }
    
    /**
     * Clear the RAWG API cache.
     */
    public function clearCache(Request $request)
    {
        $type = $request->input('type', 'all');
        $count = 0;
        
        if ($type === 'all' || $type === 'games') {
            // Clear games cache - find all keys that start with rawg_games_
            $keys = Cache::get('rawg_games_cache_keys', []);
            foreach ($keys as $key) {
                Cache::forget($key);
                $count++;
            }
            Cache::forget('rawg_games_cache_keys');
            
            // Also clear any other game-related caches
            $pattern = 'rawg_game_*';
            foreach (Cache::getStore()->many([$pattern]) as $key => $value) {
                if (strpos($key, 'rawg_game_') === 0) {
                    Cache::forget($key);
                    $count++;
                }
            }
        }
        
        if ($type === 'all' || $type === 'genres') {
            // Clear genres cache
            Cache::forget('rawg_genres');
            $count++;
        }
        
        if ($type === 'all' || $type === 'platforms') {
            // Clear platforms cache
            Cache::forget('rawg_platforms');
            $count++;
        }
        
        // Log the cache clearing
        Log::info('RAWG API cache cleared', [
            'type' => $type,
            'count' => $count
        ]);
        
        return response()->json([
            'success' => true,
            'message' => "Cleared {$count} cache items",
            'type' => $type
        ]);
    }
}