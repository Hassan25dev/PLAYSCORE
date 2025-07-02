<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Tag extends Model
{
    public $timestamps = false;

    protected $fillable = [
        'id',    // ID de l'API RAWG
        'nom',   // Nom du tag
        'slug',  // Slug unique
    ];

    // Relation Many-to-Many avec les jeux
    public function jeux(): BelongsToMany
    {
        return $this->belongsToMany(Jeu::class, 'jeux_tags');
    }
}