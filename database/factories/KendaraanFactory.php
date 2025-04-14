<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Kendaraan>
 */
class KendaraanFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $merek = ['Toyota', 'Honda', 'Suzuki', 'Mitsubishi', 'Daihatsu', 'Nissan'];
        $km_awal = fake()->numberBetween(1000, 50000);
        return [
            'plat_kendaraan' => strtoupper(fake()->randomLetter() . ' ' . 
                               fake()->numberBetween(1000, 9999) . ' ' . 
                               fake()->randomLetter() . fake()->randomLetter()),
            'merek' => fake()->randomElement($merek),
            'km' => $km_awal,
            'status' => fake()->randomElement(['Tersedia', 'Digunakan', 'Dalam Perawatan']),
        ];
    }
}