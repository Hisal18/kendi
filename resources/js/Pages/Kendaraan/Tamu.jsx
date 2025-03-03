import DashboardLayout from "@/Layouts/DashboardLayout";
import { Head } from "@inertiajs/react";
import dateFormat from "dateformat";
import React, { useState, useEffect } from "react";
import {
    FaCar,
    FaArrowRight,
    FaArrowLeft,
    FaParking,
    FaSearch,
    FaPlus,
    FaCheck,
    FaChevronRight,
    FaChevronLeft,
} from "react-icons/fa";

export default function Tamu({ tamus: initialsTamus, auth }) {
    const [tamus, setTamus] = useState(initialsTamus || []);
    const [currentTime, setCurrentTime] = useState(new Date());
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const [showExportDropdown, setShowExportDropdown] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const itemsPerPage = 8;

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const filteredTamus = Array.isArray(tamus)
        ? tamus.filter(
              (tamu) =>
                  tamu?.plat_kendaraan
                      ?.toLowerCase()
                      ?.includes(searchTerm.toLowerCase())
          )
        : [];


    // Pagination
    const totalPages = Math.ceil(filteredTamus.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredTamus.slice(indexOfFirstItem, indexOfLastItem);

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

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);
        return () => clearInterval(timer);
    }, []);
    return (
        <>
            <Head title="Tamu" />
            <DashboardLayout>
                <div className="mb-4 text-white">
                    <h1 className="text-3xl font-bold mb-2 text-gray-500 dark:text-gray-400">
                        Monitoring Perjalanan
                    </h1>
                    <p className="opacity-90 text-gray-700 dark:text-gray-500">
                        Data monitoring kendaraan hari ini -{" "}
                        {dateFormat(currentTime, "dd mmmm yyyy, HH:MM:ss")}
                    </p>
                </div>
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
                                    10
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
                                    Kendaraan Masuk
                                </h3>
                                <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                                    11
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
                                    Kendaraan Keluar
                                </h3>
                                <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                                    11
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
                                    Dalam Parkiran
                                </h3>
                                <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                                    11
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
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
                                            No Polisi
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                            Waktu Kedatangan
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                            Waktu Kepergian
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
                                                {indexOfFirstItem + index + 1}
                                            </td>

                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">
                                                {item.plat_kendaraan}{" "}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">
                                                {dateFormat(
                                                    item.waktu_kedatangan,
                                                    "dd mmmm yyyy, HH:MM:ss"
                                                )}{" "}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">
                                                {item.waktu_kembali === null
                                                    ? "-"
                                                    : dateFormat(
                                                          item.waktu_kepergian,
                                                          "dd mmmm yyyy, HH:MM:ss"
                                                      )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span
                                                    className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-md ${
                                                        item.status ===
                                                        "Close"
                                                            ? "bg-sky-100 text-sky-800 dark:bg-sky-900 dark:text-sky-300"
                                                            : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
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
                                        filteredTamus.length
                                    )}
                                </span>
                                of{" "}
                                <span className="font-medium mx-1">
                                    {filteredTamus.length}
                                </span>{" "}
                                entries
                            </div>

                            <div className="flex items-center space-x-2">
                                {/* Previous Button */}
                                <button
                                    onClick={() => paginate(currentPage - 1)}
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
                                                            currentPage === page
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
                                    onClick={() => paginate(currentPage + 1)}
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
            </DashboardLayout>
        </>
    );
}
