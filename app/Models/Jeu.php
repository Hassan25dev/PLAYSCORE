<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Jeu extends Model
{
    protected $table = 'jeux';
    protected $fillable = [
        'id',               // ID de l'API RAWG
        'slug',             // Slug unique
        'titre',            // Titre du jeu
        'description',      // Description
        'date_sortie',      // Date de sortie
        'image_arriere_plan', // Image d'arrière-plan
        'video_url',       // Video URL for game trailer/gameplay
        'video_path',      // Video path for uploaded game videos
        'rating',           // Note moyenne
        'metacritic',       // Score Metacritic
        'playtime_moyen',   // Temps de jeu moyen
        'developpeur_id',   // ID du développeur (dans users)
        'statut',           // Statut du jeu ('brouillon', 'en_attente', 'publie', 'rejete')
        'feedback',         // Feedback for the developer
        'submitted_at',     // When the game was submitted for approval
        'approved_at',      // When the game was approved
        'rejected_at',      // When the game was rejected
        'approved_by',      // Who approved the game
        'featured',         // Whether the game is featured
        'views',            // Number of views/visits to the game page
        'submission_data',  // Additional submission data (JSON)
        'rawg_id',          // ID from RAWG API
    ];

    protected $casts = [
        'date_sortie' => 'date',
        'rating' => 'float',
        'metacritic' => 'integer',
        'playtime_moyen' => 'integer',
        'submitted_at' => 'datetime',
        'approved_at' => 'datetime',
        'rejected_at' => 'datetime',
        'featured' => 'boolean',
        'views' => 'integer',
        'submission_data' => 'array',
    ];

    // Relation avec le développeur (utilisateur ayant is_developer = true)
    public function developpeur()
    {
        return $this->belongsTo(User::class, 'developpeur_id');
    }

    // Relation avec les évaluations
    public function evaluations()
    {
        return $this->hasMany(Evaluation::class);
    }

    // Relations Many-to-Many avec genres, plateformes et tags
    public function genres(): BelongsToMany
    {
        return $this->belongsToMany(Genre::class, 'jeux_genres');
    }

    public function plateformes(): BelongsToMany
    {
        return $this->belongsToMany(Plateforme::class, 'jeux_plateformes');
    }

    public function tags(): BelongsToMany
    {
        return $this->belongsToMany(Tag::class, 'jeux_tags');
    }

    // Relation avec la wishlist
    public function utilisateursWishlist()
    {
        return $this->belongsToMany(User::class, 'wishlists', 'jeu_id', 'user_id')->withTimestamps();
    }



    /**
     * Get the comments for the game.
     */
    public function comments()
    {
        return $this->hasMany(Comment::class, 'jeu_id');
    }

    /**
     * Get the user who approved the game.
     */
    public function approvedBy()
    {
        return $this->belongsTo(User::class, 'approved_by');
    }

    /**
     * Scope a query to only include featured games.
     */
    public function scopeFeatured($query)
    {
        return $query->where('featured', true);
    }

    /**
     * Scope a query to only include games with a specific status.
     */
    public function scopeWithStatus($query, $status)
    {
        return $query->where('statut', $status);
    }

    /**
     * Scope a query to only include pending games.
     */
    public function scopePending($query)
    {
        return $query->whereNotNull('submitted_at')
                    ->whereNull('approved_at')
                    ->whereNull('rejected_at');
    }

    /**
     * Scope a query to only include approved games.
     */
    public function scopeApproved($query)
    {
        return $query->whereNotNull('approved_at');
    }

    /**
     * Scope a query to only include rejected games.
     */
    public function scopeRejected($query)
    {
        return $query->whereNotNull('rejected_at');
    }
}