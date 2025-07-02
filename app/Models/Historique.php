<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Historique extends Model
{
    protected $fillable = [
        'utilisateur_id', // ID de l'utilisateur
        'action',         // Action effectuée ('evaluation', 'wishlist', etc.)
        'details',        // Détails de l'action (JSON)
    ];

    // Relation avec l'utilisateur
    public function utilisateur()
    {
        return $this->belongsTo(User::class, 'utilisateur_id');
    }
}
