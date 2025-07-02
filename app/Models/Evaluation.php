<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Evaluation extends Model
{
    protected $fillable = [
        'utilisateur_id', // ID de l'utilisateur
        'jeu_id',         // ID du jeu
        'note',           // Note (1 à 5)
        'commentaire',    // Commentaire optionnel
        'is_approved',    // Whether the review is approved
        'is_flagged',     // Whether the review is flagged
        'flag_reason',    // Reason for flagging
    ];

    // Define a custom method to handle finding records by user and game
    public static function findByUserAndGame($userId, $gameId)
    {
        return static::where('utilisateur_id', $userId)
                     ->where('jeu_id', $gameId)
                     ->first();
    }

    protected $casts = [
        'note' => 'integer',
        'is_approved' => 'boolean',
        'is_flagged' => 'boolean',
    ];

    // Relation avec l'utilisateur
    public function utilisateur()
    {
        return $this->belongsTo(User::class, 'utilisateur_id');
    }

    // Relation avec le jeu
    public function jeu()
    {
        return $this->belongsTo(Jeu::class, 'jeu_id');
    }
}
