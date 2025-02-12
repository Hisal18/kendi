<?php

namespace App\Http\Controllers;

use App\Models\Kendaraan;
use App\Models\Trip;
use Illuminate\Http\Request;
use Inertia\Inertia;

class KendaraanController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // dd();

        return Inertia::render('Kendaraan/Kendaraankeluar', [
            'trips' => Trip::with(['Kendaraan'])->latest()->get(),
            'kendaraans' => Kendaraan::all()
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Kendaraan/Kendaraan');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'code_trip' => 'required|unique:trips',
            'kendaraan_id' => 'required|exists:kendaraans,id',
            'waktu_keberangkatan' => 'required|date',
            'tujuan' => 'required|string',
            'catatan' => 'nullable|string',
        ]);

        $trip = Trip::create($validated);

        return redirect()->back()
            ->with('message', 'Trip berhasil ditambahkan');
    }

    /**
     * Display the specified resource.
     */
    public function show(Kendaraan $kendaraan)
    {
        //
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
}
