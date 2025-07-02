<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('jeux_plateformes', function (Blueprint $table) {
            $table->foreignId('jeu_id')->constrained('jeux')->onDelete('cascade');
            $table->foreignId('plateforme_id')->constrained('plateformes')->onDelete('cascade');
            $table->text('configuration_min')->nullable(); // Configuration minimale
            $table->text('configuration_rec')->nullable(); // Configuration recommandée
            $table->primary(['jeu_id', 'plateforme_id']);
        });
    }
    
    public function down()
    {
        Schema::dropIfExists('jeux_plateformes');
    }
};
