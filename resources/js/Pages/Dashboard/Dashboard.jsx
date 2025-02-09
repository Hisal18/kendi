import React, { useState } from "react";
import DashboardLayout from "../../Layouts/DashboardLayout";
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
} from "chart.js";
import { Line, Bar } from "react-chartjs-2";
import { Head, usePage } from "@inertiajs/react";

// Registrasi ChartJS components
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend
);

export default function Dashboard() {
    const { auth } = usePage().props;
    const [isDarkMode, setIsDarkMode] = useState(
        localStorage.getItem("darkMode") === "true"
    );

    // Konfigurasi untuk Line Chart
    const lineChartData = {
        labels: ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"],
        datasets: [
            {
                label: "Total Kilometer",
                data: [120, 150, 90, 170, 130, 80, 100],
                borderColor: "rgb(99, 102, 241)",
                backgroundColor: "rgba(99, 102, 241, 0.5)",
                tension: 0.4,
            },
        ],
    };

    const lineChartOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: "top",
                labels: {
                    color: isDarkMode ? "#fff" : "#000",
                },
            },
            title: {
                display: true,
                text: "Statistik Penggunaan Kendaraan (KM)",
                color: isDarkMode ? "#fff" : "#000",
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                grid: {
                    color: isDarkMode
                        ? "rgba(255, 255, 255, 0.1)"
                        : "rgba(0, 0, 0, 0.1)",
                },
                ticks: {
                    color: isDarkMode ? "#fff" : "#000",
                },
            },
            x: {
                grid: {
                    color: isDarkMode
                        ? "rgba(255, 255, 255, 0.1)"
                        : "rgba(0, 0, 0, 0.1)",
                },
                ticks: {
                    color: isDarkMode ? "#fff" : "#000",
                },
            },
        },
    };

    // Konfigurasi untuk Bar Chart
    const barChartData = {
        labels: [
            "Toyota Innova",
            "Honda Civic",
            "Suzuki Ertiga",
            "Mitsubishi Pajero",
        ],
        datasets: [
            {
                label: "Frekuensi Penggunaan",
                data: [25, 18, 15, 12],
                backgroundColor: "rgba(99, 102, 241, 0.8)",
                borderColor: "rgb(99, 102, 241)",
                borderWidth: 1,
            },
        ],
    };

    const barChartOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: "top",
                labels: {
                    color: isDarkMode ? "#fff" : "#000",
                },
            },
            title: {
                display: true,
                text: "Frekuensi Penggunaan Kendaraan",
                color: isDarkMode ? "#fff" : "#000",
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                grid: {
                    color: isDarkMode
                        ? "rgba(255, 255, 255, 0.1)"
                        : "rgba(0, 0, 0, 0.1)",
                },
                ticks: {
                    color: isDarkMode ? "#fff" : "#000",
                },
            },
            x: {
                grid: {
                    color: isDarkMode
                        ? "rgba(255, 255, 255, 0.1)"
                        : "rgba(0, 0, 0, 0.1)",
                },
                ticks: {
                    color: isDarkMode ? "#fff" : "#000",
                },
            },
        },
    };

    return (
        <>
        <Head title="Dashboard"/>
        <DashboardLayout auth={auth}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 mx-4 lg:mx-0">
                <div className="bg-[#FAF9F6] dark:bg-[#313131] p-6 rounded-lg shadow-md">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                Total Kendaraan
                            </p>
                            <h3 className="text-2xl font-bold text-gray-700 dark:text-gray-200">
                                12
                            </h3>
                        </div>
                        <div className="p-3 bg-indigo-100 dark:bg-indigo-900 rounded-full">
                            <svg
                                className="w-6 h-6 text-indigo-500 dark:text-indigo-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M5 13l4 4L19 7"
                                ></path>
                            </svg>
                        </div>
                    </div>
                    <p className="text-sm text-green-500 mt-2">+2 bulan ini</p>
                </div>

                <div className="bg-[#FAF9F6] dark:bg-[#313131] p-6 rounded-lg shadow-md">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                Sedang Digunakan
                            </p>
                            <h3 className="text-2xl font-bold text-gray-700 dark:text-gray-200">
                                5
                            </h3>
                        </div>
                        <div className="p-3 bg-yellow-100 dark:bg-yellow-900 rounded-full">
                            <svg
                                className="w-6 h-6 text-yellow-500 dark:text-yellow-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                ></path>
                            </svg>
                        </div>
                    </div>
                    <p className="text-sm text-yellow-500 mt-2">
                        3 akan kembali hari ini
                    </p>
                </div>

                <div className="bg-[#FAF9F6] dark:bg-[#313131] p-6 rounded-lg shadow-md">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                Tersedia
                            </p>
                            <h3 className="text-2xl font-bold text-gray-700 dark:text-gray-200">
                                7
                            </h3>
                        </div>
                        <div className="p-3 bg-green-100 dark:bg-green-900 rounded-full">
                            <svg
                                className="w-6 h-6 text-green-500 dark:text-green-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                ></path>
                            </svg>
                        </div>
                    </div>
                    <p className="text-sm text-green-500 mt-2">
                        Siap digunakan
                    </p>
                </div>

                <div className="bg-[#FAF9F6] dark:bg-[#313131] p-6 rounded-lg shadow-md">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                Dalam Perawatan
                            </p>
                            <h3 className="text-2xl font-bold text-gray-700 dark:text-gray-200">
                                2
                            </h3>
                        </div>
                        <div className="p-3 bg-red-100 dark:bg-red-900 rounded-full">
                            <svg
                                className="w-6 h-6 text-red-500 dark:text-red-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                                ></path>
                            </svg>
                        </div>
                    </div>
                    <p className="text-sm text-red-500 mt-2">
                        Sedang perbaikan
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mx-4 lg:mx-0">
                <div className="bg-[#FAF9F6] dark:bg-[#313131] p-6 rounded-lg shadow-md">
                    <Line data={lineChartData} options={lineChartOptions} />
                </div>
                <div className="bg-[#FAF9F6] dark:bg-[#313131] p-6 rounded-lg shadow-md">
                    <Bar data={barChartData} options={barChartOptions} />
                </div>
            </div>

            <div className="mt-6 bg-[#FAF9F6] dark:bg-[#313131] rounded-lg shadow-md mx-4 lg:mx-0">
                <div className="p-6">
                    <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-4">
                        Peminjaman Terbaru
                    </h3>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                            <thead>
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        Kendaraan
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        Peminjam
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        Tanggal Pinjam
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        Status
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                <tr>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                                        Toyota Innova
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                                        Budi Santoso
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                                        2024-03-15
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                                            Aktif
                                        </span>
                                    </td>
                                </tr>
                                <tr>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                                        Honda Civic
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                                        Siti Aminah
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                                        2024-03-14
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                                            Pending
                                        </span>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </DashboardLayout>
        </>
    );
};
