<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Wishlist extends Model
{
    protected $fillable = [
        'user_id',        // ID de l'utilisateur
        'jeu_id',         // ID du jeu
    ];

    // Clé composite pour éviter les doublons
    public $incrementing = false;
    protected $primaryKey = ['user_id', 'jeu_id'];

    // Relation avec l'utilisateur
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    // Relation avec le jeu
    public function jeu()
    {
        return $this->belongsTo(Jeu::class, 'jeu_id');
    }
}