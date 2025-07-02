<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Cache;

class RawgService
{
    /**
     * Track a cache key for later clearing
     */
    private function trackCacheKey(string $key)
    {
        $keys = Cache::get('rawg_games_cache_keys', []);
        if (!in_array($key, $keys)) {
            $keys[] = $key;
            Cache::put('rawg_games_cache_keys', $keys, 86400 * 7); // Store for a week
        }
    }
    // Récupérer les détails d'un jeu depuis l'API RAWG
    public function getGame(int $id)
    {
        // Cache key for this specific game
        $cacheKey = "rawg_game_{$id}";

        // Log the request for debugging
        Log::info('RAWG getGame request for ID: ' . $id);

        // Try to get from cache first (cache for 1 week)
        return Cache::remember($cacheKey, 604800, function() use ($id) {
            try {
                // Check if RAWG API key is configured
                $apiKey = config('services.rawg.key');
                if (empty($apiKey)) {
                    Log::error('RAWG API key is not configured');
                    return null;
                }

                // Set a timeout for the HTTP request
                $response = Http::timeout(10)
                    ->withHeaders([
                        'Accept' => 'application/json',
                        'User-Agent' => 'PlayScore/3.0'
                    ])
                    ->get("https://api.rawg.io/api/games/$id", [
                        'key' => $apiKey,
                    ]);

                if ($response->successful()) {
                    $data = $response->json();
                    Log::info('RAWG API game details response successful for ID: ' . $id);
                    return $data;
                }

                // Log detailed error information
                Log::error('RAWG API Error Response for game ID: ' . $id, [
                    'status' => $response->status(),
                    'body' => $response->body(),
                    'headers' => $response->headers()
                ]);

                return null;
            } catch (\Exception $e) {
                Log::error('RAWG API Exception for game ID: ' . $id, [
                    'message' => $e->getMessage(),
                    'class' => get_class($e),
                    'trace' => $e->getTraceAsString()
                ]);
                return null;
            }
        });
    }

    // Rechercher des jeux via l'API RAWG
    public function searchGames(string $query, array $params = [])
    {
        // Create a unique cache key based on the query and parameters
        $cacheKey = 'rawg_search_' . md5($query . serialize($params));

        // Track this cache key for later clearing
        $this->trackCacheKey($cacheKey);
        
        // Log the cache key for debugging
        Log::info('RAWG searchGames cache key: ' . $cacheKey);

        // Cache for 1 hour (3600 seconds) - reduced from 24 hours for more frequent updates
        return Cache::remember($cacheKey, 3600, function() use ($query, $params) {
            try {
                // Check if RAWG API key is configured
                $apiKey = config('services.rawg.key');
                if (empty($apiKey)) {
                    Log::error('RAWG API key is not configured');
                    return [];
                }

                $defaultParams = [
                    'key' => $apiKey,
                ];

                // Only add search if query is not empty
                if (!empty($query)) {
                    $defaultParams['search'] = $query;
                }

                $allParams = array_merge($defaultParams, $params);

                // Handle genres parameter - RAWG expects comma-separated values
                if (isset($allParams['genres']) && !empty($allParams['genres'])) {
                    $genreIds = explode(',', $allParams['genres']);
                    $cleanGenreIds = array_filter(array_map('trim', $genreIds));
                    
                    if (!empty($cleanGenreIds)) {
                        // RAWG API expects genres as a single parameter
                        $allParams['genres'] = implode(',', $cleanGenreIds);
                        Log::info('Processed genres parameter:', ['genres' => $allParams['genres']]);
                    } else {
                        unset($allParams['genres']);
                    }
                }

                // Handle platforms parameter - RAWG expects comma-separated values
                if (isset($allParams['platforms']) && !empty($allParams['platforms'])) {
                    $platformIds = explode(',', $allParams['platforms']);
                    $cleanPlatformIds = array_filter(array_map('trim', $platformIds));
                    
                    if (!empty($cleanPlatformIds)) {
                        // RAWG API expects platforms as a single parameter
                        $allParams['platforms'] = implode(',', $cleanPlatformIds);
                        Log::info('Processed platforms parameter:', ['platforms' => $allParams['platforms']]);
                    } else {
                        unset($allParams['platforms']);
                    }
                }

                // Log the request parameters
                Log::info('RAWG API Request:', array_merge(
                    $allParams,
                    ['api_key_set' => !empty($apiKey)]
                ));

                // Set a timeout for the HTTP request
                $response = Http::timeout(10)
                    ->withHeaders([
                        'Accept' => 'application/json',
                        'User-Agent' => 'PlayScore/3.0'
                    ])
                    ->get('https://api.rawg.io/api/games', $allParams);

                if ($response->successful()) {
                    $data = $response->json();

                    // Check if the response contains the expected data structure
                    if (!isset($data['results'])) {
                        Log::warning('RAWG API Response missing results key:', [
                            'response_keys' => array_keys($data),
                            'sample' => json_encode(array_slice($data, 0, 2))
                        ]);
                        return [];
                    }

                    Log::info('RAWG API Response successful', [
                        'count' => $data['count'] ?? count($data['results']),
                        'total_results' => count($data['results']),
                        'next' => isset($data['next']) ? 'present' : 'not present',
                        'previous' => isset($data['previous']) ? 'present' : 'not present',
                        'sample_keys' => !empty($data['results']) ? array_keys($data['results'][0]) : []
                    ]);

                    // Return the full response data with pagination metadata
                    // Make sure to return the total count from the API, not just the count of current results
                    $totalCount = isset($data['count']) ? (int)$data['count'] : count($data['results']);

                    // Log the total count for debugging
                    Log::info('RAWG API total count:', ['count' => $totalCount]);

                    return [
                        'results' => $data['results'] ?? [],
                        'count' => $totalCount,
                        'next' => $data['next'] ?? null,
                        'previous' => $data['previous'] ?? null
                    ];
                }

                // Log detailed error information
                Log::error('RAWG API Error Response', [
                    'status' => $response->status(),
                    'body' => $response->body(),
                    'headers' => $response->headers()
                ]);

                return [];
            } catch (\Exception $e) {
                Log::error('RAWG API Exception', [
                    'message' => $e->getMessage(),
                    'class' => get_class($e),
                    'trace' => $e->getTraceAsString()
                ]);
                return [];
            }
        });
    }
}