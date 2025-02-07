import React, { useState, useEffect } from "react";
import Sidebar from "../Components/Sidebar";
import Header from "../Components/Header";
import Footer from "../Components/Footer";

const DashboardLayout = ({ children }) => {
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
        setIsDarkMode((prev) => !prev);
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
                    <div className="">{children}</div>
                </main>
                {/* <Footer /> */}
            </div>
        </div>
    );
};

export default DashboardLayout;
