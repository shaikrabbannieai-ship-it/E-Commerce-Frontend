"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";

import {
  UserCircleIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  CalendarIcon,
  PencilIcon,
  CameraIcon,
  KeyIcon,
  ArrowRightIcon,
  CheckBadgeIcon,
  ShoppingBagIcon,
  HeartIcon,
  TruckIcon,
  ShieldCheckIcon,
  XMarkIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";
import { CheckCircleIcon } from "@heroicons/react/24/solid";

interface UserData {
  id: number;
  full_name: string;
  email: string;
  phone?: string;
  date_of_birth?: string;
  gender?: string;
  address?: {
    line1: string;
    line2?: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
  };
  created_at: string;
  last_login?: string;
  profile_picture?: string;
}

interface Order {
  id: number;
  order_number: string;
  total_amount: number;
  order_status: string;
  payment_status: string;
  items: any[];
  created_at: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [profilePicture, setProfilePicture] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const userId = typeof window !== 'undefined' ? localStorage.getItem("user_id") : null;

  // Edit form state
  const [editForm, setEditForm] = useState({
    full_name: "",
    phone: "",
    date_of_birth: "",
    gender: "",
  });

  // Password reset form
  const [passwordForm, setPasswordForm] = useState({
    current_password: "",
    new_password: "",
    confirm_password: "",
  });

  // Address form
  const [addressForm, setAddressForm] = useState({
    line1: "",
    line2: "",
    city: "",
    state: "",
    pincode: "",
    country: "India",
  });

  // Fetch user data
  useEffect(() => {
    if (!userId) {
      router.push("/login");
      return;
    }
    fetchUserData();
    fetchOrders();
  }, [userId]);

  const fetchUserData = async () => {
    try {
      // Simulate API call - replace with actual backend endpoint
      // For now, get from localStorage
      const name = localStorage.getItem("user_name");
      const email = localStorage.getItem("user_email") || "shaikrabbannie786@gmail.com";
      
      // Demo data - replace with actual API call
      const demoUser: UserData = {
        id: parseInt(userId!),
        full_name: name || "Shaik Rabbannie",
        email: email,
        phone: "+91 98765 43210",
        date_of_birth: "1995-06-15",
        gender: "Male",
        address: {
          line1: "123, MG Road",
          line2: "Near City Center",
          city: "Bangalore",
          state: "Karnataka",
          pincode: "560001",
          country: "India",
        },
        created_at: "2024-01-15T10:30:00Z",
        last_login: new Date().toISOString(),
        profile_picture: null,
      };
      
      setUserData(demoUser);
      setEditForm({
        full_name: demoUser.full_name,
        phone: demoUser.phone || "",
        date_of_birth: demoUser.date_of_birth || "",
        gender: demoUser.gender || "",
      });
      if (demoUser.address) {
        setAddressForm({
          line1: demoUser.address.line1,
          line2: demoUser.address.line2 || "",
          city: demoUser.address.city,
          state: demoUser.address.state,
          pincode: demoUser.address.pincode,
          country: demoUser.address.country,
        });
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      toast.error("Failed to load profile data");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchOrders = async () => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/orders/${userId}`);
      setOrders(response.data.orders || []);
    } catch (error) {
      console.error("Error fetching orders:", error);
      // Demo orders if backend not available
      setOrders([]);
    }
  };

  const handleProfilePictureUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePicture(reader.result as string);
        toast.success("Profile picture updated!");
      };
      reader.readAsDataURL(file);
    }
  };

// Replace the handleUpdateProfile function with this:

const handleUpdateProfile = async () => {
  setIsLoading(true);
  try {
    const response = await axios.put(`http://127.0.0.1:8000/user/${userId}`, {
      full_name: editForm.full_name,
      phone: editForm.phone,
      date_of_birth: editForm.date_of_birth,
      gender: editForm.gender,
    });
    
    if (response.data.message === "User updated successfully") {
      // Update local state
      setUserData(prev => ({
        ...prev!,
        full_name: editForm.full_name,
        phone: editForm.phone,
        date_of_birth: editForm.date_of_birth,
        gender: editForm.gender,
      }));
      
      // Update localStorage
      localStorage.setItem("user_name", editForm.full_name);
      
      setIsEditing(false);
      toast.success("Profile updated successfully!");
      
      // Optionally refresh the page to reflect changes everywhere
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    }
  } catch (error: any) {
    console.error("Error updating profile:", error);
    toast.error(error.response?.data?.detail || "Failed to update profile");
  } finally {
    setIsLoading(false);
  }
};

  const handleUpdateAddress = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setUserData(prev => ({
        ...prev!,
        address: {
          line1: addressForm.line1,
          line2: addressForm.line2,
          city: addressForm.city,
          state: addressForm.state,
          pincode: addressForm.pincode,
          country: addressForm.country,
        },
      }));
      
      setShowAddressModal(false);
      toast.success("Address updated successfully!");
    } catch (error) {
      toast.error("Failed to update address");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordReset = async () => {
    if (passwordForm.new_password !== passwordForm.confirm_password) {
      toast.error("New passwords don't match");
      return;
    }
    
    if (passwordForm.new_password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }
    
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setShowPasswordModal(false);
      setPasswordForm({ current_password: "", new_password: "", confirm_password: "" });
      toast.success("Password changed successfully!");
    } catch (error) {
      toast.error("Failed to change password");
    } finally {
      setIsLoading(false);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map(word => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered": return "text-green-600 bg-green-50";
      case "shipped": return "text-blue-600 bg-blue-50";
      case "processing": return "text-yellow-600 bg-yellow-50";
      case "cancelled": return "text-red-600 bg-red-50";
      default: return "text-gray-600 bg-gray-50";
    }
  };

  if (isLoading && !userData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Toaster position="top-right" />
      
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-4">
            <button onClick={() => router.push("/")} className="text-white hover:text-gray-200">
              ← Back to Home
            </button>
            <h1 className="text-2xl font-bold">My Profile</h1>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm overflow-hidden sticky top-24">
              {/* Profile Header */}
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-center text-white">
                <div className="relative inline-block">
                  {profilePicture || userData?.profile_picture ? (
                    <img
                      src={profilePicture || userData?.profile_picture}
                      alt="Profile"
                      className="w-24 h-24 rounded-full border-4 border-white object-cover mx-auto"
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-full border-4 border-white bg-white/20 flex items-center justify-center mx-auto">
                      <span className="text-3xl font-bold">{getInitials(userData?.full_name || "User")}</span>
                    </div>
                  )}
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute bottom-0 right-0 bg-white rounded-full p-1.5 shadow-md hover:scale-110 transition"
                  >
                    <CameraIcon className="w-4 h-4 text-gray-600" />
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleProfilePictureUpload}
                    className="hidden"
                  />
                </div>
                <h2 className="text-xl font-semibold mt-3">{userData?.full_name}</h2>
                <p className="text-white/80 text-sm mt-1">Member since {new Date(userData?.created_at || "").toLocaleDateString()}</p>
                <div className="flex items-center justify-center gap-1 mt-2">
                  <CheckBadgeIcon className="w-4 h-4 text-yellow-400" />
                  <span className="text-xs">Verified Account</span>
                </div>
              </div>

              {/* Profile Stats */}
              <div className="p-4 border-b">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-2xl font-bold text-gray-800">{orders.length}</p>
                    <p className="text-xs text-gray-500">Orders</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-800">0</p>
                    <p className="text-xs text-gray-500">Wishlist</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-800">100%</p>
                    <p className="text-xs text-gray-500">Rating</p>
                  </div>
                </div>
              </div>

              {/* Quick Links */}
              <div className="p-4 space-y-2">
                <button
                  onClick={() => setIsEditing(true)}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-gray-50 transition group"
                >
                  <div className="flex items-center gap-3">
                    <PencilIcon className="w-5 h-5 text-gray-500" />
                    <span className="text-sm">Edit Profile</span>
                  </div>
                  <ChevronRightIcon className="w-4 h-4 text-gray-400" />
                </button>
                
                <button
                  onClick={() => setShowAddressModal(true)}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-gray-50 transition group"
                >
                  <div className="flex items-center gap-3">
                    <MapPinIcon className="w-5 h-5 text-gray-500" />
                    <span className="text-sm">Manage Addresses</span>
                  </div>
                  <ChevronRightIcon className="w-4 h-4 text-gray-400" />
                </button>
                
                <button
                  onClick={() => setShowPasswordModal(true)}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-gray-50 transition group"
                >
                  <div className="flex items-center gap-3">
                    <KeyIcon className="w-5 h-5 text-gray-500" />
                    <span className="text-sm">Change Password</span>
                  </div>
                  <ChevronRightIcon className="w-4 h-4 text-gray-400" />
                </button>
                
                <button
                  onClick={() => router.push("/orders")}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-gray-50 transition group"
                >
                  <div className="flex items-center gap-3">
                    <ShoppingBagIcon className="w-5 h-5 text-gray-500" />
                    <span className="text-sm">My Orders</span>
                  </div>
                  <ChevronRightIcon className="w-4 h-4 text-gray-400" />
                </button>
                
                <button
                  onClick={() => router.push("/wishlist")}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-gray-50 transition group"
                >
                  <div className="flex items-center gap-3">
                    <HeartIcon className="w-5 h-5 text-gray-500" />
                    <span className="text-sm">Wishlist</span>
                  </div>
                  <ChevronRightIcon className="w-4 h-4 text-gray-400" />
                </button>
              </div>

              {/* Logout Button */}
              <div className="p-4 border-t">
                <button
                  onClick={() => {
                    localStorage.removeItem("access_token");
                    localStorage.removeItem("user_name");
                    localStorage.removeItem("user_id");
                    toast.success("Logged out successfully!");
                    router.push("/login");
                  }}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition"
                >
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right Column - Profile Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Information Card */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Personal Information</h3>
                <button
                  onClick={() => setIsEditing(true)}
                  className="text-blue-600 text-sm font-medium hover:underline flex items-center gap-1"
                >
                  <PencilIcon className="w-4 h-4" />
                  Edit
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:justify-between py-3 border-b">
                  <span className="text-sm text-gray-500">Full Name</span>
                  <span className="text-sm font-medium text-gray-800">{userData?.full_name}</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between py-3 border-b">
                  <span className="text-sm text-gray-500">Email Address</span>
                  <span className="text-sm font-medium text-gray-800">{userData?.email}</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between py-3 border-b">
                  <span className="text-sm text-gray-500">Phone Number</span>
                  <span className="text-sm font-medium text-gray-800">{userData?.phone || "Not added"}</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between py-3 border-b">
                  <span className="text-sm text-gray-500">Date of Birth</span>
                  <span className="text-sm font-medium text-gray-800">
                    {userData?.date_of_birth ? new Date(userData.date_of_birth).toLocaleDateString() : "Not added"}
                  </span>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between py-3 border-b">
                  <span className="text-sm text-gray-500">Gender</span>
                  <span className="text-sm font-medium text-gray-800">{userData?.gender || "Not specified"}</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between py-3">
                  <span className="text-sm text-gray-500">Last Login</span>
                  <span className="text-sm font-medium text-gray-800">
                    {userData?.last_login ? new Date(userData.last_login).toLocaleString() : "Today"}
                  </span>
                </div>
              </div>
            </div>

            {/* Address Card */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Saved Address</h3>
                <button
                  onClick={() => setShowAddressModal(true)}
                  className="text-blue-600 text-sm font-medium hover:underline flex items-center gap-1"
                >
                  <PencilIcon className="w-4 h-4" />
                  Edit
                </button>
              </div>
              
              {userData?.address ? (
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-800">{userData.address.line1}</p>
                  {userData.address.line2 && <p className="text-sm text-gray-800 mt-1">{userData.address.line2}</p>}
                  <p className="text-sm text-gray-800 mt-1">
                    {userData.address.city}, {userData.address.state} - {userData.address.pincode}
                  </p>
                  <p className="text-sm text-gray-800 mt-1">{userData.address.country}</p>
                  <div className="flex items-center gap-2 mt-3">
                    <ShieldCheckIcon className="w-4 h-4 text-green-600" />
                    <span className="text-xs text-green-600">Default Delivery Address</span>
                  </div>
                </div>
              ) : (
                <p className="text-gray-500 text-sm">No address added</p>
              )}
            </div>

            {/* Recent Orders Card */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Recent Orders</h3>
                <button
                  onClick={() => router.push("/orders")}
                  className="text-blue-600 text-sm font-medium hover:underline flex items-center gap-1"
                >
                  View All
                  <ArrowRightIcon className="w-4 h-4" />
                </button>
              </div>
              
              {orders.length > 0 ? (
                <div className="space-y-3">
                  {orders.slice(0, 3).map((order) => (
                    <div key={order.id} className="border rounded-lg p-4 hover:shadow-md transition">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-sm font-semibold text-gray-800">Order #{order.order_number}</p>
                          <p className="text-xs text-gray-500 mt-1">{new Date(order.created_at).toLocaleDateString()}</p>
                        </div>
                        <div className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.order_status)}`}>
                          {order.order_status.charAt(0).toUpperCase() + order.order_status.slice(1)}
                        </div>
                      </div>
                      <div className="flex justify-between items-center mt-3">
                        <p className="text-lg font-bold text-blue-600">₹{order.total_amount}</p>
                        <button className="text-blue-600 text-sm hover:underline">Track Order →</button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <ShoppingBagIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">No orders yet</p>
                  <button
                    onClick={() => router.push("/")}
                    className="mt-3 text-blue-600 text-sm font-medium hover:underline"
                  >
                    Start Shopping →
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      <AnimatePresence>
        {isEditing && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setIsEditing(false)}>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="sticky top-0 bg-white p-4 border-b flex justify-between items-center">
                <h2 className="text-xl font-bold">Edit Profile</h2>
                <button onClick={() => setIsEditing(false)} className="p-1 hover:bg-gray-100 rounded">
                  <XMarkIcon className="w-6 h-6" />
                </button>
              </div>
              
              <div className="p-4 space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Full Name</label>
                  <input
                    type="text"
                    value={editForm.full_name}
                    onChange={(e) => setEditForm({ ...editForm, full_name: e.target.value })}
                    className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Phone Number</label>
                  <input
                    type="tel"
                    value={editForm.phone}
                    onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                    placeholder="+91 98765 43210"
                    className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Date of Birth</label>
                  <input
                    type="date"
                    value={editForm.date_of_birth}
                    onChange={(e) => setEditForm({ ...editForm, date_of_birth: e.target.value })}
                    className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Gender</label>
                  <select
                    value={editForm.gender}
                    onChange={(e) => setEditForm({ ...editForm, gender: e.target.value })}
                    className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                
                <button
                  onClick={handleUpdateProfile}
                  disabled={isLoading}
                  className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50"
                >
                  {isLoading ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Change Password Modal */}
      <AnimatePresence>
        {showPasswordModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowPasswordModal(false)}>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-xl max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-4 border-b flex justify-between items-center">
                <h2 className="text-xl font-bold">Change Password</h2>
                <button onClick={() => setShowPasswordModal(false)} className="p-1 hover:bg-gray-100 rounded">
                  <XMarkIcon className="w-6 h-6" />
                </button>
              </div>
              
              <div className="p-4 space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Current Password</label>
                  <input
                    type="password"
                    value={passwordForm.current_password}
                    onChange={(e) => setPasswordForm({ ...passwordForm, current_password: e.target.value })}
                    className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">New Password</label>
                  <input
                    type="password"
                    value={passwordForm.new_password}
                    onChange={(e) => setPasswordForm({ ...passwordForm, new_password: e.target.value })}
                    className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">Must be at least 8 characters</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Confirm New Password</label>
                  <input
                    type="password"
                    value={passwordForm.confirm_password}
                    onChange={(e) => setPasswordForm({ ...passwordForm, confirm_password: e.target.value })}
                    className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <button
                  onClick={handlePasswordReset}
                  disabled={isLoading}
                  className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50"
                >
                  {isLoading ? "Changing..." : "Change Password"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Address Modal */}
      <AnimatePresence>
        {showAddressModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowAddressModal(false)}>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="sticky top-0 bg-white p-4 border-b flex justify-between items-center">
                <h2 className="text-xl font-bold">Manage Address</h2>
                <button onClick={() => setShowAddressModal(false)} className="p-1 hover:bg-gray-100 rounded">
                  <XMarkIcon className="w-6 h-6" />
                </button>
              </div>
              
              <div className="p-4 space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Address Line 1</label>
                  <input
                    type="text"
                    value={addressForm.line1}
                    onChange={(e) => setAddressForm({ ...addressForm, line1: e.target.value })}
                    placeholder="House number, building, street"
                    className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Address Line 2 (Optional)</label>
                  <input
                    type="text"
                    value={addressForm.line2}
                    onChange={(e) => setAddressForm({ ...addressForm, line2: e.target.value })}
                    placeholder="Apartment, suite, unit"
                    className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">City</label>
                    <input
                      type="text"
                      value={addressForm.city}
                      onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                      className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">State</label>
                    <input
                      type="text"
                      value={addressForm.state}
                      onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })}
                      className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Pincode</label>
                    <input
                      type="text"
                      value={addressForm.pincode}
                      onChange={(e) => setAddressForm({ ...addressForm, pincode: e.target.value })}
                      className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Country</label>
                    <input
                      type="text"
                      value={addressForm.country}
                      onChange={(e) => setAddressForm({ ...addressForm, country: e.target.value })}
                      className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                
                <button
                  onClick={handleUpdateAddress}
                  disabled={isLoading}
                  className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50"
                >
                  {isLoading ? "Saving..." : "Save Address"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}