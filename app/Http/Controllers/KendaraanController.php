<?php

namespace App\Http\Controllers;

use App\Models\Kendaraan;
use App\Models\Trip;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Events\TripUpdated;

class KendaraanController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render('Kendaraan/Kendaraan', [
            'kendaraans' => Kendaraan::all()
        ]);

        
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
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
     * Display the specified resource.
     */
    public function show(Kendaraan $kendaraan)
    {
        return Inertia::render('Kendaraan/DetailTrip', [
            'trip' => $kendaraan->load('kendaraan')
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Kendaraan $kendaraan)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Kendaraan $kendaraan)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Kendaraan $kendaraan)
    {
        //
    }

    public function closeTrip(Request $request, Trip $trip)
    {
        try {
            // Validasi input
            $validated = $request->validate([
                'km_akhir' => 'required|numeric|min:' . $trip->kendaraan->km_awal,
                'catatan_kembali' => 'nullable|string',
                'waktu_kembali' => 'required|date',
                'foto_kendaraan' => 'nullable|array|max:5',
                'foto_kendaraan.*' => 'nullable|image|max:5120',
            ]);

            // Proses foto kembali jika ada
            if ($request->hasFile('foto_kendaraan')) {
                $photos = [];
                foreach ($request->file('foto_kendaraan') as $photo) {
                    $fileName = uniqid() . '_return_' . time() . '.' . $photo->getClientOriginalExtension();
                    $path = $photo->storeAs('trips/returns', $fileName, 'public');
                    $photos[] = $path;
                }
                // Gabungkan dengan foto yang sudah ada
                $existingPhotos = $trip->photos ?? [];
                $allPhotos = array_merge($existingPhotos, $photos);
            }

            // Update trip
            $trip->update([
                'waktu_kembali' => $validated['waktu_kembali'],
                'catatan_kembali' => $validated['catatan_kembali'],
                'status' => 'Selesai',
                'photos' => $allPhotos ?? $trip->photos
            ]);

            // Update kendaraan
            $trip->kendaraan->update([
                'km_akhir' => $validated['km_akhir'],
                'status' => 'Tersedia'
            ]);

            // Broadcast event setelah trip diupdate
            broadcast(new TripUpdated($trip))->toOthers();

            return redirect()->back()
                ->with('type', 'success')
                ->with('message', 'Trip berhasil ditutup');
        } catch (\Exception $e) {
            return redirect()->back()
                ->with('type', 'error')
                ->with('message', 'Gagal menutup trip: ' . $e->getMessage());
        }
    }
}
