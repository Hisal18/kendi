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
            <div className="bg-[#e8e8e8] dark:bg-[#212121]">
                {/* Overlay untuk mobile */}
                {isSidebarOpen && (
                    <div
                        className="fixed inset-0 bg-black bg-opacity-60 z-30 lg:hidden backdrop-blur-sm"
                        onClick={() => setIsSidebarOpen(false)}
                    />
                )}
                {/* Tombol Toggle untuk Mobile */}
                <button
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    className="fixed p-2 bg-indigo-600 rounded-lg text-white lg:hidden z-30 mt-10 mx-4 hover:bg-indigo-700 transition-all hover:shadow-indigo-500/30"
                >
                    <FaList className="w-6 h-6" />
                </button>
                <div
                    ref={sidebarRef}
                    className={`fixed top-0 left-0 h-full bg-[#e0e0e0] dark:bg-[#212121] text-gray-700 dark:text-gray-100 w-[280px] py-8 px-4 transition-all duration-300 ease-in-out z-30 border-r border-gray-200 dark:border-gray-800
                    ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
                    lg:translate-x-0 lg:static lg:m-6 lg:rounded-2xl
                    shadow-[15px_15px_30px_#bebebe,_-15px_-15px_30px_#ffffff,_3px_3px_10px_rgba(0,0,0,1)] dark:shadow-[-1px_-1px_10px_rgba(255,255,255,0.4),_3px_3px_10px_rgba(0,0,0,1)]
                    lg:min-h-[calc(100vh-3rem)] lg:max-h-[calc(100vh-3rem)]
                    flex flex-col`}
                >
                    <div className="flex items-center space-x-3 px-4 mb-10">
                        <ApplicationLogo className="w-16 h-16" />
                        <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-blue-500 text-transparent bg-clip-text">
                            Kendaraan Dinas
                        </span>
                    </div>

                    <nav className="space-y-1 flex-1">
                        <Link
                            href={route("dashboard.index")}
                            className={`flex items-center py-3 px-4 rounded-lg transition duration-200 hover:bg-gray-100 dark:hover:bg-gray-800 group
                                ${
                                    isActive("/dashboard")
                                        ? "bg-indigo-50 dark:bg-gray-800 text-indigo-600 dark:text-indigo-400 font-medium shadow-sm"
                                        : "text-gray-600 dark:text-gray-400"
                                }`}
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
                                className={`w-full flex items-center justify-between py-3 px-4 rounded-lg transition duration-200 hover:bg-gray-100 dark:hover:bg-gray-800 group
                                    ${
                                        isActive("/kendaraan")
                                            ? "bg-indigo-50 dark:bg-gray-800 text-indigo-600 dark:text-indigo-400 font-medium shadow-sm"
                                            : "text-gray-600 dark:text-gray-400"
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
                                    className={`flex items-center py-2 px-4 rounded-lg transition duration-200 hover:bg-gray-100 dark:hover:bg-gray-800 group
                                        ${
                                            isActive("/trip")
                                                ? "text-indigo-600 dark:text-indigo-400 font-medium bg-indigo-50/50 dark:bg-gray-800/50"
                                                : "text-gray-600 dark:text-gray-400"
                                        }`}
                                >
                                    <FaCircle className="h-2 mx-1" />
                                    Dinas
                                </Link>
                                <Link
                                    href={route("tamu.index")}
                                    className={`flex items-center py-2 px-4 rounded-lg transition duration-200 hover:bg-gray-100 dark:hover:bg-gray-800 group
                                        ${
                                            isActive("/tamu")
                                                ? "text-indigo-600 dark:text-indigo-400 font-medium bg-indigo-50/50 dark:bg-gray-800/50"
                                                : "text-gray-600 dark:text-gray-400"
                                        }`}
                                >
                                    <FaCircle className="h-2 mx-1" />
                                    Tamu
                                </Link>

                                {auth.user.role === "admin" && (
                                    <>
                                        <Link
                                            href={route("kendaraan.index")}
                                            className={`flex items-center py-2 px-4 rounded-lg transition duration-200 hover:bg-gray-100 dark:hover:bg-gray-800 group
                                            ${
                                                isActive("/kendaraan")
                                                    ? "text-indigo-600 dark:text-indigo-400 font-medium bg-indigo-50/50 dark:bg-gray-800/50"
                                                    : "text-gray-600 dark:text-gray-400"
                                            }`}
                                        >
                                            <FaCircle className="h-2 mx-1" />
                                            Kendaraan
                                        </Link>
                                        <Link
                                            href={route("driver.index")}
                                            className={`flex items-center py-2 px-4 rounded-lg transition duration-200 hover:bg-gray-100 dark:hover:bg-gray-800 group
                                            ${
                                                isActive("/driver")
                                                    ? "text-indigo-600 dark:text-indigo-400 font-medium bg-indigo-50/50 dark:bg-gray-800/50"
                                                    : "text-gray-600 dark:text-gray-400"
                                            }`}
                                        >
                                            <FaCircle className="h-2 mx-1" />
                                            Driver
                                        </Link>
                                    </>
                                )}
                            </div>
                        </div>
                        {auth.user.role === "admin" && (
                            <Link
                                href={route("user.index")}
                                className={`flex items-center py-3 px-4 rounded-lg transition duration-200 hover:bg-gray-100 dark:hover:bg-gray-800 group
                                    ${
                                        isActive("/users")
                                            ? "bg-indigo-50 dark:bg-gray-800 text-indigo-600 dark:text-indigo-400 font-medium shadow-sm"
                                            : "text-gray-600 dark:text-gray-400"
                                    }`}
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
                        <Link
                            href={route("profile.edit")}
                            className={`flex items-center py-3 px-4 rounded-lg transition duration-200 hover:bg-gray-100 dark:hover:bg-gray-800 group
                                ${
                                    isActive("/profile")
                                        ? "bg-indigo-50 dark:bg-gray-800 text-indigo-600 dark:text-indigo-400 font-medium shadow-sm"
                                        : "text-gray-600 dark:text-gray-400"
                                }`}
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

                    <div className="pt-4 mt-4 border-t border-gray-700 dark:border-gray-600">
                        <button
                            onClick={() => setShowLogoutModal(true)}
                            className="flex items-center py-3 px-4 rounded-lg transition duration-200 hover:bg-gray-100 dark:hover:bg-gray-800 group w-full text-left text-gray-600 dark:text-gray-400"
                        >
                            <FaSignOutAlt
                                className={`w-5 h-5 mr-3 transition-colors text-gray-500 dark:text-gray-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400`}
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
                    <div className="bg-white dark:bg-[#313131] rounded-lg p-6 shadow-xl z-10 max-w-md w-full mx-4">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
                            Konfirmasi Logout
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-6">
                            Apakah Anda yakin ingin keluar dari aplikasi?
                        </p>
                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={() => setShowLogoutModal(false)}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 dark:bg-[#717171] dark:text-gray-300 dark:hover:bg-gray-600"
                            >
                                Batal
                            </button>
                            <Link
                                href={route("logout")}
                                method="post"
                                as="button"
                                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700"
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
