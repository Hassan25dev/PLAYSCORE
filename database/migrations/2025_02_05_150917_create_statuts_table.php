<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('statuts', function (Blueprint $table) {
            $table->string('code', 20)->primary(); // Unique status code
            $table->string('description', 255)->nullable(); // Optional description
            $table->timestamps(); // Add created_at and updated_at columns
            $table->softDeletes(); // Add soft delete capability
        });
    }
    
    public function down()
    {
        Schema::dropIfExists('statuts');
    }
};
