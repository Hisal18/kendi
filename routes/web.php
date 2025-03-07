<?php

use Inertia\Inertia;
use App\Models\Dashboard;
use Illuminate\Support\Facades\Route;
use Illuminate\Foundation\Application;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\DriverController;
use App\Http\Controllers\KendaraanController;
use App\Http\Controllers\TamuController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\TripController;

use function Pest\Laravel\get;

Route::get('/', function () {
    return Inertia::render('Home');
});

// Route untuk admin saja
Route::middleware(['auth', 'role:admin'])->group(function () {
    Route::get('/user', [UserController::class, 'index'])->name('user.index');

    Route::resource('driver', DriverController::class);
    
    Route::resource('kendaraan', KendaraanController::class);
    // Route::get('/kendaraan', [KendaraanController::class, 'index'])->name('kendaraan.index');
    // ... route admin lainnya
});

// Route untuk user saja
Route::middleware(['auth', 'role:user'])->group(function () {
    // Route::post('/trips', [KendaraanController::class, 'store'])->name('trips.store');
    // Route::post('/trips/{trip}/close', [KendaraanController::class, 'close'])->name('trips.close');

    // ... route user
});

// Route untuk admin dan user
Route::middleware(['auth', 'role:admin,user'])->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard.index');

    Route::get('/trip', [TripController::class, 'index'])->name('trips.index');
    Route::post('/trips', [TripController::class, 'create'])->name('trips.create');
    Route::post('/trips/store', [TripController::class, 'store'])->name('trips.store');
    Route::get('/trips/{code_trip}', [TripController::class, 'show'])->name('trips.show');
    Route::get('/trips/{code_trip}/edit', [TripController::class, 'edit'])->name('trips.edit');

    Route::get('/tamu', [TamuController::class, 'index'])->name('tamu.index');
    Route::post('/tamu', [TamuController::class, 'store'])->name('tamu.store');


    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::post('/trips/{trip}/close', [TripController::class, 'close'])->name('trips.close');
    
    Route::post('/tamu/{tamu}/close', [TamuController::class, 'close'])->name('tamu.close');
    
    // ... route umum lainnya
});

Route::middleware(['auth'])->group(function () {
    // Existing routes...
    
    // User management routes (only for admin)
    Route::middleware(['role:admin'])->group(function () {
        Route::get('/users', [UserController::class, 'index'])->name('user.index');
        Route::post('/users', [UserController::class, 'store'])->name('users.store');
        Route::put('/users/{user}', [UserController::class, 'update'])->name('users.update');
        Route::delete('/users/{user}', [UserController::class, 'destroy'])->name('users.destroy');
    });
});

require __DIR__.'/auth.php';
