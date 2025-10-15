<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TripEditRequest extends Model
{
    use HasFactory;
    
    protected $fillable = [
        'trip_id', 
        'requested_by_user_id', 
        'approved_by_admin_id',
        'old_data', 
        'new_data', 
        'status',
    ];

    // Hubungan ke Trip
    public function trip()
    {
        return $this->belongsTo(Trip::class);
    }

    // >> MULAI: Relasi ke User yang Mengajukan Permintaan (requestedBy)
    public function requestedBy()
    {
        // TripEditRequest terhubung ke User melalui kolom 'requested_by_user_id'
        return $this->belongsTo(User::class, 'requested_by_user_id');
    }
    // << SELESAI
    
}
