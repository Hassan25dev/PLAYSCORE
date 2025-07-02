<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Statut extends Model
{
    use SoftDeletes;

    protected $primaryKey = 'code';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = ['code', 'description'];

    // Relation inverse avec les jeux
    public function jeux()
    {
        return $this->hasMany(Jeu::class, 'statut');
    }
}
