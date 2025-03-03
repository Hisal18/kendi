import ApplicationLogo from "@/Components/ApplicationLogo";
import { Head } from "@inertiajs/react";

export default function Home() {
    return (
        <>
            <Head title="Home" />
            <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
                {/* Hero Section dengan Background PLN Style */}
                <div className="relative h-screen bg-gradient-to-br from-blue-100 to-blue-600 overflow-hidden">
                    {/* Background Patterns */}
                    <div className="absolute inset-0 bg-[url('/img/patern.png')] opacity-20"></div>

                    {/* Geometric Shapes */}
                    <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
                    <div className="absolute top-40 right-10 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
                    <div className="absolute -bottom-8 left-20 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>

                    {/* Circuit Board Pattern */}
                    <div className="absolute inset-0 bg-[url('/img/circuit-board.svg')] opacity-5"></div>

                    {/* Main Content - Centered Vertically and Horizontally */}
                    <div className="relative h-full flex items-center justify-center">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            <div className="text-center">
                                <ApplicationLogo className="block h-20 w-auto mx-auto mb-8" />
                                <h1 className="text-4xl p-0 bg-gradient-to-r from-indigo-600 to-blue-500 text-transparent bg-clip-text animate-slide">
                                    <span className="block font-extrabold">
                                        Sistem Monitoring
                                    </span>
                                    <span className="block text-gray-200 font-bold mt-2">
                                        Kendaraan Dinas PLN
                                    </span>
                                </h1>
                                <p className="mt-6 max-w-md mx-auto text-base text-blue-100 sm:text-lg md:mt-8 md:text-xl md:max-w-3xl">
                                    Pantau dan kelola penggunaan kendaraan dinas
                                    dengan mudah, efisien, dan transparan
                                </p>
                                <div className="mt-8 max-w-md mx-auto sm:flex sm:justify-center md:mt-10 gap-4">
                                    <div className="rounded-md shadow">
                                        <a
                                            href="/dashboard"
                                            className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-xl text-blue-700 bg-white hover:bg-blue-50 transform hover:scale-105 transition duration-300 md:py-4 md:text-lg md:px-10"
                                        >
                                            <svg
                                                className="w-5 h-5 mr-2"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="2"
                                                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                                />
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="2"
                                                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                                />
                                            </svg>
                                            Lihat Daftar Kendaraan
                                        </a>
                                    </div>
                                </div>

                                {/* Stats Section */}
                                <div className="mt-16 grid grid-cols-1 gap-5 sm:grid-cols-3 mx-auto max-w-screen-lg">
                                    <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
                                        <dt className="text-sm font-medium text-blue-100 truncate">
                                            Total Kendaraan
                                        </dt>
                                        <dd className="mt-1 text-3xl font-semibold text-white">
                                            50+
                                        </dd>
                                    </div>
                                    <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
                                        <dt className="text-sm font-medium text-blue-100 truncate">
                                            Kendaraan Aktif
                                        </dt>
                                        <dd className="mt-1 text-3xl font-semibold text-white">
                                            35
                                        </dd>
                                    </div>
                                    <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
                                        <dt className="text-sm font-medium text-blue-100 truncate">
                                            Peminjaman Bulan Ini
                                        </dt>
                                        <dd className="mt-1 text-3xl font-semibold text-white">
                                            120
                                        </dd>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Animated Wave Pattern */}
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
                                />
                                <use
                                    href="#wave"
                                    x="48"
                                    y="3"
                                    fill="rgba(255,255,255,0.5)"
                                />
                                <use
                                    href="#wave"
                                    x="48"
                                    y="5"
                                    fill="rgba(255,255,255,0.3)"
                                />
                                <use
                                    href="#wave"
                                    x="48"
                                    y="7"
                                    fill="rgba(255,255,255,0.2)"
                                />
                            </g>
                        </svg>
                    </div>
                </div>

                {/* Feature Section dengan Card Modern */}
                <div className="py-16 bg-[rgba(255,255,255,0.7)] bg-opacity-70 backdrop-blur-xl">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                            {/* Feature 1 */}
                            <div className="group p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                                <div className="flex items-center justify-center w-14 h-14 mb-6 rounded-full bg-gradient-to-r from-blue-700 to-blue-500">
                                    <svg
                                        className="w-7 h-7 text-white"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                                        ></path>
                                    </svg>
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-700 transition-colors duration-300">
                                    Pencatatan Digital
                                </h3>
                                <p className="mt-4 text-gray-600 leading-relaxed">
                                    Sistem pencatatan digital untuk peminjaman
                                    dan pengembalian kendaraan dinas yang akurat
                                    dan terorganisir.
                                </p>
                            </div>

                            {/* Feature 2 */}
                            <div className="group p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                                <div className="flex items-center justify-center w-14 h-14 mb-6 rounded-full bg-gradient-to-r from-blue-600 to-red-500">
                                    <svg
                                        className="w-7 h-7 text-white"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                                        ></path>
                                    </svg>
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-300">
                                    Monitoring Real-time
                                </h3>
                                <p className="mt-4 text-gray-600 leading-relaxed">
                                    Pantau status dan lokasi kendaraan dinas
                                    secara real-time untuk memastikan penggunaan
                                    yang efisien.
                                </p>
                            </div>

                            {/* Feature 3 */}
                            <div className="group p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                                <div className="flex items-center justify-center w-14 h-14 mb-6 rounded-full bg-gradient-to-r from-red-500 to-red-600">
                                    <svg
                                        className="w-7 h-7 text-white"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                                        ></path>
                                    </svg>
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 group-hover:text-red-600 transition-colors duration-300">
                                    Manajemen Mudah
                                </h3>
                                <p className="mt-4 text-gray-600 leading-relaxed">
                                    Kelola peminjaman, perawatan, dan laporan
                                    penggunaan kendaraan dinas dengan sistem
                                    yang terintegrasi.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
