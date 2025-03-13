import React, { useState, useEffect } from "react";
import { usePage } from "@inertiajs/react";
import Sidebar from "../Components/Sidebar";
import Footer from "../Components/Footer";

export default function DashboardLayout({ children }) {
    const { url, props } = usePage();
    const { auth } = props;
    const [isDarkMode, setIsDarkMode] = useState(() => {
        if (typeof window !== "undefined") {
            const saved = localStorage.getItem("darkMode");
            return saved === "true";
        }
        return false;
    });

    useEffect(() => {
        localStorage.setItem("darkMode", isDarkMode);
        if (isDarkMode) {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }

        // Dispatch event for charts to update
        const event = new Event("darkModeChanged");
        window.dispatchEvent(event);
    }, [isDarkMode]);

    const toggleDarkMode = () => {
        setIsDarkMode(!isDarkMode);
    };

    return (
        <div
            className={`flex h-screen ${
                isDarkMode ? "dark bg-[#111827]" : "bg-[#f8f9fa]"
            }`}
        >
            <Sidebar />
            <div className="flex-1 flex flex-col overflow-hidden">
                <main
                    className={`flex-1 overflow-x-hidden overflow-y-auto transition-colors duration-200 bg-[#f8f9fa] dark:bg-[#111827] text-gray-700 dark:text-gray-100 py-8 px-4 lg:px-6`}
                >
                    <div className="">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                            <div className="w-full md:w-auto">
                                <h1 className="text-3xl font-bold p-0 bg-gradient-to-r from-indigo-500 to-purple-600 text-transparent bg-clip-text animate-slide">
                                    {url.startsWith("/dashboard") &&
                                        "Dashboard Ringkasan dan statistik operasional kendaraan"}
                                    {url.startsWith("/user") &&
                                        "Manajemen Pengguna dan Hak Akses"}
                                    {url.startsWith("/trip") &&
                                        "Manajemen Trip dan Perjalanan Dinas"}
                                    {url.startsWith("/profile") &&
                                        "Pengaturan Profil Pengguna"}
                                    {url.startsWith("/driver") &&
                                        "Manajemen Data Driver dan Sopir"}
                                    {url.startsWith("/tamu") &&
                                        "Manajemen Kendaraan Tamu dan Pengunjung"}
                                    {url.startsWith("/kendaraan") &&
                                        "Manajemen Armada Kendaraan Dinas"}
                                </h1>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                    {new Date().toLocaleDateString("id-ID", {
                                        weekday: "long",
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric",
                                    })}
                                </p>
                            </div>
                            <div className="flex items-center gap-4 w-full md:w-auto">
                                <div className="flex items-center bg-white dark:bg-[#1f2937] px-4 py-3 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 transition-all duration-300 hover:shadow-md flex-1 md:flex-none">
                                    <div className="mr-3 bg-indigo-100 dark:bg-indigo-900/30 p-2 rounded-lg">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-5 w-5 text-indigo-600 dark:text-indigo-400"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                            />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                                            Selamat datang
                                        </p>
                                        <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                                            {auth?.user?.name || "Guest"}
                                        </p>
                                    </div>
                                </div>

                                <button
                                    onClick={toggleDarkMode}
                                    className="p-3 bg-white dark:bg-[#1f2937] rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 transition-all duration-300 hover:shadow-md"
                                    aria-label="Toggle dark mode"
                                >
                                    {isDarkMode ? (
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            strokeWidth={1.5}
                                            stroke="currentColor"
                                            className="w-5 h-5 text-amber-500"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z"
                                            />
                                        </svg>
                                    ) : (
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            strokeWidth={1.5}
                                            stroke="currentColor"
                                            className="w-5 h-5 text-indigo-600"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
                                            />
                                        </svg>
                                    )}
                                </button>
                            </div>
                        </div>
                        {children}
                    </div>
                    <Footer />
                </main>
            </div>
        </div>
    );
}
