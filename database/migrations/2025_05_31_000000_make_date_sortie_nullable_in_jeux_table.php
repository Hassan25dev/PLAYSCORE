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
        Schema::table('jeux', function (Blueprint $table) {
            // Make date_sortie field nullable
            $table->date('date_sortie')->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('jeux', function (Blueprint $table) {
            // Revert back to non-nullable
            $table->date('date_sortie')->nullable(false)->change();
        });
    }
};
