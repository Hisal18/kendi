<?php

namespace App\Http\Controllers;

use App\Models\Kendaraan;
use App\Models\Trip;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Events\TripUpdated;
use App\Models\Driver;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class TripController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render('Kendaraan/Trip', [
            'trips' => Trip::with(['Kendaraan', 'driver'])->latest()->get(),
            'kendaraans' => Kendaraan::all(),
            'drivers' => Driver::all()
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(Request $request)
    {
        $kendaraan = Kendaraan::find($request->kendaraan_id);
        // Validate the request
        $validator = Validator::make($request->all(), [
            'code_trip' => 'required|unique:trips,code_trip',
            'kendaraan_id' => 'required|exists:kendaraans,id',
            'driver_id' => 'required|exists:drivers,id',
            'waktu_keberangkatan' => 'required|date',
            'tujuan' => 'required|string',
            'catatan' => 'nullable|string',
            'km' => 'required|numeric|min:' . $kendaraan->km,
            'penumpang' => 'nullable|string',
            'foto_berangkat' => 'required|array',
            'foto_berangkat.*' => 'required|image|max:5120', // 5MB max per image
        ]);

        if ($validator->fails()) {
            return response()->json([
                'type' => 'error',
                'message' => 'Gagal menambahkan trip: ' . $validator->errors()->first()
            ], 422);
        }

        // Process photo uploads
        $photos = [];
        // Tangani multiple foto
    if ($request->hasFile('foto_berangkat')) {
            foreach ($request->file('foto_berangkat') as $photo) {
                $path = $photo->store('trip_photos', 'public');
                // Simpan path ke database
                $photos[] = $path;
            }
        }

        // Check if we have any valid photos
        if (empty($photos)) {
            return response()->json([
                'type' => 'error',
                'message' => 'Tidak ada foto yang valid untuk diunggah'
            ], 422);
        }

        // Get vehicle and driver
        $kendaraan = Kendaraan::find($request->kendaraan_id);
        $driver = Driver::find($request->driver_id);

        // Create the trip
        try {
            $trip = Trip::create([
                'code_trip' => $request->code_trip,
                'kendaraan_id' => $request->kendaraan_id,
                'driver_id' => $request->driver_id,
                'waktu_keberangkatan' => $request->waktu_keberangkatan,
                'tujuan' => $request->tujuan,
                'catatan' => $request->catatan,
                'km_awal' => $request->km,
                'penumpang' => $request->penumpang,
                'status' => 'Sedang Berjalan',
                'foto_berangkat' => json_encode($photos), // Ensure photos are JSON encoded
            ]);

            // Update vehicle and driver status
            $kendaraan->update(['status' => 'Digunakan']);
            $driver->update(['status' => 'Sedang Bertugas']);

            return response()->json([
                'type' => 'success',
                'message' => 'Trip berhasil ditambahkan',
                'trip' => $trip
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'type' => 'error',
                'message' => 'Gagal menambahkan trip: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // Redirect to create method for consistency
        return $this->create($request);
    }

    /**
     * Display the specified resource.
     */
    public function show($code_trip)
    {
        try {
            $trip = Trip::where('code_trip', $code_trip)
                        ->with(['kendaraan', 'driver'])
                        ->firstOrFail();

            // Pastikan foto_berangkat dan foto_kembali adalah array
            $trip->foto_berangkat = is_string($trip->foto_berangkat) 
                ? json_decode($trip->foto_berangkat, true) 
                : $trip->foto_berangkat;
            
            $trip->foto_kembali = is_string($trip->foto_kembali) 
                ? json_decode($trip->foto_kembali, true) 
                : $trip->foto_kembali;

            return Inertia::render('Kendaraan/DetailTrip', [
                'trip' => $trip
            ]);
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Gagal menampilkan detail trip');
        }
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit($code_trip)
    {
        $trip = Trip::where('code_trip', $code_trip)
                    ->with(['kendaraan', 'driver', 'photos'])
                    ->firstOrFail();

        return Inertia::render('Kendaraan/EditTrip', [
            'trip' => $trip
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Trip $trip)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Trip $trip)
    {
        //
    }

    public function close(Request $request, Trip $trip)
    {
        try {
            // Validate the request data
            $validated = $request->validate([
                'km_akhir' => 'required|numeric|min:' . $trip->km_awal,
                'waktu_kembali' => 'required|date',
                'jarak' => 'required|numeric',
                'foto_kembali' => 'required|array',
                'foto_kembali.*' => 'required|image|max:5120', // 5MB max per image
            ]);

            // Process photos
            $photos = [];
            if ($request->hasFile('foto_kembali')) {
                foreach ($request->file('foto_kembali') as $photo) {
                    $fileName = uniqid() . '_' . time() . '.' . $photo->getClientOriginalExtension();
                    $path = $photo->storeAs('trip-photos', $fileName, 'public');
                    $photos[] = $path;
                }
            }

            // Update trip with all data using the update method
            $trip->update([
                'waktu_kembali' => $validated['waktu_kembali'],
                'status' => 'Selesai',
                'jarak' => $validated['jarak'],
                'km_akhir' => $validated['km_akhir'],
                'foto_kembali' => !empty($photos) ? json_encode($photos) : null
            ]);
            
            // Update kendaraan status and km
            $trip->kendaraan->update([
                'km' => $validated['km_akhir'],
                'status' => 'Tersedia'
            ]);

            // Update driver status
            $trip->driver->update([
                'status' => 'Tersedia'
            ]);

            // Try to broadcast the event if it exists
            try {
                if (class_exists('App\Events\TripUpdated')) {
                    broadcast(new \App\Events\TripUpdated($trip))->toOthers();
                }
            } catch (\Exception $broadcastError) {
                // Silently handle broadcasting errors
            }

            return redirect()->route('trips.show', $trip->code_trip)
                ->with('type', 'success')
                ->with('message', 'Trip berhasil ditutup');

        } catch (\Exception $e) {
            return redirect()->back()
                ->with('type', 'error')
                ->with('message', 'Gagal menutup trip: ' . $e->getMessage());
        }
    }
}
