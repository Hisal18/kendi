import DashboardLayout from "@/Layouts/DashboardLayout";
import { Head } from "@inertiajs/react";
import React, { useState, useEffect, useRef } from "react";
import dateFormat, { masks } from "dateformat";
import {
    FaCar,
    FaArrowRight,
    FaArrowLeft,
    FaParking,
    FaTimes,
    FaSearch,
    FaFileExcel,
    FaChevronLeft,
    FaChevronRight,
    FaEllipsisH,
    FaPlus,
    FaFilePdf,
    FaCamera,
    FaPowerOff,
    FaSyncAlt,
} from "react-icons/fa";
import * as XLSX from "xlsx";
import { useForm } from "@inertiajs/react";

export default function Kendaraankeluar({ trips, kendaraans }) {
    // console.log(trips);

    const [searchTerm, setSearchTerm] = useState("");
    const [currentTime, setCurrentTime] = useState(new Date());
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8; // Jumlah item per halaman
    const [showExportDropdown, setShowExportDropdown] = useState(false);
    const [showPopup, setShowPopup] = useState(false);

    const [isLoading, setIsLoading] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        code_trip: "",
        kendaraan_id: "",
        waktu_keberangkatan: "",
        tujuan: "",
        catatan: "",
    });

    const [isCameraOpen, setIsCameraOpen] = useState(false);
    const [photo, setPhoto] = useState(null);
    const videoRef = useRef(null);
    const streamRef = useRef(null);

    // Tambahkan state untuk mengontrol rendering video element
    const [isInitializingCamera, setIsInitializingCamera] = useState(false);

    // Tambahkan state untuk facing mode kamera
    const [facingMode, setFacingMode] = useState("environment"); // 'environment' untuk kamera belakang, 'user' untuk kamera depan

    // Tambahkan state untuk mengontrol animasi
    const [isRotating, setIsRotating] = useState(false);

    const filteredTrips = trips.filter(
        (trip) =>
            trip.kendaraan.plat_kendaraan
                .toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
            trip.code_trip.toLowerCase().includes(searchTerm.toLowerCase()) ||
            trip.tujuan.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalPages = Math.ceil(filteredTrips.length / itemsPerPage);

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredTrips.slice(indexOfFirstItem, indexOfLastItem);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    // Export ke Excel
    const exportToExcel = () => {
        const dataToExport = filteredTrips.map((trip, index) => ({
            No: index + 1,
            "Kode Trip": trip.code_trip,
            "Plat Kendaraan": trip.kendaraan.plat_kendaraan,
            Tujuan: trip.tujuan,
            "Tanggal Berangkat": dateFormat(
                trip.waktu_keberangkatan,
                "dd mmmm yyyy, HH:MM:ss"
            ),
            "Tanggal Kembali": dateFormat(
                trip.waktu_kembali,
                "dd mmmm yyyy, HH:MM:ss"
            ),
            "KM Awal": trip.kendaraan.km_awal,
            "KM Akhir": trip.kendaraan.km_akhir,
            Status: trip.status,
            Catatan: trip.catatan,
        }));

        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.json_to_sheet(dataToExport);

        const colWidths = [
            { wch: 5 },
            { wch: 15 },
            { wch: 15 },
            { wch: 20 },
            { wch: 30 },
            { wch: 30 },
            { wch: 10 },
            { wch: 15 },
            { wch: 15 },
            { wch: 50 },
        ];
        ws["!cols"] = colWidths;

        XLSX.utils.book_append_sheet(wb, ws, "Data Kendaraan Keluar");

        const fileName = `Data_Kendaraan_Keluar_${
            new Date().toISOString().split("T")[0]
        }.xlsx`;

        XLSX.writeFile(wb, fileName);
    };

    const getPaginationNumbers = () => {
        const pages = [];
        const maxVisiblePages = 5;

        if (totalPages <= maxVisiblePages) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            pages.push(1);
            let start = Math.max(2, currentPage - 1);
            let end = Math.min(currentPage + 1, totalPages - 1);
            if (start > 2) {
                pages.push("...");
            }
            for (let i = start; i <= end; i++) {
                pages.push(i);
            }
            if (end < totalPages - 1) {
                pages.push("...");
            }
            pages.push(totalPages);
        }
        return pages;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("trips.store"), {
            onSuccess: () => {
                reset();
                setShowPopup(false);
            },
        });
    };

    // Update fungsi startCamera untuk menggunakan facingMode
    const startCamera = async () => {
        try {
            setIsInitializingCamera(true);
            await new Promise((resolve) => setTimeout(resolve, 100));

            const constraints = {
                video: {
                    facingMode: facingMode,
                    // Tambahkan konfigurasi untuk mengizinkan HTTP
                    advanced: [
                        { zoom: true },
                        { whiteBalanceMode: true },
                        { focusMode: true },
                    ],
                },
            };

            // Cek apakah menggunakan HTTP
            if (window.location.protocol === "http:") {
                // Tambahkan opsi keamanan untuk HTTP
                constraints.video.optional = [{ facingMode: facingMode }];
            }

            const stream = await navigator.mediaDevices.getUserMedia(
                constraints
            );

            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                streamRef.current = stream;

                videoRef.current.onloadedmetadata = () => {
                    videoRef.current.play();
                };

                setIsCameraOpen(true);
            } else {
                stream.getTracks().forEach((track) => track.stop());
                throw new Error("Video element tidak tersedia");
            }
        } catch (err) {
            console.error("Error mengakses kamera:", err);
            alert(
                "Tidak dapat mengakses kamera. Pastikan memberikan izin akses kamera dan menggunakan HTTPS atau localhost."
            );
        } finally {
            setIsInitializingCamera(false);
        }
    };

    // Modifikasi fungsi switchCamera
    const switchCamera = async () => {
        setIsRotating(true); // Mulai animasi

        // Hentikan stream kamera yang sedang berjalan
        if (streamRef.current) {
            streamRef.current.getTracks().forEach((track) => track.stop());
        }

        // Tukar facing mode
        setFacingMode((prevMode) =>
            prevMode === "environment" ? "user" : "environment"
        );

        // Restart kamera dengan facing mode yang baru
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: {
                    facingMode:
                        facingMode === "environment" ? "user" : "environment",
                },
            });

            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                streamRef.current = stream;
            }
        } catch (err) {
            console.error("Error saat menukar kamera:", err);
            alert(
                "Gagal menukar kamera. Pastikan perangkat Anda memiliki kamera depan dan belakang."
            );
        } finally {
            // Hentikan animasi setelah 1 detik
            setTimeout(() => {
                setIsRotating(false);
            }, 1000);
        }
    };

    // Fungsi untuk mengambil foto
    const capturePhoto = () => {
        const canvas = document.createElement("canvas");
        canvas.width = videoRef.current.videoWidth;
        canvas.height = videoRef.current.videoHeight;
        canvas.getContext("2d").drawImage(videoRef.current, 0, 0);
        const photoData = canvas.toDataURL("image/jpeg");
        setPhoto(photoData);
        stopCamera();
    };

    // Fungsi untuk menghentikan kamera
    const stopCamera = () => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach((track) => track.stop());
            setIsCameraOpen(false);
        }
    };

    // Fungsi untuk menghapus foto
    const deletePhoto = () => {
        setPhoto(null);
    };

    return (
        <>
            <Head title="Monitoring Kendaraan" />
            <DashboardLayout>
                <div className="py-4">
                    {/* Header Section dengan Background Gradient dan Waktu Real-time */}
                    <div className="mb-8 text-white">
                        <h1 className="text-3xl font-bold mb-2 text-gray-500 dark:text-gray-400">
                            Monitoring Kendaraan
                        </h1>
                        <p className="opacity-90 text-gray-700 dark:text-gray-500">
                            Data monitoring kendaraan hari ini -{" "}
                            {dateFormat(currentTime, "dd mmmm yyyy, HH:MM:ss")}
                        </p>
                    </div>

                    {/* Stats Cards dengan Animasi Hover */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                        <div className="bg-white dark:bg-[#313131] rounded-xl p-6 shadow-lg transform transition-all duration-300 hover:scale-105">
                            <div className="flex items-center space-x-4">
                                <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-full">
                                    <FaCar className="text-blue-500 dark:text-blue-400 text-xl" />
                                </div>
                                <div>
                                    <h3 className="text-gray-500 dark:text-gray-400 text-sm">
                                        Total Kendaraan
                                    </h3>
                                    <p className="text-2xl font-bold text-gray-800 dark:text-white">
                                        24
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white dark:bg-[#313131] rounded-xl p-6 shadow-lg transform transition-all duration-300 hover:scale-105">
                            <div className="flex items-center space-x-4">
                                <div className="bg-green-100 dark:bg-green-900 p-3 rounded-full">
                                    <FaArrowRight className="text-green-500 dark:text-green-400 text-xl" />
                                </div>
                                <div>
                                    <h3 className="text-gray-500 dark:text-gray-400 text-sm">
                                        Kendaraan Tersedia
                                    </h3>
                                    <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                                        15
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white dark:bg-[#313131] rounded-xl p-6 shadow-lg transform transition-all duration-300 hover:scale-105">
                            <div className="flex items-center space-x-4">
                                <div className="bg-red-100 dark:bg-red-900 p-3 rounded-full">
                                    <FaArrowLeft className="text-red-500 dark:text-red-400 text-xl" />
                                </div>
                                <div>
                                    <h3 className="text-gray-500 dark:text-gray-400 text-sm">
                                        Kendaraan Keluar
                                    </h3>
                                    <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                                        9
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white dark:bg-[#313131] rounded-xl p-6 shadow-lg transform transition-all duration-300 hover:scale-105">
                            <div className="flex items-center space-x-4">
                                <div className="bg-purple-100 dark:bg-purple-900 p-3 rounded-full">
                                    <FaParking className="text-purple-500 dark:text-purple-400 text-xl" />
                                </div>
                                <div>
                                    <h3 className="text-gray-500 dark:text-gray-400 text-sm">
                                        Dalam Parkiran
                                    </h3>
                                    <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                                        6
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Table Section dengan Search Bar dan Export Button */}
                    <div className="bg-white dark:bg-[#313131] rounded-xl shadow-lg overflow-hidden">
                        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                                <div className="relative w-full md:w-auto">
                                    <input
                                        type="text"
                                        placeholder="Cari kendaraan..."
                                        className="w-full md:w-80 pl-12 pr-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl dark:bg-[#515151] dark:text-white focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none transition-colors duration-200"
                                        value={searchTerm}
                                        onChange={(e) =>
                                            setSearchTerm(e.target.value)
                                        }
                                    />
                                    <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
                                </div>
                                <div className="flex flex-col md:flex-row items-center gap-4">
                                    {/* Button Tambah Data */}
                                    <button
                                        onClick={() => setShowPopup(true)}
                                        className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-6 py-2.5 rounded-lg transition-all duration-200 font-medium shadow-sm hover:shadow-md"
                                    >
                                        <FaPlus className="text-lg" />
                                        <span>Tambah Data</span>
                                    </button>

                                    {/* Dropdown Export */}
                                    <div className="relative">
                                        <button
                                            onClick={() =>
                                                setShowExportDropdown(
                                                    !showExportDropdown
                                                )
                                            }
                                            className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white p-4 rounded-lg shadow-sm hover:shadow-md"
                                        >
                                            {/* <FaFileExport className="text-lg" /> */}
                                            {/* <span>Export</span> */}
                                            <FaChevronRight
                                                className={`text-sm transition-transform duration-200 ${
                                                    showExportDropdown
                                                        ? "rotate-90"
                                                        : ""
                                                }`}
                                            />
                                        </button>

                                        {/* Dropdown Menu */}
                                        {showExportDropdown && (
                                            <div
                                                className={`absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-[#313131] ring-1 ring-black ring-opacity-5 z-50 transform transition-all duration-300 ease-in-out origin-top-right ${
                                                    showExportDropdown
                                                        ? "scale-100 opacity-100"
                                                        : "scale-95 opacity-0"
                                                }`}
                                            >
                                                <div className="py-1">
                                                    <button
                                                        onClick={() => {
                                                            exportToExcel();
                                                            setShowExportDropdown(
                                                                false
                                                            );
                                                        }}
                                                        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-[#414141] w-full transition-colors duration-200 transform hover:translate-x-1"
                                                    >
                                                        <FaFileExcel className="text-emerald-500" />
                                                        Export Excel
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            // Handle PDF export
                                                            setShowExportDropdown(
                                                                false
                                                            );
                                                        }}
                                                        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-[#414141] w-full transition-colors duration-200 transform hover:translate-x-1"
                                                    >
                                                        <FaFilePdf className="text-red-500" />
                                                        Export PDF
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 dark:bg-[#515151]">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                            No
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                            code Trip
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                            No Polisi
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                            Tujuan
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                            Tanggal Berangkat
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                            Tanggal Kembali
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                            KM Awal
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                            KM Akhir
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                            Jarak
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                            Status
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white dark:bg-[#313131] divide-y divide-gray-200 dark:divide-gray-700">
                                    {currentItems.map((item, index) => (
                                        <tr
                                            key={index}
                                            className="hover:bg-gray-50 dark:hover:bg-[#717171] transition-colors duration-200"
                                        >
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">
                                                {indexOfFirstItem + index + 1}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">
                                                {item.code_trip}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">
                                                {item.kendaraan.plat_kendaraan}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">
                                                {item.tujuan}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">
                                                {dateFormat(
                                                    item.waktu_keberangkatan,
                                                    "dd mmmm yyyy, HH:MM:ss"
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">
                                                {item.waktu_kembali === null
                                                    ? "-"
                                                    : dateFormat(
                                                          item.waktu_kembali,
                                                          "dd mmmm yyyy, HH:MM:ss"
                                                      )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">
                                                {new Intl.NumberFormat(
                                                    "id-ID"
                                                ).format(
                                                    item.kendaraan.km_awal
                                                )}
                                                {" KM"}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">
                                                {new Intl.NumberFormat(
                                                    "id-ID"
                                                ).format(
                                                    item.kendaraan.km_akhir
                                                )}
                                                {" KM"}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">
                                                {item.km_akhir - item.km_awal}
                                                {" KM"}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span
                                                    className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-md ${
                                                        item.status ===
                                                        "Sedang Berjalan"
                                                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                                                            : item.status ===
                                                              "Selesai"
                                                            ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
                                                            : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                                                    }`}
                                                >
                                                    {item.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            {/* Pagination baru yang lebih modern */}
                            <div className="px-6 py-4 flex items-center justify-between border-t border-gray-200 dark:border-gray-700">
                                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                                    Showing{" "}
                                    <span className="font-medium mx-1">
                                        {indexOfFirstItem + 1}
                                    </span>
                                    to{" "}
                                    <span className="font-medium mx-1">
                                        {Math.min(
                                            indexOfLastItem,
                                            filteredTrips.length
                                        )}
                                    </span>
                                    of{" "}
                                    <span className="font-medium mx-1">
                                        {filteredTrips.length}
                                    </span>{" "}
                                    entries
                                </div>

                                <div className="flex items-center space-x-2">
                                    {/* Previous Button */}
                                    <button
                                        onClick={() =>
                                            paginate(currentPage - 1)
                                        }
                                        disabled={currentPage === 1}
                                        className={`flex items-center justify-center w-10 h-10 rounded-full ${
                                            currentPage === 1
                                                ? "text-gray-400 cursor-not-allowed"
                                                : "text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                                        } transition-colors duration-200`}
                                    >
                                        <FaChevronLeft className="w-4 h-4" />
                                    </button>

                                    {/* Page Numbers */}
                                    <div className="flex items-center space-x-1">
                                        {getPaginationNumbers().map(
                                            (page, index) => (
                                                <React.Fragment key={index}>
                                                    {page === "..." ? (
                                                        <span className="flex items-center justify-center w-10 h-10">
                                                            <FaEllipsisH className="w-4 h-4 text-gray-400" />
                                                        </span>
                                                    ) : (
                                                        <button
                                                            onClick={() =>
                                                                paginate(page)
                                                            }
                                                            className={`flex items-center justify-center w-10 h-10 rounded-full ${
                                                                currentPage ===
                                                                page
                                                                    ? "bg-blue-500 text-white"
                                                                    : "text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                                                            } transition-colors duration-200`}
                                                        >
                                                            {page}
                                                        </button>
                                                    )}
                                                </React.Fragment>
                                            )
                                        )}
                                    </div>

                                    {/* Next Button */}
                                    <button
                                        onClick={() =>
                                            paginate(currentPage + 1)
                                        }
                                        disabled={currentPage === totalPages}
                                        className={`flex items-center justify-center w-10 h-10 rounded-full ${
                                            currentPage === totalPages
                                                ? "text-gray-400 cursor-not-allowed"
                                                : "text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                                        } transition-colors duration-200`}
                                    >
                                        <FaChevronRight className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </DashboardLayout>

            {/* Pop-up untuk menambah data */}
            {showPopup && (
                <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50 flex items-center justify-center">
                    <div className="bg-white dark:bg-[#313131] rounded-xl p-6 w-[800px] shadow-lg">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                                Tambah Data Trip
                            </h3>
                            <button
                                onClick={() => setShowPopup(false)}
                                className="text-gray-400 hover:text-gray-500 transition-colors"
                            >
                                <FaTimes className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-2 gap-6">
                                {/* Kolom Kiri */}
                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Kode Trip
                                        </label>
                                        <input
                                            type="text"
                                            value={data.code_trip}
                                            onChange={(e) =>
                                                setData(
                                                    "code_trip",
                                                    e.target.value
                                                )
                                            }
                                            className="block w-full px-4 py-3 rounded-lg border-gray-300 dark:border-gray-600 dark:bg-[#515151] dark:text-white focus:border-blue-500 focus:ring-blue-500 transition-colors"
                                            required
                                        />
                                        {errors.code_trip && (
                                            <div className="text-red-500 text-sm mt-1">
                                                {errors.code_trip}
                                            </div>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Kendaraan
                                        </label>
                                        <select
                                            value={data.kendaraan_id}
                                            onChange={(e) =>
                                                setData(
                                                    "kendaraan_id",
                                                    e.target.value
                                                )
                                            }
                                            className="block w-full px-4 py-3 rounded-lg border-gray-300 dark:border-gray-600 dark:bg-[#515151] dark:text-white focus:border-blue-500 focus:ring-blue-500 transition-colors"
                                            required
                                        >
                                            <option value="">
                                                Pilih Kendaraan
                                            </option>
                                            {kendaraans?.map((kendaraan) => (
                                                <option
                                                    key={kendaraan.id}
                                                    value={kendaraan.id}
                                                >
                                                    {kendaraan.plat_kendaraan}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.kendaraan_id && (
                                            <div className="text-red-500 text-sm mt-1">
                                                {errors.kendaraan_id}
                                            </div>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Waktu Keberangkatan
                                        </label>
                                        <input
                                            type="datetime-local"
                                            value={data.waktu_keberangkatan}
                                            onChange={(e) =>
                                                setData(
                                                    "waktu_keberangkatan",
                                                    e.target.value
                                                )
                                            }
                                            className="block w-full px-4 py-3 rounded-lg border-gray-300 dark:border-gray-600 dark:bg-[#515151] dark:text-white focus:border-blue-500 focus:ring-blue-500 transition-colors"
                                            required
                                        />
                                        {errors.waktu_keberangkatan && (
                                            <div className="text-red-500 text-sm mt-1">
                                                {errors.waktu_keberangkatan}
                                            </div>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Tujuan
                                        </label>
                                        <input
                                            type="text"
                                            value={data.tujuan}
                                            onChange={(e) =>
                                                setData(
                                                    "tujuan",
                                                    e.target.value
                                                )
                                            }
                                            className="block w-full px-4 py-3 rounded-lg border-gray-300 dark:border-gray-600 dark:bg-[#515151] dark:text-white focus:border-blue-500 focus:ring-blue-500 transition-colors"
                                            required
                                        />
                                        {errors.tujuan && (
                                            <div className="text-red-500 text-sm mt-1">
                                                {errors.tujuan}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Kolom Kanan - Kamera dan Catatan */}
                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Foto Kendaraan
                                        </label>
                                        <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4">
                                            {!isCameraOpen &&
                                                !photo &&
                                                !isInitializingCamera && (
                                                    <div className="text-center">
                                                        <button
                                                            type="button"
                                                            onClick={
                                                                startCamera
                                                            }
                                                            className="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                                                        >
                                                            <FaCamera className="mr-2" />
                                                            Buka Kamera
                                                        </button>
                                                    </div>
                                                )}

                                            {(isCameraOpen ||
                                                isInitializingCamera) && (
                                                <div className="relative">
                                                    <video
                                                        ref={videoRef}
                                                        autoPlay
                                                        playsInline
                                                        className="w-full rounded-lg"
                                                    />
                                                    <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-4">
                                                        <button
                                                            type="button"
                                                            onClick={
                                                                switchCamera
                                                            }
                                                            className="px-4 py-2 bg-opacity-50 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                                                        >
                                                            <FaSyncAlt
                                                                className={`transition-transform duration-1000 ${
                                                                    isRotating
                                                                        ? "rotate-180"
                                                                        : ""
                                                                }`}
                                                            />
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={
                                                                capturePhoto
                                                            }
                                                            className="px-2 py-1 bg-gray-300 bg-opacity-50 text-white rounded-lg hover:bg-gray-600"
                                                        >
                                                            <FaCamera />
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={stopCamera}
                                                            className="px-4 py-2 bg-red-500 bg-opacity-50 text-white rounded-lg hover:bg-red-600"
                                                        >
                                                            <FaPowerOff />
                                                        </button>
                                                    </div>
                                                </div>
                                            )}

                                            {photo && (
                                                <div className="relative">
                                                    <img
                                                        src={photo}
                                                        alt="Foto Kendaraan"
                                                        className="w-full rounded-lg"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={deletePhoto}
                                                        className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600"
                                                    >
                                                        <FaTimes />
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Catatan
                                        </label>
                                        <textarea
                                            value={data.catatan}
                                            onChange={(e) =>
                                                setData(
                                                    "catatan",
                                                    e.target.value
                                                )
                                            }
                                            rows="4"
                                            className="block w-full px-4 py-3 rounded-lg border-gray-300 dark:border-gray-600 dark:bg-[#515151] dark:text-white focus:border-blue-500 focus:ring-blue-500 transition-colors"
                                        />
                                        {errors.catatan && (
                                            <div className="text-red-500 text-sm mt-1">
                                                {errors.catatan}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200 dark:border-gray-700">
                                <button
                                    type="button"
                                    onClick={() => setShowPopup(false)}
                                    className="px-6 py-2.5 border border-gray-300 text-gray-700 dark:text-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-6 py-2.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 transition-colors"
                                >
                                    {processing ? "Menyimpan..." : "Simpan"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}
