<?php

namespace App\Http\Controllers;

use App\Models\Genre;

class GenreController extends Controller
{
    // Retourner la liste des genres
    public function index()
    {
        $genres = Genre::all();
        return response()->json($genres);
    }
}
