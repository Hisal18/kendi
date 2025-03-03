<?php

namespace Database\Seeders;

use Illuminate\Support\Facades\DB;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class TamuSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('tamus')->delete();

        DB::table('tamus')->insert(array(
            0 =>
            array(
                'id' => 1,
                'plat_kendaraan' => 'T 1765 KI',
                'merek' => 'ALL NEW VELOZ MT 1.5',
                'km_awal' => 0,
                'created_at' => now(),
                'updated_at' => now()
            ),
        ));
    }
}
