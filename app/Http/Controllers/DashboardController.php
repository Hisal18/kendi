<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Dashboard;
use Illuminate\Http\Request;
use App\Models\Trip;
use App\Models\Kendaraan;
use App\Models\Driver;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // Mengambil statistik trip
        $tripStats = $this->getTripStats();
        
        // Mengambil statistik kendaraan
        $vehicleStats = $this->getVehicleStats();
        
        // Mengambil statistik driver
        $driverStats = $this->getDriverStats();
        
        // Mengambil trip terbaru
        $recentTrips = Trip::with(['kendaraan', 'driver'])
            ->orderBy('waktu_keberangkatan', 'desc')
            ->take(5)
            ->get();

        
        return Inertia::render('Dashboard/Dashboard', [
            'tripStats' => $tripStats,
            'vehicleStats' => $vehicleStats,
            'driverStats' => $driverStats,
            'recentTrips' => $recentTrips
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
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(Dashboard $dashboard)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Dashboard $dashboard)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Dashboard $dashboard)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Dashboard $dashboard)
    {
        //
    }

    private function getTripStats()
    {
        // Total trips
        $totalTrips = Trip::count();
        
        // Active trips
        $activeTrips = Trip::where('status', 'Sedang Berjalan')->count();
        
        // Total kilometers
        $totalKilometers = Trip::whereNotNull('jarak')->sum('jarak');
        
        // Get daily trip counts for the last 7 days
        $startDate = Carbon::now()->subDays(6)->startOfDay();
        $endDate = Carbon::now()->endOfDay();
        
        $dailyTrips = Trip::select(
                DB::raw('DATE(waktu_keberangkatan) as date'),
                DB::raw('COUNT(*) as count'),
                DB::raw('SUM(CASE WHEN jarak IS NOT NULL THEN jarak ELSE 0 END) as kilometers')
            )
            ->whereBetween('waktu_keberangkatan', [$startDate, $endDate])
            ->groupBy(DB::raw('DATE(waktu_keberangkatan)'))
            ->orderBy('date')
            ->get();
        
        // Format data for chart
        $dailyLabels = [];
        $dailyCounts = [];
        $dailyKilometers = [];
        
        // Create array with all dates in range
        $dateRange = [];
        for ($date = $startDate->copy(); $date <= $endDate; $date->addDay()) {
            $dateKey = $date->format('Y-m-d');
            $dateRange[$dateKey] = [
                'count' => 0,
                'kilometers' => 0,
                'label' => $date->format('D')
            ];
        }
        
        // Fill with actual data
        foreach ($dailyTrips as $day) {
            $dateKey = Carbon::parse($day->date)->format('Y-m-d');
            if (isset($dateRange[$dateKey])) {
                $dateRange[$dateKey]['count'] = $day->count;
                $dateRange[$dateKey]['kilometers'] = $day->kilometers;
            }
        }
        
        // Extract data for charts
        foreach ($dateRange as $data) {
            $dailyLabels[] = $data['label'];
            $dailyCounts[] = $data['count'];
            $dailyKilometers[] = $data['kilometers'];
        }
        
        // Weekly kilometers
        $weeklyKilometers = Trip::whereBetween('waktu_keberangkatan', [$startDate, $endDate])
            ->whereNotNull('jarak')
            ->sum('jarak');
        
        return [
            'totalTrips' => $totalTrips,
            'activeTrips' => $activeTrips,
            'totalKilometers' => $totalKilometers,
            'weeklyKilometers' => $weeklyKilometers,
            'dailyLabels' => $dailyLabels,
            'dailyCounts' => $dailyCounts,
            'dailyKilometers' => $dailyKilometers
        ];
    }
    
    private function getVehicleStats()
    {
        // Total vehicles
        $totalVehicles = Kendaraan::count();
        
        // Available vehicles
        $availableVehicles = Kendaraan::where('status', '!=', 'Digunakan')->count();
        
        // Get vehicle usage stats
        $vehicleUsage = Trip::select(
                'kendaraan_id',
                DB::raw('COUNT(*) as trip_count')
            )
            ->with('kendaraan')
            ->groupBy('kendaraan_id')
            ->orderBy('trip_count', 'desc')
            ->take(5)
            ->get();
        
        $labels = [];
        $tripCounts = [];
        
        foreach ($vehicleUsage as $vehicle) {
            if ($vehicle->kendaraan) {
                $labels[] = $vehicle->kendaraan->merek;
                $tripCounts[] = $vehicle->trip_count;
            }
        }
        
        return [
            'totalVehicles' => $totalVehicles,
            'availableVehicles' => $availableVehicles,
            'labels' => $labels,
            'tripCounts' => $tripCounts
        ];
    }
    
    private function getDriverStats()
    {
        // Total drivers
        $totalDrivers = Driver::count();
        
        // Available drivers
        $availableDrivers = Driver::where('status', '!=', 'Sedang Bertugas')->count();
        
        // Get driver performance stats
        $driverPerformance = Trip::select(
                'driver_id',
                DB::raw('COUNT(*) as trip_count'),
                DB::raw('SUM(CASE WHEN jarak IS NOT NULL THEN jarak ELSE 0 END) as total_kilometers')
            )
            ->with('driver')
            ->groupBy('driver_id')
            ->orderBy('trip_count', 'desc')
            ->take(8)
            ->get();
        
        $labels = [];
        $tripCounts = [];
        $totalKilometers = [];
        
        // Get all drivers for additional stats
        $allDrivers = Driver::select('id', 'name', 'status', 'created_at')->get();
        
        // Calculate driver stats by status
        $driversByStatus = [
            'Tersedia' => $allDrivers->where('status', 'Tersedia')->count(),
            'Sedang Bertugas' => $allDrivers->where('status', 'Sedang Bertugas')->count(),
            'Cuti' => $allDrivers->where('status', 'Cuti')->count(),
            'Lainnya' => $allDrivers->whereNotIn('status', ['Tersedia', 'Sedang Bertugas', 'Cuti'])->count()
        ];
        
        // Get newest drivers (joined in last 30 days)
        $thirtyDaysAgo = Carbon::now()->subDays(30);
        $newDrivers = $allDrivers->where('created_at', '>=', $thirtyDaysAgo)->count();
        
        // Process driver performance data
        foreach ($driverPerformance as $driver) {
            if ($driver->driver) {
                $labels[] = $driver->driver->nama;
                $tripCounts[] = $driver->trip_count;
                $totalKilometers[] = $driver->total_kilometers;
            }
        }
        
        // Get top drivers by kilometers
        $topDriversByKm = Trip::select(
                'driver_id',
                DB::raw('SUM(CASE WHEN jarak IS NOT NULL THEN jarak ELSE 0 END) as total_kilometers')
            )
            ->with('driver')
            ->whereNotNull('jarak')
            ->groupBy('driver_id')
            ->orderBy('total_kilometers', 'desc')
            ->take(5)
            ->get()
            ->map(function ($item) {
                return [
                    'name' => $item->driver ? $item->driver->nama : 'Unknown',
                    'kilometers' => $item->total_kilometers
                ];
            });
        
        return [
            'totalDrivers' => $totalDrivers,
            'availableDrivers' => $availableDrivers,
            'newDrivers' => $newDrivers,
            'driversByStatus' => $driversByStatus,
            'labels' => $labels,
            'tripCounts' => $tripCounts,
            'totalKilometers' => $totalKilometers,
            'topDriversByKm' => $topDriversByKm
        ];
    }
    
    // Tambahkan metode untuk mendapatkan tujuan terpopuler
    private function getPopularDestinations()
    {
        $destinations = Trip::select(
                'tujuan',
                DB::raw('COUNT(*) as trip_count')
            )
            ->groupBy('tujuan')
            ->orderBy('trip_count', 'desc')
            ->take(5)
            ->get();
        
        // Hitung persentase relatif terhadap tujuan terpopuler
        $maxCount = $destinations->max('trip_count');
        
        $formattedDestinations = [];
        foreach ($destinations as $destination) {
            $percentage = ($destination->trip_count / $maxCount) * 100;
            $formattedDestinations[] = [
                'destination' => $destination->tujuan,
                'count' => $destination->trip_count,
                'percentage' => round($percentage)
            ];
        }
        
        return $formattedDestinations;
    }
}
