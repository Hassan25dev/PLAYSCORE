<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Http;
use Illuminate\Http\Request;
use App\Models\Jeu;

class RawgController extends Controller
{
    // Synchroniser un jeu depuis l'API RAWG
    public function syncGameFromRawg(Request $request)
    {
        $response = Http::get("https://api.rawg.io/api/games/{$request->id}", [
            'key' => config('services.rawg.key'),
        ]);

        if (!$response->successful()) {
            return back()->withErrors(['error' => __('rawg.api_error')]);
        }

        $data = $response->json();

        Jeu::updateOrCreate(
            ['slug' => $data['slug']],
            [
                'titre' => $data['name'],
                'description' => $data['description'],
                'date_sortie' => $data['released'],
                'image_arriere_plan' => $data['background_image'],
            ]
        );

        return back()->with('success', __('rawg.game_imported'));
    }
}