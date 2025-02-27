<?php

namespace Database\Seeders;

use DB;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DriverSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('drivers')->delete();
        
        DB::table('drivers')->insert(array(
            0 =>
            array(
                'id' => 1,
                'name' => 'Dwi Yanu Rachman',
                'phone_number' => '081395395089',
                'status' => 'Tersedia',
                'created_at' => now(),
                'updated_at' => now()
            ),
            1 =>
            array(
                'id' => 2,
                'name' => 'Aldi Gustiyan',
                'phone_number' => '081213579363',
                'status' => 'Tersedia',
                'created_at' => now(),
                'updated_at' => now()
            ),
            2 =>
            array(
                'id' => 3,
                'name' => 'Heri Purnomo',
                'phone_number' => '082317617373',
                'status' => 'Tersedia',
                'created_at' => now(),
                'updated_at' => now()
            ),
            3 =>
            array(
                'id' => 4,
                'name' => 'Ucu Sugiarto',
                'phone_number' => '085777885398',
                'status' => 'Tersedia',
                'created_at' => now(),
                'updated_at' => now()
            ),
            4 =>
            array(
                'id' => 5,
                'name' => 'Yusup Hidayat',
                'phone_number' => '081296502135',
                'status' => 'Tersedia',
                'created_at' => now(),
                'updated_at' => now()
            ),
            5 =>
            array(
                'id' => 6,
                'name' => 'Encup',
                'phone_number' => '081317582395',
                'status' => 'Tersedia',
                'created_at' => now(),
                'updated_at' => now()
            ),
            6 =>
            array(
                'id' => 7,
                'name' => 'Dian Mulyana',
                'phone_number' => '081316263766',
                'status' => 'Tersedia',
                'created_at' => now(),
                'updated_at' => now()
            ),
            7 =>
            array(
                'id' => 8,
                'name' => 'Ade Triana',
                'phone_number' => '081221536658',
                'status' => 'Tersedia',
                'created_at' => now(),
                'updated_at' => now()
            ),
            8 =>
            array(
                'id' => 9,
                'name' => 'Wawan Setiawan',
                'phone_number' => '082316786988',
                'status' => 'Tersedia',
                'created_at' => now(),
                'updated_at' => now()
            ),
            9 =>
            array(
                'id' => 10,
                'name' => 'Hendris',
                'phone_number' => '085714572243',
                'status' => 'Tersedia',
                'created_at' => now(),
                'updated_at' => now()
            ),
            10 =>
            array(
                'id' => 11,
                'name' => 'Cecep Sumarno',
                'phone_number' => '081213266265',
                'status' => 'Tersedia',
                'created_at' => now(),
                'updated_at' => now()
            ),
            11 =>
            array(
                'id' => 12,
                'name' => 'Daday M R',
                'phone_number' => '081223486541',
                'status' => 'Tersedia',
                'created_at' => now(),
                'updated_at' => now()
            ),
            12 =>
            array(
                'id' => 13,
                'name' => 'Ikhsan Taqyudin',
                'phone_number' => '08973173109',
                'status' => 'Tersedia',
                'created_at' => now(),
                'updated_at' => now()
            ),
            13 =>
            array(
                'id' => 14,
                'name' => 'Endang Kusnandar',
                'phone_number' => '081314706784',
                'status' => 'Tersedia',
                'created_at' => now(),
                'updated_at' => now()
            ),
            14 =>
            array(
                'id' => 15,
                'name' => 'Bebeng Wandi',
                'phone_number' => '081910672926',
                'status' => 'Tersedia',
                'created_at' => now(),
                'updated_at' => now()
            ),
            15 =>
            array(
                'id' => 16,
                'name' => 'Agung Sedayu',
                'phone_number' => '087879736612',
                'status' => 'Tersedia',
                'created_at' => now(),
                'updated_at' => now()
            ),
            16 =>
            array(
                'id' => 17,
                'name' => 'Atep Yusup',
                'phone_number' => '081394283630',
                'status' => 'Tersedia',
                'created_at' => now(),
                'updated_at' => now()
            ),
            17 =>
            array(
                'id' => 18,
                'name' => 'Suryadi',
                'phone_number' => '081382432535',
                'status' => 'Tersedia',
                'created_at' => now(),
                'updated_at' => now()
            ),
            18 =>
            array(
                'id' => 19,
                'name' => 'Tubagus Ridwan Rudiansyah',
                'phone_number' => '081909374083',
                'status' => 'Tersedia',
                'created_at' => now(),
                'updated_at' => now()
            ),
            19 =>
            array(
                'id' => 20,
                'name' => 'Iman Bastaman',
                'phone_number' => '081313904540',
                'status' => 'Tersedia',
                'created_at' => now(),
                'updated_at' => now()
            ),
            20 =>
            array(
                'id' => 21,
                'name' => 'M Nanang Syafei',
                'phone_number' => '081386899248',
                'status' => 'Tersedia',
                'created_at' => now(),
                'updated_at' => now()
            ),
            21 =>
            array(
                'id' => 22,
                'name' => 'Rafli Febriansyah Suryana',
                'phone_number' => '081389440108',
                'status' => 'Tersedia',
                'created_at' => now(),
                'updated_at' => now()
            ),
            

        ));
           
            
    }
}
