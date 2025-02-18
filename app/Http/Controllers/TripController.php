<?php

namespace App\Http\Controllers;

use App\Models\Kendaraan;
use App\Models\Trip;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Events\TripUpdated;

class TripController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render('Kendaraan/Trip', [
            'trips' => Trip::with(['Kendaraan'])->latest()->get(),
            'kendaraans' => Kendaraan::all()
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(Request $request)
    {

        $kendaraan = Kendaraan::find($request->kendaraan_id);
        $validated = $request->validate([
            'code_trip' => 'required|unique:trips',
            'kendaraan_id' => 'required|exists:kendaraans,id',
            'waktu_keberangkatan' => 'required|date',
            'tujuan' => 'required|string',
            'catatan' => 'nullable|string',
            'km_awal' => 'required|numeric|min:' . $kendaraan->km_akhir,
            'foto_kendaraan' => 'required|array|min:1|max:5',
            'foto_kendaraan.*' => 'required|image|max:5120', // maksimal 5MB per foto
        ]);

        // Hapus km_awal dari data yang akan disimpan ke trips
        $tripData = collect($validated)->except(['km_awal', 'foto_kendaraan'])->toArray();
        
        // Proses multiple foto
        $photos = [];
        if ($request->hasFile('foto_kendaraan')) {
            foreach ($request->file('foto_kendaraan') as $photo) {
                // Generate nama unik untuk file
                $fileName = uniqid() . '_' . time() . '.' . $photo->getClientOriginalExtension();
                
                // Simpan foto ke storage/app/public/trips
                $path = $photo->storeAs('trips', $fileName, 'public');
                
                // Simpan path relatif ke array
                $photos[] = $path;
            }
        }

        // Tambahkan array foto ke data trip
        $tripData['photos'] = $photos;

        // Simpan data trip
        $trip = Trip::create($tripData);
        
        // Update kendaraan
        $kendaraan->update([
            'km_awal' => $request->km_awal,
            'km_akhir' => null,
            'status' => 'Digunakan'
        ]);

        // Broadcast event setelah trip dibuat
        broadcast(new TripUpdated($trip))->toOthers();

        return redirect()->back()
            ->with('type', 'success')
            ->with('message', 'Trip berhasil ditambahkan');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show($code_trip)
    {
        $trip = Trip::where('code_trip', $code_trip)
                    ->with(['kendaraan'])
                    ->firstOrFail();

        return Inertia::render('Kendaraan/DetailTrip', [
            'trip' => $trip
        ]);
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
}
