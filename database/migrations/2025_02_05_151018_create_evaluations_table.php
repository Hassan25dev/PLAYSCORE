<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateEvaluationsTable extends Migration
{
    public function up()
    {
        Schema::create('evaluations', function (Blueprint $table) {
            $table->unsignedBigInteger('utilisateur_id');
            $table->unsignedBigInteger('jeu_id');
            $table->tinyInteger('note')->unsigned()->checkBetween(1, 5); // Note entre 1 et 5
            $table->text('commentaire')->nullable();
            $table->timestamp('created_at')->useCurrent();

            $table->primary(['utilisateur_id', 'jeu_id']); // Clé composite

            $table->foreign('utilisateur_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('jeu_id')->references('id')->on('jeux')->onDelete('cascade');
        });
    }
    
    public function down()
    {
        Schema::dropIfExists('evaluations');
    }
}
