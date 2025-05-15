<?php

namespace App\Http\Controllers;

use App\Models\Tamu;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class TamuController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render('Kendaraan/Tamu', [
            'tamus' => Tamu::latest()->get()
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {


        $request->validate([
            'plat_kendaraan' => 'required|string|max:20',
            'waktu_kedatangan' => 'required|date',
            'foto_kendaraan' => 'required|array',
            'foto_kendaraan.*' => 'required|image|max:5120',
            'lokasi' => 'required|string',
        ]);

        try {
            DB::beginTransaction();

            // Simpan data tamu
            $tamu = new Tamu();
            $tamu->plat_kendaraan = strtoupper($request->plat_kendaraan);
            $tamu->waktu_kedatangan = $request->waktu_kedatangan;
            $tamu->status = 'New';
            $tamu->lokasi = $request->lokasi;
            $tamu->foto_kedatangan = '[]';
            $tamu->created_by = Auth::id();
            $tamu->save();

            // Proses upload foto
            $photos = [];
            if ($request->hasFile('foto_kendaraan')) {
                foreach ($request->file('foto_kendaraan') as $photo) {
                    $path = $photo->store('tamu-photos', 'public');
                    $photos[] = $path;
                }
            }

            // Update foto
            $tamu->foto_kedatangan = json_encode($photos);
            $tamu->save();

            DB::commit();

            // Return dengan data terbaru
            return redirect()->back()->with([
                'success' => true,
                'message' => 'Data kendaraan berhasil ditambahkan'
            ])->with('tamus', Tamu::all());

        } catch (\Exception $e) {
            DB::rollback();
            Log::error('Error in TamuController@store: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Terjadi kesalahan: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }

    /**
     * Close the specified tamu.
     */
    public function close(Request $request, Tamu $tamu)
    {
        $request->validate([
            'waktu_kepergian' => 'required|date',
            'foto_kepergian' => 'required|array',
            'foto_kepergian.*' => 'required|image|max:5120',
        ]);

        try {
            DB::beginTransaction();

            // Proses upload foto
            $photos = [];
            if ($request->hasFile('foto_kepergian')) {
                foreach ($request->file('foto_kepergian') as $photo) {
                    $path = $photo->store('tamu-photos', 'public');
                    $photos[] = $path;
                }
            }

            // Update tamu
            $tamu->waktu_kepergian = $request->waktu_kepergian;
            $tamu->status = 'Close';
            $tamu->foto_kepergian = json_encode($photos);
            $tamu->save();

            DB::commit();

            // Return dengan data terbaru
            return redirect()->back()->with([
                'success' => true,
                'message' => 'Kendaraan tamu berhasil ditutup'
            ])->with('tamus', Tamu::all());

        } catch (\Exception $e) {
            DB::rollback();
            Log::error('Error in TamuController@close: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Terjadi kesalahan: ' . $e->getMessage()
            ], 500);
        }
    }
}
