<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Create a new table with the desired structure
        Schema::create('evaluations_new', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('utilisateur_id');
            $table->unsignedBigInteger('jeu_id');
            $table->tinyInteger('note')->unsigned();
            $table->text('commentaire')->nullable();
            $table->boolean('is_approved')->default(false);
            $table->boolean('is_flagged')->default(false);
            $table->text('flag_reason')->nullable();
            $table->timestamp('created_at')->useCurrent();
            $table->timestamp('updated_at')->nullable();

            $table->unique(['utilisateur_id', 'jeu_id']);

            $table->foreign('utilisateur_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('jeu_id')->references('id')->on('jeux')->onDelete('cascade');
        });

        // Copy data from the old table to the new one
        DB::statement('INSERT INTO evaluations_new (utilisateur_id, jeu_id, note, commentaire, is_approved, is_flagged, flag_reason, created_at, updated_at)
                      SELECT utilisateur_id, jeu_id, note, commentaire, is_approved, is_flagged, flag_reason, created_at, updated_at FROM evaluations');

        // Drop the old table
        Schema::drop('evaluations');

        // Rename the new table to the original name
        Schema::rename('evaluations_new', 'evaluations');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Create a new table with the original structure
        Schema::create('evaluations_old', function (Blueprint $table) {
            $table->unsignedBigInteger('utilisateur_id');
            $table->unsignedBigInteger('jeu_id');
            $table->tinyInteger('note')->unsigned();
            $table->text('commentaire')->nullable();
            $table->boolean('is_approved')->default(false);
            $table->boolean('is_flagged')->default(false);
            $table->text('flag_reason')->nullable();
            $table->timestamp('created_at')->useCurrent();
            $table->timestamp('updated_at')->nullable();

            $table->primary(['utilisateur_id', 'jeu_id']);

            $table->foreign('utilisateur_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('jeu_id')->references('id')->on('jeux')->onDelete('cascade');
        });

        // Copy data from the current table to the old structure
        DB::statement('INSERT INTO evaluations_old (utilisateur_id, jeu_id, note, commentaire, is_approved, is_flagged, flag_reason, created_at, updated_at)
                      SELECT utilisateur_id, jeu_id, note, commentaire, is_approved, is_flagged, flag_reason, created_at, updated_at FROM evaluations');

        // Drop the current table
        Schema::drop('evaluations');

        // Rename the old structure table to the original name
        Schema::rename('evaluations_old', 'evaluations');
    }
};
