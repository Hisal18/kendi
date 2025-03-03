import React, { useState, useEffect } from "react";
import DashboardLayout from "@/Layouts/DashboardLayout";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    BarElement,
    ArcElement,
    DoughnutController,
    Filler,
} from "chart.js";
import { Line, Bar, Doughnut } from "react-chartjs-2";
import { Head, usePage, Link } from "@inertiajs/react";
import { 
    FaCar, 
    FaUserTie, 
    FaRoute, 
    FaCalendarCheck, 
    FaChartLine, 
    FaMapMarkerAlt,
    FaTachometerAlt,
    FaCalendarAlt
} from "react-icons/fa";

// Registrasi ChartJS components
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    DoughnutController,
    Title,
    Tooltip,
    Legend,
    Filler
);

export default function Dashboard({ tripStats, vehicleStats, driverStats, recentTrips }) {
    const { auth } = usePage().props;
    const [isDarkMode, setIsDarkMode] = useState(
        localStorage.getItem("darkMode") === "true"
    );
    
    // Update chart theme when dark mode changes
    useEffect(() => {
        const darkModeListener = () => {
            setIsDarkMode(localStorage.getItem("darkMode") === "true");
        };
        
        window.addEventListener("darkModeChanged", darkModeListener);
        return () => {
            window.removeEventListener("darkModeChanged", darkModeListener);
        };
    }, []);
    
    // Warna untuk chart
    const chartColors = {
        primary: isDarkMode ? 'rgba(99, 102, 241, 1)' : 'rgba(79, 70, 229, 1)',
        primaryLight: isDarkMode ? 'rgba(99, 102, 241, 0.2)' : 'rgba(79, 70, 229, 0.2)',
        secondary: isDarkMode ? 'rgba(16, 185, 129, 1)' : 'rgba(5, 150, 105, 1)',
        secondaryLight: isDarkMode ? 'rgba(16, 185, 129, 0.2)' : 'rgba(5, 150, 105, 0.2)',
        warning: isDarkMode ? 'rgba(245, 158, 11, 1)' : 'rgba(217, 119, 6, 1)',
        warningLight: isDarkMode ? 'rgba(245, 158, 11, 0.2)' : 'rgba(217, 119, 6, 0.2)',
        danger: isDarkMode ? 'rgba(239, 68, 68, 1)' : 'rgba(220, 38, 38, 1)',
        dangerLight: isDarkMode ? 'rgba(239, 68, 68, 0.2)' : 'rgba(220, 38, 38, 0.2)',
        text: isDarkMode ? 'rgba(229, 231, 235, 0.8)' : 'rgba(55, 65, 81, 0.8)',
        grid: isDarkMode ? 'rgba(75, 85, 99, 0.2)' : 'rgba(209, 213, 219, 0.2)',
    };
    
    // Opsi umum untuk chart
    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
                labels: {
                    color: chartColors.text,
                    font: {
                        size: 12,
                        family: "'Inter', sans-serif",
                    }
                }
            },
            tooltip: {
                backgroundColor: isDarkMode ? 'rgba(30, 41, 59, 0.9)' : 'rgba(255, 255, 255, 0.9)',
                titleColor: isDarkMode ? 'rgba(255, 255, 255, 0.9)' : 'rgba(0, 0, 0, 0.9)',
                bodyColor: isDarkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)',
                borderColor: isDarkMode ? 'rgba(75, 85, 99, 0.2)' : 'rgba(209, 213, 219, 0.2)',
                borderWidth: 1,
                padding: 12,
                boxPadding: 6,
                usePointStyle: true,
                bodyFont: {
                    family: "'Inter', sans-serif",
                }
            }
        },
        scales: {
            x: {
                grid: {
                    color: chartColors.grid,
                },
                ticks: {
                    color: chartColors.text,
                    font: {
                        family: "'Inter', sans-serif",
                    }
                }
            },
            y: {
                grid: {
                    color: chartColors.grid,
                },
                ticks: {
                    color: chartColors.text,
                    font: {
                        family: "'Inter', sans-serif",
                    }
                }
            }
        }
    };
    
    // Data untuk Trip Activity Chart (Line Chart)
    const tripActivityData = {
        labels: tripStats?.dailyLabels || ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"],
        datasets: [
            {
                label: "Total Trip",
                data: tripStats?.dailyCounts || [5, 8, 6, 9, 7, 3, 4],
                borderColor: chartColors.primary,
                backgroundColor: chartColors.primaryLight,
                tension: 0.3,
                fill: true,
            },
            {
                label: "Total Kilometer",
                data: tripStats?.dailyKilometers || [120, 180, 150, 210, 160, 90, 110],
                borderColor: chartColors.secondary,
                backgroundColor: chartColors.secondaryLight,
                tension: 0.3,
                fill: true,
                yAxisID: 'y1',
            }
        ]
    };
    
    // Opsi khusus untuk Trip Activity Chart
    const tripActivityOptions = {
        ...chartOptions,
        plugins: {
            ...chartOptions.plugins,
            title: {
                display: true,
                text: 'Aktivitas Trip Mingguan',
                color: chartColors.text,
                font: {
                    size: 16,
                    weight: 'bold',
                    family: "'Inter', sans-serif",
                }
            }
        },
        scales: {
            ...chartOptions.scales,
            y: {
                ...chartOptions.scales.y,
                title: {
                    display: true,
                    text: 'Jumlah Trip',
                    color: chartColors.text,
                },
            },
            y1: {
                position: 'right',
                title: {
                    display: true,
                    text: 'Kilometer',
                    color: chartColors.text,
                },
                grid: {
                    drawOnChartArea: false,
                    color: chartColors.grid,
                },
                ticks: {
                    color: chartColors.text,
                    font: {
                        family: "'Inter', sans-serif",
                    }
                }
            }
        }
    };
    
    // Data untuk Vehicle Usage Chart (Bar Chart)
    const vehicleUsageData = {
        labels: vehicleStats?.labels || ["Avanza", "Innova", "Xenia", "Fortuner", "Alphard"],
        datasets: [
            {
                label: "Jumlah Trip",
                data: vehicleStats?.tripCounts || [12, 8, 10, 5, 3],
                backgroundColor: chartColors.primary,
                borderRadius: 6,
            }
        ]
    };
    
    // Opsi khusus untuk Vehicle Usage Chart
    const vehicleUsageOptions = {
        ...chartOptions,
        plugins: {
            ...chartOptions.plugins,
            title: {
                display: true,
                text: 'Penggunaan Kendaraan',
                color: chartColors.text,
                font: {
                    size: 16,
                    weight: 'bold',
                    family: "'Inter', sans-serif",
                }
            }
        },
        scales: {
            ...chartOptions.scales,
            y: {
                ...chartOptions.scales.y,
                title: {
                    display: true,
                    text: 'Jumlah Trip',
                    color: chartColors.text,
                },
            }
        }
    };
    
    
    // Format tanggal
    const formatDate = (dateString) => {
        if (!dateString) return "-";
        const date = new Date(dateString);
        return date.toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
        });
    };
    
    // Format waktu
    const formatTime = (dateString) => {
        if (!dateString) return "-";
        const date = new Date(dateString);
        return date.toLocaleTimeString('id-ID', {
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <>
            <Head title="Dashboard" />
            <DashboardLayout>
                <div className="p-0 md:px-0">
                    
                    
                    {/* Stat Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                        {/* Total Kendaraan */}
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 transition-all hover:shadow-md">
                            <div className="flex items-center">
                                <div className="p-3 rounded-full bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-300 mr-4">
                                    <FaCar className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                        Total Kendaraan
                                    </p>
                                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                        {vehicleStats?.totalVehicles || 0}
                                    </p>
                                </div>
                            </div>
                            <div className="mt-3 flex items-center text-sm">
                                <span className="text-green-500 dark:text-green-400 font-medium flex items-center">
                                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18"></path>
                                    </svg>
                                    {vehicleStats?.availableVehicles || 0} tersedia
                                </span>
                            </div>
                        </div>
                        
                        {/* Total Driver */}
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 transition-all hover:shadow-md">
                            <div className="flex items-center">
                                <div className="p-3 rounded-full bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300 mr-4">
                                    <FaUserTie className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                        Total Driver
                                    </p>
                                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                        {driverStats?.totalDrivers || 0}
                                    </p>
                                </div>
                            </div>
                            <div className="mt-3 flex items-center text-sm">
                                <span className="text-green-500 dark:text-green-400 font-medium flex items-center">
                                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18"></path>
                                    </svg>
                                    {driverStats?.availableDrivers || 0} tersedia
                                </span>
                            </div>
                        </div>
                        
                        {/* Total Trip */}
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 transition-all hover:shadow-md">
                            <div className="flex items-center">
                                <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 mr-4">
                                    <FaRoute className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                        Total Trip
                                    </p>
                                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                        {tripStats?.totalTrips || 0}
                                    </p>
                                </div>
                            </div>
                            <div className="mt-3 flex items-center text-sm">
                                <span className="text-yellow-500 dark:text-yellow-400 font-medium flex items-center">
                                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
                                    </svg>
                                    {tripStats?.activeTrips || 0} sedang berjalan
                                </span>
                            </div>
                        </div>
                        
                        {/* Total Kilometer */}
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 transition-all hover:shadow-md">
                            <div className="flex items-center">
                                <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300 mr-4">
                                    <FaTachometerAlt className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                        Total Kilometer
                                    </p>
                                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                        {tripStats?.totalKilometers?.toLocaleString() || "0"} km
                                    </p>
                                </div>
                            </div>
                            <div className="mt-3 flex items-center text-sm">
                                <span className="text-green-500 dark:text-green-400 font-medium flex items-center">
                                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18"></path>
                                    </svg>
                                    {tripStats?.weeklyKilometers?.toLocaleString() || "320"} km minggu ini
                                </span>
                            </div>
                        </div>
                    </div>
                    
                    {/* Charts Section */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                        {/* Trip Activity Chart */}
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 transition-all hover:shadow-md">
                            <div className="h-80">
                                <Line data={tripActivityData} options={tripActivityOptions} />
                            </div>
                        </div>
                        
                        {/* Vehicle Usage Chart */}
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 transition-all hover:shadow-md">
                            <div className="h-80">
                                <Bar data={vehicleUsageData} options={vehicleUsageOptions} />
                            </div>
                        </div>
                    </div>
                    
                    {/* Additional Charts and Tables */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                        
                        
                        {/* Driver Statistics Section */}
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 transition-all hover:shadow-md">
                            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
                                <FaUserTie className="mr-2 text-indigo-500" />
                                Status Driver
                            </h3>
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-indigo-50 dark:bg-indigo-900/30 p-4 rounded-lg">
                                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Tersedia</p>
                                        <p className="text-xl font-bold text-indigo-600 dark:text-indigo-400">
                                            {driverStats?.driversByStatus?.Tersedia || 0}
                                        </p>
                                    </div>
                                    <div className="bg-yellow-50 dark:bg-yellow-900/30 p-4 rounded-lg">
                                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Sedang Bertugas</p>
                                        <p className="text-xl font-bold text-yellow-600 dark:text-yellow-400">
                                            {driverStats?.driversByStatus?.['Sedang Bertugas'] || 0}
                                        </p>
                                    </div>
                                    <div className="bg-red-50 dark:bg-red-900/30 p-4 rounded-lg">
                                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Cuti</p>
                                        <p className="text-xl font-bold text-red-600 dark:text-red-400">
                                            {driverStats?.driversByStatus?.Cuti || 0}
                                        </p>
                                    </div>
                                    <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Lainnya</p>
                                        <p className="text-xl font-bold text-gray-600 dark:text-gray-400">
                                            {driverStats?.driversByStatus?.Lainnya || 0}
                                        </p>
                                    </div>
                                </div>
                                <div className="mt-4">
                                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Driver Baru (30 hari terakhir)</h4>
                                    <div className="flex items-center">
                                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mr-2">
                                            <div 
                                                className="bg-green-600 h-2.5 rounded-full" 
                                                style={{ width: `${(driverStats?.newDrivers / driverStats?.totalDrivers) * 100}%` }}
                                            ></div>
                                        </div>
                                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                            {driverStats?.newDrivers || 0}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        
                        {/* Recent Trips Table */}
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 transition-all hover:shadow-md lg:col-span-2">
                            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                                Trip Terbaru
                            </h3>
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                    <thead>
                                        <tr>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                Kode Trip
                                            </th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                Kendaraan
                                            </th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                Driver
                                            </th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                Tujuan
                                            </th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                Tanggal
                                            </th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                Status
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                        {(recentTrips && recentTrips.length > 0 ? recentTrips : [
                                            {id: 1, code_trip: 'TRP-001', kendaraan: {merek: 'Avanza'}, driver: {nama: 'Budi'}, tujuan: 'Bandung', waktu_keberangkatan: '2023-06-15T08:30:00', status: 'Sedang Berjalan'},
                                            {id: 2, code_trip: 'TRP-002', kendaraan: {merek: 'Innova'}, driver: {nama: 'Andi'}, tujuan: 'Jakarta', waktu_keberangkatan: '2023-06-14T09:15:00', status: 'Selesai'},
                                            {id: 3, code_trip: 'TRP-003', kendaraan: {merek: 'Xenia'}, driver: {nama: 'Citra'}, tujuan: 'Surabaya', waktu_keberangkatan: '2023-06-13T10:00:00', status: 'Selesai'},
                                            {id: 4, code_trip: 'TRP-004', kendaraan: {merek: 'Fortuner'}, driver: {nama: 'Deni'}, tujuan: 'Yogyakarta', waktu_keberangkatan: '2023-06-12T07:45:00', status: 'Selesai'},
                                            {id: 5, code_trip: 'TRP-005', kendaraan: {merek: 'Alphard'}, driver: {nama: 'Eko'}, tujuan: 'Semarang', waktu_keberangkatan: '2023-06-11T11:30:00', status: 'Selesai'},
                                        ]).map((trip) => (
                                            <tr key={trip.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                                <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                                                    {trip.code_trip}
                                                </td>
                                                <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                                                    {trip.kendaraan?.merek || "-"}
                                                </td>
                                                <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                                                    {trip.driver?.name || "-"}
                                                </td>
                                                <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                                                    {trip.tujuan}
                                                </td>
                                                <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                                                    {formatDate(trip.waktu_keberangkatan)}
                                                </td>
                                                <td className="px-4 py-3 text-sm">
                                                    <span
                                                        className={`px-2 py-1 text-xs rounded-full ${
                                                            trip.status === "Sedang Berjalan"
                                                                ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                                                                : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                                        }`}
                                                    >
                                                        {trip.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </DashboardLayout>
        </>
    );
};
