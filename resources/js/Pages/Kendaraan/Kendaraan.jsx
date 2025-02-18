import React, { useState, Fragment } from "react";
import DashboardLayout from "@/Layouts/DashboardLayout";
import { Head } from "@inertiajs/react";
import { router } from "@inertiajs/react";
import { Dialog, Transition } from "@headlessui/react";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";

export default function Kendaraan({ kendaraans }) {
    console.log(kendaraans);
    const [isOpen, setIsOpen] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [selectedKendaraan, setSelectedKendaraan] = useState(null);
    const [formData, setFormData] = useState({
        nama: "",
        jenis: "Mobil",
        plat_nomor: "",
        tahun_pembuatan: "",
        foto: null,
    });
    const [previewUrl, setPreviewUrl] = useState(null);

    const handleSubmit = (e) => {
        e.preventDefault();
        const data = new FormData();
        Object.keys(formData).forEach((key) => {
            if (formData[key] !== null) {
                data.append(key, formData[key]);
            }
        });

        if (isEdit) {
            router.post(`/kendaraan/${selectedKendaraan.id}`, {
                _method: "PUT",
                ...data,
            });
        } else {
            router.post("/kendaraan", data);
        }

        closeModal();
    };

    const handleDelete = (id) => {
        if (confirm("Apakah Anda yakin ingin menghapus kendaraan ini?")) {
            router.delete(`/kendaraan/${id}`);
        }
    };

    const openModal = (kendaraan = null) => {
        if (kendaraan) {
            setIsEdit(true);
            setSelectedKendaraan(kendaraan);
            setFormData({
                nama: kendaraan.nama,
                jenis: kendaraan.jenis,
                plat_nomor: kendaraan.plat,
                tahun_pembuatan: kendaraan.tahun,
                foto: null,
            });
            setPreviewUrl(kendaraan.image);
        } else {
            setIsEdit(false);
            setSelectedKendaraan(null);
            setFormData({
                nama: "",
                jenis: "Mobil",
                plat_nomor: "",
                tahun_pembuatan: "",
                foto: null,
            });
            setPreviewUrl(null);
        }
        setIsOpen(true);
    };

    const closeModal = () => {
        setIsOpen(false);
        setFormData({
            nama: "",
            jenis: "Mobil",
            plat_nomor: "",
            tahun_pembuatan: "",
            foto: null,
        });
        setPreviewUrl(null);
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData({ ...formData, foto: file });
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    return (
        <>
            <Head title="Kendaraan" />
            <DashboardLayout>
                <div className="container mx-auto p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-3xl font-bold text-gray-800 relative">
                            Daftar Kendaraan
                            <span className="absolute bottom-0 left-0 w-1/3 h-1 bg-blue-500 rounded-full"></span>
                        </h1>
                        <button
                            onClick={() => openModal()}
                            className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transform hover:scale-105 transition-all duration-200 flex items-center gap-2"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                                    clipRule="evenodd"
                                />
                            </svg>
                            Tambah Kendaraan
                        </button>
                    </div>

                    <div className="bg-white rounded-xl shadow-md overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Foto
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Nama
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Jenis
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Plat Nomor
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Tahun
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Status
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Trip Terakhir
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Aksi
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {kendaraans.map((kendaraan) => (
                                        <tr
                                            key={kendaraan.id}
                                            className="hover:bg-gray-50"
                                        >
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <img
                                                    src={
                                                        kendaraan.image ||
                                                        "/images/no-image.png"
                                                    }
                                                    alt={kendaraan.nama}
                                                    className="h-12 w-12 rounded-lg object-cover"
                                                />
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900">
                                                    {kendaraan.nama}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-100 text-purple-800">
                                                    {kendaraan.jenis}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {kendaraan.plat}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {kendaraan.tahun}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span
                                                    className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                        kendaraan.status ===
                                                        "Tersedia"
                                                            ? "bg-green-100 text-green-800"
                                                            : kendaraan.status ===
                                                              "Dalam Perjalanan"
                                                            ? "bg-blue-100 text-blue-800"
                                                            : "bg-red-100 text-red-800"
                                                    }`}
                                                >
                                                    {kendaraan.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {kendaraan.last_trip ? (
                                                    <div>
                                                        <div>
                                                            Tujuan:{" "}
                                                            {
                                                                kendaraan
                                                                    .last_trip
                                                                    .tujuan
                                                            }
                                                        </div>
                                                        <div className="text-xs text-gray-400">
                                                            {new Date(
                                                                kendaraan.last_trip.waktu
                                                            ).toLocaleDateString()}
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <span className="text-gray-400">
                                                        -
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <div className="flex space-x-2">
                                                    <button
                                                        onClick={() =>
                                                            openModal(kendaraan)
                                                        }
                                                        className="text-blue-600 hover:text-blue-900"
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() =>
                                                            handleDelete(
                                                                kendaraan.id
                                                            )
                                                        }
                                                        className="text-red-600 hover:text-red-900"
                                                    >
                                                        Hapus
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <Transition appear show={isOpen} as={Fragment}>
                    <Dialog
                        as="div"
                        className="relative z-50"
                        onClose={closeModal}
                    >
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0"
                            enterTo="opacity-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                        >
                            <div className="fixed inset-0 bg-black bg-opacity-25" />
                        </Transition.Child>

                        <div className="fixed inset-0 overflow-y-auto">
                            <div className="flex min-h-full items-center justify-center p-4 text-center">
                                <Transition.Child
                                    as={Fragment}
                                    enter="ease-out duration-300"
                                    enterFrom="opacity-0 scale-95"
                                    enterTo="opacity-100 scale-100"
                                    leave="ease-in duration-200"
                                    leaveFrom="opacity-100 scale-100"
                                    leaveTo="opacity-0 scale-95"
                                >
                                    <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                                        <Dialog.Title
                                            as="h3"
                                            className="text-lg font-medium leading-6 text-gray-900 mb-4"
                                        >
                                            {isEdit
                                                ? "Edit Kendaraan"
                                                : "Tambah Kendaraan Baru"}
                                        </Dialog.Title>

                                        <form
                                            onSubmit={handleSubmit}
                                            className="space-y-4"
                                        >
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">
                                                    Nama Kendaraan
                                                </label>
                                                <input
                                                    type="text"
                                                    value={formData.nama}
                                                    onChange={(e) =>
                                                        setFormData({
                                                            ...formData,
                                                            nama: e.target
                                                                .value,
                                                        })
                                                    }
                                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                                    required
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">
                                                    Jenis Kendaraan
                                                </label>
                                                <select
                                                    value={formData.jenis}
                                                    onChange={(e) =>
                                                        setFormData({
                                                            ...formData,
                                                            jenis: e.target
                                                                .value,
                                                        })
                                                    }
                                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                                >
                                                    <option value="Mobil">
                                                        Mobil
                                                    </option>
                                                    <option value="Motor">
                                                        Motor
                                                    </option>
                                                    <option value="Truk">
                                                        Truk
                                                    </option>
                                                    <option value="Bus">
                                                        Bus
                                                    </option>
                                                </select>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">
                                                    Nomor Plat
                                                </label>
                                                <input
                                                    type="text"
                                                    value={formData.plat_nomor}
                                                    onChange={(e) =>
                                                        setFormData({
                                                            ...formData,
                                                            plat_nomor:
                                                                e.target.value,
                                                        })
                                                    }
                                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                                    required
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">
                                                    Tahun Pembuatan
                                                </label>
                                                <input
                                                    type="number"
                                                    value={
                                                        formData.tahun_pembuatan
                                                    }
                                                    onChange={(e) =>
                                                        setFormData({
                                                            ...formData,
                                                            tahun_pembuatan:
                                                                e.target.value,
                                                        })
                                                    }
                                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                                    required
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">
                                                    Foto Kendaraan
                                                </label>
                                                <input
                                                    type="file"
                                                    onChange={handleImageChange}
                                                    className="mt-1 block w-full text-sm text-gray-500
                                                        file:mr-4 file:py-2 file:px-4
                                                        file:rounded-md file:border-0
                                                        file:text-sm file:font-semibold
                                                        file:bg-blue-50 file:text-blue-700
                                                        hover:file:bg-blue-100"
                                                    accept="image/*"
                                                />
                                                {previewUrl && (
                                                    <div className="mt-2">
                                                        <img
                                                            src={previewUrl}
                                                            alt="Preview"
                                                            className="h-32 w-auto rounded-lg object-cover"
                                                        />
                                                    </div>
                                                )}
                                            </div>

                                            <div className="mt-6 flex justify-end space-x-3">
                                                <button
                                                    type="button"
                                                    className="inline-flex justify-center rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                                                    onClick={closeModal}
                                                >
                                                    Batal
                                                </button>
                                                <button
                                                    type="submit"
                                                    className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                                                >
                                                    {isEdit
                                                        ? "Simpan Perubahan"
                                                        : "Tambah Kendaraan"}
                                                </button>
                                            </div>
                                        </form>
                                    </Dialog.Panel>
                                </Transition.Child>
                            </div>
                        </div>
                    </Dialog>
                </Transition>
            </DashboardLayout>
        </>
    );
}
