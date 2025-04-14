import React, { useState } from "react";
import { Head, Link, router } from "@inertiajs/react";
import DashboardLayout from "@/Layouts/DashboardLayout";
import dateFormat from "dateformat";
import {
    FaArrowLeft,
    FaCar,
    FaUser,
    FaUsers,
    FaMapMarkerAlt,
    FaCalendarAlt,
    FaClipboardList,
    FaTachometerAlt,
    FaCamera,
    FaGasPump,
    FaTimes,
    FaSave,
    FaMoneyBillWave,
    FaReceipt,
    FaCalendarDay,
    FaSpinner,
    FaGasPump as FaGasStation,
    FaCheck,
    FaInfo,
} from "react-icons/fa";
import { ToastContainer, toast, Flip } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Tambahkan section untuk informasi BBM
const BbmInfoSection = ({ trip, auth }) => {
    if (!auth.user.role === "admin") return null;

    // Jika tidak ada data BBM, return null
    if (
        !trip.jenis_bbm &&
        !trip.jumlah_liter &&
        !trip.harga_per_liter &&
        !trip.total_harga_bbm
    ) {
        return null;
    }

    const getBbmStatusColor = (jenisBbm) => {
        const colors = {
            Pertalite:
                "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
            Pertamax:
                "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
            "Pertamax Turbo":
                "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300",
            Dexlite:
                "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
            Solar: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
        };
        return (
            colors[jenisBbm] ||
            "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300"
        );
    };

    return (
        <>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 md:p-5 mb-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
                    <h2 className="text-lg font-medium text-gray-900 dark:text-white flex items-center">
                        <FaGasPump className="mr-2 text-blue-500" />
                        Informasi BBM
                    </h2>
                    <div className="flex items-center text-sm text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-900/20 px-3 py-1.5 rounded-md">
                        <FaInfo className="h-3.5 w-3.5 mr-1.5 text-blue-400" />
                        Hanya untuk admin
                    </div>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                    {/* Jenis BBM */}
                    <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-md">
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                            Jenis BBM
                        </p>
                        <span
                            className={`inline-block px-2 py-0.5 rounded-full text-sm font-medium ${getBbmStatusColor(
                                trip.jenis_bbm
                            )}`}
                        >
                            {trip.jenis_bbm || "-"}
                        </span>
                    </div>

                    {/* Jumlah Liter */}
                    <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-md">
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                            Jumlah
                        </p>
                        <p className="text-base font-semibold text-gray-900 dark:text-white">
                            {trip.jumlah_liter ? `${trip.jumlah_liter} L` : "-"}
                        </p>
                    </div>

                    {/* Harga per Liter */}
                    <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-md">
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                            Harga/Liter
                        </p>
                        <p className="text-base font-semibold text-gray-900 dark:text-white">
                            {trip.harga_per_liter
                                ? new Intl.NumberFormat("id-ID", {
                                      style: "currency",
                                      currency: "IDR",
                                      minimumFractionDigits: 0,
                                      maximumFractionDigits: 0,
                                  }).format(trip.harga_per_liter)
                                : "-"}
                        </p>
                    </div>

                    {/* Total Harga */}
                    <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-md">
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                            Total
                        </p>
                        <p className="text-base font-semibold text-gray-900 dark:text-white">
                            {trip.total_harga_bbm
                                ? new Intl.NumberFormat("id-ID", {
                                      style: "currency",
                                      currency: "IDR",
                                      minimumFractionDigits: 0,
                                      maximumFractionDigits: 0,
                                  }).format(trip.total_harga_bbm)
                                : "-"}
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
};

export default function DetailTrip({ trip, auth }) {
    const [selectedImage, setSelectedImage] = useState(null);
    const [showBbmModal, setShowBbmModal] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [bbmData, setBbmData] = useState({
        jumlah_liter: "",
        harga_per_liter: "",
        total_harga: "",
        jenis_bbm: "Pertalite", // Default jenis BBM
    });

    // Daftar jenis BBM
    const jenisBBMOptions = [
        { id: "pertalite", name: "Pertalite", color: "bg-green-500" },
        { id: "pertamax", name: "Pertamax", color: "bg-blue-500" },
        {
            id: "pertamax-turbo",
            name: "Pertamax Turbo",
            color: "bg-indigo-500",
        },
        { id: "dexlite", name: "Dexlite", color: "bg-yellow-500" },
        { id: "solar", name: "Solar", color: "bg-red-500" },
    ];

    // Format tanggal untuk tampilan yang lebih baik
    const formatDate = (dateString) => {
        if (!dateString) return "-";
        const date = new Date(dateString);
        return date.toLocaleString("id-ID", {
            day: "numeric",
            month: "long",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    // Extracting the status class into a separate variable
    let statusClass = "";
    let statusIcon = null;
    if (trip.status === "Sedang Berjalan") {
        statusClass =
            "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
        statusIcon = (
            <span className="inline-block w-2 h-2 rounded-full bg-yellow-500 mr-2 animate-pulse"></span>
        );
    } else if (trip.status === "Selesai") {
        statusClass =
            "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
        statusIcon = (
            <span className="inline-block w-2 h-2 rounded-full bg-green-500 mr-2"></span>
        );
    } else {
        statusClass =
            "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
        statusIcon = (
            <span className="inline-block w-2 h-2 rounded-full bg-red-500 mr-2"></span>
        );
    }

    // Tambahkan fungsi untuk mengunduh foto
    const downloadImage = (imageUrl, fileName) => {
        // Buat elemen anchor untuk download
        const link = document.createElement("a");
        link.href = imageUrl;
        link.download = fileName || "foto-trip.jpg";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    // Tambahkan fungsi formatter
    const formatCurrency = (value) => {
        const number = value.replace(/[^\d]/g, "");
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(number);
    };

    // Modifikasi handleBbmInputChange
    const handleBbmInputChange = (e) => {
        const { name, value } = e.target;

        if (name === "harga_per_liter") {
            // Hapus semua karakter non-digit
            const numericValue = value.replace(/[^\d]/g, "");
            const jumlahLiter = parseFloat(bbmData.jumlah_liter) || 0;
            const hargaPerLiter = parseFloat(numericValue) || 0;
            const totalHarga = jumlahLiter * hargaPerLiter;

            setBbmData({
                ...bbmData,
                harga_per_liter: numericValue,
                total_harga: totalHarga.toFixed(0),
            });
        } else if (name === "jumlah_liter") {
            const jumlahLiter = parseFloat(value) || 0;
            const hargaPerLiter = parseFloat(bbmData.harga_per_liter) || 0;
            const totalHarga = jumlahLiter * hargaPerLiter;

            setBbmData({
                ...bbmData,
                [name]: value,
                total_harga: totalHarga.toFixed(0),
            });
        } else {
            setBbmData({
                ...bbmData,
                [name]: value,
            });
        }
    };

    // Handle jenis BBM change
    const handleJenisBBMChange = (jenisBBM) => {
        setBbmData({
            ...bbmData,
            jenis_bbm: jenisBBM,
        });
    };

    // Modifikasi handleBbmSubmit
    const handleBbmSubmit = (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        router.post(
            route("trips.update.bbm", trip.code_trip),
            {
                jenis_bbm: bbmData.jenis_bbm,
                jumlah_liter: parseFloat(bbmData.jumlah_liter),
                harga_per_liter: parseFloat(bbmData.harga_per_liter),
                total_harga: parseFloat(bbmData.total_harga),
            },
            {
                onSuccess: () => {
                    setIsSubmitting(false);
                    setShowBbmModal(false);
                    setBbmData({
                        jumlah_liter: "",
                        harga_per_liter: "",
                        total_harga: "",
                        jenis_bbm: "Pertalite",
                    });

                    // Tampilkan toast sukses
                    toast.success("Data BBM berhasil disimpan!", {
                        position: "top-right",
                        autoClose: 3000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: "colored",
                    });
                },
                onError: (errors) => {
                    setIsSubmitting(false);
                    // Tampilkan toast error
                    toast.error("Gagal menyimpan data BBM!", {
                        position: "top-right",
                        autoClose: 3000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: "colored",
                    });
                },
            }
        );
    };

    // Modifikasi fungsi renderPhotoSection untuk menambahkan tombol download
    const renderPhotoSection = (photos, title) => {
        // Pastikan photos adalah array dan tidak kosong
        let photoArray = [];

        try {
            if (typeof photos === "string") {
                photoArray = JSON.parse(photos);
            } else if (Array.isArray(photos)) {
                photoArray = photos;
            }
        } catch (e) {
            console.error("Error parsing photos:", e);
        }

        if (!photoArray || photoArray.length === 0) return null;

        return (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 md:p-6 mb-6 transition-all hover:shadow-md">
                <h2 className="text-lg font-medium mb-4 md:mb-6 text-gray-900 dark:text-white flex items-center">
                    <FaCamera className="mr-2 text-blue-500" /> {title}
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
                    {photoArray.map((photo, index) => (
                        <div
                            key={`${title}-${index}`}
                            className="relative aspect-square rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300"
                        >
                            <img
                                src={`/storage/${photo}`}
                                alt={`Foto ${title} ${index + 1}`}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                    console.error(
                                        `Error loading image: ${photo}`
                                    );
                                    e.target.src =
                                        "/path/to/fallback-image.jpg";
                                }}
                            />
                            <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 p-2 flex justify-between items-center">
                                <button
                                    onClick={() =>
                                        setSelectedImage(`/storage/${photo}`)
                                    }
                                    className="text-white text-xs flex items-center hover:text-blue-300 transition-colors"
                                    aria-label={`Lihat foto ${title} ${
                                        index + 1
                                    }`}
                                >
                                    <FaCamera className="mr-1" /> Lihat
                                </button>
                                <button
                                    onClick={() =>
                                        downloadImage(
                                            `/storage/${photo}`,
                                            `${trip.code_trip}-${title}-${
                                                index + 1
                                            }.jpg`
                                        )
                                    }
                                    className="text-white text-xs flex items-center hover:text-green-300 transition-colors"
                                    aria-label={`Unduh foto ${title} ${
                                        index + 1
                                    }`}
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-3 w-3 mr-1"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                                        />
                                    </svg>{" "}
                                    Unduh
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    return (
        <>
            <Head title={`Trip - ${trip.code_trip}`} />
            <DashboardLayout>
                <ToastContainer
                    position="top-right"
                    autoClose={5000}
                    hideProgressBar={false}
                    newestOnTop
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                    theme={isDarkMode ? "dark" : "light"}
                    transition={Flip}
                />
                <div className="p-0 md:px-0">
                    {/* Header dengan tombol kembali */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
                        <div className="flex flex-col md:flex-row md:items-center gap-2 mb-4 md:mb-0">
                            <div className="flex items-center">
                                <Link
                                    href={route("trips.index")}
                                    className="mr-3 p-2 bg-gray-100 dark:bg-gray-700 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                                    aria-label="Kembali ke daftar trip"
                                >
                                    <FaArrowLeft className="h-5 w-5 text-gray-700 dark:text-gray-300" />
                                </Link>
                                <h1 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white flex items-center">
                                    <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded-md text-sm">
                                        {trip.code_trip}
                                    </span>
                                </h1>
                            </div>

                            <div className="mt-2 md:mt-0 md:ml-4">
                                <span
                                    className={`px-3 py-1 text-xs sm:text-sm font-medium rounded-full ${statusClass} inline-flex items-center justify-center w-auto max-w-full`}
                                >
                                    <span className="mr-1 flex-shrink-0">
                                        {statusIcon}
                                    </span>
                                    <span className="truncate">
                                        {trip.status}
                                    </span>
                                </span>
                            </div>
                        </div>

                        {auth.user.role === "admin" && (
                            <div className="flex items-center">
                                <button
                                    className="text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 px-4 py-2 rounded-md transition duration-300 shadow-sm flex items-center"
                                    onClick={() => setShowBbmModal(true)}
                                >
                                    <FaGasPump className="mr-2" /> Tambah BBM
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Informasi Trip */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        {/* Informasi Kendaraan dan Driver */}
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 md:p-6 transition-all hover:shadow-md">
                            <h2 className="text-lg font-medium mb-4 text-gray-900 dark:text-white flex items-center">
                                <FaCar className="mr-2 text-blue-500" />{" "}
                                Informasi Kendaraan & Driver
                            </h2>
                            <div className="space-y-4">
                                <div className="flex flex-col md:flex-row md:items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400 w-full md:w-1/3 flex items-center">
                                        <FaCar className="mr-2 text-gray-400" />{" "}
                                        Kendaraan:
                                    </span>
                                    <span className="text-sm text-gray-900 dark:text-white w-full md:w-2/3 font-medium">
                                        {trip.kendaraan?.merek || "-"}{" "}
                                        <span className="bg-gray-200 dark:bg-gray-700 px-2 py-0.5 rounded-md ml-1 text-xs">
                                            {trip.kendaraan?.plat_kendaraan ||
                                                "-"}
                                        </span>
                                    </span>
                                </div>
                                <div className="flex flex-col md:flex-row md:items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400 w-full md:w-1/3 flex items-center">
                                        <FaUser className="mr-2 text-gray-400" />{" "}
                                        Driver:
                                    </span>
                                    <span className="text-sm text-gray-900 dark:text-white w-full md:w-2/3 font-medium">
                                        {trip.driver?.name || "-"}
                                    </span>
                                </div>
                                <div className="flex flex-col md:flex-row md:items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400 w-full md:w-1/3 flex items-center">
                                        <FaUsers className="mr-2 text-gray-400" />{" "}
                                        Penumpang:
                                    </span>
                                    <span className="text-sm text-gray-900 dark:text-white w-full md:w-2/3 font-medium">
                                        {trip.penumpang || "-"}
                                    </span>
                                </div>
                                <div className="flex flex-col md:flex-row md:items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400 w-full md:w-1/3 flex items-center">
                                        <FaUser className="mr-2 text-gray-400" />{" "}
                                        Dibuat Oleh:
                                    </span>
                                    <span className="text-sm text-gray-900 dark:text-white w-full md:w-2/3 font-medium">
                                        {trip.created_by?.name || "-"}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Informasi Perjalanan */}
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 md:p-6 transition-all hover:shadow-md">
                            <h2 className="text-lg font-medium mb-4 text-gray-900 dark:text-white flex items-center">
                                <FaMapMarkerAlt className="mr-2 text-blue-500" />{" "}
                                Informasi Perjalanan
                            </h2>
                            <div className="space-y-4">
                                <div className="flex flex-col md:flex-row md:items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400 w-full md:w-1/3 flex items-center">
                                        <FaMapMarkerAlt className="mr-2 text-gray-400" />{" "}
                                        Tujuan:
                                    </span>
                                    <span className="text-sm text-gray-900 dark:text-white w-full md:w-2/3 font-medium">
                                        {trip.tujuan || "-"}
                                    </span>
                                </div>
                                <div className="flex flex-col md:flex-row md:items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400 w-full md:w-1/3 flex items-center">
                                        <FaCalendarAlt className="mr-2 text-gray-400" />{" "}
                                        Waktu Berangkat:
                                    </span>
                                    <span className="text-sm text-gray-900 dark:text-white w-full md:w-2/3 font-medium">
                                        {formatDate(trip.waktu_keberangkatan)}
                                    </span>
                                </div>
                                <div className="flex flex-col md:flex-row md:items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400 w-full md:w-1/3 flex items-center">
                                        <FaCalendarAlt className="mr-2 text-gray-400" />{" "}
                                        Waktu Kembali:
                                    </span>
                                    <span className="text-sm text-gray-900 dark:text-white w-full md:w-2/3 font-medium">
                                        {formatDate(trip.waktu_kembali) || "-"}
                                    </span>
                                </div>
                                <div className="flex flex-col md:flex-row md:items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400 w-full md:w-1/3 flex items-center">
                                        <FaClipboardList className="mr-2 text-gray-400" />{" "}
                                        Catatan:
                                    </span>
                                    <span className="text-sm text-gray-900 dark:text-white w-full md:w-2/3 font-medium">
                                        {trip.catatan || "-"}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Informasi Kilometer */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 md:p-6 mb-6 transition-all hover:shadow-md">
                        <h2 className="text-lg font-medium mb-4 text-gray-900 dark:text-white flex items-center">
                            <FaTachometerAlt className="mr-2 text-blue-500" />
                            Informasi Kilometer
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 flex flex-col transition-all">
                                <div className="flex items-center mb-2">
                                    <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mr-3">
                                        <FaTachometerAlt className="text-blue-500" />
                                    </div>
                                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                        Kilometer Awal
                                    </p>
                                </div>
                                <p className="text-xl font-semibold text-gray-900 dark:text-white ml-11">
                                    {trip.km_awal || "-"}
                                    <span className="text-sm text-gray-500 dark:text-gray-400 ml-1">
                                        km
                                    </span>
                                </p>
                            </div>

                            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 flex flex-col transition-all">
                                <div className="flex items-center mb-2">
                                    <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mr-3">
                                        <FaTachometerAlt className="text-green-500" />
                                    </div>
                                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                        Kilometer Akhir
                                    </p>
                                </div>
                                <p className="text-xl font-semibold text-gray-900 dark:text-white ml-11">
                                    {trip.km_akhir || "-"}
                                    <span className="text-sm text-gray-500 dark:text-gray-400 ml-1">
                                        km
                                    </span>
                                </p>
                            </div>

                            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 flex flex-col transition-all">
                                <div className="flex items-center mb-2">
                                    <div className="w-8 h-8 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mr-3">
                                        <FaMapMarkerAlt className="text-red-500" />
                                    </div>
                                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                        Jarak Tempuh
                                    </p>
                                </div>
                                <p className="text-xl font-semibold text-gray-900 dark:text-white ml-11">
                                    {trip.jarak || "-"}
                                    <span className="text-sm text-gray-500 dark:text-gray-400 ml-1">
                                        km
                                    </span>
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Tambahkan BbmInfoSection setelah Informasi Kilometer */}
                    {auth.user.role === "admin" && (
                        <BbmInfoSection trip={trip} auth={auth} />
                    )}

                    {/* Foto Berangkat */}
                    {renderPhotoSection(
                        trip.foto_berangkat,
                        "Foto Keberangkatan"
                    )}

                    {/* Foto Kembali */}
                    {renderPhotoSection(trip.foto_kembali, "Foto Kembali")}

                    {/* Lightbox untuk melihat foto */}
                    {selectedImage && (
                        <div
                            className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4"
                            onClick={() => setSelectedImage(null)}
                        >
                            <div className="relative max-w-4xl w-full">
                                <div className="absolute top-4 right-4 flex space-x-2">
                                    <button
                                        className="bg-green-600 text-white p-2 rounded-full hover:bg-green-700 transition-all flex items-center"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            downloadImage(
                                                selectedImage,
                                                `foto-trip-${trip.code_trip}.jpg`
                                            );
                                        }}
                                        aria-label="Unduh foto"
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-6 w-6"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                                            />
                                        </svg>
                                    </button>
                                    <button
                                        className="bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setSelectedImage(null);
                                        }}
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-6 w-6"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M6 18L18 6M6 6l12 12"
                                            />
                                        </svg>
                                    </button>
                                </div>
                                <img
                                    loading="lazy"
                                    src={selectedImage}
                                    alt="Foto diperbesar"
                                    className="max-h-[85vh] max-w-full mx-auto object-contain rounded-lg shadow-xl"
                                    onClick={(e) => e.stopPropagation()}
                                />
                            </div>
                        </div>
                    )}

                    {/* Modal BBM di samping kanan */}
                    <div
                        className={`fixed top-0 right-0 h-full w-full md:w-96 bg-white dark:bg-gray-800 shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${
                            showBbmModal ? "translate-x-0" : "translate-x-full"
                        } overflow-y-auto`}
                    >
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
                                    <FaGasPump className="mr-2 text-blue-500" />{" "}
                                    Tambah Data BBM
                                </h2>
                                <button
                                    onClick={() => setShowBbmModal(false)}
                                    className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                                >
                                    <FaTimes className="h-5 w-5 text-gray-700 dark:text-gray-300" />
                                </button>
                            </div>

                            <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                                <p className="text-sm text-blue-800 dark:text-blue-300 flex items-start">
                                    <span className="bg-blue-100 dark:bg-blue-800 p-1 rounded-full mr-2 flex-shrink-0">
                                        <FaCar className="h-3 w-3 text-blue-500" />
                                    </span>
                                    <span>
                                        <span className="font-medium">
                                            {trip.kendaraan?.merek}
                                        </span>{" "}
                                        - {trip.kendaraan?.plat_kendaraan}
                                    </span>
                                </p>
                            </div>

                            <form
                                onSubmit={handleBbmSubmit}
                                className="space-y-4"
                            >
                                {/* Jenis BBM Radio Button */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Jenis BBM
                                    </label>
                                    <div className="grid grid-cols-2 gap-2">
                                        {jenisBBMOptions.map((option) => (
                                            <div
                                                key={option.id}
                                                onClick={() =>
                                                    handleJenisBBMChange(
                                                        option.name
                                                    )
                                                }
                                                className={`relative flex items-center p-3 rounded-lg cursor-pointer border transition-all duration-200 ${
                                                    bbmData.jenis_bbm ===
                                                    option.name
                                                        ? `border-2 ${option.color} bg-opacity-10 dark:bg-opacity-20 shadow-sm`
                                                        : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                                                }`}
                                            >
                                                <div className="flex items-center">
                                                    <div
                                                        className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                                                            bbmData.jenis_bbm ===
                                                            option.name
                                                                ? `${option.color} border-transparent`
                                                                : "border-gray-400 dark:border-gray-500"
                                                        }`}
                                                    >
                                                        {bbmData.jenis_bbm ===
                                                            option.name && (
                                                            <div className="w-2 h-2 rounded-full bg-white"></div>
                                                        )}
                                                    </div>
                                                    <div className="ml-2 flex items-center">
                                                        <FaGasStation
                                                            className={`mr-1.5 ${
                                                                bbmData.jenis_bbm ===
                                                                option.name
                                                                    ? option.color.replace(
                                                                          "bg-",
                                                                          "text-"
                                                                      )
                                                                    : "text-gray-400"
                                                            }`}
                                                        />
                                                        <span
                                                            className={`text-sm ${
                                                                bbmData.jenis_bbm ===
                                                                option.name
                                                                    ? "font-medium text-gray-900 dark:text-white"
                                                                    : "text-gray-700 dark:text-gray-300"
                                                            }`}
                                                        >
                                                            {option.name}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Jumlah Liter
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                                            <FaGasPump className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                                        </div>
                                        <input
                                            type="number"
                                            step="0.01"
                                            name="jumlah_liter"
                                            value={bbmData.jumlah_liter}
                                            onChange={handleBbmInputChange}
                                            className="block w-full pl-10 pr-3 py-2 rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:border-blue-500 focus:ring-blue-500 transition-colors"
                                            placeholder="Contoh: 20.5"
                                            required
                                            min={0}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Harga Per Liter
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                                            <FaMoneyBillWave className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                                        </div>
                                        <input
                                            type="text"
                                            name="harga_per_liter"
                                            value={
                                                bbmData.harga_per_liter
                                                    ? formatCurrency(
                                                          bbmData.harga_per_liter
                                                      )
                                                    : ""
                                            }
                                            onChange={handleBbmInputChange}
                                            className="block w-full pl-10 pr-3 py-2 rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:border-blue-500 focus:ring-blue-500 transition-colors"
                                            placeholder="Rp 0"
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Total Harga
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                                            <FaMoneyBillWave className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                                        </div>
                                        <input
                                            type="text"
                                            name="total_harga"
                                            value={
                                                bbmData.total_harga
                                                    ? `Rp ${parseInt(
                                                          bbmData.total_harga
                                                      ).toLocaleString(
                                                          "id-ID"
                                                      )}`
                                                    : ""
                                            }
                                            className="block w-full pl-10 pr-3 py-2 rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white bg-gray-100 dark:bg-gray-600 cursor-not-allowed transition-colors"
                                            placeholder="Otomatis dihitung"
                                            readOnly
                                        />
                                    </div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                        Total harga dihitung otomatis
                                    </p>
                                </div>

                                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="w-full flex justify-center items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-lg disabled:opacity-50 transition-colors"
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <FaSpinner className="animate-spin mr-2 h-4 w-4" />
                                                <span>Menyimpan...</span>
                                            </>
                                        ) : (
                                            <>
                                                <FaSave className="mr-2 h-4 w-4" />
                                                <span>Simpan Data BBM</span>
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* Overlay untuk menutup modal saat klik di luar */}
                    {showBbmModal && (
                        <div
                            className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
                            onClick={() => setShowBbmModal(false)}
                        ></div>
                    )}
                </div>
            </DashboardLayout>
        </>
    );
}
