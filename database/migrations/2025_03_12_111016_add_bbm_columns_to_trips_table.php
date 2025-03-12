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
        Schema::table('trips', function (Blueprint $table) {
            $table->string('jenis_bbm')->nullable();
            $table->decimal('jumlah_liter', 8, 2)->nullable();
            $table->decimal('harga_per_liter', 12, 2)->nullable();
            $table->decimal('total_harga_bbm', 12, 2)->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('trips', function (Blueprint $table) {
            $table->dropColumn('jenis_bbm');
            $table->dropColumn('jumlah_liter');
            $table->dropColumn('harga_per_liter');
            $table->dropColumn('total_harga_bbm');
        });
    }
};
