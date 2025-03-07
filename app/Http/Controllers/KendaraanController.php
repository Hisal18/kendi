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
        $validated = $request->validate([
            'plat_kendaraan' => 'required|string|unique:kendaraans,plat_kendaraan',
            'merek' => 'required|string',
            'km' => 'required|numeric|min:0',
            'status' => 'required|in:Tersedia,Digunakan,Dalam Perawatan',
        ]);

        

        Kendaraan::create($validated);

        return redirect()->back()
            ->with('type', 'success')
            ->with('message', 'Kendaraan berhasil ditambahkan');
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
        $validated = $request->validate([
            'plat_kendaraan' => 'required|string|unique:kendaraans,plat_kendaraan,' . $kendaraan->id,
            'merek' => 'required|string',
            'km' => 'required|numeric|min:0',
            'status' => 'required|in:Tersedia,Digunakan,Dalam Perawatan',
        ]);

        $kendaraan->update($validated);

        return redirect()->back()
            ->with('type', 'success')
            ->with('message', 'Kendaraan berhasil diperbarui');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Kendaraan $kendaraan)
    {
        $kendaraan->delete();
        
        return redirect()->back()
            ->with('type', 'success')
            ->with('message', 'Kendaraan berhasil dihapus');
    }

    // public function closeTrip(Request $request, Trip $trip)
    // {
    //     try {
    //         // Validasi input
    //         $validated = $request->validate([
    //             'km_akhir' => 'required|numeric|min:' . $trip->kendaraan->km_awal,
    //             'catatan_kembali' => 'nullable|string',
    //             'waktu_kembali' => 'required|date',
    //             'foto_kendaraan' => 'nullable|array|max:5',
    //             'foto_kendaraan.*' => 'nullable|image|max:5120',
    //         ]);

    //         // Proses foto kembali jika ada
    //         if ($request->hasFile('foto_kendaraan')) {
    //             $photos = [];
    //             foreach ($request->file('foto_kendaraan') as $photo) {
    //                 $fileName = uniqid() . '_return_' . time() . '.' . $photo->getClientOriginalExtension();
    //                 $path = $photo->storeAs('trips/returns', $fileName, 'public');
    //                 $photos[] = $path;
    //             }
    //             // Gabungkan dengan foto yang sudah ada
    //             $existingPhotos = $trip->photos ?? [];
    //             $allPhotos = array_merge($existingPhotos, $photos);
    //         }

    //         // Update trip
    //         $trip->update([
    //             'waktu_kembali' => $validated['waktu_kembali'],
    //             'catatan_kembali' => $validated['catatan_kembali'],
    //             'status' => 'Selesai',
    //             'photos' => $allPhotos ?? $trip->photos
    //         ]);

    //         // Update kendaraan
    //         $trip->kendaraan->update([
    //             'km_akhir' => $validated['km_akhir'],
    //             'status' => 'Tersedia'
    //         ]);

    //         // Broadcast event setelah trip diupdate
    //         broadcast(new TripUpdated($trip))->toOthers();

    //         return redirect()->back()
    //             ->with('type', 'success')
    //             ->with('message', 'Trip berhasil ditutup');
    //     } catch (\Exception $e) {
    //         return redirect()->back()
    //             ->with('type', 'error')
    //             ->with('message', 'Gagal menutup trip: ' . $e->getMessage());
    //     }
    // }
}
