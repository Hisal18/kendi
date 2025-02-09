import React from "react";

export default function Footer() {
    return (
        <footer className="bg-transparent flex items-center justify-center mt-4">
            <div className="container px-6 py-2 flex items-center justify-center">
                <div className="text-gray-600">
                    mfff &copy; {new Date().getFullYear()} Dashboard Template. All rights reserved.
                </div>
            </div>
        </footer>
    );
};
