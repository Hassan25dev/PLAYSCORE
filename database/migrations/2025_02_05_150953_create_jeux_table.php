<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('jeux', function (Blueprint $table) {
            $table->id();
            $table->string('slug', 255)->unique(); // Slug unique
            $table->string('titre', 255);
            $table->text('description')->nullable();
            $table->date('date_sortie');
            $table->string('image_arriere_plan', 511)->nullable();
            $table->float('rating')->nullable()->default(0); // Note moyenne
            $table->smallInteger('metacritic')->nullable()->default(0); // Score Metacritic
            $table->integer('playtime_moyen')->nullable(); // Temps de jeu moyen
            $table->foreignId('developpeur_id')->nullable()->constrained('users')->onDelete('set null');
            $table->string('statut', 20)->default('brouillon');
            $table->foreign('statut')->references('code')->on('statuts')->onDelete('restrict');
            $table->timestamps();
        });
    }
    
    public function down()
    {
        Schema::dropIfExists('jeux');
    }
};
