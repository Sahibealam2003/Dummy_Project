import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import { loginSuccess, signupSuccess } from "../reducers/authSlice";

const FIELD_CLS = "w-full rounded-xl border border-[#e4dfd9] bg-[#fafafa] px-4 py-2.5 text-sm text-[#2c2420] placeholder-[#a69c93] outline-none focus:bg-[#fafafa] focus:border-[#e8622a] focus:ring-4 focus:ring-[#e8622a]/10 transition-all duration-200";
const LABEL_CLS = "block text-xs font-semibold uppercase tracking-wider text-[#8c7e74] mb-1.5";

const Login = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const redirectUrl = searchParams.get("redirect") || "/";

    const tabParam = searchParams.get("tab");
    const [isLoginTab, setIsLoginTab] = useState(tabParam !== "signup");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    // Sync tab from URL query params
    React.useEffect(() => {
        const tab = searchParams.get("tab");
        if (tab === "signup") {
            setIsLoginTab(false);
        } else if (tab === "login") {
            setIsLoginTab(true);
        }
    }, [searchParams]);

    // Initialize mock db with a default user if empty
    React.useEffect(() => {
        const users = localStorage.getItem("shopx_registered_users");
        if (!users) {
            const defaultUser = {
                name: "Demo User",
                email: "user@example.com",
                password: "password",
            };
            localStorage.setItem("shopx_registered_users", JSON.stringify([defaultUser]));
        }
    }, []);

    const getRegisteredUsers = () => {
        try {
            return JSON.parse(localStorage.getItem("shopx_registered_users")) || [];
        } catch (e) {
            return [];
        }
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        setError("");
        setSuccessMessage("");

        const users = getRegisteredUsers();

        if (isLoginTab) {
            // Login flow
            const foundUser = users.find(
                (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
            );

            if (foundUser) {
                dispatch(loginSuccess({ name: foundUser.name, email: foundUser.email }));
                setSuccessMessage("Logged in successfully! Redirecting...");
                setTimeout(() => navigate(redirectUrl), 1200);
            } else {
                setError("Invalid email address or password.");
            }
        } else {
            // Signup flow
            if (!name.trim()) {
                setError("Please enter your name.");
                return;
            }
            if (users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
                setError("Email is already registered. Please log in.");
                return;
            }

            const newUser = { name, email, password };
            users.push(newUser);
            localStorage.setItem("shopx_registered_users", JSON.stringify(users));

            dispatch(signupSuccess({ name: newUser.name, email: newUser.email }));
            setSuccessMessage("Account created successfully! Redirecting...");
            setTimeout(() => navigate(redirectUrl), 1200);
        }
    };

    return (
        <div style={{ background: "#ffffff", height: "calc(100vh - 104px)" }} className="flex flex-col md:flex-row overflow-hidden">
            {/* Left Column: Form */}
            <div className="flex-1 flex flex-col justify-center items-center px-6 sm:px-12 md:px-16 lg:px-20 bg-white/80 backdrop-blur-lg overflow-hidden rounded-xl shadow-xl">
                <div className="w-full max-w-[340px] py-2">
                    {/* Logo & Welcome text */}
                    <div className="mb-3">
                        <div className="flex items-center gap-0.5 select-none mb-2">
                            <span className="text-xl font-black tracking-tight" style={{ color: "#2c2420" }}>SHOP</span>
                            <span className="text-xl font-black tracking-tight" style={{ color: "#e8622a" }}>x</span>
                        </div>
                        <p className="text-[10px] text-[#8c7e74] font-bold uppercase tracking-wider">
                            {isLoginTab ? "Welcome back !!!" : "Start your journey !!!"}
                        </p>
                        <h2 className="text-2xl font-extrabold text-[#2c2420] tracking-tight mt-0.5">
                            {isLoginTab ? "Sign in" : "Sign up"}
                        </h2>
                    </div>

                    {/* Alert Banners */}
                    {error && (
                        <div className="mb-2 rounded-xl border border-rose-200 bg-rose-50 px-3 py-1.5 text-[11px] font-semibold text-rose-600 animate-shake">
                            <span className="inline-flex items-center gap-1"><svg className="h-3.5 w-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg> {error}</span>
                        </div>
                    )}
                    {successMessage && (
                        <div className="mb-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-[11px] font-semibold text-emerald-700">
                            ✓ {successMessage}
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleFormSubmit} className="space-y-4">
                        {!isLoginTab && (
                            <div>
                                <label className={LABEL_CLS}>Full Name</label>
                                <input
                                    type="text"
                                    placeholder="John Doe"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className={FIELD_CLS}
                                    required
                                />
                            </div>
                        )}

                        <div>
                            <label className={LABEL_CLS}>Email</label>
                            <input
                                    type="email"
                                    placeholder="you@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className={FIELD_CLS}
                                    required
                                />
                        </div>

                        <div>
                            <div className="flex justify-between items-center mb-1">
                                <label className={LABEL_CLS}>Password</label>
                                {isLoginTab && (
                                    <a href="#" className="text-[10px] text-[#8c7e74]/80 hover:text-[#e8622a] transition-colors font-bold uppercase tracking-wider">
                                        Forgot Password?
                                    </a>
                                )}
                            </div>
                            <input
                                    type="password"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className={FIELD_CLS}
                                    required
                                />
                        </div>

                        <div className="flex justify-end pt-1">
                            <button
                                type="submit"
                                className="btn-glow inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#e8622a] to-[#c44e1e] px-8 py-2 text-xs font-black uppercase tracking-wider text-white shadow-lg shadow-[#e8622a]/20 transition-all duration-200 hover:opacity-95 hover:scale-105 cursor-pointer"
                            >
                                {isLoginTab ? "Sign In" : "Sign Up"} &rarr;
                            </button>
                        </div>
                    </form>

                    {/* Bottom toggle Suggestion */}
                    <div className="mt-4 text-center text-xs text-[#8c7e74]">
                        {isLoginTab ? (
                            <>
                                I don't have an account?{" "}
                                <button
                                    onClick={() => {
                                        setIsLoginTab(false);
                                        setError("");
                                        setSuccessMessage("");
                                    }}
                                    className="font-bold text-[#e8622a] hover:underline cursor-pointer"
                                >
                                    Sign up
                                </button>
                            </>
                        ) : (
                            <>
                                Already have an account?{" "}
                                <button
                                    onClick={() => {
                                        setIsLoginTab(true);
                                        setError("");
                                        setSuccessMessage("");
                                    }}
                                    className="font-bold text-[#e8622a] hover:underline cursor-pointer"
                                >
                                    Sign in
                                </button>
                            </>
                        )}
                    </div>

                    {/* Demo Helper */}
                    {isLoginTab && (
                        <div className="mt-2.5 border-t border-[#f5f3ef] pt-1.5 text-center">
                            <p className="text-[10px] text-[#8c7e74]">
                                Demo account: <span className="font-semibold text-[#2c2420]">user@example.com</span> / password: <span className="font-semibold text-[#2c2420]">password</span>
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Right Column: Soft peach layout with themed text */}
            <div className="hidden md:flex flex-1 flex-col justify-center items-center px-12 lg:px-20 text-center relative overflow-hidden" style={{ background: "#fff0e5" }}>
                {/* Decorative blurs */}
                <div className="absolute top-1/4 left-1/4 h-64 w-64 rounded-full bg-[#e8622a]/5 blur-3xl pointer-events-none" />
                <div className="absolute bottom-1/4 right-1/4 h-64 w-64 rounded-full bg-[#c44e1e]/5 blur-3xl pointer-events-none" />

                <div className="max-w-md relative z-10 space-y-6">
                    <span className="rounded-full bg-[#e8622a]/10 px-4 py-1.5 text-xs font-bold tracking-wider text-[#e8622a] uppercase">
                        Exclusive Members Club
                    </span>
                    <h1 className="text-4xl font-extrabold text-[#2c2420] tracking-tight leading-tight">
                        Elevate Your Shopping Experience
                    </h1>
                    <p className="text-sm text-[#5a4e46] leading-relaxed">
                        Join SHOPx today to track your purchases, gain access to secret seasonal sales, and check out instantly with your saved billing details.
                    </p>
                    
                    <div className="pt-4 flex justify-center items-center gap-4 text-xs font-semibold text-[#8c7e74]">
                        <div className="flex items-center gap-1.5">
                            <span className="text-emerald-600">✓</span> Fast Delivery
                        </div>
                        <div className="h-3 w-px bg-[#ede8e2]" />
                        <div className="flex items-center gap-1.5">
                            <span className="text-emerald-600">✓</span> Secure Checkout
                        </div>
                        <div className="h-3 w-px bg-[#ede8e2]" />
                        <div className="flex items-center gap-1.5">
                            <span className="text-emerald-600">✓</span> Easy Returns
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
