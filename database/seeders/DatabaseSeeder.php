<?php

namespace Database\Seeders;

use App\Models\Kendaraan;
use App\Models\Trip;
use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        $this->call([
           UserSeeder::class,
           DriverSeeder::class,
           KendaraanSeeder::class
        ]);

        // Trip::factory(10)->create();
        // Kendaraan::factory(10)->create();

        // User::factory()->create([
        //     'name' => 'Test User',
        //     'email' => 'test@example.com',
        // ]);
    }
}
