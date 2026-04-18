"use client";

import { useState, useEffect, useRef, useCallback } from "react";
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
  TruckIcon,
  ArrowPathIcon,
  ShieldCheckIcon,
  CreditCardIcon,
  DevicePhoneMobileIcon,
  ComputerDesktopIcon,
  HomeIcon,
  CakeIcon,
  BookOpenIcon,
  WrenchScrewdriverIcon,
  GiftIcon,
  MusicalNoteIcon,
  SparklesIcon,
  FireIcon,
  ClockIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { HeartIcon as HeartSolidIcon } from "@heroicons/react/24/solid";

// Navigation Categories with paths
const navCategories = [
  { name: "For You", path: "/" },
  { name: "Fashion", path: "/fashion" },
  { name: "Mobiles", path: "/mobile" },
  { name: "Beauty", path: "/beauty" },
  { name: "Electronics", path: "/electronics" },
  { name: "Home", path: "/grocery" },
  { name: "Appliances", path: "/appliances" },
  { name: "Toys", path: "/toys" },
  { name: "Food", path: "/food" },
  { name: "2 Wheel", path: "/two-wheelers" },
  { name: "Sports", path: "/sports" },
  { name: "Books", path: "/books" },
  { name: "Furniture", path: "/furniture" },
];

// Categories with paths for grid
const categories = [
  { name: "For You", icon: SparklesIcon, color: "text-pink-500", path: "/" },
  { name: "Fashion", icon: ShoppingBagIcon, color: "text-purple-500", path: "/fashion" },
  { name: "Mobiles", icon: DevicePhoneMobileIcon, color: "text-blue-500", path: "/mobiles" },
  { name: "Beauty", icon: CakeIcon, color: "text-rose-500", path: "/beauty" },
  { name: "Electronics", icon: ComputerDesktopIcon, color: "text-indigo-500", path: "/electronics" },
  { name: "Home", icon: HomeIcon, color: "text-orange-500", path: "/home-decor" },
  { name: "Appliances", icon: WrenchScrewdriverIcon, color: "text-gray-600", path: "/appliances" },
  { name: "Toys", icon: GiftIcon, color: "text-red-500", path: "/toys" },
  { name: "Books", icon: BookOpenIcon, color: "text-yellow-600", path: "/books" },
  { name: "Sports", icon: MusicalNoteIcon, color: "text-green-500", path: "/sports" },
];

// Banner Data
const banners = [
  {
    id: 1,
    title: "JBL Brand Week",
    subtitle: "From ₹1,899",
    description: "14th - 19th APR",
    image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=1200",
    color: "from-blue-600 to-indigo-700",
  },
  {
    id: 2,
    title: "43\" 4K TVs",
    subtitle: "From ₹16,299*",
    description: "Perfect fit, 4K hit",
    image: "https://images.unsplash.com/photo-1593784991095-a205069470b6?w=1200",
    color: "from-purple-600 to-pink-600",
  },
  {
    id: 3,
    title: "T5 Pro",
    subtitle: "From ₹4,600",
    description: "Sale on 21st Apr",
    image: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=1200",
    color: "from-green-600 to-teal-600",
  },
];

// Complete Products Data for Search
const allProducts = [
  { id: 1, name: "boAt Rockerz 450", price: 1999, originalPrice: 3990, discount: 50, rating: 4.3, image: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=300", brand: "boAt", category: "Electronics" },
  { id: 2, name: "Realme Narzo 50", price: 12999, originalPrice: 15999, discount: 19, rating: 4.4, image: "https://images.unsplash.com/photo-1616348436168-de43ad0db179?w=300", brand: "Realme", category: "Mobiles" },
  { id: 3, name: "Women's Trendy Dress", price: 899, originalPrice: 2499, discount: 64, rating: 4.2, image: "https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=300", brand: "Fashion Hub", category: "Fashion" },
  { id: 4, name: "Samsung Galaxy Tab", price: 18999, originalPrice: 27999, discount: 32, rating: 4.5, image: "https://mob4g.com/wp-content/uploads/2023/10/Samsung-Galaxy-Tab-A9-Plus-3.webp", brand: "Samsung", category: "Electronics" },
  { id: 5, name: "Noise Smart Watch", price: 2499, originalPrice: 5999, discount: 58, rating: 4.1, image: "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=300", brand: "Noise", category: "Watches" },
  { id: 6, name: "Men's Casual Shirt", price: 599, originalPrice: 1499, discount: 60, rating: 4.0, image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=300", brand: "Fashion Hub", category: "Fashion" },
  { id: 7, name: "Wireless Mouse", price: 299, originalPrice: 999, discount: 70, rating: 4.2, image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=300", brand: "Logitech", category: "Electronics" },
  { id: 8, name: "Gaming Keyboard", price: 1499, originalPrice: 2999, discount: 50, rating: 4.4, image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=300", brand: "Zebronics", category: "Electronics" },
  { id: 9, name: "Fast Charger", price: 399, originalPrice: 999, discount: 60, rating: 4.3, image: "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=300", brand: "Portronics", category: "Electronics" },
  { id: 10, name: "Bluetooth Speaker", price: 1299, originalPrice: 2999, discount: 57, rating: 4.5, image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=300", brand: "JBL", category: "Electronics" },
  { id: 11, name: "Grocery Essentials", price: 499, originalPrice: 999, discount: 50, image: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=300", brand: "FreshMart", category: "Groceries" },
  { id: 12, name: "Home Decor", price: 399, originalPrice: 1299, discount: 69, image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300", brand: "HomeStyle", category: "Home" },
];

// Products Data for sections
const products = {
  popular: allProducts.slice(0, 6),
  deals: allProducts.slice(6, 10),
  offers: allProducts.slice(10, 12),
};

// Bank Offers
const bankOffers = [
  { bank: "Axis Bank", offer: "10% Instant Discount", icon: "🏦" },
  { bank: "HDFC Bank", offer: "₹1500 Off on EMI", icon: "💳" },
  { bank: "SBI Card", offer: "5% Cashback", icon: "💳" },
  { bank: "ICICI Bank", offer: "No Cost EMI", icon: "🏦" },
];

export default function HomePage() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const [userId, setUserId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [cartCount, setCartCount] = useState(0);
  const [wishlist, setWishlist] = useState<number[]>([]);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeNav, setActiveNav] = useState("For You");
  const [isLoading, setIsLoading] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  const searchRef = useRef<HTMLDivElement>(null);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("recentSearches");
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, []);

  // Save recent search
  const saveRecentSearch = (query: string) => {
    if (!query.trim()) return;
    const updated = [query, ...recentSearches.filter(s => s !== query)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem("recentSearches", JSON.stringify(updated));
  };

  // Search function with debouncing
  const performSearch = useCallback(async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    try {
      const results = allProducts.filter(product => 
        product.name.toLowerCase().includes(query.toLowerCase()) ||
        product.brand.toLowerCase().includes(query.toLowerCase()) ||
        product.category.toLowerCase().includes(query.toLowerCase())
      );
      setSearchResults(results);
    } catch (error) {
      console.error("Search error:", error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  }, []);

  // Debounced search
  useEffect(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    
    debounceTimerRef.current = setTimeout(() => {
      performSearch(searchQuery);
    }, 300);
    
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [searchQuery, performSearch]);

  // Handle click outside search
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSearchResults(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSearchResults) return;
    
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex(prev => Math.min(prev + 1, searchResults.length - 1));
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex(prev => Math.max(prev - 1, -1));
        break;
      case "Enter":
        e.preventDefault();
        if (selectedIndex >= 0 && searchResults[selectedIndex]) {
          handleProductClick(searchResults[selectedIndex]);
        } else if (searchQuery.trim()) {
          handleSearchSubmit();
        }
        break;
      case "Escape":
        setShowSearchResults(false);
        break;
    }
  };

  const handleSearchSubmit = () => {
    if (!searchQuery.trim()) return;
    saveRecentSearch(searchQuery);
    setShowSearchResults(false);
    router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
  };

  const handleProductClick = (product: any) => {
    saveRecentSearch(product.name);
    setShowSearchResults(false);
    router.push(`/product/${product.id}`);
  };

  const handleTrendingClick = (trend: string) => {
    setSearchQuery(trend);
    saveRecentSearch(trend);
    setShowSearchResults(false);
    router.push(`/search?q=${encodeURIComponent(trend)}`);
  };

  const clearSearch = () => {
    setSearchQuery("");
    setSearchResults([]);
    setShowSearchResults(false);
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem("recentSearches");
    toast.success("Recent searches cleared");
  };

  const highlightText = (text: string, query: string) => {
    if (!query.trim()) return text;
    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);
    return parts.map((part, i) => 
      regex.test(part) ? <mark key={i} className="bg-yellow-200 text-gray-900">{part}</mark> : part
    );
  };

  // Fetch cart count from backend
  const fetchCartCount = async () => {
    if (!userId) return;
    
    try {
      const response = await axios.get(`https://ecommerce-backend.onrender.com/cart/${userId}`);
      setCartCount(response.data.item_count);
    } catch (error) {
      console.error("Error fetching cart count:", error);
    }
  };

  // Fetch wishlist from backend
  const fetchWishlist = async () => {
    if (!userId) return;
    
    try {
      const savedWishlist = localStorage.getItem("wishlist");
      if (savedWishlist) {
        setWishlist(JSON.parse(savedWishlist));
      }
    } catch (error) {
      console.error("Error fetching wishlist:", error);
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
    
    fetchWishlist();

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };
    window.addEventListener("scroll", handleScroll);
    
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Fetch cart count when userId changes
  useEffect(() => {
    if (userId) {
      fetchCartCount();
    }
  }, [userId]);

  // Toggle wishlist - UPDATED with full product data
  const toggleWishlist = async (product: any) => {
    if (!isLoggedIn) {
      toast.error("Please login to add to wishlist");
      router.push("/login");
      return;
    }

    const productId = product.id;

    if (wishlist.includes(productId)) {
      // Remove from wishlist
      setWishlist(wishlist.filter(id => id !== productId));
      toast.success("Removed from wishlist");
      localStorage.setItem("wishlist", JSON.stringify(wishlist.filter(id => id !== productId)));
      
      try {
        await axios.delete(`https://ecommerce-backend.onrender.com/wishlist/${userId}/${productId}`);
      } catch (error) {
        console.error("Error removing from wishlist:", error);
      }
    } else {
      // Add to wishlist with complete product data
      setWishlist([...wishlist, productId]);
      toast.success("Added to wishlist");
      localStorage.setItem("wishlist", JSON.stringify([...wishlist, productId]));
      
      try {
        await axios.post("https://ecommerce-backend.onrender.com/wishlist/add", {
          user_id: parseInt(userId!),
          product_id: product.id,
          product_name: product.name,
          product_price: product.price,
          product_original_price: product.originalPrice || product.price,
          product_discount: product.discount || 0,
          product_rating: product.rating || 4.0,
          product_reviews: Math.floor(Math.random() * 5000) + 100,
          product_image: product.image,
          product_brand: product.brand || "ShopHub",
          product_category: product.category || "General"
        });
      } catch (error) {
        console.error("Error adding to wishlist:", error);
        toast.error("Failed to add to wishlist");
        // Revert local state if API fails
        setWishlist(wishlist.filter(id => id !== productId));
        localStorage.setItem("wishlist", JSON.stringify(wishlist));
      }
    }
  };

  // Add to cart with backend integration
  const addToCart = async (product: any) => {
    if (!isLoggedIn) {
      toast.error("Please login to add items to cart");
      router.push("/login");
      return;
    }
    
    setIsLoading(true);
    try {
      await axios.post("https://ecommerce-backend.onrender.com/cart/add", null, {
        params: {
          user_id: userId,
          product_id: product.id,
          product_name: product.name,
          product_price: product.price,
          product_image: product.image,
          quantity: 1
        }
      });
      
      toast.success(`${product.name} added to cart!`, { icon: "🛒" });
      fetchCartCount();
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error("Failed to add to cart");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user_name");
    localStorage.removeItem("user_id");
    localStorage.removeItem("wishlist");
    setIsLoggedIn(false);
    setUserId(null);
    setCartCount(0);
    setWishlist([]);
    setIsDropdownOpen(false);
    toast.success("Logged out successfully!");
    router.push("/login");
  };

  const handleNavClick = (path: string, name: string) => {
    setActiveNav(name);
    router.push(path);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Toaster position="top-right" />
      
      {/* Top Bar */}
      <div className="bg-blue-600 text-white text-xs py-1.5 px-4 text-center hidden md:block">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex gap-6">
            <span>🛍️ Free Shipping on orders ₹999+</span>
            <span>🔄 30 Days Return Policy</span>
            <span>🔒 Secure Payments</span>
          </div>
          <div className="flex gap-4">
            <button className="hover:text-blue-200">Sell on ShopHub</button>
            <button className="hover:text-blue-200">Download App</button>
          </div>
        </div>
      </div>

      {/* Header */}
      <header className={`sticky top-0 z-50 bg-white transition-shadow ${isScrolled ? "shadow-md" : ""}`}>
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-3 gap-4">
            {/* Logo */}
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-1 cursor-pointer flex-shrink-0"
              onClick={() => router.push("/")}
            >
              <ShoppingBagIcon className="w-7 h-7 text-blue-600" />
              <span className="text-xl font-bold text-blue-600">ShopHub</span>
            </motion.div>

            {/* Search Bar */}
            <div ref={searchRef} className="flex-1 max-w-2xl relative">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search for Products, Brands and More..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setShowSearchResults(true);
                    setSelectedIndex(-1);
                  }}
                  onFocus={() => setShowSearchResults(true)}
                  onKeyDown={handleKeyDown}
                  className="w-full px-12 py-2.5 bg-gray-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                />
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                {searchQuery && (
                  <button
                    onClick={clearSearch}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 hover:bg-gray-200 rounded-full transition"
                  >
                    <XMarkIcon className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                  </button>
                )}
                {isSearching && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <ArrowPathIcon className="w-4 h-4 text-gray-400 animate-spin" />
                  </div>
                )}
              </div>

              {/* Search Results Dropdown */}
              <AnimatePresence>
                {showSearchResults && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl z-50 overflow-hidden border border-gray-100"
                  >
                    {isSearching && searchResults.length === 0 && searchQuery && (
                      <div className="p-8 text-center">
                        <ArrowPathIcon className="w-8 h-8 text-blue-500 animate-spin mx-auto mb-2" />
                        <p className="text-gray-500">Searching products...</p>
                      </div>
                    )}

                    {!searchQuery && recentSearches.length > 0 && (
                      <div className="p-3">
                        <div className="flex justify-between items-center mb-2 px-2">
                          <span className="text-xs font-semibold text-gray-500">RECENT SEARCHES</span>
                          <button onClick={clearRecentSearches} className="text-xs text-blue-600 hover:underline">Clear All</button>
                        </div>
                        {recentSearches.map((search, idx) => (
                          <div key={idx} onClick={() => handleTrendingClick(search)} className="flex items-center gap-3 px-3 py-2 hover:bg-gray-50 rounded-lg cursor-pointer transition">
                            <ClockIcon className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-700">{search}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {!searchQuery && recentSearches.length === 0 && (
                      <div className="p-3">
                        <div className="px-2 mb-2"><span className="text-xs font-semibold text-gray-500">TRENDING NOW 🔥</span></div>
                        {["iPhone", "Samsung", "Nike Shoes", "Watches", "Laptop", "Headphones"].map((trend, idx) => (
                          <div key={idx} onClick={() => handleTrendingClick(trend)} className="flex items-center gap-3 px-3 py-2 hover:bg-gray-50 rounded-lg cursor-pointer transition">
                            <span className="text-sm text-gray-700">{trend}</span>
                            <span className="text-xs text-red-500">Trending</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {searchQuery && searchResults.length > 0 && (
                      <>
                        <div className="px-3 py-2 text-xs text-gray-500 border-b">Found {searchResults.length} results for "{searchQuery}"</div>
                        <div className="max-h-96 overflow-y-auto">
                          {searchResults.map((product, idx) => (
                            <div key={product.id} onClick={() => handleProductClick(product)} className={`flex items-center gap-3 p-3 hover:bg-gray-50 cursor-pointer transition ${selectedIndex === idx ? "bg-gray-50" : ""}`}>
                              <img src={product.image} alt={product.name} className="w-12 h-12 object-cover rounded-lg" />
                              <div className="flex-1 min-w-0">
                                <h4 className="font-semibold text-sm truncate">{highlightText(product.name, searchQuery)}</h4>
                                <p className="text-xs text-gray-500">{product.brand}</p>
                                <div className="flex items-center gap-2 mt-1">
                                  <span className="text-sm font-bold text-blue-600">₹{product.price.toLocaleString()}</span>
                                  <span className="text-xs text-gray-400 line-through">₹{product.originalPrice.toLocaleString()}</span>
                                  <span className="text-xs text-green-600">{product.discount}% off</span>
                                </div>
                              </div>
                              <button onClick={(e) => { e.stopPropagation(); addToCart(product); }} className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition whitespace-nowrap">Add to Cart</button>
                            </div>
                          ))}
                        </div>
                        <div className="p-3 border-t text-center">
                          <button onClick={handleSearchSubmit} className="text-sm text-blue-600 hover:underline">See all results for "{searchQuery}" →</button>
                        </div>
                      </>
                    )}

                    {searchQuery && searchResults.length === 0 && !isSearching && (
                      <div className="p-8 text-center">
                        <MagnifyingGlassIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                        <h3 className="font-semibold text-gray-800 mb-1">No results found</h3>
                        <p className="text-sm text-gray-500">We couldn't find any products matching "{searchQuery}"</p>
                        <button onClick={handleSearchSubmit} className="mt-4 text-blue-600 text-sm hover:underline">Search instead for "{searchQuery}" →</button>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-4 flex-shrink-0">
              {isLoggedIn ? (
                <div className="relative">
                  <button onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="flex items-center gap-1 text-gray-700 hover:text-blue-600 transition">
                    <UserCircleIcon className="w-6 h-6" />
                    <span className="text-sm">{userName?.split(" ")[0] || "User"}</span>
                    <ChevronDownIcon className={`w-4 h-4 transition-transform duration-200 ${isDropdownOpen ? "rotate-180" : ""}`} />
                  </button>

                  {isDropdownOpen && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setIsDropdownOpen(false)} />
                      <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl z-50 overflow-hidden border border-gray-100">
                        <div className="px-4 py-3 bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
                          <p className="text-sm font-semibold text-gray-800">{userName}</p>
                          <p className="text-xs text-gray-500">View and edit profile</p>
                        </div>
                        <div className="py-2">
                          <button onClick={() => { setIsDropdownOpen(false); router.push("/profile"); }} className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition">
                            <UserCircleIcon className="w-5 h-5 text-gray-500" /><span>My Profile</span>
                          </button>
                          <button onClick={() => { setIsDropdownOpen(false); router.push("/orders"); }} className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition">
                            <ShoppingBagIcon className="w-5 h-5 text-gray-500" /><span>My Orders</span>
                          </button>
                          <button onClick={() => { setIsDropdownOpen(false); router.push("/wishlist"); }} className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition">
                            <HeartIcon className="w-5 h-5 text-gray-500" /><span>Wishlist</span>
                            {wishlist.length > 0 && <span className="ml-auto bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">{wishlist.length}</span>}
                          </button>
                          <button onClick={() => { setIsDropdownOpen(false); router.push("/cart"); }} className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition">
                            <ShoppingBagIcon className="w-5 h-5 text-gray-500" /><span>Cart</span>
                            {cartCount > 0 && <span className="ml-auto bg-blue-600 text-white text-xs px-1.5 py-0.5 rounded-full">{cartCount}</span>}
                          </button>
                          <div className="border-t my-1"></div>
                          <button onClick={() => { setIsDropdownOpen(false); handleLogout(); }} className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                            <span>Logout</span>
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <button onClick={() => router.push("/login")} className="bg-blue-600 text-white px-6 py-2 rounded font-medium hover:bg-blue-700">Login</button>
              )}
              
              <button onClick={() => router.push("/wishlist")} className="relative">
                <HeartIcon className="w-6 h-6 text-gray-600" />
                {wishlist.length > 0 && <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">{wishlist.length}</span>}
              </button>
              
              <button onClick={() => router.push("/cart")} className="relative">
                <ShoppingBagIcon className="w-6 h-6 text-gray-600" />
                {cartCount > 0 && <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">{cartCount}</span>}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Categories */}
      <div className="bg-white border-b sticky top-[73px] z-40 overflow-x-auto shadow-sm">
        <div className="container mx-auto">
          <div className="flex gap-4 px-4 py-3 text-sm font-medium whitespace-nowrap">
            {navCategories.map((cat) => (
              <button key={cat.name} onClick={() => handleNavClick(cat.path, cat.name)} className={`${activeNav === cat.name ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-700 hover:text-blue-600"} pb-2 transition px-2`}>
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Hero Slider */}
      <Swiper modules={[Navigation, Pagination, Autoplay]} navigation pagination={{ clickable: true }} autoplay={{ delay: 4000, disableOnInteraction: false }} className="h-[280px] md:h-[400px]">
        {banners.map((banner) => (
          <SwiperSlide key={banner.id}>
            <div className={`relative h-full bg-gradient-to-r ${banner.color} cursor-pointer`}>
              <div className="absolute inset-0 bg-black/30"></div>
              <div className="absolute inset-0 bg-cover bg-center opacity-30" style={{ backgroundImage: `url(${banner.image})` }}></div>
              <div className="relative h-full flex items-center justify-between px-8 md:px-16 text-white">
                <div className="max-w-md">
                  <h2 className="text-2xl md:text-4xl font-bold mb-2">{banner.title}</h2>
                  <p className="text-xl md:text-2xl mb-1">{banner.subtitle}</p>
                  <p className="text-sm opacity-90 mb-4">{banner.description}</p>
                  <button className="bg-white text-gray-900 px-6 py-2 rounded font-semibold hover:shadow-lg transition">Shop Now →</button>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Category Grid */}
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-5 md:grid-cols-10 gap-4 bg-white rounded-lg p-4 shadow-sm">
          {categories.map((cat) => (
            <motion.button key={cat.name} whileHover={{ y: -5 }} onClick={() => router.push(cat.path)} className="flex flex-col items-center gap-2 group cursor-pointer">
              <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center group-hover:bg-blue-50 transition">
                <cat.icon className={`w-6 h-6 ${cat.color}`} />
              </div>
              <span className="text-xs text-gray-600 group-hover:text-blue-600">{cat.name}</span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Bank Offers Banner */}
      <div className="container mx-auto px-4 mb-6">
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-3"><CreditCardIcon className="w-5 h-5 text-green-600" /><h3 className="font-semibold text-gray-800">Bank Offers</h3></div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {bankOffers.map((offer, idx) => (
              <div key={idx} className="flex items-center gap-2 p-2 bg-gray-50 rounded"><span className="text-xl">{offer.icon}</span><div><p className="text-xs font-semibold">{offer.bank}</p><p className="text-xs text-gray-500">{offer.offer}</p></div></div>
            ))}
          </div>
        </div>
      </div>

      {/* Popular Picks Section */}
      <div className="container mx-auto px-4 mb-6">
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <div className="flex justify-between items-center mb-4"><div className="flex items-center gap-2"><FireIcon className="w-6 h-6 text-orange-500" /><h2 className="text-xl font-bold text-gray-800">Popular Picks</h2></div><button className="text-blue-600 text-sm font-medium hover:underline">View All →</button></div>
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
            {products.popular.map((product) => (
              <motion.div key={product.id} whileHover={{ y: -4 }} className="cursor-pointer group">
                <div className="relative">
                  <img src={product.image} alt={product.name} className="w-full h-40 object-cover rounded-lg" />
                  <span className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded">{product.discount}% OFF</span>
                  <button onClick={() => toggleWishlist(product)} className="absolute top-2 right-2 bg-white rounded-full p-1.5 shadow-md hover:scale-110 transition">
                    {wishlist.includes(product.id) ? <HeartSolidIcon className="w-4 h-4 text-red-500" /> : <HeartIcon className="w-4 h-4 text-gray-400" />}
                  </button>
                </div>
                <div className="mt-2">
                  <p className="text-sm font-semibold truncate">{product.name}</p>
                  <p className="text-xs text-gray-500">{product.brand}</p>
                  <div className="flex items-center gap-1 mt-1"><span className="text-sm font-bold">₹{product.price}</span><span className="text-xs text-gray-400 line-through">₹{product.originalPrice}</span></div>
                  <div className="flex items-center gap-1 mt-1"><span className="bg-green-600 text-white text-xs px-1 rounded">{product.rating}★</span><span className="text-xs text-gray-500">(123)</span></div>
                  <button onClick={() => addToCart(product)} disabled={isLoading} className="w-full mt-2 bg-blue-600 text-white py-1.5 rounded text-sm font-semibold hover:bg-blue-700 transition disabled:opacity-50">Add to Cart</button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Deal of the Day */}
      <div className="container mx-auto px-4 mb-6">
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <div className="flex justify-between items-center mb-4"><div className="flex items-center gap-2"><ClockIcon className="w-6 h-6 text-blue-600" /><h2 className="text-xl font-bold text-gray-800">Deal of the Day</h2><span className="text-sm text-red-500 bg-red-50 px-2 py-0.5 rounded">Limited Time Offer</span></div><button className="text-blue-600 text-sm font-medium hover:underline">View All →</button></div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {products.deals.map((product) => (
              <motion.div key={product.id} whileHover={{ y: -4 }} className="cursor-pointer group">
                <div className="relative">
                  <img src={product.image} alt={product.name} className="w-full h-36 object-cover rounded-lg" />
                  <span className="absolute bottom-2 left-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded">{product.discount}% OFF</span>
                  <button onClick={() => toggleWishlist(product)} className="absolute top-2 right-2 bg-white rounded-full p-1.5 shadow-md hover:scale-110 transition">
                    {wishlist.includes(product.id) ? <HeartSolidIcon className="w-4 h-4 text-red-500" /> : <HeartIcon className="w-4 h-4 text-gray-400" />}
                  </button>
                </div>
                <div className="mt-2">
                  <p className="text-sm font-semibold truncate">{product.name}</p>
                  <p className="text-xs text-gray-500">{product.brand}</p>
                  <div className="flex items-center gap-1 mt-1"><span className="text-sm font-bold">₹{product.price}</span><span className="text-xs text-gray-400 line-through">₹{product.originalPrice}</span></div>
                  <button onClick={() => addToCart(product)} disabled={isLoading} className="w-full mt-2 bg-blue-600 text-white py-1.5 rounded text-sm font-semibold hover:bg-blue-700 transition disabled:opacity-50">Add to Cart</button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Special Offers Banner */}
      <div className="container mx-auto px-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {products.offers.map((offer) => (
            <div key={offer.id} className="relative rounded-lg overflow-hidden cursor-pointer group">
              <img src={offer.image} alt={offer.name} className="w-full h-48 object-cover group-hover:scale-105 transition duration-300" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-6">
                <div className="text-white"><p className="text-sm font-semibold">{offer.discount}% OFF</p><p className="text-xl font-bold">{offer.name}</p><p className="text-lg">From ₹{offer.price}</p></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 mt-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            <div><h3 className="font-semibold mb-3">ABOUT</h3><ul className="space-y-2 text-sm text-gray-400"><li><button className="hover:text-white">Contact Us</button></li><li><button className="hover:text-white">About Us</button></li><li><button className="hover:text-white">Careers</button></li><li><button className="hover:text-white">Press</button></li></ul></div>
            <div><h3 className="font-semibold mb-3">HELP</h3><ul className="space-y-2 text-sm text-gray-400"><li><button className="hover:text-white">Payments</button></li><li><button className="hover:text-white">Shipping</button></li><li><button className="hover:text-white">Cancellation</button></li><li><button className="hover:text-white">FAQ</button></li></ul></div>
            <div><h3 className="font-semibold mb-3">POLICY</h3><ul className="space-y-2 text-sm text-gray-400"><li><button className="hover:text-white">Return Policy</button></li><li><button className="hover:text-white">Terms of Use</button></li><li><button className="hover:text-white">Security</button></li><li><button className="hover:text-white">Privacy</button></li></ul></div>
            <div><h3 className="font-semibold mb-3">SOCIAL</h3><ul className="space-y-2 text-sm text-gray-400"><li><button className="hover:text-white">Facebook</button></li><li><button className="hover:text-white">Twitter</button></li><li><button className="hover:text-white">Instagram</button></li><li><button className="hover:text-white">YouTube</button></li></ul></div>
            <div><h3 className="font-semibold mb-3">MAIL US</h3><p className="text-sm text-gray-400">ShopHub E-commerce Pvt Ltd, Bangalore, India</p><p className="text-sm text-gray-400 mt-2">📞 1800-123-4567</p><p className="text-sm text-gray-400">✉️ support@shophub.com</p></div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-6 text-center text-sm text-gray-400"><p>&copy; 2024 ShopHub. All rights reserved. Premium E-commerce Platform</p></div>
        </div>
      </footer>
    </div>
  );
}
