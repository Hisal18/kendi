import DashboardLayout from "@/Layouts/DashboardLayout";
import { Head, useForm, router, Link } from "@inertiajs/react";
import React, { useState, useRef, useEffect } from "react";
import {
    FaCar,
    FaIdCard,
    FaTachometerAlt,
    FaSave,
    FaSpinner,
    FaCalendarCheck,
    FaCamera,
    FaChevronLeft,
    FaTimes,
    FaRoad
} from "react-icons/fa";
import { ToastContainer, toast, Flip } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

// Fungsi untuk format angka (contoh: 10000 -> 10.000)
const formatNumber = (num) => {
    if (num === null || num === undefined) return '';
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};

// Fungsi untuk membersihkan format angka (contoh: 10.000 -> 10000)
const cleanNumber = (formattedNum) => {
    if (typeof formattedNum !== 'string') return formattedNum;
    return formattedNum.replace(/\./g, '');
};

const getLocalDatetime = () => {
    const now = new Date();
    // Tambahkan offset zona waktu lokal (dalam menit) ke waktu saat ini
    const offset = now.getTimezoneOffset() * 60000;
    const localIso = new Date(now.getTime() - offset).toISOString();
    // Ambil format YYYY-MM-DDThh:mm
    return localIso.slice(0, 16);
};

export default function CloseTripPage({ trip, auth }) {
    const fileInputRefClose = useRef(null);
    const [photos, setPhotos] = useState([]); // Menyimpan File object
    const [previewPhotos, setPreviewPhotos] = useState([]); // Menyimpan URL preview
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    // Inisialisasi useForm Inertia
    const { data, setData, post, processing, errors, setError, clearErrors } = useForm({
        km_akhir: formatNumber(trip.km_awal), // Inisialisasi dengan KM Awal
        km_awal: trip.km_awal, // Simpan KM Awal untuk perhitungan
        waktu_kembali: getLocalDatetime(),
        jarak: 0,
        foto_kembali: [], // Array untuk menampung file
    });
    
    // --- Logika Perhitungan Jarak ---
    const kmAkhirClean = cleanNumber(data.km_akhir);
    useEffect(() => {
        const kmAwal = parseFloat(data.km_awal);
        const kmAkhir = parseFloat(cleanNumber(data.km_akhir));
        
        if (!isNaN(kmAwal) && !isNaN(kmAkhir)) {
            const jarak = Math.max(0, kmAkhir - kmAwal);
            setData('jarak', jarak);
            
            if (kmAkhir < kmAwal) {
                setError('km_akhir', `Kilometer Akhir harus lebih besar dari Kilometer Awal (${formatNumber(kmAwal)} KM)`);
            } else {
                clearErrors('km_akhir');
            }
        }
    }, [data.km_akhir, data.km_awal, setError, clearErrors]);
    
    
    // --- Logika Input KM Akhir ---
    const handleKmAkhirChange = (e) => {
        const rawValue = cleanNumber(e.target.value);
        
        // Hanya format jika nilai yang dimasukkan adalah angka
        if (!isNaN(rawValue) && rawValue !== '') {
            setData('km_akhir', formatNumber(rawValue));
        } else {
            setData('km_akhir', e.target.value);
        }
    };

    // --- Logika Upload Foto (Pindahkan dari Trip.jsx lama) ---
    const compressAndConvertImage = (file) => {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = (event) => {
                const img = new Image();
                img.src = event.target.result;
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    const MAX_WIDTH = 1024;
                    const MAX_HEIGHT = 1024;
                    let width = img.width;
                    let height = img.height;

                    if (width > height) {
                        if (width > MAX_WIDTH) {
                            height *= MAX_WIDTH / width;
                            width = MAX_WIDTH;
                        }
                    } else {
                        if (height > MAX_HEIGHT) {
                            width *= MAX_HEIGHT / height;
                            height = MAX_HEIGHT;
                        }
                    }
                    canvas.width = width;
                    canvas.height = height;
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0, width, height);

                    canvas.toBlob((blob) => {
                        const compressedFile = new File([blob], file.name, {
                            type: 'image/jpeg',
                            lastModified: Date.now(),
                        });
                        resolve(compressedFile);
                    }, 'image/jpeg', 0.8); // Kualitas 80%
                };
            };
        });
    };

    const handleFileUploadClose = async (e) => {
        const files = Array.from(e.target.files);
        let validFiles = [];

        if (photos.length + files.length > 5) {
            toast.error("Maksimal 5 foto per trip.");
            return;
        }

        for (const file of files) {
            if (file.size > 5 * 1024 * 1024) {
                toast.error(`Ukuran file ${file.name} melebihi batas 5MB.`);
                continue;
            }
            if (!['image/png', 'image/jpeg', 'image/jpg'].includes(file.type)) {
                toast.error(`Format file ${file.name} tidak didukung. Gunakan PNG atau JPG.`);
                continue;
            }
            // Kompresi gambar
            const compressedFile = await compressAndConvertImage(file);
            validFiles.push(compressedFile);

            // Buat preview URL
            const previewURL = URL.createObjectURL(compressedFile);
            setPreviewPhotos(prev => [...prev, previewURL]);
        }

        setPhotos(prev => [...prev, ...validFiles]);
        setData('foto_kembali', [...data.foto_kembali, ...validFiles]);
    };

    const removePhoto = (index, url) => {
        // Hapus dari state files
        const newPhotos = photos.filter((_, i) => i !== index);
        setPhotos(newPhotos);
        // Hapus dari form data
        setData('foto_kembali', newPhotos);
        // Hapus dari preview
        setPreviewPhotos(prev => prev.filter(previewUrl => previewUrl !== url));
        URL.revokeObjectURL(url); // Bersihkan URL object
    };
    
    // --- Logika Submit Form ---
    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (photos.length === 0) {
            toast.error("Foto kendaraan kembali wajib diunggah.");
            return;
        }
        if (errors.km_akhir) {
            toast.error(errors.km_akhir);
            return;
        }
        
        setIsSubmitting(true);
        
        const postData = new FormData();
        postData.append('km_akhir', cleanNumber(data.km_akhir)); 
        postData.append('waktu_kembali', data.waktu_kembali);
        postData.append('jarak', data.jarak);

        photos.forEach((file) => {
            postData.append('foto_kembali[]', file);
        });
        
        // POST menggunakan axios karena ada file, dan Inertia tidak menangani multipart/form-data dengan baik
        axios.post(route('trips.close.submit', trip.code_trip), postData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                // Tambahkan method override karena rutenya POST, tapi logicnya UPDATE
                'X-HTTP-Method-Override': 'POST' 
            },
        })
        .then(response => {
            const successMsg = response.data.message || 'Trip berhasil ditutup';
            toast.success(successMsg);
            // Arahkan ke halaman detail trip
            router.get(route('trips.show', trip.code_trip)); 
        })
        .catch(error => {
            const errorMsg = error.response?.data?.message || 'Gagal menutup trip.';
            const validationErrors = error.response?.data?.errors;
            
            if (validationErrors) {
                // Tampilkan error validasi dari Laravel
                Object.values(validationErrors).flat().forEach(msg => toast.error(msg));
            } else {
                toast.error(errorMsg);
            }
            
            // Set error Inertia untuk menampilkan di input
            if (error.response?.data?.errors) {
                Object.keys(error.response.data.errors).forEach(key => {
                    // Hanya set error jika field tersebut ada di useForm
                    if (key in errors) {
                        errors[key] = error.response.data.errors[key][0];
                    }
                });
            }
        })
        .finally(() => {
            setIsSubmitting(false);
        });
    };

    return (
        <DashboardLayout user={auth.user}>
            <Head title={`Tutup Trip ${trip.code_trip}`} />
            <div className="max-w-3xl mx-auto p-4 sm:p-6 lg:p-8">
                <div className="flex items-center mb-6">
                    <Link
                        href={route("trips.index")}
                        className="p-2 mr-3 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors"
                    >
                        <FaChevronLeft className="w-5 h-5" />
                    </Link>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Tutup Trip: {trip.code_trip}</h1>
                </div>

                <div className="bg-white dark:bg-gray-800 shadow-xl sm:rounded-lg p-6">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Data Trip yang Sedang Berjalan */}
                        <div className="grid grid-cols-2 gap-4 border-b pb-4 mb-4 border-gray-200 dark:border-gray-700">
                            <div>
                                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">Kode Trip</label>
                                <p className="text-lg font-semibold text-gray-900 dark:text-white">{trip.code_trip}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">Plat Kendaraan</label>
                                <p className="text-lg font-semibold text-gray-900 dark:text-white">{trip.kendaraan.plat_kendaraan}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">Kilometer Awal</label>
                                <p className="text-lg font-semibold text-gray-900 dark:text-white">{formatNumber(trip.km_awal)} KM</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">Driver</label>
                                <p className="text-lg font-semibold text-gray-900 dark:text-white">{trip.driver?.name || 'N/A'}</p>
                            </div>
                        </div>
                        
                        {/* Form Penutupan */}
                        <div className="space-y-4">
                            {/* KM Akhir & Waktu Kembali */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center mb-1">
                                        <FaTachometerAlt className="mr-2" /> Kilometer Akhir
                                    </label>
                                    <input
                                        type="text"
                                        value={data.km_akhir}
                                        onChange={handleKmAkhirChange}
                                        required
                                        placeholder={`Harus lebih besar dari ${formatNumber(trip.km_awal)}`}
                                        className={`w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm ${errors.km_akhir ? 'border-red-500' : ''}`}
                                    />
                                    {errors.km_akhir && <p className="text-sm text-red-500 mt-1">{errors.km_akhir}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center mb-1">
                                        <FaCalendarCheck className="mr-2" /> Waktu Kembali
                                    </label>
                                    <input
                                        type="datetime-local"
                                        value={data.waktu_kembali}
                                        onChange={(e) => setData('waktu_kembali', e.target.value)}
                                        required
                                        className="w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm"
                                    />
                                    {errors.waktu_kembali && <p className="text-sm text-red-500 mt-1">{errors.waktu_kembali}</p>}
                                </div>
                            </div>
                            
                            {/* Jarak Tempuh */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center mb-1">
                                    <FaRoad className="mr-2" /> Jarak Tempuh (Otomatis)
                                </label>
                                <input
                                    type="text"
                                    value={formatNumber(data.jarak)}
                                    readOnly
                                    className="w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm opacity-70"
                                />
                            </div>

                            {/* Foto Kendaraan Kembali */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Foto Kendaraan Kembali</label>
                                <div
                                    onClick={() => fileInputRefClose.current.click()}
                                    className={`w-full min-h-[150px] p-4 border-2 border-dashed rounded-lg flex flex-col items-center justify-center text-center cursor-pointer transition-colors ${
                                        photos.length < 5
                                            ? 'border-indigo-400 dark:border-indigo-600 bg-indigo-50 dark:bg-gray-900 hover:border-indigo-600'
                                            : 'border-green-400 dark:border-green-600 bg-green-50 dark:bg-gray-900'
                                    } ${errors.foto_kembali ? 'border-red-500' : ''}`}
                                >
                                    <FaCamera className="w-8 h-8 text-indigo-500 dark:text-indigo-400 mb-2" />
                                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Ambil Foto / Upload file
                                    </p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                        PNG atau JPG hingga 5MB (Maksimal 5 foto)
                                    </p>
                                    <input
                                        type="file"
                                        ref={fileInputRefClose}
                                        onChange={handleFileUploadClose}
                                        accept="image/png, image/jpeg, image/jpg"
                                        multiple
                                        disabled={photos.length >= 5}
                                        className="hidden"
                                    />
                                </div>
                                {errors.foto_kembali && <p className="text-sm text-red-500 mt-1">{errors.foto_kembali}</p>}
                            </div>
                            
                            {/* Preview Foto */}
                            {previewPhotos.length > 0 && (
                                <div className="flex flex-wrap gap-3">
                                    {previewPhotos.map((url, index) => (
                                        <div key={url} className="relative w-24 h-24 rounded-lg overflow-hidden border border-gray-300 dark:border-gray-700 shadow-md">
                                            <img src={url} alt={`Preview ${index + 1}`} className="w-full h-full object-cover" />
                                            <button
                                                type="button"
                                                onClick={() => removePhoto(index, url)}
                                                className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 text-xs hover:bg-red-700 transition-colors"
                                            >
                                                <FaTimes />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="flex justify-end pt-4 border-t border-gray-200 dark:border-gray-700">
                            <Link
                                href={route("trips.index")}
                                className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors mr-3"
                            >
                                Batal
                            </Link>
                            <button
                                type="submit"
                                disabled={isSubmitting || errors.km_akhir || photos.length === 0}
                                className="px-6 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-lg transition-colors flex items-center space-x-2 shadow-md hover:shadow-lg disabled:opacity-75 disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? (
                                    <FaSpinner className="w-4 h-4 animate-spin mr-2" />
                                ) : (
                                    <FaSave className="w-4 h-4 mr-2" />
                                )}
                                <span>{isSubmitting ? "Menyimpan..." : "Simpan"}</span>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
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
                theme="light" // Sesuaikan dengan tema Anda
                transition={Flip}
            />
        </DashboardLayout>
    );
}