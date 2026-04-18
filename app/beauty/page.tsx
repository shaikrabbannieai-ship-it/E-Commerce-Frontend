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
  SparklesIcon,
  GiftIcon,
  FaceSmileIcon,
  PaintBrushIcon,
  ScissorsIcon,
  SunIcon,
  MoonIcon,
  BoltIcon,
} from "@heroicons/react/24/outline";
import { HeartIcon as HeartSolidIcon } from "@heroicons/react/24/solid";

// Navigation Categories
const navCategories = [
  "NEW LAUNCHES",
  "MAKEUP",
  "SKINCARE",
  "HAIRCARE",
  "FRAGRANCES",
  "LUXURY",
  "AYURVEDA",
  "ORGANIC",
  "MEN'S GROOMING",
  "BATH & BODY",
  "TOOLS & BRUSHES",
];

// Hero Banner Slides
const heroBanners = [
  {
    id: 1,
    title: "Glow Like Never Before",
    subtitle: "Min. 50% Off",
    description: "Premium skincare essentials",
    image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=1600",
    color: "from-pink-500 to-rose-600",
    buttonText: "Shop Now →",
  },
  {
    id: 2,
    title: "Luxury Makeup Collection",
    subtitle: "Up to 60% Off",
    description: "Huda Beauty, MAC, Nykaa & more",
    image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=1600",
    color: "from-purple-600 to-indigo-600",
    buttonText: "Explore Makeup →",
  },
  {
    id: 3,
    title: "Haircare Sale",
    subtitle: "Min. 40% Off",
    description: "L'Oreal, Olaplex, Matrix",
    image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=1600",
    color: "from-blue-500 to-cyan-600",
    buttonText: "Shop Haircare →",
  },
  {
    id: 4,
    title: "Fragrance Fest",
    subtitle: "Up to 55% Off",
    description: "Premium perfumes for every occasion",
    image: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=1600",
    color: "from-amber-500 to-orange-600",
    buttonText: "Shop Fragrances →",
  },
  {
    id: 5,
    title: "Men's Grooming",
    subtitle: "Min. 45% Off",
    description: "Beard, shaving & skincare for men",
    image: "https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=1600",
    color: "from-green-600 to-teal-600",
    buttonText: "Shop Now →",
  },
];

// Category Grid
const categoryGrid = [
  { name: "Makeup", icon: "💄", offers: "Min. 50% Off", image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=200" },
  { name: "Skincare", icon: "✨", offers: "Min. 45% Off", image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=200" },
  { name: "Haircare", icon: "💇", offers: "Min. 40% Off", image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=200" },
  { name: "Fragrances", icon: "🌸", offers: "Min. 55% Off", image: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=200" },
  { name: "Luxury", icon: "👑", offers: "Min. 30% Off", image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=200" },
  { name: "Ayurveda", icon: "🌿", offers: "Min. 35% Off", image: "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=200" },
  { name: "Organic", icon: "🍃", offers: "Min. 40% Off", image: "https://images.unsplash.com/photo-1556229010-6c3f2c9ca5f8?w=200" },
  { name: "Men's Grooming", icon: "🧔", offers: "Min. 45% Off", image: "https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=200" },
  { name: "Bath & Body", icon: "🛀", offers: "Min. 50% Off", image: "https://images.unsplash.com/photo-1600857544200-b2f666a9a2ec?w=200" },
  { name: "Tools & Brushes", icon: "🖌️", offers: "Min. 35% Off", image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=200" },
];

// Offer Banners
const offerBanners = [
  { title: "Makeup Revolution", discount: "Min. 50% Off", subtitle: "Lipsticks, foundations & more", bgColor: "bg-gradient-to-r from-pink-600 to-rose-600" },
  { title: "Skincare Essentials", discount: "Buy 2 Get 1 Free", subtitle: "Serums, moisturizers, cleansers", bgColor: "bg-gradient-to-r from-emerald-600 to-teal-600" },
  { title: "Haircare Deals", discount: "Min. 40% Off", subtitle: "Shampoos, conditioners, oils", bgColor: "bg-gradient-to-r from-blue-600 to-cyan-600" },
  { title: "Luxury Collection", discount: "Up to 60% Off", subtitle: "Premium brands", bgColor: "bg-gradient-to-r from-purple-600 to-indigo-600" },
];

// All Products for Search
const allProducts = [
  // Makeup - Lipsticks
  { id: 1, name: "Matte Lipstick - Ruby Red", price: 599, originalPrice: 1299, discount: 54, rating: 4.5, reviews: 2345, image: "https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=300", brand: "Nykaa", category: "Makeup", isNew: true, isFeatured: true },
  { id: 2, name: "Liquid Lipstick - Nude Pink", price: 499, originalPrice: 999, discount: 50, rating: 4.4, reviews: 1876, image: "https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=300", brand: "Sugar", category: "Makeup" },
  { id: 3, name: "Lip Gloss Set (3 pcs)", price: 899, originalPrice: 2499, discount: 64, rating: 4.6, reviews: 3456, image: "https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=300", brand: "Plum", category: "Makeup", isFeatured: true },
  { id: 4, name: "Full Coverage Foundation", price: 899, originalPrice: 1999, discount: 55, rating: 4.5, reviews: 1234, image: "https://images.unsplash.com/photo-1631730361322-3a2f6b2566db?w=300", brand: "Lakme", category: "Makeup" },
  { id: 5, name: "BB Cream - SPF 30", price: 399, originalPrice: 799, discount: 50, rating: 4.3, reviews: 2345, image: "https://images.unsplash.com/photo-1631730361322-3a2f6b2566db?w=300", brand: "Ponds", category: "Makeup", isNew: true },
  { id: 6, name: "Eyeshadow Palette - 12 Colors", price: 1299, originalPrice: 3499, discount: 63, rating: 4.7, reviews: 876, image: "https://images.unsplash.com/photo-1512499610588-4494ec1a9f24?w=300", brand: "Huda Beauty", category: "Makeup", isFeatured: true, isNew: true },
  { id: 7, name: "Waterproof Mascara", price: 349, originalPrice: 699, discount: 50, rating: 4.4, reviews: 3456, image: "https://images.unsplash.com/photo-1512499610588-4494ec1a9f24?w=300", brand: "Maybelline", category: "Makeup" },
  { id: 8, name: "Liquid Eyeliner", price: 299, originalPrice: 599, discount: 50, rating: 4.3, reviews: 2345, image: "https://images.unsplash.com/photo-1512499610588-4494ec1a9f24?w=300", brand: "Colorbar", category: "Makeup" },
  { id: 9, name: "Vitamin C Serum", price: 799, originalPrice: 1999, discount: 60, rating: 4.6, reviews: 4567, image: "https://images.unsplash.com/photo-1556229010-6c3f2c9ca5f8?w=300", brand: "Plum", category: "Skincare", isFeatured: true },
  { id: 10, name: "Hyaluronic Acid Moisturizer", price: 649, originalPrice: 1499, discount: 57, rating: 4.5, reviews: 3456, image: "https://images.unsplash.com/photo-1556229010-6c3f2c9ca5f8?w=300", brand: "Cetaphil", category: "Skincare" },
  { id: 11, name: "Facial Cleanser - Gentle Foam", price: 399, originalPrice: 899, discount: 56, rating: 4.4, reviews: 2345, image: "https://images.unsplash.com/photo-1556229010-6c3f2c9ca5f8?w=300", brand: "Simple", category: "Skincare", isNew: true },
  { id: 12, name: "Retinol Night Cream", price: 899, originalPrice: 2499, discount: 64, rating: 4.7, reviews: 1234, image: "https://images.unsplash.com/photo-1556229010-6c3f2c9ca5f8?w=300", brand: "The Ordinary", category: "Skincare", isFeatured: true },
  { id: 13, name: "Sunscreen SPF 50", price: 499, originalPrice: 999, discount: 50, rating: 4.5, reviews: 5678, image: "https://images.unsplash.com/photo-1556229010-6c3f2c9ca5f8?w=300", brand: "Neutrogena", category: "Skincare" },
  { id: 14, name: "Keratin Shampoo", price: 499, originalPrice: 999, discount: 50, rating: 4.4, reviews: 2345, image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=300", brand: "L'Oreal", category: "Haircare" },
  { id: 15, name: "Hair Mask - Repair & Shine", price: 699, originalPrice: 1499, discount: 53, rating: 4.6, reviews: 1876, image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=300", brand: "Olaplex", category: "Haircare", isFeatured: true },
  { id: 16, name: "Argan Oil Hair Serum", price: 399, originalPrice: 899, discount: 56, rating: 4.5, reviews: 3456, image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=300", brand: "Mamaearth", category: "Haircare", isNew: true },
  { id: 17, name: "Anti-Dandruff Shampoo", price: 299, originalPrice: 599, discount: 50, rating: 4.3, reviews: 4567, image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=300", brand: "Head & Shoulders", category: "Haircare" },
  { id: 18, name: "Women's Perfume - Bloom", price: 1499, originalPrice: 3999, discount: 63, rating: 4.7, reviews: 1234, image: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=300", brand: "Zara", category: "Fragrances", isFeatured: true },
  { id: 19, name: "Men's Cologne - Sport", price: 1299, originalPrice: 3499, discount: 63, rating: 4.6, reviews: 987, image: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=300", brand: "Davidoff", category: "Fragrances", isNew: true },
  { id: 20, name: "Unisex Perfume - Oud", price: 1999, originalPrice: 5999, discount: 67, rating: 4.8, reviews: 654, image: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=300", brand: "Ajmal", category: "Fragrances" },
  { id: 21, name: "Luxury Skincare Set", price: 4999, originalPrice: 12999, discount: 62, rating: 4.9, reviews: 432, image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=300", brand: "Estee Lauder", category: "Luxury", isFeatured: true },
  { id: 22, name: "Gold Infused Serum", price: 2999, originalPrice: 7999, discount: 63, rating: 4.8, reviews: 321, image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=300", brand: "Lancome", category: "Luxury", isNew: true },
  { id: 23, name: "Ayurvedic Face Pack", price: 299, originalPrice: 699, discount: 57, rating: 4.4, reviews: 2345, image: "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=300", brand: "Biotique", category: "Ayurveda" },
  { id: 24, name: "Herbal Hair Oil", price: 399, originalPrice: 899, discount: 56, rating: 4.5, reviews: 1876, image: "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=300", brand: "Kama Ayurveda", category: "Ayurveda", isFeatured: true },
  { id: 25, name: "Beard Oil & Balm Set", price: 799, originalPrice: 1999, discount: 60, rating: 4.6, reviews: 1234, image: "https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=300", brand: "The Man Company", category: "Men's Grooming", isNew: true },
  { id: 26, name: "Men's Face Wash", price: 299, originalPrice: 599, discount: 50, rating: 4.4, reviews: 2345, image: "https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=300", brand: "Nivea Men", category: "Men's Grooming" },
  { id: 27, name: "Shaving Kit Premium", price: 1299, originalPrice: 2999, discount: 57, rating: 4.7, reviews: 876, image: "https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=300", brand: "Gillette", category: "Men's Grooming", isFeatured: true },
  { id: 28, name: "Body Lotion - Shea Butter", price: 349, originalPrice: 799, discount: 56, rating: 4.4, reviews: 3456, image: "https://images.unsplash.com/photo-1600857544200-b2f666a9a2ec?w=300", brand: "Vaseline", category: "Bath & Body" },
  { id: 29, name: "Shower Gel Set (3 pcs)", price: 599, originalPrice: 1499, discount: 60, rating: 4.5, reviews: 2345, image: "https://images.unsplash.com/photo-1600857544200-b2f666a9a2ec?w=300", brand: "Bath & Body Works", category: "Bath & Body", isFeatured: true },
  { id: 30, name: "Makeup Brush Set (8 pcs)", price: 999, originalPrice: 2999, discount: 67, rating: 4.6, reviews: 1876, image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=300", brand: "Morphe", category: "Tools & Brushes", isNew: true },
  { id: 31, name: "Beauty Blender", price: 399, originalPrice: 899, discount: 56, rating: 4.5, reviews: 3456, image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=300", brand: "Real Techniques", category: "Tools & Brushes" },
];

// Products for sections
const products = {
  popular: allProducts.slice(0, 6),
  deals: allProducts.slice(6, 10),
  offers: allProducts.slice(10, 12),
};

// Flash Sale Items
const flashSaleItems = [
  { id: 101, name: "Lipstick Combo (5 pcs)", price: 999, originalPrice: 3999, discount: 75, image: "https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=300", brand: "Nykaa" },
  { id: 102, name: "Skincare Routine Set", price: 1499, originalPrice: 5999, discount: 75, image: "https://images.unsplash.com/photo-1556229010-6c3f2c9ca5f8?w=300", brand: "Plum" },
  { id: 103, name: "Perfume Gift Set", price: 1999, originalPrice: 7999, discount: 75, image: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=300", brand: "Zara" },
  { id: 104, name: "Haircare Bundle", price: 999, originalPrice: 3999, discount: 75, image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=300", brand: "L'Oreal" },
];

// Filter Options
const filterOptions = {
  categories: ["All", "Makeup", "Skincare", "Haircare", "Fragrances", "Luxury", "Ayurveda", "Men's Grooming", "Bath & Body", "Tools & Brushes"],
  brands: ["Nykaa", "Plum", "Lakme", "Maybelline", "L'Oreal", "Cetaphil", "The Ordinary", "Huda Beauty", "Estee Lauder", "Biotique"],
  priceRanges: [
    { label: "Under ₹500", min: 0, max: 500 },
    { label: "₹500 - ₹1000", min: 500, max: 1000 },
    { label: "₹1000 - ₹2000", min: 1000, max: 2000 },
    { label: "Above ₹2000", min: 2000, max: Infinity },
  ],
};

export default function BeautyPage() {
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
    const saved = localStorage.getItem("beautyRecentSearches");
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, []);

  // Save recent search
  const saveRecentSearch = (query: string) => {
    if (!query.trim()) return;
    const updated = [query, ...recentSearches.filter(s => s !== query)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem("beautyRecentSearches", JSON.stringify(updated));
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
    router.push(`/search?q=${encodeURIComponent(searchQuery)}&category=beauty`);
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
    router.push(`/search?q=${encodeURIComponent(trend)}&category=beauty`);
  };

  const clearSearch = () => {
    setSearchQuery("");
    setSearchResults([]);
    setShowSearchResults(false);
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem("beautyRecentSearches");
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
      const range = filterOptions.priceRanges.find(r => r.label === selectedPriceRange);
      if (range && (product.price < range.min || product.price > range.max)) return false;
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
      toast.success(`${product.name} added to cart!`, { icon: "💄" });
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
      <div className="bg-pink-600 text-white text-xs py-1.5 px-4 text-center hidden md:block">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex gap-6">
            <span>💄 Free Shipping on orders ₹999+</span>
            <span>✨ 15 Days Return Policy</span>
            <span>🔒 Secure Payments</span>
            <span>💳 No Cost EMI Available</span>
          </div>
          <div className="flex gap-4">
            <button className="hover:text-pink-200">Sell on ShopHub</button>
            <button className="hover:text-pink-200">Download App</button>
          </div>
        </div>
      </div>

      {/* Header */}
      <header className={`sticky top-0 z-50 bg-white transition-shadow ${isScrolled ? "shadow-md" : ""}`}>
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-3 gap-4">
            <motion.div whileHover={{ scale: 1.05 }} className="flex items-center gap-1 cursor-pointer" onClick={() => router.push("/")}>
              <ShoppingBagIcon className="w-7 h-7 text-pink-600" />
              <span className="text-xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">ShopHub Beauty</span>
            </motion.div>

            {/* Search Bar with Flipkart-style Realtime Search */}
            <div ref={searchRef} className="flex-1 max-w-2xl relative">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search for makeup, skincare, haircare & more..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setShowSearchResults(true);
                    setSelectedIndex(-1);
                  }}
                  onFocus={() => setShowSearchResults(true)}
                  onKeyDown={handleKeyDown}
                  className="w-full px-12 py-2.5 bg-gray-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 focus:bg-white transition-all"
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
                        <ArrowPathIcon className="w-8 h-8 text-pink-500 animate-spin mx-auto mb-2" />
                        <p className="text-gray-500">Searching beauty products...</p>
                      </div>
                    )}

                    {/* Recent Searches */}
                    {!searchQuery && recentSearches.length > 0 && (
                      <div className="p-3">
                        <div className="flex justify-between items-center mb-2 px-2">
                          <span className="text-xs font-semibold text-gray-500">RECENT SEARCHES</span>
                          <button onClick={clearRecentSearches} className="text-xs text-pink-600 hover:underline">Clear All</button>
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
                          <span className="text-xs font-semibold text-gray-500">TRENDING IN BEAUTY 🔥</span>
                        </div>
                        {["Lipstick", "Vitamin C Serum", "Shampoo", "Perfume", "Sunscreen", "Hair Oil"].map((trend, idx) => (
                          <div
                            key={idx}
                            onClick={() => handleTrendingClick(trend)}
                            className="flex items-center gap-3 px-3 py-2 hover:bg-gray-50 rounded-lg cursor-pointer transition"
                          >
                            <span className="text-sm text-gray-700">{trend}</span>
                            <span className="text-xs text-pink-500">Trending</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Search Results */}
                    {searchQuery && searchResults.length > 0 && (
                      <>
                        <div className="px-3 py-2 text-xs text-gray-500 border-b">
                          Found {searchResults.length} beauty products for "{searchQuery}"
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
                                  <span className="text-sm font-bold text-pink-600">₹{product.price.toLocaleString()}</span>
                                  <span className="text-xs text-gray-400 line-through">₹{product.originalPrice.toLocaleString()}</span>
                                  <span className="text-xs text-green-600">{product.discount}% off</span>
                                </div>
                              </div>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  addToCartBackend(product);
                                }}
                                className="px-3 py-1 bg-pink-600 text-white text-xs rounded hover:bg-pink-700 transition whitespace-nowrap"
                              >
                                Add to Cart
                              </button>
                            </div>
                          ))}
                        </div>
                        <div className="p-3 border-t text-center">
                          <button
                            onClick={handleSearchSubmit}
                            className="text-sm text-pink-600 hover:underline"
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
                        <h3 className="font-semibold text-gray-800 mb-1">No beauty products found</h3>
                        <p className="text-sm text-gray-500">
                          We couldn't find any beauty products matching "{searchQuery}"
                        </p>
                        <button
                          onClick={handleSearchSubmit}
                          className="mt-4 text-pink-600 text-sm hover:underline"
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
                <button onClick={() => router.push("/login")} className="bg-pink-600 text-white px-6 py-2 rounded font-medium hover:bg-pink-700">
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
                  <span className="absolute -top-2 -right-2 bg-pink-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Rest of the component remains the same - Navigation Categories, Hero Slider, Flash Sale, Category Grid, Offer Banners, Filter Bar, Products Grid, Footer */}
      {/* ... (keep all the existing JSX from your original Beauty page from here) ... */}
      
      {/* Navigation Categories */}
      <div className="bg-white border-b sticky top-[73px] z-40 overflow-x-auto shadow-sm">
        <div className="container mx-auto">
          <div className="flex gap-4 px-4 py-3 text-sm font-medium whitespace-nowrap">
            {navCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveNav(cat)}
                className={`${activeNav === cat ? "text-pink-600 border-b-2 border-pink-600" : "text-gray-700 hover:text-pink-600"} pb-2 transition px-2`}
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
        <div className="bg-gradient-to-r from-pink-500 to-rose-600 rounded-lg p-6 shadow-lg">
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
                    <button onClick={() => addToCartBackend(item)} className="w-full mt-2 bg-pink-600 text-white py-1.5 rounded text-sm font-semibold hover:bg-pink-700 transition">
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
            1024: { slidesPerView: 10 },
          }}
        >
          {categoryGrid.map((cat, idx) => (
            <SwiperSlide key={idx}>
              <motion.div whileHover={{ y: -5 }} className="cursor-pointer group" onClick={() => setSelectedCategory(cat.name)}>
                <div className="bg-white rounded-lg p-3 text-center shadow-sm hover:shadow-md transition">
                  <div className="text-3xl mb-2">{cat.icon}</div>
                  <h3 className="text-xs font-semibold">{cat.name}</h3>
                  <p className="text-xs text-pink-500 font-medium">{cat.offers}</p>
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
                {filterOptions.categories.slice(0, 6).map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1 text-sm rounded-full whitespace-nowrap ${selectedCategory === cat ? "bg-pink-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
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
                className="border rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
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
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <h4 className="font-semibold mb-2">Category</h4>
                    {filterOptions.categories.map(cat => (
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
                    {filterOptions.priceRanges.map(range => (
                      <label key={range.label} className="flex items-center gap-2 text-sm py-1">
                        <input 
                          type="radio" 
                          name="price" 
                          checked={selectedPriceRange === range.label}
                          onChange={() => setSelectedPriceRange(range.label)}
                          className="rounded" 
                        />
                        {range.label}
                      </label>
                    ))}
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Brand</h4>
                    {filterOptions.brands.slice(0, 6).map(brand => (
                      <label key={brand} className="flex items-center gap-2 text-sm py-1">
                        <input type="checkbox" className="rounded" />
                        {brand}
                      </label>
                    ))}
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Rating</h4>
                    {[4, 3, 2].map(rating => (
                      <label key={rating} className="flex items-center gap-2 text-sm py-1">
                        <input type="checkbox" className="rounded" />
                        <div className="flex text-yellow-400">
                          {[...Array(rating)].map((_, i) => (
                            <StarIcon key={i} className="w-3 h-3 fill-current" />
                          ))}
                          {rating < 5 && <span className="text-gray-400 ml-1">+</span>}
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
                <div className="flex gap-2 mt-4 pt-2">
                  <button className="px-4 py-1.5 bg-pink-600 text-white rounded text-sm">Apply Filters</button>
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
                    className="w-full mt-2 bg-pink-600 text-white py-1.5 rounded text-sm font-semibold hover:bg-pink-700 transition disabled:opacity-50"
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
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No beauty products found</h3>
            <p className="text-gray-400">Try adjusting your filters or search</p>
            <button onClick={clearFilters} className="mt-4 bg-pink-600 text-white px-6 py-2 rounded-lg hover:bg-pink-700">
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
              <h3 className="font-semibold mb-3">BEAUTY</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><button className="hover:text-white">Makeup</button></li>
                <li><button className="hover:text-white">Skincare</button></li>
                <li><button className="hover:text-white">Haircare</button></li>
                <li><button className="hover:text-white">Fragrances</button></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-3">HELP</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><button className="hover:text-white">Beauty Tips</button></li>
                <li><button className="hover:text-white">Skin Quiz</button></li>
                <li><button className="hover:text-white">Returns</button></li>
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
                <li><button className="hover:text-white">YouTube</button></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-3">STORE</h3>
              <p className="text-sm text-gray-400">ShopHub Beauty Store, Bangalore</p>
              <p className="text-sm text-gray-400 mt-2">📞 1800-123-4567</p>
              <p className="text-sm text-gray-400">✉️ beauty@shophub.com</p>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-6 text-center text-sm text-gray-400">
            <p>&copy; 2024 ShopHub Beauty. All rights reserved. | Glow with confidence ✨</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
