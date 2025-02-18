<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Kendaraan extends Model
{
    use HasFactory;

    protected $fillable = [
        'plat_kendaraan',
        'merek',
        'km_awal',
        'km_akhir',
        'status'
    ];

    public function trips()
    {
        return $this->hasMany(Trip::class);
    }
}
