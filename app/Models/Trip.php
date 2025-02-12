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
        'tujuan',
        'catatan',
        'status'
    ];

    function Kendaraan() : BelongsTo {
        return $this->belongsTo(Kendaraan::class);
    }
}
