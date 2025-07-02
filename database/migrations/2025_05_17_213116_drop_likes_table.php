<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::dropIfExists('likes');
    }

    /**
     * Reverse the migrations.
     *
     * Recreate the likes table if needed
     */
    public function down(): void
    {
        Schema::create('likes', function (Blueprint $table) {
            $table->unsignedBigInteger('user_id');
            $table->unsignedBigInteger('jeu_id');
            $table->timestamps();

            $table->primary(['user_id', 'jeu_id']);

            $table->foreign('user_id')
                ->references('id')
                ->on('users')
                ->onDelete('cascade');

            $table->foreign('jeu_id')
                ->references('id')
                ->on('jeux')
                ->onDelete('cascade');
        });
    }
};
