"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import { Suspense } from 'react';
import QRCode from "qrcode";

declare global {
  interface Window {
    Razorpay: any;
  }
}

import {
  CreditCardIcon,
  BanknotesIcon,
  DevicePhoneMobileIcon,
  ShieldCheckIcon,
  LockClosedIcon,
  CheckCircleIcon,
  XCircleIcon,
  ArrowPathIcon,
  WalletIcon,
} from "@heroicons/react/24/outline";

// Razorpay Keys
const RAZORPAY_KEY_ID = "rzp_test_Sec3sayV6NwGlY";
const MERCHANT_NAME = "ShopHub";

// Payment Methods Configuration
const paymentMethods = [
  { 
    id: "card", 
    name: "Credit/Debit Card", 
    icon: CreditCardIcon, 
    description: "Visa, Mastercard, RuPay, Amex",
    razorpay_method: "card"
  },
  { 
    id: "netbanking", 
    name: "Net Banking", 
    icon: BanknotesIcon, 
    description: "All major banks - SBI, HDFC, ICICI, etc.",
    razorpay_method: "netbanking"
  },
  { 
    id: "upi", 
    name: "UPI", 
    icon: DevicePhoneMobileIcon, 
    description: "Google Pay, PhonePe, Paytm, BHIM",
    razorpay_method: "upi"
  },
  { 
    id: "wallet", 
    name: "Mobile Wallets", 
    icon: WalletIcon, 
    description: "Paytm, PhonePe, Amazon Pay, Mobikwik",
    razorpay_method: "wallet"
  },
  { 
    id: "cod", 
    name: "Cash on Delivery", 
    icon: BanknotesIcon, 
    description: "Pay when you receive the product",
    razorpay_method: "cod"
  },
];

// Bank List for Net Banking
const banks = [
  { code: "SBIB", name: "State Bank of India" },
  { code: "HDFC", name: "HDFC Bank" },
  { code: "ICIC", name: "ICICI Bank" },
  { code: "AXIB", name: "Axis Bank" },
  { code: "KTKB", name: "Kotak Mahindra Bank" },
  { code: "YESB", name: "Yes Bank" },
  { code: "PNB", name: "Punjab National Bank" },
  { code: "BOB", name: "Bank of Baroda" },
  { code: "CANB", name: "Canara Bank" },
  { code: "UBOI", name: "Union Bank of India" },
  { code: "IDFB", name: "IDFC First Bank" },
  { code: "FED", name: "Federal Bank" },
  { code: "IDIB", name: "Indian Bank" },
  { code: "CUB", name: "City Union Bank" },
  { code: "RBL", name: "RBL Bank" },
  { code: "DCBB", name: "DCB Bank" },
  { code: "KARB", name: "Karnataka Bank" },
  { code: "CSBK", name: "CSB Bank" },
  { code: "SIB", name: "South Indian Bank" },
  { code: "TMB", name: "Tamilnad Mercantile Bank" },
];

// Wallet List
const wallets = [
  { code: "paytm", name: "Paytm", icon: "📱" },
  { code: "phonepe", name: "PhonePe", icon: "📱" },
  { code: "amazonpay", name: "Amazon Pay", icon: "📱" },
  { code: "mobikwik", name: "Mobikwik", icon: "📱" },
  { code: "freecharge", name: "FreeCharge", icon: "📱" },
  { code: "olamoney", name: "Ola Money", icon: "📱" },
];

function PaymentContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<"pending" | "success" | "failed">("pending");
  const [orderDetails, setOrderDetails] = useState<any>(null);
  const [selectedMethod, setSelectedMethod] = useState<string>("card");
  
  // Net Banking specific
  const [showBankModal, setShowBankModal] = useState(false);
  const [selectedBank, setSelectedBank] = useState("");
  
  // Wallet specific
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [selectedWallet, setSelectedWallet] = useState("");
  
  // UPI specific
  const [showUpiModal, setShowUpiModal] = useState(false);
  const [userUpiId, setUserUpiId] = useState("");
  const [generatedQR, setGeneratedQR] = useState<string | null>(null);
  const [pollingInterval, setPollingInterval] = useState<NodeJS.Timeout | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  const userId = typeof window !== 'undefined' ? localStorage.getItem("user_id") : null;
  const totalAmount = searchParams.get("amount") || "0";

  // Detect mobile device
  useEffect(() => {
    const userAgent = navigator.userAgent.toLowerCase();
    const isMobileDevice = /android|webos|iphone|ipad|ipod|blackberry|windows phone/.test(userAgent);
    setIsMobile(isMobileDevice);
  }, []);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);

    fetchOrderDetails();

    return () => {
      document.body.removeChild(script);
      if (pollingInterval) clearInterval(pollingInterval);
    };
  }, []);

  const fetchOrderDetails = async () => {
    if (!userId) return;
    try {
      const response = await axios.get(`https://ecommerce-backend.onrender.com/cart/${userId}`);
      setOrderDetails(response.data);
    } catch (error) {
      console.error("Error fetching order details:", error);
    }
  };

  // Generate QR for UPI (when on laptop)
  const generateQRPayment = async () => {
    const amount = parseInt(totalAmount) + Math.round(parseInt(totalAmount) * 0.18);
    const transactionId = `TXN${Date.now()}${Math.floor(Math.random() * 10000)}`;
    
    const upiQRString = `upi://pay?pa=razorpay@rzp&pn=${MERCHANT_NAME}&am=${amount}&cu=INR&tn=${transactionId}`;
    
    try {
      const qrDataUrl = await QRCode.toDataURL(upiQRString, {
        width: 300,
        margin: 2,
        color: { dark: '#000000', light: '#ffffff' }
      });
      setGeneratedQR(qrDataUrl);
      
      toast.success("QR Code generated! Scan with your UPI app", { duration: 5000, icon: "📱" });
    } catch (error) {
      console.error("QR generation failed:", error);
      toast.error("Failed to generate QR code");
    }
  };

  // ==================== UNIFIED RAZORPAY PAYMENT ====================
  
  const processRazorpayPayment = async (method: string, extraData?: any) => {
    if (!userId) {
      toast.error("Please login first");
      router.push("/login");
      return;
    }

    setIsLoading(true);
    const amount = parseInt(totalAmount) + Math.round(parseInt(totalAmount) * 0.18);
    
    try {
      // Create order on backend
      const response = await axios.post("https://ecommerce-backend.onrender.com/create-razorpay-order", {
        amount: amount,
        currency: "INR",
        receipt: `order_${Date.now()}`
      });

      // Razorpay options based on payment method
      let options: any = {
        key: RAZORPAY_KEY_ID,
        amount: response.data.amount,
        currency: response.data.currency,
        name: MERCHANT_NAME,
        description: `Order Payment via ${method.toUpperCase()}`,
        order_id: response.data.id,
        handler: async (razorpayResponse: any) => {
          await verifyPayment(razorpayResponse, method);
        },
        prefill: {
          name: localStorage.getItem("user_name") || "",
          email: localStorage.getItem("user_email") || "",
          contact: localStorage.getItem("user_phone") || ""
        },
        theme: {
          color: "#3B82F6"
        },
        modal: {
          ondismiss: () => {
            setIsLoading(false);
            toast.error("Payment cancelled");
          }
        },
        retry: { enabled: true, max_count: 3 },
        send_sms_hash: true,
        allow_rotation: true
      };

      // Method-specific configurations
      if (method === "card") {
        options.method = "card";
      } 
      else if (method === "netbanking") {
        if (!extraData?.bank) {
          toast.error("Please select a bank");
          setIsLoading(false);
          return;
        }
        options.method = "netbanking";
        options.bank = extraData.bank;
      }
      else if (method === "upi") {
        if (isMobile && extraData?.upiId) {
          options.method = "upi";
          options.upi = { vpa: extraData.upiId, flow: "collect" };
        } else if (!isMobile) {
          await generateQRPayment();
          setIsLoading(false);
          return;
        } else {
          toast.error("Please enter your UPI ID");
          setIsLoading(false);
          return;
        }
      }
      else if (method === "wallet") {
        if (!extraData?.wallet) {
          toast.error("Please select a wallet");
          setIsLoading(false);
          return;
        }
        options.method = "wallet";
        options.wallet = extraData.wallet;
      }

      const razorpay = new window.Razorpay(options);
      razorpay.open();
      
      // Close modals
      setShowBankModal(false);
      setShowWalletModal(false);
      setShowUpiModal(false);
      
    } catch (error: any) {
      console.error("Error creating Razorpay order:", error);
      toast.error(error.response?.data?.detail || "Failed to initialize payment");
    } finally {
      setIsLoading(false);
    }
  };

  const verifyPayment = async (razorpayResponse: any, method: string) => {
    setIsLoading(true);
    try {
      const address = JSON.parse(localStorage.getItem("shipping_address") || "{}");
      const response = await axios.post("https://ecommerce-backend.onrender.com/verify-payment", {
        razorpay_order_id: razorpayResponse.razorpay_order_id,
        razorpay_payment_id: razorpayResponse.razorpay_payment_id,
        razorpay_signature: razorpayResponse.razorpay_signature,
        user_id: parseInt(userId!),
        shipping_address: address,
        payment_method: method,
        total_amount: totalAmount,
      });

      if (response.data.status === "success") {
        setPaymentStatus("success");
        toast.success("Payment successful! Order placed.");
        localStorage.removeItem("cart");
        localStorage.removeItem("shipping_address");
        setTimeout(() => {
          router.push(`/orders?payment=success`);
        }, 2000);
      }
    } catch (error: any) {
      console.error("Payment verification failed:", error);
      setPaymentStatus("failed");
      toast.error(error.response?.data?.detail || "Payment verification failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCODOrder = async () => {
    if (!userId) {
      toast.error("Please login first");
      router.push("/login");
      return;
    }

    setIsLoading(true);
    try {
      const address = JSON.parse(localStorage.getItem("shipping_address") || "{}");
      const response = await axios.post("https://ecommerce-backend.onrender.com/order/create", {
        user_id: parseInt(userId),
        shipping_address: address,
        payment_method: "cod",
      });

      if (response.data.message) {
        setPaymentStatus("success");
        toast.success("Order placed successfully! Cash on Delivery");
        localStorage.removeItem("cart");
        localStorage.removeItem("shipping_address");
        setTimeout(() => {
          router.push(`/orders?payment=success`);
        }, 2000);
      }
    } catch (error: any) {
      console.error("COD order failed:", error);
      toast.error(error.response?.data?.detail || "Failed to place order");
      setPaymentStatus("failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePayment = () => {
    if (selectedMethod === "cod") {
      handleCODOrder();
    } else if (selectedMethod === "card") {
      processRazorpayPayment("card");
    } else if (selectedMethod === "netbanking") {
      setShowBankModal(true);
    } else if (selectedMethod === "upi") {
      if (isMobile) {
        setShowUpiModal(true);
      } else {
        processRazorpayPayment("upi");
      }
    } else if (selectedMethod === "wallet") {
      setShowWalletModal(true);
    }
  };

  const totalWithTax = parseInt(totalAmount) + Math.round(parseInt(totalAmount) * 0.18);

  // Success Screen
  if (paymentStatus === "success") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white rounded-2xl shadow-xl p-8 text-center max-w-md w-full"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"
          >
            <CheckCircleIcon className="w-12 h-12 text-green-600" />
          </motion.div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Payment Successful!</h2>
          <p className="text-gray-600 mb-6">Your order has been placed successfully.</p>
          <div className="space-y-3">
            <button
              onClick={() => router.push("/orders")}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              View My Orders
            </button>
            <button
              onClick={() => router.push("/")}
              className="w-full border border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50 transition"
            >
              Continue Shopping
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  // Failed Screen
  if (paymentStatus === "failed") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-rose-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white rounded-2xl shadow-xl p-8 text-center max-w-md w-full"
        >
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <XCircleIcon className="w-12 h-12 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Payment Failed!</h2>
          <p className="text-gray-600 mb-6">Something went wrong. Please try again.</p>
          <button
            onClick={() => window.location.reload()}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition flex items-center justify-center gap-2"
          >
            <ArrowPathIcon className="w-5 h-5" />
            Try Again
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Toaster position="top-right" />
      
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-6">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl font-bold">Secure Payment</h1>
          <p className="text-white/80 mt-1">Complete your purchase securely</p>
        </div>
      </div>

      {/* QR Code Modal for Laptop UPI */}
      <AnimatePresence>
        {generatedQR && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setGeneratedQR(null)}>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-xl max-w-md w-full p-6 text-center"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-xl font-bold mb-2">Scan to Pay with UPI</h2>
              <p className="text-sm text-gray-500 mb-4">Scan this QR code with any UPI app on your phone</p>
              
              <div className="bg-white p-4 rounded-xl inline-block mx-auto">
                <img src={generatedQR} alt="UPI QR Code" className="w-64 h-64 mx-auto" />
              </div>
              
              <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">Amount: <span className="font-bold text-blue-600">₹{totalWithTax}</span></p>
              </div>
              
              <button
                onClick={() => setGeneratedQR(null)}
                className="w-full mt-4 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
              >
                Done
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Payment Methods */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-bold mb-4">Select Payment Method</h2>
              
              <div className="space-y-3">
                {paymentMethods.map((method) => (
                  <motion.label
                    key={method.id}
                    whileHover={{ scale: 1.01 }}
                    className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all ${
                      selectedMethod === method.id
                        ? "border-blue-600 bg-blue-50"
                        : "border-gray-200 hover:border-blue-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment_method"
                      value={method.id}
                      checked={selectedMethod === method.id}
                      onChange={() => setSelectedMethod(method.id)}
                      className="w-5 h-5 text-blue-600"
                    />
                    <div className="ml-4 flex-1">
                      <div className="flex items-center gap-3">
                        <method.icon className="w-6 h-6 text-gray-600" />
                        <div>
                          <p className="font-semibold text-gray-800">{method.name}</p>
                          <p className="text-sm text-gray-500">{method.description}</p>
                        </div>
                      </div>
                    </div>
                    {selectedMethod === method.id && (
                      <CheckCircleIcon className="w-6 h-6 text-blue-600" />
                    )}
                  </motion.label>
                ))}
              </div>

              {/* Secure Payment Badges */}
              <div className="mt-4 flex items-center justify-center gap-6 text-xs text-gray-500">
                <div className="flex items-center gap-1">
                  <ShieldCheckIcon className="w-4 h-4 text-green-600" />
                  <span>100% Secure</span>
                </div>
                <div className="flex items-center gap-1">
                  <LockClosedIcon className="w-4 h-4 text-green-600" />
                  <span>SSL Encrypted</span>
                </div>
                <div>PCI DSS Certified</div>
              </div>

              {/* Payment Button */}
              <button
                onClick={handlePayment}
                disabled={isLoading}
                className="w-full mt-6 bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <LockClosedIcon className="w-5 h-5" />
                    Pay ₹{totalWithTax.toLocaleString()}
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
              <h2 className="text-xl font-bold mb-4">Order Summary</h2>
              
              <div className="space-y-3 border-b pb-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-semibold">₹{parseInt(totalAmount).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="text-green-600">Free</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax (GST 18%)</span>
                  <span>₹{Math.round(parseInt(totalAmount) * 0.18).toLocaleString()}</span>
                </div>
              </div>
              
              <div className="flex justify-between mt-4 pt-2">
                <span className="text-lg font-bold">Total</span>
                <span className="text-2xl font-bold text-blue-600">
                  ₹{totalWithTax.toLocaleString()}
                </span>
              </div>

              <div className="mt-6 bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold mb-2">Why Shop with Us?</h3>
                <ul className="space-y-1 text-sm text-gray-600">
                  <li>✓ Free delivery on orders above ₹999</li>
                  <li>✓ 30-day easy returns policy</li>
                  <li>✓ 100% secure payments</li>
                  <li>✓ 24/7 customer support</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bank Selection Modal for Net Banking */}
      <AnimatePresence>
        {showBankModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowBankModal(false)}>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="sticky top-0 bg-white p-4 border-b flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-bold">Select Bank</h2>
                  <p className="text-sm text-gray-500">Choose your bank for Net Banking</p>
                </div>
                <button onClick={() => setShowBankModal(false)} className="p-1 hover:bg-gray-100 rounded">
                  <XCircleIcon className="w-6 h-6" />
                </button>
              </div>
              
              <div className="p-4">
                <div className="space-y-2">
                  {banks.map((bank) => (
                    <button
                      key={bank.code}
                      onClick={() => {
                        setSelectedBank(bank.code);
                        processRazorpayPayment("netbanking", { bank: bank.code });
                      }}
                      className="w-full p-3 rounded-lg border-2 border-gray-200 hover:border-blue-500 transition text-left"
                    >
                      <p className="font-medium">{bank.name}</p>
                      <p className="text-xs text-gray-500">Code: {bank.code}</p>
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Wallet Selection Modal */}
      <AnimatePresence>
        {showWalletModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowWalletModal(false)}>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-xl max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-4 border-b">
                <h2 className="text-xl font-bold">Select Wallet</h2>
                <p className="text-sm text-gray-500">Choose your mobile wallet</p>
              </div>
              
              <div className="p-4 space-y-2">
                {wallets.map((wallet) => (
                  <button
                    key={wallet.code}
                    onClick={() => {
                      setSelectedWallet(wallet.code);
                      processRazorpayPayment("wallet", { wallet: wallet.code });
                    }}
                    className="w-full flex items-center gap-3 p-3 rounded-lg border-2 border-gray-200 hover:border-blue-500 transition"
                  >
                    <span className="text-2xl">{wallet.icon}</span>
                    <p className="font-medium">{wallet.name}</p>
                  </button>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* UPI ID Modal for Mobile */}
      <AnimatePresence>
        {showUpiModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowUpiModal(false)}>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-xl max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-4 border-b">
                <h2 className="text-xl font-bold">UPI Payment</h2>
                <p className="text-sm text-gray-500">Enter your UPI ID to receive payment request</p>
              </div>
              
              <div className="p-4">
                <label className="block text-sm font-medium mb-2">Your UPI ID</label>
                <input
                  type="text"
                  value={userUpiId}
                  onChange={(e) => setUserUpiId(e.target.value)}
                  placeholder="username@okhdfcbank"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Example: username@okhdfcbank, 9876543210@paytm
                </p>
                <button
                  onClick={() => processRazorpayPayment("upi", { upiId: userUpiId })}
                  disabled={!userUpiId || isLoading}
                  className="w-full mt-4 bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50"
                >
                  {isLoading ? "Processing..." : "Proceed to Pay"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function PaymentPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading payment page...</p>
        </div>
      </div>
    }>
      <PaymentContent />
    </Suspense>
  );
}
