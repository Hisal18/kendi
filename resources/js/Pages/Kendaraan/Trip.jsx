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
    FaFilePdf,
    FaCamera,
    FaCheck,
    FaCarSide,
    FaUpload,
    FaImage,
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
    FaChevronDown,
    FaEye,
} from "react-icons/fa";
import * as XLSX from "xlsx";
import Modal from "@/Components/ModalNew";
import DatePicker from "react-datepicker";
import { Menu, Transition, RadioGroup } from '@headlessui/react';
import { ToastContainer, toast, Flip } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

export default function Trip({
    trips: initialTrips,
    kendaraans,
    drivers,
    auth,
}) {
    const [trips, setTrips] = useState(initialTrips || []);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentTime, setCurrentTime] = useState(new Date());
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8; // Jumlah item per halaman
    const [showExportDropdown, setShowExportDropdown] = useState(false);
    const [showPopup, setShowPopup] = useState(false);
    const [closeKendaraan, setCloseKendaraan] = useState(false);
    const [selectedTrip, setSelectedTrip] = useState(null);
    const [isClosingTrip, setIsClosingTrip] = useState(false);
    const [showExportModal, setShowExportModal] = useState(false);
    const [exportMonth, setExportMonth] = useState('');
    const [exportType, setExportType] = useState('all');
    const [exportDate, setExportDate] = useState(new Date());
    const [isLoading, setIsLoading] = useState(true);
    

    // Tambahkan state untuk mengelola dropdown
    const [openDropdown, setOpenDropdown] = useState(null);

    // Tambahkan fungsi untuk mengelola dropdown
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
            if (openDropdown && !event.target.closest('.dropdown-container')) {
                setOpenDropdown(null);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
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

    // Tambahkan useEffect untuk memperbarui waktu keberangkatan setiap detik
    useEffect(() => {
        const timer = setInterval(() => {
            setData(
                "waktu_keberangkatan",
                dateFormat(new Date(), "yyyy-mm-dd'T'HH:MM")
            );
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
        penumpang: "",
    });


    const fileInputRef = useRef(null);
    const fileInputRefClose = useRef(null);

    // Tambahkan state untuk multiple photos
    const [photos, setPhotos] = useState([]);
    const [previewPhotos, setPreviewPhotos] = useState([]);

    const filteredTrips = Array.isArray(trips)
        ? trips.filter(
              (trip) =>
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
          )
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
            let fileName = '';
            
            if (exportType === 'month') {
                // Validasi bulan yang dipilih
                if (!exportMonth) {
                    toast.error("Silakan pilih bulan terlebih dahulu!");
                    return;
                }

                // Filter data berdasarkan bulan yang dipilih
                const [year, month] = exportMonth.split('-');
                dataToExport = Array.isArray(trips) 
                    ? trips.filter(trip => {
                        const tripDate = new Date(trip.waktu_keberangkatan);
                        return tripDate.getFullYear() === parseInt(year) && 
                               tripDate.getMonth() === parseInt(month) - 1; // Month is 0-indexed in JS
                    })
                    : [];

                if (dataToExport.length === 0) {
                    toast.warning(`Tidak ada data untuk bulan ${month}/${year}`);
                    return;
                }

                // Set nama file dengan bulan dan tahun
                const monthName = new Date(exportMonth + '-01').toLocaleString('id-ID', { month: 'long' });
                fileName = `Data_Kendaraan_Dinas_${monthName}_${year}.xlsx`;
            } else {
                // Export semua data
                dataToExport = trips || [];
                
                if (dataToExport.length === 0) {
                    toast.warning("Tidak ada data untuk diexport");
                    return;
                }
                
                // Set nama file dengan tanggal hari ini
                fileName = `Data_Kendaraan_Trip_All_${dateFormat(new Date(), "dd-mm-yyyy")}.xlsx`;
            }

            // Format data untuk Excel
            const formattedData = dataToExport.map((trip, index) => ({
                'No': index + 1,
                'Code trip': trip.code_trip,
                'Plat kendaraan': trip.kendaraan.plat_kendaraan,
                'Driver': trip.driver.name,
                'Waktu Keberangkatan':  formatDate(trip.waktu_keberangkatan),
                'Waktu Kembali': formatDate(trip.waktu_kembali),
                'Km Awal': trip.km_awal,
                'Km Akhir': trip.km_akhir,
                'Tujuan': trip.tujuan,
                'Jarak': trip.jarak + ' km',
                'Catatan': trip.catatan,
                'merek': trip.kendaraan.merek,
                'status': trip.status,
                'penumpang': trip.penumpang,
            }));

            // Buat workbook dan worksheet
            const worksheet = XLSX.utils.json_to_sheet(formattedData);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, "Kendaraan Dinas");

            // Atur lebar kolom
        const colWidths = [
                { wch: 10 }, //A
            { wch: 15 }, //B
            { wch: 15 }, //C
            { wch: 20 }, //D
            { wch: 30 }, //E
            { wch: 30 }, //F
                { wch: 10 }, //G
                { wch: 10 }, //H
                { wch: 15 }, //I
                { wch: 10 }, //J
                { wch: 20 }, //K
                { wch: 20 }, //L
                { wch: 10 }, //M
                { wch: 10 }, //N

            ];
            worksheet['!cols'] = colWidths;

            // Generate file Excel
            XLSX.writeFile(workbook, fileName);

            // Tampilkan pesan sukses
            if (exportType === 'month') {
                const [year, month] = exportMonth.split('-');
                const monthName = new Date(exportMonth + '-01').toLocaleString('id-ID', { month: 'long' });
                toast.success(`Data berhasil diexport ke Excel untuk bulan ${monthName} ${year}`);
            } else {
                toast.success("Semua data berhasil diexport ke Excel");
            }
            
            setShowExportModal(false);
        } catch (error) {
            console.error('Error exporting to Excel:', error);
            toast.error('Terjadi kesalahan saat mengexport data');
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


    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate that photos exist
        if (photos.length === 0) {
            toast.error("Harap tambahkan minimal 1 foto kendaraan", toastConfig);
            return;
        }

        const formData = new FormData();
        formData.append("code_trip", data.code_trip);
        formData.append("kendaraan_id", data.kendaraan_id);
        formData.append("driver_id", data.driver_id);
        formData.append("waktu_keberangkatan", data.waktu_keberangkatan);
        formData.append("tujuan", data.tujuan);
        formData.append("catatan", data.catatan || '');
        formData.append("km", data.km);
        formData.append("penumpang", data.penumpang || '');

        // Append each photo with the correct field name
        photos.forEach((photo, index) => {
            formData.append(`foto_berangkat[${index}]`, photo);
        });

        setIsLoading(true);
        
        try {
            const response = await axios.post(route("trips.create"), formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'X-Requested-With': 'XMLHttpRequest',
                    'Accept': 'application/json',
                },
            });

                toast.success("Trip berhasil ditambahkan", toastConfig);
                reset();
                setPhotos([]);
                setPreviewPhotos([]);
                setShowPopup(false);
                
                setTimeout(() => {
                router.visit(route("trips.show", response.data.trip.code_trip));
                }, 2000);
        } catch (errors) {
            console.error("Error response:", errors);
                toast.error(
                errors.response?.data?.message || "Gagal menambahkan trip: " + (errors.response?.data?.foto_berangkat || "Terjadi kesalahan"),
                    toastConfig
                );
        } finally {
                setIsLoading(false);
            }
    };

    // Tambahkan fungsi untuk mengupdate data kendaraan saat dipilih
    const handleKendaraanChange = (e) => {
        const selectedKendaraan = kendaraans.find(
            (k) => k.id === parseInt(e.target.value)
        );
        if (selectedKendaraan) {
            setData({
                ...data,
                kendaraan_id: selectedKendaraan.id,
                merek: selectedKendaraan.merek,
                plat_kendaraan: selectedKendaraan.plat_kendaraan,
                km: selectedKendaraan.km,
                status: selectedKendaraan.status || "",
            });
        }
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


    // Tambahkan state untuk close trip
    const [kmAkhir, setKmAkhir] = useState("");
    const { processing: processingCloseTrip } = useForm();

    const handleCloseTrip = (e) => {
        e.preventDefault();

        if (!selectedTrip) return;

        // Make sure we're using the correct property for km_awal
        const kmAwal = selectedTrip.km_awal || selectedTrip.kendaraan?.km || 0;
        
        if (parseInt(kmAkhir) <= parseInt(kmAwal)) {
            toast.error(
                "Kilometer akhir harus lebih besar dari kilometer awal",
                toastConfig
            );
            return;
        }

        // Set closing state to true to show loading indicator
        setIsClosingTrip(true);

        // Hitung jarak yang ditempuh
        const jarak = parseInt(kmAkhir) - parseInt(kmAwal);

        const formData = new FormData();
        formData.append("km_akhir", kmAkhir);
        formData.append(
            "waktu_kembali",
            dateFormat(new Date(), "yyyy-mm-dd'T'HH:MM:ss")
        );
        formData.append("jarak", jarak);

        // Tambahkan foto kembali jika ada
        if (photos.length > 0) {
            photos.forEach((photo) => {
                formData.append("foto_kembali[]", photo);
            });
        }

        // Gunakan axios untuk mengirim request
        axios
            .post(route("trips.close", selectedTrip.id), formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            })
            .then((response) => {
                toast.success("Trip berhasil ditutup", toastConfig);
                setCloseKendaraan(false);
                setSelectedTrip(null);
                setKmAkhir("");
                setPhotos([]);
                setPreviewPhotos([]);
                
                // Refresh the page or navigate to show the updated trip
                router.visit(route("trips.show", selectedTrip.code_trip));
            })
            .catch((error) => {
                toast.error(
                    "Gagal menutup trip: " +
                        (error.response?.data?.message || "Terjadi kesalahan"),
                    toastConfig
                );
            })
            .finally(() => {
                // Reset closing state when done (success or error)
                setIsClosingTrip(false);
            });
    };

    // Perbaiki fungsi handleGalleryUpload
    const handleGalleryUpload = () => {
        if (previewPhotos.length >= 5) {
            toast.error("Maksimal 5 foto yang dapat diunggah", toastConfig);
            return;
        }

        // Create a new file input element
        const input = document.createElement('input');
        input.type = 'file';
        input.multiple = true;
        input.accept = 'image/*';
        
        input.onchange = (e) => {
            const files = Array.from(e.target.files);
            
            if (files.length + previewPhotos.length > 5) {
                toast.error("Maksimal 5 foto yang dapat diunggah", toastConfig);
                return;
            }

            // Validate each file
            const validFiles = files.filter(file => {
                if (!file.type.startsWith('image/')) {
                    toast.error(`${file.name} bukan file gambar yang valid`, toastConfig);
                    return false;
                }
                if (file.size > 5 * 1024 * 1024) {
                    toast.error(`${file.name} melebihi batas ukuran 5MB`, toastConfig);
                    return false;
                }
                return true;
            });

            // Update photos state with actual File objects
            setPhotos(prevPhotos => [...prevPhotos, ...validFiles]);

            // Generate previews
            validFiles.forEach(file => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    setPreviewPhotos(prev => [...prev, reader.result]);
                };
                reader.readAsDataURL(file);
            });
        };

        input.click();
    };

    // Make sure the handleFileUpload function properly stores File objects
    const handleFileUpload = (e) => {
        const files = Array.from(e.target.files);

        // Validate total number of photos
        if (photos.length + files.length > 5) {
            toast.error("Maksimal 5 foto yang dapat diunggah", toastConfig);
            return;
        }

        // Validate each file
        const validFiles = files.filter(file => {
            // Check if it's an image
            if (!file.type.startsWith('image/')) {
                toast.error(`File ${file.name} bukan gambar yang valid`, toastConfig);
                return false;
            }
            
            // Check file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                toast.error(`File ${file.name} terlalu besar (maks 5MB)`, toastConfig);
                return false;
            }
            
            return true;
        });

        // Update state with valid files
        setPhotos(prevPhotos => [...prevPhotos, ...validFiles]);

        // Generate previews
        validFiles.forEach(file => {
            const reader = new FileReader();
            reader.onload = (e) => {
                setPreviewPhotos(prevPreviews => [...prevPreviews, e.target.result]);
            };
            reader.readAsDataURL(file);
        });
    };

    // Modifikasi useEffect untuk menambahkan loading state
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(route("trips.index"));
                // Pastikan response.data.trips ada sebelum mengupdate state
                if (response.data && response.data.trips) {
                    setTrips(response.data.trips);
                } else {
                    console.warn("Data trips tidak ditemukan dalam response");
                    setTrips([]); // Set array kosong jika tidak ada data
                }
            } catch (error) {
                console.error("Error fetching data:", error);
                toast.error("Gagal memuat data trips", toastConfig);
            } finally {
                setIsLoading(false);
            }
        };

        // Jika initialTrips kosong, fetch data dari server
        if (!initialTrips || initialTrips.length === 0) {
            fetchData();
        } else {
            setTrips(initialTrips);
            setIsLoading(false);
        }
    }, [initialTrips]);

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

    // Fungsi untuk upload file dari galeri untuk close trip
    const handleGalleryUploadClose = () => {
        if (fileInputRefClose.current) {
            fileInputRefClose.current.removeAttribute("capture");
            fileInputRefClose.current.setAttribute("accept", "image/*");
            fileInputRefClose.current.click();
        }
    };

    // Fungsi untuk mengambil foto dari kamera untuk close trip
    const handleCameraCaptureClose = () => {
        if (fileInputRefClose.current) {
            fileInputRefClose.current.setAttribute("capture", "environment");
            fileInputRefClose.current.setAttribute("accept", "image/*");
            fileInputRefClose.current.click();
        }
    };

    // Fungsi untuk menangani file yang diupload
    const handleFileUploadClose = (e) => {
        const files = Array.from(e.target.files);

        // Validasi setiap file
        const validFiles = files.filter((file) => {
            // Cek tipe file
            if (!file.type.startsWith("image/")) {
                toast.error(
                    `${file.name} bukan file gambar yang valid`,
                    toastConfig
                );
                return false;
            }
            // Cek ukuran file (5MB)
            if (file.size > 5 * 1024 * 1024) {
                toast.error(
                    `${file.name} melebihi batas ukuran 5MB`,
                    toastConfig
                );
                return false;
            }
            return true;
        });

        // Update state photos
        setPhotos((prevPhotos) => [...prevPhotos, ...validFiles]);

        // Generate preview untuk setiap file
        validFiles.forEach((file) => {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewPhotos((prev) => [...prev, reader.result]);
            };
            reader.readAsDataURL(file);
        });
    };

    // Fungsi untuk menghapus foto
    const removePhoto = (index) => {
        setPhotos((prevPhotos) => prevPhotos.filter((_, i) => i !== index));
        setPreviewPhotos((prevPreviews) =>
            prevPreviews.filter((_, i) => i !== index)
        );
    };

    // Perbaiki fungsi handleCameraCapture
    const handleCameraCapture = () => {
        // Buat elemen input baru untuk menghindari masalah dengan event change
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.capture = 'environment'; // Gunakan kamera belakang
        
        // Tambahkan event listener untuk menangani file yang dipilih
        input.onchange = (e) => {
            const files = Array.from(e.target.files);
            
            // Validasi jumlah foto
            if (photos.length + files.length > 5) {
            toast.error("Maksimal 5 foto yang dapat diunggah", toastConfig);
            return;
        }

            // Validasi setiap file
            const validFiles = files.filter(file => {
                // Cek apakah file adalah gambar
                if (!file.type.startsWith('image/')) {
                    toast.error(`File ${file.name} bukan gambar yang valid`, toastConfig);
                    return false;
                }
                
                // Cek ukuran file (max 5MB)
                if (file.size > 5 * 1024 * 1024) {
                    toast.error(`File ${file.name} terlalu besar (maks 5MB)`, toastConfig);
                    return false;
                }
                
                return true;
            });
            
            // Update state dengan file yang valid
            setPhotos(prevPhotos => [...prevPhotos, ...validFiles]);
            
            // Generate preview untuk setiap file
            validFiles.forEach(file => {
                const reader = new FileReader();
                reader.onload = (e) => {
                    setPreviewPhotos(prevPreviews => [...prevPreviews, e.target.result]);
                };
                reader.readAsDataURL(file);
            });
        };
        
        // Klik input untuk membuka kamera
        input.click();
    };

    // Tambahkan state untuk menyimpan driver yang tersedia
    const driversAvailable = Array.isArray(drivers)
        ? drivers.filter((driver) => driver.status === "Tersedia")
        : [];

        const formatDate = (dateString) => {
            if (!dateString) return "-";
            const date = new Date(dateString);
            return date.toLocaleString('id-ID', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        };


    return (
        <>
            <Head title="Monitoring Kendaraan" />
            <DashboardLayout>
                <div className="py-0">
                    {/* Header Section dengan Background Gradient dan Waktu Real-time */}
                    <div className="mb-4 text-white">
                        <h1 className="text-3xl font-bold mb-2 text-gray-500 dark:text-gray-400">
                            Monitoring Perjalanan
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
                                        {totalKendaraan}
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
                                        {kendaraanTersedia}
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
                                        Sedang Digunakan
                                    </h3>
                                    <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                                        {kendaraanDigunakan}
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
                                        Dalam Perawatan
                                    </h3>
                                    <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                                        {kendaraanPerawatan}
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
                                        className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-6 py-2.5 rounded-lg transition-all duration-200 font-medium shadow-sm hover:shadow-md w-full md:w-auto justify-center"
                                    >
                                        <FaPlus className="text-lg" />
                                        <span>Tambah Data</span>
                                    </button>

                                    {/* Dropdown Export */}
                                    {auth.user.role === "admin" && (
                                            <button
                                            onClick={() => setShowExportModal(true)}
                                            className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-2.5 rounded-lg transition-all duration-200 font-medium shadow-sm hover:shadow-md w-full md:w-auto justify-center"
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
                                                Driver
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                Tujuan
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
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                action
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
                                                    {indexOfFirstItem +
                                                        index +
                                                        1}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">
                                                    <Link
                                                        href={route(
                                                            "trips.show",
                                                            item.code_trip
                                                        )}
                                                        className="text-blue-500 hover:text-blue-700 underline"
                                                    >
                                                        {item.code_trip}
                                                    </Link>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">
                                                    {
                                                        item.kendaraan
                                                            .plat_kendaraan
                                                    }
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">
                                                    {item.driver.name}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">
                                                    {item.tujuan}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">
                                                    {new Intl.NumberFormat(
                                                        "id-ID"
                                                    ).format(
                                                        item.km_awal
                                                    )}
                                                    {" KM"}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">
                                                    {item?.km_akhir === null ||
                                                    item?.km_akhir === undefined
                                                        ? "-"
                                                        : new Intl.NumberFormat(
                                                              "id-ID"
                                                          ).format(
                                                              item.km_akhir
                                                          ) + " KM"}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">
                                                    {item.jarak + " KM"}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span
                                                        className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-md ${
                                                            item.status ===
                                                            "Sedang Berjalan"
                                                                ? "bg-sky-100 text-sky-800 dark:bg-sky-900 dark:text-sky-300"
                                                                : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                                                        }`}
                                                    >
                                                        {item.status}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3 text-sm">
                                                    <div className="dropdown-container relative">
                                                        <button
                                                            onClick={() => toggleDropdown(item.id)}
                                                            type="button"
                                                            className="flex items-center justify-center bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 p-1.5 rounded-lg shadow-sm hover:shadow-md"
                                                        >
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                                                            </svg>
                                                        </button>
                                                        
                                                        {openDropdown === item.id && (
                                                            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg z-20 border border-gray-200 dark:border-gray-700 overflow-hidden">
                                                                <div className="py-1 divide-y divide-gray-200 dark:divide-gray-700">
                                                                    {item.status === "Sedang Berjalan" ? (
                                                        <button
                                                            onClick={() => {
                                                                                setSelectedTrip(item);
                                                                                setCloseKendaraan(true);
                                                                                setOpenDropdown(null);
                                                            }}
                                                            type="button"
                                                                            className="w-full text-left px-4 py-3 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-3 transition-colors duration-200"
                                                        >
                                                                            <FaCarSide className="text-teal-500 text-lg flex-shrink-0" />
                                                                            <span className="font-medium">Tutup Trip</span>
                                                        </button>
                                                    ) : (
                                                                        <div className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400 flex items-center gap-3 bg-gray-50 dark:bg-gray-900">
                                                                            <FaCheck className="text-green-500 text-lg flex-shrink-0" />
                                                                            <span className="font-medium">Trip Selesai</span>
                                                                        </div>
                                                                    )}
                                                                    
                                                                    <button
                                                                        onClick={() => {
                                                                            router.visit(route("trips.show", item.code_trip));
                                                                            setOpenDropdown(null);
                                                                        }}
                                                                        type="button"
                                                                        className="w-full text-left px-4 py-3 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-3 transition-colors duration-200"
                                                                    >
                                                                        <FaEye className="text-blue-500 text-lg flex-shrink-0" />
                                                                        <span className="font-medium">Lihat Detail</span>
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
                            )}

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

            {/* Modal Tambah Data */}
            <Modal
                isOpen={showPopup}
                onClose={() => setShowPopup(false)}
                title="Tambah Trip"
            >
                <div className="max-h-[85vh] overflow-y-auto px-1">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Kolom Kiri - Informasi Trip */}
                            <div>
                                <div className="bg-gray-50 dark:bg-[#414141] rounded-lg p-4 space-y-3">
                                    {/* Header Info */}
                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                Kode Trip
                                            </label>
                                            <div className="relative">
                                                <input
                                                    type="text"
                                                    value={data.code_trip}
                                                    className="block w-full px-3 py-2 disabled:border-gray-200 disabled:bg-gray-50 disabled:text-gray-500 disabled:shadow-none dark:disabled:border-gray-700 dark:disabled:bg-[#616161]/20 rounded-lg border-gray-300 dark:border-gray-600 dark:bg-[#515151] dark:text-white focus:border-blue-500 focus:ring-blue-500 transition-colors cursor-not-allowed text-sm"
                                                    disabled
                                                />
                                                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                                                    <FaLock className="w-3 h-3 text-gray-500 dark:text-gray-400" />
                                                </div>
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                Waktu
                                            </label>
                                            <div className="relative">
                                                <input
                                                    type="datetime-local"
                                                    value={
                                                        data.waktu_keberangkatan
                                                    }
                                                    className="block w-full px-3 py-2 disabled:border-gray-200 disabled:bg-gray-50 disabled:text-gray-500 disabled:shadow-none dark:disabled:border-gray-700 dark:disabled:bg-[#616161]/20 rounded-lg border-gray-300 dark:border-gray-600 dark:bg-[#515151] dark:text-white focus:border-blue-500 focus:ring-blue-500 transition-colors cursor-not-allowed text-sm"
                                                    disabled
                                                />
                                                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                                                    <FaClock className="w-3 h-3 text-gray-500 dark:text-gray-400" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Kendaraan Selection */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            Pilih Kendaraan
                                        </label>
                                        <div className="relative">
                                            <select
                                                value={data.kendaraan_id}
                                                onChange={handleKendaraanChange}
                                                className="block w-full px-3 py-2 rounded-lg border-gray-300 dark:border-gray-600 dark:bg-[#515151] dark:text-white focus:border-blue-500 focus:ring-blue-500 transition-colors appearance-none text-sm"
                                                required
                                            >
                                                <option value="">
                                                    Pilih Kendaraan
                                                </option>
                                                {Array.isArray(
                                                    kendaraanTersediaStatus
                                                ) &&
                                                    kendaraanTersediaStatus
                                                        .toSorted((a, b) => 
                                                            a.merek.localeCompare(b.merek)
                                                        )
                                                        .map((kendaraan) => (
                                                            <option
                                                                key={
                                                                    kendaraan.id
                                                                }
                                                                value={
                                                                    kendaraan.id
                                                                }
                                                            >
                                                                {
                                                                    kendaraan.plat_kendaraan
                                                                }{" "}
                                                                -{" "}
                                                                {
                                                                    kendaraan.merek
                                                                }
                                                            </option>
                                                        ))}
                                            </select>
                                            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                                <FaCarSide className="w-3 h-3 text-gray-500 dark:text-gray-400" />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Detail Kendaraan */}
                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                Merek
                                            </label>
                                            <div className="relative">
                                                <input
                                                    type="text"
                                                    value={data.merek}
                                                    className="block w-full px-3 py-2 disabled:border-gray-200 disabled:bg-gray-50 disabled:text-gray-500 disabled:shadow-none dark:disabled:border-gray-700 dark:disabled:bg-[#616161]/20 rounded-lg border-gray-300 dark:border-gray-600 dark:bg-[#515151] dark:text-white focus:border-blue-500 focus:ring-blue-500 transition-colors cursor-not-allowed text-sm"
                                                    disabled
                                                />
                                                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                                                    <FaCar className="w-3 h-3 text-gray-500 dark:text-gray-400" />
                                                </div>
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                Plat Nomor
                                            </label>
                                            <div className="relative">
                                                <input
                                                    type="text"
                                                    value={data.plat_kendaraan}
                                                    className="block w-full px-3 py-2 disabled:border-gray-200 disabled:bg-gray-50 disabled:text-gray-500 disabled:shadow-none dark:disabled:border-gray-700 dark:disabled:bg-[#616161]/20 rounded-lg border-gray-300 dark:border-gray-600 dark:bg-[#515151] dark:text-white focus:border-blue-500 focus:ring-blue-500 transition-colors cursor-not-allowed text-sm"
                                                    disabled
                                                />
                                                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                                                    <FaIdCard className="w-3 h-3 text-gray-500 dark:text-gray-400" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* KM dan Status */}
                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                Kilometer Awal
                                            </label>
                                            <div className="relative">
                                                <input
                                                    type="text"
                                                    inputMode="numeric"
                                                    value={data.km}
                                                    onChange={(e) =>
                                                        setData(
                                                            "km",
                                                            e.target.value
                                                        )
                                                    }
                                                    className="block w-full px-3 py-2 rounded-lg border-gray-300 dark:border-gray-600 dark:bg-[#515151] dark:text-white focus:border-blue-500 focus:ring-blue-500 transition-colors text-sm"
                                                    required
                                                />
                                                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                                                    <FaTachometerAlt className="w-3 h-3 text-gray-500 dark:text-gray-400" />
                                                </div>
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                Status
                                            </label>
                                            <div className="relative">
                                                <input
                                                    type="text"
                                                    value={data.status}
                                                    className="block w-full px-3 py-2 disabled:border-gray-200 disabled:bg-gray-50 disabled:text-gray-500 disabled:shadow-none dark:disabled:border-gray-700 dark:disabled:bg-[#616161]/20 rounded-lg border-gray-300 dark:border-gray-600 dark:bg-[#515151] dark:text-white focus:border-blue-500 focus:ring-blue-500 transition-colors cursor-not-allowed text-sm"
                                                    disabled
                                                />
                                                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                                                    <FaInfo className="w-3 h-3 text-gray-500 dark:text-gray-400" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Tujuan dan Driver */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            Tujuan
                                        </label>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                value={data.tujuan}
                                                onChange={(e) =>
                                                    setData(
                                                        "tujuan",
                                                        e.target.value
                                                    )
                                                }
                                                className="block w-full px-3 py-2 rounded-lg border-gray-300 dark:border-gray-600 dark:bg-[#515151] dark:text-white focus:border-blue-500 focus:ring-blue-500 transition-colors text-sm"
                                                placeholder="Masukkan tujuan"
                                                required
                                            />
                                            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                                                <FaMapMarkerAlt className="w-3 h-3 text-gray-500 dark:text-gray-400" />
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            Penumpang
                                        </label>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                value={data.penumpang}
                                                onChange={(e) =>
                                                    setData(
                                                        "penumpang",
                                                        e.target.value
                                                    )
                                                }
                                                className="block w-full px-3 py-2 rounded-lg border-gray-300 dark:border-gray-600 dark:bg-[#515151] dark:text-white focus:border-blue-500 focus:ring-blue-500 transition-colors text-sm"
                                                placeholder="Nama penumpang"
                                                required
                                            />
                                            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                                                <FaUsers className="w-3 h-3 text-gray-500 dark:text-gray-400" />
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            Driver
                                        </label>
                                        <div className="relative">
                                            <select
                                                value={data.driver_id}
                                                onChange={(e) =>
                                                    setData(
                                                        "driver_id",
                                                        e.target.value
                                                    )
                                                }
                                                className="block w-full px-3 py-2 rounded-lg border-gray-300 dark:border-gray-600 dark:bg-[#515151] dark:text-white focus:border-blue-500 focus:ring-blue-500 transition-colors appearance-none text-sm"
                                                required
                                            >
                                                <option value="">
                                                    Pilih Driver
                                                </option>
                                                {driversAvailable
                                                    .toSorted((a, b) =>
                                                        a.name.localeCompare(b.name)
                                                    )
                                                    .map((driver) => (
                                                        <option
                                                            key={driver.id}
                                                            value={driver.id}
                                                        >
                                                            {driver.name} -{" "}
                                                            {
                                                                driver.phone_number
                                                            }
                                                        </option>
                                                    ))}
                                            </select>
                                            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                                <FaUserTie className="w-3 h-3 text-gray-500 dark:text-gray-400" />
                                            </div>
                                        </div>
                                        {errors.driver_id && (
                                            <div className="text-red-500 text-xs mt-1">
                                                {errors.driver_id}
                                            </div>
                                        )}
                                        {driversAvailable.length === 0 && (
                                            <div className="text-yellow-500 text-xs mt-1">
                                                Tidak ada driver yang tersedia
                                                saat ini
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Kolom Kanan - Foto dan Catatan */}
                            <div className="space-y-3">
                                {/* Foto Kendaraan */}
                                <div className="bg-gray-50 dark:bg-[#414141] rounded-lg p-4">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Foto Kendaraan
                                    </label>
                                    <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4">
                                        {previewPhotos.length === 0 ? (
                                            <div className="flex flex-col items-center justify-center space-y-3 py-5">
                                                <FaImage className="h-10 w-10 text-gray-400" />
                                                <div className="text-gray-600 dark:text-gray-400 text-sm text-center">
                                                    <span className="font-medium">
                                                        Pilih foto atau ambil
                                                        gambar
                                                    </span>
                                                </div>
                                                <div className="flex space-x-2">
                                                    <button
                                                        type="button"
                                                        onClick={
                                                            handleGalleryUpload
                                                        }
                                                        className="inline-flex items-center px-3 py-1.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
                                                    >
                                                        <FaUpload className="mr-1 w-3 h-3" />
                                                        Galeri
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={
                                                            handleCameraCapture
                                                        }
                                                        className="inline-flex items-center px-3 py-1.5 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm"
                                                    >
                                                        <FaCamera className="mr-1 w-3 h-3" />
                                                        Kamera
                                                    </button>
                                                </div>
                                                <input
                                                    type="file"
                                                    ref={fileInputRef}
                                                    className="hidden"
                                                    onChange={handleFileUpload}
                                                    accept="image/*"
                                                    multiple
                                                />
                                            </div>
                                        ) : (
                                            <div className="grid grid-cols-3 gap-2">
                                                {previewPhotos.map(
                                                    (preview, index) => (
                                                        <div
                                                            key={index}
                                                            className="relative group"
                                                        >
                                                            <img
                                                                src={preview}
                                                                alt={`Foto ${
                                                                    index + 1
                                                                }`}
                                                                className="w-full h-24 object-cover rounded-lg"
                                                            />
                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    removePhoto(
                                                                        index
                                                                    )
                                                                }
                                                                className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100"
                                                            >
                                                                <FaTimes className="w-3 h-3" />
                                                            </button>
                                                        </div>
                                                    )
                                                )}
                                                {previewPhotos.length < 5 && (
                                                    <button
                                                        type="button"
                                                        onClick={
                                                            handleGalleryUpload
                                                        }
                                                        className="flex flex-col items-center justify-center h-24 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-blue-500 dark:hover:border-blue-500 transition-colors"
                                                    >
                                                        <FaPlus className="text-gray-400 w-4 h-4 mb-1" />
                                                        <span className="text-gray-600 dark:text-gray-400 text-xs">
                                                            Tambah
                                                        </span>
                                                    </button>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                    {errors.foto_berangkat && (
                                        <p className="mt-1 text-xs text-red-600">
                                            {errors.foto_berangkat}
                                        </p>
                                    )}
                                </div>

                                {/* Catatan */}
                                <div className="bg-gray-50 dark:bg-[#414141] rounded-lg p-4">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Catatan
                                    </label>
                                    <div className="relative">
                                        <textarea
                                            value={data.catatan}
                                            onChange={(e) =>
                                                setData(
                                                    "catatan",
                                                    e.target.value
                                                )
                                            }
                                            rows="3"
                                            className="block w-full px-3 py-2 rounded-lg border-gray-300 dark:border-gray-600 dark:bg-[#515151] dark:text-white focus:border-blue-500 focus:ring-blue-500 transition-colors text-sm"
                                            placeholder="Tambahkan catatan jika diperlukan..."
                                        />
                                        <div className="absolute top-2 right-2">
                                            <FaEdit className="w-3 h-3 text-gray-500 dark:text-gray-400" />
                                        </div>
                                    </div>
                                    {errors.catatan && (
                                        <div className="text-red-500 text-xs mt-1">
                                            {errors.catatan}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Tombol Submit */}
                        <div className="flex justify-end space-x-2 pt-4 border-t border-gray-200 dark:border-gray-700">
                            <button
                                type="button"
                                onClick={() => setShowPopup(false)}
                                className="px-4 py-2 border border-gray-300 text-gray-700 dark:text-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm"
                            >
                                Batal
                            </button>
                            <button
                                type="submit"
                                disabled={processing}
                                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 transition-colors flex items-center space-x-2 text-sm"
                            >
                                {processing ? (
                                    <>
                                        <FaSpinner className="animate-spin w-4 h-4" />
                                        <span>Menyimpan...</span>
                                    </>
                                ) : (
                                    <>
                                        <FaSave className="w-4 h-4" />
                                        <span>Simpan</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </Modal>

            {/* Modal Close Trip */}
            <Modal
                isOpen={closeKendaraan}
                onClose={() => {
                    reset();
                    setSelectedTrip(null);
                    setKmAkhir("");
                    setPhotos([]);
                    setPreviewPhotos([]);
                    setCloseKendaraan(false);
                }}
                title="Close Trip"
            >
                {selectedTrip && (
                    <form onSubmit={handleCloseTrip} className="space-y-6">
                        <div className="space-y-6">
                            {/* Detail Trip */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Kode Trip
                                    </label>
                                    <input
                                        type="text"
                                        value={selectedTrip.code_trip}
                                        className="block w-full px-4 py-3 rounded-lg bg-gray-100 cursor-not-allowed border-gray-300 dark:border-gray-600 dark:bg-[#717171] dark:text-white focus:border-blue-500 focus:ring-blue-500 transition-colors"
                                        disabled
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Plat Kendaraan
                                    </label>
                                    <input
                                        type="text"
                                        value={
                                            selectedTrip.kendaraan
                                                .plat_kendaraan
                                        }
                                        className="block w-full px-4 py-3 rounded-lg border-gray-300 bg-gray-100 cursor-not-allowed dark:border-gray-600 dark:bg-[#717171] dark:text-white focus:border-blue-500 focus:ring-blue-500 transition-colors"
                                        disabled
                                    />
                                </div>
                            </div>

                            {/* KM Awal dan Akhir */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Kilometer Awal
                                    </label>
                                    <input
                                        type="text"
                                        value={selectedTrip.km_awal}
                                        className="block w-full px-4 py-3 rounded-lg border-gray-300  bg-gray-100 cursor-not-allowed dark:border-gray-600 dark:bg-[#717171] dark:text-white focus:border-blue-500 focus:ring-blue-500 transition-colors"
                                        disabled
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Kilometer Akhir
                                    </label>
                                    <input
                                        type="number"
                                        value={kmAkhir}
                                        onChange={(e) =>
                                            setKmAkhir(e.target.value)
                                        }
                                        className="block w-full px-4 py-3 rounded-lg border-gray-300 dark:border-gray-600 dark:bg-[#515151] dark:text-white focus:border-blue-500 focus:ring-blue-500 transition-colors"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Foto Kembali */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Foto Kendaraan Kembali
                                </label>
                                <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4">
                                    {previewPhotos.length === 0 ? (
                                        <div className="flex flex-col items-center justify-center h-full space-y-4 w-full min-h-[200px]">
                                            <div className="text-center space-y-2 flex flex-col items-center justify-center">
                                                <FaImage className="h-12 w-12 text-gray-400" />
                                                <div className="text-gray-600 dark:text-gray-400">
                                                    <span className="font-medium">
                                                        Pilih foto atau ambil
                                                        gambar
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="flex space-x-3">
                                                <button
                                                    type="button"
                                                    onClick={
                                                        handleGalleryUploadClose
                                                    }
                                                    className="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                                                >
                                                    <FaUpload className="mr-2" />
                                                    Galeri
                                                </button>

                                                <button
                                                    type="button"
                                                    onClick={
                                                        handleCameraCaptureClose
                                                    }
                                                    className="inline-flex items-center px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                                                >
                                                    <FaCamera className="mr-2" />
                                                    Kamera
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-3 gap-4">
                                            {previewPhotos.map(
                                                (preview, index) => (
                                                    <div
                                                        key={index}
                                                        className="relative"
                                                    >
                                                        <img
                                                            src={preview}
                                                            alt={`Foto ${
                                                                index + 1
                                                            }`}
                                                            className="w-full h-48 object-cover rounded-lg"
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                removePhoto(
                                                                    index
                                                                )
                                                            }
                                                            className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                                                        >
                                                            <FaTimes />
                                                        </button>
                                                    </div>
                                                )
                                            )}
                                            {previewPhotos.length < 5 && (
                                                <button
                                                    type="button"
                                                    onClick={
                                                        handleGalleryUploadClose
                                                    }
                                                    className="flex flex-col items-center justify-center h-48 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-blue-500 dark:hover:border-blue-500 transition-colors"
                                                >
                                                    <FaPlus className="text-gray-400 w-4 h-4 mb-1" />
                                                    <span className="text-gray-600 dark:text-gray-400 text-xs">
                                                        Tambah
                                                    </span>
                                                </button>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Input file tersembunyi */}
                            <input
                                type="file"
                                ref={fileInputRefClose}
                                className="hidden"
                                onChange={handleFileUploadClose}
                                multiple
                                accept="image/*"
                            />
                        </div>

                        {/* Tombol Submit */}
                        <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200 dark:border-gray-700">
                            <button
                                type="button"
                                onClick={() => {
                                    reset();
                                    setCloseKendaraan(false);
                                    setSelectedTrip(null);
                                    setKmAkhir("");
                                    setPhotos([]);
                                    setPreviewPhotos([]);
                                }}
                                className="px-6 py-2.5 border border-gray-300 text-gray-700 dark:text-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                            >
                                Batal
                            </button>
                            <button
                                type="submit"
                                disabled={processingCloseTrip}
                                className="px-6 py-2.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 transition-colors"
                            >
                                {processingCloseTrip
                                    ? "Menyimpan..."
                                    : "Simpan"}
                            </button>
                        </div>
                    </form>
                )}
            </Modal>
            <Modal
                isOpen={showExportModal}
                onClose={() => setShowExportModal(false)}
                title="Export Data ke Excel"
            >
                <div className="p-4">
                    <div className="mb-6">
                        <div className="flex flex-col space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Pilih Jenis Export
                                </label>
                                <div className="flex space-x-4">
                                    <div className="flex items-center">
                                        <input
                                            id="export-month"
                                            type="radio"
                                            name="export-type"
                                            value="month"
                                            checked={exportType === 'month'}
                                            onChange={() => setExportType('month')}
                                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                                        />
                                        <label htmlFor="export-month" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                                            Berdasarkan Bulan
                                        </label>
                                    </div>
                                    <div className="flex items-center">
                                        <input
                                            id="export-all"
                                            type="radio"
                                            name="export-type"
                                            value="all"
                                            checked={exportType === 'all'}
                                            onChange={() => setExportType('all')}
                                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                                        />
                                        <label htmlFor="export-all" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                                            Semua Data
                                        </label>
                                    </div>
                                </div>
                            </div>
                            
                            {exportType === 'month' && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Pilih Bulan
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                            <FaCalendarAlt className="text-gray-400" />
                                        </div>
                                        <input
                                            type="month"
                                            value={exportMonth}
                                            onChange={(e) => setExportMonth(e.target.value)}
                                            className="block w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-[#515151] text-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        />
                                    </div>
                                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                                        Data akan difilter berdasarkan bulan yang dipilih
                                    </p>
                                </div>
                            )}
                            
                            {exportType === 'all' && (
                                <div className="flex items-center space-x-3 text-gray-700 dark:text-gray-300 bg-blue-50 dark:bg-blue-900/30 p-3 rounded-lg">
                                    <FaGlobe className="text-blue-500 flex-shrink-0" />
                                    <p className="text-sm">
                                        Semua data kendaraan dinas akan diexport ke file Excel
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                    
                    <div className="flex justify-end space-x-3">
                        <button
                            type="button"
                            onClick={() => setShowExportModal(false)}
                            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                        >
                            Batal
                        </button>
                        <button
                            type="button"
                            onClick={exportToExcel}
                            className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors flex items-center space-x-2"
                        >
                            <FaFileExcel />
                            <span>Export Excel</span>
                        </button>
                    </div>
                </div>
            </Modal>
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
                                <RadioGroup value={exportType} onChange={setExportType} className="space-y-3">
                                    <RadioGroup.Option value="month">
                                        {({ checked }) => (
                                            <div className={`
                                                relative flex items-center p-4 rounded-lg cursor-pointer transform transition-all duration-300 ease-in-out
                                                ${checked 
                                                    ? 'bg-blue-50 border-2 border-blue-500 dark:bg-blue-900/30 dark:border-blue-500 shadow-md scale-102' 
                                                    : 'border border-gray-300 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-400'}
                                            `}>
                                                <div className="flex items-center justify-between w-full">
                                                    <div className="flex items-center">
                                                        <div className={`
                                                            rounded-full border-2 flex items-center justify-center w-5 h-5 mr-3 transition-colors duration-300
                                                            ${checked 
                                                                ? 'border-blue-500 bg-blue-500 transform scale-110' 
                                                                : 'border-gray-400 dark:border-gray-500'}
                                                        `}>
                                                            {checked && (
                                                                <FaCheck className="w-3 h-3 text-white animate-fadeIn" />
                                                            )}
                                                        </div>
                                                        <div className="text-sm transition-all duration-300">
                                                            <RadioGroup.Label as="p" className={`font-medium transition-colors duration-300 ${checked ? 'text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300'}`}>
                                                                Berdasarkan Bulan
                                                            </RadioGroup.Label>
                                                            <RadioGroup.Description as="span" className={`inline transition-colors duration-300 ${checked ? 'text-blue-500 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400'}`}>
                                                                Export data untuk bulan tertentu
                                                            </RadioGroup.Description>
                                                        </div>
                                                    </div>
                                                    <div className={`p-2 rounded-full transform transition-all duration-300 ${checked ? 'bg-blue-100 dark:bg-blue-800 rotate-0 scale-110' : 'bg-gray-100 dark:bg-gray-700 rotate-0'}`}>
                                                        <FaCalendarAlt className={`w-5 h-5 transition-colors duration-300 ${checked ? 'text-blue-500' : 'text-gray-400'}`} />
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </RadioGroup.Option>
                                    
                                    <RadioGroup.Option value="all">
                                        {({ checked }) => (
                                            <div className={`
                                                relative flex items-center p-4 rounded-lg cursor-pointer transform transition-all duration-300 ease-in-out
                                                ${checked 
                                                    ? 'bg-blue-50 border-2 border-blue-500 dark:bg-blue-900/30 dark:border-blue-500 shadow-md scale-102' 
                                                    : 'border border-gray-300 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-400'}
                                            `}>
                                                <div className="flex items-center justify-between w-full">
                                                    <div className="flex items-center">
                                                        <div className={`
                                                            rounded-full border-2 flex items-center justify-center w-5 h-5 mr-3 transition-colors duration-300
                                                            ${checked 
                                                                ? 'border-blue-500 bg-blue-500 transform scale-110' 
                                                                : 'border-gray-400 dark:border-gray-500'}
                                                        `}>
                                                            {checked && (
                                                                <FaCheck className="w-3 h-3 text-white animate-fadeIn" />
                                                            )}
                                                        </div>
                                                        <div className="text-sm transition-all duration-300">
                                                            <RadioGroup.Label as="p" className={`font-medium transition-colors duration-300 ${checked ? 'text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300'}`}>
                                                                Semua Data
                                                            </RadioGroup.Label>
                                                            <RadioGroup.Description as="span" className={`inline transition-colors duration-300 ${checked ? 'text-blue-500 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400'}`}>
                                                                Export seluruh data kendaraan dinas
                                                            </RadioGroup.Description>
                                                        </div>
                                                    </div>
                                                    <div className={`p-2 rounded-full transform transition-all duration-300 ${checked ? 'bg-blue-100 dark:bg-blue-800 rotate-0 scale-110' : 'bg-gray-100 dark:bg-gray-700 rotate-0'}`}>
                                                        <FaGlobe className={`w-5 h-5 transition-colors duration-300 ${checked ? 'text-blue-500' : 'text-gray-400'}`} />
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </RadioGroup.Option>
                                </RadioGroup>
                            </div>
                            
                            <div className="overflow-hidden transition-all duration-500 ease-in-out" 
                                 style={{ 
                                     maxHeight: exportType === 'month' ? '200px' : '0',
                                     opacity: exportType === 'month' ? 1 : 0,
                                     marginTop: exportType === 'month' ? '1.5rem' : '0'
                                 }}>
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
                                            value={`${exportDate.getFullYear()}-${String(exportDate.getMonth() + 1).padStart(2, '0')}`}
                                            onChange={(e) => {
                                                const [year, month] = e.target.value.split('-');
                                                const newDate = new Date(year, month - 1);
                                                setExportDate(newDate);
                                            }}
                                            className="block w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-[#515151] text-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                        />
                                    </div>
                                    <div className="mt-3 flex items-center text-sm text-gray-500 dark:text-gray-400">
                                        <FaInfo className="w-4 h-4 mr-2 text-blue-500" />
                                        <p>
                                            Data akan difilter berdasarkan bulan yang dipilih
                                        </p>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="overflow-hidden transition-all duration-500 ease-in-out" 
                                 style={{ 
                                     maxHeight: exportType === 'all' ? '200px' : '0',
                                     opacity: exportType === 'all' ? 1 : 0,
                                     marginTop: exportType === 'all' ? '1.5rem' : '0'
                                 }}>
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
                                                Semua data kendaraan dinas akan diexport ke file Excel
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
                            className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors flex items-center space-x-2 shadow-sm hover:shadow-md"
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
                theme="light"
                transition={Flip}
            />
        </>
    );
}
