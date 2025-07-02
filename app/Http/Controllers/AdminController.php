<?php

namespace App\Http\Controllers;

use App\Models\Jeu;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use App\Mail\GamePublishedMail;

class AdminController extends Controller
{
    // Tableau de bord administratif
    public function index()
    {
        $jeuxEnAttente = Jeu::where('statut', 'en_attente')->get();
        return view('admin.index', compact('jeuxEnAttente'));
    }

    // Valider un jeu
    public function approveGame(Jeu $jeu)
    {
        $jeu->update(['statut' => 'publie']);
        return back()->with('success', __('admin.game_approved'));
    }

    // Rejeter un jeu
    public function rejectGame(Jeu $jeu)
    {
        $jeu->update(['statut' => 'rejete']);
        return back()->with('success', __('admin.game_rejected'));
    }

    // Envoyer un email au développeur
    public function notifyDeveloper(Jeu $jeu)
    {
        Mail::to($jeu->developpeur->email)->send(new GamePublishedMail($jeu));
        return back()->with('success', __('admin.email_sent'));
    }
}