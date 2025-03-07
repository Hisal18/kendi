import DashboardLayout from "@/Layouts/DashboardLayout";
import { Head, Link } from "@inertiajs/react";
import { useState, Fragment } from "react";
import { useForm } from "@inertiajs/react";
import debounce from "lodash/debounce";
import { router } from "@inertiajs/react";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaEdit, FaTrash, FaUserPlus, FaSearch, FaUser, FaEnvelope, FaLock, FaUserShield, FaCheck } from "react-icons/fa";
import { Dialog, Transition } from "@headlessui/react";

export default function User({ users, filters }) {
    const [editingUser, setEditingUser] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

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

    const createForm = useForm({
        name: "",
        email: "",
        password: "",
        password_confirmation: "",
        role: "user",
    });

    const editForm = useForm({
        name: "",
        email: "",
        password: "",
        password_confirmation: "",
        role: "",
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
                setShowModal(false);
                createForm.reset();
                toast.success("User berhasil ditambahkan", toastConfig);
            },
            onError: () => {
                toast.error("Gagal menambahkan user", toastConfig);
            }
        });
    };

    const submitEdit = (e) => {
        e.preventDefault();
        editForm.put(route("users.update", editingUser.id), {
            onSuccess: () => {
                setIsEditModalOpen(false);
                setEditingUser(null);
                editForm.reset();
                toast.success("User berhasil diperbarui", toastConfig);
            },
            onError: () => {
                toast.error("Gagal memperbarui user", toastConfig);
            }
        });
    };

    const handleDelete = (userId) => {
        if (confirm("Apakah Anda yakin ingin menghapus user ini?")) {
            router.delete(route("users.destroy", userId), {
                onSuccess: () => {
                    toast.success("User berhasil dihapus", toastConfig);
                },
                onError: () => {
                    toast.error("Gagal menghapus user", toastConfig);
                }
            });
        }
    };

    const openEditModal = (user) => {
        setEditingUser(user);
        editForm.setData({
            name: user.name,
            email: user.email,
            password: "",
            password_confirmation: "",
            role: user.role,
        });
        setIsEditModalOpen(true);
    };

    return (
        <>
            <Head title="User Management" />
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
                                onClick={() => {
                                    setIsEdit(false);
                                    setShowModal(true);
                                    createForm.reset();
                                }}
                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 flex items-center gap-2 transition-colors"
                            >
                                <FaUserPlus />
                                <span>Tambah User</span>
                            </button>
                        </div>

                        <div className="bg-white dark:bg-[#313131] overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="flex p-6 justify-between items-center border-b border-gray-200 dark:border-gray-700">
                                <div className="relative w-full md:w-1/3">
                                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                        <FaSearch className="text-gray-400" />
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="Cari user..."
                                        onChange={handleSearch}
                                        defaultValue={filters.search}
                                        className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-[#515151] dark:border-gray-600 dark:text-white transition-colors"
                                    />
                                </div>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                    <thead>
                                        <tr>
                                            <th className="px-6 py-3 bg-gray-50 dark:bg-[#414141] text-left">
                                                <span className="text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                    Nama
                                                </span>
                                            </th>
                                            <th className="px-6 py-3 bg-gray-50 dark:bg-[#414141] text-left">
                                                <span className="text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                    Email
                                                </span>
                                            </th>
                                            <th className="px-6 py-3 bg-gray-50 dark:bg-[#414141] text-left">
                                                <span className="text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                    Role
                                                </span>
                                            </th>
                                            
                                            <th className="px-6 py-3 bg-gray-50 dark:bg-[#414141] text-left">
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
                                                className="hover:bg-gray-100 dark:hover:bg-[#414141] transition-colors"
                                            >
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">
                                                    <div className="flex items-center">
                                                        <div className="flex-shrink-0 h-10 w-10 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
                                                            <FaUser className="text-gray-500 dark:text-gray-400" />
                                                        </div>
                                                        <div className="ml-4">
                                                            <div className="font-medium">{user.name}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">
                                                    {user.email}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                        user.role === "admin" 
                                                            ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300" 
                                                            : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                                                    }`}>
                                                        {user.role}
                                                    </span>
                                                </td>
                                                
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                    <div className="flex space-x-2">
                                                        <button
                                                            onClick={() => openEditModal(user)}
                                                            className="px-3 py-1 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-300 dark:hover:bg-blue-800 transition-colors flex items-center gap-1"
                                                        >
                                                            <FaEdit className="text-xs" />
                                                            <span>Edit</span>
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(user.id)}
                                                            className="px-3 py-1 bg-red-100 text-red-700 rounded-md hover:bg-red-200 dark:bg-red-900 dark:text-red-300 dark:hover:bg-red-800 transition-colors flex items-center gap-1"
                                                        >
                                                            <FaTrash className="text-xs" />
                                                            <span>Hapus</span>
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            
                            {/* Pagination */}
                            {users.links && (
                                <div className="px-6 py-4 bg-white dark:bg-[#313131] border-t border-gray-200 dark:border-gray-700">
                                    <div className="flex justify-between items-center">
                                        <div className="text-sm text-gray-500 dark:text-gray-400">
                                            Showing {users.from} to {users.to} of {users.total} users
                                        </div>
                                        <div className="flex space-x-1">
                                            {users.links.map((link, i) => (
                                                <button
                                                    key={i}
                                                    onClick={() => link.url && router.visit(link.url)}
                                                    className={`px-3 py-1 rounded ${
                                                        link.active
                                                            ? 'bg-blue-500 text-white'
                                                            : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                                                    } ${!link.url && 'opacity-50 cursor-not-allowed'}`}
                                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                                    disabled={!link.url}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </DashboardLayout>

            {/* Modal Tambah User */}
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
                                        className="text-lg font-medium leading-6 text-gray-900 dark:text-white mb-4 flex items-center"
                                    >
                                        <FaUserPlus className="mr-2 text-blue-500" />
                                        Tambah User Baru
                                    </Dialog.Title>

                                    <form
                                        onSubmit={submitCreate}
                                        className="space-y-4"
                                    >
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                Nama
                                            </label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                    <FaUser className="text-gray-400" />
                                                </div>
                                                <input
                                                    type="text"
                                                    value={createForm.data.name}
                                                    onChange={e => createForm.setData('name', e.target.value)}
                                                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-[#414141] dark:text-white"
                                                    placeholder="Masukkan nama lengkap"
                                                    required
                                                />
                                            </div>
                                            {createForm.errors.name && (
                                                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{createForm.errors.name}</p>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                Email
                                            </label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                    <FaEnvelope className="text-gray-400" />
                                                </div>
                                                <input
                                                    type="email"
                                                    value={createForm.data.email}
                                                    onChange={e => createForm.setData('email', e.target.value)}
                                                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-[#414141] dark:text-white"
                                                    placeholder="email@example.com"
                                                    required
                                                />
                                            </div>
                                            {createForm.errors.email && (
                                                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{createForm.errors.email}</p>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                Password
                                            </label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                    <FaLock className="text-gray-400" />
                                                </div>
                                                <input
                                                    type="password"
                                                    value={createForm.data.password}
                                                    onChange={e => createForm.setData('password', e.target.value)}
                                                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-[#414141] dark:text-white"
                                                    placeholder="Minimal 8 karakter"
                                                    required
                                                />
                                            </div>
                                            {createForm.errors.password && (
                                                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{createForm.errors.password}</p>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                Konfirmasi Password
                                            </label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                    <FaLock className="text-gray-400" />
                                                </div>
                                                <input
                                                    type="password"
                                                    value={createForm.data.password_confirmation}
                                                    onChange={e => createForm.setData('password_confirmation', e.target.value)}
                                                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-[#414141] dark:text-white"
                                                    placeholder="Ulangi password"
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                Role
                                            </label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                    <FaUserShield className="text-gray-400" />
                                                </div>
                                                <select
                                                    value={createForm.data.role}
                                                    onChange={e => createForm.setData('role', e.target.value)}
                                                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-[#414141] dark:text-white"
                                                    required
                                                >
                                                    <option value="user">User</option>
                                                    <option value="admin">Admin</option>
                                                </select>
                                            </div>
                                            {createForm.errors.role && (
                                                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{createForm.errors.role}</p>
                                            )}
                                        </div>

                                        <div className="mt-6 flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                                            <button
                                                type="button"
                                                onClick={() => setShowModal(false)}
                                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md shadow-sm hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600"
                                            >
                                                Batal
                                            </button>
                                            <button
                                                type="submit"
                                                disabled={createForm.processing}
                                                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 flex items-center"
                                            >
                                                {createForm.processing ? (
                                                    <>
                                                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                        </svg>
                                                        <span>Menyimpan...</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <FaCheck className="mr-2" />
                                                        <span>Simpan</span>
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </form>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>

            {/* Modal Edit User */}
            <Transition appear show={isEditModalOpen} as={Fragment}>
                <Dialog
                    as="div"
                    className="relative z-50"
                    onClose={() => setIsEditModalOpen(false)}
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
                                        className="text-lg font-medium leading-6 text-gray-900 dark:text-white mb-4 flex items-center"
                                    >
                                        <FaEdit className="mr-2 text-blue-500" />
                                        Edit User
                                    </Dialog.Title>

                                    <form
                                        onSubmit={submitEdit}
                                        className="space-y-4"
                                    >
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                Nama
                                            </label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                    <FaUser className="text-gray-400" />
                                                </div>
                                                <input
                                                    type="text"
                                                    value={editForm.data.name}
                                                    onChange={e => editForm.setData('name', e.target.value)}
                                                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-[#414141] dark:text-white"
                                                    placeholder="Masukkan nama lengkap"
                                                    required
                                                />
                                            </div>
                                            {editForm.errors.name && (
                                                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{editForm.errors.name}</p>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                Email
                                            </label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                    <FaEnvelope className="text-gray-400" />
                                                </div>
                                                <input
                                                    type="email"
                                                    value={editForm.data.email}
                                                    onChange={e => editForm.setData('email', e.target.value)}
                                                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-[#414141] dark:text-white"
                                                    placeholder="email@example.com"
                                                    required
                                                />
                                            </div>
                                            {editForm.errors.email && (
                                                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{editForm.errors.email}</p>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                Password (Opsional)
                                            </label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                    <FaLock className="text-gray-400" />
                                                </div>
                                                <input
                                                    type="password"
                                                    value={editForm.data.password}
                                                    onChange={e => editForm.setData('password', e.target.value)}
                                                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-[#414141] dark:text-white"
                                                    placeholder="Kosongkan jika tidak ingin mengubah"
                                                />
                                            </div>
                                            {editForm.errors.password && (
                                                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{editForm.errors.password}</p>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                Konfirmasi Password
                                            </label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                    <FaLock className="text-gray-400" />
                                                </div>
                                                <input
                                                    type="password"
                                                    value={editForm.data.password_confirmation}
                                                    onChange={e => editForm.setData('password_confirmation', e.target.value)}
                                                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-[#414141] dark:text-white"
                                                    placeholder="Ulangi password"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                Role
                                            </label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                    <FaUserShield className="text-gray-400" />
                                                </div>
                                                <select
                                                    value={editForm.data.role}
                                                    onChange={e => editForm.setData('role', e.target.value)}
                                                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-[#414141] dark:text-white"
                                                    required
                                                >
                                                    <option value="user">User</option>
                                                    <option value="admin">Admin</option>
                                                </select>
                                            </div>
                                            {editForm.errors.role && (
                                                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{editForm.errors.role}</p>
                                            )}
                                        </div>

                                        <div className="mt-6 flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                                            <button
                                                type="button"
                                                onClick={() => setIsEditModalOpen(false)}
                                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md shadow-sm hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600"
                                            >
                                                Batal
                                            </button>
                                            <button
                                                type="submit"
                                                disabled={editForm.processing}
                                                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 flex items-center"
                                            >
                                                {editForm.processing ? (
                                                    <>
                                                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                        </svg>
                                                        <span>Menyimpan...</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <FaCheck className="mr-2" />
                                                        <span>Simpan Perubahan</span>
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </form>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>

            <ToastContainer
                position="top-right"
                autoClose={2000}
                hideProgressBar={false}
                newestOnTop
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />
        </>
    );
}
                                                