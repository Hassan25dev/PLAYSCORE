<?php

namespace App\Http\Controllers;

use App\Models\Jeu;
use Illuminate\Http\Request;
use SimpleXMLElement;

class ExportController extends Controller
{
    // Exporter les jeux vers XML
    public function exportGames()
    {
        $jeux = Jeu::all();
        $xml = new SimpleXMLElement('<jeux/>');

        foreach ($jeux as $jeu) {
            $gameNode = $xml->addChild('jeu');
            $gameNode->addChild('titre', $jeu->titre);
            $gameNode->addChild('description', $jeu->description);
            $gameNode->addChild('date_sortie', $jeu->date_sortie);
        }

        return response($xml->asXML())->header('Content-Type', 'text/xml');
    }

    // Importer des jeux depuis XML
    public function importGames(Request $request)
    {
        $this->validate($request, [
            'xml_file' => 'required|file',
        ]);

        $xml = simplexml_load_file($request->file('xml_file')->getPathname());

        foreach ($xml->jeu as $game) {
            Jeu::updateOrCreate(
                ['slug' => (string) $game->slug],
                [
                    'titre' => (string) $game->titre,
                    'description' => (string) $game->description,
                    'date_sortie' => (string) $game->date_sortie,
                ]
            );
        }

        return back()->with('success', __('exports.import_success'));
    }
}