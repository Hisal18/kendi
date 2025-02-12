<?php

namespace Database\Factories;

use App\Models\Kendaraan;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Trip>
 */
class TripFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $waktu_keberangkatan = fake()->dateTimeBetween('-1 month', 'now');
        $waktu_kembali = fake()->dateTimeBetween($waktu_keberangkatan, '+2 days');
        
        
        return [
            'code_trip' => fake()->unique()->regexify('[A-Za-z0-9]{10}'),
            'kendaraan_id' => Kendaraan::factory(),
            'waktu_keberangkatan' => $waktu_keberangkatan,
            'waktu_kembali' => $waktu_kembali,
            
            'tujuan' => fake()->city(),
            'status' => fake()->randomElement(['Sedang Berjalan', 'Selesai', 'Dibatalkan']),
            'catatan' => fake()->optional()->text(200),
        ];
    }
}
