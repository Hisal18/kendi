import React from "react";
import { Transition } from "@headlessui/react";
import { HiX } from "react-icons/hi";

const ModalNew = ({ isOpen, onClose, title, children }) => {
    return (
        <Transition
            show={isOpen}
            enter="transition-opacity duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
        >
            <div className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center bg-black bg-opacity-50 dark:bg-black dark:bg-opacity-60 backdrop-blur-sm">
                <Transition
                    show={isOpen}
                    enter="transform transition-transform duration-300"
                    enterFrom="scale-95"
                    enterTo="scale-100"
                    leave="transform transition-transform duration-300"
                    leaveFrom="scale-100"
                    leaveTo="scale-95"
                >
                    <div className="relative w-full h-screen sm:h-auto max-w-7xl mx-auto sm:mx-4 bg-white dark:bg-gray-800 rounded-none sm:rounded-lg shadow-xl flex flex-col">
                        <div className="flex-none bg-white dark:bg-gray-800 sm:rounded-t-lg border-b border-gray-200 dark:border-gray-700">
                            <div className="flex items-center justify-between p-3 sm:p-6">
                                <h2 className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-gray-100">
                                    {title}
                                </h2>
                                <button
                                    className="p-1 sm:p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white transition-colors"
                                    onClick={onClose}
                                >
                                    <HiX className="w-5 h-5 sm:w-6 sm:h-6" />
                                </button>
                            </div>
                        </div>
                        <div className="flex-1 overflow-hidden">
                            <div className="h-[calc(100vh-4rem)] sm:h-auto sm:max-h-[calc(100vh-8rem)] overflow-y-auto p-3 sm:p-6 text-gray-800 dark:text-gray-200">
                                {children}
                            </div>
                        </div>
                    </div>
                </Transition>
            </div>
        </Transition>
    );
};

export default ModalNew;
