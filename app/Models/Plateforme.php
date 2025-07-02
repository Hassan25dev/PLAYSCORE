<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Plateforme extends Model
{
    public $timestamps = false;

    protected $fillable = [
        'id',    // ID de l'API RAWG
        'nom',   // Nom de la plateforme
        'slug',  // Slug unique
    ];

    // Relation Many-to-Many avec les jeux
    public function jeux(): BelongsToMany
    {
        return $this->belongsToMany(Jeu::class, 'jeux_plateformes')
            ->withPivot(['configuration_min', 'configuration_rec']);
    }
}
