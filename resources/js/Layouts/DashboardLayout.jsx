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
    }, [isDarkMode]);

    const toggleDarkMode = () => {
        setIsDarkMode(!isDarkMode);
    };

    return (
        <div
            className={`flex h-screen ${
                isDarkMode ? "dark bg-[#212121]" : "bg-[#e8e8e8]"
            }`}
        >
            <Sidebar />
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* <Header
                    isDarkMode={isDarkMode}
                    onToggleDarkMode={toggleDarkMode}
                /> */}
                <main
                    className={`flex-1 overflow-x-hidden overflow-y-auto transition-colors duration-200 bg-[#e8e8e8] dark:bg-transparent text-gray-700 dark:text-gray-100 py-8 px-4 shadow-[15px_15px_30px_#bebebe,_-15px_-15px_30px_#ffffff] dark:shadow-[-1px_-1px_6px_rgba(255,255,255,0.4)]`}
                >
                    <div className="">
                        <div className="flex justify-between items-center mb-6">
                            <h1 className="text-3xl font-bold p-0 bg-gradient-to-r from-indigo-600 to-blue-500 text-transparent bg-clip-text animate-slide ml-14 lg:ml-0">
                                {url.startsWith("/dashboard") && "Dashboard"}
                                {url.startsWith("/user") && "Users"}
                                {url.startsWith("/trip") && "Trip"}
                                {url.startsWith("/profile") && "Profile"}
                            </h1>
                            <div className="flex items-center space-x-4">
                                <div className="flex ml-4 items-center">
                                    <button
                                        onClick={toggleDarkMode}
                                        className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-500 dark:bg-gray-700 transition-colors duration-300"
                                    >
                                        <span
                                            className={`${
                                                isDarkMode
                                                    ? "translate-x-6"
                                                    : "translate-x-1"
                                            } inline-block h-4 w-4 transform rounded-full bg-[#FAF9F6] transition-transform duration-300`}
                                        />
                                    </button>
                                    <span className="ml-2 text-sm text-gray-600 dark:text-gray-300">
                                        {isDarkMode ? (
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                strokeWidth={1.5}
                                                stroke="currentColor"
                                                className="w-5 h-5"
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
                                                className="w-5 h-5"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
                                                />
                                            </svg>
                                        )}
                                    </span>
                                </div>
                                <div className="bg-[#FAF9F6] dark:bg-[#212121] px-4 py-2 rounded-lg shadow-md">
                                    <span className="text-sm text-gray-500 dark:text-gray-400">
                                        Selamat datang,
                                    </span>
                                    <span className="ml-2 font-medium">
                                        {auth?.user?.name || "Guest"}
                                    </span>
                                </div>
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
