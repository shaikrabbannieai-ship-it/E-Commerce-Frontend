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
} from "@heroicons/react/24/outline";
import { HeartIcon as HeartSolidIcon } from "@heroicons/react/24/solid";

// Hero Banners with 4K Images
const heroBanners = [
  { id: 1, title: "Gaming Festival", subtitle: "Up to 60% Off", description: "Latest gaming laptops & accessories", image: "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=1600", color: "from-purple-600 to-indigo-700" },
  { id: 2, title: "Smart Home Sale", subtitle: "Min. 40% Off", description: "Smart speakers, lights & security", image: "https://images.unsplash.com/photo-1558002038-1055907df827?w=1600", color: "from-blue-600 to-cyan-700" },
  { id: 3, title: "Headphone Zone", subtitle: "Up to 55% Off", description: "Noise cancellation & wireless", image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1600", color: "from-red-600 to-pink-700" },
  { id: 4, title: "Mobile Mania", subtitle: "Min. 30% Off", description: "Latest smartphones & accessories", image: "https://images.unsplash.com/photo-1592890288564-76628a30a657?w=1600", color: "from-green-600 to-teal-700" },
];

// Category Grid
const categoryGrid = [
  { name: "Mobiles", icon: "📱", offers: "Min. 30% Off" },
  { name: "Laptops", icon: "💻", offers: "Min. 40% Off" },
  { name: "Audio", icon: "🎧", offers: "Min. 50% Off" },
  { name: "Smart Watches", icon: "⌚", offers: "Min. 35% Off" },
  { name: "Tablets", icon: "📟", offers: "Min. 30% Off" },
  { name: "Cameras", icon: "📷", offers: "Min. 45% Off" },
  { name: "TV & Home", icon: "📺", offers: "Min. 50% Off" },
  { name: "Gaming", icon: "🎮", offers: "Min. 40% Off" },
  { name: "Accessories", icon: "🔌", offers: "Min. 60% Off" },
  { name: "Smart Home", icon: "🏠", offers: "Min. 35% Off" },
];

// Electronics Products
const electronicsProducts = [
  { id: 1, name: "iPhone 15 Pro", price: 129900, originalPrice: 139900, discount: 7, rating: 4.9, reviews: 2345, image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400", brand: "Apple", category: "Mobiles", isFeatured: true },
  { id: 2, name: "Samsung Galaxy S24", price: 79999, originalPrice: 89999, discount: 11, rating: 4.8, reviews: 1876, image: "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400", brand: "Samsung", category: "Mobiles" },
  { id: 3, name: "Sony WH-1000XM5", price: 29999, originalPrice: 34999, discount: 14, rating: 4.9, reviews: 3456, image: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=400", brand: "Sony", category: "Audio", isFeatured: true },
  { id: 4, name: "MacBook Pro M3", price: 169900, originalPrice: 189900, discount: 11, rating: 4.9, reviews: 1234, image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400", brand: "Apple", category: "Laptops" },
  { id: 5, name: "iPad Pro 12.9", price: 99900, originalPrice: 109900, discount: 9, rating: 4.8, reviews: 987, image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400", brand: "Apple", category: "Tablets" },
  { id: 6, name: "LG 4K TV 55", price: 54999, originalPrice: 79999, discount: 31, rating: 4.7, reviews: 2345, image: "https://images.unsplash.com/photo-1593784991095-a205069470b6?w=400", brand: "LG", category: "TV", isFeatured: true },
];

export default function ElectronicsPage() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const [userId, setUserId] = useState<string | null>(null);
  const [cartCount, setCartCount] = useState(0);
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [wishlist, setWishlist] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ hours: 2, minutes: 30, seconds: 0 });

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
    const handleScroll = () => setIsScrolled(window.scrollY > 100);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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

  const addToCartBackend = async (product: any) => {
    if (!isLoggedIn) {
      toast.error("Please login to add items to cart");
      router.push("/login");
      return;
    }
    setIsLoading(true);
    try {
      await axios.post("https://e-commerce-backend-2-4b0u.onrender.com/cart/add", null, {
        params: { user_id: userId, product_id: product.id, product_name: product.name, product_price: product.price, product_image: product.image, quantity: 1 }
      });
      toast.success(`${product.name} added to cart!`, { icon: "📱" });
    } catch (error) { toast.error("Failed to add to cart"); }
    finally { setIsLoading(false); }
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
      try { await axios.delete(`https://e-commerce-backend-2-4b0u.onrender.com/wishlist/${userId}/${productId}`); } catch (error) {}
    } else {
      setWishlist([...wishlist, productId]);
      toast.success("Added to wishlist");
      localStorage.setItem("wishlist", JSON.stringify([...wishlist, productId]));
      try {
        await axios.post("https://e-commerce-backend-2-4b0u.onrender.com/wishlist/add", {
          user_id: parseInt(userId!), product_id: product.id, product_name: product.name,
          product_price: product.price, product_original_price: product.originalPrice,
          product_discount: product.discount, product_rating: product.rating,
          product_reviews: product.reviews, product_image: product.image,
          product_brand: product.brand, product_category: product.category
        });
      } catch (error) {}
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Toaster position="top-right" />
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs py-1.5 px-4 text-center hidden md:block">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex gap-6"><span>📱 Free Shipping on orders ₹999+</span><span>🔄 7 Days Return Policy</span><span>🔒 Secure Payments</span><span>💳 No Cost EMI Available</span></div>
          <div className="flex gap-4"><button className="hover:text-blue-200">Sell on ShopHub</button><button className="hover:text-blue-200">Download App</button></div>
        </div>
      </div>

      <header className={`sticky top-0 z-50 bg-white transition-shadow ${isScrolled ? "shadow-md" : ""}`}>
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-3 gap-4">
            <motion.div whileHover={{ scale: 1.05 }} className="flex items-center gap-1 cursor-pointer" onClick={() => router.push("/")}>
              <ShoppingBagIcon className="w-7 h-7 text-blue-600" />
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">ShopHub Electronics</span>
            </motion.div>
            <div className="flex-1 max-w-2xl">
              <div className="relative">
                <input type="text" placeholder="Search for mobiles, laptops, accessories..." className="w-full px-12 py-2.5 bg-gray-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              </div>
            </div>
            <div className="flex items-center gap-4">
              {isLoggedIn ? (
                <div className="relative group"><button className="flex items-center gap-1 text-gray-700"><UserCircleIcon className="w-6 h-6" /><span className="text-sm">{userName?.split(" ")[0] || "User"}</span><ChevronDownIcon className="w-4 h-4" /></button></div>
              ) : (<button onClick={() => router.push("/login")} className="bg-blue-600 text-white px-6 py-2 rounded font-medium hover:bg-blue-700">Login</button>)}
              <button onClick={() => router.push("/wishlist")} className="relative"><HeartIcon className="w-6 h-6 text-gray-600" />{wishlist.length > 0 && <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">{wishlist.length}</span>}</button>
              <button onClick={() => router.push("/cart")} className="relative"><ShoppingBagIcon className="w-6 h-6 text-gray-600" />{cartCount > 0 && <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">{cartCount}</span>}</button>
            </div>
          </div>
        </div>
      </header>

      <div className="bg-white border-b sticky top-[73px] z-40 overflow-x-auto shadow-sm">
        <div className="container mx-auto"><div className="flex gap-4 px-4 py-3 text-sm font-medium whitespace-nowrap">{["MOBILES", "LAPTOPS", "AUDIO", "WEARABLES", "TABLETS", "CAMERAS", "TV & HOME", "GAMING", "ACCESSORIES"].map(cat => (<button key={cat} className="text-gray-700 hover:text-blue-600 pb-2 transition px-2">{cat}</button>))}</div></div>
      </div>

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
                  <motion.button initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-white text-gray-900 px-8 py-3 rounded-full font-semibold hover:shadow-lg transition">Shop Now →</motion.button>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      <div className="container mx-auto px-4 py-8">
        <div className="bg-gradient-to-r from-red-500 to-orange-500 rounded-lg p-6 shadow-lg">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-3"><BoltIcon className="w-8 h-8 text-white" /><h2 className="text-2xl font-bold text-white">FLASH SALE</h2><div className="flex gap-2 text-white"><span className="bg-black/30 px-3 py-1 rounded-lg font-mono text-xl">{String(timeLeft.hours).padStart(2, '0')}</span>:<span className="bg-black/30 px-3 py-1 rounded-lg font-mono text-xl">{String(timeLeft.minutes).padStart(2, '0')}</span>:<span className="bg-black/30 px-3 py-1 rounded-lg font-mono text-xl">{String(timeLeft.seconds).padStart(2, '0')}</span></div></div>
            <button className="text-white font-semibold hover:underline">View All →</button>
          </div>
          <Swiper modules={[Navigation, Autoplay]} navigation spaceBetween={15} slidesPerView={2} autoplay={{ delay: 3000 }} breakpoints={{ 640: { slidesPerView: 3 }, 768: { slidesPerView: 4 }, 1024: { slidesPerView: 5 } }}>
            {electronicsProducts.slice(0, 5).map((item) => (
              <SwiperSlide key={item.id}>
                <div className="bg-white rounded-lg overflow-hidden shadow-lg">
                  <div className="relative"><img src={item.image} alt={item.name} className="w-full h-40 object-cover" /><span className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded">-{item.discount}%</span></div>
                  <div className="p-3"><h3 className="font-semibold text-sm truncate">{item.name}</h3><p className="text-xs text-gray-500">{item.brand}</p><div className="flex items-center gap-2 mt-2"><span className="text-lg font-bold text-red-500">₹{item.price}</span><span className="text-xs text-gray-400 line-through">₹{item.originalPrice}</span></div><button onClick={() => addToCartBackend(item)} className="w-full mt-2 bg-blue-600 text-white py-1.5 rounded text-sm font-semibold">Buy Now</button></div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>

      <div className="container mx-auto px-4 py-4">
        <Swiper modules={[Navigation, Autoplay]} navigation spaceBetween={15} slidesPerView={4} autoplay={{ delay: 4000 }} breakpoints={{ 640: { slidesPerView: 6 }, 768: { slidesPerView: 8 }, 1024: { slidesPerView: 10 } }}>
          {categoryGrid.map((cat, idx) => (
            <SwiperSlide key={idx}>
              <motion.div whileHover={{ y: -5 }} className="cursor-pointer group">
                <div className="bg-white rounded-lg p-3 text-center shadow-sm hover:shadow-md transition">
                  <div className="text-3xl mb-2">{cat.icon}</div>
                  <h3 className="text-xs font-semibold">{cat.name}</h3>
                  <p className="text-xs text-blue-500 font-medium">{cat.offers}</p>
                </div>
              </motion.div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <div className="container mx-auto px-4 pb-12">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {electronicsProducts.map((product, idx) => (
            <motion.div key={product.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.02 }} whileHover={{ y: -4 }} className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-xl transition">
              <div className="relative">
                <img src={product.image} alt={product.name} className="w-full h-48 object-cover" />
                <span className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded font-bold">{product.discount}% OFF</span>
                <button onClick={() => toggleWishlist(product)} className="absolute bottom-2 right-2 bg-white rounded-full p-1.5 shadow-md hover:scale-110 transition">
                  {wishlist.includes(product.id) ? <HeartSolidIcon className="w-5 h-5 text-red-500" /> : <HeartIcon className="w-5 h-5 text-gray-400" />}
                </button>
              </div>
              <div className="p-3">
                <h3 className="font-semibold text-sm truncate">{product.name}</h3>
                <p className="text-xs text-gray-500 mt-1">{product.brand}</p>
                <div className="flex items-center gap-1 mt-2"><span className="bg-green-600 text-white text-xs px-1 rounded">{product.rating}★</span><span className="text-xs text-gray-500">({product.reviews})</span></div>
                <div className="flex items-center gap-2 mt-2"><span className="text-lg font-bold text-gray-800">₹{product.price}</span><span className="text-xs text-gray-400 line-through">₹{product.originalPrice}</span></div>
                <button onClick={() => addToCartBackend(product)} disabled={isLoading} className="w-full mt-2 bg-blue-600 text-white py-1.5 rounded text-sm font-semibold hover:bg-blue-700 transition disabled:opacity-50">Add to Cart</button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <footer className="bg-gray-900 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            <div><h3 className="font-semibold mb-3">ELECTRONICS</h3><ul className="space-y-2 text-sm text-gray-400"><li><button className="hover:text-white">Mobiles</button></li><li><button className="hover:text-white">Laptops</button></li><li><button className="hover:text-white">Audio</button></li><li><button className="hover:text-white">Wearables</button></li></ul></div>
            <div><h3 className="font-semibold mb-3">HELP</h3><ul className="space-y-2 text-sm text-gray-400"><li><button className="hover:text-white">Exchange Offers</button></li><li><button className="hover:text-white">No Cost EMI</button></li><li><button className="hover:text-white">Return Policy</button></li><li><button className="hover:text-white">FAQ</button></li></ul></div>
            <div><h3 className="font-semibold mb-3">POLICY</h3><ul className="space-y-2 text-sm text-gray-400"><li><button className="hover:text-white">Return Policy</button></li><li><button className="hover:text-white">Terms of Use</button></li><li><button className="hover:text-white">Privacy</button></li></ul></div>
            <div><h3 className="font-semibold mb-3">SOCIAL</h3><ul className="space-y-2 text-sm text-gray-400"><li><button className="hover:text-white">Instagram</button></li><li><button className="hover:text-white">Facebook</button></li><li><button className="hover:text-white">Twitter</button></li></ul></div>
            <div><h3 className="font-semibold mb-3">STORE</h3><p className="text-sm text-gray-400">ShopHub Electronics Store, Bangalore</p><p className="text-sm text-gray-400 mt-2">📞 1800-123-4567</p></div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-6 text-center text-sm text-gray-400"><p>&copy; 2024 ShopHub Electronics. All rights reserved. | Upgrade your tech 🔋</p></div>
        </div>
      </footer>
    </div>
  );
}