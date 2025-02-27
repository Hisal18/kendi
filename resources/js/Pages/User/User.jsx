import DashboardLayout from "@/Layouts/DashboardLayout";
import { Head, Link } from "@inertiajs/react";
import { useState, Fragment } from "react";
import { useForm } from "@inertiajs/react";
import Modal from "@/Components/Modal";
import TextInput from "@/Components/TextInput";
import InputLabel from "@/Components/InputLabel";
import InputError from "@/Components/InputError";
import debounce from "lodash/debounce";
import { router } from "@inertiajs/react";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaEdit, FaTrash, FaUserPlus, FaSearch } from "react-icons/fa";
import PrimaryButton from "@/Components/PrimaryButton";
import { Dialog, Transition } from "@headlessui/react";

export default function User({ users, filters }) {
    const [editingUser, setEditingUser] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const { data, setData, post, processing, errors, reset } = useForm({
        name: "",
        email: "",
        password: "",
        password_confirmation: "",
    });

    const submit = (e) => {
        e.preventDefault();

        post(route("register"), {
            onFinish: () => reset("password", "password_confirmation"),
        });
    };

    const createForm = useForm({
        name: "",
        email: "",
        password: "",
        role: "user",
        status: "active",
    });

    const editForm = useForm({
        name: "",
        email: "",
        password: "",
        role: "",
        status: "",
    });

    const debouncedSearch = debounce((query) => {
        router.get(
            route("user.index"),
            { search: query },
            {
                preserveState: true,
                preserveScroll: true,
                replace: true,
                only: ["users"],
            }
        );
    }, 300);

    const handleSearch = (e) => {
        debouncedSearch(e.target.value);
    };

    const submitCreate = (e) => {
        e.preventDefault();
        createForm.post(route("users.store"), {
            onSuccess: () => {
                setIsCreateModalOpen(false);
                createForm.reset();
            },
        });
    };

    const submitEdit = (e) => {
        e.preventDefault();
        editForm.put(route("users.update", editingUser.id), {
            onSuccess: () => {
                setIsEditModalOpen(false);
                setEditingUser(null);
                editForm.reset();
            },
        });
    };

    const handleDelete = (userId) => {
        if (confirm("Apakah Anda yakin ingin menghapus user ini?")) {
            router.delete(route("users.destroy", userId));
        }
    };

    // Konfigurasi toast
    const toastConfig = {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
    };

    return (
        <>
            <Head title="User" />
            <DashboardLayout>
                <div className="py-2 dark:bg-[#212121]">
                    <div className="w-full mx-auto sm:px-6 lg:px-0">
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                                    Manajemen User
                                </h2>
                                <p className="mt-1 text-gray-600 dark:text-gray-400">
                                    Kelola semua pengguna sistem
                                </p>
                            </div>
                            <button
                                onClick={() => setShowModal(true)}
                                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                Tambah User
                            </button>
                        </div>

                        <div className="bg-white dark:bg-[#313131] overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="flex p-6 justify-between items-center">
                                <div className="w-1/3">
                                    <input
                                        type="text"
                                        placeholder="Cari user..."
                                        onChange={handleSearch}
                                        defaultValue={filters.search}
                                        className="w-full px-4 py-2 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500 dark:bg-[#515151] dark:border-gray-600 dark:text-white"
                                    />
                                </div>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                    <thead>
                                        <tr>
                                            <th className="px-6 py-3 bg-gray-50 dark:bg-[#717171] text-left">
                                                <span className="text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                    Nama
                                                </span>
                                            </th>
                                            <th className="px-6 py-3 bg-gray-50 dark:bg-[#717171] text-left">
                                                <span className="text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                    Email
                                                </span>
                                            </th>
                                            <th className="px-6 py-3 bg-gray-50 dark:bg-[#717171] text-left">
                                                <span className="text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                    Role
                                                </span>
                                            </th>
                                            
                                            <th className="px-6 py-3 bg-gray-50 dark:bg-[#717171] text-left">
                                                <span className="text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                    Aksi
                                                </span>
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200 dark:bg-[#313131] dark:divide-gray-700">
                                        {users.data.map((user) => (
                                            <tr
                                                key={user.id}
                                                className="hover:bg-gray-100 dark:hover:bg-[#515151]"
                                            >
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {user.name}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {user.email}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-md ${user.role === "admin" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                                                        {user.role}
                                                    </span>
                                                </td>
                                                
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                    <button
                                                        onClick={() => {
                                                            setEditingUser(
                                                                user
                                                            );
                                                            setIsEditModalOpen(
                                                                true
                                                            );
                                                        }}
                                                        className="text-indigo-600 hover:text-indigo-900 mr-4"
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() =>
                                                            handleDelete(
                                                                user.id
                                                            )
                                                        }
                                                        className="text-red-600 hover:text-red-900"
                                                    >
                                                        Hapus
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </DashboardLayout>

            <Transition appear show={showModal} as={Fragment}>
                <Dialog
                    as="div"
                    className="relative z-50"
                    onClose={() => setShowModal(false)}
                >
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-gray-500 backdrop-blur-sm bg-opacity-70" />
                    </Transition.Child>

                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center p-4 text-center">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white dark:bg-[#313131] p-6 text-left align-middle shadow-xl transition-all">
                                    <Dialog.Title
                                        as="h3"
                                        className="text-lg font-medium leading-6 text-gray-900 dark:text-white mb-4"
                                    >
                                        {isEdit
                                            ? "Edit Kendaraan"
                                            : "Tambah Kendaraan Baru"}
                                    </Dialog.Title>

                                    <form
                                        onSubmit={submit}
                                        className="space-y-4"
                                    ></form>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
            <ToastContainer />
        </>
    );
}
