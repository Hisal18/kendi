import React, { useState } from "react";
import { usePage } from "@inertiajs/react";
import { HiBell, HiOutlineCog, HiOutlineLogout } from "react-icons/hi";

const Header = ({ onToggleDarkMode, isDarkMode }) => {
    const { auth } = usePage().props;
    const [showDropdown, setShowDropdown] = useState(false);

    return (
        <div className="container mx-auto px-4 py-4 lg:px-6">
            <div className="flex items-center justify-between">
                {/* Nama dan Badge Admin */}
                <div className="flex flex-col lg:flex-row lg:items-center lg:space-x-4">
                    <div
                        className={`text-xl lg:text-2xl font-bold bg-gradient-to-r from-indigo-600 to-blue-500 text-transparent bg-clip-text ${
                            isDarkMode ? "text-white" : ""
                        }`}
                    >
                        Selamat Datang,
                    </div>
                    <span
                        className={`mt-1 lg:mt-0 px-3 py-1 text-sm rounded-full w-fit ${
                            isDarkMode
                                ? "bg-gray-700 text-gray-200"
                                : "bg-white/20 text-gray-700"
                        }`}
                    >
                        Administrator
                    </span>
                </div>

                {/* Tombol Dark Mode dan Profile */}
                <div className="flex items-center space-x-4">
                    <button
                        onClick={onToggleDarkMode}
                        className={`p-2 rounded-lg ${
                            isDarkMode
                                ? "bg-gray-700 text-yellow-300 hover:bg-gray-600"
                                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                        }`}
                    >
                        {isDarkMode ? "☀️" : "🌙"}
                    </button>

                    <div className="relative">
                        <button
                            onClick={() => setShowDropdown(!showDropdown)}
                            className="flex items-center space-x-3 focus:outline-none"
                        >
                            <div className="h-8 w-8 lg:h-10 lg:w-10 rounded-full overflow-hidden ring-2 ring-white hover:ring-gray-200 transition-all">
                                <div className="h-full w-full bg-gradient-to-br from-pink-500 to-violet-500 flex items-center justify-center text-white font-bold text-lg">
                                    {auth?.user?.name?.charAt(0) || "A"}
                                </div>
                            </div>
                        </button>

                        {showDropdown && (
                            <div
                                className={`absolute right-0 mt-2 w-48 rounded-lg shadow-xl py-2 z-50 ${
                                    isDarkMode ? "bg-gray-700" : "bg-white"
                                }`}
                            >
                                <a
                                    href="#"
                                    className={`flex items-center px-4 py-2 hover:bg-gray-100 ${
                                        isDarkMode
                                            ? "text-gray-200 hover:bg-gray-600"
                                            : "text-gray-700"
                                    }`}
                                >
                                    <HiOutlineCog className="mr-3" />
                                    Pengaturan
                                </a>
                                <a
                                    href="#"
                                    className={`flex items-center px-4 py-2 text-red-600 hover:bg-gray-100 ${
                                        isDarkMode ? "hover:bg-gray-600" : ""
                                    }`}
                                >
                                    <HiOutlineLogout className="mr-3" />
                                    Keluar
                                </a>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Header;
