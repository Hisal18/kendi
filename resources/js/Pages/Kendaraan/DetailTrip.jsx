import React, { useState, useEffect } from "react";
import { Head, Link } from "@inertiajs/react";
import DashboardLayout from "@/Layouts/DashboardLayout";
import dateFormat from "dateformat";
import { FaArrowLeft } from "react-icons/fa";

export default function DetailTrip({ trip }) {
    const [selectedImage, setSelectedImage] = useState(null);

    // Fungsi untuk menampilkan foto
    const renderPhotoSection = (photos, title) => {
        // Pastikan photos adalah array dan tidak kosong
        const photoArray = Array.isArray(photos) ? photos : [];

        if (photoArray.length === 0) return null;

        console.log(`Rendering ${title}:`, photoArray); // Debugging

        return (
            <div className="bg-white dark:bg-[#313131] rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <h2 className="text-lg font-medium mb-6 text-gray-900 dark:text-white">
                    {title}
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    {photoArray.map((photo, index) => (
                        <div
                            key={index}
                            className="relative aspect-square rounded-lg overflow-hidden cursor-pointer group"
                            onClick={() => setSelectedImage(photo)}
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
                                        "/path/to/fallback-image.jpg"; // Tambahkan fallback image
                                }}
                            />
                            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
                                <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    Lihat Foto
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    // Debug data trip
    useEffect(() => {
        console.log("Trip data:", trip);
        console.log("Foto berangkat:", trip.foto_berangkat);
        console.log("Foto kembali:", trip.foto_kembali);
    }, [trip]);

    return (
        <>
            <Head title={`Trip - ${trip.code_trip}`} />
            <DashboardLayout>
                <div className="rounded-xl mx-auto py-6 px-4 sm:px-6 lg:px-0 dark:bg-[#212121]">
                    {/* Header Section */}
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <div className="flex items-center gap-4 mb-2">
                                <Link
                                    href={route("trips.index")}
                                    className="flex items-center text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                                >
                                    <FaArrowLeft className="mr-2" /> Kembali
                                </Link>
                                <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
                                    KODE TRIP - {trip.code_trip}
                                </h1>
                                <span
                                    className={`px-4 py-1 text-sm rounded-full ${
                                        trip.status === "Sedang Berjalan"
                                            ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                                            : trip.status === "Selesai"
                                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                            : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                                    }`}
                                >
                                    {trip.status}
                                </span>
                            </div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                Dibuat pada:{" "}
                                {dateFormat(
                                    trip.created_at,
                                    "dd mmmm yyyy, HH:MM"
                                )}
                            </p>
                        </div>
                        <div className="flex items-center gap-3">
                            <Link
                                // href={route("trips.edit", trip.code_trip)}
                                className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors dark:bg-blue-500 dark:hover:bg-blue-600"
                            >
                                Edit Trip
                            </Link>
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-6">
                        {/* Main Content - Left Side (2 Columns) */}
                        <div className="col-span-2 space-y-6">
                            {/* Trip Details */}
                            <div className="bg-white dark:bg-[#313131] rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                                <h2 className="text-lg font-medium mb-6 text-gray-900 dark:text-white">
                                    Informasi Trip
                                </h2>
                                <div className="grid grid-cols-2 gap-6">
                                    <div>
                                        <div className="mb-4">
                                            <label className="text-sm text-gray-500 dark:text-gray-400">
                                                Tujuan
                                            </label>
                                            <p className="font-medium text-gray-900 dark:text-white">
                                                {trip.tujuan}
                                            </p>
                                        </div>
                                        <div className="mb-4">
                                            <label className="text-sm text-gray-500 dark:text-gray-400">
                                                Waktu Keberangkatan
                                            </label>
                                            <p className="font-medium text-gray-900 dark:text-white">
                                                {dateFormat(
                                                    trip.waktu_keberangkatan,
                                                    "dd mmmm yyyy, HH:MM"
                                                )}
                                            </p>
                                        </div>
                                        <div className="mb-4">
                                            <label className="text-sm text-gray-500 dark:text-gray-400">
                                                Waktu Kembali
                                            </label>
                                            <p className="font-medium text-gray-900 dark:text-white">
                                                {trip.waktu_kembali
                                                    ? dateFormat(
                                                          trip.waktu_kembali,
                                                          "dd mmmm yyyy, HH:MM"
                                                      )
                                                    : "-"}
                                            </p>
                                        </div>
                                    </div>
                                    <div>
                                        <div className="mb-4">
                                            <label className="text-sm text-gray-500 dark:text-gray-400">
                                                User
                                            </label>
                                            <p className="font-medium text-gray-900 dark:text-white">
                                                {trip.penumpang || "-"}{" "}
                                                {/*Untuk Penumpang*/}
                                            </p>
                                        </div>
                                        <div className="mb-4">
                                            <label className="text-sm text-gray-500 dark:text-gray-400">
                                                Status
                                            </label>
                                            <p className="font-medium text-gray-900 dark:text-white">
                                                {trip.status}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Vehicle Information */}
                            <div className="bg-white dark:bg-[#313131] rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                                <h2 className="text-lg font-medium mb-6 text-gray-900 dark:text-white">
                                    Informasi Kendaraan
                                </h2>
                                <div className="grid grid-cols-2 gap-6">
                                    <div>
                                        <div className="mb-4">
                                            <label className="text-sm text-gray-500 dark:text-gray-400">
                                                Merek/Tipe
                                            </label>
                                            <p className="font-medium text-gray-900 dark:text-white">
                                                {trip.kendaraan.merek}
                                            </p>
                                        </div>
                                        <div className="mb-4">
                                            <label className="text-sm text-gray-500 dark:text-gray-400">
                                                Plat Nomor
                                            </label>
                                            <p className="font-medium text-gray-900 dark:text-white">
                                                {trip.kendaraan.plat_kendaraan}
                                            </p>
                                        </div>
                                    </div>
                                    <div>
                                        <div className="mb-4">
                                            <label className="text-sm text-gray-500 dark:text-gray-400">
                                                KM Awal
                                            </label>
                                            <p className="font-medium text-gray-900 dark:text-white">
                                                {trip.kendaraan.km_awal}
                                            </p>
                                        </div>
                                        <div className="mb-4">
                                            <label className="text-sm text-gray-500 dark:text-gray-400">
                                                KM Akhir
                                            </label>
                                            <p className="font-medium text-gray-900 dark:text-white">
                                                {trip.kendaraan.km_akhir || "-"}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Foto Berangkat */}
                            {renderPhotoSection(
                                trip.foto_berangkat,
                                "Foto Keberangkatan"
                            )}

                            {/* Foto Kembali */}
                            {trip.status === "Selesai" &&
                                trip.foto_kembali &&
                                renderPhotoSection(
                                    trip.foto_kembali,
                                    "Foto Kembali"
                                )}
                        </div>

                        {/* Sidebar - Right Side (1 Column) */}
                        <div className="space-y-6">
                            {/* Driver Information */}
                            <div className="bg-white dark:bg-[#313131] rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                                <h2 className="text-lg font-medium mb-6 text-gray-900 dark:text-white">
                                    Informasi Driver
                                </h2>
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-sm text-gray-500 dark:text-gray-400">
                                            Nama Driver
                                        </label>
                                        <p className="font-medium text-gray-900 dark:text-white">
                                            {/* {trip.driver?.name || "-"} */}
                                        </p>
                                    </div>
                                    <div>
                                        <label className="text-sm text-gray-500 dark:text-gray-400">
                                            Kontak
                                        </label>
                                        <p className="font-medium text-gray-900 dark:text-white">
                                            {/* {trip.driver?.phone || "-"} */}
                                        </p>
                                    </div>
                                    <div>
                                        <label className="text-sm text-gray-500 dark:text-gray-400">
                                            Email
                                        </label>
                                        <p className="font-medium text-gray-900 dark:text-white">
                                            {/* {trip.driver?.email || "-"} */}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Notes Section */}
                            <div className="bg-white dark:bg-[#313131] rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                                <h2 className="text-lg font-medium mb-4 text-gray-900 dark:text-white">
                                    Catatan
                                </h2>
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-sm text-gray-500 dark:text-gray-400">
                                            Catatan Berangkat
                                        </label>
                                        <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                                            {trip.catatan ||
                                                "Tidak ada catatan"}
                                        </p>
                                    </div>

                                    {trip.status === "Selesai" && (
                                        <div>
                                            <label className="text-sm text-gray-500 dark:text-gray-400">
                                                Catatan Kembali
                                            </label>
                                            <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                                                {trip.catatan_kembali ||
                                                    "Tidak ada catatan"}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Additional Trip Info */}
                            {trip.status === "Selesai" && (
                                <div className="bg-white dark:bg-[#313131] rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                                    <h2 className="text-lg font-medium mb-4 text-gray-900 dark:text-white">
                                        Informasi Tambahan
                                    </h2>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="text-sm text-gray-500 dark:text-gray-400">
                                                Jarak Tempuh
                                            </label>
                                            <p className="text-gray-700 dark:text-gray-300">
                                                {trip.jarak} km
                                            </p>
                                        </div>
                                        <div>
                                            <label className="text-sm text-gray-500 dark:text-gray-400">
                                                Waktu Kembali
                                            </label>
                                            <p className="text-gray-700 dark:text-gray-300">
                                                {dateFormat(
                                                    trip.waktu_kembali,
                                                    "dd mmmm yyyy, HH:MM"
                                                )}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Image Modal */}
                {selectedImage && (
                    <div
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 p-4"
                        onClick={(e) => {
                            e.stopPropagation();
                            setSelectedImage(null);
                        }}
                    >
                        <div className="relative max-w-7xl w-full">
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedImage(null);
                                }}
                                className="absolute -top-10 right-0 text-white hover:text-gray-300 text-xl"
                            >
                                ✕
                            </button>
                            <img
                                src={`/storage/${selectedImage}`}
                                alt="Foto Trip"
                                className="w-full h-auto max-h-[80vh] object-contain rounded-xl"
                                onError={(e) => {
                                    console.error(
                                        `Error loading modal image: ${selectedImage}`
                                    );
                                    setSelectedImage(null);
                                }}
                            />
                        </div>
                    </div>
                )}
            </DashboardLayout>
        </>
    );
}
