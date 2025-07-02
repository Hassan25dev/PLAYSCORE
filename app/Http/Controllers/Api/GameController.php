<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Game;
use App\Models\Genre;
use App\Models\Platform;
use Illuminate\Http\Request;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\DB;

class GameController extends Controller
{
    public function index(Request $request)
    {
        $query = Game::with(['genres', 'platforms'])
            ->where('status', 'published')
            ->withCount('ratings')
            ->withAvg('ratings', 'rating');

        // Apply filters
        if ($request->filled('genre')) {
            $query->whereHas('genres', function($q) use ($request) {
                $q->where('genres.id', $request->genre);
            });
        }

        if ($request->filled('platform')) {
            $query->whereHas('platforms', function($q) use ($request) {
                $q->where('platforms.id', $request->platform);
            });
        }

        if ($request->filled('releaseDate')) {
            $query->whereDate('release_date', $request->releaseDate);
        }

        return $query->get();
    }

    public function show($id)
    {
        // Call stored procedure to update game statistics
        DB::statement("CALL UpdateGameStatistics(?)", [$id]);
        
        return Game::with(['genres', 'platforms', 'ratings.user'])
            ->withCount('ratings')
            ->withAvg('ratings', 'rating')
            ->findOrFail($id);
    }

    public function generatePdf($id)
    {
        $game = Game::with(['genres', 'platforms', 'ratings.user'])
            ->withCount('ratings')
            ->withAvg('ratings', 'rating')
            ->findOrFail($id);

        $pdf = PDF::loadView('pdf.game', ['game' => $game]);
        return $pdf->download($game->title . '.pdf');
    }
}