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
    FaCalendarAlt,
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

export default function Dashboard({
    tripStats,
    vehicleStats,
    driverStats,
    recentTrips,
}) {
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

    // Warna untuk chart - Modern color palette
    const chartColors = {
        primary: isDarkMode ? "rgba(129, 140, 248, 1)" : "rgba(79, 70, 229, 1)", // indigo
        primaryLight: isDarkMode
            ? "rgba(129, 140, 248, 0.2)"
            : "rgba(79, 70, 229, 0.2)",
        secondary: isDarkMode
            ? "rgba(52, 211, 153, 1)"
            : "rgba(16, 185, 129, 1)", // emerald
        secondaryLight: isDarkMode
            ? "rgba(52, 211, 153, 0.2)"
            : "rgba(16, 185, 129, 0.2)",
        warning: isDarkMode ? "rgba(251, 191, 36, 1)" : "rgba(245, 158, 11, 1)", // amber
        warningLight: isDarkMode
            ? "rgba(251, 191, 36, 0.2)"
            : "rgba(245, 158, 11, 0.2)",
        danger: isDarkMode ? "rgba(248, 113, 113, 1)" : "rgba(239, 68, 68, 1)", // red
        dangerLight: isDarkMode
            ? "rgba(248, 113, 113, 0.2)"
            : "rgba(239, 68, 68, 0.2)",
        purple: isDarkMode ? "rgba(167, 139, 250, 1)" : "rgba(139, 92, 246, 1)", // purple
        purpleLight: isDarkMode
            ? "rgba(167, 139, 250, 0.2)"
            : "rgba(139, 92, 246, 0.2)",
        text: isDarkMode ? "rgba(229, 231, 235, 0.9)" : "rgba(55, 65, 81, 0.9)",
        grid: isDarkMode ? "rgba(75, 85, 99, 0.2)" : "rgba(209, 213, 219, 0.2)",
    };

    // Opsi umum untuk chart
    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: "top",
                labels: {
                    color: chartColors.text,
                    font: {
                        size: 12,
                        family: "'Inter', sans-serif",
                        weight: 500,
                    },
                    usePointStyle: true,
                    padding: 20,
                },
            },
            tooltip: {
                backgroundColor: isDarkMode
                    ? "rgba(30, 41, 59, 0.9)"
                    : "rgba(255, 255, 255, 0.95)",
                titleColor: isDarkMode
                    ? "rgba(255, 255, 255, 0.95)"
                    : "rgba(17, 24, 39, 0.95)",
                bodyColor: isDarkMode
                    ? "rgba(255, 255, 255, 0.8)"
                    : "rgba(55, 65, 81, 0.9)",
                borderColor: isDarkMode
                    ? "rgba(75, 85, 99, 0.2)"
                    : "rgba(209, 213, 219, 0.3)",
                borderWidth: 1,
                padding: 12,
                boxPadding: 6,
                usePointStyle: true,
                bodyFont: {
                    family: "'Inter', sans-serif",
                },
                cornerRadius: 8,
            },
        },
        scales: {
            x: {
                grid: {
                    color: chartColors.grid,
                    drawBorder: false,
                },
                ticks: {
                    color: chartColors.text,
                    font: {
                        family: "'Inter', sans-serif",
                        weight: 500,
                    },
                    padding: 10,
                },
            },
            y: {
                grid: {
                    color: chartColors.grid,
                    drawBorder: false,
                },
                ticks: {
                    color: chartColors.text,
                    font: {
                        family: "'Inter', sans-serif",
                        weight: 500,
                    },
                    padding: 10,
                },
                beginAtZero: true,
            },
        },
        elements: {
            line: {
                tension: 0.4, // Smoother curves
            },
            point: {
                radius: 4,
                hoverRadius: 6,
            },
        },
    };

    // Data untuk Trip Activity Chart (Line Chart)
    const tripActivityData = {
        labels: tripStats?.dailyLabels || [
            "Sen",
            "Sel",
            "Rab",
            "Kam",
            "Jum",
            "Sab",
            "Min",
        ],
        datasets: [
            {
                label: "Total Trip",
                data: tripStats?.dailyCounts || [5, 8, 6, 9, 7, 3, 4],
                borderColor: chartColors.primary,
                backgroundColor: chartColors.primaryLight,
                tension: 0.4,
                fill: true,
                pointBackgroundColor: chartColors.primary,
            },
            {
                label: "Total Kilometer",
                data: tripStats?.dailyKilometers || [
                    120, 180, 150, 210, 160, 90, 110,
                ],
                borderColor: chartColors.secondary,
                backgroundColor: chartColors.secondaryLight,
                tension: 0.4,
                fill: true,
                pointBackgroundColor: chartColors.secondary,
                yAxisID: "y1",
            },
        ],
    };

    // Opsi khusus untuk Trip Activity Chart
    const tripActivityOptions = {
        ...chartOptions,
        plugins: {
            ...chartOptions.plugins,
            title: {
                display: true,
                text: "Aktivitas Trip Mingguan",
                color: chartColors.text,
                font: {
                    size: 16,
                    weight: "bold",
                    family: "'Inter', sans-serif",
                },
                padding: {
                    top: 10,
                    bottom: 20,
                },
            },
        },
        scales: {
            ...chartOptions.scales,
            y: {
                ...chartOptions.scales.y,
                title: {
                    display: true,
                    text: "Jumlah Trip",
                    color: chartColors.text,
                    font: {
                        weight: 500,
                    },
                    padding: {
                        bottom: 10,
                    },
                },
            },
            y1: {
                position: "right",
                title: {
                    display: true,
                    text: "Kilometer",
                    color: chartColors.text,
                    font: {
                        weight: 500,
                    },
                    padding: {
                        bottom: 10,
                    },
                },
                grid: {
                    drawOnChartArea: false,
                    color: chartColors.grid,
                    drawBorder: false,
                },
                ticks: {
                    color: chartColors.text,
                    font: {
                        family: "'Inter', sans-serif",
                        weight: 500,
                    },
                    padding: 10,
                },
                beginAtZero: true,
            },
        },
    };

    // Data untuk Vehicle Usage Chart (Bar Chart)
    const vehicleUsageData = {
        labels: vehicleStats?.labels || [
            "Avanza",
            "Innova",
            "Xenia",
            "Fortuner",
            "Alphard",
        ],
        datasets: [
            {
                label: "Jumlah Trip",
                data: vehicleStats?.tripCounts || [12, 8, 10, 5, 3],
                backgroundColor: [
                    chartColors.primary,
                    chartColors.secondary,
                    chartColors.warning,
                    chartColors.danger,
                    chartColors.purple,
                ],
                borderRadius: 8,
                borderWidth: 0,
                hoverOffset: 4,
            },
        ],
    };

    // Opsi khusus untuk Vehicle Usage Chart
    const vehicleUsageOptions = {
        ...chartOptions,
        plugins: {
            ...chartOptions.plugins,
            title: {
                display: true,
                text: "Penggunaan Kendaraan",
                color: chartColors.text,
                font: {
                    size: 16,
                    weight: "bold",
                    family: "'Inter', sans-serif",
                },
                padding: {
                    top: 10,
                    bottom: 20,
                },
            },
        },
        scales: {
            ...chartOptions.scales,
            y: {
                ...chartOptions.scales.y,
                title: {
                    display: true,
                    text: "Jumlah Trip",
                    color: chartColors.text,
                    font: {
                        weight: 500,
                    },
                    padding: {
                        bottom: 10,
                    },
                },
            },
        },
    };

    // Format tanggal
    const formatDate = (dateString) => {
        if (!dateString) return "-";
        const date = new Date(dateString);
        return date.toLocaleDateString("id-ID", {
            day: "numeric",
            month: "short",
            year: "numeric",
        });
    };

    // Format waktu
    const formatTime = (dateString) => {
        if (!dateString) return "-";
        const date = new Date(dateString);
        return date.toLocaleTimeString("id-ID", {
            hour: "2-digit",
            minute: "2-digit",
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
                        <div className="bg-white dark:bg-[#1f2937] rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 p-5 transition-all hover:shadow-md">
                            <div className="flex items-center">
                                <div className="p-3 rounded-xl bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 mr-4">
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
                                <span className="text-emerald-500 dark:text-emerald-400 font-medium flex items-center">
                                    <svg
                                        className="w-4 h-4 mr-1"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M5 10l7-7m0 0l7 7m-7-7v18"
                                        ></path>
                                    </svg>
                                    {vehicleStats?.availableVehicles || 0}{" "}
                                    tersedia
                                </span>
                            </div>
                        </div>

                        {/* Total Driver */}
                        <div className="bg-white dark:bg-[#1f2937] rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 p-5 transition-all hover:shadow-md">
                            <div className="flex items-center">
                                <div className="p-3 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 mr-4">
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
                                <span className="text-emerald-500 dark:text-emerald-400 font-medium flex items-center">
                                    <svg
                                        className="w-4 h-4 mr-1"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M5 10l7-7m0 0l7 7m-7-7v18"
                                        ></path>
                                    </svg>
                                    {driverStats?.availableDrivers || 0}{" "}
                                    tersedia
                                </span>
                            </div>
                        </div>

                        {/* Total Trip */}
                        <div className="bg-white dark:bg-[#1f2937] rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 p-5 transition-all hover:shadow-md">
                            <div className="flex items-center">
                                <div className="p-3 rounded-xl bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 mr-4">
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
                                <span className="text-amber-500 dark:text-amber-400 font-medium flex items-center">
                                    <svg
                                        className="w-4 h-4 mr-1"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                                        ></path>
                                    </svg>
                                    {tripStats?.activeTrips || 0} sedang
                                    berjalan
                                </span>
                            </div>
                        </div>

                        {/* Total Kilometer */}
                        <div className="bg-white dark:bg-[#1f2937] rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 p-5 transition-all hover:shadow-md">
                            <div className="flex items-center">
                                <div className="p-3 rounded-xl bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 mr-4">
                                    <FaTachometerAlt className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                        Total Kilometer
                                    </p>
                                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                        {tripStats?.totalKilometers?.toLocaleString() ||
                                            "0"}{" "}
                                        km
                                    </p>
                                </div>
                            </div>
                            <div className="mt-3 flex items-center text-sm">
                                <span className="text-emerald-500 dark:text-emerald-400 font-medium flex items-center">
                                    <svg
                                        className="w-4 h-4 mr-1"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M5 10l7-7m0 0l7 7m-7-7v18"
                                        ></path>
                                    </svg>
                                    {tripStats?.weeklyKilometers?.toLocaleString() ||
                                        "320"}{" "}
                                    km minggu ini
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Charts Section */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                        {/* Trip Activity Chart */}
                        <div className="bg-white dark:bg-[#1f2937] rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 p-5 transition-all hover:shadow-md">
                            <div className="h-80">
                                <Line
                                    data={tripActivityData}
                                    options={tripActivityOptions}
                                />
                            </div>
                        </div>

                        {/* Vehicle Usage Chart */}
                        <div className="bg-white dark:bg-[#1f2937] rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 p-5 transition-all hover:shadow-md">
                            <div className="h-80">
                                <Bar
                                    data={vehicleUsageData}
                                    options={vehicleUsageOptions}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Additional Charts and Tables */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                        {/* Driver Statistics Section */}
                        <div className="bg-white dark:bg-[#1f2937] rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 p-5 transition-all hover:shadow-md">
                            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
                                <FaUserTie className="mr-2 text-indigo-500 dark:text-indigo-400" />
                                Status Driver
                            </h3>
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-xl">
                                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                            Tersedia
                                        </p>
                                        <p className="text-xl font-bold text-indigo-600 dark:text-indigo-400">
                                            {driverStats?.driversByStatus
                                                ?.Tersedia || 0}
                                        </p>
                                    </div>
                                    <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-xl">
                                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                            Sedang Bertugas
                                        </p>
                                        <p className="text-xl font-bold text-amber-600 dark:text-amber-400">
                                            {driverStats?.driversByStatus?.[
                                                "Sedang Bertugas"
                                            ] || 0}
                                        </p>
                                    </div>
                                    <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-xl">
                                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                            Cuti
                                        </p>
                                        <p className="text-xl font-bold text-red-600 dark:text-red-400">
                                            {driverStats?.driversByStatus
                                                ?.Cuti || 0}
                                        </p>
                                    </div>
                                    <div className="bg-gray-50 dark:bg-gray-700/30 p-4 rounded-xl">
                                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                            Lainnya
                                        </p>
                                        <p className="text-xl font-bold text-gray-600 dark:text-gray-300">
                                            {driverStats?.driversByStatus
                                                ?.Lainnya || 0}
                                        </p>
                                    </div>
                                </div>
                                <div className="mt-4">
                                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Driver Baru (30 hari terakhir)
                                    </h4>
                                    <div className="flex items-center">
                                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mr-2 overflow-hidden">
                                            <div
                                                className="bg-gradient-to-r from-emerald-500 to-emerald-400 h-2.5 rounded-full"
                                                style={{
                                                    width: `${
                                                        (driverStats?.newDrivers /
                                                            driverStats?.totalDrivers) *
                                                        100
                                                    }%`,
                                                }}
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
                        <div className="bg-white dark:bg-[#1f2937] rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 p-5 transition-all hover:shadow-md lg:col-span-2">
                            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
                                <FaRoute className="mr-2 text-blue-500 dark:text-blue-400" />
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
                                    <tbody className="bg-white dark:bg-[#1f2937] divide-y divide-gray-200 dark:divide-gray-700">
                                        {(recentTrips && recentTrips.length > 0
                                            ? recentTrips
                                            : "Tidak ada data"
                                        ).map((trip) => (
                                            <tr
                                                key={trip.id}
                                                className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors duration-150"
                                            >
                                                <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">
                                                    <span className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-md text-xs">
                                                        {trip.code_trip}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
                                                    {trip.kendaraan?.merek ||
                                                        "-"}
                                                </td>
                                                <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
                                                    {trip.driver?.name || "-"}
                                                </td>
                                                <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
                                                    <div className="flex items-center">
                                                        <FaMapMarkerAlt className="text-red-500 dark:text-red-400 mr-1 flex-shrink-0" />
                                                        <span>
                                                            {trip.tujuan}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
                                                    <div className="flex flex-col">
                                                        <span>
                                                            {formatDate(
                                                                trip.waktu_keberangkatan
                                                            )}
                                                        </span>
                                                        <span className="text-xs text-gray-500 dark:text-gray-400">
                                                            {formatTime(
                                                                trip.waktu_keberangkatan
                                                            )}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3 text-sm">
                                                    <span
                                                        className={`px-2.5 py-1 text-xs rounded-full inline-flex items-center ${
                                                            trip.status ===
                                                            "Sedang Berjalan"
                                                                ? "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300"
                                                                : "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300"
                                                        }`}
                                                    >
                                                        {trip.status ===
                                                            "Sedang Berjalan" && (
                                                            <span className="w-1.5 h-1.5 bg-amber-500 rounded-full mr-1.5 animate-pulse"></span>
                                                        )}
                                                        {trip.status ===
                                                            "Selesai" && (
                                                            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mr-1.5"></span>
                                                        )}
                                                        {trip.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* View All Link */}
                            <div className="mt-4 text-center">
                                <Link
                                    href={route("trips.index")}
                                    className="inline-flex items-center text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 transition-colors"
                                >
                                    Lihat Semua Trip
                                    <svg
                                        className="ml-1 w-4 h-4"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M9 5l7 7-7 7"
                                        ></path>
                                    </svg>
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Summary Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        {/* Top Destinations */}
                        <div className="bg-white dark:bg-[#1f2937] rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 p-5 transition-all hover:shadow-md">
                            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
                                <FaMapMarkerAlt className="mr-2 text-red-500 dark:text-red-400" />
                                Tujuan Terpopuler
                            </h3>
                            <div className="space-y-3">
                                {(
                                    tripStats?.topDestinations || [
                                        { name: "Bandung", count: 12 },
                                        { name: "Jakarta", count: 8 },
                                        { name: "Surabaya", count: 6 },
                                        { name: "Yogyakarta", count: 5 },
                                    ]
                                ).map((destination, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center justify-between"
                                    >
                                        <div className="flex items-center">
                                            <span className="w-8 h-8 flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-lg text-gray-700 dark:text-gray-300 font-medium mr-3">
                                                {index + 1}
                                            </span>
                                            <span className="text-gray-800 dark:text-gray-200">
                                                {destination.name}
                                            </span>
                                        </div>
                                        <span className="bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 px-2.5 py-1 rounded-lg text-xs font-medium">
                                            {destination.count} trip
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Monthly Stats */}
                        <div className="bg-white dark:bg-[#1f2937] rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 p-5 transition-all hover:shadow-md">
                            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
                                <FaCalendarAlt className="mr-2 text-blue-500 dark:text-blue-400" />
                                Statistik Bulanan
                            </h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-4 rounded-xl text-white">
                                    <p className="text-xs font-medium text-indigo-100 mb-1">
                                        Total Trip Bulan Ini
                                    </p>
                                    <p className="text-2xl font-bold">
                                        {tripStats?.monthlyTrips || 42}
                                    </p>
                                    <div className="mt-2 text-xs flex items-center text-indigo-100">
                                        <svg
                                            className="w-3 h-3 mr-1"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M5 10l7-7m0 0l7 7m-7-7v18"
                                            ></path>
                                        </svg>
                                        <span>
                                            {tripStats?.monthlyTripGrowth || 12}
                                            % dari bulan lalu
                                        </span>
                                    </div>
                                </div>
                                <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-4 rounded-xl text-white">
                                    <p className="text-xs font-medium text-emerald-100 mb-1">
                                        Jarak Tempuh Bulan Ini
                                    </p>
                                    <p className="text-2xl font-bold">
                                        {tripStats?.monthlyKilometers?.toLocaleString() ||
                                            "1,250"}{" "}
                                        km
                                    </p>
                                    <div className="mt-2 text-xs flex items-center text-emerald-100">
                                        <svg
                                            className="w-3 h-3 mr-1"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M5 10l7-7m0 0l7 7m-7-7v18"
                                            ></path>
                                        </svg>
                                        <span>
                                            {tripStats?.monthlyKilometerGrowth ||
                                                8}
                                            % dari bulan lalu
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </DashboardLayout>
        </>
    );
}
