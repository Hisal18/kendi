<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Tamu extends Model
{
    /** @use HasFactory<\Database\Factories\TamuFactory> */
    use HasFactory;

    protected $fillable = [
        'plat_kendaraan',
        'waktu_kedatangan',
        'waktu_kepergian',
        'foto_kedatangan',
        'foto_kepergian',
        'status'
    ];

    protected $casts = [
        'foto_kedatangan' => 'array',
        'foto_kepergian' => 'array',
        'waktu_kedatangan' => 'datetime',
        'waktu_kepergian' => 'datetime',
    ];
}
