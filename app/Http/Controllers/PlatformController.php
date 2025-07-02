<?php

namespace App\Http\Controllers;

use App\Models\Plateforme;

class PlatformController extends Controller
{
    // Retourner la liste des plateformes
    public function index()
    {
        $platforms = Plateforme::all();
        return response()->json($platforms);
    }
}
