"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { MagnifyingGlassIcon, XMarkIcon, ArrowPathIcon } from "@heroicons/react/24/outline";
import axios from "axios";
import toast from "react-hot-toast";

interface SearchProduct {
  id: number;
  name: string;
  price: number;
  originalPrice: number;
  discount: number;
  rating: number;
  image: string;
  brand: string;
  category: string;
}

interface SearchBarProps {
  onSearch?: (query: string) => void;
  placeholder?: string;
}

export default function SearchBar({ onSearch, placeholder = "Search for Products, Brands and More..." }: SearchBarProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchProduct[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [trendingSearches, setTrendingSearches] = useState<string[]>([
    "iPhone", "Samsung", "Nike Shoes", "Watches", "Laptop", "Headphones"
  ]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("recentSearches");
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, []);

  // Save recent searches
  const saveRecentSearch = (query: string) => {
    if (!query.trim()) return;
    const updated = [query, ...recentSearches.filter(s => s !== query)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem("recentSearches", JSON.stringify(updated));
  };

  // Clear recent searches
  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem("recentSearches");
    toast.success("Recent searches cleared");
  };

  // Search function with debouncing
  const performSearch = useCallback(async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      // For now, use local product data
      // In production, call your backend API
      const response = await axios.get(`http://127.0.0.1:8000/search?q=${encodeURIComponent(query)}`);
      setSearchResults(response.data.results || []);
    } catch (error) {
      console.error("Search error:", error);
      // Fallback to local search if backend not available
      const localResults = getLocalSearchResults(query);
      setSearchResults(localResults);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Local search fallback (remove this when backend is ready)
  const getLocalSearchResults = (query: string): SearchProduct[] => {
    const allProducts = [
      { id: 1, name: "boAt Rockerz 450", price: 1999, originalPrice: 3990, discount: 50, rating: 4.3, image: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=300", brand: "boAt", category: "Electronics" },
      { id: 2, name: "iPhone 15 Pro", price: 129900, originalPrice: 139900, discount: 7, rating: 4.8, image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=300", brand: "Apple", category: "Mobiles" },
      { id: 3, name: "Samsung Galaxy S24", price: 79999, originalPrice: 89999, discount: 11, rating: 4.7, image: "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=300", brand: "Samsung", category: "Mobiles" },
      { id: 4, name: "Nike Running Shoes", price: 3999, originalPrice: 7999, discount: 50, rating: 4.5, image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300", brand: "Nike", category: "Fashion" },
      { id: 5, name: "Men's Casual Shirt", price: 899, originalPrice: 2499, discount: 64, rating: 4.2, image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=300", brand: "Roadster", category: "Fashion" },
      { id: 6, name: "Premium Watch", price: 2499, originalPrice: 9999, discount: 75, rating: 4.6, image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300", brand: "Fossil", category: "Accessories" },
      { id: 7, name: "Wireless Headphones", price: 2999, originalPrice: 5999, discount: 50, rating: 4.4, image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300", brand: "Sony", category: "Electronics" },
      { id: 8, name: "Laptop Backpack", price: 1499, originalPrice: 2999, discount: 50, rating: 4.3, image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300", brand: "Skybags", category: "Accessories" },
    ];
    
    return allProducts.filter(p => 
      p.name.toLowerCase().includes(query.toLowerCase()) ||
      p.brand.toLowerCase().includes(query.toLowerCase()) ||
      p.category.toLowerCase().includes(query.toLowerCase())
    );
  };

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

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showResults) return;
    
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
        setShowResults(false);
        inputRef.current?.blur();
        break;
    }
  };

  const handleSearchSubmit = () => {
    if (!searchQuery.trim()) return;
    saveRecentSearch(searchQuery);
    setShowResults(false);
    if (onSearch) {
      onSearch(searchQuery);
    } else {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleProductClick = (product: SearchProduct) => {
    saveRecentSearch(product.name);
    setShowResults(false);
    router.push(`/product/${product.id}`);
  };

  const handleTrendingClick = (trend: string) => {
    setSearchQuery(trend);
    saveRecentSearch(trend);
    setShowResults(false);
    router.push(`/search?q=${encodeURIComponent(trend)}`);
  };

  const clearSearch = () => {
    setSearchQuery("");
    setSearchResults([]);
    setShowResults(false);
    inputRef.current?.focus();
  };

  const highlightText = (text: string, query: string) => {
    if (!query.trim()) return text;
    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);
    return parts.map((part, i) => 
      regex.test(part) ? <mark key={i} className="bg-yellow-200 text-gray-900">{part}</mark> : part
    );
  };

  return (
    <div ref={searchRef} className="relative w-full max-w-2xl">
      {/* Search Input */}
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setShowResults(true);
            setSelectedIndex(-1);
          }}
          onFocus={() => {
            setShowResults(true);
            setSelectedIndex(-1);
          }}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
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
        
        {isLoading && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <ArrowPathIcon className="w-4 h-4 text-gray-400 animate-spin" />
          </div>
        )}
      </div>

      {/* Search Results Dropdown */}
      <AnimatePresence>
        {showResults && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl z-50 overflow-hidden border border-gray-100"
          >
            {/* Loading State */}
            {isLoading && searchResults.length === 0 && searchQuery && (
              <div className="p-8 text-center">
                <ArrowPathIcon className="w-8 h-8 text-blue-500 animate-spin mx-auto mb-2" />
                <p className="text-gray-500">Searching products...</p>
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
                  <span className="text-xs font-semibold text-gray-500">TRENDING NOW 🔥</span>
                </div>
                {trendingSearches.map((trend, idx) => (
                  <div
                    key={idx}
                    onClick={() => handleTrendingClick(trend)}
                    className="flex items-center gap-3 px-3 py-2 hover:bg-gray-50 rounded-lg cursor-pointer transition"
                  >
                    <span className="text-sm text-gray-700">{trend}</span>
                    <span className="text-xs text-red-500">Trending</span>
                  </div>
                ))}
              </div>
            )}

            {/* Search Results */}
            {searchQuery && searchResults.length > 0 && (
              <>
                <div className="px-3 py-2 text-xs text-gray-500 border-b">
                  Found {searchResults.length} results for "{searchQuery}"
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
                          handleProductClick(product);
                        }}
                        className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition whitespace-nowrap"
                      >
                        View Details
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
            {searchQuery && searchResults.length === 0 && !isLoading && (
              <div className="p-8 text-center">
                <MagnifyingGlassIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <h3 className="font-semibold text-gray-800 mb-1">No results found</h3>
                <p className="text-sm text-gray-500">
                  We couldn't find any products matching "{searchQuery}"
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
  );
}

// ClockIcon for recent searches
function ClockIcon(props: any) {
  return (
    <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}