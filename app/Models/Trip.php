<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Trip extends Model
{
    

    /** @use HasFactory<\Database\Factories\TripFactory> */
    use HasFactory;

    protected $fillable = [
        'code_trip',
        'kendaraan_id',
        'waktu_keberangkatan',
        'waktu_kembali',
        'tujuan',
        'catatan',
        'catatan_kembali',
        'status',
        'photos'
    ];

    protected $casts = [
        'photos' => 'array',
        'waktu_keberangkatan' => 'datetime',
        'waktu_kembali' => 'datetime',
    ];

    public function kendaraan()
    {
        return $this->belongsTo(Kendaraan::class);
    }
}
