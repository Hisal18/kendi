import DashboardLayout from "@/Layouts/DashboardLayout";
import { Head, Link } from "@inertiajs/react";
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
} from "react-icons/fa";
import * as XLSX from "xlsx";
import { useForm } from "@inertiajs/react";
import Modal from "@/Components/ModalNew";
import { ToastContainer, toast, Flip } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Echo from "laravel-echo";
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

    const [isLoading, setIsLoading] = useState(true);

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
        km_awal: "",
        merek: "",
        plat_kendaraan: "",
        status: "",
        penumpang: "",
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
        const dataToExport = filteredTrips.map((trip, index) => ({
            No: index + 1,
            "Kode Trip": trip.code_trip,
            "Plat Kendaraan": trip.kendaraan.plat_kendaraan,
            "Nama Driver": trip.driver?.name || "-",
            "No. HP Driver": trip.driver?.phone_number || "-",
            Tujuan: trip.tujuan,
            Penumpang: trip.penumpang || "-",
            "Tanggal Berangkat": dateFormat(
                trip.waktu_keberangkatan,
                "dd mmmm yyyy, HH:MM:ss"
            ),
            "Tanggal Kembali": dateFormat(
                trip.waktu_kembali,
                "dd mmmm yyyy, HH:MM:ss"
            ),
            "KM Awal": trip.kendaraan.km_awal,
            "KM Akhir": trip.km_akhir || "-",
            "Jarak Tempuh": trip.jarak + " KM" || "-",
            Status: trip.status,
            "Catatan Berangkat": trip.catatan || "-",
            "Dibuat Pada": dateFormat(
                trip.created_at,
                "dd mmmm yyyy, HH:MM:ss"
            ),
            "Diperbarui Pada": dateFormat(
                trip.updated_at,
                "dd mmmm yyyy, HH:MM:ss"
            ),
        }));

        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.json_to_sheet(dataToExport);

        const colWidths = [
            { wch: 5 }, //A
            { wch: 15 }, //B
            { wch: 15 }, //C
            { wch: 20 }, //D
            { wch: 30 }, //E
            { wch: 30 }, //F
            { wch: 30 }, //G
            { wch: 40 }, //H
            { wch: 40 }, //I
            { wch: 15 }, //J
            { wch: 15 }, //K
            { wch: 10 }, //L
            { wch: 20 }, //M
            { wch: 30 }, //N
            { wch: 30 }, //O
            { wch: 30 }, //P
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

    const handleSubmit = (e) => {
        e.preventDefault();

        if (photos.length === 0) {
            toast.error(
                "Harap tambahkan minimal 1 foto kendaraan",
                toastConfig
            );
            return;
        }

        const formData = new FormData();
        formData.append("code_trip", data.code_trip);
        formData.append("kendaraan_id", data.kendaraan_id);
        formData.append("driver_id", data.driver_id);
        formData.append("waktu_keberangkatan", data.waktu_keberangkatan);
        formData.append("tujuan", data.tujuan);
        formData.append("catatan", data.catatan);
        formData.append("km_awal", data.km_awal);
        formData.append("penumpang", data.penumpang);

        photos.forEach((photo, index) => {
            formData.append(`foto_kendaraan[${index}]`, photo);
        });

        setIsLoading(true);

        axios
            .post(route("trips.create"), formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            })
            .then((response) => {
                if (response.data.success) {
                    toast.success(response.data.message, toastConfig);

                    // Reset form
                    reset();
                    setPhotos([]);
                    setPreviewPhotos([]);
                    setShowPopup(false);

                    // Redirect ke halaman detail setelah toast muncul
                    setTimeout(() => {
                        window.location.href = route(
                            "trips.show",
                            response.data.trip.code_trip
                        );
                    }, 2000);
                }
            })
            .catch((error) => {
                console.error("Error:", error);
                toast.error(
                    error.response?.data?.message ||
                        "Terjadi kesalahan saat menambahkan trip",
                    toastConfig
                );
            })
            .finally(() => {
                setIsLoading(false);
            });
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
                km_awal: selectedKendaraan.km_awal,
                status: selectedKendaraan.status || "",
            });
        }
    };

    // Update fungsi startCamera untuk menggunakan facingMode
    const startCamera = async () => {
        try {
            setIsInitializingCamera(true);

            // Cek apakah browser mendukung getUserMedia
            if (
                !navigator.mediaDevices ||
                !navigator.mediaDevices.getUserMedia
            ) {
                throw new Error("Browser Anda tidak mendukung akses kamera");
            }

            // Cek device yang tersedia
            const devices = await navigator.mediaDevices.enumerateDevices();
            const videoDevices = devices.filter(
                (device) => device.kind === "videoinput"
            );

            if (videoDevices.length === 0) {
                throw new Error(
                    "Tidak ada kamera yang terdeteksi pada perangkat ini"
                );
            }

            console.log("Kamera yang tersedia:", videoDevices);

            const constraints = {
                video: {
                    facingMode: facingMode,
                    width: { ideal: 640 }, // Menurunkan resolusi lebih rendah
                    height: { ideal: 480 }, // untuk kompatibilitas lebih baik
                    frameRate: { ideal: 24 },
                },
                audio: false,
            };

            console.log(
                "Mencoba mengakses kamera dengan constraints:",
                constraints
            );

            const stream = await navigator.mediaDevices.getUserMedia(
                constraints
            );
            console.log(
                "Stream berhasil didapatkan:",
                stream.getVideoTracks()[0].getSettings()
            );

            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                streamRef.current = stream;

                videoRef.current.onerror = (error) => {
                    console.error("Video element error:", error);
                    stopCamera();
                };

                await new Promise((resolve) => {
                    videoRef.current.onloadedmetadata = () => {
                        videoRef.current
                            .play()
                            .then(resolve)
                            .catch((error) => {
                                console.error("Error saat play video:", error);
                                throw error;
                            });
                    };
                });

                setIsCameraOpen(true);
                console.log("Kamera berhasil diinisialisasi");
            } else {
                stream.getTracks().forEach((track) => track.stop());
                throw new Error("Video element tidak tersedia");
            }
        } catch (err) {
            console.error("Error detail:", err);
            let errorMessage = "Terjadi kesalahan saat mengakses kamera. ";

            switch (err.name) {
                case "NotAllowedError":
                    errorMessage =
                        "Mohon izinkan akses kamera pada browser Anda. Klik ikon kamera di address bar dan pilih 'Allow'.";
                    break;
                case "NotFoundError":
                    errorMessage =
                        "Tidak dapat menemukan perangkat kamera. Pastikan kamera terhubung dengan benar.";
                    break;
                case "NotReadableError":
                    errorMessage =
                        "Kamera sedang digunakan oleh aplikasi lain. Tutup aplikasi lain yang mungkin menggunakan kamera.";
                    break;
                case "OverconstrainedError":
                    errorMessage =
                        "Konfigurasi kamera tidak didukung. Mencoba dengan pengaturan yang lebih sederhana.";
                    // Bisa mencoba ulang dengan constraints yang lebih sederhana
                    break;
                case "SecurityError":
                    errorMessage =
                        "Akses kamera diblokir oleh kebijakan keamanan browser.";
                    break;
                default:
                    errorMessage +=
                        err.message ||
                        "Silakan coba refresh halaman atau gunakan browser yang berbeda.";
            }

            toast.error(errorMessage, toastConfig);
        } finally {
            setIsInitializingCamera(false);
        }
    };

    // Tambahkan fungsi fallback jika getUserMedia gagal
    const startCameraWithFallback = async () => {
        try {
            await startCamera();
        } catch (err) {
            console.error("Fallback: mencoba dengan constraints minimal");
            try {
                const minimalConstraints = {
                    video: true,
                    audio: false,
                };
                const stream = await navigator.mediaDevices.getUserMedia(
                    minimalConstraints
                );
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                    streamRef.current = stream;
                    setIsCameraOpen(true);
                }
            } catch (fallbackErr) {
                console.error("Fallback gagal:", fallbackErr);
                toast.error(
                    "Tidak dapat mengakses kamera sama sekali. Mohon periksa pengaturan browser Anda.",
                    toastConfig
                );
            }
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
    const { post: postCloseTrip, processing: processingCloseTrip } = useForm();

    const handleCloseTrip = (e) => {
        e.preventDefault();

        if (!selectedTrip) return;

        if (parseInt(kmAkhir) <= parseInt(selectedTrip.kendaraan.km_awal)) {
            toast.error(
                "Kilometer akhir harus lebih besar dari kilometer awal",
                toastConfig
            );
            return;
        }

        // Hitung jarak yang ditempuh
        const jarak =
            parseInt(kmAkhir) - parseInt(selectedTrip.kendaraan.km_awal);

        const formData = new FormData();
        formData.append("km_akhir", kmAkhir);
        formData.append(
            "waktu_kembali",
            dateFormat(new Date(), "yyyy-mm-dd'T'HH:MM:ss")
        );
        formData.append("jarak", jarak);
        formData.append("status", "Selesai");

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
                window.location.href = route(
                    "trips.show",
                    selectedTrip.code_trip
                );
            })
            .catch((error) => {
                console.error("Error:", error);
                toast.error(
                    "Gagal menutup trip: " +
                        (error.response?.data?.message || "Terjadi kesalahan"),
                    toastConfig
                );
            });
    };

    // Perbaiki fungsi handleGalleryUpload
    const handleGalleryUpload = () => {
        if (previewPhotos.length >= 5) {
            toast.error("Maksimal 5 foto yang dapat diunggah", toastConfig);
            return;
        }

        // Pastikan ref tersedia dan reset input
        if (fileInputRef.current) {
            fileInputRef.current.value = ""; // Reset input
            fileInputRef.current.removeAttribute("capture"); // Hapus attribute capture
            fileInputRef.current.setAttribute("accept", "image/*"); // Set accept attribute
            fileInputRef.current.click();
        }
    };

    // Pastikan handleFileUpload berfungsi dengan benar
    const handleFileUpload = (e) => {
        const files = Array.from(e.target.files);

        if (previewPhotos.length + files.length > 5) {
            toast.error("Maksimal 5 foto yang dapat diunggah", toastConfig);
            return;
        }

        // Validasi setiap file
        const validFiles = files.filter((file) => {
            if (!file.type.startsWith("image/")) {
                toast.error(
                    `${file.name} bukan file gambar yang valid`,
                    toastConfig
                );
                return false;
            }
            if (file.size > 5 * 1024 * 1024) {
                toast.error(
                    `${file.name} melebihi batas ukuran 5MB`,
                    toastConfig
                );
                return false;
            }
            return true;
        });

        // Update state photos dan preview
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

    // Tambahkan fungsi untuk menampilkan detail trip
    const handleShowDetail = (trip) => {
        setDetailTrip(trip);
        setShowDetailModal(true);
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
    const removePhotoClose = (index) => {
        setPhotos((prevPhotos) => prevPhotos.filter((_, i) => i !== index));
        setPreviewPhotos((prevPreviews) =>
            prevPreviews.filter((_, i) => i !== index)
        );
    };

    // Tambahkan fungsi handleCameraCapture
    const handleCameraCapture = () => {
        if (previewPhotos.length >= 5) {
            toast.error("Maksimal 5 foto yang dapat diunggah", toastConfig);
            return;
        }

        // Pastikan fileInputRef ada
        if (fileInputRef.current) {
            fileInputRef.current.value = ""; // Reset input
            fileInputRef.current.removeAttribute("capture"); // Hapus attribute capture
            fileInputRef.current.setAttribute("accept", "image/*"); // Set accept attribute
            fileInputRef.current.click();
        }
    };

    // Tambahkan state untuk menyimpan driver yang tersedia
    const driversAvailable = Array.isArray(drivers)
        ? drivers.filter((driver) => driver.status === "Tersedia")
        : [];

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
                                        className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-6 py-2.5 rounded-lg transition-all duration-200 font-medium shadow-sm hover:shadow-md"
                                    >
                                        <FaPlus className="text-lg" />
                                        <span>Tambah Data</span>
                                    </button>

                                    {/* Dropdown Export */}

                                    {auth.user.role === "admin" && (
                                        <div className="relative">
                                            <button
                                                onClick={() =>
                                                    setShowExportDropdown(
                                                        !showExportDropdown
                                                    )
                                                }
                                                className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white p-4 rounded-lg shadow-sm hover:shadow-md"
                                            >
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
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {item.status ===
                                                    "Sedang Berjalan" ? (
                                                        <button
                                                            onClick={() => {
                                                                setSelectedTrip(
                                                                    item
                                                                );
                                                                setCloseKendaraan(
                                                                    true
                                                                );
                                                            }}
                                                            type="button"
                                                            className="flex items-center gap-2 bg-teal-500 hover:bg-teal-600 text-white p-1.5 rounded-lg shadow-sm hover:shadow-md"
                                                        >
                                                            <FaCarSide />
                                                        </button>
                                                    ) : (
                                                        <span>
                                                            <FaCheck className="text-blue-500" />
                                                        </span>
                                                    )}
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
                                                    kendaraanTersediaStatus.map(
                                                        (kendaraan) => (
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
                                                        )
                                                    )}
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
                                                    value={data.km_awal}
                                                    onChange={(e) =>
                                                        setData(
                                                            "km_awal",
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
                                                {driversAvailable.map(
                                                    (driver) => (
                                                        <option
                                                            key={driver.id}
                                                            value={driver.id}
                                                        >
                                                            {driver.name} -{" "}
                                                            {
                                                                driver.phone_number
                                                            }
                                                        </option>
                                                    )
                                                )}
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
                                    {errors.foto_kendaraan && (
                                        <p className="mt-1 text-xs text-red-600">
                                            {errors.foto_kendaraan}
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
                    setCloseKendaraan(false);
                    setSelectedTrip(null);
                    setKmAkhir("");
                    setPhotos([]);
                    setPreviewPhotos([]);
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
                                        className="block w-full px-4 py-3 rounded-lg border-gray-300 dark:border-gray-600 dark:bg-[#515151] dark:text-white focus:border-blue-500 focus:ring-blue-500 transition-colors"
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
                                        className="block w-full px-4 py-3 rounded-lg border-gray-300 dark:border-gray-600 dark:bg-[#515151] dark:text-white focus:border-blue-500 focus:ring-blue-500 transition-colors"
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
                                        value={selectedTrip.kendaraan.km_awal}
                                        className="block w-full px-4 py-3 rounded-lg border-gray-300 dark:border-gray-600 dark:bg-[#515151] dark:text-white focus:border-blue-500 focus:ring-blue-500 transition-colors"
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
                                                                removePhotoClose(
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
