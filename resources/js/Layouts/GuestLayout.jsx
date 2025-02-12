export default function GuestLayout({ children }) {
    return (
        <div className="flex flex-col h-screen items-center bg-[#e8e8e8] dark:bg-gray-900 pt-6 sm:justify-center sm:pt-0">
            <div className="mt-6 w-full overflow-hidden bg-[#e0e0e0] dark:bg-gray-800 px-6 py-4 sm:max-w-md sm:rounded-lg shadow-[15px_15px_30px_#bebebe,_-15px_-15px_30px_#ffffff]">
                {children}
            </div>
        </div>
    );
}
