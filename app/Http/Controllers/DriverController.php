<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Driver;

class DriverController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render('Kendaraan/Driver', [
            'drivers' => Driver::all()
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
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'phone_number' => 'required|string|max:20',
            'status' => 'required|in:Tersedia,Sedang Bertugas,Cuti',
        ]);

        Driver::create($validated);

        return redirect()->back();
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
        $driver = Driver::findOrFail($id);
        
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'phone_number' => 'required|string|max:20',
            'status' => 'required|in:Tersedia,Sedang Bertugas,Cuti',
        ]);

        $driver->update($validated);

        return redirect()->back()->with('success', 'Data driver berhasil diperbarui');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $driver = Driver::findOrFail($id);
        $driver->delete();

        return redirect()->back();
    }
}
