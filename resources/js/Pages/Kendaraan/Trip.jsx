import DashboardLayout from "@/Layouts/DashboardLayout";
import { Head, Link, useForm, router } from "@inertiajs/react";
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
    FaCamera,
    FaCheck,
    FaCarSide,
    FaLock,
    FaIdCard,
    FaTachometerAlt,
    FaMapMarkerAlt,
    FaClock,
    FaUsers,
    FaInfo,
    FaUserTie,
    FaEdit,
    FaSave,
    FaSpinner,
    FaCalendarAlt,
    FaGlobe,
    FaEye,
    FaCalendarCheck,
    FaCalendarTimes,
    FaCalendarMinus,
    FaCalendarPlus,
} from "react-icons/fa";
import * as XLSX from "xlsx";
import Modal from "@/Components/ModalNew";
import { RadioGroup } from "@headlessui/react";
import { ToastContainer, toast, Flip } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

export default function Trip({
    trips: initialTrips,
    kendaraans,
    drivers,
    auth,
}) {
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(8);
    const [showExportModal, setShowExportModal] = useState(false);
    const [exportType, setExportType] = useState("all");
    const [exportDate, setExportDate] = useState(new Date());
    const [isLoading, setIsLoading] = useState(false);
    const [openDropdown, setOpenDropdown] = useState(null);
    const [currentTime, setCurrentTime] = useState(new Date());

    const toggleDropdown = (id) => {
        if (openDropdown === id) {
            setOpenDropdown(null);
        } else {
            setOpenDropdown(id);
        }
    };

    // Tambahkan useEffect untuk menutup dropdown ketika user mengklik di luar
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (openDropdown && !event.target.closest(".dropdown-container")) {
                setOpenDropdown(null);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [openDropdown]);

    const generateRandomCode = () => {
        const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        let result = "";
        for (let i = 0; i < 10; i++) {
            result += characters.charAt(
                Math.floor(Math.random() * characters.length)
            );
        }
        return result;
    };

    // Update current time every second
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const { data, setData, post, processing, errors, reset } = useForm({
        code_trip: generateRandomCode(),
        kendaraan_id: "",
        driver_id: "",
        waktu_keberangkatan: dateFormat(new Date(), "yyyy-mm-dd'T'HH:MM"),
        tujuan: "",
        catatan: "",
        km: "",
        merek: "",
        plat_kendaraan: "",
        status: "",
        lokasi: auth.user.lokasi,
        penumpang: "",
    });

    const filteredTrips = Array.isArray(initialTrips)
        ? initialTrips.filter((trip) => {
              // 1. FILTER LOKASI
              const userLokasi = auth.user.lokasi ? auth.user.lokasi.trim().toLowerCase() : null;
              const tripLokasi = trip.lokasi ? trip.lokasi.trim().toLowerCase() : null;

              if (userLokasi) {
                  // Jika lokasi user terdefinisi, harus sama dengan lokasi trip
                  if (tripLokasi !== userLokasi) {
                      return false; // Sembunyikan jika lokasi tidak cocok
                  }
              }
              // Jika userLokasi null/kosong, filter ini dilewati (tampilkan semua)

              // 2. FILTER SEARCH TERM
              return (
                  trip?.kendaraan?.plat_kendaraan
                      ?.toLowerCase()
                      ?.includes(searchTerm.toLowerCase()) ||
                  trip?.code_trip
                      ?.toLowerCase()
                      .includes(searchTerm.toLowerCase()) ||
                  trip?.tujuan
                      ?.toLowerCase()
                      .includes(searchTerm.toLowerCase()) ||
                  trip?.driver?.name
                      ?.toLowerCase()
                      .includes(searchTerm.toLowerCase())
              );
          })
        : [];

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
        try {
            let dataToExport = [];
            let fileName = "";

            if (exportType === "month") {
                // Validasi bulan yang dipilih
                const selectedMonth = exportDate
                    ? `${exportDate.getFullYear()}-${String(
                          exportDate.getMonth() + 1
                      ).padStart(2, "0")}`
                    : "";

                if (!selectedMonth) {
                    toast.error(
                        "Silakan pilih bulan terlebih dahulu!",
                        toastConfig
                    );
                    return;
                }

                // Filter data berdasarkan bulan yang dipilih
                const year = exportDate.getFullYear();
                const month = exportDate.getMonth(); // 0-indexed

                dataToExport = Array.isArray(initialTrips)
                    ? initialTrips.filter((trip) => {
                          const tripDate = new Date(trip.waktu_keberangkatan);
                          return (
                              tripDate.getFullYear() === year &&
                              tripDate.getMonth() === month
                          );
                      })
                    : [];

                if (dataToExport.length === 0) {
                    const monthName = exportDate.toLocaleString("id-ID", {
                        month: "long",
                    });
                    toast.warning(
                        `Tidak ada data untuk bulan ${monthName} ${year}`,
                        toastConfig
                    );
                    return;
                }

                // Set nama file dengan bulan dan tahun
                const monthName = exportDate.toLocaleString("id-ID", {
                    month: "long",
                });
                fileName = `Data Kendaraan Dinas ${monthName} ${year}.xlsx`;
            } else {
                // Export semua data
                dataToExport = trips || [];

                if (dataToExport.length === 0) {
                    toast.warning("Tidak ada data untuk diexport", toastConfig);
                    return;
                }

                // Set nama file dengan tanggal hari ini
                fileName = `Data Kendaraan Dinas All ${dateFormat(
                    new Date(),
                    "dd-mm-yyyy"
                )}.xlsx`;
            }

            // Format data untuk Excel dengan penanganan nilai null/undefined
            const formattedData = dataToExport.map((trip, index) => ({
                No: index + 1,
                "Kode Trip": trip.code_trip || "-",
                "Plat Kendaraan": trip.kendaraan?.plat_kendaraan || "-",
                "Merek Kendaraan": trip.kendaraan?.merek || "-",
                Driver: trip.driver?.name || "-",
                "Waktu Keberangkatan":
                    formatDate(trip.waktu_keberangkatan) || "-",
                "Waktu Kembali": formatDate(trip.waktu_kembali) || "-",
                "Km Awal": trip.km_awal || 0,
                "Km Akhir": trip.km_akhir || "-",
                Tujuan: trip.tujuan || "-",
                Jarak: trip.jarak ? trip.jarak + " KM" : "-",
                Penumpang: trip.penumpang || "-",
                "Jenis BBm": trip.jenis_bbm || "-",
                "Jumlah Liter": trip.jumlah_liter || "-",
                "Harga Per Liter": trip.harga_per_liter || "-",
                "Total Harga BBm": trip.total_harga_bbm || "-",
                Catatan: trip.catatan || "-",
                Status: trip.status || "-",
            }));

            // Buat workbook dan worksheet
            const worksheet = XLSX.utils.json_to_sheet(formattedData);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(
                workbook,
                worksheet,
                "Data Trip Kendaraan"
            );

            // Atur lebar kolom
            const colWidths = [
                { wch: 5 }, // A - No
                { wch: 15 }, // B - Kode Trip
                { wch: 15 }, // C - Plat Kendaraan
                { wch: 20 }, // D - Merek Kendaraan
                { wch: 20 }, // E - Driver
                { wch: 25 }, // F - Waktu Keberangkatan
                { wch: 25 }, // G - Waktu Kembali
                { wch: 10 }, // H - Km Awal
                { wch: 10 }, // I - Km Akhir
                { wch: 25 }, // J - Tujuan
                { wch: 10 }, // K - Jarak
                { wch: 25 }, // L - Penumpang
                { wch: 25 }, // M - Jenis BBm
                { wch: 25 }, // N - Jumlah Liter
                { wch: 25 }, // O - Harga Per Liter
                { wch: 25 }, // P - Total Harga BBm
                { wch: 30 }, // M - Catatan
                { wch: 15 }, // N - Status
            ];
            worksheet["!cols"] = colWidths;

            // Generate file Excel
            XLSX.writeFile(workbook, fileName);

            // Tampilkan pesan sukses
            if (exportType === "month") {
                const monthName = exportDate.toLocaleString("id-ID", {
                    month: "long",
                });
                toast.success(
                    `Data berhasil diexport ke Excel untuk bulan ${monthName} ${exportDate.getFullYear()}`,
                    toastConfig
                );
            } else {
                toast.success(
                    "Semua data berhasil diexport ke Excel",
                    toastConfig
                );
            }

            setShowExportModal(false);
        } catch (error) {
            console.error("Error exporting to Excel:", error);
            toast.error("Terjadi kesalahan saat mengexport data", toastConfig);
        }
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

    // Konfigurasi default untuk semua toast
    const toastConfig = {
        position: "top-right", // Ubah posisi ke pojok kanan atas
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
    };

    // Hitung statistik kendaraan
    const totalKendaraan = kendaraans.length;
    const kendaraanTersedia = kendaraans.filter(
        (k) => k.status === "Tersedia"
    ).length;
    const kendaraanDigunakan = kendaraans.filter(
        (k) => k.status === "Digunakan"
    ).length;
    const kendaraanPerawatan = kendaraans.filter(
        (k) => k.status === "Dalam Perawatan"
    ).length;
    const kendaraanTersediaStatus = kendaraans.filter(
        (k) => k.status === "Tersedia"
    );

    // Tambahkan komponen Skeleton
    const TableSkeleton = () => (
        <div className="animate-pulse">
            <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-t-lg mb-4"></div>
            {[1, 2, 3, 4, 5].map((index) => (
                <div
                    key={index}
                    className="h-16 bg-gray-100 dark:bg-gray-800 mb-2 rounded-lg"
                ></div>
            ))}
        </div>
    );

    // Tambahkan state untuk menyimpan driver yang tersedia
    const driversAvailable = Array.isArray(drivers)
        ? drivers.filter((driver) => driver.status === "Tersedia")
        : [];

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

    const [isDarkMode, setIsDarkMode] = useState(false);

    useEffect(() => {
        // Deteksi mode gelap dari preferensi sistem atau HTML
        const darkModeMediaQuery = window.matchMedia(
            "(prefers-color-scheme: dark)"
        );
        const htmlElement = document.documentElement;

        const updateDarkMode = () => {
            const isDark =
                htmlElement.classList.contains("dark") ||
                darkModeMediaQuery.matches;
            setIsDarkMode(isDark);
        };

        // Panggil sekali untuk inisialisasi
        updateDarkMode();

        // Tambahkan listener untuk perubahan mode
        darkModeMediaQuery.addEventListener("change", updateDarkMode);

        // Tambahkan listener untuk perubahan class pada HTML
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.attributeName === "class") {
                    updateDarkMode();
                }
            });
        });

        observer.observe(htmlElement, { attributes: true });

        return () => {
            darkModeMediaQuery.removeEventListener("change", updateDarkMode);
            observer.disconnect();
        };
    }, []);

    // Tambahkan function untuk mengubah jumlah item per halaman
    const handleItemsPerPageChange = (value) => {
        setItemsPerPage(value);
        setCurrentPage(1);
    };

    return (
        <>
            <Head title="Monitoring Kendaraan" />
            <DashboardLayout>
                <div className="py-0">
                    {/* Stats Cards dengan Animasi Hover */}
                    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
                        <div className="bg-white dark:bg-[#1f2937] rounded-xl p-4 sm:p-6 shadow-sm border border-gray-100 dark:border-gray-800 transform transition-all duration-300 hover:scale-105 hover:shadow-md">
                            <div className="flex items-center space-x-3 sm:space-x-4">
                                <div className="bg-blue-100 dark:bg-blue-900/30 p-2 sm:p-3 rounded-full">
                                    <FaCar className="text-blue-600 dark:text-blue-400 text-lg sm:text-xl" />
                                </div>
                                <div>
                                    <h3 className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm">
                                        Total Kendaraan
                                    </h3>
                                    <p className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white">
                                        {totalKendaraan}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white dark:bg-[#1f2937] rounded-xl p-4 sm:p-6 shadow-sm border border-gray-100 dark:border-gray-800 transform transition-all duration-300 hover:scale-105 hover:shadow-md">
                            <div className="flex items-center space-x-3 sm:space-x-4">
                                <div className="bg-green-100 dark:bg-green-900/30 p-2 sm:p-3 rounded-full">
                                    <FaArrowRight className="text-green-600 dark:text-green-400 text-lg sm:text-xl" />
                                </div>
                                <div>
                                    <h3 className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm">
                                        Kendaraan Tersedia
                                    </h3>
                                    <p className="text-xl sm:text-2xl font-bold text-green-600 dark:text-green-400">
                                        {kendaraanTersedia}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white dark:bg-[#1f2937] rounded-xl p-4 sm:p-6 shadow-sm border border-gray-100 dark:border-gray-800 transform transition-all duration-300 hover:scale-105 hover:shadow-md">
                            <div className="flex items-center space-x-3 sm:space-x-4">
                                <div className="bg-red-100 dark:bg-red-900/30 p-2 sm:p-3 rounded-full">
                                    <FaArrowLeft className="text-red-600 dark:text-red-400 text-lg sm:text-xl" />
                                </div>
                                <div>
                                    <h3 className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm">
                                        Sedang Digunakan
                                    </h3>
                                    <p className="text-xl sm:text-2xl font-bold text-red-600 dark:text-red-400">
                                        {kendaraanDigunakan}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white dark:bg-[#1f2937] rounded-xl p-4 sm:p-6 shadow-sm border border-gray-100 dark:border-gray-800 transform transition-all duration-300 hover:scale-105 hover:shadow-md">
                            <div className="flex items-center space-x-3 sm:space-x-4">
                                <div className="bg-purple-100 dark:bg-purple-900/30 p-2 sm:p-3 rounded-full">
                                    <FaParking className="text-purple-600 dark:text-purple-400 text-lg sm:text-xl" />
                                </div>
                                <div>
                                    <h3 className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm">
                                        Dalam Perawatan
                                    </h3>
                                    <p className="text-xl sm:text-2xl font-bold text-purple-600 dark:text-purple-400">
                                        {kendaraanPerawatan}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Table Section dengan Search Bar dan Export Button */}
                    <div className="bg-white dark:bg-[#1f2937] rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
                        <div className="p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700">
                            <div className="flex flex-col sm:flex-row gap-4">
                                <div className="max-w-full sm:w-1/4">
                                    <div className="relative">
                                        <input
                                            type="text"
                                            placeholder="Cari kendaraan..."
                                            className="w-full pl-12 pr-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-white focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none transition-colors duration-200"
                                            value={searchTerm}
                                            onChange={(e) =>
                                                setSearchTerm(e.target.value)
                                            }
                                        />
                                        <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
                                    </div>
                                </div>
                                <div className="flex flex-col sm:flex-row gap-3 sm:ml-auto">
                                    {/* Button Tambah Data */}
                                    <Link
                                        href={route("trips.create.form")} // GANTI KE RUTE BARU
                                        className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-6 py-2.5 rounded-lg transition-all duration-200 font-medium shadow-sm hover:shadow-md w-full sm:w-auto"
                                    >
                                        <FaCar className="text-lg" />
                                        <span>Trip Baru</span>
                                    </Link>

                                    {/* Dropdown Export */}
                                    {auth.user.role === "admin" && (
                                        <button
                                            onClick={() =>
                                                setShowExportModal(true)
                                            }
                                            className="flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white px-6 py-2.5 rounded-lg transition-all duration-200 font-medium shadow-sm hover:shadow-md w-full sm:w-auto"
                                        >
                                            <FaFileExcel className="text-lg" />
                                            <span>Export Excel</span>
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="overflow-x-auto">
                            {isLoading ? (
                                <TableSkeleton />
                            ) : (
                                <div className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                    <table className="min-w-full">
                                        <thead className="bg-gray-50 dark:bg-gray-700/60">
                                            <tr>
                                                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                    No
                                                </th>
                                                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                    Berangkat
                                                </th>
                                                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                    Kembali
                                                </th>
                                                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                    No Polisi
                                                </th>
                                                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                    Driver
                                                </th>
                                                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                    Tujuan
                                                </th>
                                                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                    KM Awal
                                                </th>
                                                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                    KM Akhir
                                                </th>
                                                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                    Jarak
                                                </th>
                                                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                    Status
                                                </th>
                                                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                    action
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white dark:bg-[#1f2937] divide-y divide-gray-200 dark:divide-gray-700">
                                            {currentItems.map((item, index) => (
                                                <tr
                                                    key={index}
                                                    className="hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors duration-200"
                                                >
                                                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                                                        {indexOfFirstItem +
                                                            index +
                                                            1}
                                                    </td>
                                                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                                                        <div className="flex items-center">
                                                            <FaCalendarAlt className="text-blue-500 dark:text-blue-400 mr-2 flex-shrink-0" />
                                                            <span>
                                                                {dateFormat(
                                                                    item.waktu_keberangkatan,
                                                                    "dd mmmm yyyy, HH:MM"
                                                                ) || "-"}
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                                                        <div className="flex items-center">
                                                            {/* <FaCalendarCheck className="text-green-500 dark:text-green-400 mr-2 flex-shrink-0" /> */}
                                                            <span>
                                                                {item.waktu_kembali ===
                                                                null ? (
                                                                    <>
                                                                        <div className="inline-flex">
                                                                            <FaCalendarMinus className="text-red-500 animate-pulse dark:text-red-400 mr-2 flex " />
                                                                            {
                                                                                " - - - , -:-"
                                                                            }
                                                                        </div>
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        <div className="inline-flex">
                                                                            <FaCalendarCheck className="text-green-500 dark:text-green-400 mr-2 flex-shrink-0" />
                                                                            {dateFormat(
                                                                                item.waktu_kembali,
                                                                                "dd mmmm yyyy, HH:MM"
                                                                            )}
                                                                        </div>
                                                                    </>
                                                                )}
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                                                        {
                                                            item.kendaraan
                                                                .plat_kendaraan
                                                        }
                                                    </td>
                                                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                                                        {item.driver.name}
                                                    </td>
                                                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                                                        <div className="flex items-center">
                                                            <FaMapMarkerAlt className="text-red-500 dark:text-red-400 mr-1 flex-shrink-0" />
                                                            <span>
                                                                {item.tujuan}
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                                                        {new Intl.NumberFormat(
                                                            "id-ID"
                                                        ).format(item.km_awal)}
                                                        {" KM"}
                                                    </td>
                                                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                                                        {item?.km_akhir ===
                                                            null ||
                                                        item?.km_akhir ===
                                                            undefined
                                                            ? "-"
                                                            : new Intl.NumberFormat(
                                                                  "id-ID"
                                                              ).format(
                                                                  item.km_akhir
                                                              ) + " KM"}
                                                    </td>
                                                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                                                        {item.jarak === null ||
                                                        item.jarak === undefined
                                                            ? "-"
                                                            : item.jarak +
                                                              " KM"}
                                                    </td>
                                                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                                                        {item.status ===
                                                        "Sedang Berjalan" ? (
                                                            <span className="px-3 py-1 text-sm font-medium rounded-full bg-yellow-100 text-yellow-700 dark:bg-yellow-900/50 dark:text-yellow-300 items-center w-auto inline-flex">
                                                                <span className="inline-block w-2 h-2 rounded-full bg-yellow-500 mr-2 animate-pulse"></span>
                                                                {item.status}
                                                            </span>
                                                        ) : (
                                                            <span className="px-3 py-1 text-sm font-medium rounded-full bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300 items-center w-auto inline-flex">
                                                                <span className="inline-block w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse"></span>
                                                                {item.status}
                                                            </span>
                                                        )}
                                                    </td>
                                                    <td className="px-4 py-3 text-sm">
                                                        <div className="dropdown-container relative">
                                                            <button
                                                                onClick={() =>
                                                                    toggleDropdown(
                                                                        item.id
                                                                    )
                                                                }
                                                                type="button"
                                                                className="flex items-center justify-center bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 p-1.5 rounded-lg shadow-sm hover:shadow-md"
                                                            >
                                                                <svg
                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                    className="h-4 w-4"
                                                                    fill="none"
                                                                    viewBox="0 0 24 24"
                                                                    stroke="currentColor"
                                                                >
                                                                    <path
                                                                        strokeLinecap="round"
                                                                        strokeLinejoin="round"
                                                                        strokeWidth={
                                                                            2
                                                                        }
                                                                        d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                                                                    />
                                                                </svg>
                                                            </button>

                                                            {openDropdown ===
                                                                item.id && (
                                                                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg z-20 border border-gray-200 dark:border-gray-700 overflow-hidden">
                                                                    <div className="py-1 divide-y divide-gray-200 dark:divide-gray-700">
                                                                        {item.status ===
                                                                        "Sedang Berjalan" ? (
                                                                            <Link
                                                                                href={route("trips.close.form", item.code_trip)} // GANTI KE RUTE BARU
                                                                                className="w-full text-left px-4 py-3 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-3 transition-colors duration-200"
                                                                            >
                                                                                <FaCarSide className="text-teal-500 text-lg flex-shrink-0" />
                                                                                <span className="font-medium">Tutup Trip</span>
                                                                            </Link>
                                                                        ) : (
                                                                            <div className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400 flex items-center gap-3 bg-gray-50 dark:bg-gray-900">
                                                                                <FaCheck className="text-green-500 text-lg flex-shrink-0" />
                                                                                <span className="font-medium">
                                                                                    Trip
                                                                                    Selesai
                                                                                </span>
                                                                            </div>
                                                                        )}

                                                                        <button
                                                                            onClick={() => {
                                                                                router.visit(
                                                                                    route(
                                                                                        "trips.show",
                                                                                        item.code_trip
                                                                                    )
                                                                                );
                                                                                setOpenDropdown(
                                                                                    null
                                                                                );
                                                                            }}
                                                                            type="button"
                                                                            className="w-full text-left px-4 py-3 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-3 transition-colors duration-200"
                                                                        >
                                                                            <FaEye className="text-blue-500 text-lg flex-shrink-0" />
                                                                            <span className="font-medium">
                                                                                Lihat
                                                                                Detail
                                                                            </span>
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}

                            {/* Di dalam tabel, sebelum pagination controls */}
                            <div className="flex flex-col sm:flex-row justify-between items-center p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1f2937] sticky bottom-0 left-0 right-0 shadow-md">
                                {/* Info showing entries - Responsive text size */}
                                <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 text-center sm:text-left mb-4 sm:mb-0">
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

                                {/* Items per page selector - Centered on desktop */}
                                <div className="flex items-center sm:absolute sm:left-1/2 sm:transform sm:-translate-x-1/2 bg-white dark:bg-gray-800 rounded-lg dark:border-gray-700 px-3 py-2">
                                    <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                                        Tampilkan
                                    </span>
                                    <select
                                        value={itemsPerPage}
                                        onChange={(e) =>
                                            handleItemsPerPageChange(
                                                Number(e.target.value)
                                            )
                                        }
                                        className="ml-3 bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-md text-sm font-medium px-3 py-1.5 border-0 focus:ring-2 focus:ring-blue-500 transition-all duration-200 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                                    >
                                        <option value={8} className="py-4">
                                            8 baris
                                        </option>
                                        <option value={16} className="py-4">
                                            16 baris
                                        </option>
                                        <option
                                            value={filteredTrips.length}
                                            className="py-4"
                                        >
                                            Semua baris
                                        </option>
                                    </select>
                                </div>

                                <div className="flex items-center space-x-4">
                                    {/* Previous Button - Responsive sizing */}
                                    <button
                                        onClick={() =>
                                            paginate(currentPage - 1)
                                        }
                                        disabled={currentPage === 1}
                                        className={`flex items-center justify-center w-8 sm:w-10 h-8 sm:h-10 rounded-md ${
                                            currentPage === 1
                                                ? "bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-not-allowed"
                                                : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                                        } transition-colors duration-200`}
                                    >
                                        <FaChevronLeft className="w-3 sm:w-4 h-3 sm:h-4" />
                                    </button>

                                    {/* Page Numbers - Desktop View */}
                                    <div className="hidden sm:flex items-center mx-2">
                                        {getPaginationNumbers().map(
                                            (page, index) => (
                                                <React.Fragment key={index}>
                                                    {page === "..." ? (
                                                        <span className="flex items-center justify-center w-8 sm:w-10 h-8 sm:h-10">
                                                            <FaEllipsisH className="w-3 sm:w-4 h-3 sm:h-4 text-gray-400" />
                                                        </span>
                                                    ) : (
                                                        <button
                                                            onClick={() =>
                                                                paginate(page)
                                                            }
                                                            className={`flex items-center justify-center w-8 sm:w-10 h-8 sm:h-10 rounded-full mx-1 ${
                                                                currentPage ===
                                                                page
                                                                    ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md"
                                                                    : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                                                            } transition-all duration-200`}
                                                        >
                                                            {page}
                                                        </button>
                                                    )}
                                                </React.Fragment>
                                            )
                                        )}
                                    </div>

                                    {/* Mobile Pagination Info */}
                                    <span className="mx-3 sm:hidden text-xs font-medium text-gray-600 dark:text-gray-300">
                                        {currentPage} / {totalPages}
                                    </span>

                                    {/* Next Button - Responsive sizing */}
                                    <button
                                        onClick={() =>
                                            paginate(currentPage + 1)
                                        }
                                        disabled={currentPage === totalPages}
                                        className={`flex items-center justify-center w-8 sm:w-10 h-8 sm:h-10 rounded-md ${
                                            currentPage === totalPages
                                                ? "bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-not-allowed"
                                                : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                                        } transition-colors duration-200`}
                                    >
                                        <FaChevronRight className="w-3 sm:w-4 h-3 sm:h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </DashboardLayout>

            

            

            <Modal
                isOpen={showExportModal}
                onClose={() => setShowExportModal(false)}
                title="Export Data ke Excel"
            >
                <div className="p-4">
                    <div className="mb-6">
                        <div className="flex flex-col space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                                    Pilih Jenis Export
                                </label>
                                <RadioGroup
                                    value={exportType}
                                    onChange={setExportType}
                                    className="space-y-3"
                                >
                                    <RadioGroup.Option value="month">
                                        {({ checked }) => (
                                            <div
                                                className={`
                                                relative flex items-center p-4 rounded-lg cursor-pointer transform transition-all duration-300 ease-in-out
                                                ${
                                                    checked
                                                        ? "bg-blue-50 border-2 border-blue-500 dark:bg-blue-900/30 dark:border-blue-500 shadow-md scale-102"
                                                        : "border border-gray-300 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-400"
                                                }
                                            `}
                                            >
                                                <div className="flex items-center justify-between w-full">
                                                    <div className="flex items-center">
                                                        <div
                                                            className={`
                                                            rounded-full border-2 flex items-center justify-center w-5 h-5 mr-3 transition-colors duration-300
                                                            ${
                                                                checked
                                                                    ? "border-blue-500 bg-blue-500 transform scale-110"
                                                                    : "border-gray-400 dark:border-gray-500"
                                                            }
                                                        `}
                                                        >
                                                            {checked && (
                                                                <FaCheck className="w-3 h-3 text-white animate-fadeIn" />
                                                            )}
                                                        </div>
                                                        <div className="text-sm transition-all duration-300">
                                                            <RadioGroup.Label
                                                                as="p"
                                                                className={`font-medium transition-colors duration-300 ${
                                                                    checked
                                                                        ? "text-blue-600 dark:text-blue-400"
                                                                        : "text-gray-700 dark:text-gray-300"
                                                                }`}
                                                            >
                                                                Berdasarkan
                                                                Bulan
                                                            </RadioGroup.Label>
                                                            <RadioGroup.Description
                                                                as="span"
                                                                className={`inline transition-colors duration-300 ${
                                                                    checked
                                                                        ? "text-blue-500 dark:text-blue-400"
                                                                        : "text-gray-500 dark:text-gray-400"
                                                                }`}
                                                            >
                                                                Export data
                                                                untuk bulan
                                                                tertentu
                                                            </RadioGroup.Description>
                                                        </div>
                                                    </div>
                                                    <div
                                                        className={`p-2 rounded-full transform transition-all duration-300 ${
                                                            checked
                                                                ? "bg-blue-100 dark:bg-blue-800 rotate-0 scale-110"
                                                                : "bg-gray-100 dark:bg-gray-700 rotate-0"
                                                        }`}
                                                    >
                                                        <FaCalendarAlt
                                                            className={`w-5 h-5 transition-colors duration-300 ${
                                                                checked
                                                                    ? "text-blue-500"
                                                                    : "text-gray-400"
                                                            }`}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </RadioGroup.Option>

                                    <RadioGroup.Option value="all">
                                        {({ checked }) => (
                                            <div
                                                className={`
                                                relative flex items-center p-4 rounded-lg cursor-pointer transform transition-all duration-300 ease-in-out
                                                ${
                                                    checked
                                                        ? "bg-blue-50 border-2 border-blue-500 dark:bg-blue-900/30 dark:border-blue-500 shadow-md scale-102"
                                                        : "border border-gray-300 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-400"
                                                }
                                            `}
                                            >
                                                <div className="flex items-center justify-between w-full">
                                                    <div className="flex items-center">
                                                        <div
                                                            className={`
                                                            rounded-full border-2 flex items-center justify-center w-5 h-5 mr-3 transition-colors duration-300
                                                            ${
                                                                checked
                                                                    ? "border-blue-500 bg-blue-500 transform scale-110"
                                                                    : "border-gray-400 dark:border-gray-500"
                                                            }
                                                        `}
                                                        >
                                                            {checked && (
                                                                <FaCheck className="w-3 h-3 text-white animate-fadeIn" />
                                                            )}
                                                        </div>
                                                        <div className="text-sm transition-all duration-300">
                                                            <RadioGroup.Label
                                                                as="p"
                                                                className={`font-medium transition-colors duration-300 ${
                                                                    checked
                                                                        ? "text-blue-600 dark:text-blue-400"
                                                                        : "text-gray-700 dark:text-gray-300"
                                                                }`}
                                                            >
                                                                Semua Data
                                                            </RadioGroup.Label>
                                                            <RadioGroup.Description
                                                                as="span"
                                                                className={`inline transition-colors duration-300 ${
                                                                    checked
                                                                        ? "text-blue-500 dark:text-blue-400"
                                                                        : "text-gray-500 dark:text-gray-400"
                                                                }`}
                                                            >
                                                                Export seluruh
                                                                data kendaraan
                                                                tamu
                                                            </RadioGroup.Description>
                                                        </div>
                                                    </div>
                                                    <div
                                                        className={`p-2 rounded-full transform transition-all duration-300 ${
                                                            checked
                                                                ? "bg-blue-100 dark:bg-blue-800 rotate-0 scale-110"
                                                                : "bg-gray-100 dark:bg-gray-700 rotate-0"
                                                        }`}
                                                    >
                                                        <FaGlobe
                                                            className={`w-5 h-5 transition-colors duration-300 ${
                                                                checked
                                                                    ? "text-blue-500"
                                                                    : "text-gray-400"
                                                            }`}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </RadioGroup.Option>
                                </RadioGroup>
                            </div>

                            <div
                                className="overflow-hidden transition-all duration-500 ease-in-out"
                                style={{
                                    maxHeight:
                                        exportType === "month" ? "200px" : "0",
                                    opacity: exportType === "month" ? 1 : 0,
                                    marginTop:
                                        exportType === "month" ? "1.5rem" : "0",
                                }}
                            >
                                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Pilih Bulan
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                            <FaCalendarAlt className="h-4 w-4 text-gray-400" />
                                        </div>
                                        <input
                                            type="month"
                                            value={`${exportDate.getFullYear()}-${String(
                                                exportDate.getMonth() + 1
                                            ).padStart(2, "0")}`}
                                            onChange={(e) => {
                                                const [year, month] =
                                                    e.target.value.split("-");
                                                const newDate = new Date(
                                                    year,
                                                    month - 1
                                                );
                                                setExportDate(newDate);
                                            }}
                                            className="block w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                        />
                                    </div>
                                    <div className="mt-3 flex items-center text-sm text-gray-500 dark:text-gray-400">
                                        <FaInfo className="w-4 h-4 mr-2 text-blue-500" />
                                        <p>
                                            Data akan difilter berdasarkan bulan
                                            yang dipilih
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div
                                className="overflow-hidden transition-all duration-500 ease-in-out"
                                style={{
                                    maxHeight:
                                        exportType === "all" ? "200px" : "0",
                                    opacity: exportType === "all" ? 1 : 0,
                                    marginTop:
                                        exportType === "all" ? "1.5rem" : "0",
                                }}
                            >
                                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                                    <div className="flex items-center">
                                        <div className="bg-blue-100 dark:bg-blue-800 p-3 rounded-full mr-3">
                                            <FaFileExcel className="text-blue-500 w-5 h-5" />
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-medium text-blue-800 dark:text-blue-300">
                                                Export Semua Data
                                            </h3>
                                            <p className="text-sm text-blue-600 dark:text-blue-400 mt-1">
                                                Semua data kendaraan tamu akan
                                                diexport ke file Excel
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                        <button
                            type="button"
                            onClick={() => setShowExportModal(false)}
                            className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                        >
                            Batal
                        </button>
                        <button
                            type="button"
                            onClick={exportToExcel}
                            className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white rounded-lg transition-colors flex items-center space-x-2 shadow-sm hover:shadow-md"
                        >
                            <FaFileExcel className="w-4 h-4" />
                            <span>Export Excel</span>
                        </button>
                    </div>
                </div>
            </Modal>

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
        </>
    );
}
