"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import dynamic from 'next/dynamic';

const MapContainer = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), { ssr: false, loading: () => <div className="h-96 w-full bg-gray-100 animate-pulse rounded-lg flex items-center justify-center">Loading map...</div> });
const TileLayer = dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import('react-leaflet').then(mod => mod.Marker), { ssr: false });
const Popup = dynamic(() => import('react-leaflet').then(mod => mod.Popup), { ssr: false });

import 'leaflet/dist/leaflet.css';

let L: any;
let lorryIcon: any = null;
let deliveryLocationIcon: any = null;

if (typeof window !== 'undefined') {
  L = require('leaflet');
  delete (L.Icon.Default.prototype as any)._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  });
  
  lorryIcon = new L.Icon({ iconUrl: 'https://cdn-icons-png.flaticon.com/512/3096/3096965.png', iconSize: [48, 48], iconAnchor: [24, 48], popupAnchor: [0, -48], className: 'drop-shadow-lg' });
  deliveryLocationIcon = new L.Icon({ iconUrl: 'https://cdn-icons-png.flaticon.com/512/854/854878.png', iconSize: [32, 32], iconAnchor: [16, 32], popupAnchor: [0, -32] });
}

import { TruckIcon, CheckCircleIcon, XCircleIcon, ClockIcon, MapPinIcon, PhoneIcon, UserIcon, CubeIcon, ArrowPathIcon, KeyIcon, ShieldCheckIcon, HashtagIcon } from "@heroicons/react/24/outline";

interface Order {
  id: number;
  order_number: string;
  total_amount: number;
  order_status: string;
  payment_status: string;
  items: any[];
  created_at: string;
  customer_name: string;
  customer_phone: string;
  shipping_address: any;
  delivery_otp?: string;
}

const DELIVERY_PARTNER = { id: 1, name: "Rahul Sharma", phone: "+91 98765 43210", vehicle_number: "KA-01-AB-1234", current_lat: 12.9716, current_lng: 77.5946 };

export default function PartnerPage() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showOrderVerificationModal, setShowOrderVerificationModal] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [enteredOrderId, setEnteredOrderId] = useState("");
  const [orderVerificationError, setOrderVerificationError] = useState("");
  const [enteredOtp, setEnteredOtp] = useState("");
  const [otpError, setOtpError] = useState("");
  const [partnerLocation, setPartnerLocation] = useState(DELIVERY_PARTNER.current_lat);
  const locationInterval = useRef<NodeJS.Timeout | null>(null);
  const [orderToDeliver, setOrderToDeliver] = useState<Order | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);

  const handleLogin = () => { setIsLoggedIn(true); toast.success(`Welcome, ${DELIVERY_PARTNER.name}!`); fetchAssignedOrders(); startLocationTracking(); };

  const startLocationTracking = () => {
    if (navigator.geolocation) {
      navigator.permissions.query({ name: 'geolocation' }).then((result) => {
        if (result.state === 'denied') { toast.error("Location permission denied. Please enable in browser settings."); return; }
        navigator.geolocation.getCurrentPosition(
          (position) => { setPartnerLocation(position.coords.latitude); updateDeliveryLocation(position.coords.latitude, position.coords.longitude); },
          (error) => { console.error("Location error:", error); toast.error("Unable to get location. Using default."); },
          { enableHighAccuracy: true, timeout: 10000 }
        );
        locationInterval.current = setInterval(() => {
          navigator.geolocation.getCurrentPosition(
            (position) => { setPartnerLocation(position.coords.latitude); updateDeliveryLocation(position.coords.latitude, position.coords.longitude); },
            (error) => console.error("Location error:", error),
            { enableHighAccuracy: true, timeout: 10000 }
          );
        }, 15000);
      });
    }
  };

  const updateDeliveryLocation = async (lat: number, lng: number) => {
    try { await axios.post("https://e-commerce-backend-2-4b0u.onrender.com/delivery/update-location", { partner_id: DELIVERY_PARTNER.id, lat, lng }); } catch (error) {}
  };

  const fetchAssignedOrders = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`https://e-commerce-backend-2-4b0u.onrender.com/orders/delivery/${DELIVERY_PARTNER.id}`);
      const ordersData = response.data.orders || [];
      setOrders(ordersData);
    } catch (error) {
      console.error("Error fetching orders:", error);
      setOrders([]);
    } finally { setIsLoading(false); }
  };

  const handleOrderSelect = async (order: Order) => {
    setSelectedOrder(order);
  };

  const handleDeliverClick = (order: Order) => {
    setOrderToDeliver(order);
    setShowOrderVerificationModal(true);
    setEnteredOrderId("");
    setOrderVerificationError("");
  };

  const verifyOrderId = () => {
    if (!enteredOrderId || enteredOrderId.trim() === "") {
      setOrderVerificationError("Please enter order ID or last 4 digits");
      return;
    }

    const orderLast4Digits = orderToDeliver?.order_number.slice(-4);
    const inputValue = enteredOrderId.trim();
    
    const isMatch = orderToDeliver?.order_number === inputValue || 
                    orderLast4Digits === inputValue ||
                    orderToDeliver?.order_number.toLowerCase() === inputValue.toLowerCase() ||
                    orderLast4Digits?.toLowerCase() === inputValue.toLowerCase();
    
    if (isMatch) {
      setShowOrderVerificationModal(false);
      setShowOtpModal(true);
      setEnteredOtp("");
      setOtpError("");
      setOrderVerificationError("");
    } else {
      setOrderVerificationError(`Order ID verification failed. Please enter:
        • Full Order ID: ${orderToDeliver?.order_number}
        • Last 4 digits: ${orderToDeliver?.order_number.slice(-4)}`);
    }
  };

  const updateOrderStatus = async (orderId: number, status: string) => {
    try { 
      await axios.put(`https://e-commerce-backend-2-4b0u.onrender.com/order/update-status/${orderId}?status=${status}`); 
      toast.success(`Order status updated to ${status}`); 
      fetchAssignedOrders(); 
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const verifyOtpAndDeliver = async () => {
    if (!enteredOtp || enteredOtp.length !== 6) { 
      setOtpError("Please enter a valid 6-digit OTP"); 
      return; 
    }
    
    setIsVerifying(true);
    
    try {
      // First, verify the OTP with backend
      const verifyResponse = await axios.post(`https://e-commerce-backend-2-4b0u.onrender.com/order/verify-otp/${orderToDeliver?.id}`, {
        otp: enteredOtp
      });
      
      if (verifyResponse.data.valid) {
        // If OTP is valid, complete the delivery
        await axios.put(`https://e-commerce-backend-2-4b0u.onrender.com/order/deliver/${orderToDeliver?.id}`);
        
        toast.success("OTP verified! Order delivered successfully! 🎉");
        setShowOtpModal(false);
        setEnteredOtp("");
        setOrderToDeliver(null);
        fetchAssignedOrders();
        setSelectedOrder(null);
      } else {
        setOtpError(verifyResponse.data.message || "Invalid OTP. Please check with customer.");
        setEnteredOtp("");
      }
    } catch (error: any) {
      console.error("Delivery error:", error);
      if (error.response?.data?.message) {
        setOtpError(error.response.data.message);
      } else {
        setOtpError("Failed to verify OTP. Please try again.");
      }
      setEnteredOtp("");
    } finally {
      setIsVerifying(false);
    }
  };

  const markAsOutForDelivery = async (orderId: number) => {
    try {
      // Call backend to mark order as out for delivery and generate OTP
      const response = await axios.post(`https://e-commerce-backend-2-4b0u.onrender.com/order/out-for-delivery/${orderId}`);
      const otp = response.data.otp;
      
      toast.success(`Order #${orderId} is now Out for Delivery!`, { duration: 10000, icon: "🚚" });
      
      // Update the order with the new OTP from backend
      setOrders(prevOrders => prevOrders.map(order => 
        order.id === orderId ? { ...order, order_status: "out_for_delivery", delivery_otp: otp } : order
      ));
      
      fetchAssignedOrders();
    } catch (error) {
      console.error("Error marking as out for delivery:", error);
      toast.error("Failed to update delivery status. Please try again.");
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "out_for_delivery": return <span className="px-2 py-1 bg-orange-100 text-orange-600 rounded-full text-xs font-semibold flex items-center gap-1"><TruckIcon className="w-3 h-3" /> Out for Delivery</span>;
      case "confirmed": return <span className="px-2 py-1 bg-blue-100 text-blue-600 rounded-full text-xs font-semibold flex items-center gap-1"><CubeIcon className="w-3 h-3" /> Confirmed</span>;
      case "delivered": return <span className="px-2 py-1 bg-green-100 text-green-600 rounded-full text-xs font-semibold flex items-center gap-1"><CheckCircleIcon className="w-3 h-3" /> Delivered</span>;
      default: return <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-semibold">{status}</span>;
    }
  };

  useEffect(() => { 
    return () => { 
      if (locationInterval.current) clearInterval(locationInterval.current); 
    }; 
  }, []);

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center p-4">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8">
          <div className="text-center mb-6"><TruckIcon className="w-16 h-16 text-blue-600 mx-auto mb-3" /><h1 className="text-2xl font-bold text-gray-800">Delivery Partner Portal</h1><p className="text-gray-500 text-sm mt-1">Sign in to manage deliveries</p></div>
          <div className="space-y-4"><div className="bg-blue-50 rounded-lg p-4"><p className="text-sm text-blue-800">Demo Credentials:</p><p className="text-xs text-blue-600 mt-1">ID: {DELIVERY_PARTNER.id}</p><p className="text-xs text-blue-600">Name: {DELIVERY_PARTNER.name}</p></div><button onClick={handleLogin} className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition">Login as Delivery Partner</button></div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Toaster position="top-right" />
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3"><TruckIcon className="w-8 h-8" /><div><h1 className="text-xl font-bold">Delivery Partner Portal</h1><p className="text-sm text-white/80">{DELIVERY_PARTNER.name} • {DELIVERY_PARTNER.vehicle_number}</p></div></div>
            <button onClick={() => { setIsLoggedIn(false); if (locationInterval.current) clearInterval(locationInterval.current); toast.success("Logged out successfully!"); }} className="bg-white/20 px-3 py-1 rounded-lg text-sm hover:bg-white/30">Logout</button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-4">
            <div className="bg-white rounded-xl shadow-sm p-4">
              <h2 className="font-bold text-lg mb-3">My Deliveries</h2>
              {isLoading ? (<div className="text-center py-8"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div><p className="text-sm text-gray-500 mt-2">Loading orders...</p></div>) : orders.length === 0 ? (<div className="text-center py-8"><CubeIcon className="w-12 h-12 text-gray-300 mx-auto mb-2" /><p className="text-gray-500">No active deliveries</p></div>) : (
                <div className="space-y-3">{orders.map((order) => (<motion.div key={order.id} whileHover={{ scale: 1.02 }} className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${selectedOrder?.id === order.id ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-blue-300"}`} onClick={() => handleOrderSelect(order)}><div className="flex justify-between items-start mb-2"><p className="font-semibold text-sm">Order #{order.order_number.slice(-8)}</p>{getStatusBadge(order.order_status)}</div><p className="text-xs text-gray-500 mb-1">Customer: {order.customer_name}</p><p className="text-xs text-gray-500">Amount: ₹{order.total_amount}</p><p className="text-xs text-gray-400 mt-2">{order.shipping_address?.city || "N/A"}</p></motion.div>))}</div>
              )}
            </div>
          </div>

          <div className="lg:col-span-2 space-y-4">
            {selectedOrder ? (
              <>
                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                  <div className="bg-gray-50 p-3 border-b"><h3 className="font-semibold flex items-center gap-2"><MapPinIcon className="w-5 h-5 text-red-500" /> Delivery Route - Live Tracking</h3></div>
                  <div className="h-80 w-full"><MapContainer center={[partnerLocation, 77.5946]} zoom={13} style={{ height: "100%", width: "100%" }}><TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; OpenStreetMap' /><Marker position={[partnerLocation, 77.5946]} icon={lorryIcon}><Popup><div className="text-center"><p className="font-semibold">🚚 Your Vehicle</p><p className="text-sm">{DELIVERY_PARTNER.vehicle_number}</p><p className="text-xs text-green-600">Live Location</p></div></Popup></Marker><Marker position={[12.9352, 77.6245]} icon={deliveryLocationIcon}><Popup><div className="text-center"><p className="font-semibold">📍 Delivery Location</p><p className="text-sm">{selectedOrder.shipping_address?.addressLine || "Address not available"}</p></div></Popup></Marker></MapContainer></div>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-4">
                  <h3 className="font-semibold text-lg mb-3">Order Details</h3>
                  <div className="grid grid-cols-2 gap-4 mb-4"><div><p className="text-xs text-gray-500">Order Number</p><p className="font-semibold">{selectedOrder.order_number}</p></div><div><p className="text-xs text-gray-500">Total Amount</p><p className="font-semibold text-blue-600">₹{selectedOrder.total_amount}</p></div></div>
                  <div className="border-t pt-3 mb-3"><h4 className="font-semibold text-sm mb-2 flex items-center gap-2"><UserIcon className="w-4 h-4" /> Customer Details</h4><p className="text-sm">Name: {selectedOrder.customer_name}</p><div className="flex items-center gap-2 mt-1"><PhoneIcon className="w-4 h-4 text-gray-400" /><a href={`tel:${selectedOrder.customer_phone}`} className="text-sm text-blue-600">{selectedOrder.customer_phone}</a></div></div>
                  <div className="border-t pt-3 mb-4"><h4 className="font-semibold text-sm mb-2 flex items-center gap-2"><MapPinIcon className="w-4 h-4" /> Delivery Address</h4><p className="text-sm">{selectedOrder.shipping_address?.fullName}</p><p className="text-sm text-gray-600">{selectedOrder.shipping_address?.addressLine}</p><p className="text-sm text-gray-600">{selectedOrder.shipping_address?.city}, {selectedOrder.shipping_address?.state} - {selectedOrder.shipping_address?.pincode}</p><p className="text-sm text-gray-600">Phone: {selectedOrder.shipping_address?.phone}</p></div>
                  
                  {selectedOrder.order_status === "out_for_delivery" && selectedOrder.delivery_otp && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
                      <p className="text-sm font-semibold text-yellow-800">🔐 Order OTP (for reference): <span className="text-2xl font-mono tracking-wider">{selectedOrder.delivery_otp}</span></p>
                      <p className="text-xs text-yellow-600 mt-1">Ask customer for this 6-digit code to complete delivery</p>
                    </div>
                  )}
                  
                  <div className="flex gap-3">
                    {selectedOrder.order_status === "confirmed" && <button onClick={() => markAsOutForDelivery(selectedOrder.id)} className="flex-1 bg-orange-600 text-white py-2 rounded-lg font-semibold hover:bg-orange-700 transition flex items-center justify-center gap-2"><TruckIcon className="w-5 h-5" /> Start Delivery</button>}
                    {selectedOrder.order_status === "out_for_delivery" && <button onClick={() => handleDeliverClick(selectedOrder)} className="flex-1 bg-green-600 text-white py-2 rounded-lg font-semibold hover:bg-green-700 transition flex items-center justify-center gap-2"><KeyIcon className="w-5 h-5" /> Verify & Deliver</button>}
                    {selectedOrder.order_status === "delivered" && <div className="flex-1 bg-green-100 text-green-600 py-2 rounded-lg font-semibold flex items-center justify-center gap-2"><CheckCircleIcon className="w-5 h-5" /> Delivered</div>}
                  </div>
                </div>
              </>
            ) : (<div className="bg-white rounded-xl shadow-sm p-8 text-center"><CubeIcon className="w-16 h-16 text-gray-300 mx-auto mb-3" /><h3 className="text-lg font-semibold text-gray-600">Select an order</h3><p className="text-sm text-gray-400">Choose an order from the list to view details</p></div>)}
          </div>
        </div>
      </div>

      {/* Order ID Verification Modal */}
      <AnimatePresence>
        {showOrderVerificationModal && orderToDeliver && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[60] p-4">
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="bg-white rounded-2xl max-w-md w-full overflow-hidden shadow-2xl">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 text-white text-center">
                <HashtagIcon className="w-12 h-12 mx-auto mb-2" />
                <h2 className="text-xl font-bold">Verify Order ID</h2>
                <p className="text-sm text-white/80">Please enter the Order ID or last 4 digits</p>
              </div>
              <div className="p-6">
                <div className="text-center mb-6">
                  <p className="text-gray-600 mb-2">Order to Deliver</p>
                  <div className="bg-gray-100 rounded-lg p-3">
                    <p className="font-semibold text-gray-800">{orderToDeliver.order_number}</p>
                    <p className="text-sm text-gray-500">Customer: {orderToDeliver.customer_name}</p>
                    <p className="text-xs text-gray-400 mt-1">Last 4 digits: <span className="font-mono font-bold">{orderToDeliver.order_number.slice(-4)}</span></p>
                  </div>
                </div>
                
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Enter Order ID or Last 4 Digits
                  </label>
                  <input 
                    type="text" 
                    value={enteredOrderId} 
                    onChange={(e) => { 
                      setEnteredOrderId(e.target.value); 
                      setOrderVerificationError(""); 
                    }} 
                    className="w-full text-center text-lg py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                    placeholder="e.g., ORD-20260417-1CB9A73A or A73A"
                    autoFocus 
                  />
                  {orderVerificationError && (
                    <p className="text-red-500 text-sm mt-2 whitespace-pre-line">{orderVerificationError}</p>
                  )}
                </div>
                
                <div className="flex gap-3">
                  <button 
                    onClick={() => { 
                      setShowOrderVerificationModal(false); 
                      setOrderToDeliver(null);
                      setEnteredOrderId("");
                      setOrderVerificationError("");
                    }} 
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={verifyOrderId} 
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition flex items-center justify-center gap-2"
                  >
                    <KeyIcon className="w-5 h-5" /> Verify Order
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* OTP Verification Modal */}
      <AnimatePresence>
        {showOtpModal && orderToDeliver && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[60] p-4">
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="bg-white rounded-2xl max-w-md w-full overflow-hidden shadow-2xl">
              <div className="bg-gradient-to-r from-green-600 to-teal-600 p-4 text-white text-center">
                <ShieldCheckIcon className="w-12 h-12 mx-auto mb-2" />
                <h2 className="text-xl font-bold">Verify Delivery OTP</h2>
                <p className="text-sm text-white/80">Ask customer for the 6-digit OTP shown on their order page</p>
              </div>
              <div className="p-6">
                <div className="text-center mb-6">
                  <p className="text-gray-600 mb-2">Order #{orderToDeliver.order_number}</p>
                  <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                    <UserIcon className="w-4 h-4" />
                    <span>Customer: {orderToDeliver.customer_name}</span>
                  </div>
                </div>
                
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Enter 6-digit OTP from Customer
                  </label>
                  <input 
                    type="text" 
                    maxLength={6} 
                    value={enteredOtp} 
                    onChange={(e) => { 
                      const value = e.target.value.replace(/[^0-9]/g, ''); 
                      setEnteredOtp(value); 
                      setOtpError(""); 
                    }} 
                    className="w-full text-center text-2xl tracking-widest py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 font-mono" 
                    placeholder="------" 
                    autoFocus 
                    disabled={isVerifying}
                  />
                  {otpError && <p className="text-red-500 text-sm mt-1">{otpError}</p>}
                </div>
                
                <div className="flex gap-3">
                  <button 
                    onClick={() => { 
                      setShowOtpModal(false); 
                      setEnteredOtp(""); 
                      setOtpError("");
                      setOrderToDeliver(null);
                    }} 
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition"
                    disabled={isVerifying}
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={verifyOtpAndDeliver} 
                    disabled={isVerifying}
                    className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isVerifying ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                        Verifying...
                      </>
                    ) : (
                      <>
                        <CheckCircleIcon className="w-5 h-5" /> Verify & Deliver
                      </>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <footer className="bg-gray-900 text-white py-4 mt-8">
        <div className="container mx-auto px-4 text-center text-sm text-gray-400">
          <p>© 2024 ShopHub Delivery Partner Portal | Live GPS Tracking</p>
        </div>
      </footer>
    </div>
  );
}