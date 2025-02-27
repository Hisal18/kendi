import React from "react";
import DashboardLayout from "@/Layouts/DashboardLayout";
import { Head } from "@inertiajs/react";
import { useState, useEffect } from "react";
import { router } from "@inertiajs/react";
import Modal from "@/Components/Modal";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import {
    FaEdit,
    FaTrash,
    FaUserPlus,
    FaUser,
    FaSearch,
    FaChevronLeft,
    FaChevronRight,
    FaEllipsisH,
    FaEllipsisV,
} from "react-icons/fa";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Menu } from "@headlessui/react";

export default function Driver({ drivers: initialDrivers }) {
    const [showModal, setShowModal] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [data, setData] = useState({
        id: "",
        name: "",
        phone_number: "",
        status: "Tersedia",
    });
    const [errors, setErrors] = useState({});
    const [drivers, setDrivers] = useState(initialDrivers);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;
    const [activeDropdown, setActiveDropdown] = useState(null);
    const [menuPosition, setMenuPosition] = useState({});

    // Konfigurasi toast
    const toastConfig = {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (isEdit) {
            router.put(`/driver/${data.id}`, data, {
                onSuccess: () => {
                    // Update data lokal setelah berhasil edit
                    setDrivers((prevDrivers) =>
                        prevDrivers.map((driver) =>
                            driver.id === data.id
                                ? { ...driver, ...data }
                                : driver
                        )
                    );

                    setShowModal(false);
                    setIsEdit(false);
                    setData({
                        id: "",
                        name: "",
                        phone_number: "",
                        status: "Tersedia",
                    });
                    toast.success("Data berhasil diperbarui", toastConfig);
                },
                onError: (errors) => {
                    setErrors(errors);
                    toast.error("Gagal memperbarui data", toastConfig);
                },
            });
        } else {
            router.post("/driver", data, {
                onSuccess: (response) => {
                    // Update data lokal setelah berhasil tambah
                    setDrivers((prevDrivers) => [
                        ...prevDrivers,
                        response.props.driver,
                    ]);

                    setShowModal(false);
                    setData({
                        id: "",
                        name: "",
                        phone_number: "",
                        status: "Tersedia",
                    });
                    toast.success("Data berhasil ditambahkan", toastConfig);
                },
                onError: (errors) => {
                    setErrors(errors);
                    toast.error("Gagal menambahkan data", toastConfig);
                },
            });
        }
    };

    const handleEdit = (driver) => {
        setIsEdit(true);
        setData({
            id: driver.id,
            name: driver.name,
            phone_number: driver.phone_number,
            status: driver.status,
        });
        setShowModal(true);
    };

    const handleDelete = (id) => {
        if (confirm("Apakah Anda yakin ingin menghapus data ini?")) {
            router.delete(`/driver/${id}`, {
                onSuccess: () => {
                    toast.success("Data berhasil dihapus", toastConfig);
                },
                onError: () => {
                    toast.error("Gagal menghapus data", toastConfig);
                },
            });
        }
    };

    // Filter data berdasarkan pencarian
    const filteredDrivers = drivers.filter(
        (driver) =>
            driver.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            driver.phone_number
                .toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
            driver.status.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Hitung total halaman
    const totalPages = Math.ceil(filteredDrivers.length / itemsPerPage);

    // Get current items
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredDrivers.slice(
        indexOfFirstItem,
        indexOfLastItem
    );

    // Fungsi untuk pagination
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    // Reset halaman saat pencarian
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm]);

    // Fungsi untuk generate nomor halaman
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

            if (start > 2) pages.push("...");

            for (let i = start; i <= end; i++) {
                pages.push(i);
            }

            if (end < totalPages - 1) pages.push("...");
            if (totalPages > 1) pages.push(totalPages);
        }
        return pages;
    };

    // Hitung statistik driver
    const totalDriver = drivers.length;
    const driverTersedia = drivers.filter(
        (d) => d.status === "Tersedia"
    ).length;
    const driverBertugas = drivers.filter(
        (d) => d.status === "Sedang Bertugas"
    ).length;
    const driverCuti = drivers.filter((d) => d.status === "Cuti").length;

    // Tambahkan fungsi untuk menghitung posisi menu
    const calculateMenuPosition = (event, driverId) => {
        const button = event.currentTarget;
        const buttonRect = button.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        const bottomSpace = viewportHeight - buttonRect.bottom;

        setMenuPosition({
            [driverId]: bottomSpace < 200 ? "top" : "bottom",
        });
    };

    return (
        <>
            <Head title="Driver" />
            <DashboardLayout>
                <div className="py-0">
                    <div className="mb-4 text-white">
                        <h1 className="text-3xl font-bold mb-2 text-gray-500 dark:text-gray-400">
                            Pengelolaan Driver
                        </h1>
                        <p className="opacity-90 text-gray-700 dark:text-gray-500">
                            Data driver wilayah UPT Karawang
                        </p>
                    </div>
                    <div className="w-full mx-auto sm:px-6 lg:px-0">
                        {/* Statistik Card */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                            <div className="bg-white dark:bg-[#313131] rounded-xl p-6 shadow-lg transform transition-all duration-300 hover:scale-105">
                                <div className="flex items-center space-x-4">
                                    <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-full">
                                        <FaUser className="text-blue-500 dark:text-blue-400 text-xl" />
                                    </div>
                                    <div>
                                        <h3 className="text-gray-500 dark:text-gray-400 text-sm">
                                            Total Driver
                                        </h3>
                                        <p className="text-2xl font-bold text-gray-800 dark:text-white">
                                            {totalDriver}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white dark:bg-[#313131] rounded-xl p-6 shadow-lg transform transition-all duration-300 hover:scale-105">
                                <div className="flex items-center space-x-4">
                                    <div className="bg-emerald-100 dark:bg-emerald-900 p-3 rounded-full">
                                        <FaUser className="text-emerald-500 dark:text-emerald-400 text-xl" />
                                    </div>
                                    <div>
                                        <h3 className="text-gray-500 dark:text-gray-400 text-sm">
                                            Driver Tersedia
                                        </h3>
                                        <p className="text-2xl font-bold text-gray-800 dark:text-white">
                                            {driverTersedia}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white dark:bg-[#313131] rounded-xl p-6 shadow-lg transform transition-all duration-300 hover:scale-105">
                                <div className="flex items-center space-x-4">
                                    <div className="bg-amber-100 dark:bg-amber-900 p-3 rounded-full">
                                        <FaUser className="text-amber-500 dark:text-amber-400 text-xl" />
                                    </div>
                                    <div>
                                        <h3 className="text-gray-500 dark:text-gray-400 text-sm">
                                            Driver Bertugas
                                        </h3>
                                        <p className="text-2xl font-bold text-gray-800 dark:text-white">
                                            {driverBertugas}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white dark:bg-[#313131] rounded-xl p-6 shadow-lg transform transition-all duration-300 hover:scale-105">
                                <div className="flex items-center space-x-4">
                                    <div className="bg-rose-100 dark:bg-rose-900 p-3 rounded-full">
                                        <FaUser className="text-rose-500 dark:text-rose-400 text-xl" />
                                    </div>
                                    <div>
                                        <h3 className="text-gray-500 dark:text-gray-400 text-sm">
                                            Tidak Hadir
                                        </h3>
                                        <p className="text-2xl font-bold text-gray-800 dark:text-white">
                                            {driverCuti}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-[#2C2C2C] overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="flex flex-col md:flex-row justify-between items-center p-6 space-y-4 md:space-y-0">
                                <div className="relative w-full md:w-64">
                                    <input
                                        type="text"
                                        placeholder="Cari driver..."
                                        value={searchTerm}
                                        onChange={(e) =>
                                            setSearchTerm(e.target.value)
                                        }
                                        className="w-full px-4 py-2 pl-10 pr-4 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-[#515151] dark:text-white focus:border-blue-500 focus:ring focus:ring-blue-200 transition duration-200"
                                    />
                                    <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                </div>

                                <button
                                    onClick={() => {
                                        setIsEdit(false);
                                        setShowModal(true);
                                    }}
                                    className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition duration-200 w-full md:w-auto justify-center"
                                >
                                    <FaUserPlus />
                                    Tambah Driver
                                </button>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="min-w-full">
                                    <thead className="bg-gray-50 dark:bg-[#515151]">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                No
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                Nama
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                No. Telepon
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                Status
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                Aksi
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white dark:bg-[#2C2C2C] ">
                                        {currentItems.map((driver, index) => (
                                            <tr
                                                key={driver.id}
                                                className="hover:bg-gray-50 dark:hover:bg-[#717171] transition-colors duration-200"
                                            >
                                                <td className="px-6 py-4  whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                                                    {indexOfFirstItem +
                                                        index +
                                                        1}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-gray-900 dark:text-white">
                                                    {driver.name}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-gray-900 dark:text-white">
                                                    {driver.phone_number}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span
                                                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                                            ${
                                                                driver.status ===
                                                                "Tersedia"
                                                                    ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                                                                    : driver.status ===
                                                                      "Sedang Bertugas"
                                                                    ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
                                                                    : "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300"
                                                            }`}
                                                    >
                                                        {driver.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm relative">
                                                    <Menu
                                                        as="div"
                                                        className="relative inline-block text-left"
                                                    >
                                                        <Menu.Button
                                                            onClick={(e) =>
                                                                calculateMenuPosition(
                                                                    e,
                                                                    driver.id
                                                                )
                                                            }
                                                            className="inline-flex items-center justify-center p-2 rounded-md hover:bg-gray-100 dark:hover:bg-[#313131] transition-colors duration-200"
                                                        >
                                                            <FaEllipsisV className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                                                        </Menu.Button>
                                                        <Menu.Items
                                                            className={`absolute ${
                                                                menuPosition[
                                                                    driver.id
                                                                ] === "top"
                                                                    ? "bottom-full mb-2"
                                                                    : "top-full mt-2"
                                                            } right-0 w-48 sm:w-56 divide-y divide-gray-100 rounded-lg bg-white dark:bg-[#313131] shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50`}
                                                        >
                                                            <div className="py-1">
                                                                <Menu.Item>
                                                                    {({
                                                                        active,
                                                                    }) => (
                                                                        <button
                                                                            onClick={() =>
                                                                                handleEdit(
                                                                                    driver
                                                                                )
                                                                            }
                                                                            className={`${
                                                                                active
                                                                                    ? "bg-gray-100 dark:bg-[#414141] text-gray-900 dark:text-white"
                                                                                    : "text-gray-700 dark:text-gray-200"
                                                                            } flex w-full items-center px-3 sm:px-4 py-2 text-xs sm:text-sm transition-colors duration-150`}
                                                                        >
                                                                            <FaEdit className="mr-2 sm:mr-3 h-3 w-3 sm:h-4 sm:w-4" />
                                                                            Edit
                                                                            Driver
                                                                        </button>
                                                                    )}
                                                                </Menu.Item>
                                                                <Menu.Item>
                                                                    {({
                                                                        active,
                                                                    }) => (
                                                                        <button
                                                                            onClick={() =>
                                                                                handleDelete(
                                                                                    driver.id
                                                                                )
                                                                            }
                                                                            className={`${
                                                                                active
                                                                                    ? "bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300"
                                                                                    : "text-red-600 dark:text-red-400"
                                                                            } flex w-full items-center px-3 sm:px-4 py-2 text-xs sm:text-sm transition-colors duration-150`}
                                                                        >
                                                                            <FaTrash className="mr-2 sm:mr-3 h-3 w-3 sm:h-4 sm:w-4" />
                                                                            Hapus
                                                                            Driver
                                                                        </button>
                                                                    )}
                                                                </Menu.Item>
                                                            </div>
                                                        </Menu.Items>
                                                    </Menu>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination */}
                            <div className="flex flex-col sm:flex-row justify-between items-center p-6 gap-4">
                                <div className="w-full sm:w-auto">
                                    <div className="flex items-center justify-center sm:justify-start text-sm text-gray-500 dark:text-gray-400">
                                        Menampilkan{" "}
                                        <span className="font-medium mx-1">
                                            {indexOfFirstItem + 1}
                                        </span>
                                        sampai{" "}
                                        <span className="font-medium mx-1">
                                            {Math.min(
                                                indexOfLastItem,
                                                filteredDrivers.length
                                            )}
                                        </span>
                                        dari{" "}
                                        <span className="font-medium mx-1">
                                            {filteredDrivers.length}
                                        </span>{" "}
                                        data
                                    </div>
                                </div>
                                <div className="justify-end">
                                    <div className="flex items-center space-x-2">
                                        <button
                                            onClick={() =>
                                                paginate(currentPage - 1)
                                            }
                                            disabled={currentPage === 1}
                                            className={`flex items-center justify-center w-10 h-10 rounded-full ${
                                                currentPage === 1
                                                    ? "text-gray-400 dark:text-gray-600 cursor-not-allowed"
                                                    : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#313131]"
                                            } transition-colors duration-200`}
                                        >
                                            <FaChevronLeft className="w-4 h-4" />
                                        </button>

                                        <div className="flex items-center space-x-1">
                                            {getPaginationNumbers().map(
                                                (page, index) => (
                                                    <React.Fragment key={index}>
                                                        {page === "..." ? (
                                                            <span className="flex items-center justify-center w-10 h-10">
                                                                <FaEllipsisH className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                                                            </span>
                                                        ) : (
                                                            <button
                                                                onClick={() =>
                                                                    paginate(
                                                                        page
                                                                    )
                                                                }
                                                                className={`flex items-center justify-center w-10 h-10 rounded-full ${
                                                                    currentPage ===
                                                                    page
                                                                        ? "bg-blue-500 text-white"
                                                                        : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#313131]"
                                                                } transition-colors duration-200`}
                                                            >
                                                                {page}
                                                            </button>
                                                        )}
                                                    </React.Fragment>
                                                )
                                            )}
                                        </div>

                                        <button
                                            onClick={() =>
                                                paginate(currentPage + 1)
                                            }
                                            disabled={
                                                currentPage === totalPages
                                            }
                                            className={`flex items-center justify-center w-10 h-10 rounded-full ${
                                                currentPage === totalPages
                                                    ? "text-gray-400 dark:text-gray-600 cursor-not-allowed"
                                                    : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#313131]"
                                            } transition-colors duration-200`}
                                        >
                                            <FaChevronRight className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* No Results Message */}
                            {filteredDrivers.length === 0 && (
                                <div className="text-center py-4 text-gray-500 dark:text-gray-400">
                                    Tidak ada data yang sesuai dengan pencarian
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Modal Form */}
                <Modal
                    show={showModal}
                    onClose={() => {
                        setShowModal(false);
                        setIsEdit(false);
                        setErrors({});
                        setData({
                            id: "",
                            name: "",
                            phone_number: "",
                            status: "Tersedia",
                        });
                    }}
                    maxWidth="sm"
                >
                    <form
                        onSubmit={handleSubmit}
                        className="p-4 sm:p-6 dark:bg-[#313131]"
                    >
                        <h2 className="text-xl sm:text-2xl font-semibold mb-6 text-gray-800 dark:text-gray-100">
                            {isEdit ? "Edit Driver" : "Tambah Driver"}
                        </h2>

                        <div className="space-y-5">
                            <div>
                                <InputLabel
                                    htmlFor="name"
                                    value="Nama"
                                    className="text-sm font-medium text-gray-700 dark:text-gray-300"
                                />
                                <TextInput
                                    id="name"
                                    type="text"
                                    value={data.name}
                                    onChange={(e) =>
                                        setData({
                                            ...data,
                                            name: e.target.value,
                                        })
                                    }
                                    className="mt-1 block w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-[#313131] dark:text-gray-100 focus:border-blue-500 focus:ring-blue-500 transition duration-150 ease-in-out text-sm sm:text-base"
                                    required
                                />
                                <InputError
                                    message={errors.name}
                                    className="mt-2 text-sm"
                                />
                            </div>

                            <div>
                                <InputLabel
                                    htmlFor="phone_number"
                                    value="No. Telepon"
                                    className="text-sm font-medium text-gray-700 dark:text-gray-300"
                                />
                                <TextInput
                                    id="phone_number"
                                    type="text"
                                    value={data.phone_number}
                                    onChange={(e) =>
                                        setData({
                                            ...data,
                                            phone_number: e.target.value,
                                        })
                                    }
                                    className="mt-1 block w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-[#313131] dark:text-gray-100 focus:border-blue-500 focus:ring-blue-500 transition duration-150 ease-in-out text-sm sm:text-base"
                                    required
                                />
                                <InputError
                                    message={errors.phone_number}
                                    className="mt-2 text-sm"
                                />
                            </div>

                            <div>
                                <InputLabel
                                    htmlFor="status"
                                    value="Status"
                                    className="text-sm font-medium text-gray-700 dark:text-gray-300"
                                />
                                <select
                                    id="status"
                                    value={data.status}
                                    onChange={(e) =>
                                        setData({
                                            ...data,
                                            status: e.target.value,
                                        })
                                    }
                                    className="mt-1 block w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-[#313131] dark:text-gray-100 focus:border-blue-500 focus:ring-blue-500 transition duration-150 ease-in-out text-sm sm:text-base"
                                    required
                                >
                                    <option
                                        value="Tersedia"
                                        className="dark:bg-[#313131]"
                                    >
                                        Tersedia
                                    </option>
                                    <option
                                        value="Sedang Bertugas"
                                        className="dark:bg-[#313131]"
                                    >
                                        Sedang Bertugas
                                    </option>
                                    <option
                                        value="Cuti"
                                        className="dark:bg-[#313131]"
                                    >
                                        Cuti
                                    </option>
                                </select>
                                <InputError
                                    message={errors.status}
                                    className="mt-2 text-sm"
                                />
                            </div>
                        </div>

                        <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 mt-8">
                            <button
                                type="button"
                                onClick={() => {
                                    setShowModal(false);
                                    setIsEdit(false);
                                    setErrors({});
                                    setData({
                                        id: "",
                                        name: "",
                                        phone_number: "",
                                        status: "Tersedia",
                                    });
                                }}
                                className="w-full sm:w-auto px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-[#313131] rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 dark:focus:ring-offset-gray-800 transition duration-150 ease-in-out"
                            >
                                Batal
                            </button>
                            <button
                                type="submit"
                                className="w-full sm:w-auto px-4 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-800 transition duration-150 ease-in-out"
                            >
                                {isEdit ? "Simpan Perubahan" : "Simpan"}
                            </button>
                        </div>
                    </form>
                </Modal>
            </DashboardLayout>
            <ToastContainer />
        </>
    );
}
