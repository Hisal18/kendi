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
            <div className="fixed inset-0 z-50 overflow-auto flex items-center justify-center bg-gray-500 bg-opacity-70 dark:bg-[#212121] dark:bg-opacity-70 backdrop-blur-sm p-4">
                <Transition
                    show={isOpen}
                    enter="transform transition-transform duration-300"
                    enterFrom="scale-95"
                    enterTo="scale-100"
                    leave="transform transition-transform duration-300"
                    leaveFrom="scale-100"
                    leaveTo="scale-95"
                >
                    <div className="w-full max-w-7xl p-4 sm:p-6 bg-white dark:bg-[#313131] rounded-lg shadow-lg">
                        <div className="flex items-center justify-between mb-4 sm:mb-6">
                            <h2 className="text-lg sm:text-xl font-semibold text-[#212121] dark:text-white">
                                {title}
                            </h2>
                            <button
                                className="p-1 sm:p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400"
                                onClick={onClose}
                            >
                                <HiX className="w-5 h-5 sm:w-6 sm:h-6" />
                            </button>
                        </div>
                        <div className="max-h-[70vh] px-1 overflow-y-auto text-[#212121] dark:text-gray-200">
                            {children}
                        </div>
                    </div>
                </Transition>
            </div>
        </Transition>
    );
};

export default ModalNew;
