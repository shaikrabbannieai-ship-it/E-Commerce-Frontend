"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import {
  ShoppingBagIcon,
  HeartIcon,
  StarIcon,
  MagnifyingGlassIcon,
  UserCircleIcon,
  ChevronDownIcon,
  FunnelIcon,
  XMarkIcon,
  DevicePhoneMobileIcon,
  TruckIcon,
  ShieldCheckIcon,
  CreditCardIcon,
} from "@heroicons/react/24/outline";
import { HeartIcon as HeartSolidIcon } from "@heroicons/react/24/solid";

// Mobile Brands with Real Logos
const brands = [
  { name: "Apple", logo: "https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg", count: 1245, color: "bg-gray-900" },
  { name: "Samsung", logo: "https://upload.wikimedia.org/wikipedia/commons/2/24/Samsung_Logo.svg", count: 2341, color: "bg-blue-600" },
  { name: "Xiaomi", logo: "https://upload.wikimedia.org/wikipedia/commons/2/29/Xiaomi_logo.svg", count: 1876, color: "bg-orange-500" },
  { name: "OnePlus", logo: "https://upload.wikimedia.org/wikipedia/commons/4/42/OnePlus_Logo.svg", count: 892, color: "bg-red-600" },
  { name: "Google Pixel", logo: "https://upload.wikimedia.org/wikipedia/commons/2/2d/Google_Pixel_Logo.svg", count: 456, color: "bg-blue-500" },
  { name: "Realme", logo: "https://upload.wikimedia.org/wikipedia/commons/9/91/Realme_Logo.svg", count: 1234, color: "bg-yellow-500" },
  { name: "Vivo", logo: "https://upload.wikimedia.org/wikipedia/commons/e/e3/Vivo_Logo.svg", count: 987, color: "bg-cyan-600" },
  { name: "Oppo", logo: "https://upload.wikimedia.org/wikipedia/commons/8/8b/OPPO_Logo.svg", count: 876, color: "bg-green-600" },
  { name: "Motorola", logo: "https://upload.wikimedia.org/wikipedia/commons/2/22/Motorola_Logo.svg", count: 543, color: "bg-blue-500" },
  { name: "Nothing", logo: "https://upload.wikimedia.org/wikipedia/commons/1/13/Nothing_Company_logo.svg", count: 234, color: "bg-black" },
];

// Banner Slides
const banners = [
  {
    id: 1,
    title: "iPhone 15 Pro",
    subtitle: "From ₹1,29,900*",
    description: "No Cost EMI available | Titanium design",
    image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=1200",
    color: "from-gray-800 to-black",
  },
  {
    id: 2,
    title: "Samsung Galaxy S24",
    subtitle: "From ₹79,999*",
    description: "AI-powered smartphone | Galaxy AI",
    image: "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=1200",
    color: "from-blue-800 to-indigo-900",
  },
  {
    id: 3,
    title: "OnePlus 12",
    subtitle: "From ₹64,999*",
    description: "Hasselblad Camera | Snapdragon 8 Gen 3",
    image: "https://images.unsplash.com/photo-1585060544812-6b45742d762f?w=1200",
    color: "from-green-800 to-teal-900",
  },
  {
    id: 4,
    title: "Google Pixel 8",
    subtitle: "From ₹75,999*",
    description: "Best Camera Phone | Google AI",
    image: "https://images.unsplash.com/photo-1592890288564-76628a30a657?w=1200",
    color: "from-blue-700 to-cyan-800",
  },
];

// Mobile Products Data
const mobiles = [
  // Apple iPhones
  { id: 1, name: "iPhone 15 Pro Max", price: 159900, originalPrice: 169900, discount: 6, rating: 4.8, reviews: 2345, image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=300", brand: "Apple", storage: "256GB", ram: "8GB", camera: "48MP", battery: "4422mAh", isFeatured: true, isNew: true },
  { id: 2, name: "iPhone 15 Pro", price: 129900, originalPrice: 139900, discount: 7, rating: 4.8, reviews: 1892, image: "https://images.unsplash.com/photo-1695048132822-7e1d0b6c0c8a?w=300", brand: "Apple", storage: "128GB", ram: "8GB", camera: "48MP", battery: "3274mAh", isFeatured: true },
  { id: 3, name: "iPhone 15 Plus", price: 89900, originalPrice: 99900, discount: 10, rating: 4.7, reviews: 1456, image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=300", brand: "Apple", storage: "128GB", ram: "6GB", camera: "48MP", battery: "4383mAh" },
  { id: 4, name: "iPhone 15", price: 79900, originalPrice: 89900, discount: 11, rating: 4.6, reviews: 2341, image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=300", brand: "Apple", storage: "128GB", ram: "6GB", camera: "48MP", battery: "3349mAh" },
  { id: 5, name: "iPhone 14 Pro", price: 109900, originalPrice: 129900, discount: 15, rating: 4.7, reviews: 3456, image: "https://images.unsplash.com/photo-1678655888320-3e6d7f045198?w=300", brand: "Apple", storage: "256GB", ram: "6GB", camera: "48MP", battery: "3200mAh" },
  { id: 6, name: "iPhone 14", price: 69900, originalPrice: 79900, discount: 13, rating: 4.6, reviews: 4567, image: "https://images.unsplash.com/photo-1678655888320-3e6d7f045198?w=300", brand: "Apple", storage: "128GB", ram: "6GB", camera: "12MP", battery: "3279mAh" },
  
  // Samsung
  { id: 7, name: "Samsung Galaxy S24 Ultra", price: 129999, originalPrice: 149999, discount: 13, rating: 4.9, reviews: 876, image: "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=300", brand: "Samsung", storage: "256GB", ram: "12GB", camera: "200MP", battery: "5000mAh", isFeatured: true, isNew: true },
  { id: 8, name: "Samsung Galaxy S24+", price: 99999, originalPrice: 114999, discount: 13, rating: 4.8, reviews: 654, image: "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=300", brand: "Samsung", storage: "256GB", ram: "12GB", camera: "50MP", battery: "4900mAh" },
  { id: 9, name: "Samsung Galaxy S24", price: 79999, originalPrice: 89999, discount: 11, rating: 4.7, reviews: 1234, image: "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=300", brand: "Samsung", storage: "128GB", ram: "8GB", camera: "50MP", battery: "4000mAh" },
  { id: 10, name: "Samsung Galaxy Z Fold5", price: 154999, originalPrice: 174999, discount: 11, rating: 4.8, reviews: 432, image: "https://images.unsplash.com/photo-1680466692132-2236a3c2ea04?w=300", brand: "Samsung", storage: "512GB", ram: "12GB", camera: "50MP", battery: "4400mAh", isNew: true },
  { id: 11, name: "Samsung Galaxy A54", price: 38999, originalPrice: 44999, discount: 13, rating: 4.5, reviews: 2345, image: "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=300", brand: "Samsung", storage: "128GB", ram: "8GB", camera: "50MP", battery: "5000mAh" },
  
  // OnePlus
  { id: 12, name: "OnePlus 12", price: 64999, originalPrice: 74999, discount: 13, rating: 4.8, reviews: 2345, image: "https://images.unsplash.com/photo-1585060544812-6b45742d762f?w=300", brand: "OnePlus", storage: "256GB", ram: "12GB", camera: "50MP", battery: "5400mAh", isFeatured: true },
  { id: 13, name: "OnePlus 12R", price: 39999, originalPrice: 45999, discount: 13, rating: 4.7, reviews: 1876, image: "https://images.unsplash.com/photo-1585060544812-6b45742d762f?w=300", brand: "OnePlus", storage: "128GB", ram: "8GB", camera: "50MP", battery: "5500mAh" },
  { id: 14, name: "OnePlus Open", price: 139999, originalPrice: 149999, discount: 7, rating: 4.9, reviews: 543, image: "https://images.unsplash.com/photo-1697210613531-f83d21f42b71?w=300", brand: "OnePlus", storage: "512GB", ram: "16GB", camera: "48MP", battery: "4805mAh", isNew: true },
  { id: 15, name: "OnePlus 11", price: 56999, originalPrice: 64999, discount: 12, rating: 4.7, reviews: 3456, image: "https://images.unsplash.com/photo-1585060544812-6b45742d762f?w=300", brand: "OnePlus", storage: "256GB", ram: "8GB", camera: "50MP", battery: "5000mAh" },
  
  // Xiaomi
  { id: 16, name: "Xiaomi 14 Ultra", price: 89999, originalPrice: 99999, discount: 10, rating: 4.7, reviews: 1234, image: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=300", brand: "Xiaomi", storage: "256GB", ram: "12GB", camera: "50MP", battery: "5000mAh", isFeatured: true },
  { id: 17, name: "Xiaomi 14", price: 69999, originalPrice: 79999, discount: 12, rating: 4.6, reviews: 987, image: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=300", brand: "Xiaomi", storage: "128GB", ram: "8GB", camera: "50MP", battery: "4610mAh" },
  { id: 18, name: "Xiaomi 13 Pro", price: 79999, originalPrice: 89999, discount: 11, rating: 4.7, reviews: 2341, image: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=300", brand: "Xiaomi", storage: "256GB", ram: "12GB", camera: "50MP", battery: "4820mAh" },
  
  // Google Pixel
  { id: 19, name: "Google Pixel 8 Pro", price: 109999, originalPrice: 124999, discount: 12, rating: 4.8, reviews: 876, image: "https://images.unsplash.com/photo-1592890288564-76628a30a657?w=300", brand: "Google Pixel", storage: "256GB", ram: "12GB", camera: "50MP", battery: "5050mAh", isFeatured: true, isNew: true },
  { id: 20, name: "Google Pixel 8", price: 75999, originalPrice: 84999, discount: 11, rating: 4.7, reviews: 654, image: "https://images.unsplash.com/photo-1592890288564-76628a30a657?w=300", brand: "Google Pixel", storage: "128GB", ram: "8GB", camera: "50MP", battery: "4575mAh" },
  { id: 21, name: "Google Pixel 7 Pro", price: 69999, originalPrice: 84999, discount: 18, rating: 4.6, reviews: 2345, image: "https://images.unsplash.com/photo-1592890288564-76628a30a657?w=300", brand: "Google Pixel", storage: "128GB", ram: "12GB", camera: "50MP", battery: "5000mAh" },
  
  // Realme
  { id: 22, name: "Realme GT 5 Pro", price: 45999, originalPrice: 54999, discount: 16, rating: 4.6, reviews: 2345, image: "https://images.unsplash.com/photo-1616348436168-de43ad0db179?w=300", brand: "Realme", storage: "256GB", ram: "12GB", camera: "50MP", battery: "5400mAh" },
  { id: 23, name: "Realme 12 Pro+", price: 29999, originalPrice: 35999, discount: 17, rating: 4.5, reviews: 3456, image: "https://images.unsplash.com/photo-1616348436168-de43ad0db179?w=300", brand: "Realme", storage: "128GB", ram: "8GB", camera: "64MP", battery: "5000mAh" },
  { id: 24, name: "Realme Narzo 70 Pro", price: 19999, originalPrice: 23999, discount: 17, rating: 4.4, reviews: 1234, image: "https://images.unsplash.com/photo-1616348436168-de43ad0db179?w=300", brand: "Realme", storage: "128GB", ram: "8GB", camera: "50MP", battery: "5000mAh" },
  
  // Vivo
  { id: 25, name: "Vivo X100 Pro", price: 89999, originalPrice: 99999, discount: 10, rating: 4.7, reviews: 876, image: "https://images.unsplash.com/photo-1616348436168-de43ad0db179?w=300", brand: "Vivo", storage: "256GB", ram: "12GB", camera: "50MP", battery: "5400mAh", isNew: true },
  { id: 26, name: "Vivo V30 Pro", price: 39999, originalPrice: 45999, discount: 13, rating: 4.5, reviews: 1234, image: "https://images.unsplash.com/photo-1616348436168-de43ad0db179?w=300", brand: "Vivo", storage: "256GB", ram: "8GB", camera: "50MP", battery: "5000mAh" },
  
  // Oppo
  { id: 27, name: "Oppo Find X7 Ultra", price: 89999, originalPrice: 99999, discount: 10, rating: 4.7, reviews: 654, image: "https://images.unsplash.com/photo-1616348436168-de43ad0db179?w=300", brand: "Oppo", storage: "256GB", ram: "12GB", camera: "50MP", battery: "5000mAh", isNew: true },
  { id: 28, name: "Oppo Reno 11 Pro", price: 39999, originalPrice: 45999, discount: 13, rating: 4.5, reviews: 987, image: "https://images.unsplash.com/photo-1616348436168-de43ad0db179?w=300", brand: "Oppo", storage: "256GB", ram: "12GB", camera: "50MP", battery: "4700mAh" },
  
  // Motorola
  { id: 29, name: "Motorola Edge 50 Pro", price: 34999, originalPrice: 39999, discount: 13, rating: 4.5, reviews: 876, image: "https://images.unsplash.com/photo-1616348436168-de43ad0db179?w=300", brand: "Motorola", storage: "256GB", ram: "8GB", camera: "50MP", battery: "4500mAh" },
  
  // Nothing
  { id: 30, name: "Nothing Phone 2", price: 44999, originalPrice: 49999, discount: 10, rating: 4.6, reviews: 1234, image: "https://images.unsplash.com/photo-1616348436168-de43ad0db179?w=300", brand: "Nothing", storage: "256GB", ram: "8GB", camera: "50MP", battery: "4700mAh", isNew: true },
];

// Filter options
const filterOptions = {
  brands: ["Apple", "Samsung", "OnePlus", "Xiaomi", "Google Pixel", "Realme", "Vivo", "Oppo", "Motorola", "Nothing"],
  ram: ["4GB", "6GB", "8GB", "12GB", "16GB"],
  storage: ["64GB", "128GB", "256GB", "512GB", "1TB"],
  priceRanges: [
    { label: "Under ₹20,000", min: 0, max: 20000 },
    { label: "₹20,000 - ₹40,000", min: 20000, max: 40000 },
    { label: "₹40,000 - ₹60,000", min: 40000, max: 60000 },
    { label: "₹60,000 - ₹80,000", min: 60000, max: 80000 },
    { label: "Above ₹80,000", min: 80000, max: Infinity },
  ],
};

export default function MobilesPage() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const [userId, setUserId] = useState<string | null>(null);
  const [cartCount, setCartCount] = useState(0);
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [wishlist, setWishlist] = useState<number[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("All");
  const [selectedPriceRange, setSelectedPriceRange] = useState("");
  const [selectedRam, setSelectedRam] = useState("");
  const [selectedStorage, setSelectedStorage] = useState("");
  const [selectedRating, setSelectedRating] = useState(0);
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState("featured");
  const [isLoading, setIsLoading] = useState(false);



// Add these functions inside your component, before the useEffect

// Fetch cart from backend
const fetchCartFromBackend = async () => {
  if (!userId) return;
  
  try {
    const response = await axios.get(`https://e-commerce-backend-2-4b0u.onrender.com/cart/${userId}`);
    const cartData = response.data;
    
    // Transform backend cart data to frontend format
    const cartItems = cartData.items.map((item: any) => ({
      id: item.product_id,
      name: item.product_name,
      price: item.product_price,
      image: item.product_image,
      quantity: item.quantity,
      cart_item_id: item.id // Store cart item ID for updates
    }));
    
    setCartItems(cartItems);
    setCartCount(cartItems.length);
    localStorage.setItem("cart", JSON.stringify(cartItems));
  } catch (error) {
    console.error("Error fetching cart:", error);
    // Fallback to localStorage if backend fails
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      const cart = JSON.parse(savedCart);
      setCartItems(cart);
      setCartCount(cart.length);
    }
  }
};

// Add to cart with backend
const addToCartBackend = async (product: any) => {
  if (!isLoggedIn) {
    toast.error("Please login to add items to cart");
    router.push("/login");
    return;
  }
  
  setIsLoading(true);
  try {
    const response = await axios.post("https://e-commerce-backend-2-4b0u.onrender.com/cart/add", null, {
      params: {
        user_id: userId,
        product_id: product.id,
        product_name: product.name,
        product_price: product.price,
        product_image: product.image,
        quantity: 1
      }
    });
    
    // Refresh cart from backend
    await fetchCartFromBackend();
    toast.success(`${product.name} added to cart!`, { icon: "🛒" });
  } catch (error: any) {
    console.error("Error adding to cart:", error);
    if (error.code === "ERR_NETWORK") {
      toast.error("Backend not running. Using local storage only.");
      // Fallback to localStorage
      const existingItem = cartItems.find(item => item.id === product.id);
      let newCart;
      if (existingItem) {
        newCart = cartItems.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        newCart = [...cartItems, { ...product, quantity: 1 }];
      }
      setCartItems(newCart);
      setCartCount(newCart.length);
      localStorage.setItem("cart", JSON.stringify(newCart));
    } else {
      toast.error("Failed to add to cart");
    }
  } finally {
    setIsLoading(false);
  }
};

// Update quantity in backend
const updateQuantityBackend = async (cartItemId: number, newQuantity: number) => {
  try {
    await axios.put(`https://e-commerce-backend-2-4b0u.onrender.com/cart/update/${cartItemId}`, null, {
      params: { quantity: newQuantity }
    });
    await fetchCartFromBackend();
  } catch (error) {
    console.error("Error updating quantity:", error);
  }
};

// Remove from cart backend
const removeFromCartBackend = async (cartItemId: number, productId: number) => {
  try {
    await axios.delete(`https://e-commerce-backend-2-4b0u.onrender.com/cart/remove/${cartItemId}`);
    await fetchCartFromBackend();
    toast.success("Item removed from cart");
  } catch (error) {
    console.error("Error removing from cart:", error);
    // Fallback to localStorage
    const newCart = cartItems.filter(item => item.id !== productId);
    setCartItems(newCart);
    setCartCount(newCart.length);
    localStorage.setItem("cart", JSON.stringify(newCart));
  }
};
useEffect(() => {
  const token = localStorage.getItem("access_token");
  const name = localStorage.getItem("user_name");
  const storedUserId = localStorage.getItem("user_id");
  
  if (token && name) {
    setIsLoggedIn(true);
    setUserName(name);
    setUserId(storedUserId);
  }
  
  const savedWishlist = localStorage.getItem("wishlist");
  if (savedWishlist) {
    setWishlist(JSON.parse(savedWishlist));
  }
  
  // Load cart from backend if logged in
  if (storedUserId) {
    fetchCartFromBackend();
  } else {
    // Fallback to localStorage
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      const cart = JSON.parse(savedCart);
      setCartItems(cart);
      setCartCount(cart.length);
    }
  }
}, []);

  const toggleWishlist = (productId: number) => {
    if (!isLoggedIn) {
      toast.error("Please login to add to wishlist");
      router.push("/login");
      return;
    }
    
    let newWishlist;
    if (wishlist.includes(productId)) {
      newWishlist = wishlist.filter(id => id !== productId);
      toast.success("Removed from wishlist");
    } else {
      newWishlist = [...wishlist, productId];
      toast.success("Added to wishlist");
    }
    setWishlist(newWishlist);
    localStorage.setItem("wishlist", JSON.stringify(newWishlist));
  };


  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user_name");
    localStorage.removeItem("user_id");
    setIsLoggedIn(false);
    setUserId(null);
    setCartCount(0);
    setCartItems([]);
    toast.success("Logged out successfully!");
    router.push("/login");
  };

  // Filter products
  const filteredProducts = mobiles.filter(product => {
    if (selectedBrand !== "All" && product.brand !== selectedBrand) return false;
    
    if (selectedPriceRange) {
      const range = filterOptions.priceRanges.find(r => r.label === selectedPriceRange);
      if (range && (product.price < range.min || product.price > range.max)) return false;
    }
    
    if (selectedRam && product.ram !== selectedRam) return false;
    if (selectedStorage && product.storage !== selectedStorage) return false;
    if (selectedRating > 0 && product.rating < selectedRating) return false;
    
    if (searchQuery && !product.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    
    return true;
  });

  // Sort products
  const getSortedProducts = () => {
    let sorted = [...filteredProducts];
    switch(sortBy) {
      case "price-low":
        return sorted.sort((a, b) => a.price - b.price);
      case "price-high":
        return sorted.sort((a, b) => b.price - a.price);
      case "rating":
        return sorted.sort((a, b) => b.rating - a.rating);
      case "discount":
        return sorted.sort((a, b) => b.discount - a.discount);
      default:
        return sorted;
    }
  };

  // Clear all filters
  const clearFilters = () => {
    setSelectedBrand("All");
    setSelectedPriceRange("");
    setSelectedRam("");
    setSelectedStorage("");
    setSelectedRating(0);
    setSearchQuery("");
    toast.success("All filters cleared");
  };

  // Get brand count
  const getBrandCount = (brandName: string) => {
    return mobiles.filter(p => p.brand === brandName).length;
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Toaster position="top-right" />
      
      {/* Top Bar */}
      <div className="bg-blue-600 text-white text-xs py-1.5 px-4 text-center hidden md:block">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex gap-6">
            <span>🛍️ Free Shipping on orders ₹999+</span>
            <span>🔄 7 Days Return Policy</span>
            <span>🔒 Secure Payments</span>
            <span>💳 No Cost EMI Available</span>
          </div>
          <div className="flex gap-4">
            <button className="hover:text-blue-200">Sell on ShopHub</button>
            <button className="hover:text-blue-200">Download App</button>
          </div>
        </div>
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 bg-white shadow-md">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-3 gap-4">
            <div className="flex items-center gap-1 cursor-pointer" onClick={() => router.push("/")}>
              <ShoppingBagIcon className="w-7 h-7 text-blue-600" />
              <span className="text-xl font-bold text-blue-600">ShopHub</span>
            </div>

            <div className="flex-1 max-w-2xl">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search for Mobiles, Accessories and More..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-12 py-2.5 bg-gray-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              </div>
            </div>

            <div className="flex items-center gap-4">
              {isLoggedIn ? (
                <div className="relative group">
                  <button className="flex items-center gap-1 text-gray-700">
                    <UserCircleIcon className="w-6 h-6" />
                    <span className="text-sm">{userName?.split(" ")[0]}</span>
                    <ChevronDownIcon className="w-4 h-4" />
                  </button>
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg hidden group-hover:block z-50">
                    <button onClick={() => router.push("/profile")} className="block w-full text-left px-4 py-2 hover:bg-gray-100">My Profile</button>
                    <button onClick={() => router.push("/orders")} className="block w-full text-left px-4 py-2 hover:bg-gray-100">My Orders</button>
                    <button onClick={() => router.push("/wishlist")} className="block w-full text-left px-4 py-2 hover:bg-gray-100">Wishlist</button>
                    <button onClick={() => router.push("/cart")} className="block w-full text-left px-4 py-2 hover:bg-gray-100">Cart ({cartCount})</button>
                    <button onClick={handleLogout} className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600">Logout</button>
                  </div>
                </div>
              ) : (
                <button onClick={() => router.push("/login")} className="bg-blue-600 text-white px-6 py-2 rounded font-medium hover:bg-blue-700">
                  Login
                </button>
              )}
              
              <button onClick={() => router.push("/wishlist")} className="relative">
                <HeartIcon className="w-6 h-6 text-gray-600" />
                {wishlist.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {wishlist.length}
                  </span>
                )}
              </button>
              
              <button onClick={() => router.push("/cart")} className="relative">
                <ShoppingBagIcon className="w-6 h-6 text-gray-600" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Banner Slider */}
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        navigation
        pagination={{ clickable: true }}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        className="h-[300px] md:h-[400px]"
      >
        {banners.map((banner) => (
          <SwiperSlide key={banner.id}>
            <div className={`relative h-full bg-gradient-to-r ${banner.color} cursor-pointer`}>
              <div className="absolute inset-0 bg-black/40"></div>
              <div className="absolute inset-0 bg-cover bg-center opacity-40" style={{ backgroundImage: `url(${banner.image})` }}></div>
              <div className="relative h-full flex items-center justify-between px-8 md:px-16 text-white">
                <div className="max-w-md">
                  <h2 className="text-3xl md:text-5xl font-bold mb-2">{banner.title}</h2>
                  <p className="text-2xl md:text-3xl font-semibold mb-1">{banner.subtitle}</p>
                  <p className="text-sm opacity-90 mb-4">{banner.description}</p>
                  <button className="bg-white text-gray-900 px-8 py-3 rounded-full font-semibold hover:shadow-lg transition">
                    Shop Now →
                  </button>
                </div>
                <DevicePhoneMobileIcon className="w-32 h-32 md:w-48 md:h-48 opacity-50 hidden md:block" />
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Brand Strip with Real Logos */}
      <div className="bg-white shadow-sm sticky top-[73px] z-30">
        <div className="container mx-auto px-4">
          <div className="flex gap-6 overflow-x-auto py-3">
            <button
              onClick={() => setSelectedBrand("All")}
              className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap ${selectedBrand === "All" ? "bg-blue-600 text-white" : "text-gray-600 hover:bg-gray-100"}`}
            >
              All Mobiles
            </button>
            {brands.map((brand) => (
              <button
                key={brand.name}
                onClick={() => setSelectedBrand(brand.name)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap ${selectedBrand === brand.name ? "bg-blue-600 text-white" : "text-gray-600 hover:bg-gray-100"}`}
              >
                <img src={brand.logo} alt={brand.name} className="w-5 h-5 object-contain" />
                {brand.name}
                <span className="text-xs opacity-70">({getBrandCount(brand.name)})</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex gap-6">
          {/* Filters Sidebar - Desktop */}
          <div className="hidden lg:block w-72 bg-white rounded-lg p-4 shadow-sm h-fit sticky top-40">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-lg">Filters</h3>
              <button onClick={clearFilters} className="text-blue-600 text-sm hover:underline">Clear All</button>
            </div>
            
            {/* Price Range */}
            <div className="border-b pb-4 mb-4">
              <h4 className="font-semibold mb-3">Price Range</h4>
              <div className="space-y-2">
                {filterOptions.priceRanges.map((range) => (
                  <label key={range.label} className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="radio" 
                      name="price" 
                      checked={selectedPriceRange === range.label}
                      onChange={() => setSelectedPriceRange(range.label)} 
                      className="w-4 h-4" 
                    />
                    <span className="text-sm">{range.label}</span>
                  </label>
                ))}
              </div>
            </div>
            
            {/* RAM */}
            <div className="border-b pb-4 mb-4">
              <h4 className="font-semibold mb-3">RAM</h4>
              <div className="flex flex-wrap gap-2">
                {filterOptions.ram.map((ram) => (
                  <button 
                    key={ram} 
                    onClick={() => setSelectedRam(selectedRam === ram ? "" : ram)}
                    className={`px-3 py-1 border rounded text-sm transition ${selectedRam === ram ? "bg-blue-600 text-white border-blue-600" : "hover:border-blue-500"}`}
                  >
                    {ram}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Storage */}
            <div className="border-b pb-4 mb-4">
              <h4 className="font-semibold mb-3">Storage</h4>
              <div className="flex flex-wrap gap-2">
                {filterOptions.storage.map((storage) => (
                  <button 
                    key={storage} 
                    onClick={() => setSelectedStorage(selectedStorage === storage ? "" : storage)}
                    className={`px-3 py-1 border rounded text-sm transition ${selectedStorage === storage ? "bg-blue-600 text-white border-blue-600" : "hover:border-blue-500"}`}
                  >
                    {storage}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Customer Rating */}
            <div className="border-b pb-4 mb-4">
              <h4 className="font-semibold mb-3">Customer Rating</h4>
              <div className="space-y-2">
                {[4, 3, 2, 1].map((rating) => (
                  <label key={rating} className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={selectedRating === rating}
                      onChange={() => setSelectedRating(selectedRating === rating ? 0 : rating)}
                      className="w-4 h-4" 
                    />
                    <div className="flex items-center gap-1">
                      <span className="text-sm font-semibold">{rating}+ ★</span>
                      <div className="flex text-yellow-400">
                        {[...Array(rating)].map((_, i) => (
                          <StarIcon key={i} className="w-3 h-3 fill-current" />
                        ))}
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </div>
            
            {/* Active Filters Summary */}
            {(selectedBrand !== "All" || selectedPriceRange || selectedRam || selectedStorage || selectedRating > 0) && (
              <div className="mt-4">
                <h4 className="font-semibold mb-2 text-sm">Active Filters:</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedBrand !== "All" && (
                    <span className="bg-blue-100 text-blue-600 text-xs px-2 py-1 rounded-full flex items-center gap-1">
                      Brand: {selectedBrand}
                      <button onClick={() => setSelectedBrand("All")} className="hover:text-blue-800">×</button>
                    </span>
                  )}
                  {selectedPriceRange && (
                    <span className="bg-blue-100 text-blue-600 text-xs px-2 py-1 rounded-full flex items-center gap-1">
                      {selectedPriceRange}
                      <button onClick={() => setSelectedPriceRange("")} className="hover:text-blue-800">×</button>
                    </span>
                  )}
                  {selectedRam && (
                    <span className="bg-blue-100 text-blue-600 text-xs px-2 py-1 rounded-full flex items-center gap-1">
                      RAM: {selectedRam}
                      <button onClick={() => setSelectedRam("")} className="hover:text-blue-800">×</button>
                    </span>
                  )}
                  {selectedStorage && (
                    <span className="bg-blue-100 text-blue-600 text-xs px-2 py-1 rounded-full flex items-center gap-1">
                      Storage: {selectedStorage}
                      <button onClick={() => setSelectedStorage("")} className="hover:text-blue-800">×</button>
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Products Section */}
          <div className="flex-1">
            {/* Sort and Filter Bar */}
            <div className="bg-white rounded-lg p-4 mb-4 shadow-sm flex flex-wrap justify-between items-center gap-4">
              <div className="flex items-center gap-4">
                <button onClick={() => setShowFilters(!showFilters)} className="lg:hidden flex items-center gap-2 px-4 py-2 border rounded-lg">
                  <FunnelIcon className="w-5 h-5" />
                  <span>Filter</span>
                </button>
                <div className="text-sm text-gray-600">
                  Showing <span className="font-semibold text-blue-600">{getSortedProducts().length}</span> of <span className="font-semibold">{mobiles.length}</span> mobiles
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="border rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="featured">Featured</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Top Rated</option>
                  <option value="discount">Biggest Discount</option>
                </select>
              </div>
            </div>

            {/* Mobile Filter Modal */}
            <AnimatePresence>
              {showFilters && (
                <div className="fixed inset-0 bg-black/50 z-50 lg:hidden" onClick={() => setShowFilters(false)}>
                  <motion.div
                    initial={{ x: -300 }}
                    animate={{ x: 0 }}
                    exit={{ x: -300 }}
                    className="absolute left-0 top-0 bottom-0 w-80 bg-white overflow-y-auto"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="p-4 border-b flex justify-between items-center sticky top-0 bg-white">
                      <h3 className="font-bold text-lg">Filters</h3>
                      <button onClick={() => setShowFilters(false)}>
                        <XMarkIcon className="w-6 h-6" />
                      </button>
                    </div>
                    <div className="p-4">
                      {/* Same filter options as desktop */}
                      <div className="border-b pb-4 mb-4">
                        <h4 className="font-semibold mb-3">Price Range</h4>
                        <div className="space-y-2">
                          {filterOptions.priceRanges.map((range) => (
                            <label key={range.label} className="flex items-center gap-2">
                              <input type="radio" name="price-mobile" className="w-4 h-4" />
                              <span className="text-sm">{range.label}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                      <div className="border-b pb-4 mb-4">
                        <h4 className="font-semibold mb-3">RAM</h4>
                        <div className="flex flex-wrap gap-2">
                          {filterOptions.ram.map((ram) => (
                            <button key={ram} className="px-3 py-1 border rounded text-sm hover:border-blue-500">{ram}</button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>
              )}
            </AnimatePresence>

            {/* Products Grid */}
            {getSortedProducts().length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {getSortedProducts().map((product, idx) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.02 }}
                    whileHover={{ y: -4 }}
                    className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group"
                  >
                    <div className="relative">
                      <img src={product.image} alt={product.name} className="w-full h-48 object-cover group-hover:scale-105 transition duration-300" />
                      <span className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded font-bold">
                        {product.discount}% OFF
                      </span>
                      {product.isNew && (
                        <span className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded font-bold">
                          NEW
                        </span>
                      )}
                      <button
                        onClick={() => toggleWishlist(product.id)}
                        className="absolute bottom-2 right-2 bg-white rounded-full p-1.5 shadow-md hover:scale-110 transition"
                      >
                        {wishlist.includes(product.id) ? (
                          <HeartSolidIcon className="w-5 h-5 text-red-500" />
                        ) : (
                          <HeartIcon className="w-5 h-5 text-gray-400" />
                        )}
                      </button>
                    </div>
                    <div className="p-3">
                      <div className="flex items-center gap-1 mb-1">
                        <span className="text-xs font-semibold text-gray-600">{product.brand}</span>
                        {product.isFeatured && (
                          <span className="text-xs bg-blue-100 text-blue-600 px-1 rounded">Featured</span>
                        )}
                      </div>
                      <h3 className="font-semibold text-sm line-clamp-2 mb-2">{product.name}</h3>
                      
                      <div className="flex flex-wrap gap-1 mb-2">
                        <span className="text-xs bg-gray-100 px-1.5 py-0.5 rounded">{product.ram}</span>
                        <span className="text-xs bg-gray-100 px-1.5 py-0.5 rounded">{product.storage}</span>
                        <span className="text-xs bg-gray-100 px-1.5 py-0.5 rounded">{product.camera}</span>
                      </div>
                      
                      <div className="flex items-center gap-1 mb-2">
                        <span className="bg-green-600 text-white text-xs px-1.5 py-0.5 rounded flex items-center gap-1">
                          {product.rating}★
                        </span>
                        <span className="text-xs text-gray-500">({product.reviews})</span>
                      </div>
                      
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-lg font-bold text-gray-800">₹{product.price.toLocaleString()}</span>
                        <span className="text-xs text-gray-400 line-through">₹{product.originalPrice.toLocaleString()}</span>
                      </div>
                      
                      <div className="flex items-center gap-1 text-xs text-green-600 mb-3">
                        <TruckIcon className="w-3 h-3" />
                        <span>Free Delivery</span>
                        <span className="text-gray-300">|</span>
                        <ShieldCheckIcon className="w-3 h-3" />
                        <span>1 Year Warranty</span>
                      </div>
                      
                      <button
                        onClick={() => addToCartBackend(product)}
                        className="w-full bg-blue-600 text-white py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition"
                      >
                        Add to Cart
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-white rounded-lg">
                <DevicePhoneMobileIcon className="w-24 h-24 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">No mobiles found</h3>
                <p className="text-gray-400">Try adjusting your filters</p>
                <button onClick={clearFilters} className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 mt-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            <div>
              <h3 className="font-semibold mb-3">MOBILES</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><button className="hover:text-white">Apple iPhones</button></li>
                <li><button className="hover:text-white">Samsung Galaxy</button></li>
                <li><button className="hover:text-white">OnePlus</button></li>
                <li><button className="hover:text-white">Google Pixel</button></li>
                <li><button className="hover:text-white">Xiaomi</button></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-3">HELP</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><button className="hover:text-white">Exchange Offers</button></li>
                <li><button className="hover:text-white">No Cost EMI</button></li>
                <li><button className="hover:text-white">Return Policy</button></li>
                <li><button className="hover:text-white">FAQ</button></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-3">ABOUT</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><button className="hover:text-white">Contact Us</button></li>
                <li><button className="hover:text-white">About ShopHub</button></li>
                <li><button className="hover:text-white">Careers</button></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-3">POLICY</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><button className="hover:text-white">Return Policy</button></li>
                <li><button className="hover:text-white">Terms of Use</button></li>
                <li><button className="hover:text-white">Privacy</button></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-3">MAIL US</h3>
              <p className="text-sm text-gray-400">ShopHub E-commerce Pvt Ltd, Bangalore, India</p>
              <p className="text-sm text-gray-400 mt-2">📞 1800-123-4567</p>
              <p className="text-sm text-gray-400">✉️ support@shophub.com</p>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-6 text-center text-sm text-gray-400">
            <p>&copy; 2024 ShopHub Mobiles. All rights reserved. | 30+ Latest Smartphones</p>
          </div>
        </div>
      </footer>
    </div>
  );
}