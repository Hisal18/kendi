import React, { useState } from "react";
import { Head, Link } from "@inertiajs/react";
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
} from "react-icons/fa";

export default function DetailTrip({ trip, auth }) {
    const [selectedImage, setSelectedImage] = useState(null);

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

    // Fungsi untuk menampilkan foto
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
            <div className="bg-white dark:bg-[#313131] rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 md:p-6 mb-6 transition-all hover:shadow-md">
                <h2 className="text-lg font-medium mb-4 md:mb-6 text-gray-900 dark:text-white flex items-center">
                    <FaCamera className="mr-2 text-blue-500" /> {title}
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
                    {photoArray.map((photo, index) => (
                        <button
                            key={`${title}-${index}`}
                            className="relative aspect-square rounded-lg overflow-hidden cursor-pointer group shadow-sm hover:shadow-md transition-all duration-300"
                            onClick={() =>
                                setSelectedImage(`/storage/${photo}`)
                            }
                            aria-label={`Lihat foto ${title} ${index + 1}`}
                        >
                            <img
                                src={`/storage/${photo}`}
                                alt={`Foto ${title} ${index + 1}`}
                                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                onError={(e) => {
                                    console.error(
                                        `Error loading image: ${photo}`
                                    );
                                    e.target.src =
                                        "/path/to/fallback-image.jpg";
                                }}
                            />
                            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
                                <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-sm md:text-base flex items-center">
                                    <FaCamera className="mr-1" /> Lihat Foto
                                </span>
                            </div>
                        </button>
                    ))}
                </div>
            </div>
        );
    };

    return (
        <>
            <Head title={`Trip - ${trip.code_trip}`} />
            <DashboardLayout>
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
                                    className={`px-3 py-1 text-sm font-medium rounded-full ${statusClass} flex items-center`}
                                >
                                    {statusIcon} {trip.status}
                                </span>
                            </div>
                        </div>

                        {auth.user.role === "admin" && (
                            <div className="flex items-center">
                                <button className="text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 px-4 py-2 rounded-md transition duration-300 shadow-sm flex items-center">
                                    <FaGasPump className="mr-2" /> Tambah BBM
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Informasi Trip */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        {/* Informasi Kendaraan dan Driver */}
                        <div className="bg-white dark:bg-[#313131] rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 md:p-6 transition-all hover:shadow-md">
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
                        <div className="bg-white dark:bg-[#313131] rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 md:p-6 transition-all hover:shadow-md">
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
                    <div className="bg-white dark:bg-[#313131] rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 md:p-6 mb-6 transition-all hover:shadow-md">
                        <h2 className="text-lg font-medium mb-4 text-gray-900 dark:text-white flex items-center">
                            <FaTachometerAlt className="mr-2 text-blue-500" />{" "}
                            Informasi Kilometer
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600 transition-all hover:shadow-md">
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1 flex items-center">
                                    <FaTachometerAlt className="mr-2 text-blue-400" />{" "}
                                    Kilometer Awal
                                </p>
                                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                                    {trip.km_awal || "-"}{" "}
                                    <span className="text-sm text-gray-500">
                                        km
                                    </span>
                                </p>
                            </div>
                            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600 transition-all hover:shadow-md">
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1 flex items-center">
                                    <FaTachometerAlt className="mr-2 text-green-400" />{" "}
                                    Kilometer Akhir
                                </p>
                                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                                    {trip.km_akhir || "-"}{" "}
                                    <span className="text-sm text-gray-500">
                                        km
                                    </span>
                                </p>
                            </div>
                            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600 transition-all hover:shadow-md">
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1 flex items-center">
                                    <FaMapMarkerAlt className="mr-2 text-red-400" />{" "}
                                    Jarak Tempuh
                                </p>
                                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                                    {trip.jarak || "-"}{" "}
                                    <span className="text-sm text-gray-500">
                                        km
                                    </span>
                                </p>
                            </div>
                        </div>
                    </div>

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
                                <button
                                    className="absolute top-4 right-4 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all"
                                    onClick={() => setSelectedImage(null)}
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
                </div>
            </DashboardLayout>
        </>
    );
}
