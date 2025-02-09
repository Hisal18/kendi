import React, { useState, useEffect } from "react";
import { usePage } from "@inertiajs/react";
import Sidebar from "../Components/Sidebar";
import Header from "../Components/Header";
import Footer from "../Components/Footer";
export default function DashboardLayout ({ children }) {
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
    }, [isDarkMode]);

    const toggleDarkMode = () => {
        setIsDarkMode(!isDarkMode);
    };

    return (
        <div
            className={`flex h-screen ${
                isDarkMode ? "dark bg-gray-900" : "bg-[#e8e8e8]"
            }`}
        >
            <Sidebar />
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* <Header
                    isDarkMode={isDarkMode}
                    onToggleDarkMode={toggleDarkMode}
                /> */}
                <main
                    className={`flex-1 overflow-x-hidden overflow-y-auto transition-colors duration-200 bg-[#e8e8e8] dark:bg-gray-900 text-gray-700 dark:text-gray-100 py-8 px-4 shadow-[15px_15px_30px_#bebebe,_-15px_-15px_30px_#ffffff] dark:shadow-[0_4px_12px_rgba(0,0,0,0.5)]`}
                >
                    <div className="">
                        <div className="flex justify-between items-center mb-6">
                            <h1 className="text-3xl font-bold p-0 bg-gradient-to-r from-indigo-600 to-blue-500 text-transparent bg-clip-text animate-slide ml-14 lg:ml-0">
                                {url.startsWith("/dashboard") && "Dashboard"}
                                {url.startsWith("/user") && "Users"}
                                {url.startsWith("/kendaraan") && "Kendaraan"}
                                {url.startsWith("/settings") && "Settings"}
                            </h1>
                            <div className="flex items-center space-x-4">
                                <div className="flex ml-4 items-center">
                                    <button
                                        onClick={toggleDarkMode}
                                        className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-500 dark:bg-gray-700 transition-colors duration-300"
                                    >
                                        <span
                                            className={`${
                                                isDarkMode ? "translate-x-6" : "translate-x-1"
                                            } inline-block h-4 w-4 transform rounded-full bg-[#FAF9F6] transition-transform duration-300`}
                                        />
                                    </button>
                                    <span className="ml-2 text-sm text-gray-600 dark:text-gray-300">
                                        {isDarkMode ? "🌙" : "☀️"}
                                    </span>
                                </div>
                                <div className="bg-[#FAF9F6] dark:bg-gray-800 px-4 py-2 rounded-lg shadow-md">
                                    <span className="text-sm text-gray-500 dark:text-gray-400">
                                        Selamat datang,
                                    </span>
                                    <span className="ml-2 font-medium">
                                        {auth?.user?.name || 'Guest'}
                                    </span>
                                </div>
                            </div>
                        </div>
                        {children}
                    </div>
                </main>
                {/* <Footer /> */}
            </div>
        </div>
    );
};
