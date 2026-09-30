import {
    Form, Link, redirect, useActionData, useNavigation,
    type ClientActionFunctionArgs,
} from "react-router";
import { authController } from "~/frontEnd/controllers/authController";
import { AlertCircle, Bird, Lock, LogIn, Mail, MapPin, UserPlus } from "lucide-react";

export async function clientLoader() {
    await authController.redirectIfLoggedIn();
    return null;
}

export async function clientAction({ request }: ClientActionFunctionArgs) {
    const form = await request.formData();
    const page = await authController.login(
        String(form.get("email") ?? ""),
        String(form.get("password") ?? ""),
    );
    if (!page.error) return redirect("/");
    return page;
}

export default function Login() {
    const page = useActionData<typeof clientAction>();
    const busy = useNavigation().state === "submitting";

    return (
        <div className="app-shell relative min-h-screen overflow-hidden bg-[#08283a]">
            <div className="court-grid" aria-hidden="true" />
            <div className="orb orb-lime" aria-hidden="true" />
            <div className="orb orb-yellow" aria-hidden="true" />

            <header className="relative z-10 w-full px-5 pt-6 sm:px-8 lg:px-12 lg:pt-8">
                <div className="mx-auto flex max-w-6xl items-center justify-between">
                    <Link to="/" className="inline-flex items-center gap-2 rounded-lg" aria-label="BadminKuy home">
                        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#c8f24d] text-[#08283a] shadow-lg shadow-black/10">
                            <Bird size={20} aria-hidden="true" />
                        </span>
                        <span className="wordmark text-base font-bold text-white">BadminKuy</span>
                    </Link>
                </div>
            </header>

            <main className="relative z-10 flex w-full items-center px-5 pb-10 pt-8 sm:px-8 lg:px-12 lg:pb-14 lg:pt-12">
                <section className="welcome-card relative mx-auto grid w-full max-w-6xl overflow-hidden rounded-[2rem] bg-[#f3f6f5] md:grid-cols-2">
                    <div className="relative flex flex-col justify-center px-7 py-10 sm:px-10 md:px-12 lg:py-14">
                        <span className="mb-5 inline-flex w-fit items-center gap-2 rounded-full bg-[#dff8e6] px-3 py-1.5 text-xs font-bold uppercase tracking-[0.12em] text-[#08283a]">
                            Your badminton home
                        </span>
                        <h1 className="max-w-lg text-[32px] font-bold leading-[1.05] text-[#08283a]">
                            Welcome back!
                        </h1>
                        <p className="mt-3 max-w-lg text-base leading-relaxed text-[#35525f]">
                            Sign in to join upcoming games, book courts, and connect with local players.
                        </p>

                        {/* Login Form */}
                        <Form method="post" className="mt-6 flex flex-col gap-4">
                            {page?.error && (
                                <div role="alert" className="flex items-center gap-2.5 rounded-xl bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm font-medium text-red-600 animate-in fade-in slide-in-from-top-1">
                                    <AlertCircle size={18} className="shrink-0 text-red-500" />
                                    <span>{page.error}</span>
                                </div>
                            )}

                            {/* Email Input */}
                            <div className="group relative">
                                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400 group-focus-within:text-[#08283a] transition-colors">
                                    <Mail size={18} />
                                </div>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    placeholder=" "
                                    className="peer w-full rounded-xl border-2 border-gray-200 bg-white/80 pb-2.5 pt-6 pl-11 pr-4 text-sm font-semibold text-[#08283a] shadow-sm transition-all duration-200 placeholder-transparent hover:border-gray-300 focus:border-[#08283a] focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#08283a]/10"
                                />
                                <label
                                    htmlFor="email"
                                    className="pointer-events-none absolute left-11 pt-1 text-xs font-bold uppercase tracking-wider text-gray-400 transition-all duration-200 peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-sm peer-placeholder-shown:font-medium peer-placeholder-shown:normal-case peer-placeholder-shown:tracking-normal peer-focus:top-2 peer-focus:text-xs peer-focus:font-bold peer-focus:uppercase peer-focus:tracking-wider peer-focus:text-[#08283a]"
                                >
                                    Email Address
                                </label>
                            </div>

                            {/* Password Input */}
                            <div className="group relative">
                                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400 group-focus-within:text-[#08283a] transition-colors">
                                    <Lock size={18} />
                                </div>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="current-password"
                                    required
                                    placeholder=" "
                                    className="peer w-full rounded-xl border-2 border-gray-200 bg-white/80 pb-2.5 pt-6 pl-11 pr-4 text-sm font-semibold text-[#08283a] shadow-sm transition-all duration-200 placeholder-transparent hover:border-gray-300 focus:border-[#08283a] focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#08283a]/10"
                                />
                                <label
                                    htmlFor="password"
                                    className="pointer-events-none absolute left-11 pt-1 text-xs font-bold uppercase tracking-wider text-gray-400 transition-all duration-200 peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-sm peer-placeholder-shown:font-medium peer-placeholder-shown:normal-case peer-placeholder-shown:tracking-normal peer-focus:top-2 peer-focus:text-xs peer-focus:font-bold peer-focus:uppercase peer-focus:tracking-wider peer-focus:text-[#08283a]"
                                >
                                    Password
                                </label>
                            </div>

                            {/* Actions */}
                            <div className="mt-2 flex flex-col gap-3 sm:flex-row">
                                <button
                                    type="submit"
                                    disabled={busy}
                                    className="action-button inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-[#08283a] px-6 py-3 font-bold text-white shadow-lg shadow-[#08283a]/20 transition-all hover:bg-[#08283a]/90 active:scale-[0.98] disabled:opacity-60"
                                >
                                    <LogIn size={18} aria-hidden="true" />
                                    <span>{busy ? "Signing in..." : "Log in"}</span>
                                </button>
                                <Link
                                    to="/register"
                                    className="action-button inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#c8f24d] px-6 py-3 font-bold text-[#08283a] shadow-lg shadow-[#c8f24d]/20 transition-all hover:bg-[#b8e23d] active:scale-[0.98]"
                                >
                                    <UserPlus size={18} aria-hidden="true" />
                                    <span>Register</span>
                                </Link>
                            </div>
                        </Form>
                    </div>

                    <div className="photo-panel relative min-h-[22rem] overflow-hidden md:min-h-full">
                        <img
                            className="absolute inset-0 h-full w-full object-cover"
                            src="https://images.pexels.com/photos/6307230/pexels-photo-6307230.jpeg"
                            alt="Badminton rackets and shuttlecocks"
                            loading="lazy"
                        />
                        <div className="relative z-10 flex h-full min-h-[22rem] flex-col justify-between p-6 sm:p-8">
                            <div className="w-fit rounded-full bg-[#c8f24d] px-3 py-1.5 text-xs font-bold uppercase tracking-[0.11em] text-[#08283a]">
                                Play your way
                            </div>
                            <div className="max-w-xs rounded-2xl bg-[#08283a]/90 p-5 text-white shadow-xl backdrop-blur-sm">
                                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-[#ffcf4a] text-[#08283a]">
                                    <MapPin size={20} aria-hidden="true" />
                                </div>
                                <p className="text-lg font-bold">Your local rally starts here</p>
                                <p className="mt-1 text-sm leading-relaxed text-[#dff8e6]">
                                    Courts, clubs, and friendly matches are waiting nearby.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}