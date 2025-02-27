import { Toaster } from "react-hot-toast";

export default function GuestLayout({ children }) {
    return (
        <div className="flex flex-col h-screen items-center bg-[#d9d9d9] dark:bg-gray-900 pt-6 sm:justify-center sm:pt-0 relative">
            <Toaster position="top-right" />
            <div className="mt-6 w-full overflow-hidden bg-[#e0e0e0] dark:bg-gray-800 px-6 py-4 sm:max-w-md sm:rounded-lg shadow-[15px_15px_30px_#bebebe,_-15px_-15px_30px_#d2d2d2] dark:shadow-[-1px_-1px_10px_rgba(255,255,255,0.4),_3px_3px_10px_rgba(0,0,0,1)] relative z-10">
                {children}
            </div>

            <div className="absolute bottom-0 left-0 right-0">
                <svg
                    className="waves"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 24 150 28"
                    preserveAspectRatio="none"
                >
                    <defs>
                        <path
                            id="wave"
                            d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z"
                        />
                    </defs>
                    <g className="wave-parallax">
                        <use
                            href="#wave"
                            x="48"
                            y="0"
                            fill="rgba(255,255,255,0.7)"
                            className="dark:fill-white/7"
                        />
                        <use
                            href="#wave"
                            x="48"
                            y="3"
                            fill="rgba(255,255,255,0.5)"
                            className="dark:fill-white/5"
                        />
                        <use
                            href="#wave"
                            x="48"
                            y="5"
                            fill="rgba(255,255,255,0.3)"
                            className="dark:fill-white/3"
                        />
                        <use
                            href="#wave"
                            x="48"
                            y="7"
                            fill="rgba(255,255,255,0.2)"
                            className="dark:fill-white/2"
                        />
                    </g>
                </svg>
            </div>
        </div>
    );
}
