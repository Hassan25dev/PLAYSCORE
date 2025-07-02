<?php

namespace App\Http\Controllers;

use App\Models\Jeu;
use Barryvdh\DomPDF\Facade\Pdf;

class PdfController extends Controller
{
    // Exporter un jeu en PDF
    public function exportPdf(Jeu $jeu)
    {
        $pdf = Pdf::loadView('jeux.pdf', compact('jeu'));
        return $pdf->download("jeu-{$jeu->id}.pdf");
    }
}