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
            $table->text('feedback')->nullable()->after('statut');
            $table->timestamp('submitted_at')->nullable()->after('feedback');
            $table->timestamp('approved_at')->nullable()->after('submitted_at');
            $table->timestamp('rejected_at')->nullable()->after('approved_at');
            $table->foreignId('approved_by')->nullable()->after('rejected_at')->constrained('users')->onDelete('set null');
            $table->boolean('featured')->default(false)->after('approved_by');
            $table->json('submission_data')->nullable()->after('featured');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('jeux', function (Blueprint $table) {
            $table->dropColumn([
                'feedback',
                'submitted_at',
                'approved_at',
                'rejected_at',
                'approved_by',
                'featured',
                'submission_data'
            ]);
        });
    }
};
