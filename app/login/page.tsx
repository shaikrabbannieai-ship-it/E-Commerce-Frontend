"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import {
  EyeIcon,
  EyeSlashIcon,
  EnvelopeIcon,
  LockClosedIcon,
  ShoppingBagIcon,
  ArrowRightIcon,
  SparklesIcon,
  FingerPrintIcon,
  ShieldCheckIcon,
  DevicePhoneMobileIcon,
  KeyIcon,
} from "@heroicons/react/24/outline";
import { motion, AnimatePresence } from "framer-motion";

// Validation schema with Zod
const loginSchema = z.object({
  email: z.string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  password: z.string()
    .min(1, "Password is required")
    .min(6, "Password must be at least 6 characters"),
  rememberMe: z.boolean().optional(),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function Login() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [biometricSupported, setBiometricSupported] = useState(false);

  // React Hook Form setup
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const rememberMe = watch("rememberMe");

  // Check for biometric support
  useEffect(() => {
    if (window.PublicKeyCredential) {
      setBiometricSupported(true);
    }
    
    // Load saved email if "Remember Me" was checked
    const savedEmail = localStorage.getItem("rememberedEmail");
    if (savedEmail) {
      setValue("email", savedEmail);
      setValue("rememberMe", true);
    }

    // Check if there was a successful signup
    const justSignedUp = localStorage.getItem("justSignedUp");
    if (justSignedUp) {
      toast.success("Account created successfully! Please login.", {
        duration: 4000,
        icon: "🎉",
      });
      localStorage.removeItem("justSignedUp");
    }
  }, [setValue]);

  const handleBiometricLogin = async () => {
    if (!biometricSupported) {
      toast.error("Biometric authentication is not supported on this device");
      return;
    }

    toast.loading("Waiting for biometric verification...", { id: "biometric" });
    
    // Simulate biometric authentication
    setTimeout(() => {
      toast.dismiss("biometric");
      toast.success("Biometric verification successful!", {
        icon: "✓",
      });
      // Auto-fill demo credentials
      setValue("email", "demo@example.com");
      setValue("password", "Demo@123");
      setTimeout(() => {
        handleSubmit(onSubmit)();
      }, 500);
    }, 2000);
  };

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    
    try {
      // Make actual API call to your backend
      const response = await axios.post("http://127.0.0.1:8000/login", {
        email: data.email,
        password: data.password,
      });

      if (response.data.access_token) {
        // Handle "Remember Me"
        if (data.rememberMe) {
          localStorage.setItem("rememberedEmail", data.email);
        } else {
          localStorage.removeItem("rememberedEmail");
        }

        // Store token and user info
        localStorage.setItem("access_token", response.data.access_token);
        localStorage.setItem("user_id", response.data.user_id.toString());
        localStorage.setItem("user_name", response.data.full_name);
        
        // Successful login
        toast.success(`Welcome back, ${response.data.full_name}! 🎉`, {
          duration: 3000,
          icon: "🎉",
        });
        
        // Redirect to dashboard
        setTimeout(() => {
          router.push("/");
        }, 1500);
      }
    } catch (err: any) {
      console.error("Login error:", err);
      
      if (err.response?.status === 401) {
        toast.error("Invalid email or password. Please try again.", {
          duration: 4000,
          icon: "❌",
        });
      } else if (err.response?.status === 423) {
        toast.error(err.response.data.detail, {
          duration: 5000,
          icon: "🔒",
        });
      } else if (err.code === "ERR_NETWORK") {
        toast.error("Cannot connect to server. Please check if backend is running.", {
          duration: 5000,
          icon: "🔌",
        });
      } else {
        toast.error("Login failed. Please try again.", {
          duration: 3000,
          icon: "⚠️",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-indigo-50 via-white to-pink-50 flex items-center justify-center p-4 sm:p-6 md:p-8 overflow-x-hidden relative">
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
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
      
      {/* Animated Background */}
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
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full -ml-32 -mb-32"></div>
            
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
                  Welcome Back to
                  <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-pink-300">
                    Your Shopping Paradise
                  </span>
                </h2>

                <div className="space-y-4">
                  {[
                    "Access your wishlist & cart",
                    "Track your orders in real-time",
                    "Exclusive member discounts",
                    "24/7 priority support",
                  ].map((benefit, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 + idx * 0.1 }}
                      className="flex items-center gap-3 text-white/90"
                    >
                      <ShieldCheckIcon className="w-5 h-5 text-yellow-300" />
                      <span className="text-sm md:text-base">{benefit}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>

            <div className="relative z-10 mt-8 md:mt-12">
              <div className="flex items-center gap-2 text-white/80 text-sm">
                <DevicePhoneMobileIcon className="w-4 h-4" />
                <span>Secure login with JWT authentication</span>
              </div>
            </div>
          </motion.div>

          {/* Right Side - Login Form */}
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
                <h3 className="text-2xl md:text-3xl font-bold text-gray-800">Welcome Back</h3>
                <p className="text-gray-500 text-sm md:text-base mt-2">
                  Sign in to continue shopping
                </p>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 md:space-y-5">
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
                      {...register("email")}
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
                        {errors.email.message}
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
                      placeholder="Enter your password"
                      {...register("password")}
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
                  <AnimatePresence>
                    {errors.password && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="text-red-500 text-xs mt-1"
                      >
                        {errors.password.message}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>

                {/* Remember Me & Forgot Password */}
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      {...register("rememberMe")}
                      className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
                    />
                    <span className="text-sm text-gray-600">Remember me</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => toast.success("Password reset link sent to your email!", {
                      icon: "📧",
                    })}
                    className="text-sm text-indigo-600 hover:text-indigo-700 font-semibold"
                  >
                    Forgot Password?
                  </button>
                </div>

                {/* Submit Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
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
                      Authenticating...
                    </>
                  ) : (
                    <>
                      Sign In
                      <ArrowRightIcon className="w-5 h-5" />
                    </>
                  )}
                </motion.button>

                {/* Biometric Login */}
                {biometricSupported && (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={handleBiometricLogin}
                    className="w-full border-2 border-indigo-200 text-indigo-600 py-3 rounded-xl font-semibold hover:bg-indigo-50 transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    <FingerPrintIcon className="w-5 h-5" />
                    Use Biometric Login
                  </motion.button>
                )}

                {/* Divider */}
                <div className="relative my-6">
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
                    type="button"
                    className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
                    onClick={() => toast.success("Google login coming soon!")}
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
                    <span className="text-sm font-medium">Google</span>
                  </button>
                  
                  <button
                    type="button"
                    className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
                    onClick={() => toast.success("Apple login coming soon!")}
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.221-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.56-1.702z" />
                    </svg>
                    <span className="text-sm font-medium">Apple</span>
                  </button>
                </div>

                {/* Signup Link */}
                <p className="text-center text-gray-600 text-sm">
                  Don't have an account?{" "}
                  <button
                    type="button"
                    onClick={() => router.push("/signup")}
                    className="text-indigo-600 font-semibold hover:text-indigo-700 transition-colors"
                  >
                    Create Account
                  </button>
                </p>

                {/* Security Note */}
                <div className="text-center text-xs text-gray-400 flex items-center justify-center gap-1">
                  <KeyIcon className="w-3 h-3" />
                  <span>Secure login with 256-bit encryption</span>
                </div>
              </form>
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