<?php

namespace App\Http\Controllers;

use App\Models\Jeu;

use App\Models\Evaluation;
use App\Models\Wishlist;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use SimpleXMLElement;
use Illuminate\Support\Str;

class XmlController extends Controller
{
    /**
     * Export a specific game to XML
     */
    public function exportGame(Jeu $jeu)
    {
        try {
            // Check if the user has permission to export this game
            if (auth()->check() && (auth()->user()->role === 'admin' || auth()->user()->role === 'developer')) {
                $xml = new SimpleXMLElement('<?xml version="1.0" encoding="UTF-8"?><game></game>');

                // Add game details
                $xml->addChild('id', $jeu->id);
                $xml->addChild('titre', htmlspecialchars($jeu->titre));
                $xml->addChild('slug', htmlspecialchars($jeu->slug));
                $xml->addChild('description', htmlspecialchars($jeu->description));
                $xml->addChild('date_sortie', $jeu->date_sortie);
                $xml->addChild('image_arriere_plan', htmlspecialchars($jeu->image_arriere_plan));
                $xml->addChild('rating', $jeu->rating);

                // Add genres if available
                if ($jeu->genres && count($jeu->genres) > 0) {
                    $genresNode = $xml->addChild('genres');
                    foreach ($jeu->genres as $genre) {
                        $genreNode = $genresNode->addChild('genre');
                        $genreNode->addChild('id', $genre->id);
                        $genreNode->addChild('name', htmlspecialchars($genre->name));
                    }
                }

                // Add platforms if available
                if ($jeu->plateformes && count($jeu->plateformes) > 0) {
                    $platformsNode = $xml->addChild('plateformes');
                    foreach ($jeu->plateformes as $platform) {
                        $platformNode = $platformsNode->addChild('plateforme');
                        $platformNode->addChild('id', $platform->id);
                        $platformNode->addChild('name', htmlspecialchars($platform->name));
                    }
                }

                // Set the content type to XML
                $headers = [
                    'Content-Type' => 'application/xml',
                    'Content-Disposition' => 'attachment; filename="' . Str::slug($jeu->titre) . '.xml"',
                ];

                // Return the XML as a download
                return response($xml->asXML(), 200, $headers);
            } else {
                return response()->json(['message' => 'Unauthorized. Only admins and developers can export games to XML.'], 403);
            }
        } catch (\Exception $e) {
            Log::error('XML Export Error: ' . $e->getMessage());
            return response()->json(['message' => 'Error exporting XML: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Export user data to XML
     */
    public function exportUserData()
    {
        try {
            $user = Auth::user();

            if (!$user) {
                return response()->json(['message' => 'User not authenticated'], 401);
            }

            // Check if the user has permission to export user data
            if (!($user->role === 'admin' || $user->role === 'developer')) {
                return response()->json(['message' => 'Unauthorized. Only admins and developers can export user data to XML.'], 403);
            }

            $xml = new SimpleXMLElement('<?xml version="1.0" encoding="UTF-8"?><user_data></user_data>');

            // Add user details
            $userNode = $xml->addChild('user');
            $userNode->addChild('id', $user->id);
            $userNode->addChild('name', htmlspecialchars($user->name));
            $userNode->addChild('email', htmlspecialchars($user->email));
            $userNode->addChild('created_at', $user->created_at);

            // Add evaluations
            $evaluations = Evaluation::where('utilisateur_id', $user->id)->with('jeu')->get();
            if ($evaluations->count() > 0) {
                $evaluationsNode = $xml->addChild('evaluations');
                foreach ($evaluations as $evaluation) {
                    $evaluationNode = $evaluationsNode->addChild('evaluation');
                    $evaluationNode->addChild('utilisateur_id', $evaluation->utilisateur_id);
                    $evaluationNode->addChild('jeu_id', $evaluation->jeu_id);
                    $evaluationNode->addChild('note', $evaluation->note);
                    $evaluationNode->addChild('created_at', $evaluation->created_at);

                    if ($evaluation->jeu) {
                        $gameNode = $evaluationNode->addChild('game');
                        $gameNode->addChild('id', $evaluation->jeu->id);
                        $gameNode->addChild('titre', htmlspecialchars($evaluation->jeu->titre));
                    }
                }
            }

            // Add wishlist
            $wishlistItems = Wishlist::where('user_id', $user->id)->with('jeu')->get();
            if ($wishlistItems->count() > 0) {
                $wishlistNode = $xml->addChild('wishlist');
                foreach ($wishlistItems as $item) {
                    $itemNode = $wishlistNode->addChild('item');
                    $itemNode->addChild('id', $item->id);
                    $itemNode->addChild('added_at', $item->created_at);

                    if ($item->jeu) {
                        $gameNode = $itemNode->addChild('game');
                        $gameNode->addChild('id', $item->jeu->id);
                        $gameNode->addChild('titre', htmlspecialchars($item->jeu->titre));
                    }
                }
            }

            // Set the content type to XML
            $headers = [
                'Content-Type' => 'application/xml',
                'Content-Disposition' => 'attachment; filename="user_data_' . $user->id . '.xml"',
            ];

            // Return the XML as a download
            return response($xml->asXML(), 200, $headers);
        } catch (\Exception $e) {
            Log::error('XML Export Error: ' . $e->getMessage());
            return response()->json(['message' => 'Error exporting XML: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Import data from XML
     */
    public function importXml(Request $request)
    {
        try {
            // Log the request details for debugging
            Log::info('XML Import Request', [
                'has_file' => $request->hasFile('xml_file'),
                'content_type' => $request->hasFile('xml_file') ? $request->file('xml_file')->getClientMimeType() : 'No file',
                'original_name' => $request->hasFile('xml_file') ? $request->file('xml_file')->getClientOriginalName() : 'No file',
                'file_extension' => $request->hasFile('xml_file') ? $request->file('xml_file')->getClientOriginalExtension() : 'No file',
                'all_files' => $request->allFiles(),
                'all_inputs' => $request->all(),
            ]);

            // Debug log to check if the file is being received
            Log::info('XML Import Debug', [
                'request_method' => $request->method(),
                'content_type' => $request->header('Content-Type'),
                'has_file' => $request->hasFile('xml_file'),
                'files' => $request->files->all(),
            ]);

            // Check if file exists in the request
            if (!$request->hasFile('xml_file')) {
                Log::error('XML Import Error: No file uploaded');
                return response()->json([
                    'message' => 'No file uploaded',
                    'errors' => ['xml_file' => ['Please select an XML file to upload']]
                ], 400);
            }

            $file = $request->file('xml_file');
            Log::info('File details', [
                'name' => $file->getClientOriginalName(),
                'size' => $file->getSize(),
                'mime' => $file->getMimeType(),
                'extension' => $file->getClientOriginalExtension(),
            ]);

            // Check if file is readable
            if (!$file->isReadable()) {
                Log::error('XML Import Error: File is not readable');
                return response()->json([
                    'message' => 'File is not readable',
                    'errors' => ['xml_file' => ['The uploaded file is not readable']]
                ], 400);
            }

            // Read file contents
            try {
                $contents = file_get_contents($file->getPathname());
                if (empty($contents)) {
                    Log::error('XML Import Error: File is empty');
                    return response()->json([
                        'message' => 'File is empty',
                        'errors' => ['xml_file' => ['The uploaded file is empty']]
                    ], 400);
                }

                // Check if content looks like XML
                $trimmedContents = trim($contents);
                if (!preg_match('/^<\?xml|^<[a-zA-Z0-9]+/', $trimmedContents)) {
                    Log::error('XML Import Error: File does not appear to be XML');
                    return response()->json([
                        'message' => 'File does not appear to be XML',
                        'errors' => ['xml_file' => ['The uploaded file does not appear to be in XML format']]
                    ], 400);
                }
            } catch (\Exception $e) {
                Log::error('XML Import Error: Failed to read file: ' . $e->getMessage());
                return response()->json([
                    'message' => 'Failed to read file',
                    'errors' => ['xml_file' => ['Failed to read the uploaded file: ' . $e->getMessage()]]
                ], 400);
            }

            // Try to parse as XML
            libxml_use_internal_errors(true);

            // Log the XML content for debugging
            Log::info('XML Content to Parse', [
                'content_preview' => substr($contents, 0, 500),
                'content_length' => strlen($contents)
            ]);

            // Try to parse with different methods
            $xml = null;

            // Method 1: simplexml_load_string with options
            $xml = simplexml_load_string($contents, 'SimpleXMLElement', LIBXML_NOERROR | LIBXML_NOWARNING | LIBXML_NOCDATA);

            if ($xml === false) {
                $errors = libxml_get_errors();
                libxml_clear_errors();

                $errorMessages = [];
                foreach ($errors as $error) {
                    $errorMessages[] = "Line {$error->line}: {$error->message}";
                }

                Log::error('XML Parse Errors (Method 1)', ['errors' => $errorMessages]);

                // Method 2: Try with DOMDocument
                try {
                    $dom = new \DOMDocument();
                    // Disable errors and warnings
                    $dom->recover = true;
                    $dom->strictErrorChecking = false;
                    $dom->validateOnParse = false;

                    // Try to load the XML
                    $result = @$dom->loadXML($contents, LIBXML_NOERROR | LIBXML_NOWARNING | LIBXML_NOCDATA);

                    if ($result) {
                        Log::info('XML parsed successfully with DOMDocument');
                        $xml = simplexml_import_dom($dom);
                    } else {
                        Log::error('XML Parse Errors (Method 2)', ['message' => 'DOMDocument failed to load XML']);

                        // Method 3: Try to fix common XML issues
                        Log::info('Attempting to fix XML content');

                        // Fix common XML issues
                        $fixedContents = $contents;

                        // Remove any BOM characters
                        $fixedContents = preg_replace('/^\xEF\xBB\xBF/', '', $fixedContents);

                        // Ensure XML declaration is at the start
                        if (!preg_match('/^\s*<\?xml/', $fixedContents)) {
                            $fixedContents = '<?xml version="1.0" encoding="UTF-8"?>' . "\n" . $fixedContents;
                        }

                        // Try to load the fixed XML
                        $xml = simplexml_load_string($fixedContents, 'SimpleXMLElement', LIBXML_NOERROR | LIBXML_NOWARNING | LIBXML_NOCDATA);

                        if ($xml !== false) {
                            Log::info('XML parsed successfully after fixing common issues');
                        } else {
                            Log::error('XML Parse Errors (Method 3)', ['message' => 'Failed to parse XML after fixing common issues']);
                        }
                    }
                } catch (\Exception $e) {
                    Log::error('XML Parse Errors (Method 2)', ['message' => $e->getMessage()]);
                }
            }

            // If still failed, return error
            if ($xml === false || $xml === null) {
                // Return detailed error response
                return response()->json([
                    'message' => 'Invalid XML format',
                    'errors' => ['xml_file' => $errorMessages ?? ['Failed to parse XML file']],
                    'debug_info' => [
                        'file_name' => $file->getClientOriginalName(),
                        'file_size' => $file->getSize(),
                        'file_mime' => $file->getMimeType(),
                        'content_preview' => substr($contents, 0, 100) . '...',
                        'content_length' => strlen($contents)
                    ]
                ], 400);
            }

            $user = Auth::user();

            if (!$user) {
                return response()->json(['message' => 'User not authenticated'], 401);
            }

            // Check if the user has permission to import XML data
            if (!($user->role === 'admin' || $user->role === 'developer')) {
                return response()->json(['message' => 'Unauthorized. Only admins and developers can import XML data.'], 403);
            }

            // XML has already been parsed and validated above

            // Process the XML data based on its structure
            // Log the XML structure for debugging
            Log::info('XML Structure', [
                'root_name' => $xml->getName(),
                'has_jeu' => isset($xml->jeu) ? 'yes' : 'no',
                'has_game' => isset($xml->game) ? 'yes' : 'no',
                'is_game_root' => $xml->getName() === 'game' ? 'yes' : 'no',
                'has_user_data' => isset($xml->user_data) ? 'yes' : 'no',
                'is_user_data_root' => $xml->getName() === 'user_data' ? 'yes' : 'no',
            ]);

            // More flexible XML structure handling
            if (isset($xml->jeu) || isset($xml->game) || $xml->getName() === 'game') {
                // This is a game XML
                $gameNodes = [];

                if (isset($xml->jeu)) {
                    $gameNodes = $xml->jeu;
                } elseif (isset($xml->game)) {
                    $gameNodes = $xml->game;
                } elseif ($xml->getName() === 'game') {
                    // The root element is a game
                    $gameNodes = [$xml];
                }

                $importedCount = 0;

                foreach ($gameNodes as $gameNode) {
                    // Check if required fields exist
                    if (!isset($gameNode->titre) && !isset($gameNode->title)) {
                        Log::warning('Skipping game import: Missing title/titre field');
                        continue;
                    }

                    $titre = (string) ($gameNode->titre ?? $gameNode->title ?? '');
                    $slug = (string) ($gameNode->slug ?? Str::slug($titre));

                    // Skip if no title or slug
                    if (empty($titre) || empty($slug)) {
                        Log::warning('Skipping game import: Empty title or slug', [
                            'titre' => $titre,
                            'slug' => $slug
                        ]);
                        continue;
                    }

                    try {
                        Jeu::updateOrCreate(
                            ['slug' => $slug],
                            [
                                'titre' => $titre,
                                'description' => (string) ($gameNode->description ?? ''),
                                'date_sortie' => (string) ($gameNode->date_sortie ?? $gameNode->release_date ?? date('Y-m-d')),
                                'image_arriere_plan' => (string) ($gameNode->image_arriere_plan ?? $gameNode->background_image ?? ''),
                            ]
                        );
                        $importedCount++;
                    } catch (\Exception $e) {
                        Log::error('Error importing game', [
                            'error' => $e->getMessage(),
                            'titre' => $titre,
                            'slug' => $slug
                        ]);
                    }
                }

                return response()->json([
                    'message' => 'Games imported successfully',
                    'count' => $importedCount
                ], 200);
            } elseif (isset($xml->user_data) || $xml->getName() === 'user_data') {
                // This is user data XML
                $userData = $xml->getName() === 'user_data' ? $xml : $xml->user_data;
                $importedCount = 0;

                // Import wishlist items if they exist
                if (isset($userData->wishlist)) {
                    foreach ($userData->wishlist->children() as $item) {
                        if (isset($item->game)) {
                            $gameId = (int) $item->game->id;

                            // Check if the game exists
                            $jeu = Jeu::find($gameId);

                            if ($jeu) {
                                // Add to wishlist if not already there
                                Wishlist::firstOrCreate([
                                    'user_id' => $user->id,
                                    'jeu_id' => $gameId,
                                ]);
                                $importedCount++;
                            }
                        }
                    }
                }

                return response()->json([
                    'message' => 'User data imported successfully',
                    'count' => $importedCount
                ], 200);
            } else {
                // Log the XML structure for debugging
                $childElements = [];
                foreach ($xml->children() as $child) {
                    $childElements[] = $child->getName();
                }

                Log::error('Unrecognized XML format', [
                    'root_element' => $xml->getName(),
                    'child_elements' => $childElements
                ]);

                return response()->json([
                    'message' => 'Unrecognized XML format',
                    'root_element' => $xml->getName(),
                    'expected_formats' => [
                        'game XML: <game>...</game> or <jeu>...</jeu>',
                        'user data XML: <user_data>...</user_data>'
                    ]
                ], 400);
            }
        } catch (\Exception $e) {
            Log::error('XML Import Error: ' . $e->getMessage());
            return response()->json(['message' => 'Error importing XML: ' . $e->getMessage()], 500);
        }
    }
}
