<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Parametre extends Model
{
    protected $fillable = [
        'utilisateur_id', // ID de l'utilisateur
        'cle',            // Clé du paramètre (ex. : 'language', 'theme')
        'valeur',         // Valeur du paramètre
    ];

    // Relation avec l'utilisateur
    public function utilisateur()
    {
        return $this->belongsTo(User::class, 'utilisateur_id');
    }
}
