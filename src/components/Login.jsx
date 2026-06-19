import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import { loginSuccess, signupSuccess } from "../reducers/authSlice";
import { loginApi, signupApi, verifyOtpApi } from "../services/authApi";

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
    const [phoneNumber, setPhoneNumber] = useState("");
    const [avatarFile, setAvatarFile] = useState(null);
    const [avatarPreview, setAvatarPreview] = useState("");
    
    // OTP verification state
    const [isOtpStep, setIsOtpStep] = useState(false);
    const [otp, setOtp] = useState("");

    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [loading, setLoading] = useState(false);

    // Sync tab from URL query params
    React.useEffect(() => {
        const tab = searchParams.get("tab");
        if (tab === "signup") {
            setIsLoginTab(false);
            setIsOtpStep(false);
        } else if (tab === "login") {
            setIsLoginTab(true);
            setIsOtpStep(false);
        }
    }, [searchParams]);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setAvatarFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatarPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccessMessage("");
        setLoading(true);

        try {
            if (isLoginTab) {
                // Login flow using MERN API
                const data = await loginApi(email, password);
                
                if (data.success) {
                    dispatch(loginSuccess(data.user));
                    setSuccessMessage("Logged in successfully! Redirecting...");
                    setTimeout(() => navigate(redirectUrl), 1200);
                } else {
                    setError(data.error || "Login failed.");
                }
            } else {
                // Signup flow using MERN API (Multipart Form Data)
                const formData = new FormData();
                formData.append("name", name);
                formData.append("email", email);
                formData.append("password", password);
                formData.append("phoneNumber", phoneNumber);
                if (avatarFile) {
                    formData.append("avatar", avatarFile);
                }

                const data = await signupApi(formData);

                if (data.success) {
                    setSuccessMessage("Account created! Verification code sent to email.");
                    setIsOtpStep(true);
                } else {
                    setError(data.error || "Signup failed.");
                }
            }
        } catch (err) {
            console.error("Auth error:", err);
            setError(err.response?.data?.error || "Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleOtpSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccessMessage("");
        setLoading(true);

        try {
            const data = await verifyOtpApi(email, otp);
            if (data.success) {
                dispatch(signupSuccess(data.user));
                setSuccessMessage("Email verified successfully! Redirecting...");
                setTimeout(() => navigate(redirectUrl), 1200);
            } else {
                setError(data.error || "OTP verification failed.");
            }
        } catch (err) {
            console.error("OTP Verification error:", err);
            setError(err.response?.data?.error || "Invalid or expired OTP.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ background: "#ffffff", height: "calc(100vh - 104px)" }} className="flex flex-col md:flex-row overflow-hidden">
            {/* Left Column: Form */}
            <div className="flex-1 flex flex-col justify-center items-center px-6 sm:px-12 md:px-16 lg:px-20 bg-white/80 backdrop-blur-lg overflow-y-auto">
                <div className="w-full max-w-[360px] py-6">
                    {/* Logo & Welcome text */}
                    <div className="mb-4">
                        <div className="flex items-center gap-0.5 select-none mb-2">
                            <span className="text-xl font-black tracking-tight" style={{ color: "#2c2420" }}>SHOP</span>
                            <span className="text-xl font-black tracking-tight" style={{ color: "#e8622a" }}>x</span>
                        </div>
                        <p className="text-[10px] text-[#8c7e74] font-bold uppercase tracking-wider">
                            {isOtpStep ? "Verify email !!!" : isLoginTab ? "Welcome back !!!" : "Start your journey !!!"}
                        </p>
                        <h2 className="text-2xl font-extrabold text-[#2c2420] tracking-tight mt-0.5">
                            {isOtpStep ? "Enter OTP" : isLoginTab ? "Sign in" : "Sign up"}
                        </h2>
                    </div>

                    {/* Alert Banners */}
                    {error && (
                        <div className="mb-3 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-[11px] font-semibold text-rose-600 animate-shake">
                            <span className="inline-flex items-center gap-1">
                                <svg className="h-3.5 w-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
                                </svg> 
                                {error}
                            </span>
                        </div>
                    )}
                    {successMessage && (
                        <div className="mb-3 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-[11px] font-semibold text-emerald-700">
                            ✓ {successMessage}
                        </div>
                    )}

                    {/* Form Layout */}
                    {isOtpStep ? (
                        /* OTP Verification Form */
                        <form onSubmit={handleOtpSubmit} className="space-y-4">
                            <div className="text-xs text-[#8c7e74] leading-relaxed mb-1">
                                We sent a 6-digit verification code to <span className="font-semibold text-[#2c2420]">{email}</span>. Please check your spam folder if you do not receive it shortly.
                            </div>
                            <div>
                                <label className={LABEL_CLS}>6-Digit OTP</label>
                                <input
                                    type="text"
                                    placeholder="123456"
                                    value={otp}
                                    maxLength={6}
                                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                                    className={`${FIELD_CLS} text-center text-lg tracking-widest font-bold`}
                                    autoComplete="one-time-code"
                                    required
                                />
                            </div>
                            <div className="flex justify-between items-center pt-2">
                                <button
                                    type="button"
                                    onClick={() => setIsOtpStep(false)}
                                    className="text-xs font-bold text-[#8c7e74] hover:text-[#e8622a] transition-colors cursor-pointer"
                                >
                                    &larr; Back to edit
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="btn-glow inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#e8622a] to-[#c44e1e] px-8 py-2.5 text-xs font-black uppercase tracking-wider text-white shadow-lg shadow-[#e8622a]/20 transition-all duration-200 hover:opacity-95 hover:scale-105 disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
                                >
                                    {loading ? "Verifying..." : "Verify Code"} &rarr;
                                </button>
                            </div>
                        </form>
                    ) : (
                        /* Login or Signup Form */
                        <form onSubmit={handleFormSubmit} className="space-y-4">
                            {!isLoginTab && (
                                <>
                                    {/* Avatar Uploader preview */}
                                    <div className="flex flex-col items-center gap-2.5 py-1">
                                        <div className="relative group">
                                            <div className="h-16 w-16 rounded-full overflow-hidden border-2 border-dashed border-[#d4c9be] bg-[#fafafa] flex items-center justify-center transition-all duration-200 group-hover:border-[#e8622a] relative">
                                                {avatarPreview ? (
                                                    <img src={avatarPreview} className="h-full w-full object-cover" alt="avatar preview" />
                                                ) : (
                                                    <svg className="h-6 w-6 text-[#a69c93] group-hover:text-[#e8622a] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    </svg>
                                                )}
                                            </div>
                                            <label className="absolute bottom-0 right-0 h-5 w-5 bg-[#e8622a] rounded-full border border-white flex items-center justify-center cursor-pointer hover:scale-105 transition-transform">
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={handleFileChange}
                                                    className="hidden"
                                                />
                                                <span className="text-[10px] text-white font-bold">+</span>
                                            </label>
                                        </div>
                                        <span className="text-[9px] text-[#8c7e74] uppercase tracking-wider font-bold">Profile Picture (Optional)</span>
                                    </div>

                                    <div>
                                        <label className={LABEL_CLS}>Full Name</label>
                                        <input
                                            type="text"
                                            placeholder="John Doe"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            className={FIELD_CLS}
                                            autoComplete="name"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className={LABEL_CLS}>Phone Number</label>
                                        <input
                                            type="tel"
                                            placeholder="+1 555-0199"
                                            value={phoneNumber}
                                            onChange={(e) => setPhoneNumber(e.target.value)}
                                            className={FIELD_CLS}
                                            autoComplete="tel"
                                            required
                                        />
                                    </div>
                                </>
                            )}

                            <div>
                                <label className={LABEL_CLS}>Email</label>
                                <input
                                    type="email"
                                    placeholder="you@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className={FIELD_CLS}
                                    autoComplete="email"
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
                                    autoComplete={isLoginTab ? "current-password" : "new-password"}
                                    required
                                />
                            </div>

                            <div className="flex justify-end pt-1">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="btn-glow inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#e8622a] to-[#c44e1e] px-8 py-2.5 text-xs font-black uppercase tracking-wider text-white shadow-lg shadow-[#e8622a]/20 transition-all duration-200 hover:opacity-95 hover:scale-105 disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
                                >
                                    {loading ? (isLoginTab ? "Signing In..." : "Signing Up...") : (isLoginTab ? "Sign In" : "Sign Up")} &rarr;
                                </button>
                            </div>
                        </form>
                    )}

                    {/* Bottom toggle Suggestion */}
                    {!isOtpStep && (
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
