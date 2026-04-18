"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay, EffectFade } from "swiper/modules";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-fade";

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
  FunnelIcon,
  XMarkIcon,
  FireIcon,
  ClockIcon,
  BoltIcon,
  GiftIcon,
  FaceSmileIcon,
} from "@heroicons/react/24/outline";
import { HeartIcon as HeartSolidIcon } from "@heroicons/react/24/solid";

// Navigation Categories
const navCategories = [
  "NEW LAUNCHES",
  "DENIM",
  "FEST",
  "AKSHAYATRITIYA",
  "Shirts",
  "T-Shirts",
  "Jeans",
  "Sports Shoes",
  "Watches",
  "Kids' clothing",
  "Luggage",
  "Kurtas",
  "Trunk, Vests",
  "Summer Wear",
  "Sports",
];

// Hero Banner Slides
const heroBanners = [
  {
    id: 1,
    title: "Shine brighter this",
    subtitle: "Min. 70% Off",
    description: "Effortless styles | Limited Period Offer",
    image: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=1600",
    color: "from-pink-500 to-rose-600",
    buttonText: "Shop Now →",
  },
  {
    id: 2,
    title: "Wedding Store",
    subtitle: "Min. 60% Off",
    description: "Traditional & Modern | Wedding Season Special",
    image: "https://images.unsplash.com/photo-1583391733956-6c9eab6c1f4a?w=1600",
    color: "from-red-500 to-orange-600",
    buttonText: "Explore Collection →",
  },
  {
    id: 3,
    title: "Summer Sale",
    subtitle: "Min. 50% Off",
    description: "Beat the heat | Summer Essentials",
    image: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=1600",
    color: "from-yellow-500 to-orange-600",
    buttonText: "Grab Deal →",
  },
  {
    id: 4,
    title: "Premium Collection",
    subtitle: "Min. 40% Off",
    description: "Luxury at Affordable Prices",
    image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1600",
    color: "from-purple-600 to-indigo-600",
    buttonText: "View Collection →",
  },
  {
    id: 5,
    title: "Flash Sale",
    subtitle: "Up to 80% Off",
    description: "Limited Stock! Hurry Up!",
    image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1600",
    color: "from-green-600 to-teal-600",
    buttonText: "Shop Flash Sale →",
  },
];

// Category Icons for the grid
const categoryGrid = [
  { name: "Shirts", icon: "👕", offers: "Min. 70% Off", image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=200" },
  { name: "T-Shirts", icon: "👕", offers: "Min. 60% Off", image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=200" },
  { name: "Jeans", icon: "👖", offers: "Min. 50% Off", image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=200" },
  { name: "Sports Shoes", icon: "👟", offers: "Min. 40% Off", image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200" },
  { name: "Watches", icon: "⌚", offers: "Min. 65% Off", image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200" },
  { name: "Kids' clothing", icon: "👶", offers: "Min. 55% Off", image: "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=200" },
  { name: "Luggage", icon: "🧳", offers: "Min. 45% Off", image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=200" },
  { name: "Kurtas", icon: "👔", offers: "Min. 60% Off", image: "https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=200" },
  { name: "Trunk, Vests", icon: "👕", offers: "Min. 50% Off", image: "https://images.unsplash.com/photo-1586363104864-3e5e2b2b8e5a?w=200" },
  { name: "Summer Wear", icon: "☀️", offers: "Min. 70% Off", image: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=200" },
  { name: "Sport", icon: "⚽", offers: "Min. 40% Off", image: "https://images.unsplash.com/photo-1461896836934-ffe807baa8e7?w=200" },
  { name: "Accessories", icon: "🕶️", offers: "Min. 50% Off", image: "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=200" },
  { name: "Jackets", icon: "🧥", offers: "Min. 55% Off", image: "https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=200" },
  { name: "Sweaters", icon: "🧶", offers: "Min. 60% Off", image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=200" },
  { name: "Track Pants", icon: "🏃", offers: "Min. 45% Off", image: "https://images.unsplash.com/photo-1517438476313-10d79c077131?w=200" },
  { name: "Hoodies", icon: "👕", offers: "Min. 50% Off", image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=200" },
];

// Offer Banners
const offerBanners = [
  { title: "Shine brighter this", discount: "Min. 70% Off", subtitle: "Effortless styles", bgColor: "bg-gradient-to-r from-purple-600 to-pink-600" },
  { title: "Wedding Store", discount: "Min. 60% Off", subtitle: "Traditional & Modern", bgColor: "bg-gradient-to-r from-red-600 to-orange-600" },
  { title: "Sportswear", discount: "Min. 50% Off", subtitle: "Active & Comfortable", bgColor: "bg-gradient-to-r from-green-600 to-teal-600" },
  { title: "Accessories", discount: "Buy 1 Get 1", subtitle: "Limited Time Offer", bgColor: "bg-gradient-to-r from-blue-600 to-cyan-600" },
];

// All Fashion Products for Search
const allProducts = [
  // Shirts & T-Shirts
  { id: 1, name: "Men's Casual Shirt", price: 899, originalPrice: 2999, discount: 70, rating: 4.3, reviews: 2345, image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=300", brand: "Fashion Hub", category: "Shirts", isNew: true, isFeatured: true },
  { id: 2, name: "Slim Fit Formal Shirt", price: 1199, originalPrice: 3999, discount: 70, rating: 4.4, reviews: 1876, image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=300", brand: "Arrow", category: "Shirts", isFeatured: true },
  { id: 3, name: "Printed Casual Shirt", price: 699, originalPrice: 2499, discount: 72, rating: 4.2, reviews: 3456, image: "https://images.unsplash.com/photo-1598032895397-b9472444bf93?w=300", brand: "Roadster", category: "Shirts", isNew: true },
  { id: 4, name: "Denim Shirt", price: 999, originalPrice: 3499, discount: 71, rating: 4.5, reviews: 2341, image: "https://images.unsplash.com/photo-1495105787522-5334f3ff99f3?w=300", brand: "Levi's", category: "Shirts" },
  
  // Jeans
  { id: 5, name: "Slim Fit Jeans", price: 1199, originalPrice: 3999, discount: 70, rating: 4.4, reviews: 4567, image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=300", brand: "Denim Co", category: "Jeans", isTrending: true },
  { id: 6, name: "Regular Fit Jeans", price: 999, originalPrice: 2999, discount: 67, rating: 4.3, reviews: 3456, image: "https://images.unsplash.com/photo-1542272604-6c8e5d1e7c9f?w=300", brand: "Lee", category: "Jeans" },
  { id: 7, name: "Skinny Fit Jeans", price: 1399, originalPrice: 4499, discount: 69, rating: 4.5, reviews: 2345, image: "https://images.unsplash.com/photo-1505705694346-019e1e335916?w=300", brand: "Flying Machine", category: "Jeans", isNew: true },
  { id: 8, name: "Distressed Jeans", price: 1499, originalPrice: 4999, discount: 70, rating: 4.6, reviews: 1234, image: "https://images.unsplash.com/photo-1582418702059-97ebafb35d09?w=300", brand: "Jack & Jones", category: "Jeans" },
  
  // Shoes
  { id: 9, name: "Running Shoes", price: 1999, originalPrice: 5999, discount: 67, rating: 4.5, reviews: 5678, image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300", brand: "Nike", category: "Sports Shoes", isFeatured: true },
  { id: 10, name: "Casual Sneakers", price: 1499, originalPrice: 3999, discount: 63, rating: 4.4, reviews: 3456, image: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=300", brand: "Puma", category: "Sports Shoes" },
  { id: 11, name: "Sports Shoes", price: 2499, originalPrice: 6999, discount: 64, rating: 4.6, reviews: 2345, image: "https://images.unsplash.com/photo-1461896836934-ffe807baa8e7?w=300", brand: "Adidas", category: "Sports Shoes", isTrending: true },
  { id: 12, name: "Formal Shoes", price: 1799, originalPrice: 4999, discount: 64, rating: 4.3, reviews: 1876, image: "https://images.unsplash.com/photo-1614253429340-28120a3c5e9a?w=300", brand: "Bata", category: "Sports Shoes" },
  { id: 13, name: "Loafers", price: 999, originalPrice: 2999, discount: 67, rating: 4.2, reviews: 2345, image: "https://images.unsplash.com/photo-1533867617858-e7b97e060509?w=300", brand: "Hush Puppies", category: "Sports Shoes" },
  
  // Watches
  { id: 14, name: "Premium Watch", price: 2499, originalPrice: 9999, discount: 75, rating: 4.6, reviews: 876, image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300", brand: "Fossil", category: "Watches", isNew: true },
  { id: 15, name: "Smart Watch", price: 3999, originalPrice: 12999, discount: 69, rating: 4.7, reviews: 654, image: "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=300", brand: "Noise", category: "Watches" },
  { id: 16, name: "Analog Watch", price: 1499, originalPrice: 4999, discount: 70, rating: 4.4, reviews: 1234, image: "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=300", brand: "Fastrack", category: "Watches" },
  { id: 17, name: "Chronograph Watch", price: 2999, originalPrice: 8999, discount: 67, rating: 4.5, reviews: 987, image: "https://images.unsplash.com/photo-1539874754764-5a96559165b0?w=300", brand: "Casio", category: "Watches" },
  
  // Kids Wear
  { id: 18, name: "Kids T-Shirt", price: 399, originalPrice: 1299, discount: 69, rating: 4.2, reviews: 3456, image: "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=300", brand: "Kids Hub", category: "Kids' clothing" },
  { id: 19, name: "Kids Jeans", price: 599, originalPrice: 1999, discount: 70, rating: 4.3, reviews: 2345, image: "https://images.unsplash.com/photo-1519457431-44ccd64e57cc?w=300", brand: "Gini & Jony", category: "Kids' clothing" },
  { id: 20, name: "Kids Shoes", price: 499, originalPrice: 1499, discount: 67, rating: 4.1, reviews: 1876, image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300", brand: "Crocs", category: "Kids' clothing" },
  
  // Kurtas
  { id: 21, name: "Men's Kurta", price: 999, originalPrice: 3999, discount: 75, rating: 4.4, reviews: 1234, image: "https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=300", brand: "Manyavar", category: "Kurtas", isFeatured: true },
  { id: 22, name: "Designer Kurta", price: 1499, originalPrice: 5999, discount: 75, rating: 4.5, reviews: 876, image: "https://images.unsplash.com/photo-1621416894569-0f39ed31d247?w=300", brand: "Fabindia", category: "Kurtas" },
  
  // Sportswear
  { id: 23, name: "Sports Jersey", price: 1299, originalPrice: 3999, discount: 68, rating: 4.5, reviews: 2345, image: "https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=300", brand: "Puma", category: "Sport" },
  { id: 24, name: "Track Pants", price: 799, originalPrice: 2499, discount: 68, rating: 4.4, reviews: 1876, image: "https://images.unsplash.com/photo-1517438476313-10d79c077131?w=300", brand: "Adidas", category: "Sport" },
  { id: 25, name: "Gym Vest", price: 399, originalPrice: 1299, discount: 69, rating: 4.3, reviews: 1234, image: "https://images.unsplash.com/photo-1577221084712-45b0445d2b00?w=300", brand: "Nike", category: "Sport", isNew: true },
  
  // Accessories
  { id: 26, name: "Sunglasses", price: 599, originalPrice: 2499, discount: 76, rating: 4.3, reviews: 3456, image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=300", brand: "Ray-Ban", category: "Accessories" },
  { id: 27, name: "Leather Wallet", price: 399, originalPrice: 1499, discount: 73, rating: 4.2, reviews: 2345, image: "https://images.unsplash.com/photo-1627123424574-724758594e93?w=300", brand: "Urban Space", category: "Accessories" },
  { id: 28, name: "Belt", price: 299, originalPrice: 999, discount: 70, rating: 4.1, reviews: 1876, image: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=300", brand: "Levi's", category: "Accessories" },
  { id: 29, name: "Cap", price: 249, originalPrice: 799, discount: 69, rating: 4.2, reviews: 1234, image: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=300", brand: "Nike", category: "Accessories" },
  { id: 30, name: "Backpack", price: 999, originalPrice: 2999, discount: 67, rating: 4.4, reviews: 876, image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300", brand: "Skybags", category: "Accessories" },
  
  // Winter Wear
  { id: 31, name: "Denim Jacket", price: 1999, originalPrice: 5999, discount: 67, rating: 4.5, reviews: 2345, image: "https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=300", brand: "Levi's", category: "Jackets" },
  { id: 32, name: "Hoodie", price: 1299, originalPrice: 3999, discount: 68, rating: 4.4, reviews: 1876, image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=300", brand: "Roadster", category: "Hoodies" },
  { id: 33, name: "Sweater", price: 899, originalPrice: 2999, discount: 70, rating: 4.3, reviews: 1234, image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=300", brand: "U.S. Polo", category: "Sweaters" },
];

// Products for sections
const products = {
  popular: allProducts.slice(0, 6),
  deals: allProducts.slice(6, 10),
  offers: allProducts.slice(10, 12),
};

// Flash Sale Items
const flashSaleItems = [
  { id: 101, name: "Limited Edition T-Shirt", price: 399, originalPrice: 1999, discount: 80, image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300", brand: "Fashion Hub" },
  { id: 102, name: "Premium Sneakers", price: 1499, originalPrice: 5999, discount: 75, image: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=300", brand: "Puma" },
  { id: 103, name: "Designer Watch", price: 1999, originalPrice: 9999, discount: 80, image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300", brand: "Fossil" },
  { id: 104, name: "Winter Jacket", price: 1499, originalPrice: 5999, discount: 75, image: "https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=300", brand: "Levi's" },
];

// Trending Now Items
const trendingItems = [
  { id: 201, name: "Oversized T-Shirt", price: 599, originalPrice: 1999, discount: 70, image: "https://images.unsplash.com/photo-1503342394128-c104d54dba01?w=300", brand: "Roadster", trend: "🔥 Hot" },
  { id: 202, name: "Cargo Pants", price: 899, originalPrice: 2999, discount: 70, image: "https://images.unsplash.com/photo-1517438476313-10d79c077131?w=300", brand: "Denim Co", trend: "⭐ Bestseller" },
  { id: 203, name: "Sports Shoes", price: 1999, originalPrice: 6999, discount: 71, image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300", brand: "Nike", trend: "🚀 Trending" },
  { id: 204, name: "Smart Watch", price: 2999, originalPrice: 12999, discount: 77, image: "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=300", brand: "Noise", trend: "💥 Viral" },
];

// Filter options
const filters = {
  categories: ["All", "Shirts", "Jeans", "Sports Shoes", "Watches", "Kids' clothing", "Kurtas", "Sport", "Accessories", "Jackets"],
  brands: ["Nike", "Adidas", "Puma", "Levi's", "Fossil", "Fastrack", "Manyavar", "Roadster", "Arrow", "U.S. Polo"],
  sizes: ["S", "M", "L", "XL", "XXL", "3XL", "4XL"],
  colors: ["Red", "Blue", "Black", "White", "Green", "Yellow", "Navy", "Grey"],
  priceRanges: ["Under ₹500", "₹500-₹1000", "₹1000-₹2000", "₹2000-₹5000", "₹5000+"],
};

export default function FashionPage() {
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
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [wishlist, setWishlist] = useState<number[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedPriceRange, setSelectedPriceRange] = useState("");
  const [sortBy, setSortBy] = useState("featured");
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeNav, setActiveNav] = useState("NEW LAUNCHES");
  const [timeLeft, setTimeLeft] = useState({ hours: 2, minutes: 30, seconds: 0 });
  const [isLoading, setIsLoading] = useState(false);
  
  const searchRef = useRef<HTMLDivElement>(null);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("fashionRecentSearches");
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, []);

  // Save recent search
  const saveRecentSearch = (query: string) => {
    if (!query.trim()) return;
    const updated = [query, ...recentSearches.filter(s => s !== query)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem("fashionRecentSearches", JSON.stringify(updated));
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
    router.push(`/search?q=${encodeURIComponent(searchQuery)}&category=fashion`);
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
    router.push(`/search?q=${encodeURIComponent(trend)}&category=fashion`);
  };

  const clearSearch = () => {
    setSearchQuery("");
    setSearchResults([]);
    setShowSearchResults(false);
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem("fashionRecentSearches");
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

  // Filter products for main grid
  const filteredProducts = allProducts.filter(product => {
    if (selectedCategory !== "All" && product.category !== selectedCategory) return false;
    
    if (selectedPriceRange) {
      if (selectedPriceRange === "Under ₹500" && product.price > 500) return false;
      if (selectedPriceRange === "₹500-₹1000" && (product.price < 500 || product.price > 1000)) return false;
      if (selectedPriceRange === "₹1000-₹2000" && (product.price < 1000 || product.price > 2000)) return false;
      if (selectedPriceRange === "₹2000-₹5000" && (product.price < 2000 || product.price > 5000)) return false;
      if (selectedPriceRange === "₹5000+" && product.price < 5000) return false;
    }
    
    if (searchQuery && !product.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    
    return true;
  });

  // Fetch cart from backend
  const fetchCartFromBackend = async () => {
    if (!userId) return;
    
    try {
      const response = await axios.get(`http://127.0.0.1:8000/cart/${userId}`);
      const cartData = response.data;
      
      const cartItems = cartData.items.map((item: any) => ({
        id: item.product_id,
        name: item.product_name,
        price: item.product_price,
        image: item.product_image,
        quantity: item.quantity,
        cart_item_id: item.id
      }));
      
      setCartItems(cartItems);
      setCartCount(cartItems.length);
      localStorage.setItem("cart", JSON.stringify(cartItems));
    } catch (error) {
      console.error("Error fetching cart:", error);
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
      await axios.post("http://127.0.0.1:8000/cart/add", null, {
        params: {
          user_id: userId,
          product_id: product.id,
          product_name: product.name,
          product_price: product.price,
          product_image: product.image,
          quantity: 1
        }
      });
      
      await fetchCartFromBackend();
      toast.success(`${product.name} added to cart!`, { icon: "👕" });
    } catch (error: any) {
      console.error("Error adding to cart:", error);
      if (error.code === "ERR_NETWORK") {
        toast.error("Backend not running. Using local storage only.");
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

    if (storedUserId) {
      fetchCartFromBackend();
    } else {
      const savedCart = localStorage.getItem("cart");
      if (savedCart) {
        const cart = JSON.parse(savedCart);
        setCartItems(cart);
        setCartCount(cart.length);
      }
    }

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Timer for flash sale
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const toggleWishlist = (productId: number) => {
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

  const clearFilters = () => {
    setSelectedCategory("All");
    setSelectedPriceRange("");
    setSearchQuery("");
    toast.success("All filters cleared");
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
            <span>💳 EMI Available</span>
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
            <motion.div whileHover={{ scale: 1.05 }} className="flex items-center gap-1 cursor-pointer" onClick={() => router.push("/")}>
              <ShoppingBagIcon className="w-7 h-7 text-blue-600" />
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">ShopHub Fashion</span>
            </motion.div>

            {/* Search Bar with Flipkart-style Realtime Search */}
            <div ref={searchRef} className="flex-1 max-w-2xl relative">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search for shirts, jeans, shoes & more..."
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
                    {/* Loading State */}
                    {isSearching && searchResults.length === 0 && searchQuery && (
                      <div className="p-8 text-center">
                        <ArrowPathIcon className="w-8 h-8 text-blue-500 animate-spin mx-auto mb-2" />
                        <p className="text-gray-500">Searching fashion products...</p>
                      </div>
                    )}

                    {/* Recent Searches */}
                    {!searchQuery && recentSearches.length > 0 && (
                      <div className="p-3">
                        <div className="flex justify-between items-center mb-2 px-2">
                          <span className="text-xs font-semibold text-gray-500">RECENT SEARCHES</span>
                          <button onClick={clearRecentSearches} className="text-xs text-blue-600 hover:underline">Clear All</button>
                        </div>
                        {recentSearches.map((search, idx) => (
                          <div
                            key={idx}
                            onClick={() => handleTrendingClick(search)}
                            className="flex items-center gap-3 px-3 py-2 hover:bg-gray-50 rounded-lg cursor-pointer transition"
                          >
                            <ClockIcon className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-700">{search}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Trending Searches */}
                    {!searchQuery && recentSearches.length === 0 && (
                      <div className="p-3">
                        <div className="px-2 mb-2">
                          <span className="text-xs font-semibold text-gray-500">TRENDING IN FASHION 🔥</span>
                        </div>
                        {["Shirts", "Jeans", "Sneakers", "Watches", "Jackets", "T-Shirts"].map((trend, idx) => (
                          <div
                            key={idx}
                            onClick={() => handleTrendingClick(trend)}
                            className="flex items-center gap-3 px-3 py-2 hover:bg-gray-50 rounded-lg cursor-pointer transition"
                          >
                            <span className="text-sm text-gray-700">{trend}</span>
                            <span className="text-xs text-blue-500">Trending</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Search Results */}
                    {searchQuery && searchResults.length > 0 && (
                      <>
                        <div className="px-3 py-2 text-xs text-gray-500 border-b">
                          Found {searchResults.length} fashion products for "{searchQuery}"
                        </div>
                        <div className="max-h-96 overflow-y-auto">
                          {searchResults.map((product, idx) => (
                            <div
                              key={product.id}
                              onClick={() => handleProductClick(product)}
                              className={`flex items-center gap-3 p-3 hover:bg-gray-50 cursor-pointer transition ${
                                selectedIndex === idx ? "bg-gray-50" : ""
                              }`}
                            >
                              <img
                                src={product.image}
                                alt={product.name}
                                className="w-12 h-12 object-cover rounded-lg"
                              />
                              <div className="flex-1 min-w-0">
                                <h4 className="font-semibold text-sm truncate">
                                  {highlightText(product.name, searchQuery)}
                                </h4>
                                <p className="text-xs text-gray-500">{product.brand}</p>
                                <div className="flex items-center gap-2 mt-1">
                                  <span className="text-sm font-bold text-blue-600">₹{product.price.toLocaleString()}</span>
                                  <span className="text-xs text-gray-400 line-through">₹{product.originalPrice.toLocaleString()}</span>
                                  <span className="text-xs text-green-600">{product.discount}% off</span>
                                </div>
                              </div>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  addToCartBackend(product);
                                }}
                                className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition whitespace-nowrap"
                              >
                                Add to Cart
                              </button>
                            </div>
                          ))}
                        </div>
                        <div className="p-3 border-t text-center">
                          <button
                            onClick={handleSearchSubmit}
                            className="text-sm text-blue-600 hover:underline"
                          >
                            See all results for "{searchQuery}" →
                          </button>
                        </div>
                      </>
                    )}

                    {/* No Results */}
                    {searchQuery && searchResults.length === 0 && !isSearching && (
                      <div className="p-8 text-center">
                        <FaceSmileIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                        <h3 className="font-semibold text-gray-800 mb-1">No fashion products found</h3>
                        <p className="text-sm text-gray-500">
                          We couldn't find any fashion products matching "{searchQuery}"
                        </p>
                        <button
                          onClick={handleSearchSubmit}
                          className="mt-4 text-blue-600 text-sm hover:underline"
                        >
                          Search instead for "{searchQuery}" →
                        </button>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="flex items-center gap-4">
              {isLoggedIn ? (
                <div className="relative group">
                  <button className="flex items-center gap-1 text-gray-700">
                    <UserCircleIcon className="w-6 h-6" />
                    <span className="text-sm">{userName?.split(" ")[0] || "User"}</span>
                    <ChevronDownIcon className="w-4 h-4" />
                  </button>
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg hidden group-hover:block z-50">
                    <button onClick={() => router.push("/profile")} className="block w-full text-left px-4 py-2 hover:bg-gray-100">My Profile</button>
                    <button onClick={() => router.push("/orders")} className="block w-full text-left px-4 py-2 hover:bg-gray-100">My Orders</button>
                    <button onClick={() => router.push("/wishlist")} className="block w-full text-left px-4 py-2 hover:bg-gray-100">Wishlist</button>
                    <button onClick={() => router.push("/cart")} className="block w-full text-left px-4 py-2 hover:bg-gray-100">Cart ({cartCount})</button>
                    <button onClick={() => {
                      localStorage.removeItem("access_token");
                      localStorage.removeItem("user_name");
                      localStorage.removeItem("user_id");
                      setIsLoggedIn(false);
                      toast.success("Logged out successfully!");
                      router.push("/login");
                    }} className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600">
                      Logout
                    </button>
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

      {/* Navigation Categories */}
      <div className="bg-white border-b sticky top-[73px] z-40 overflow-x-auto shadow-sm">
        <div className="container mx-auto">
          <div className="flex gap-4 px-4 py-3 text-sm font-medium whitespace-nowrap">
            {navCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveNav(cat)}
                className={`${activeNav === cat ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-700 hover:text-blue-600"} pb-2 transition px-2`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Hero Banner Slider */}
      <Swiper
        modules={[Navigation, Pagination, Autoplay, EffectFade]}
        navigation
        pagination={{ clickable: true }}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        effect="fade"
        className="h-[400px] md:h-[500px]"
      >
        {heroBanners.map((banner) => (
          <SwiperSlide key={banner.id}>
            <div className={`relative h-full bg-gradient-to-r ${banner.color} cursor-pointer`}>
              <div className="absolute inset-0 bg-black/30"></div>
              <div className="absolute inset-0 bg-cover bg-center opacity-40" style={{ backgroundImage: `url(${banner.image})` }}></div>
              <div className="relative h-full flex items-center justify-between px-8 md:px-16 text-white">
                <div className="max-w-2xl">
                  <motion.h1 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-4xl md:text-6xl font-bold mb-4"
                  >
                    {banner.title}
                  </motion.h1>
                  <motion.p 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-3xl md:text-4xl font-bold mb-2"
                  >
                    {banner.subtitle}
                  </motion.p>
                  <motion.p 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-lg mb-6"
                  >
                    {banner.description}
                  </motion.p>
                  <motion.button 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="bg-white text-gray-900 px-8 py-3 rounded-full font-semibold hover:shadow-lg transition transform hover:scale-105"
                  >
                    {banner.buttonText}
                  </motion.button>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Flash Sale Section */}
      <div className="container mx-auto px-4 py-8">
        <div className="bg-gradient-to-r from-red-500 to-orange-500 rounded-lg p-6 shadow-lg">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-3">
              <BoltIcon className="w-8 h-8 text-white" />
              <h2 className="text-2xl font-bold text-white">FLASH SALE</h2>
              <div className="flex gap-2 text-white">
                <span className="bg-black/30 px-3 py-1 rounded-lg font-mono text-xl">{String(timeLeft.hours).padStart(2, '0')}</span>:
                <span className="bg-black/30 px-3 py-1 rounded-lg font-mono text-xl">{String(timeLeft.minutes).padStart(2, '0')}</span>:
                <span className="bg-black/30 px-3 py-1 rounded-lg font-mono text-xl">{String(timeLeft.seconds).padStart(2, '0')}</span>
              </div>
            </div>
            <button className="text-white font-semibold hover:underline">View All →</button>
          </div>
          <Swiper
            modules={[Navigation, Autoplay]}
            navigation
            spaceBetween={15}
            slidesPerView={2}
            autoplay={{ delay: 3000, disableOnInteraction: false }}
            breakpoints={{
              640: { slidesPerView: 3 },
              768: { slidesPerView: 4 },
              1024: { slidesPerView: 5 },
            }}
          >
            {flashSaleItems.map((item) => (
              <SwiperSlide key={item.id}>
                <div className="bg-white rounded-lg overflow-hidden shadow-lg cursor-pointer group">
                  <div className="relative">
                    <img src={item.image} alt={item.name} className="w-full h-40 object-cover group-hover:scale-105 transition" />
                    <span className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded">-{item.discount}%</span>
                  </div>
                  <div className="p-3">
                    <h3 className="font-semibold text-sm truncate">{item.name}</h3>
                    <p className="text-xs text-gray-500">{item.brand}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-lg font-bold text-red-500">₹{item.price}</span>
                      <span className="text-xs text-gray-400 line-through">₹{item.originalPrice}</span>
                    </div>
                    <button onClick={() => addToCartBackend(item)} className="w-full mt-2 bg-red-500 text-white py-1.5 rounded text-sm font-semibold hover:bg-red-600 transition">
                      Buy Now
                    </button>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>

      {/* Category Grid */}
      <div className="container mx-auto px-4 py-4">
        <Swiper
          modules={[Navigation, Autoplay]}
          navigation
          spaceBetween={15}
          slidesPerView={4}
          autoplay={{ delay: 4000, disableOnInteraction: false }}
          breakpoints={{
            640: { slidesPerView: 6 },
            768: { slidesPerView: 8 },
            1024: { slidesPerView: 12 },
          }}
        >
          {categoryGrid.map((cat, idx) => (
            <SwiperSlide key={idx}>
              <motion.div whileHover={{ y: -5 }} className="cursor-pointer group" onClick={() => setSelectedCategory(cat.name)}>
                <div className="bg-white rounded-lg p-3 text-center shadow-sm hover:shadow-md transition">
                  <div className="text-3xl mb-2">{cat.icon}</div>
                  <h3 className="text-xs font-semibold">{cat.name}</h3>
                  <p className="text-xs text-red-500 font-medium">{cat.offers}</p>
                </div>
              </motion.div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Offer Banners Grid */}
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {offerBanners.map((banner, idx) => (
            <div key={idx} className={`${banner.bgColor} rounded-lg p-6 text-white relative overflow-hidden cursor-pointer group transform hover:scale-105 transition duration-300`}>
              <div className="relative z-10">
                <h3 className="text-xl font-bold mb-2">{banner.title}</h3>
                <p className="text-2xl font-bold mb-1">{banner.discount}</p>
                <p className="text-sm mb-4">{banner.subtitle}</p>
                <button className="bg-white/20 backdrop-blur-sm px-4 py-1 rounded-full text-sm font-semibold hover:bg-white/30 transition">
                  Shop Now →
                </button>
              </div>
              <div className="absolute right-0 top-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10"></div>
            </div>
          ))}
        </div>
      </div>

      {/* Trending Now Section */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <FireIcon className="w-8 h-8 text-orange-500" />
            <h2 className="text-2xl font-bold text-gray-800">Trending Now</h2>
          </div>
          <button className="text-blue-600 font-semibold hover:underline">View All →</button>
        </div>
        <Swiper
          modules={[Navigation, Autoplay]}
          navigation
          spaceBetween={15}
          slidesPerView={2}
          autoplay={{ delay: 3500, disableOnInteraction: false }}
          breakpoints={{
            640: { slidesPerView: 3 },
            768: { slidesPerView: 4 },
            1024: { slidesPerView: 5 },
          }}
        >
          {trendingItems.map((item) => (
            <SwiperSlide key={item.id}>
              <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-xl transition cursor-pointer group">
                <div className="relative">
                  <img src={item.image} alt={item.name} className="w-full h-48 object-cover group-hover:scale-105 transition" />
                  <span className="absolute top-2 right-2 bg-orange-500 text-white text-xs px-2 py-1 rounded-full">{item.trend}</span>
                </div>
                <div className="p-3">
                  <h3 className="font-semibold text-sm">{item.name}</h3>
                  <p className="text-xs text-gray-500">{item.brand}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-lg font-bold">₹{item.price}</span>
                    <span className="text-xs text-gray-400 line-through">₹{item.originalPrice}</span>
                  </div>
                  <button onClick={() => addToCartBackend(item)} className="w-full mt-2 bg-blue-600 text-white py-1.5 rounded text-sm font-semibold hover:bg-blue-700 transition">
                    Add to Cart
                  </button>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Filter Bar */}
      <div className="container mx-auto px-4 mb-6">
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50"
              >
                <FunnelIcon className="w-5 h-5" />
                <span className="text-sm">Filter</span>
              </button>
              <div className="flex gap-2 overflow-x-auto">
                {filters.categories.slice(0, 6).map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1 text-sm rounded-full whitespace-nowrap ${selectedCategory === cat ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">Sort by:</span>
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

          {/* Filter Panel */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="mt-4 pt-4 border-t"
              >
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  <div>
                    <h4 className="font-semibold mb-2">Category</h4>
                    {filters.categories.map(cat => (
                      <label key={cat} className="flex items-center gap-2 text-sm py-1">
                        <input 
                          type="radio" 
                          name="category" 
                          checked={selectedCategory === cat}
                          onChange={() => setSelectedCategory(cat)}
                          className="rounded" 
                        />
                        {cat}
                      </label>
                    ))}
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Price Range</h4>
                    {filters.priceRanges.map(range => (
                      <label key={range} className="flex items-center gap-2 text-sm py-1">
                        <input 
                          type="radio" 
                          name="price" 
                          checked={selectedPriceRange === range}
                          onChange={() => setSelectedPriceRange(range)}
                          className="rounded" 
                        />
                        {range}
                      </label>
                    ))}
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Brand</h4>
                    {filters.brands.slice(0, 6).map(brand => (
                      <label key={brand} className="flex items-center gap-2 text-sm py-1">
                        <input type="checkbox" className="rounded" />
                        {brand}
                      </label>
                    ))}
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Size</h4>
                    <div className="flex flex-wrap gap-2">
                      {filters.sizes.map(size => (
                        <button key={size} className="px-3 py-1 border rounded text-sm hover:border-blue-500">{size}</button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Color</h4>
                    <div className="flex flex-wrap gap-2">
                      {filters.colors.map(color => (
                        <button key={color} className="w-8 h-8 rounded-full border-2 hover:scale-110 transition" style={{ backgroundColor: color.toLowerCase() }} title={color}></button>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 mt-4 pt-2">
                  <button className="px-4 py-1.5 bg-blue-600 text-white rounded text-sm">Apply Filters</button>
                  <button onClick={clearFilters} className="px-4 py-1.5 border rounded text-sm">Clear All</button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Products Grid */}
      <div className="container mx-auto px-4 pb-12">
        {getSortedProducts().length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {getSortedProducts().map((product, idx) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.02 }}
                whileHover={{ y: -4 }}
                className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group cursor-pointer"
              >
                <div className="relative">
                  <img src={product.image} alt={product.name} className="w-full h-48 object-cover group-hover:scale-105 transition duration-300" />
                  <span className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded font-bold z-10">
                    {product.discount}% OFF
                  </span>
                  {product.isNew && (
                    <span className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded font-bold z-10">
                      NEW
                    </span>
                  )}
                  {product.isFeatured && (
                    <span className="absolute bottom-2 left-2 bg-yellow-500 text-white text-xs px-2 py-1 rounded font-bold z-10">
                      FEATURED
                    </span>
                  )}
                  <button
                    onClick={() => toggleWishlist(product.id)}
                    className="absolute bottom-2 right-2 bg-white rounded-full p-1.5 shadow-md hover:scale-110 transition z-10"
                  >
                    {wishlist.includes(product.id) ? (
                      <HeartSolidIcon className="w-5 h-5 text-red-500" />
                    ) : (
                      <HeartIcon className="w-5 h-5 text-gray-400" />
                    )}
                  </button>
                </div>
                <div className="p-3">
                  <h3 className="font-semibold text-sm line-clamp-2 h-10">{product.name}</h3>
                  <p className="text-xs text-gray-500 mt-1">{product.brand}</p>
                  <div className="flex items-center gap-1 mt-2">
                    <span className="bg-green-600 text-white text-xs px-1 rounded flex items-center gap-0.5">
                      {product.rating}★
                    </span>
                    <span className="text-xs text-gray-500">({product.reviews})</span>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-lg font-bold text-gray-800">₹{product.price}</span>
                    <span className="text-xs text-gray-400 line-through">₹{product.originalPrice}</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-green-600 mb-3 mt-1">
                    <TruckIcon className="w-3 h-3" />
                    <span>Free Delivery</span>
                  </div>
                  <button
                    onClick={() => addToCartBackend(product)}
                    disabled={isLoading}
                    className="w-full mt-2 bg-blue-600 text-white py-1.5 rounded text-sm font-semibold hover:bg-blue-700 transition disabled:opacity-50"
                  >
                    {isLoading ? "Adding..." : "Add to Cart"}
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-lg">
            <FaceSmileIcon className="w-24 h-24 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No fashion products found</h3>
            <p className="text-gray-400">Try adjusting your filters or search</p>
            <button onClick={clearFilters} className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
              Clear Filters
            </button>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            <div>
              <h3 className="font-semibold mb-3">FASHION</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><button className="hover:text-white">Men's Clothing</button></li>
                <li><button className="hover:text-white">Women's Clothing</button></li>
                <li><button className="hover:text-white">Kids' Wear</button></li>
                <li><button className="hover:text-white">Accessories</button></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-3">HELP</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><button className="hover:text-white">Size Guide</button></li>
                <li><button className="hover:text-white">Returns</button></li>
                <li><button className="hover:text-white">Shipping</button></li>
                <li><button className="hover:text-white">FAQ</button></li>
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
              <h3 className="font-semibold mb-3">SOCIAL</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><button className="hover:text-white">Instagram</button></li>
                <li><button className="hover:text-white">Facebook</button></li>
                <li><button className="hover:text-white">Twitter</button></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-3">STORE</h3>
              <p className="text-sm text-gray-400">ShopHub Fashion Store, Bangalore</p>
              <p className="text-sm text-gray-400 mt-2">📞 1800-123-4567</p>
              <p className="text-sm text-gray-400">✉️ fashion@shophub.com</p>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-6 text-center text-sm text-gray-400">
            <p>&copy; 2024 ShopHub Fashion. All rights reserved. | 50+ Products | Best Deals Online</p>
          </div>
        </div>
      </footer>
    </div>
  );
}