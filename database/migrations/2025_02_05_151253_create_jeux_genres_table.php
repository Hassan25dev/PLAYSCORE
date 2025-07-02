<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('jeux_genres', function (Blueprint $table) {
            $table->foreignId('jeu_id')->constrained('jeux')->onDelete('cascade');
            $table->foreignId('genre_id')->constrained('genres')->onDelete('cascade');
            $table->primary(['jeu_id', 'genre_id']);
        });
    }
    
    public function down()
    {
        Schema::dropIfExists('jeux_genres');
    }
};
