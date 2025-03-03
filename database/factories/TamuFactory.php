<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use function Pest\Laravel\assertDatabaseCount;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Tamu>
 */
class TamuFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'plat_kendaraan' => $this->faker->unique()->bothify('##-###-##'),
            'waktu_kedatangan' => $this->faker->dateTime(),
            'waktu_kepergian' => $this->faker->dateTime(),
            'foto_kedatangan' => json_encode([$this->faker->imageUrl()]),
            'foto_kepergian' => json_encode([$this->faker->imageUrl()]),
            'status' => $this->faker->randomElement(['New', 'Close']),
        ];
    }
}
