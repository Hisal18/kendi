<?php

namespace Database\Seeders;

use Illuminate\Support\Facades\DB;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class KendaraanSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('kendaraans')->delete();

        DB::table('kendaraans')->insert(array(
            0 =>
            array(
                'id' => 1,
                'plat_kendaraan' => 'T 1765 KI',
                'merek' => 'ALL NEW VELOZ MT 1.5',
                'km' => 0,
                'created_at' => now(),
                'updated_at' => now()
            ),
            1 =>
            array(
                'id' => 2,
                'plat_kendaraan' => 'T 1780 KI',
                'merek' => 'ALL NEW VELOZ MT 1.5',
                'km' => 0,
                'created_at' => now(),
                'updated_at' => now()
            ),
            2 =>
            array(
                'id' => 3,
                'plat_kendaraan' => 'T 1781 KI',
                'merek' => 'ALL NEW VELOZ MT 1.5',
                'km' => 0,
                'created_at' => now(),
                'updated_at' => now()
            ),
            3 =>
            array(
                'id' => 4,
                'plat_kendaraan' => 'T 1782 KI',
                'merek' => 'ALL NEW VELOZ MT 1.5',
                'km' => 0,
                'created_at' => now(),
                'updated_at' => now()
            ),
            4 =>
            array(
                'id' => 5,
                'plat_kendaraan' => 'T 1783 KI',
                'merek' => 'ALL NEW VELOZ MT 1.5',
                'km' => 0,
                'created_at' => now(),
                'updated_at' => now()
            ),
            5 =>
            array(
                'id' => 6,
                'plat_kendaraan' => 'T 1784 KI',
                'merek' => 'ALL NEW VELOZ MT 1.5',
                'km' => 0,
                'created_at' => now(),
                'updated_at' => now()
            ),
            6 =>
            array(
                'id' => 7,
                'plat_kendaraan' => 'T 1785 KI',
                'merek' => 'ALL NEW VELOZ MT 1.5',
                'km' => 0,
                'created_at' => now(),
                'updated_at' => now()
            ),
            7 =>
            array(
                'id' => 8,
                'plat_kendaraan' => 'T 1786 KI',
                'merek' => 'ALL NEW VELOZ MT 1.5',
                'km' => 0,
                'created_at' => now(),
                'updated_at' => now()
            ),
            8 =>
            array(
                'id' => 9,
                'plat_kendaraan' => 'T 1787 KI',
                'merek' => 'ALL NEW VELOZ MT 1.5',
                'km' => 0,
                'created_at' => now(),
                'updated_at' => now()
            ),
            9 =>
            array(
                'id' => 10,
                'plat_kendaraan' => 'T 1788 KI',
                'merek' => 'ALL NEW VELOZ MT 1.5',
                'km' => 0,
                'created_at' => now(),
                'updated_at' => now()
            ),
            10 =>
            array(
                'id' => 11,
                'plat_kendaraan' => 'T 1789 KI',
                'merek' => 'ALL NEW VELOZ MT 1.5',
                'km' => 0,
                'created_at' => now(),
                'updated_at' => now()
            ),
            11 =>
            array(
                'id' => 12,
                'plat_kendaraan' => 'T 7211 DA',
                'merek' => 'HIACE',
                'km' => 0,
                'created_at' => now(),
                'updated_at' => now()
            ),
            12 =>
            array(
                'id' => 13,
                'plat_kendaraan' => 'T 7215 DA',
                'merek' => 'HIACE',
                'km' => 0,
                'created_at' => now(),
                'updated_at' => now()
            ),
            13 =>
            array(
                'id' => 14,
                'plat_kendaraan' => 'T 7209 DA',
                'merek' => 'HIACE',
                'km' => 0,
                'created_at' => now(),
                'updated_at' => now()
            ),
            14 =>
            array(
                'id' => 15,
                'plat_kendaraan' => 'T 8301 EA',
                'merek' => 'TRUK PDKB',
                'km' => 0,
                'created_at' => now(),
                'updated_at' => now()
            ),
            15 =>
            array(
                'id' => 16,
                'plat_kendaraan' => 'T 8299 EA',
                'merek' => 'TRUK PDKB',
                'km' => 0,
                'created_at' => now(),
                'updated_at' => now()
            ),
            16 =>
            array(
                'id' => 17,
                'plat_kendaraan' => 'D 8284 FV  ',
                'merek' => 'TOYOTA HILUX',
                'km' => 0,
                'created_at' => now(),
                'updated_at' => now()
            ),
            17 =>
            array(
                'id' => 18,
                'plat_kendaraan' => 'D 8285 FV',
                'merek' => 'TOYOTA HILUX',
                'km' => 0,
                'created_at' => now(),
                'updated_at' => now()
            ),
            18 =>
            array(
                'id' => 19,
                'plat_kendaraan' => 'D 8240 FV',
                'merek' => 'TOYOTA HILUX',
                'km' => 0,
                'created_at' => now(),
                'updated_at' => now()
            ),
            19 =>
            array(
                'id' => 20,
                'plat_kendaraan' => 'T 8889 HK',
                'merek' => 'L300',
                'km' => 0,
                'created_at' => now(),
                'updated_at' => now()
            ),
            
        ));
    }
}
