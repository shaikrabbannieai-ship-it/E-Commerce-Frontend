"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
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
  FunnelIcon,
  XMarkIcon,
  FireIcon,
  ClockIcon,
  BoltIcon,
} from "@heroicons/react/24/outline";
import { HeartIcon as HeartSolidIcon } from "@heroicons/react/24/solid";

// Navigation Categories
const navCategories = [
  "CRICKET",
  "FOOTBALL",
  "BADMINTON",
  "TENNIS",
  "GYM & FITNESS",
  "RUNNING",
  "SWIMMING",
  "YOGA",
  "CYCLING",
  "OUTDOOR SPORTS",
];

// Hero Banners with 4K Images
const heroBanners = [
  {
    id: 1,
    title: "Cricket Carnival",
    subtitle: "Up to 60% Off",
    description: "Premium bats, balls & kits",
    image: "https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=1600",
    color: "from-green-600 to-emerald-700",
  },
  {
    id: 2,
    title: "Football Fever",
    subtitle: "Min. 50% Off",
    description: "Official match balls & jerseys",
    image: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=1600",
    color: "from-blue-600 to-indigo-700",
  },
  {
    id: 3,
    title: "Gym Equipment Sale",
    subtitle: "Up to 70% Off",
    description: "Home gym setups & accessories",
    image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1600",
    color: "from-red-600 to-orange-700",
  },
  {
    id: 4,
    title: "Running Shoes",
    subtitle: "Min. 40% Off",
    description: "Nike, Adidas, Puma & more",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1600",
    color: "from-purple-600 to-pink-700",
  },
];

// Category Grid
const categoryGrid = [
  { name: "Cricket", icon: "🏏", offers: "Min. 50% Off", image: "https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=400" },
  { name: "Football", icon: "⚽", offers: "Min. 45% Off", image: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=400" },
  { name: "Badminton", icon: "🏸", offers: "Min. 40% Off", image: "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=400" },
  { name: "Tennis", icon: "🎾", offers: "Min. 55% Off", image: "https://images.unsplash.com/photo-1595435934249-5df7ed86e1f0?w=400" },
  { name: "Gym", icon: "💪", offers: "Min. 60% Off", image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400" },
  { name: "Running", icon: "🏃", offers: "Min. 50% Off", image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400" },
  { name: "Swimming", icon: "🏊", offers: "Min. 35% Off", image: "https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?w=400" },
  { name: "Yoga", icon: "🧘", offers: "Min. 40% Off", image: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=400" },
  { name: "Cycling", icon: "🚴", offers: "Min. 45% Off", image: "https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=400" },
  { name: "Outdoor", icon: "🏕️", offers: "Min. 30% Off", image: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=400" },
];

// Sports Products
const sportsProducts = [
  // Cricket
  { id: 1, name: "SG Cricket Bat - Professional", price: 4999, originalPrice: 9999, discount: 50, rating: 4.8, reviews: 1234, image: "https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=400", brand: "SG", category: "Cricket", inStock: true, isFeatured: true },
  { id: 2, name: "Kookaburra Cricket Ball", price: 799, originalPrice: 1599, discount: 50, rating: 4.7, reviews: 987, image: "https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=400", brand: "Kookaburra", category: "Cricket", inStock: true },
  { id: 3, name: "Cricket Helmet", price: 2499, originalPrice: 4999, discount: 50, rating: 4.6, reviews: 654, image: "https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=400", brand: "SS", category: "Cricket", inStock: true },
  
  // Football
  { id: 4, name: "Adidas Football - Size 5", price: 1499, originalPrice: 2999, discount: 50, rating: 4.9, reviews: 2345, image: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=400", brand: "Adidas", category: "Football", isFeatured: true },
  { id: 5, name: "Nike Football Jersey", price: 2499, originalPrice: 4999, discount: 50, rating: 4.8, reviews: 1876, image: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=400", brand: "Nike", category: "Football" },
  { id: 6, name: "Football Shoes", price: 3999, originalPrice: 7999, discount: 50, rating: 4.7, reviews: 1456, image: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=400", brand: "Puma", category: "Football" },
  
  // Gym
  { id: 7, name: "Adjustable Dumbbells Set", price: 8999, originalPrice: 17999, discount: 50, rating: 4.9, reviews: 876, image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400", brand: "BodyFit", category: "Gym", isFeatured: true },
  { id: 8, name: "Yoga Mat - Premium", price: 999, originalPrice: 1999, discount: 50, rating: 4.6, reviews: 2345, image: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=400", brand: "YogaIndia", category: "Yoga" },
  { id: 9, name: "Resistance Bands Set", price: 599, originalPrice: 1199, discount: 50, rating: 4.5, reviews: 3456, image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400", brand: "ProFit", category: "Gym" },
  
  // Running
  { id: 10, name: "Nike Air Zoom Running Shoes", price: 5999, originalPrice: 11999, discount: 50, rating: 4.9, reviews: 4567, image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400", brand: "Nike", category: "Running", isFeatured: true },
  { id: 11, name: "Running Shorts", price: 899, originalPrice: 1799, discount: 50, rating: 4.4, reviews: 2345, image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400", brand: "Puma", category: "Running" },
  { id: 12, name: "Sports Water Bottle", price: 299, originalPrice: 599, discount: 50, rating: 4.3, reviews: 5678, image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400", brand: "Milton", category: "Accessories" },
];

// Flash Sale Items
const flashSaleItems = [
  { id: 101, name: "Cricket Bat Combo", price: 3999, originalPrice: 9999, discount: 60, image: "https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=400", brand: "SG" },
  { id: 102, name: "Football Bundle", price: 2999, originalPrice: 7999, discount: 62, image: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=400", brand: "Adidas" },
  { id: 103, name: "Gym Starter Kit", price: 4999, originalPrice: 12999, discount: 61, image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400", brand: "BodyFit" },
  { id: 104, name: "Running Shoes", price: 3999, originalPrice: 9999, discount: 60, image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400", brand: "Nike" },
];

export default function SportsPage() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const [userId, setUserId] = useState<string | null>(null);
  const [cartCount, setCartCount] = useState(0);
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [wishlist, setWishlist] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ hours: 2, minutes: 30, seconds: 0 });
  const [isScrolled, setIsScrolled] = useState(false);

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

  const fetchCartFromBackend = async () => {
    if (!userId) return;
    try {
      const response = await axios.get(`https://ecommerce-backend.onrender.com/cart/${userId}`);
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
      await fetchCartFromBackend();
      toast.success(`${product.name} added to cart!`, { icon: "🏃" });
    } catch (error) {
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
        await axios.delete(`https://ecommerce-backend.onrender.com/wishlist/${userId}/${productId}`);
      } catch (error) {
        console.error("Error removing from wishlist:", error);
      }
    } else {
      setWishlist([...wishlist, productId]);
      toast.success("Added to wishlist");
      localStorage.setItem("wishlist", JSON.stringify([...wishlist, productId]));
      try {
        await axios.post("https://ecommerce-backend.onrender.com/wishlist/add", {
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
      } catch (error) {
        console.error("Error adding to wishlist:", error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Toaster position="top-right" />
      
      {/* Top Bar */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white text-xs py-1.5 px-4 text-center hidden md:block">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex gap-6">
            <span>🏃 Free Shipping on orders ₹999+</span>
            <span>🏆 30 Days Return Policy</span>
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
              <span className="text-xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">ShopHub Sports</span>
            </motion.div>

            <div className="flex-1 max-w-2xl">
              <div className="relative">
                <input type="text" placeholder="Search for sports equipment, shoes, accessories..." className="w-full px-12 py-2.5 bg-gray-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
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
              <button key={cat} className="text-gray-700 hover:text-green-600 pb-2 transition px-2">{cat}</button>
            ))}
          </div>
        </div>
      </div>

      {/* Hero Banner Slider with 4K Images */}
      <Swiper modules={[Navigation, Pagination, Autoplay, EffectFade]} navigation pagination={{ clickable: true }} autoplay={{ delay: 5000, disableOnInteraction: false }} effect="fade" className="h-[400px] md:h-[500px]">
        {heroBanners.map((banner) => (
          <SwiperSlide key={banner.id}>
            <div className={`relative h-full bg-gradient-to-r ${banner.color}`}>
              <div className="absolute inset-0 bg-black/30"></div>
              <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${banner.image})`, backgroundSize: 'cover', backgroundPosition: 'center' }}></div>
              <div className="relative h-full flex items-center justify-center text-center text-white">
                <div className="px-4">
                  <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-4xl md:text-6xl font-bold mb-4">{banner.title}</motion.h1>
                  <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-3xl md:text-4xl font-bold mb-2">{banner.subtitle}</motion.p>
                  <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="text-lg mb-6">{banner.description}</motion.p>
                  <motion.button initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-white text-gray-900 px-8 py-3 rounded-full font-semibold hover:shadow-lg transition">Shop Now →</motion.button>
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
          <Swiper modules={[Navigation, Autoplay]} navigation spaceBetween={15} slidesPerView={2} autoplay={{ delay: 3000, disableOnInteraction: false }} breakpoints={{ 640: { slidesPerView: 3 }, 768: { slidesPerView: 4 }, 1024: { slidesPerView: 5 } }}>
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
                    <button onClick={() => addToCartBackend(item)} className="w-full mt-2 bg-green-600 text-white py-1.5 rounded text-sm font-semibold hover:bg-green-700 transition">Buy Now</button>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>

      {/* Category Grid */}
      <div className="container mx-auto px-4 py-4">
        <Swiper modules={[Navigation, Autoplay]} navigation spaceBetween={15} slidesPerView={4} autoplay={{ delay: 4000, disableOnInteraction: false }} breakpoints={{ 640: { slidesPerView: 6 }, 768: { slidesPerView: 8 }, 1024: { slidesPerView: 10 } }}>
          {categoryGrid.map((cat, idx) => (
            <SwiperSlide key={idx}>
              <motion.div whileHover={{ y: -5 }} className="cursor-pointer group">
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

      {/* Products Grid */}
      <div className="container mx-auto px-4 pb-12">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {sportsProducts.map((product, idx) => (
            <motion.div key={product.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.02 }} whileHover={{ y: -4 }} className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group">
              <div className="relative">
                <img src={product.image} alt={product.name} className="w-full h-48 object-cover group-hover:scale-105 transition duration-300" />
                <span className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded font-bold">{product.discount}% OFF</span>
                <button onClick={() => toggleWishlist(product)} className="absolute bottom-2 right-2 bg-white rounded-full p-1.5 shadow-md hover:scale-110 transition">
                  {wishlist.includes(product.id) ? <HeartSolidIcon className="w-5 h-5 text-red-500" /> : <HeartIcon className="w-5 h-5 text-gray-400" />}
                </button>
              </div>
              <div className="p-3">
                <h3 className="font-semibold text-sm line-clamp-2 h-10">{product.name}</h3>
                <p className="text-xs text-gray-500 mt-1">{product.brand}</p>
                <div className="flex items-center gap-1 mt-2">
                  <span className="bg-green-600 text-white text-xs px-1 rounded">{product.rating}★</span>
                  <span className="text-xs text-gray-500">({product.reviews})</span>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-lg font-bold text-gray-800">₹{product.price}</span>
                  <span className="text-xs text-gray-400 line-through">₹{product.originalPrice}</span>
                </div>
                <button onClick={() => addToCartBackend(product)} disabled={isLoading} className="w-full mt-2 bg-green-600 text-white py-1.5 rounded text-sm font-semibold hover:bg-green-700 transition disabled:opacity-50">Add to Cart</button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            <div><h3 className="font-semibold mb-3">SPORTS</h3><ul className="space-y-2 text-sm text-gray-400"><li><button className="hover:text-white">Cricket</button></li><li><button className="hover:text-white">Football</button></li><li><button className="hover:text-white">Gym Equipment</button></li><li><button className="hover:text-white">Running Shoes</button></li></ul></div>
            <div><h3 className="font-semibold mb-3">HELP</h3><ul className="space-y-2 text-sm text-gray-400"><li><button className="hover:text-white">Size Guide</button></li><li><button className="hover:text-white">Returns</button></li><li><button className="hover:text-white">Shipping</button></li><li><button className="hover:text-white">FAQ</button></li></ul></div>
            <div><h3 className="font-semibold mb-3">POLICY</h3><ul className="space-y-2 text-sm text-gray-400"><li><button className="hover:text-white">Return Policy</button></li><li><button className="hover:text-white">Terms of Use</button></li><li><button className="hover:text-white">Privacy</button></li></ul></div>
            <div><h3 className="font-semibold mb-3">SOCIAL</h3><ul className="space-y-2 text-sm text-gray-400"><li><button className="hover:text-white">Instagram</button></li><li><button className="hover:text-white">Facebook</button></li><li><button className="hover:text-white">Twitter</button></li></ul></div>
            <div><h3 className="font-semibold mb-3">STORE</h3><p className="text-sm text-gray-400">ShopHub Sports Store, Bangalore</p><p className="text-sm text-gray-400 mt-2">📞 1800-123-4567</p></div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-6 text-center text-sm text-gray-400"><p>&copy; 2024 ShopHub Sports. All rights reserved. | Gear up for victory 🏆</p></div>
        </div>
      </footer>
    </div>
  );
}