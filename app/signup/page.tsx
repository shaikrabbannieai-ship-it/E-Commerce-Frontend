"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import {
  EyeIcon,
  EyeSlashIcon,
  EnvelopeIcon,
  LockClosedIcon,
  UserIcon,
  ShoppingBagIcon,
  CheckBadgeIcon,
  ArrowRightIcon,
  SparklesIcon,
  ShieldCheckIcon,
} from "@heroicons/react/24/outline";
import { motion, AnimatePresence } from "framer-motion";

export default function Signup() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [errors, setErrors] = useState<{
    fullName?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
    terms?: string;
  }>({});

  // Password strength criteria
  const passwordCriteria = {
    minLength: password.length >= 8,
    hasUpperCase: /[A-Z]/.test(password),
    hasLowerCase: /[a-z]/.test(password),
    hasNumber: /[0-9]/.test(password),
    hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
  };

  const getPasswordStrength = () => {
    const strength = Object.values(passwordCriteria).filter(Boolean).length;
    if (strength <= 2) return { text: "Weak", color: "bg-red-500", score: 20 };
    if (strength <= 4) return { text: "Medium", color: "bg-yellow-500", score: 60 };
    return { text: "Strong", color: "bg-green-500", score: 100 };
  };

  // Check if password is valid
  const isPasswordValid = () => {
    return passwordCriteria.minLength && 
           passwordCriteria.hasUpperCase && 
           passwordCriteria.hasLowerCase && 
           passwordCriteria.hasNumber && 
           passwordCriteria.hasSpecialChar;
  };

  const validateForm = () => {
    const newErrors: typeof errors = {};

    if (!fullName.trim()) {
      newErrors.fullName = "Full name is required";
    } else if (fullName.trim().length < 3) {
      newErrors.fullName = "Name must be at least 3 characters";
    } else if (fullName.trim().length > 50) {
      newErrors.fullName = "Name must be less than 50 characters";
    }

    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!password) {
      newErrors.password = "Password is required";
    } else if (!isPasswordValid()) {
      newErrors.password = "Please meet all password requirements";
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (!agreeToTerms) {
      newErrors.terms = "You must agree to the terms and conditions";
    }

    setErrors(newErrors);
    
    if (Object.keys(newErrors).length === 0) {
      toast.success("Form validation passed!", { duration: 2000 });
    }
    
    return Object.keys(newErrors).length === 0;
  };

 const handleSignup = async () => {
  if (!validateForm()) {
    toast.error("Please fix the errors before submitting", {
      duration: 3000,
      icon: "⚠️",
    });
    return;
  }

  setIsLoading(true);
  const loadingToast = toast.loading("Creating your account...");

  try {
    const response = await axios.post("http://127.0.0.1:8000/signup", {
      full_name: fullName,
      email: email,
      password: password,
    });

    console.log("Signup response:", response.data); // ✅ Warning fix

    toast.dismiss(loadingToast);
    toast.success("Account created successfully! 🎉", {
      duration: 4000,
      icon: "✅",
    });

    // Store user info for welcome message
    localStorage.setItem("justSignedUp", "true");
    localStorage.setItem("userEmail", email);
    localStorage.setItem("userName", fullName);
    
    // Redirect to login page after a short delay
    setTimeout(() => {
      router.push("/login?signup=success");
    }, 1500);
    
  } catch (err: any) {
    toast.dismiss(loadingToast);
    
    if (err.response?.status === 409) {
      setErrors({ email: "Email already registered. Please login instead." });
      toast.error("Email already registered! Please login.", {
        duration: 4000,
        icon: "📧",
      });
    } else if (err.response?.data?.detail) {
      if (typeof err.response.data.detail === "string") {
        toast.error(err.response.data.detail, { duration: 4000 });
      } else if (Array.isArray(err.response.data.detail)) {
        err.response.data.detail.forEach((error: any) => {
          toast.error(error.msg || error.message, { duration: 4000 });
        });
      }
    } else if (err.code === "ERR_NETWORK") {
      toast.error("Cannot connect to server. Please check if backend is running.", {
        duration: 5000,
        icon: "🔌",
      });
    } else {
      toast.error("Signup failed. Please try again.", {
        duration: 4000,
        icon: "❌",
      });
    }
  } finally {
    setIsLoading(false);
  }
};

  // Auto-hide errors when user starts typing
  useEffect(() => {
    if (fullName && errors.fullName) {
      setErrors(prev => ({ ...prev, fullName: undefined }));
    }
  }, [fullName]);

  useEffect(() => {
    if (email && errors.email) {
      setErrors(prev => ({ ...prev, email: undefined }));
    }
  }, [email]);

  useEffect(() => {
    if (password && errors.password && isPasswordValid()) {
      setErrors(prev => ({ ...prev, password: undefined }));
    }
  }, [password]);

  useEffect(() => {
    if (confirmPassword && errors.confirmPassword && password === confirmPassword) {
      setErrors(prev => ({ ...prev, confirmPassword: undefined }));
    }
  }, [confirmPassword, password]);

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-indigo-50 via-white to-pink-50 flex items-center justify-center p-4 sm:p-6 md:p-8 overflow-x-hidden">
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
            borderRadius: '12px',
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: '#10B981',
              secondary: '#fff',
            },
          },
          error: {
            duration: 4000,
            iconTheme: {
              primary: '#EF4444',
              secondary: '#fff',
            },
          },
        }}
      />
      
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-6xl mx-auto relative z-10"
      >
        <div className="flex flex-col lg:flex-row rounded-3xl shadow-2xl overflow-hidden bg-white/80 backdrop-blur-xl border border-white/20">
          {/* Left Side - Brand Section */}
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="w-full lg:w-1/2 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 p-8 md:p-12 flex flex-col justify-between text-white relative overflow-hidden"
          >
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full -ml-32 -mb-32"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white/5 rounded-full"></div>

            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-8 md:mb-12">
                <div className="bg-white/20 p-2 rounded-2xl backdrop-blur-sm">
                  <ShoppingBagIcon className="w-8 h-8 md:w-10 md:h-10" />
                </div>
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Falcon</h1>
                  <p className="text-white/80 text-sm">Premium E-commerce</p>
                </div>
              </div>

              <div className="space-y-6 md:space-y-8">
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">
                  Join the Future of
                  <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-pink-300">
                    Online Shopping
                  </span>
                </h2>

                <div className="space-y-4">
                  {[
                    "Exclusive member-only deals",
                    "Free shipping on all orders",
                    "24/7 premium support",
                    "Early access to flash sales",
                  ].map((benefit, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 + idx * 0.1 }}
                      className="flex items-center gap-3 text-white/90"
                    >
                      <CheckBadgeIcon className="w-5 h-5 text-yellow-300" />
                      <span className="text-sm md:text-base">{benefit}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>

            <div className="relative z-10 mt-8 md:mt-12">
              <div className="flex -space-x-2">
                {[
                  "https://th.bing.com/th/id/OIP.I79fUkixWxJKUZelazro8wHaHa?w=178&h=180&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3",
                  "https://tse4.mm.bing.net/th/id/OIP.q147_8-0-KUzdNrCSjVNvQHaHa?rs=1&pid=ImgDetMain&o=7&rm=3",
                  "https://tse2.mm.bing.net/th/id/OIP.mWglA-1bMyAZP-1a0dT3TQHaDt?rs=1&pid=ImgDetMain&o=7&rm=3",
                  "https://th.bing.com/th/id/OIP.h0uT5CFy0XObcLI75TLNUAHaHa?w=169&h=180&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3"
                ].map((src, idx) => (
                  <img
                    key={idx}
                    src={src}
                    alt={`User ${idx + 1}`}
                    className="w-8 h-8 md:w-10 md:h-10 rounded-full border-2 border-white object-cover"
                    onError={(e) => {
                      // Fallback image if URL fails
                      (e.target as HTMLImageElement).src = "https://via.placeholder.com/40?text=User";
                    }}
                  />
                ))}
              </div>
              <p className="text-white/80 text-xs md:text-sm mt-3">
                Join <span className="font-bold text-white">10,000+</span> happy shoppers
              </p>
            </div>
          </motion.div>

          {/* Right Side - Signup Form */}
          <motion.div
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="w-full lg:w-1/2 p-6 sm:p-8 md:p-10 lg:p-12"
          >
            <div className="max-w-md mx-auto">
              {/* Header */}
              <div className="text-center mb-6 md:mb-8">
                <SparklesIcon className="w-10 h-10 md:w-12 md:h-12 text-indigo-500 mx-auto mb-3" />
                <h3 className="text-2xl md:text-3xl font-bold text-gray-800">Create Account</h3>
                <p className="text-gray-500 text-sm md:text-base mt-2">
                  Get started with your free account
                </p>
              </div>

              {/* Form */}
              <div className="space-y-4 md:space-y-5">
                {/* Full Name Field */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Full Name
                  </label>
                  <div className="relative">
                    <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Enter full name"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className={`w-full pl-10 pr-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all ${
                        errors.fullName
                          ? "border-red-500 focus:border-red-500"
                          : "border-gray-200 focus:border-indigo-500"
                      }`}
                    />
                  </div>
                  <AnimatePresence>
                    {errors.fullName && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="text-red-500 text-xs mt-1"
                      >
                        {errors.fullName}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>

                {/* Email Field */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <EnvelopeIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      placeholder="your@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={`w-full pl-10 pr-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all ${
                        errors.email
                          ? "border-red-500 focus:border-red-500"
                          : "border-gray-200 focus:border-indigo-500"
                      }`}
                    />
                  </div>
                  <AnimatePresence>
                    {errors.email && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="text-red-500 text-xs mt-1"
                      >
                        {errors.email}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>

                {/* Password Field */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <LockClosedIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Create a strong password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className={`w-full pl-10 pr-12 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all ${
                        errors.password
                          ? "border-red-500 focus:border-red-500"
                          : "border-gray-200 focus:border-indigo-500"
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2"
                    >
                      {showPassword ? (
                        <EyeSlashIcon className="w-5 h-5 text-gray-400" />
                      ) : (
                        <EyeIcon className="w-5 h-5 text-gray-400" />
                      )}
                    </button>
                  </div>

                  {/* Password Strength Indicator */}
                  {password && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="mt-3 space-y-2"
                    >
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-600">Password strength:</span>
                        <span
                          className={`font-semibold ${
                            getPasswordStrength().text === "Strong"
                              ? "text-green-600"
                              : getPasswordStrength().text === "Medium"
                              ? "text-yellow-600"
                              : "text-red-600"
                          }`}
                        >
                          {getPasswordStrength().text}
                        </span>
                      </div>
                      <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${getPasswordStrength().score}%` }}
                          className={`h-full ${getPasswordStrength().color} transition-all`}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-1 text-xs">
                        <p className={passwordCriteria.minLength ? "text-green-600" : "text-gray-400"}>
                          ✓ 8+ characters
                        </p>
                        <p className={passwordCriteria.hasUpperCase ? "text-green-600" : "text-gray-400"}>
                          ✓ Uppercase letter
                        </p>
                        <p className={passwordCriteria.hasLowerCase ? "text-green-600" : "text-gray-400"}>
                          ✓ Lowercase letter
                        </p>
                        <p className={passwordCriteria.hasNumber ? "text-green-600" : "text-gray-400"}>
                          ✓ Number
                        </p>
                        <p className={passwordCriteria.hasSpecialChar ? "text-green-600" : "text-gray-400"}>
                          ✓ Special character
                        </p>
                      </div>
                    </motion.div>
                  )}
                  <AnimatePresence>
                    {errors.password && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="text-red-500 text-xs mt-1"
                      >
                        {errors.password}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>

                {/* Confirm Password Field */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <LockClosedIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm your password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className={`w-full pl-10 pr-12 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all ${
                        errors.confirmPassword
                          ? "border-red-500 focus:border-red-500"
                          : "border-gray-200 focus:border-indigo-500"
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2"
                    >
                      {showConfirmPassword ? (
                        <EyeSlashIcon className="w-5 h-5 text-gray-400" />
                      ) : (
                        <EyeIcon className="w-5 h-5 text-gray-400" />
                      )}
                    </button>
                  </div>
                  <AnimatePresence>
                    {errors.confirmPassword && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="text-red-500 text-xs mt-1"
                      >
                        {errors.confirmPassword}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>

                {/* Terms and Conditions */}
                <div className="flex items-start gap-2">
                  <input
                    type="checkbox"
                    id="terms"
                    checked={agreeToTerms}
                    onChange={(e) => {
                      setAgreeToTerms(e.target.checked);
                      if (errors.terms) setErrors({ ...errors, terms: undefined });
                    }}
                    className="mt-1 w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
                  />
                  <label htmlFor="terms" className="text-xs text-gray-600">
                    I agree to the{" "}
                    <button
                      type="button"
                      onClick={() => toast.success("Terms and conditions will be shown here", { duration: 3000 })}
                      className="text-indigo-600 hover:underline"
                    >
                      Terms of Service
                    </button>{" "}
                    and{" "}
                    <button
                      type="button"
                      onClick={() => toast.success("Privacy policy will be shown here", { duration: 3000 })}
                      className="text-indigo-600 hover:underline"
                    >
                      Privacy Policy
                    </button>
                  </label>
                </div>
                <AnimatePresence>
                  {errors.terms && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="text-red-500 text-xs mt-1"
                    >
                      {errors.terms}
                    </motion.p>
                  )}
                </AnimatePresence>

                {/* Submit Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSignup}
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <svg
                        className="animate-spin h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Creating account...
                    </>
                  ) : (
                    <>
                      Sign Up
                      <ArrowRightIcon className="w-5 h-5" />
                    </>
                  )}
                </motion.button>

                {/* Security Note */}
                <div className="flex items-center justify-center gap-2 text-xs text-gray-400">
                  <ShieldCheckIcon className="w-3 h-3" />
                  <span>Your data is encrypted and secure</span>
                </div>

                {/* Divider */}
                <div className="relative my-4">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-white text-gray-500">Or continue with</span>
                  </div>
                </div>

                {/* Social Login */}
                <div className="grid grid-cols-2 gap-3">
                  <button 
                    onClick={() => toast.loading("Google login coming soon!", { duration: 2000 })}
                    className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    <img 
                      src="https://cdn.pixabay.com/photo/2015/12/11/11/43/google-1088004_1280.png" 
                      alt="Google" 
                      className="w-5 h-5"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "https://via.placeholder.com/20?text=G";
                      }}
                    />
                    <span className="text-sm font-medium">Google</span>
                  </button>
                  <button 
                    onClick={() => toast.loading("Apple login coming soon!", { duration: 2000 })}
                    className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    <img 
                      src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/apple/apple-original.svg" 
                      alt="Apple" 
                      className="w-5 h-5"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "https://via.placeholder.com/20?text=A";
                      }}
                    />
                    <span className="text-sm font-medium">Apple</span>
                  </button>
                </div>

                {/* Login Link */}
                <p className="text-center text-gray-600 text-sm">
                  Already have an account?{" "}
                  <button
                    onClick={() => router.push("/login")}
                    className="text-indigo-600 font-semibold hover:text-indigo-700 transition-colors"
                  >
                    Sign in
                  </button>
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      <style jsx>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}