import DashboardLayout from "@/Layouts/DashboardLayout";
import { Head, useForm, router, Link } from "@inertiajs/react";
import React, { useState, useRef, useEffect } from "react";
import {
    FaCar,
    FaLock,
    FaIdCard,
    FaTachometerAlt,
    FaMapMarkerAlt,
    FaClock,
    FaUsers,
    FaUserTie,
    FaSave,
    FaSpinner,
    FaCalendarAlt,
    FaTimes,
    FaCamera,
    FaChevronLeft,
} from "react-icons/fa";
import { ToastContainer, toast, Flip } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

// Fungsi untuk format angka (contoh: 10000 -> 10.000)
const formatNumber = (num) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};

// Fungsi untuk membersihkan format angka (contoh: 10.000 -> 10000)
const cleanNumber = (formattedNum) => {
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

export default function CreateTripPage({ kendaraans, drivers, auth }) {
    const fileInputRef = useRef(null);
    const [photos, setPhotos] = useState([]); // Menyimpan File object
    const [previewPhotos, setPreviewPhotos] = useState([]); // Menyimpan URL preview
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [initialCode, setInitialCode] = useState(null);

    // Dapatkan code_trip awal saat komponen dimuat
    useEffect(() => {
        // Logika untuk membuat code_trip awal (misalnya V6VLJ8C6I6X)
        const generateCode = () => {
            const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
            let result = '';
            for (let i = 0; i < 11; i++) {
                if (i === 4 || i === 7) {
                    result += '-';
                } else {
                    result += characters.charAt(Math.floor(Math.random() * characters.length));
                }
            }
            return result.replace(/-/g, '').slice(0, 10); // Menghilangkan '-' jika ada di tengah atau sesudah
        };
        const generatedCode = generateCode();
        setInitialCode(generatedCode);
        setData('code_trip', generatedCode);
    }, []);


    // Inisialisasi useForm Inertia
    const { data, setData, post, processing, errors } = useForm({
        code_trip: '',
        kendaraan_id: '',
        driver_id: '',
        waktu_keberangkatan: getLocalDatetime(),
        tujuan: '',
        catatan: '',
        km: '',
        penumpang: '',
        lokasi: '',
        foto_berangkat: [], // Array untuk menampung file
    });
    
    
    const handleKmChange = (e) => {
        const rawValue = cleanNumber(e.target.value);
        
        // Hanya format jika nilai yang dimasukkan adalah angka
        if (!isNaN(rawValue) && rawValue !== '') {
            setData('km', formatNumber(rawValue));
        } else {
            setData('km', e.target.value);
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

    const handleFileUpload = async (e) => {
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
        setData('foto_berangkat', [...data.foto_berangkat, ...validFiles]);
    };

    const removePhoto = (index, url) => {
        // Hapus dari state files
        const newPhotos = photos.filter((_, i) => i !== index);
        setPhotos(newPhotos);
        // Hapus dari form data
        setData('foto_berangkat', newPhotos);
        // Hapus dari preview
        setPreviewPhotos(prev => prev.filter(previewUrl => previewUrl !== url));
        URL.revokeObjectURL(url); // Bersihkan URL object
    };
    
    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const handleDrop = (e) => {
        e.preventDefault();
        const droppedFiles = Array.from(e.dataTransfer.files);
        const input = { target: { files: droppedFiles } };
        handleFileUpload(input);
    };

    // --- Logika Submit Form ---
    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (photos.length === 0) {
            toast.error("Foto kendaraan wajib diunggah.");
            return;
        }
        
        setIsSubmitting(true);
        
        const postData = new FormData();
        // ... (append semua data ke postData seperti sebelumnya) ...
        postData.append('code_trip', data.code_trip);
        postData.append('kendaraan_id', data.kendaraan_id);
        postData.append('driver_id', data.driver_id);
        postData.append('waktu_keberangkatan', data.waktu_keberangkatan);
        postData.append('tujuan', data.tujuan);
        postData.append('catatan', data.catatan);
        postData.append('km', cleanNumber(data.km)); 
        postData.append('penumpang', data.penumpang);
        postData.append('lokasi', data.lokasi);
        photos.forEach((file) => {
            postData.append('foto_berangkat[]', file);
        });


        // 3. Kirim data menggunakan Inertia POST (lebih bersih)
        // KARENA INI MULTIPART/FORM-DATA, kita tetap pakai axios, tapi handle-nya lebih ketat
        axios.post(route('trips.store'), postData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        })
        .then(response => {
            // Blok ini idealnya tidak akan dipanggil karena server merespons 302
            // Tetapi jika dipanggil (misalnya response JSON 200), kita redirect
            router.visit(route('trips.index')); 
        })
        .catch(error => {
            // FOKUS DI SINI: Tangani 302 (Sukses) dan 422 (Validasi)
            
            // Cek 302 Redirect (SUKSES)
            if (error.response && error.response.status === 302) {
                const locationHeader = error.response.headers.location || error.response.headers.Location;
                if (locationHeader) {
                    router.visit(locationHeader); // Paksa Inertia memproses redirect ke trips.index
                    return;
                }
            }
            
            // Tangani Error Validasi (422) atau Server (500)
            const validationErrors = error.response?.data?.errors;
            if (validationErrors) {
                Object.values(validationErrors).flat().forEach(msg => toast.error(msg));
            } else {
                toast.error(error.response?.data?.message || 'Terjadi kesalahan saat menyimpan trip.');
            }
            
            // Set error Inertia
            if (error.response?.data?.errors) {
                 // ... (Logika set error Inertia untuk input) ...
            }
        })
        .finally(() => {
            setIsSubmitting(false);
        });
    };
    
    const handleKendaraanChange = (e) => {
        const selectedId = e.target.value;
        const selectedKendaraan = kendaraans.find(k => k.id == selectedId);
        if (selectedKendaraan) {
            setData('km', formatNumber(selectedKendaraan.km.toString()));
            setData('km_raw', selectedKendaraan.km.toString());
        }
        setData('kendaraan_id', selectedId);
    };


    return (
        <DashboardLayout user={auth.user}>
            <Head title="Tambah Trip Baru" />
            <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
                <div className="flex items-center mb-6">
                    <Link
                        href={route("trips.index")}
                        className="p-2 mr-3 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors"
                    >
                        <FaChevronLeft className="w-5 h-5" />
                    </Link>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Tambah Trip Baru</h1>
                </div>

                <div className="bg-white dark:bg-gray-800 shadow-xl sm:rounded-lg p-6">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Blok Kiri */}
                            <div className="space-y-6">
                                {/* Kode Trip & Waktu */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center mb-1">
                                            <FaLock className="mr-2" /> Kode Trip
                                        </label>
                                        <input
                                            type="text"
                                            value={data.code_trip}
                                            readOnly
                                            className="w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm opacity-70"
                                        />
                                        {errors.code_trip && <p className="text-sm text-red-500 mt-1">{errors.code_trip}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center mb-1">
                                            <FaCalendarAlt className="mr-2" /> Waktu Berangkat
                                        </label>
                                        <input
                                            type="datetime-local"
                                            value={data.waktu_keberangkatan}
                                            onChange={(e) => setData('waktu_keberangkatan', e.target.value)}
                                            required
                                            className="w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm"
                                        />
                                        {errors.waktu_keberangkatan && <p className="text-sm text-red-500 mt-1">{errors.waktu_keberangkatan}</p>}
                                    </div>
                                </div>

                                {/* Pilih Kendaraan */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center mb-1">
                                        <FaCar className="mr-2" /> Pilih Kendaraan
                                    </label>
                                    <select
                                        value={data.kendaraan_id}
                                        onChange={handleKendaraanChange}
                                        required
                                        className="w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm"
                                    >
                                        <option value="">-- Pilih Kendaraan --</option>
                                        {kendaraans.map((k) => (
                                            <option key={k.id} value={k.id}>
                                                {k.plat_kendaraan} - {k.merek} ({k.status})
                                            </option>
                                        ))}
                                    </select>
                                    {errors.kendaraan_id && <p className="text-sm text-red-500 mt-1">{errors.kendaraan_id}</p>}
                                </div>

                                {/* Merek & Plat Nomor */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center mb-1">
                                            <FaCar className="mr-2" /> Merek
                                        </label>
                                        <input
                                            type="text"
                                            value={kendaraans.find(k => k.id === data.kendaraan_id)?.merek || ''}
                                            readOnly
                                            className="w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm opacity-70"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center mb-1">
                                            <FaIdCard className="mr-2" /> Plat Nomor
                                        </label>
                                        <input
                                            type="text"
                                            value={kendaraans.find(k => k.id === data.kendaraan_id)?.plat_kendaraan || ''}
                                            readOnly
                                            className="w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm opacity-70"
                                        />
                                    </div>
                                </div>

                                {/* Kilometer Awal & Lokasi */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center mb-1">
                                            <FaTachometerAlt className="mr-2" /> Kilometer Awal
                                        </label>
                                        <input
                                            type="text"
                                            value={data.km}
                                            onChange={handleKmChange}
                                            required
                                            placeholder="Contoh: 43.041"
                                            className="w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm"
                                        />
                                        {errors.km && <p className="text-sm text-red-500 mt-1">{errors.km}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center mb-1">
                                            <FaMapMarkerAlt className="mr-2" /> Lokasi Keberangkatan
                                        </label>
                                        <select
                                            value={data.lokasi}
                                            onChange={(e) => setData('lokasi', e.target.value)}
                                            required
                                            className="w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm"
                                        >
                                            <option value="">-- Pilih Lokasi --</option>
                                            {/* Opsi Lokasi */}
                                            <option value="Karawang">Karawang</option>
                                            <option value="Purwakarta">Purwakarta</option>
                                        </select>
                                        {errors.lokasi && <p className="text-sm text-red-500 mt-1">{errors.lokasi}</p>}
                                    </div>
                                </div>

                                {/* Tujuan */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center mb-1">
                                        <FaMapMarkerAlt className="mr-2" /> Tujuan
                                    </label>
                                    <input
                                        type="text"
                                        value={data.tujuan}
                                        onChange={(e) => setData('tujuan', e.target.value)}
                                        required
                                        placeholder="Contoh: Cikao Kosambi Baru"
                                        className="w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm"
                                    />
                                    {errors.tujuan && <p className="text-sm text-red-500 mt-1">{errors.tujuan}</p>}
                                </div>

                                {/* Penumpang */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center mb-1">
                                        <FaUsers className="mr-2" /> Penumpang
                                    </label>
                                    <input
                                        type="text"
                                        value={data.penumpang}
                                        onChange={(e) => setData('penumpang', e.target.value)}
                                        placeholder="Masukkan nama penumpang"
                                        className="w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm"
                                    />
                                    {errors.penumpang && <p className="text-sm text-red-500 mt-1">{errors.penumpang}</p>}
                                </div>

                                {/* Driver */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center mb-1">
                                        <FaUserTie className="mr-2" /> Driver
                                    </label>
                                    <select
                                        value={data.driver_id}
                                        onChange={(e) => setData('driver_id', e.target.value)}
                                        required
                                        className="w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm"
                                    >
                                        <option value="">-- Pilih Driver --</option>
                                        {drivers.map((d) => (
                                            <option key={d.id} value={d.id}>
                                                {d.name} ({d.status})
                                            </option>
                                        ))}
                                    </select>
                                    {errors.driver_id && <p className="text-sm text-red-500 mt-1">{errors.driver_id}</p>}
                                </div>
                            </div>

                            {/* Blok Kanan */}
                            <div className="space-y-6">
                                {/* Foto Kendaraan */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Foto Kendaraan (Berangkat)</label>
                                    <div
                                        onClick={() => fileInputRef.current.click()}
                                        onDragOver={handleDragOver}
                                        onDrop={handleDrop}
                                        className={`w-full min-h-[150px] p-4 border-2 border-dashed rounded-lg flex flex-col items-center justify-center text-center cursor-pointer transition-colors ${
                                            photos.length < 5
                                                ? 'border-indigo-400 dark:border-indigo-600 bg-indigo-50 dark:bg-gray-900 hover:border-indigo-600'
                                                : 'border-green-400 dark:border-green-600 bg-green-50 dark:bg-gray-900'
                                        } ${errors.foto_berangkat ? 'border-red-500' : ''}`}
                                    >
                                        <FaCamera className="w-8 h-8 text-indigo-500 dark:text-indigo-400 mb-2" />
                                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                            {photos.length < 5 ? 'Upload file atau tarik & letakkan' : 'Batas maksimal 5 foto tercapai'}
                                        </p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                            PNG atau JPG hingga 5MB (Maksimal 5 foto)
                                        </p>
                                        <input
                                            type="file"
                                            ref={fileInputRef}
                                            onChange={handleFileUpload}
                                            accept="image/png, image/jpeg, image/jpg"
                                            multiple
                                            disabled={photos.length >= 5}
                                            className="hidden"
                                        />
                                    </div>
                                    {errors.foto_berangkat && <p className="text-sm text-red-500 mt-1">{errors.foto_berangkat}</p>}
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

                                {/* Catatan */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Catatan</label>
                                    <textarea
                                        rows="4"
                                        value={data.catatan}
                                        onChange={(e) => setData('catatan', e.target.value)}
                                        placeholder="Tambahkan catatan jika diperlukan..."
                                        className="w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm"
                                    />
                                    {errors.catatan && <p className="text-sm text-red-500 mt-1">{errors.catatan}</p>}
                                </div>
                            </div>
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
                                disabled={isSubmitting}
                                className="px-6 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-lg transition-colors flex items-center space-x-2 shadow-md hover:shadow-lg disabled:opacity-75 disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? (
                                    <FaSpinner className="w-4 h-4 animate-spin mr-2" />
                                ) : (
                                    <FaSave className="w-4 h-4 mr-2" />
                                )}
                                <span>{isSubmitting ? "Menyimpan..." : "Simpan Trip"}</span>
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