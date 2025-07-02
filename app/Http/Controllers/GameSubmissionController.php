<?php

namespace App\Http\Controllers;

use App\Models\Jeu;
use App\Models\Genre;
use App\Models\Plateforme;
use App\Models\Tag;
use App\Models\User;
use App\Notifications\NewGameSubmission;
use App\Services\RawgService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

use Inertia\Inertia;

class GameSubmissionController extends Controller
{
    protected $rawgService;

    /**
     * Create a new controller instance.
     */
    public function __construct(RawgService $rawgService)
    {
        $this->middleware(['auth', 'verified', 'role:developer,admin']);
        $this->rawgService = $rawgService;
    }
    /**
     * Display a listing of the developer's game submissions.
     */
    public function index(Request $request)
    {
        $user = Auth::user();
        $filter = $request->query('filter');

        // Log the current user and filter for debugging
        Log::info('Developer dashboard accessed by user ID: ' . $user->id . ', Name: ' . $user->name . ', Role: ' . $user->role . ', Filter: ' . ($filter ?: 'none'));

        // Get all games submitted by the developer
        $submissions = Jeu::where('developpeur_id', $user->id)
            ->orderBy('created_at', 'desc')
            ->with(['genres', 'plateformes', 'tags'])
            ->get();

        // Log the query results for debugging
        Log::info('Developer games query results - Total games found: ' . $submissions->count());

        // Log each game for detailed debugging
        foreach ($submissions as $game) {
            Log::info('Game found - ID: ' . $game->id . ', Title: ' . $game->titre . ', Status: ' . $game->statut . ', Developer ID: ' . $game->developpeur_id);
        }

        // Group submissions by status
        // First, let's log all unique statuses to debug
        $uniqueStatuses = $submissions->pluck('statut')->unique()->toArray();
        Log::info('Unique statuses found in games: ' . implode(', ', $uniqueStatuses));

        // Group submissions by status with additional checks
        $grouped = [
            'brouillon' => $submissions->filter(function($game) {
                return $game->statut === 'brouillon';
            }),
            'en_attente' => $submissions->filter(function($game) {
                return $game->statut === 'en_attente';
            }),
            'publie' => $submissions->filter(function($game) {
                return $game->statut === 'publie';
            }),
            'rejete' => $submissions->filter(function($game) {
                return $game->statut === 'rejete';
            }),
        ];

        // Log the grouped counts for debugging
        Log::info('Grouped game counts - Drafts: ' . $grouped['brouillon']->count() .
                 ', Pending: ' . $grouped['en_attente']->count() .
                 ', Published: ' . $grouped['publie']->count() .
                 ', Rejected: ' . $grouped['rejete']->count());

        // Create stats using the same filtering approach for consistency
        $stats = [
            'total' => $submissions->count(),
            'pending' => $submissions->filter(function($game) { return $game->statut === 'en_attente'; })->count(),
            'published' => $submissions->filter(function($game) { return $game->statut === 'publie'; })->count(),
            'rejected' => $submissions->filter(function($game) { return $game->statut === 'rejete'; })->count(),
            'drafts' => $submissions->filter(function($game) { return $game->statut === 'brouillon'; })->count(),
        ];

        // Log the stats for debugging
        Log::info('Stats for dashboard - Total: ' . $stats['total'] .
                 ', Pending: ' . $stats['pending'] .
                 ', Published: ' . $stats['published'] .
                 ', Rejected: ' . $stats['rejected'] .
                 ', Drafts: ' . $stats['drafts']);

        // Convert the collections to arrays for better serialization
        $submissionsArray = [
            'brouillon' => $grouped['brouillon']->values()->toArray(),
            'en_attente' => $grouped['en_attente']->values()->toArray(),
            'publie' => $grouped['publie']->values()->toArray(),
            'rejete' => $grouped['rejete']->values()->toArray(),
        ];

        // Log the final data structure being sent to the frontend
        Log::info('Sending submissions to frontend - structure: ' . json_encode([
            'brouillon_count' => count($submissionsArray['brouillon']),
            'en_attente_count' => count($submissionsArray['en_attente']),
            'publie_count' => count($submissionsArray['publie']),
            'rejete_count' => count($submissionsArray['rejete']),
        ]));

        return Inertia::render('Developer/Submissions/Index', [
            'submissions' => $submissionsArray,
            'stats' => $stats,
            'filter' => $filter
        ]);
    }

    /**
     * Show the form for creating a new game submission.
     */
    public function create()
    {
        // Get all platforms, genres, and tags for the form
        $platforms = Plateforme::orderBy('nom')->get();
        $genres = Genre::orderBy('nom')->get();
        $tags = Tag::orderBy('nom')->get();

        return Inertia::render('Developer/Submissions/Create', [
            'platforms' => $platforms,
            'genres' => $genres,
            'tags' => $tags,
            'rawgEnabled' => !empty(config('services.rawg.key')),
        ]);
    }

    /**
     * Store a newly created game submission.
     */
    public function store(Request $request)
    {
        // Validate the request
        $validated = $request->validate([
            'titre' => 'required|string|max:255',
            'description' => 'required|string',
            'date_sortie' => 'required|date',
            'image_arriere_plan' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'video' => 'nullable|file|mimes:mp4,webm,ogg|max:20480', // 20MB max
            'plateforme_ids' => 'required|array|min:1',
            'plateforme_ids.*' => 'exists:plateformes,id',
            'genre_ids' => 'required|array|min:1',
            'genre_ids.*' => 'exists:genres,id',
            'tag_ids' => 'nullable|array',
            'tag_ids.*' => 'exists:tags,id',
            'rawg_id' => 'nullable|integer',
        ]);

        // Start a database transaction
        DB::beginTransaction();

        try {
            // Handle image upload
            $imagePath = null;
            if ($request->hasFile('image_arriere_plan')) {
                $imagePath = $request->file('image_arriere_plan')->store('jeux', 'public');
            }

            // Handle video upload
            $videoPath = null;
            $videoUrl = null;
            if ($request->hasFile('video')) {
                $videoPath = $request->file('video')->store('jeux/videos', 'public');
                // For video_url, you might want to store a URL to access the video
                $videoUrl = asset('storage/' . $videoPath);
            }

            // Create the game
            $jeu = new Jeu();
            $jeu->titre = $validated['titre'];
            $jeu->slug = Str::slug($validated['titre']) . '-' . time();
            $jeu->description = $validated['description'];
            $jeu->date_sortie = $validated['date_sortie'];
            $jeu->image_arriere_plan = $imagePath;
            $jeu->video_path = $videoPath;
            $jeu->video_url = $videoUrl;
            $jeu->developpeur_id = Auth::id();

            // Log developer ID assignment
            Log::info('Setting developer ID for new game: ' . Auth::id() . ' for game: ' . $validated['titre']);

            // Set status based on submit parameter
            // Convert to boolean to ensure proper comparison
            $submitForApproval = filter_var($request->input('submit', false), FILTER_VALIDATE_BOOLEAN);

            // Debug logging
            Log::info('Raw submit value: ' . $request->input('submit'));
            Log::info('Submit for approval value: ' . ($submitForApproval ? 'true' : 'false') . ' for game: ' . $validated['titre']);
            Log::info('Request data: ' . json_encode($request->all()));

            if ($submitForApproval) {
                $jeu->statut = 'en_attente'; // Pending approval
                $jeu->submitted_at = now();
                Log::info('Game submitted for approval: ' . $validated['titre'] . ' with status: ' . $jeu->statut);
            } else {
                $jeu->statut = 'brouillon'; // Default status is draft
                Log::info('Game saved as draft: ' . $validated['titre'] . ' with status: ' . $jeu->statut);
            }

            // Double-check status before saving
            Log::info('Final status before saving: ' . $jeu->statut . ' for game: ' . $validated['titre']);

            // If RAWG ID is provided, store it in the rawg_id field
            if (isset($validated['rawg_id']) && !empty($validated['rawg_id'])) {
                $jeu->rawg_id = $validated['rawg_id'];
                Log::info('Game submitted with RAWG ID: ' . $validated['rawg_id'] . ' for game: ' . $validated['titre']);
                // Removed warning about filtering as we've fixed the issue
            } else {
                Log::info('Game submitted without RAWG ID for game: ' . $validated['titre']);
            }

            // Save the game
            $jeu->save();

            // Attach platforms, genres, and tags
            $jeu->plateformes()->attach($validated['plateforme_ids']);
            $jeu->genres()->attach($validated['genre_ids']);

            if (isset($validated['tag_ids']) && !empty($validated['tag_ids'])) {
                $jeu->tags()->attach($validated['tag_ids']);
            }

            // Store additional submission data
            $jeu->submission_data = [
                'submitted_by' => Auth::id(),
                'submitted_at' => now(),
                'ip_address' => $request->ip(),
                'user_agent' => $request->userAgent(),
            ];
            $jeu->save();

            // Commit the transaction
            DB::commit();

            // If the game was submitted directly (not saved as draft)
            if ($request->input('submit', false)) {
                try {
                    // Notify admins about the new submission
                    $admins = User::where('role', 'admin')->get();
                    if ($admins->count() > 0) {
                        Notification::send($admins, new NewGameSubmission($jeu));
                        Log::info('Notifications sent to ' . $admins->count() . ' admins for game: ' . $jeu->titre);
                    } else {
                        Log::warning('No admins found to notify about new game submission: ' . $jeu->titre);
                    }
                } catch (\Exception $e) {
                    // Log the error but don't fail the transaction
                    Log::error('Failed to send notifications for game submission: ' . $e->getMessage());
                }
            }

            return redirect()->route('game-submissions.index')
                ->with('success', __('game.submission.success'));

        } catch (\Exception $e) {
            // Something went wrong, rollback the transaction
            DB::rollBack();

            // Log the error
            Log::error('Game submission failed: ' . $e->getMessage());

            return redirect()->back()
                ->withInput()
                ->withErrors(['error' => 'An error occurred while saving your game: ' . $e->getMessage()]);
        }
    }

    /**
     * Display the specified game submission.
     */
    public function show(string $id)
    {
        $jeu = Jeu::with(['genres', 'plateformes', 'tags', 'developpeur'])
            ->findOrFail($id);

        // Check if the user is authorized to view this submission
        if (Auth::id() !== $jeu->developpeur_id && Auth::user()->role !== 'admin') {
            abort(403, 'Unauthorized action.');
        }

        return Inertia::render('Developer/Submissions/Show', [
            'jeu' => $jeu,
            'evaluations' => $jeu->evaluations()->with('utilisateur')->get(),
        ]);
    }

    /**
     * Show the form for editing the specified game submission.
     */
    public function edit(string $id)
    {
        $jeu = Jeu::with(['genres', 'plateformes', 'tags'])
            ->findOrFail($id);

        // Check if the user is authorized to edit this submission
        if (Auth::id() !== $jeu->developpeur_id && Auth::user()->role !== 'admin') {
            abort(403, 'Unauthorized action.');
        }

        // Get all platforms, genres, and tags for the form
        $platforms = Plateforme::orderBy('nom')->get();
        $genres = Genre::orderBy('nom')->get();
        $tags = Tag::orderBy('nom')->get();

        return Inertia::render('Developer/Submissions/Edit', [
            'jeu' => $jeu,
            'platforms' => $platforms,
            'genres' => $genres,
            'tags' => $tags,
            'selectedPlatforms' => $jeu->plateformes->pluck('id'),
            'selectedGenres' => $jeu->genres->pluck('id'),
            'selectedTags' => $jeu->tags->pluck('id'),
        ]);
    }

    /**
     * Update the specified game submission.
     */
    public function update(Request $request, string $id)
    {
        $jeu = Jeu::findOrFail($id);

        // Check if the user is authorized to update this submission
        if (Auth::id() !== $jeu->developpeur_id && Auth::user()->role !== 'admin') {
            abort(403, 'Unauthorized action.');
        }

        // Validate the request
        $validated = $request->validate([
            'titre' => 'required|string|max:255',
            'description' => 'required|string',
            'date_sortie' => 'required|date',
            'image_arriere_plan' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'video' => 'nullable|file|mimes:mp4,webm,ogg|max:20480', // 20MB max
            'plateforme_ids' => 'required|array|min:1',
            'plateforme_ids.*' => 'exists:plateformes,id',
            'genre_ids' => 'required|array|min:1',
            'genre_ids.*' => 'exists:genres,id',
            'tag_ids' => 'nullable|array',
            'tag_ids.*' => 'exists:tags,id',
        ]);

        // Start a database transaction
        DB::beginTransaction();

        try {
            // Handle image upload if a new image is provided
            if ($request->hasFile('image_arriere_plan')) {
                // Delete the old image if it exists
                if ($jeu->image_arriere_plan) {
                    Storage::disk('public')->delete($jeu->image_arriere_plan);
                }

                // Store the new image
                $imagePath = $request->file('image_arriere_plan')->store('jeux', 'public');
                $jeu->image_arriere_plan = $imagePath;
            }

            // Handle video upload if a new video is provided
            if ($request->hasFile('video')) {
                // Delete the old video if it exists
                if ($jeu->video_path) {
                    Storage::disk('public')->delete($jeu->video_path);
                }

                // Store the new video
                $videoPath = $request->file('video')->store('jeux/videos', 'public');
                $jeu->video_path = $videoPath;
                $jeu->video_url = asset('storage/' . $videoPath);
            }

            // Log the original date_sortie value for debugging
            Log::info('Original date_sortie value: ' . $jeu->date_sortie . ' for game: ' . $jeu->titre);
            Log::info('Submitted date_sortie value: ' . $validated['date_sortie'] . ' for game: ' . $jeu->titre);

            // Update the game
            $jeu->titre = $validated['titre'];
            $jeu->description = $validated['description'];
            $jeu->date_sortie = $validated['date_sortie'];

            // Log the updated date_sortie value for debugging
            Log::info('Updated date_sortie value: ' . $jeu->date_sortie . ' for game: ' . $jeu->titre);

            // If the game is in draft status and the user wants to submit it
            // Convert to boolean to ensure proper comparison
            $submitForApproval = filter_var($request->input('submit', false), FILTER_VALIDATE_BOOLEAN);

            if ($jeu->statut === 'brouillon' && $submitForApproval) {
                $jeu->statut = 'en_attente';
                $jeu->submitted_at = now();
                Log::info('Game updated and submitted for approval: ' . $validated['titre']);
            }

            // Save the game
            $jeu->save();

            // Sync platforms, genres, and tags
            $jeu->plateformes()->sync($validated['plateforme_ids']);
            $jeu->genres()->sync($validated['genre_ids']);

            if (isset($validated['tag_ids'])) {
                $jeu->tags()->sync($validated['tag_ids']);
            } else {
                $jeu->tags()->detach();
            }

            // If the game is being submitted, notify admins
            if ($jeu->statut === 'en_attente' && $request->input('submit', false)) {
                try {
                    $admins = User::where('role', 'admin')->get();
                    if ($admins->count() > 0) {
                        Notification::send($admins, new NewGameSubmission($jeu));
                        Log::info('Notifications sent to ' . $admins->count() . ' admins for game update: ' . $jeu->titre);
                    } else {
                        Log::warning('No admins found to notify about game update: ' . $jeu->titre);
                    }
                } catch (\Exception $e) {
                    // Log the error but don't fail the transaction
                    Log::error('Failed to send notifications for game update: ' . $e->getMessage());
                }
            }

            // Commit the transaction
            DB::commit();

            return redirect()->route('game-submissions.show', $jeu->id)
                ->with('success', __('game.submission.update_success'));

        } catch (\Exception $e) {
            // Something went wrong, rollback the transaction
            DB::rollBack();

            // Log the error
            Log::error('Game update failed: ' . $e->getMessage());

            return redirect()->back()
                ->withInput()
                ->withErrors(['error' => 'An error occurred while updating your game: ' . $e->getMessage()]);
        }
    }

    /**
     * Remove the specified game submission.
     */
    public function destroy(string $id)
    {
        $jeu = Jeu::findOrFail($id);

        // Check if the user is authorized to delete this submission
        if (Auth::id() !== $jeu->developpeur_id && Auth::user()->role !== 'admin') {
            abort(403, 'Unauthorized action.');
        }

        // Start a database transaction
        DB::beginTransaction();

        try {
            // Delete the image if it exists
            if ($jeu->image_arriere_plan) {
                Storage::disk('public')->delete($jeu->image_arriere_plan);
            }

            // Delete the video if it exists
            if ($jeu->video_path) {
                Storage::disk('public')->delete($jeu->video_path);
            }

            // Delete the game and its relationships
            $jeu->plateformes()->detach();
            $jeu->genres()->detach();
            $jeu->tags()->detach();
            $jeu->evaluations()->delete();
            $jeu->comments()->delete();
            $jeu->delete();

            // Commit the transaction
            DB::commit();

            return redirect()->route('game-submissions.index')
                ->with('success', __('game.submission.deleted'));

        } catch (\Exception $e) {
            // Something went wrong, rollback the transaction
            DB::rollBack();

            // Log the error
            Log::error('Game deletion failed: ' . $e->getMessage());

            return redirect()->back()
                ->withErrors(['error' => 'An error occurred while deleting your game: ' . $e->getMessage()]);
        }
    }

    /**
     * Submit a game for approval.
     */
    public function submit(string $id)
    {
        $jeu = Jeu::findOrFail($id);

        // Check if the user is authorized to submit this game
        if (Auth::id() !== $jeu->developpeur_id && Auth::user()->role !== 'admin') {
            abort(403, 'Unauthorized action.');
        }

        // Check if the game is in draft status
        if ($jeu->statut !== 'brouillon') {
            return redirect()->route('game-submissions.show', $jeu->id)
                ->with('error', 'Only draft games can be submitted for approval.');
        }

        // Debug logging
        Log::info('Explicitly submitting game for approval: ' . $jeu->titre . ' (ID: ' . $jeu->id . ')');

        // Start a database transaction
        DB::beginTransaction();

        try {
            // Update the game status
            $jeu->statut = 'en_attente';
            $jeu->submitted_at = now();
            $jeu->save();

            Log::info('Game explicitly submitted for approval: ' . $jeu->titre);

            // Notify admins about the new submission
            try {
                $admins = User::where('role', 'admin')->get();
                if ($admins->count() > 0) {
                    Notification::send($admins, new NewGameSubmission($jeu));
                    Log::info('Notifications sent to ' . $admins->count() . ' admins for explicit game submission: ' . $jeu->titre);
                } else {
                    Log::warning('No admins found to notify about explicit game submission: ' . $jeu->titre);
                }
            } catch (\Exception $e) {
                // Log the error but don't fail the transaction
                Log::error('Failed to send notifications for explicit game submission: ' . $e->getMessage());
            }

            // Commit the transaction
            DB::commit();

            return redirect()->route('game-submissions.show', $jeu->id)
                ->with('success', __('game.submission.success'));

        } catch (\Exception $e) {
            // Something went wrong, rollback the transaction
            DB::rollBack();

            // Log the error
            Log::error('Game submission failed: ' . $e->getMessage());

            return redirect()->back()
                ->withErrors(['error' => 'An error occurred while submitting your game: ' . $e->getMessage()]);
        }
    }
}
