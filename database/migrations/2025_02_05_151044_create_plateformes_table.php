<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('plateformes', function (Blueprint $table) {
            $table->id(); // ID de l'API RAWG
            $table->string('nom', 50);
            $table->string('slug', 50)->unique();
        });
    }
    
    public function down()
    {
        Schema::dropIfExists('plateformes');
    }
};
