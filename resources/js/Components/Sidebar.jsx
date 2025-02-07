import React, { useState, useEffect, useRef } from "react";
import { Link, usePage } from "@inertiajs/react";
import {
    HiOutlineMenu,
    HiOutlineHome,
    HiOutlineUsers,
    HiOutlineCog,
} from "react-icons/hi";
import ApplicationLogo from "./ApplicationLogo";

const Sidebar = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const { url } = usePage();
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

    return (
        <>
            <div className="bg-[#e8e8e8] dark:bg-gray-900">
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
                    <HiOutlineMenu className="w-6 h-6" />
                </button>
                <div
                    ref={sidebarRef}
                    className={`fixed top-0 left-0 h-full bg-[#e0e0e0] dark:bg-gray-900 text-gray-700 dark:text-gray-100 w-[280px] py-8 px-4 transition-all duration-300 ease-in-out z-30 border-r border-gray-200 dark:border-gray-800
                    ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
                    lg:translate-x-0 lg:static lg:m-6 lg:rounded-2xl
                    shadow-[15px_15px_30px_#bebebe,_-15px_-15px_30px_#ffffff] dark:shadow-[0_4px_12px_#141414]
                    lg:min-h-[calc(100vh-3rem)] lg:max-h-[calc(100vh-3rem)]`}
                >
                    <div className="flex items-center space-x-3 px-4 mb-10">
                        <ApplicationLogo className="w-16 h-16" />
                        <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-blue-500 text-transparent bg-clip-text">
                            Kendaraan Dinas
                        </span>
                    </div>

                    <nav className="space-y-1">
                        <Link
                            href="/dashboard"
                            className={`flex items-center py-3 px-4 rounded-lg transition duration-200 hover:bg-gray-100 dark:hover:bg-gray-800 group ${
                                url === "/dashboard"
                                    ? "bg-indigo-50 dark:bg-gray-800 text-indigo-600 dark:text-indigo-400 font-medium"
                                    : ""
                            }`}
                        >
                            <HiOutlineHome
                                className={`w-5 h-5 mr-3 transition-colors ${
                                    url === "/dashboard"
                                        ? "text-indigo-600 dark:text-indigo-400"
                                        : "text-gray-500 dark:text-gray-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400"
                                }`}
                            />
                            Dashboard
                        </Link>
                        <Link
                            href="/users"
                            className={`flex items-center py-3 px-4 rounded-lg transition duration-200 hover:bg-gray-100 dark:hover:bg-gray-800 group ${
                                url === "/users"
                                    ? "bg-indigo-50 dark:bg-gray-800 text-indigo-600 dark:text-indigo-400 font-medium"
                                    : ""
                            }`}
                        >
                            <HiOutlineUsers
                                className={`w-5 h-5 mr-3 transition-colors ${
                                    url === "/users"
                                        ? "text-indigo-600 dark:text-indigo-400"
                                        : "text-gray-500 dark:text-gray-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400"
                                }`}
                            />
                            Users
                        </Link>
                        <Link
                            href="/settings"
                            className={`flex items-center py-3 px-4 rounded-lg transition duration-200 hover:bg-gray-100 dark:hover:bg-gray-800 group ${
                                url === "/settings"
                                    ? "bg-indigo-50 dark:bg-gray-800 text-indigo-600 dark:text-indigo-400 font-medium"
                                    : ""
                            }`}
                        >
                            <HiOutlineCog
                                className={`w-5 h-5 mr-3 transition-colors ${
                                    url === "/settings"
                                        ? "text-indigo-600 dark:text-indigo-400"
                                        : "text-gray-500 dark:text-gray-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400"
                                }`}
                            />
                            Settings
                        </Link>
                    </nav>
                </div>
            </div>
        </>
    );
};

export default Sidebar;
