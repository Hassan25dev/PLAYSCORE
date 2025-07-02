<?php

namespace App\Http\Controllers\Developer;

use App\Http\Controllers\Controller;
use App\Models\Jeu;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class GameController extends Controller
{
    /**
     * Create a new controller instance.
     */
    public function __construct()
    {
        $this->middleware(['auth', 'verified', 'role:developer,admin']);
    }

    /**
     * Display the specified game details.
     */
    public function show(string $id)
    {
        $jeu = Jeu::with(['genres', 'plateformes', 'tags', 'developpeur', 'evaluations.utilisateur', 'comments.user'])->findOrFail($id);

        // Check if the user is authorized to view this game
        if (Auth::id() !== $jeu->developpeur_id && Auth::user()->role !== 'admin') {
            abort(403, 'Unauthorized action.');
        }

        return Inertia::render('Developer/Games/Show', [
            'jeu' => $jeu,
        ]);
    }
}
