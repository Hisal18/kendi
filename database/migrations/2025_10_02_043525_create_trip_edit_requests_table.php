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
        Schema::create('trip_edit_requests', function (Blueprint $table) {
            $table->id();
            $table->foreignId('trip_id')->constrained()->onDelete('cascade');
            $table->foreignId('requested_by_user_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('approved_by_admin_id')->nullable()->constrained('users')->onDelete('set null'); // Admin yang menyetujui

            // Kolom ini menyimpan data form edit. JSON sangat cocok untuk menyimpan data lama dan baru.
            $table->json('old_data'); // Data trip sebelum diedit (JSON)
            $table->json('new_data'); // Data yang diajukan user (JSON)
            
            // Status Persetujuan: pending (menunggu), approved (disetujui), rejected (ditolak)
            $table->enum('status', ['pending', 'approved', 'rejected'])->default('pending');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('trip_edit_requests');
    }
};
