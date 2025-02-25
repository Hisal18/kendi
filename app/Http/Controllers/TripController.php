<?php

namespace App\Http\Controllers;

use App\Models\Kendaraan;
use App\Models\Trip;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Events\TripUpdated;
use App\Models\Driver;
use Illuminate\Support\Facades\Log;

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
        try {
            $driver = Driver::find($request->driver_id);
            $kendaraan = Kendaraan::find($request->kendaraan_id);
            $validated = $request->validate([
                'code_trip' => 'required|unique:trips',
                'kendaraan_id' => 'required|exists:kendaraans,id',
                'driver_id' => 'required|exists:drivers,id',
                'waktu_keberangkatan' => 'required|date',
                'tujuan' => 'required|string',
                'catatan' => 'nullable|string',
                'km_awal' => 'required|numeric|min:' . $kendaraan->km_awal,
                'foto_kendaraan' => 'required|array|min:1|max:5',
                'foto_kendaraan.*' => 'required|image|max:5120',
                'penumpang' => 'nullable|string',
            ]);

            $tripData = collect($validated)->except(['km_awal', 'foto_kendaraan'])->toArray();
            
            $photos = [];
            if ($request->hasFile('foto_kendaraan')) {
                foreach ($request->file('foto_kendaraan') as $photo) {
                    $fileName = uniqid() . '_' . time() . '.' . $photo->getClientOriginalExtension();
                    $path = $photo->storeAs('trips', $fileName, 'public');
                    $photos[] = $path;
                }
            }

            $tripData['foto_berangkat'] = $photos;
            $tripData['status'] = 'Sedang Berjalan';

            $trip = Trip::create($tripData);
            
            $kendaraan->update([
                'km_awal' => $request->km_awal,
                'status' => 'Digunakan'
            ]);

            $driver->update([
                'status' => 'Sedang Bertugas'
            ]);

            broadcast(new TripUpdated($trip))->toOthers();

            return response()->json([
                'success' => true,
                'message' => 'Trip berhasil ditambahkan',
                'trip' => [
                    'code_trip' => $trip->code_trip
                ]
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal menambahkan trip: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // try {
        //     $trip = Trip::create($request->all());
            
        //     // Load relasi kendaraan
        //     $trip->load('kendaraan');

        //     return redirect()->back()->with([
        //         'success' => 'Trip berhasil ditambahkan',
        //         'trip' => $trip
        //     ]);
        // } catch (\Exception $e) {
        //     return redirect()->back()->withErrors([
        //         'error' => 'Gagal menambahkan trip: ' . $e->getMessage()
        //     ]);
        // }
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
            Log::error('Error showing trip: ' . $e->getMessage());
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
        $validated = $request->validate([
            'km_akhir' => 'required|numeric|min:' . $trip->kendaraan->km_awal,
            'waktu_kembali' => 'required|date',
            'jarak' => 'required|numeric',
            'foto_kembali' => 'required|array|min:1|max:5',
            'foto_kembali.*' => 'required|image|max:5120',
        ]);

        // Proses foto kembali
        $photos = [];
        if ($request->hasFile('foto_kembali')) {
            foreach ($request->file('foto_kembali') as $photo) {
                $fileName = uniqid() . '_' . time() . '.' . $photo->getClientOriginalExtension();
                $path = $photo->storeAs('trips', $fileName, 'public');
                $photos[] = $path;
            }
        }

        // Update trip dengan semua data yang divalidasi
        $trip->update([
            'waktu_kembali' => $validated['waktu_kembali'],
            'status' => 'Selesai',
            'jarak' => $validated['jarak'],
            'foto_kembali' => $photos,
            'km_akhir' => $validated['km_akhir'],
        ]);

        // Update kendaraan
        $trip->kendaraan->update([
            'km_awal' => $validated['km_akhir'],
            'status' => 'Tersedia'
        ]);

        // Update driver - Perbaikan di sini
        $trip->driver->update([
            'status' => 'Tersedia'
        ]);

        // Broadcast event setelah trip diupdate
        broadcast(new TripUpdated($trip))->toOthers();

        return redirect()->back()
            ->with('type', 'success')
            ->with('message', 'Trip berhasil ditutup');
    }
}
