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
        Schema::create('tamus', function (Blueprint $table) {
            $table->id();
            $table->string('plat_kendaraan')->unique();
            $table->dateTime('waktu_kedatangan');
            $table->dateTime('waktu_kepergian')->nullable();
            $table->json('foto_kedatangan');
            $table->json('foto_kepergian')->nullable();
            $table->enum('status', ['New', 'Close'])->default('New');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tamus');
    }
};
