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

    // Driver routes
    Route::get('/drivers', [DriverController::class, 'index'])->name('drivers.index');
    Route::get('/drivers/create', [DriverController::class, 'create'])->name('drivers.create');
    Route::post('/drivers', [DriverController::class, 'store'])->name('drivers.store');
    Route::get('/drivers/{driver}', [DriverController::class, 'show'])->name('drivers.show');
    Route::get('/drivers/{driver}/edit', [DriverController::class, 'edit'])->name('drivers.edit');
    Route::put('/drivers/{driver}', [DriverController::class, 'update'])->name('drivers.update');
    Route::delete('/drivers/{driver}', [DriverController::class, 'destroy'])->name('drivers.destroy');
    
    // Kendaraan routes
    Route::get('/kendaraan', [KendaraanController::class, 'index'])->name('kendaraan.index');
    Route::get('/kendaraan/create', [KendaraanController::class, 'create'])->name('kendaraan.create');
    Route::post('/kendaraan', [KendaraanController::class, 'store'])->name('kendaraan.store');
    Route::get('/kendaraan/{kendaraan}', [KendaraanController::class, 'show'])->name('kendaraan.show');
    Route::get('/kendaraan/{kendaraan}/edit', [KendaraanController::class, 'edit'])->name('kendaraan.edit');
    Route::put('/kendaraan/{kendaraan}', [KendaraanController::class, 'update'])->name('kendaraan.update');
    Route::delete('/kendaraan/{kendaraan}', [KendaraanController::class, 'destroy'])->name('kendaraan.destroy');
    
});

// Route untuk user saja
Route::middleware(['auth', 'role:user'])->group(function () {
    

    // ... route user
});

// Route untuk admin dan user
Route::middleware(['auth', 'role:admin,user'])->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    Route::get('/trip', [TripController::class, 'index'])->name('trips.index');
    Route::post('/trips', [TripController::class, 'create'])->name('trips.create');
    Route::post('/trips/store', [TripController::class, 'store'])->name('trips.store');
    Route::get('/trips/{code_trip}', [TripController::class, 'show'])->name('trips.show');
    Route::get('/trips/{code_trip}/edit', [TripController::class, 'edit'])->name('trips.edit');

    Route::get('/tamu', [TamuController::class, 'index'])->name('tamu.index');

    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::post('/trips/{trip}/close', [TripController::class, 'close'])->name('trips.close');

    Route::get('/drivers', [DriverController::class, 'index'])->name('drivers.index');
    
});


require __DIR__.'/auth.php';
