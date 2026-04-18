"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay, EffectFade } from "swiper/modules";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";

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
  ShieldCheckIcon,
  CreditCardIcon,
  BoltIcon,
  ClockIcon,
  FunnelIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { HeartIcon as HeartSolidIcon } from "@heroicons/react/24/solid";

// Navigation Categories
const navCategories = [
  "FRUITS",
  "VEGETABLES",
  "DAIRY",
  "SNACKS",
  "BEVERAGES",
  "ORGANIC",
  "SPICES",
  "BAKERY",
  "HOUSEHOLD",
  "STAPLES",
];

// Hero Banners with 4K Images
const heroBanners = [
  {
    id: 1,
    title: "Fresh Vegetables",
    subtitle: "Up to 50% Off",
    description: "Farm fresh daily | Free Delivery",
    image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=1600",
    color: "from-green-600 to-emerald-700",
    buttonText: "Shop Now →",
  },
  {
    id: 2,
    title: "Organic Staples",
    subtitle: "Min. 30% Off",
    description: "Pure & Chemical-free | Certified Organic",
    image: "https://images.unsplash.com/photo-1579113800032-c38bd7635818?w=1600",
    color: "from-amber-600 to-orange-700",
    buttonText: "Explore Collection →",
  },
  {
    id: 3,
    title: "Dairy Delights",
    subtitle: "Up to 25% Off",
    description: "Fresh milk, cheese & more",
    image: "https://images.unsplash.com/photo-1628088062854-d1870b4553da?w=1600",
    color: "from-blue-600 to-cyan-700",
    buttonText: "Shop Now →",
  },
  {
    id: 4,
    title: "Snacks & Beverages",
    subtitle: "Min. 40% Off",
    description: "Quick bites & drinks | Party Ready",
    image: "https://images.unsplash.com/photo-1600180758890-6b94519a8ba6?w=1600",
    color: "from-red-600 to-pink-700",
    buttonText: "Grab Deals →",
  },
  {
    id: 5,
    title: "Fresh Fruits",
    subtitle: "Up to 45% Off",
    description: "Juicy & Fresh | Direct from Farm",
    image: "https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=1600",
    color: "from-orange-600 to-red-700",
    buttonText: "Shop Now →",
  },
];

// Category Grid
const categoryGrid = [
  { name: "Fruits", icon: "🍎", offers: "Min. 30% Off", image: "https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=400" },
  { name: "Vegetables", icon: "🥬", offers: "Min. 40% Off", image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400" },
  { name: "Dairy", icon: "🥛", offers: "Min. 20% Off", image: "https://images.unsplash.com/photo-1628088062854-d1870b4553da?w=400" },
  { name: "Snacks", icon: "🍿", offers: "Min. 35% Off", image: "https://images.unsplash.com/photo-1600180758890-6b94519a8ba6?w=400" },
  { name: "Beverages", icon: "🥤", offers: "Min. 25% Off", image: "https://images.unsplash.com/photo-1527960471264-932b39eb81ae?w=400" },
  { name: "Organic", icon: "🌿", offers: "Min. 30% Off", image: "https://images.unsplash.com/photo-1579113800032-c38bd7635818?w=400" },
  { name: "Spices", icon: "🌶️", offers: "Min. 20% Off", image: "https://images.unsplash.com/photo-1532336414038-cf19250c0dbe?w=400" },
  { name: "Breakfast", icon: "🥣", offers: "Min. 25% Off", image: "https://images.unsplash.com/photo-1517438476313-10d79c077131?w=400" },
  { name: "Bakery", icon: "🍞", offers: "Min. 15% Off", image: "https://images.unsplash.com/photo-1509440159596-0249085222d9?w=400" },
  { name: "Household", icon: "🧹", offers: "Min. 30% Off", image: "https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=400" },
];

// Flash Sale Items
const flashSaleItems = [
  { id: 101, name: "Fresh Fruits Combo", price: 299, originalPrice: 599, discount: 50, image: "https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=400", brand: "FreshFarm", unit: "5 items" },
  { id: 102, name: "Organic Vegetables Box", price: 399, originalPrice: 799, discount: 50, image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400", brand: "GreenFields", unit: "4 kg" },
  { id: 103, name: "Dairy Essentials Pack", price: 249, originalPrice: 499, discount: 50, image: "https://images.unsplash.com/photo-1628088062854-d1870b4553da?w=400", brand: "Amul", unit: "6 items" },
  { id: 104, name: "Snacks Party Pack", price: 499, originalPrice: 999, discount: 50, image: "https://images.unsplash.com/photo-1600180758890-6b94519a8ba6?w=400", brand: "Lays", unit: "10 packs" },
  { id: 105, name: "Beverages Combo", price: 399, originalPrice: 799, discount: 50, image: "https://images.unsplash.com/photo-1527960471264-932b39eb81ae?w=400", brand: "Coca-Cola", unit: "12 cans" },
];

// 25+ Grocery Products with Different Images
const groceryProducts = [
  // Fruits (5 items)
  { id: 1, name: "Organic Apples", price: 199, originalPrice: 299, discount: 33, rating: 4.8, reviews: 2345, image: "https://images.unsplash.com/photo-1570913149827-d2ac84ab3f9a?w=400", brand: "FreshFarm", category: "Fruits", unit: "1 kg", isFeatured: true },
  { id: 2, name: "Fresh Strawberries", price: 149, originalPrice: 249, discount: 40, rating: 4.7, reviews: 1876, image: "https://images.unsplash.com/photo-1464965911861-746a04b4bca8?w=400", brand: "BerryFresh", category: "Fruits", unit: "500g" },
  { id: 3, name: "Sweet Mangoes", price: 299, originalPrice: 499, discount: 40, rating: 4.9, reviews: 3456, image: "https://images.unsplash.com/photo-1553279768-865429fa0078?w=400", brand: "Alphonso", category: "Fruits", unit: "1 kg", isFeatured: true },
  { id: 4, name: "Fresh Oranges", price: 99, originalPrice: 149, discount: 34, rating: 4.6, reviews: 2341, image: "https://images.unsplash.com/photo-1547514701-42782101795e?w=400", brand: "CitrusFresh", category: "Fruits", unit: "500g" },
  { id: 5, name: "Red Seedless Grapes", price: 129, originalPrice: 199, discount: 35, rating: 4.7, reviews: 1876, image: "https://images.unsplash.com/photo-1537640538966-79f369143f8f?w=400", brand: "GrapeVine", category: "Fruits", unit: "500g" },

  // Vegetables (6 items)
  { id: 6, name: "Fresh Broccoli", price: 49, originalPrice: 79, discount: 38, rating: 4.6, reviews: 1876, image: "https://images.unsplash.com/photo-1584270354949-c26b0d5b4a0c?w=400", brand: "GreenFields", category: "Vegetables", unit: "500g" },
  { id: 7, name: "Organic Carrots", price: 59, originalPrice: 89, discount: 34, rating: 4.7, reviews: 2345, image: "https://images.unsplash.com/photo-1447175008436-054170c2e979?w=400", brand: "FreshFarm", category: "Vegetables", unit: "1 kg" },
  { id: 8, name: "Fresh Tomatoes", price: 39, originalPrice: 69, discount: 43, rating: 4.5, reviews: 3456, image: "https://images.unsplash.com/photo-1546470427-1c8a7a7a5b9e?w=400", brand: "FarmFresh", category: "Vegetables", unit: "1 kg" },
  { id: 9, name: "Green Capsicum", price: 49, originalPrice: 79, discount: 38, rating: 4.6, reviews: 1234, image: "https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?w=400", brand: "VeggieFresh", category: "Vegetables", unit: "500g" },
  { id: 10, name: "Fresh Cauliflower", price: 45, originalPrice: 75, discount: 40, rating: 4.5, reviews: 987, image: "https://images.unsplash.com/photo-1568584711075-3d021a7c3ca3?w=400", brand: "GreenFields", category: "Vegetables", unit: "1 pc" },
  { id: 11, name: "Spinach Leaves", price: 35, originalPrice: 55, discount: 36, rating: 4.6, reviews: 1456, image: "https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400", brand: "FreshLeaf", category: "Vegetables", unit: "250g" },

  // Dairy (4 items)
  { id: 12, name: "Amul Fresh Milk", price: 60, originalPrice: 75, discount: 20, rating: 4.9, reviews: 3456, image: "https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400", brand: "Amul", category: "Dairy", unit: "1L", isFeatured: true },
  { id: 13, name: "Greek Yogurt", price: 89, originalPrice: 129, discount: 31, rating: 4.8, reviews: 2345, image: "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400", brand: "Epigamia", category: "Dairy", unit: "400g" },
  { id: 14, name: "Cheddar Cheese", price: 199, originalPrice: 299, discount: 33, rating: 4.8, reviews: 1876, image: "https://images.unsplash.com/photo-1452195100486-9cc805987862?w=400", brand: "Amul", category: "Dairy", unit: "200g" },
  { id: 15, name: "Butter", price: 49, originalPrice: 69, discount: 29, rating: 4.7, reviews: 2341, image: "https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=400", brand: "Amul", category: "Dairy", unit: "100g" },

  // Snacks (4 items)
  { id: 16, name: "Lays Chips", price: 20, originalPrice: 30, discount: 33, rating: 4.5, reviews: 5678, image: "https://images.unsplash.com/photo-1566478989037-eec170495d5a?w=400", brand: "Lays", category: "Snacks", unit: "50g" },
  { id: 17, name: "Doritos Nachos", price: 49, originalPrice: 79, discount: 38, rating: 4.6, reviews: 3456, image: "https://images.unsplash.com/photo-1599490659213-e2b9527bd087?w=400", brand: "Doritos", category: "Snacks", unit: "100g" },
  { id: 18, name: "Oreo Biscuits", price: 35, originalPrice: 55, discount: 36, rating: 4.7, reviews: 4567, image: "https://images.unsplash.com/photo-1580822184713-fc5400e7fe10?w=400", brand: "Oreo", category: "Snacks", unit: "150g" },
  { id: 19, name: "Healthy Muesli", price: 299, originalPrice: 499, discount: 40, rating: 4.7, reviews: 2345, image: "https://images.unsplash.com/photo-1517438476313-10d79c077131?w=400", brand: "Kelloggs", category: "Breakfast", unit: "500g", isFeatured: true },

  // Beverages (4 items)
  { id: 20, name: "Coca-Cola", price: 40, originalPrice: 60, discount: 33, rating: 4.5, reviews: 5678, image: "https://images.unsplash.com/photo-1554866585-cd94860890b7?w=400", brand: "Coca-Cola", category: "Beverages", unit: "2L" },
  { id: 21, name: "Real Fruit Juice", price: 99, originalPrice: 149, discount: 34, rating: 4.6, reviews: 3456, image: "https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400", brand: "Real", category: "Beverages", unit: "1L" },
  { id: 22, name: "Red Bull Energy", price: 99, originalPrice: 149, discount: 34, rating: 4.5, reviews: 2345, image: "https://images.unsplash.com/photo-1583832879404-5a51b2f72fb8?w=400", brand: "Red Bull", category: "Beverages", unit: "250ml" },
  { id: 23, name: "Nescafe Coffee", price: 199, originalPrice: 299, discount: 33, rating: 4.8, reviews: 4567, image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=400", brand: "Nescafe", category: "Beverages", unit: "100g" },

  // Organic & Spices (4 items)
  { id: 24, name: "Organic Honey", price: 399, originalPrice: 599, discount: 33, rating: 4.8, reviews: 987, image: "https://images.unsplash.com/photo-1587049352847-4a222e784d38?w=400", brand: "Dabur", category: "Organic", unit: "500g" },
  { id: 25, name: "Turmeric Powder", price: 89, originalPrice: 149, discount: 40, rating: 4.6, reviews: 2345, image: "https://images.unsplash.com/photo-1615485500834-bc10199bc727?w=400", brand: "MDH", category: "Spices", unit: "200g" },
  { id: 26, name: "Red Chilli Powder", price: 79, originalPrice: 129, discount: 39, rating: 4.6, reviews: 1876, image: "https://images.unsplash.com/photo-1532336414038-cf19250c0dbe?w=400", brand: "Everest", category: "Spices", unit: "200g" },
  { id: 27, name: "Organic Basmati Rice", price: 899, originalPrice: 1299, discount: 31, rating: 4.7, reviews: 1234, image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400", brand: "India Gate", category: "Staples", unit: "5 kg", isFeatured: true },

  // Bakery & Household (4 items)
  { id: 28, name: "Fresh Bread", price: 35, originalPrice: 55, discount: 36, rating: 4.6, reviews: 3456, image: "https://images.unsplash.com/photo-1509440159596-0249085222d9?w=400", brand: "Britannia", category: "Bakery", unit: "400g" },
  { id: 29, name: "Cake Rusk", price: 49, originalPrice: 79, discount: 38, rating: 4.5, reviews: 2345, image: "https://images.unsplash.com/photo-1587668178277-295251f900ce?w=400", brand: "Parle", category: "Bakery", unit: "200g" },
  { id: 30, name: "Detergent Powder", price: 99, originalPrice: 149, discount: 34, rating: 4.5, reviews: 4567, image: "https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=400", brand: "Surf Excel", category: "Household", unit: "1 kg" },
  { id: 31, name: "Floor Cleaner", price: 149, originalPrice: 249, discount: 40, rating: 4.6, reviews: 3456, image: "https://images.unsplash.com/photo-1563453392212-326f5e854473?w=400", brand: "Harpic", category: "Household", unit: "1L" },
];

export default function GroceryPage() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const [userId, setUserId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [cartCount, setCartCount] = useState(0);
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [wishlist, setWishlist] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeNav, setActiveNav] = useState("FRUITS");
  const [timeLeft, setTimeLeft] = useState({ hours: 2, minutes: 30, seconds: 0 });
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState("featured");

  // Filter products by category
  const filteredProducts = groceryProducts.filter(product => 
    selectedCategory === "All" || product.category === selectedCategory
  );

  // Sort products
  const getSortedProducts = () => {
    let sorted = [...filteredProducts];
    switch(sortBy) {
      case "price-low": return sorted.sort((a, b) => a.price - b.price);
      case "price-high": return sorted.sort((a, b) => b.price - a.price);
      case "rating": return sorted.sort((a, b) => b.rating - a.rating);
      case "discount": return sorted.sort((a, b) => b.discount - a.discount);
      default: return sorted;
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
    if (savedWishlist) setWishlist(JSON.parse(savedWishlist));
    
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      const cart = JSON.parse(savedCart);
      setCartItems(cart);
      setCartCount(cart.length);
    }

    const handleScroll = () => setIsScrolled(window.scrollY > 100);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Timer for flash sale
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        else if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        else if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const fetchCartFromBackend = async () => {
    if (!userId) return;
    try {
      const response = await axios.get(`http://127.0.0.1:8000/cart/${userId}`);
      const cartItems = response.data.items.map((item: any) => ({
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
    }
  };

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
      toast.success(`${product.name} added to cart!`, { icon: "🥬" });
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error("Failed to add to cart");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleWishlist = async (product: any) => {
    if (!isLoggedIn) {
      toast.error("Please login to add to wishlist");
      router.push("/login");
      return;
    }

    const productId = product.id;

    if (wishlist.includes(productId)) {
      setWishlist(wishlist.filter(id => id !== productId));
      toast.success("Removed from wishlist");
      localStorage.setItem("wishlist", JSON.stringify(wishlist.filter(id => id !== productId)));
      try {
        await axios.delete(`http://127.0.0.1:8000/wishlist/${userId}/${productId}`);
      } catch (error) {}
    } else {
      setWishlist([...wishlist, productId]);
      toast.success("Added to wishlist");
      localStorage.setItem("wishlist", JSON.stringify([...wishlist, productId]));
      try {
        await axios.post("http://127.0.0.1:8000/wishlist/add", {
          user_id: parseInt(userId!),
          product_id: product.id,
          product_name: product.name,
          product_price: product.price,
          product_original_price: product.originalPrice,
          product_discount: product.discount,
          product_rating: product.rating,
          product_reviews: product.reviews,
          product_image: product.image,
          product_brand: product.brand,
          product_category: product.category
        });
      } catch (error) {}
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
    toast.success("Logged out successfully!");
    router.push("/login");
  };

  const clearFilters = () => {
    setSelectedCategory("All");
    setSortBy("featured");
    setSearchQuery("");
    toast.success("All filters cleared");
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Toaster position="top-right" />
      
      {/* Top Bar */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white text-xs py-1.5 px-4 text-center hidden md:block">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex gap-6">
            <span>🥬 Free Shipping on orders ₹499+</span>
            <span>🔄 7 Days Return Policy</span>
            <span>🔒 Secure Payments</span>
            <span>💳 No Cost EMI Available</span>
          </div>
          <div className="flex gap-4">
            <button className="hover:text-green-200">Sell on ShopHub</button>
            <button className="hover:text-green-200">Download App</button>
          </div>
        </div>
      </div>

      {/* Header */}
      <header className={`sticky top-0 z-50 bg-white transition-shadow ${isScrolled ? "shadow-md" : ""}`}>
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-3 gap-4">
            <motion.div whileHover={{ scale: 1.05 }} className="flex items-center gap-1 cursor-pointer" onClick={() => router.push("/")}>
              <ShoppingBagIcon className="w-7 h-7 text-green-600" />
              <span className="text-xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">ShopHub Grocery</span>
            </motion.div>

            <div className="flex-1 max-w-2xl">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search for fruits, vegetables, staples..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-12 py-2.5 bg-gray-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              </div>
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
                    <div className="border-t my-1"></div>
                    <button onClick={handleLogout} className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600">Logout</button>
                  </div>
                </div>
              ) : (
                <button onClick={() => router.push("/login")} className="bg-green-600 text-white px-6 py-2 rounded font-medium hover:bg-green-700">Login</button>
              )}
              
              <button onClick={() => router.push("/wishlist")} className="relative">
                <HeartIcon className="w-6 h-6 text-gray-600" />
                {wishlist.length > 0 && <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">{wishlist.length}</span>}
              </button>
              
              <button onClick={() => router.push("/cart")} className="relative">
                <ShoppingBagIcon className="w-6 h-6 text-gray-600" />
                {cartCount > 0 && <span className="absolute -top-2 -right-2 bg-green-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">{cartCount}</span>}
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
                className={`${activeNav === cat ? "text-green-600 border-b-2 border-green-600" : "text-gray-700 hover:text-green-600"} pb-2 transition px-2`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Hero Banner Slider with 4K Images */}
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
            <div className={`relative h-full bg-gradient-to-r ${banner.color}`}>
              <div className="absolute inset-0 bg-black/30"></div>
              <div className="absolute inset-0 bg-cover bg-center opacity-40" style={{ backgroundImage: `url(${banner.image})`, backgroundSize: 'cover', backgroundPosition: 'center' }}></div>
              <div className="relative h-full flex items-center justify-center text-center text-white">
                <div className="px-4">
                  <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-4xl md:text-6xl font-bold mb-4">{banner.title}</motion.h1>
                  <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-3xl md:text-4xl font-bold mb-2">{banner.subtitle}</motion.p>
                  <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="text-lg mb-6">{banner.description}</motion.p>
                  <motion.button initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-white text-gray-900 px-8 py-3 rounded-full font-semibold hover:shadow-lg transition transform hover:scale-105">
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
            breakpoints={{ 640: { slidesPerView: 3 }, 768: { slidesPerView: 4 }, 1024: { slidesPerView: 5 } }}
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
                    <p className="text-xs text-gray-500">{item.brand} | {item.unit}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-lg font-bold text-red-500">₹{item.price}</span>
                      <span className="text-xs text-gray-400 line-through">₹{item.originalPrice}</span>
                    </div>
                    <button onClick={() => addToCartBackend(item)} className="w-full mt-2 bg-green-600 text-white py-1.5 rounded text-sm font-semibold hover:bg-green-700 transition">
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
          breakpoints={{ 640: { slidesPerView: 6 }, 768: { slidesPerView: 8 }, 1024: { slidesPerView: 10 } }}
        >
          {categoryGrid.map((cat, idx) => (
            <SwiperSlide key={idx}>
              <motion.div whileHover={{ y: -5 }} className="cursor-pointer group" onClick={() => setSelectedCategory(cat.name)}>
                <div className="bg-white rounded-lg p-3 text-center shadow-sm hover:shadow-md transition">
                  <div className="text-3xl mb-2">{cat.icon}</div>
                  <h3 className="text-xs font-semibold">{cat.name}</h3>
                  <p className="text-xs text-green-500 font-medium">{cat.offers}</p>
                </div>
              </motion.div>
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
                {["All", "Fruits", "Vegetables", "Dairy", "Snacks", "Beverages"].map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1 text-sm rounded-full whitespace-nowrap ${selectedCategory === cat ? "bg-green-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
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
                className="border rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
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
          {showFilters && (
            <div className="mt-4 pt-4 border-t">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <h4 className="font-semibold mb-2">Category</h4>
                  {["All", "Fruits", "Vegetables", "Dairy", "Snacks", "Beverages", "Organic", "Spices", "Bakery", "Household"].map(cat => (
                    <label key={cat} className="flex items-center gap-2 text-sm py-1">
                      <input type="radio" name="category" checked={selectedCategory === cat} onChange={() => setSelectedCategory(cat)} className="rounded" />
                      {cat}
                    </label>
                  ))}
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Price Range</h4>
                  <label className="flex items-center gap-2 text-sm py-1"><input type="radio" name="price" /> Under ₹100</label>
                  <label className="flex items-center gap-2 text-sm py-1"><input type="radio" name="price" /> ₹100 - ₹300</label>
                  <label className="flex items-center gap-2 text-sm py-1"><input type="radio" name="price" /> ₹300 - ₹500</label>
                  <label className="flex items-center gap-2 text-sm py-1"><input type="radio" name="price" /> Above ₹500</label>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Brand</h4>
                  <label className="flex items-center gap-2 text-sm py-1"><input type="checkbox" /> Amul</label>
                  <label className="flex items-center gap-2 text-sm py-1"><input type="checkbox" /> FreshFarm</label>
                  <label className="flex items-center gap-2 text-sm py-1"><input type="checkbox" /> Lays</label>
                  <label className="flex items-center gap-2 text-sm py-1"><input type="checkbox" /> Coca-Cola</label>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Rating</h4>
                  <label className="flex items-center gap-2 text-sm py-1"><input type="checkbox" /> 4★ & above</label>
                  <label className="flex items-center gap-2 text-sm py-1"><input type="checkbox" /> 3★ & above</label>
                  <label className="flex items-center gap-2 text-sm py-1"><input type="checkbox" /> 2★ & above</label>
                </div>
              </div>
              <div className="flex gap-2 mt-4 pt-2">
                <button className="px-4 py-1.5 bg-green-600 text-white rounded text-sm">Apply Filters</button>
                <button onClick={clearFilters} className="px-4 py-1.5 border rounded text-sm">Clear All</button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Products Grid - 31+ Items */}
      <div className="container mx-auto px-4 pb-12">
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
                <span className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded font-bold">
                  {product.discount}% OFF
                </span>
                {product.isFeatured && (
                  <span className="absolute top-2 right-2 bg-yellow-500 text-white text-xs px-2 py-1 rounded font-bold">
                    FEATURED
                  </span>
                )}
                <button
                  onClick={() => toggleWishlist(product)}
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
                <p className="text-xs text-gray-500 mt-1">{product.brand} | {product.unit}</p>
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
                  className="w-full mt-2 bg-green-600 text-white py-1.5 rounded text-sm font-semibold hover:bg-green-700 transition disabled:opacity-50"
                >
                  {isLoading ? "Adding..." : "Add to Cart"}
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            <div>
              <h3 className="font-semibold mb-3">GROCERY</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><button className="hover:text-white">Fruits & Vegetables</button></li>
                <li><button className="hover:text-white">Dairy & Bakery</button></li>
                <li><button className="hover:text-white">Snacks & Beverages</button></li>
                <li><button className="hover:text-white">Organic Staples</button></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-3">HELP</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><button className="hover:text-white">Delivery Slots</button></li>
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
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-3">STORE</h3>
              <p className="text-sm text-gray-400">ShopHub Grocery Store, Bangalore</p>
              <p className="text-sm text-gray-400 mt-2">📞 1800-123-4567</p>
              <p className="text-sm text-gray-400">✉️ grocery@shophub.com</p>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-6 text-center text-sm text-gray-400">
            <p>&copy; 2024 ShopHub Grocery. All rights reserved. | Freshness guaranteed 🥬 | 31+ Products</p>
          </div>
        </div>
      </footer>
    </div>
  );
}