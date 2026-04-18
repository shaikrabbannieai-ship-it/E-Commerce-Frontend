"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";

import {
  ShoppingBagIcon,
  TrashIcon,
  PlusIcon,
  MinusIcon,
  ArrowRightIcon,
  CreditCardIcon,
  TruckIcon,
  ShieldCheckIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

interface CartItem {
  id: number;
  product_id: number;
  product_name: string;
  product_price: number;
  product_image: string;
  quantity: number;
  size?: string;
  color?: string;
}

interface CartData {
  items: CartItem[];
  total: number;
  item_count: number;
}

export default function CartPage() {
  const router = useRouter();
  const [cart, setCart] = useState<CartData>({ items: [], total: 0, item_count: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [address, setAddress] = useState({
    fullName: "",
    addressLine: "",
    city: "",
    state: "",
    pincode: "",
    phone: "",
  });

  const userId = typeof window !== 'undefined' ? localStorage.getItem("user_id") : null;

  useEffect(() => {
    if (userId) {
      fetchCart();
      fetchSavedAddress(); // ✅ Fetch saved address from database
    } else {
      router.push("/login");
    }
  }, [userId]);

  const fetchCart = async () => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/cart/${userId}`);
      setCart(response.data);
    } catch (error) {
      console.error("Error fetching cart:", error);
      toast.error("Failed to load cart");
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ Fetch saved address from database
  const fetchSavedAddress = async () => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/user/${userId}`);
      if (response.data.address) {
        setAddress({
          fullName: response.data.full_name || "",
          addressLine: response.data.address.line1 || "",
          city: response.data.address.city || "",
          state: response.data.address.state || "",
          pincode: response.data.address.pincode || "",
          phone: response.data.phone || "",
        });
      }
    } catch (error) {
      console.error("Error fetching address:", error);
    }
  };

  // ✅ Save address to database
  const saveAddressToDatabase = async () => {
    try {
      await axios.put(`http://127.0.0.1:8000/user/${userId}`, {
        full_name: address.fullName,
        phone: address.phone,
        address: {
          line1: address.addressLine,
          city: address.city,
          state: address.state,
          pincode: address.pincode,
          country: "India"
        }
      });
      return true;
    } catch (error) {
      console.error("Error saving address:", error);
      return false;
    }
  };

  const updateQuantity = async (itemId: number, newQuantity: number) => {
    if (newQuantity < 1) {
      await removeItem(itemId);
      return;
    }

    try {
      await axios.put(`http://127.0.0.1:8000/cart/update/${itemId}`, null, {
        params: { quantity: newQuantity }
      });
      fetchCart();
      toast.success("Cart updated");
    } catch (error) {
      toast.error("Failed to update cart");
    }
  };

  const removeItem = async (itemId: number) => {
    try {
      await axios.delete(`http://127.0.0.1:8000/cart/remove/${itemId}`);
      fetchCart();
      toast.success("Item removed");
    } catch (error) {
      toast.error("Failed to remove item");
    }
  };

  // ✅ Updated handleCheckout - saves address to database before proceeding
  const handleCheckout = async () => {
    if (!address.fullName || !address.addressLine || !address.city || !address.pincode || !address.phone) {
      toast.error("Please fill all address fields");
      return;
    }

    setIsCheckingOut(true);
    
    // ✅ Save address to database first
    const addressSaved = await saveAddressToDatabase();
    
    if (!addressSaved) {
      toast.error("Failed to save address. Please try again.");
      setIsCheckingOut(false);
      return;
    }
    
    // ✅ Calculate total with tax
    const totalWithTax = cart.total + Math.round(cart.total * 0.18);
    
    // ✅ Close modal and redirect to payment page
    setShowAddressModal(false);
    toast.success("Address saved! Redirecting to payment...");
    
    setTimeout(() => {
      router.push(`/payment?amount=${totalWithTax}`);
    }, 1000);
    
    setIsCheckingOut(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading cart...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Toaster position="top-right" />
      
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <button onClick={() => router.push("/")} className="text-blue-600 hover:text-blue-700">
              ← Continue Shopping
            </button>
            <h1 className="text-2xl font-bold text-gray-800">My Cart</h1>
            <span className="text-gray-500">({cart.item_count} items)</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {cart.items.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-lg">
            <ShoppingBagIcon className="w-24 h-24 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-600 mb-2">Your cart is empty</h2>
            <p className="text-gray-400 mb-6">Looks like you haven't added any items yet</p>
            <button
              onClick={() => router.push("/")}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cart.items.map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition"
                >
                  <div className="flex gap-4">
                    <img
                      src={item.product_image || "https://via.placeholder.com/100"}
                      alt={item.product_name}
                      className="w-24 h-24 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800">{item.product_name}</h3>
                      {item.size && <p className="text-sm text-gray-500">Size: {item.size}</p>}
                      {item.color && <p className="text-sm text-gray-500">Color: {item.color}</p>}
                      <p className="text-lg font-bold text-blue-600 mt-1">₹{item.product_price}</p>
                    </div>
                    <div className="flex flex-col items-end gap-3">
                      <div className="flex items-center gap-2 border rounded-lg">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="p-2 hover:bg-gray-100 transition"
                        >
                          <MinusIcon className="w-4 h-4" />
                        </button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-2 hover:bg-gray-100 transition"
                        >
                          <PlusIcon className="w-4 h-4" />
                        </button>
                      </div>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-red-500 hover:text-red-600 text-sm flex items-center gap-1"
                      >
                        <TrashIcon className="w-4 h-4" /> Remove
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg p-6 shadow-sm sticky top-20">
                <h2 className="text-xl font-bold mb-4">Order Summary</h2>
                
                <div className="space-y-3 border-b pb-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal ({cart.item_count} items)</span>
                    <span className="font-semibold">₹{cart.total}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span className="text-green-600">Free</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tax (GST 18%)</span>
                    <span>₹{Math.round(cart.total * 0.18)}</span>
                  </div>
                </div>
                
                <div className="flex justify-between mt-4 pb-4 border-b">
                  <span className="text-lg font-bold">Total</span>
                  <span className="text-2xl font-bold text-blue-600">₹{cart.total + Math.round(cart.total * 0.18)}</span>
                </div>
                
                <button
                  onClick={() => setShowAddressModal(true)}
                  className="w-full mt-6 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition flex items-center justify-center gap-2"
                >
                  Proceed to Checkout <ArrowRightIcon className="w-5 h-5" />
                </button>
                
                <div className="mt-6 space-y-2 text-xs text-gray-500">
                  <div className="flex items-center gap-2">
                    <ShieldCheckIcon className="w-4 h-4" />
                    <span>Secure Payment</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <TruckIcon className="w-4 h-4" />
                    <span>Free Delivery on orders above ₹999</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Address Modal */}
      <AnimatePresence>
        {showAddressModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="sticky top-0 bg-white p-4 border-b flex justify-between items-center">
                <h2 className="text-xl font-bold">Shipping Address</h2>
                <button onClick={() => setShowAddressModal(false)} className="p-1 hover:bg-gray-100 rounded">
                  <XMarkIcon className="w-6 h-6" />
                </button>
              </div>
              
              <div className="p-4 space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Full Name</label>
                  <input
                    type="text"
                    value={address.fullName}
                    onChange={(e) => setAddress({ ...address, fullName: e.target.value })}
                    className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="John Doe"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Address</label>
                  <textarea
                    value={address.addressLine}
                    onChange={(e) => setAddress({ ...address, addressLine: e.target.value })}
                    className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={3}
                    placeholder="Street address, apartment, etc."
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">City</label>
                    <input
                      type="text"
                      value={address.city}
                      onChange={(e) => setAddress({ ...address, city: e.target.value })}
                      className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">State</label>
                    <input
                      type="text"
                      value={address.state}
                      onChange={(e) => setAddress({ ...address, state: e.target.value })}
                      className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Pincode</label>
                    <input
                      type="text"
                      value={address.pincode}
                      onChange={(e) => setAddress({ ...address, pincode: e.target.value })}
                      className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Phone</label>
                    <input
                      type="tel"
                      value={address.phone}
                      onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                      className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                
                <button
                  onClick={handleCheckout}
                  disabled={isCheckingOut}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50"
                >
                  {isCheckingOut ? "Saving Address..." : "Continue to Payment"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
} 