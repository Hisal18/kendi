import React from 'react';
import { Head, router } from '@inertiajs/react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import { FaCheckCircle, FaTimesCircle, FaClock, FaCalendarAlt, FaCar, FaUser, FaTachometerAlt, FaClipboardCheck } from 'react-icons/fa';
import { toast } from 'react-toastify';

export default function TripEditRequests({ pendingRequests }) {
    
    // Fungsi untuk membandingkan dan menandai perubahan
    const renderChange = (fieldName, oldValue, newValue) => {
        // Jika nilai sama, kembalikan nilai normal
        if (oldValue === newValue) {
            return <span className="text-gray-700 dark:text-gray-300">{newValue || '-'}</span>;
        }

        // Jika ada perubahan, tampilkan perbandingan dengan highlight
        return (
            <div className="flex flex-col text-sm">
                <span className="line-through text-red-500 dark:text-red-400">
                    Lama: {oldValue || '-'}
                </span>
                <span className="font-semibold text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/50 p-0.5 rounded">
                    Baru: {newValue || '-'}
                </span>
            </div>
        );
    };

    // Fungsi untuk menangani aksi (Approve/Reject)
    const handleAction = (request, action) => {
        if (!confirm(`Yakin ingin ${action === 'approve' ? 'MENYETUJUI' : 'MENOLAK'} perubahan trip ${request.trip.code_trip}?`)) {
            return;
        }

        const url = route(`admin.requests.${action}`, request.id);
        
        router.put(url, {}, {
            onSuccess: () => {
                toast.success(`Permintaan berhasil di${action === 'approve' ? 'setujui' : 'tolak'}!`);
            },
            onError: (errors) => {
                toast.error("Terjadi kesalahan saat memproses permintaan.");
                console.error(errors);
            },
        });
    };

    return (
        <DashboardLayout>
            <Head title="Persetujuan Perubahan Trip" />
            
            <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white flex items-center">
                <FaClipboardCheck className="mr-3 text-blue-500" /> Antrian Persetujuan Edit Trip ({pendingRequests.length})
            </h1>

            {pendingRequests.length === 0 ? (
                <div className="p-10 text-center bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                    <FaCheckCircle className="h-10 w-10 mx-auto text-green-500 mb-4" />
                    <p className="text-lg text-gray-600 dark:text-gray-300">Tidak ada permintaan edit trip yang tertunda saat ini.</p>
                </div>
            ) : (
                <div className="space-y-6">
                    {pendingRequests.map((request) => (
                        <div 
                            key={request.id} 
                            className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-md border-l-4 border-yellow-500 dark:border-yellow-700"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                                        Perubahan Trip: {request.trip.code_trip}
                                    </h2>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center mt-1">
                                        <FaUser className="mr-1.5" /> Diajukan oleh: {request.requested_by.name} pada {new Date(request.created_at).toLocaleString('id-ID')}
                                    </p>
                                </div>
                                <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded-full dark:bg-yellow-900/50 dark:text-yellow-300 flex items-center">
                                    <FaClock className="mr-1" /> PENDING
                                </span>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t pt-4 border-gray-200 dark:border-gray-700">
                                
                                {/* Kolom 1: Informasi Kendaraan/Driver/Tujuan/Catatan */}
                                <div className="space-y-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-md">
                                <h3 className="font-medium text-gray-900 dark:text-white flex items-center"><FaCar className="mr-2 text-blue-500"/> Detail Umum</h3>
                                
                                {/* Perubahan Kendaraan */}
                                <div className="text-sm">
                                    <p className="text-gray-500 dark:text-gray-400">Kendaraan (Plat):</p>
                                    {renderChange('kendaraan_plat', request.old_data.kendaraan_plat || request.trip.kendaraan?.plat_kendaraan, request.new_data.kendaraan_plat)}
                                </div>

                                {/* Perubahan Driver */}
                                <div className="text-sm">
                                    <p className="text-gray-500 dark:text-gray-400">Driver:</p>
                                    {renderChange('driver_name', request.old_data.driver_name || request.trip.driver?.name, request.new_data.driver_name)}
                                </div>

                                {/* Perubahan Penumpang */}
                                <div className="text-sm">
                                    <p className="text-gray-500 dark:text-gray-400">Penumpang:</p>
                                    {renderChange('penumpang', request.old_data.penumpang, request.new_data.penumpang)}
                                </div>

                                {/* Perubahan Tujuan */}
                                <div className="text-sm">
                                    <p className="text-gray-500 dark:text-gray-400">Tujuan:</p>
                                    {renderChange('tujuan', request.old_data.tujuan, request.new_data.tujuan)}
                                </div>
                                
                                {/* Perubahan Catatan */}
                                <div className="text-sm">
                                    <p className="text-gray-500 dark:text-gray-400">Catatan:</p>
                                    {renderChange('catatan', request.old_data.catatan, request.new_data.catatan)}
                                </div>

                            </div>

                                {/* Kolom 2: Informasi Waktu */}
                                <div className="space-y-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-md">
                                    <h3 className="font-medium text-gray-900 dark:text-white flex items-center"><FaCalendarAlt className="mr-2 text-green-500"/> Waktu</h3>
                                    <div className="text-sm">
                                        <p className="text-gray-500 dark:text-gray-400">Berangkat:</p>
                                        {renderChange('waktu_keberangkatan', new Date(request.old_data.waktu_keberangkatan).toLocaleString('id-ID'), new Date(request.new_data.waktu_keberangkatan).toLocaleString('id-ID'))}
                                    </div>
                                    <div className="text-sm">
                                        <p className="text-gray-500 dark:text-gray-400">Kembali:</p>
                                        {renderChange('waktu_kembali', new Date(request.old_data.waktu_kembali).toLocaleString('id-ID'), new Date(request.new_data.waktu_kembali).toLocaleString('id-ID'))}
                                    </div>
                                </div>

                                {/* Kolom 3: Kilometer (KRITIS) */}
                                <div className="space-y-3 p-3 bg-red-50 dark:bg-red-900/20 rounded-md border border-red-300 dark:border-red-600">
                                    <h3 className="font-medium text-red-800 dark:text-red-300 flex items-center"><FaTachometerAlt className="mr-2"/> Kilometer (Kritis)</h3>
                                    <div className="text-sm">
                                        <p className="text-gray-500 dark:text-gray-400">KM Awal:</p>
                                        {renderChange('km_awal', request.old_data.km_awal, request.new_data.km_awal)}
                                    </div>
                                    <div className="text-sm">
                                        <p className="text-gray-500 dark:text-gray-400">KM Akhir:</p>
                                        {renderChange('km_akhir', request.old_data.km_akhir, request.new_data.km_akhir)}
                                    </div>
                                </div>

                            </div>
                            
                            {/* Tombol Aksi */}
                            <div className="mt-5 pt-4 border-t border-gray-200 dark:border-gray-700 flex justify-end space-x-3">
                                <button
                                    onClick={() => handleAction(request, 'reject')}
                                    className="px-4 py-2 text-sm font-medium text-red-700 bg-red-100 rounded-lg hover:bg-red-200 dark:bg-red-900/50 dark:text-red-300 dark:hover:bg-red-900 flex items-center transition-colors"
                                >
                                    <FaTimesCircle className="mr-2" /> Tolak Perubahan
                                </button>
                                <button
                                    onClick={() => handleAction(request, 'approve')}
                                    className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 flex items-center transition-colors"
                                >
                                    <FaCheckCircle className="mr-2" /> Setujui Perubahan
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </DashboardLayout>
    );
}