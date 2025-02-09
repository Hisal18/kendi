import ApplicationLogo from "@/Components/ApplicationLogo";
import Checkbox from "@/Components/Checkbox";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import GuestLayout from "@/Layouts/GuestLayout";
import { Head, Link, useForm } from "@inertiajs/react";

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: "",
        password: "",
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();

        post(route("login"), {
            onFinish: () => reset("password"),
        });
    };

    return (
        <GuestLayout>
            <Head title="Log in" />

            <div className="flex flex-col items-center">
                <ApplicationLogo className="block h-40 w-auto fill-current text-gray-900 dark:text-white" />
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                    Kendaraan Dinas
                </h1>

                {status && (
                    <div className="mb-4 text-sm font-medium text-green-600 bg-green-50 dark:bg-green-900/50 dark:text-green-400 px-4 py-2 rounded-lg w-full">
                        {status}
                    </div>
                )}

                <form
                    onSubmit={submit}
                    className="w-full max-w-md p-8"
                >
                    <div>
                        <InputLabel
                            htmlFor="email"
                            value="Email"
                            className="text-gray-900 dark:text-white"
                        />

                        <TextInput
                            id="email"
                            type="email"
                            name="email"
                            value={data.email}
                            className="mt-1 block w-full rounded-lg bg-[#efefef] border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:border-blue-500 focus:ring-blue-500 dark:focus:border-blue-400 dark:focus:ring-blue-400"
                            autoComplete="username"
                            isFocused={true}
                            onChange={(e) => setData("email", e.target.value)}
                        />

                        <InputError message={errors.email} className="mt-2" />
                    </div>

                    <div className="mt-6">
                        <InputLabel
                            htmlFor="password"
                            value="Password"
                            className="text-gray-900 dark:text-white"
                        />

                        <TextInput
                            id="password"
                            type="password"
                            name="password"
                            value={data.password}
                            className="mt-1 block w-full rounded-lg bg-[#efefef] border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:border-blue-500 focus:ring-blue-500 dark:focus:border-blue-400 dark:focus:ring-blue-400"
                            autoComplete="current-password"
                            onChange={(e) =>
                                setData("password", e.target.value)
                            }
                        />

                        <InputError
                            message={errors.password}
                            className="mt-2"
                        />
                    </div>

                    <div className="mt-6 flex items-center justify-between">
                        <label className="flex items-center">
                            <Checkbox
                                name="remember"
                                checked={data.remember}
                                onChange={(e) =>
                                    setData("remember", e.target.checked)
                                }
                                className="h-5 w-5 rounded-md bg-[#efefef] border-2 border-gray-300 dark:border-gray-700 text-blue-600 dark:text-blue-400 transition-colors duration-200 ease-in-out hover:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
                            />
                            <span className="ms-2 text-sm text-gray-700 dark:text-gray-300">
                                Remember me
                            </span>
                        </label>

                        {canResetPassword && (
                            <Link
                                href={route("password.request")}
                                className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:underline"
                            >
                                Lupa password?
                            </Link>
                        )}
                    </div>

                    <PrimaryButton
                        className="mt-6 w-full justify-center py-3 bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-400"
                        disabled={processing}
                    >
                        Masuk
                    </PrimaryButton>

                    <p className="mt-6 text-center text-sm text-gray-700 dark:text-gray-300">
                        Belum punya akun?{" "}
                        <Link
                            href={route("register")}
                            className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:underline"
                        >
                            Daftar disini
                        </Link>
                    </p>
                </form>
            </div>
        </GuestLayout>
    );
}
