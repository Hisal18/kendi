import React, { useState, useEffect, useRef } from "react";
import { Link, usePage } from "@inertiajs/react";
import {
    FaHome,
    FaList,
    FaCar,
    FaUserFriends,
    FaTools,
    FaSignOutAlt,
    FaCircle,
    FaBars,
    FaTimes,
    FaClipboardCheck, // << TAMBAHKAN INI
} from "react-icons/fa";

import ApplicationLogo from "./ApplicationLogo";

export default function Sidebar() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isKendaraanOpen, setIsKendaraanOpen] = useState(false);
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const { url = "", auth } = usePage().props;
    const sidebarRef = useRef();

    // Menambahkan event listener untuk menutup sidebar saat klik di luar
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                sidebarRef.current &&
                !sidebarRef.current.contains(event.target)
            ) {
                setIsSidebarOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Function untuk mengecek active route
    const isActive = (path) => {
        if (path === "/dashboard") {
            return url === path;
        }
        return url.startsWith(path);
    };

    return (
        <>
            <div className="bg-[#f8f9fa] dark:bg-[#111827]">
                {/* Overlay untuk mobile */}
                {isSidebarOpen && (
                    <div
                        className="fixed inset-0 bg-black bg-opacity-60 z-30 lg:hidden backdrop-blur-sm transition-all duration-300"
                        onClick={() => setIsSidebarOpen(false)}
                    />
                )}

                {/* Tombol Toggle untuk Mobile - Improved UI */}
                <button
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    className={`fixed top-4 right-4 p-3 bg-white dark:bg-[#1f2937] rounded-full text-indigo-600 dark:text-indigo-400 lg:hidden z-40 shadow-lg hover:shadow-indigo-500/30 transition-all duration-300 border border-gray-200 dark:border-gray-700 ${
                        isSidebarOpen
                            ? "opacity-0 pointer-events-none"
                            : "opacity-100"
                    }`}
                    aria-label="Toggle menu"
                >
                    <FaBars className="w-5 h-5" />
                </button>

                <div
                    ref={sidebarRef}
                    className={`fixed top-0 left-0 h-full bg-white dark:bg-[#1f2937] text-gray-700 dark:text-gray-100 w-[280px] py-8 px-4 transition-all duration-300 ease-in-out z-30 border-r border-gray-200 dark:border-gray-700
                    ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
                    lg:translate-x-0 lg:static lg:m-6 lg:rounded-2xl
                    shadow-lg dark:shadow-2xl
                    lg:min-h-[calc(100vh-3rem)] lg:max-h-[calc(100vh-3rem)]
                    flex flex-col overflow-y-auto`}
                >
                    <div className="flex items-center justify-between px-4 mb-10">
                        <div className="flex items-center space-x-3">
                            <ApplicationLogo className="w-12 h-12 md:w-16 md:h-16" />
                            <span className="text-xl md:text-2xl font-bold bg-gradient-to-r from-indigo-500 to-purple-600 text-transparent bg-clip-text">
                                Kendaraan Dinas
                            </span>
                        </div>

                        {/* Close button for mobile - Improved */}
                        <button
                            className="lg:hidden text-gray-500 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400 transition-colors p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
                            onClick={() => setIsSidebarOpen(false)}
                            aria-label="Close menu"
                        >
                            <FaTimes className="w-5 h-5" />
                        </button>
                    </div>

                    <nav className="space-y-1 flex-1">
                        <Link
                            href={route("dashboard.index")}
                            className={`flex items-center py-3 px-4 rounded-xl transition duration-200 hover:bg-gray-100 dark:hover:bg-gray-800 group
                                ${
                                    isActive("/dashboard")
                                        ? "bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 font-medium shadow-sm"
                                        : "text-gray-600 dark:text-gray-300"
                                }`}
                            onClick={() => setIsSidebarOpen(false)}
                        >
                            <FaHome
                                className={`w-5 h-5 mr-3 transition-colors ${
                                    isActive("/dashboard")
                                        ? "text-indigo-600 dark:text-indigo-400"
                                        : "text-gray-500 dark:text-gray-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400"
                                }`}
                            />
                            Dashboard
                        </Link>
                        <div>
                            <button
                                onClick={() =>
                                    setIsKendaraanOpen(!isKendaraanOpen)
                                }
                                className={`w-full flex items-center justify-between py-3 px-4 rounded-xl transition duration-200 hover:bg-gray-100 dark:hover:bg-gray-800 group
                                    ${
                                        isActive("/kendaraan")
                                            ? "bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 font-medium shadow-sm"
                                            : "text-gray-600 dark:text-gray-300"
                                    }`}
                            >
                                <div className="flex items-center">
                                    <FaCar
                                        className={`w-5 h-5 mr-3 transition-colors ${
                                            isActive("/kendaraan")
                                                ? "text-indigo-600 dark:text-indigo-400"
                                                : "text-gray-500 dark:text-gray-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400"
                                        }`}
                                    />
                                    Kendaraan
                                </div>
                                <svg
                                    className={`w-4 h-4 transition-transform ${
                                        isKendaraanOpen ? "rotate-180" : ""
                                    }`}
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M19 9l-7 7-7-7"
                                    />
                                </svg>
                            </button>

                            <div
                                className={`pl-12 mt-1 space-y-1 overflow-hidden transition-all duration-300 ease-in-out ${
                                    isKendaraanOpen
                                        ? "max-h-[500px] opacity-100"
                                        : "max-h-0 opacity-0"
                                }`}
                            >
                                <Link
                                    href={route("trips.index")}
                                    className={`flex items-center py-2 px-4 rounded-xl transition duration-200 hover:bg-gray-100 dark:hover:bg-gray-800 group
                                        ${
                                            isActive("/trip")
                                                ? "text-indigo-600 dark:text-indigo-400 font-medium bg-indigo-50/50 dark:bg-indigo-900/20"
                                                : "text-gray-600 dark:text-gray-300"
                                        }`}
                                    onClick={() => setIsSidebarOpen(false)}
                                >
                                    <FaCircle className="h-2 w-2 mr-2" />
                                    Dinas 
                                </Link>
                                <Link
                                    href={route("tamu.index")}
                                    className={`flex items-center py-2 px-4 rounded-xl transition duration-200 hover:bg-gray-100 dark:hover:bg-gray-800 group
                                        ${
                                            isActive("/tamu")
                                                ? "text-indigo-600 dark:text-indigo-400 font-medium bg-indigo-50/50 dark:bg-indigo-900/20"
                                                : "text-gray-600 dark:text-gray-300"
                                        }`}
                                    onClick={() => setIsSidebarOpen(false)}
                                >
                                    <FaCircle className="h-2 w-2 mr-2" />
                                    Tamu
                                </Link>

                                {auth.user.role === "admin" && (
                                    <>
                                        <Link
                                            href={route("kendaraan.index")}
                                            className={`flex items-center py-2 px-4 rounded-xl transition duration-200 hover:bg-gray-100 dark:hover:bg-gray-800 group
                                            ${
                                                isActive("/kendaraan")
                                                    ? "text-indigo-600 dark:text-indigo-400 font-medium bg-indigo-50/50 dark:bg-indigo-900/20"
                                                    : "text-gray-600 dark:text-gray-300"
                                            }`}
                                            onClick={() =>
                                                setIsSidebarOpen(false)
                                            }
                                        >
                                            <FaCircle className="h-2 w-2 mr-2" />
                                            Kendaraan
                                        </Link>
                                        <Link
                                            href={route("driver.index")}
                                            className={`flex items-center py-2 px-4 rounded-xl transition duration-200 hover:bg-gray-100 dark:hover:bg-gray-800 group
                                            ${
                                                isActive("/driver")
                                                    ? "text-indigo-600 dark:text-indigo-400 font-medium bg-indigo-50/50 dark:bg-indigo-900/20"
                                                    : "text-gray-600 dark:text-gray-300"
                                            }`}
                                            onClick={() =>
                                                setIsSidebarOpen(false)
                                            }
                                        >
                                            <FaCircle className="h-2 w-2 mr-2" />
                                            Driver
                                        </Link>
                                    </>
                                )}
                            </div>
                        </div>
                        {auth.user.role === "admin" && (
                            <Link
                                href={route("user.index")}
                                className={`flex items-center py-3 px-4 rounded-xl transition duration-200 hover:bg-gray-100 dark:hover:bg-gray-800 group
                                    ${
                                        isActive("/users")
                                            ? "bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 font-medium shadow-sm"
                                            : "text-gray-600 dark:text-gray-300"
                                    }`}
                                onClick={() => setIsSidebarOpen(false)}
                            >
                                <FaUserFriends
                                    className={`w-5 h-5 mr-3 transition-colors ${
                                        isActive("/users")
                                            ? "text-indigo-600 dark:text-indigo-400"
                                            : "text-gray-500 dark:text-gray-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400"
                                    }`}
                                />
                                Users
                            </Link>
                        )}
                        
                        {/* >> MULAI: Tambahkan Link Persetujuan Edit Trip (Hanya Admin) */}
                        {auth.user.role === "admin" && (
                            <Link
                                href={route("admin.requests.index")} // Route Admin untuk Persetujuan
                                className={`flex items-center py-3 px-4 rounded-xl transition duration-200 hover:bg-gray-100 dark:hover:bg-gray-800 group
                                    ${
                                        isActive("/admin/trip-edit-requests") // Cek path URL admin.requests.index
                                            ? "bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 font-medium shadow-sm"
                                            : "text-gray-600 dark:text-gray-300"
                                    }`}
                                onClick={() => setIsSidebarOpen(false)}
                            >
                                <FaClipboardCheck // Ganti dengan ikon yang sesuai
                                    className={`w-5 h-5 mr-3 transition-colors ${
                                        isActive("/admin/trip-edit-requests")
                                            ? "text-indigo-600 dark:text-indigo-400"
                                            : "text-gray-500 dark:text-gray-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400"
                                    }`}
                                />
                                Persetujuan Trip
                            </Link>
                        )}
                        {/* << SELESAI: Tambahkan Link Persetujuan Edit Trip */}

                        <Link
                            href={route("profile.edit")}
                            className={`flex items-center py-3 px-4 rounded-xl transition duration-200 hover:bg-gray-100 dark:hover:bg-gray-800 group
                                ${
                                    isActive("/profile")
                                        ? "bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 font-medium shadow-sm"
                                        : "text-gray-600 dark:text-gray-300"
                                }`}
                            onClick={() => setIsSidebarOpen(false)}
                        >
                            <FaTools
                                className={`w-5 h-5 mr-3 transition-colors ${
                                    isActive("/profile")
                                        ? "text-indigo-600 dark:text-indigo-400"
                                        : "text-gray-500 dark:text-gray-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400"
                                }`}
                            />
                            Settings
                        </Link>
                    </nav>

                    <div className="pt-4 mt-4 border-t border-gray-200 dark:border-gray-700">
                        <button
                            onClick={() => {
                                setShowLogoutModal(true);
                                setIsSidebarOpen(false);
                            }}
                            className="flex items-center py-3 px-4 rounded-xl transition duration-200 hover:bg-red-50 dark:hover:bg-red-900/20 group w-full text-left text-gray-600 dark:text-gray-300"
                        >
                            <FaSignOutAlt
                                className={`w-5 h-5 mr-3 transition-colors text-gray-500 dark:text-gray-400 group-hover:text-red-600 dark:group-hover:text-red-400`}
                            />
                            Logout
                        </button>
                    </div>
                </div>
            </div>

            {/* Modal Konfirmasi Logout */}
            {showLogoutModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <div
                        className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
                        onClick={() => setShowLogoutModal(false)}
                    ></div>
                    <div className="bg-white dark:bg-[#1f2937] rounded-xl p-6 shadow-xl z-10 max-w-md w-full mx-4 transform transition-all duration-300 scale-100 border border-gray-200 dark:border-gray-700">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                            Konfirmasi Logout
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300 mb-6">
                            Apakah Anda yakin ingin keluar dari aplikasi?
                        </p>
                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={() => setShowLogoutModal(false)}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 transition-colors"
                            >
                                Batal
                            </button>
                            <Link
                                href={route("logout")}
                                method="post"
                                as="button"
                                className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-red-500 to-red-600 rounded-lg hover:from-red-600 hover:to-red-700 transition-colors shadow-md hover:shadow-red-500/30"
                            >
                                Ya, Logout
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
