<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Jeu;
use App\Models\User;
use App\Notifications\GameApproved;
use App\Notifications\GameRejected;
use App\Notifications\GameUnderReview;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class GameApprovalController extends Controller
{
    /**
     * Create a new controller instance.
     */
    public function __construct()
    {
        $this->middleware(['auth', 'verified', 'role:admin']);
    }
    /**
     * Display a listing of the games pending approval.
     */
    public function index()
    {
        // Add detailed logging to diagnose the issue
        Log::info('GameApprovalController::index - Starting to fetch pending games');

        // Get all games with status 'en_attente' to check if any exist
        $allPendingGames = Jeu::where('statut', 'en_attente')->get();
        Log::info('All pending games (regardless of developer): ' . $allPendingGames->count());

        // Log each pending game for debugging
        foreach ($allPendingGames as $game) {
            Log::info("Pending game found - ID: {$game->id}, Title: {$game->titre}, Developer ID: {$game->developpeur_id}, Status: {$game->statut}, Submitted at: {$game->submitted_at}");
        }

        // Get all developer-submitted games pending approval
        // Make sure we're using the same query as in the DashboardController
        $pendingGames = Jeu::where('statut', 'en_attente')
            ->whereNotNull('developpeur_id') // Only include games submitted by developers
            ->with(['developpeur', 'genres', 'plateformes'])
            ->orderBy('created_at', 'desc') // Use created_at which is always set
            ->paginate(10);

        // Log the count of pending games
        Log::info('Pending games count: ' . $pendingGames->total());

        // Log the actual games being returned for debugging
        foreach ($pendingGames as $index => $game) {
            Log::info("Pending game in paginated results - Index: {$index}, ID: {$game->id}, Title: {$game->titre}, Developer ID: {$game->developpeur_id}, Status: {$game->statut}");
        }

        Log::info('Admin checking pending games. Found: ' . $pendingGames->total());

        // Log the SQL query for debugging
        $query = Jeu::where('statut', 'en_attente')
            ->whereNotNull('developpeur_id')
            ->toSql();
        Log::info('SQL Query: ' . $query);

        // Get counts for different statuses (only for developer-submitted games)
        $counts = [
            'pending' => Jeu::where('statut', 'en_attente')
                ->whereNotNull('developpeur_id')
                ->count(),
            'approved' => Jeu::where('statut', 'publie')
                ->whereNotNull('developpeur_id')
                ->count(),
            'rejected' => Jeu::where('statut', 'rejete')
                ->whereNotNull('developpeur_id')
                ->count(),
            'total' => Jeu::whereNotNull('developpeur_id')
                ->count(),
            'with_rawg_id' => Jeu::whereNotNull('developpeur_id')
                ->whereNotNull('rawg_id')
                ->count(),
        ];

        return Inertia::render('Admin/GameApprovals/Index', [
            'pendingGames' => $pendingGames,
            'counts' => $counts,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     * Not used in this controller.
     */
    public function create()
    {
        abort(404);
    }

    /**
     * Store a newly created resource in storage.
     * Not used in this controller.
     */
    public function store(Request $request)
    {
        abort(404);
    }

    /**
     * Display the specified game for approval.
     */
    public function show(string $id)
    {
        $game = Jeu::with(['developpeur', 'genres', 'plateformes', 'tags'])
            ->findOrFail($id);

        // Notify the developer that their game is being reviewed
        if ($game->statut === 'en_attente') {
            $game->developpeur->notify(new GameUnderReview($game));
        }

        return Inertia::render('Admin/GameApprovals/Show', [
            'game' => $game,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     * Not used in this controller.
     */
    public function edit(string $id)
    {
        abort(404);
    }

    /**
     * Update the specified game's approval status.
     * This method handles both approving and rejecting games.
     */
    public function update(Request $request, string $id)
    {
        $game = Jeu::findOrFail($id);

        $validated = $request->validate([
            'action' => 'required|string|in:approve,reject',
            'feedback' => 'nullable|string|max:1000',
        ]);

        if ($validated['action'] === 'approve') {
            // Approve the game
            $game->statut = 'publie';
            $game->approved_at = now();
            $game->approved_by = Auth::id();
            $game->rejected_at = null;

            if ($request->filled('feedback')) {
                $game->feedback = $validated['feedback'];
            }

            $game->save();

            // Notify the developer
            $game->developpeur->notify(new GameApproved($game));

            return redirect()->route('admin.game-approvals.index')
                ->with('success', __('admin.game_approval.game_approved'));
        }
        elseif ($validated['action'] === 'reject') {
            // Reject the game
            $game->statut = 'rejete';
            $game->rejected_at = now();
            $game->approved_at = null;
            $game->approved_by = null;

            if ($request->filled('feedback')) {
                $game->feedback = $validated['feedback'];
            }

            $game->save();

            // Notify the developer
            $game->developpeur->notify(new GameRejected($game));

            return redirect()->route('admin.game-approvals.index')
                ->with('success', __('admin.game_approval.game_rejected'));
        }

        return redirect()->route('admin.game-approvals.index')
            ->with('error', __('admin.messages.operation_failed'));
    }

    /**
     * Remove the specified resource from storage.
     * Not used in this controller.
     */
    public function destroy(string $id)
    {
        abort(404);
    }

    /**
     * Display a list of approved games.
     */
    public function approved()
    {
        $approvedGames = Jeu::where('statut', 'publie')
            ->whereNotNull('developpeur_id') // Only include games submitted by developers
            ->with(['developpeur', 'genres', 'plateformes'])
            ->orderBy('approved_at', 'desc')
            ->paginate(10);

        return Inertia::render('Admin/GameApprovals/Approved', [
            'approvedGames' => $approvedGames,
        ]);
    }

    /**
     * Display a list of rejected games.
     */
    public function rejected()
    {
        $rejectedGames = Jeu::where('statut', 'rejete')
            ->whereNotNull('developpeur_id') // Only include games submitted by developers
            ->with(['developpeur', 'genres', 'plateformes'])
            ->orderBy('rejected_at', 'desc')
            ->paginate(10);

        return Inertia::render('Admin/GameApprovals/Rejected', [
            'rejectedGames' => $rejectedGames,
        ]);
    }

    /**
     * Feature or unfeature a game.
     */
    public function toggleFeatured(Request $request, string $id)
    {
        $game = Jeu::findOrFail($id);

        $game->featured = !$game->featured;
        $game->save();

        $status = $game->featured ? 'featured' : 'unfeatured';

        return redirect()->back()
            ->with('success', __("admin.game_approval.game_{$status}"));
    }
}
