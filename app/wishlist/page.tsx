"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";

import {
  ShoppingBagIcon,
  HeartIcon,
  StarIcon,
  TrashIcon,
  TruckIcon,
  ShieldCheckIcon,
  ArrowRightIcon,
} from "@heroicons/react/24/outline";

interface WishlistItem {
  id: number;
  name: string;
  price: number;
  originalPrice: number;
  discount: number;
  rating: number;
  reviews: number;
  image: string;
  brand: string;
  category: string;
  inStock: boolean;
}

// Sample products for fallback
const sampleProducts: WishlistItem[] = [
  { id: 1, name: "boAt Rockerz 450", price: 1999, originalPrice: 3990, discount: 50, rating: 4.3, reviews: 2345, image: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=300", brand: "boAt", category: "Electronics", inStock: true },
  { id: 2, name: "Women's Trendy Dress", price: 899, originalPrice: 2499, discount: 64, rating: 4.2, reviews: 3456, image: "https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=300", brand: "Fashion Hub", category: "Fashion", inStock: true },
  { id: 3, name: "Noise Smart Watch", price: 2499, originalPrice: 5999, discount: 58, rating: 4.1, reviews: 4567, image: "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=300", brand: "Noise", category: "Watches", inStock: true },
];

export default function WishlistPage() {
  const router = useRouter();
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddingToCart, setIsAddingToCart] = useState<number | null>(null);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [selectAll, setSelectAll] = useState(false);

  const userId = typeof window !== 'undefined' ? localStorage.getItem("user_id") : null;
  const isLoggedIn = typeof window !== 'undefined' ? localStorage.getItem("access_token") : null;

  useEffect(() => {
    if (!isLoggedIn) {
      router.push("/login");
      return;
    }
    fetchWishlist();
  }, [isLoggedIn]);

  const fetchWishlist = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`https://e-commerce-backend-2-4b0u.onrender.com//wishlist/${userId}`);
      
      // ✅ Handle both response formats
      let items = [];
      if (response.data && response.data.items) {
        items = response.data.items;
      } else if (Array.isArray(response.data)) {
        items = response.data;
      }
      
      if (items.length > 0) {
        setWishlistItems(items);
      } else {
        // Fallback to localStorage
        const savedWishlist = localStorage.getItem("wishlist");
        if (savedWishlist) {
          const wishlistIds = JSON.parse(savedWishlist);
          const filteredItems = sampleProducts.filter(item => wishlistIds.includes(item.id));
          setWishlistItems(filteredItems);
        } else {
          setWishlistItems(sampleProducts);
        }
      }
    } catch (error) {
      console.error("Error fetching wishlist:", error);
      // Fallback to localStorage
      const savedWishlist = localStorage.getItem("wishlist");
      if (savedWishlist) {
        const wishlistIds = JSON.parse(savedWishlist);
        const filteredItems = sampleProducts.filter(item => wishlistIds.includes(item.id));
        setWishlistItems(filteredItems);
      } else {
        setWishlistItems(sampleProducts);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const removeFromWishlist = async (productId: number) => {
    setWishlistItems(prev => prev.filter(item => item.id !== productId));
    setSelectedItems(prev => prev.filter(id => id !== productId));
    
    const savedWishlist = localStorage.getItem("wishlist");
    if (savedWishlist) {
      const wishlistIds = JSON.parse(savedWishlist);
      const newWishlist = wishlistIds.filter((id: number) => id !== productId);
      localStorage.setItem("wishlist", JSON.stringify(newWishlist));
    }
    
    toast.success("Removed from wishlist");
    
    try {
      await axios.delete(`https://e-commerce-backend-2-4b0u.onrender.com//wishlist/${userId}/${productId}`);
    } catch (error) {
      console.error("Error removing from wishlist:", error);
    }
  };

  const addToCart = async (item: WishlistItem) => {
    setIsAddingToCart(item.id);
    try {
      await axios.post("https://e-commerce-backend-2-4b0u.onrender.com//cart/add", null, {
        params: {
          user_id: userId,
          product_id: item.id,
          product_name: item.name,
          product_price: item.price,
          product_image: item.image,
          quantity: 1
        }
      });
      
      toast.success(`${item.name} added to cart!`, { icon: "🛒" });
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error("Failed to add to cart");
    } finally {
      setIsAddingToCart(null);
    }
  };

  const toggleSelectItem = (id: number) => {
    setSelectedItems(prev => 
      prev.includes(id) ? prev.filter(itemId => itemId !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectAll) {
      setSelectedItems([]);
    } else {
      setSelectedItems(wishlistItems.map(item => item.id));
    }
    setSelectAll(!selectAll);
  };

  const addSelectedToCart = async () => {
    if (selectedItems.length === 0) {
      toast.error("Please select items to add to cart");
      return;
    }
    
    toast.loading(`Adding ${selectedItems.length} items to cart...`, { id: "bulk-add" });
    
    for (const itemId of selectedItems) {
      const item = wishlistItems.find(i => i.id === itemId);
      if (item) {
        try {
          await axios.post("https://e-commerce-backend-2-4b0u.onrender.com//cart/add", null, {
            params: {
              user_id: userId,
              product_id: item.id,
              product_name: item.name,
              product_price: item.price,
              product_image: item.image,
              quantity: 1
            }
          });
        } catch (error) {
          console.error(`Error adding ${item.name}:`, error);
        }
      }
    }
    
    toast.success(`${selectedItems.length} items added to cart!`, { id: "bulk-add" });
  };

  const removeSelected = () => {
    if (selectedItems.length === 0) {
      toast.error("Please select items to remove");
      return;
    }
    
    selectedItems.forEach(id => removeFromWishlist(id));
    setSelectedItems([]);
    setSelectAll(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your wishlist...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Toaster position="top-right" />
      
      {/* Header */}
      <div className="bg-gradient-to-r from-pink-600 to-purple-600 text-white sticky top-0 z-10">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button onClick={() => router.back()} className="text-white hover:text-gray-200 transition">
                ← Back
              </button>
              <div>
                <h1 className="text-2xl font-bold">My Wishlist</h1>
                <p className="text-white/80 text-sm mt-1">
                  {wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'} saved
                </p>
              </div>
            </div>
            <button onClick={() => router.push("/")} className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-lg hover:bg-white/30 transition">
              <ShoppingBagIcon className="w-4 h-4" />
              <span>Continue Shopping</span>
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {wishlistItems.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <div className="w-24 h-24 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <HeartIcon className="w-12 h-12 text-pink-500" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">Your wishlist is empty</h2>
            <p className="text-gray-500 mb-6">Save your favorite items here!</p>
            <button onClick={() => router.push("/")} className="bg-pink-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-pink-700 transition flex items-center justify-center gap-2 mx-auto">
              Start Shopping <ArrowRightIcon className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <>
            {/* Bulk Actions Bar */}
            <div className="bg-white rounded-lg shadow-sm p-4 mb-6 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={selectAll} onChange={toggleSelectAll} className="w-4 h-4 text-pink-600 rounded focus:ring-pink-500" />
                  <span className="text-sm text-gray-700">Select All ({wishlistItems.length})</span>
                </label>
                {selectedItems.length > 0 && <span className="text-sm text-gray-500">{selectedItems.length} selected</span>}
              </div>
              <div className="flex gap-3">
                <button onClick={addSelectedToCart} disabled={selectedItems.length === 0} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition disabled:opacity-50">
                  <ShoppingBagIcon className="w-4 h-4" /> Add Selected to Cart
                </button>
                <button onClick={removeSelected} disabled={selectedItems.length === 0} className="flex items-center gap-2 px-4 py-2 border border-red-500 text-red-500 rounded-lg text-sm font-semibold hover:bg-red-50 transition disabled:opacity-50">
                  <TrashIcon className="w-4 h-4" /> Remove Selected
                </button>
              </div>
            </div>

            {/* Wishlist Items Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {wishlistItems.map((item, idx) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  whileHover={{ y: -4 }}
                  className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group relative"
                >
                  <div className="absolute top-3 left-3 z-10">
                    <label className="relative cursor-pointer">
                      <input type="checkbox" checked={selectedItems.includes(item.id)} onChange={() => toggleSelectItem(item.id)} className="w-5 h-5 text-pink-600 rounded focus:ring-pink-500" />
                    </label>
                  </div>

                  <button onClick={() => removeFromWishlist(item.id)} className="absolute top-3 right-3 z-10 bg-white rounded-full p-1.5 shadow-md hover:bg-red-50 hover:scale-110 transition">
                    <TrashIcon className="w-4 h-4 text-red-500" />
                  </button>

                  <div className="relative pt-4 px-4">
                    <div className="relative overflow-hidden rounded-lg">
                      <img src={item.image} alt={item.name} className="w-full h-48 object-cover group-hover:scale-105 transition duration-300" />
                      <span className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded font-bold">{item.discount}% OFF</span>
                    </div>
                  </div>

                  <div className="p-4">
                    <h3 className="font-semibold text-gray-800 line-clamp-2 h-12 mb-2">{item.name}</h3>
                    <div className="flex items-center gap-1 mb-2">
                      <span className="bg-green-600 text-white text-xs px-1.5 py-0.5 rounded flex items-center gap-1">{item.rating}★</span>
                      <span className="text-xs text-gray-500">({item.reviews})</span>
                    </div>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-xl font-bold text-gray-800">₹{item.price.toLocaleString()}</span>
                      <span className="text-xs text-gray-400 line-through">₹{item.originalPrice.toLocaleString()}</span>
                    </div>
                    <button onClick={() => addToCart(item)} disabled={isAddingToCart === item.id} className="w-full bg-pink-600 text-white py-2 rounded-lg text-sm font-semibold hover:bg-pink-700 transition disabled:opacity-50 flex items-center justify-center gap-2">
                      {isAddingToCart === item.id ? <><div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div> Adding...</> : <><ShoppingBagIcon className="w-4 h-4" /> Add to Cart</>}
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>

            {selectedItems.length > 0 && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
                <div className="bg-gray-900 text-white rounded-full shadow-2xl px-6 py-3 flex items-center gap-4">
                  <span className="text-sm">{selectedItems.length} item{selectedItems.length !== 1 ? 's' : ''} selected</span>
                  <div className="w-px h-6 bg-gray-700"></div>
                  <button onClick={addSelectedToCart} className="flex items-center gap-2 text-pink-400 hover:text-pink-300 transition">
                    <ShoppingBagIcon className="w-4 h-4" /> Move to Cart
                  </button>
                  <button onClick={removeSelected} className="flex items-center gap-2 text-gray-400 hover:text-gray-300 transition">
                    <TrashIcon className="w-4 h-4" /> Remove
                  </button>
                </div>
              </motion.div>
            )}
          </>
        )}
      </div>

      <footer className="bg-gray-900 text-white py-6 mt-8">
        <div className="container mx-auto px-4 text-center text-sm text-gray-400">
          <p>&copy; 2024 ShopHub. All rights reserved. | Save your favorite items</p>
        </div>
      </footer>
    </div>
  );
}