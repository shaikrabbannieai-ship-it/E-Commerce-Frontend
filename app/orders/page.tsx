"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import dynamic from 'next/dynamic';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// Dynamically import Leaflet components with no SSR
const MapContainer = dynamic(
  () => import('react-leaflet').then(mod => mod.MapContainer),
  { ssr: false, loading: () => <div className="h-96 w-full bg-gray-100 animate-pulse rounded-lg flex items-center justify-center">Loading map...</div> }
);

const TileLayer = dynamic(
  () => import('react-leaflet').then(mod => mod.TileLayer),
  { ssr: false }
);

const Marker = dynamic(
  () => import('react-leaflet').then(mod => mod.Marker),
  { ssr: false }
);

const Popup = dynamic(
  () => import('react-leaflet').then(mod => mod.Popup),
  { ssr: false }
);

const Polyline = dynamic(
  () => import('react-leaflet').then(mod => mod.Polyline),
  { ssr: false }
);

const Circle = dynamic(
  () => import('react-leaflet').then(mod => mod.Circle),
  { ssr: false }
);

import 'leaflet/dist/leaflet.css';

let L: any;
let deliveryIcon: any = null;
let userLocationIcon: any = null;
let warehouseIcon: any = null;

if (typeof window !== 'undefined') {
  L = require('leaflet');
  
  delete (L.Icon.Default.prototype as any)._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  });
  
  deliveryIcon = new L.Icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/1995/1995572.png',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32]
  });
  
  userLocationIcon = new L.Icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/684/684908.png',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32]
  });
  
  warehouseIcon = new L.Icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/2838/2838912.png',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32]
  });
}

import {
  ShoppingBagIcon,
  CubeIcon,
  TruckIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  EyeIcon,
  ArrowPathIcon,
  MapPinIcon,
  CalendarIcon,
  PhoneIcon,
  StarIcon,
  KeyIcon,
  ShieldCheckIcon,
  GlobeAltIcon,
  ArrowDownTrayIcon,
} from "@heroicons/react/24/outline";
import { StarIcon as StarSolidIcon } from "@heroicons/react/24/solid";

interface OrderItem {
  product_id: number;
  product_name: string;
  product_price: number;
  product_image: string;
  quantity: number;
  size?: string;
  color?: string;
}

interface DeliveryPartner {
  id: number;
  name: string;
  phone: string;
  rating: number;
  vehicle_number: string;
  current_lat: number;
  current_lng: number;
  profile_pic: string;
  eta_minutes: number;
}

interface Order {
  id: number;
  order_number: string;
  total_amount: number;
  order_status: string;
  payment_status: string;
  payment_method?: string;
  items: OrderItem[];
  created_at: string;
  estimated_delivery?: string;
  delivery_partner?: DeliveryPartner;
  tracking_updates?: any[];
  current_location?: { lat: number; lng: number };
  shipping_address?: {
    fullName: string;
    addressLine: string;
    city: string;
    state: string;
    pincode: string;
    phone: string;
    email?: string;
  };
  delivery_otp?: string;
  destination?: { lat: number; lng: number };
  rating?: number;
  rating_comment?: string;
  user_name?: string;
  user_email?: string;
}

const WAREHOUSE_LOCATION = { lat: 12.9716, lng: 77.5946 };
const DELIVERY_LOCATIONS = [
  { lat: 12.9352, lng: 77.6245 }, { lat: 12.9784, lng: 77.6408 },
  { lat: 12.9085, lng: 77.6786 }, { lat: 13.0359, lng: 77.5970 },
  { lat: 12.9279, lng: 77.6271 },
];

const deliveryPartners: DeliveryPartner[] = [
  { id: 1, name: "Rahul Sharma", phone: "+91 98765 43210", rating: 4.8, vehicle_number: "KA-01-AB-1234", current_lat: 12.9716, current_lng: 77.5946, profile_pic: "https://randomuser.me/api/portraits/men/1.jpg", eta_minutes: 25 },
  { id: 2, name: "Amit Kumar", phone: "+91 98765 43211", rating: 4.9, vehicle_number: "KA-02-CD-5678", current_lat: 12.9352, current_lng: 77.6245, profile_pic: "https://randomuser.me/api/portraits/men/2.jpg", eta_minutes: 30 },
  { id: 3, name: "Vikram Singh", phone: "+91 98765 43212", rating: 4.7, vehicle_number: "KA-03-EF-9012", current_lat: 12.9784, current_lng: 77.6408, profile_pic: "https://randomuser.me/api/portraits/men/3.jpg", eta_minutes: 20 },
];

export default function OrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [filterStatus, setFilterStatus] = useState("all");
  const [deliveryPosition, setDeliveryPosition] = useState<{ lat: number; lng: number } | null>(null);
  const [deliveryRoute, setDeliveryRoute] = useState<Array<[number, number]>>([]);
  const [eta, setEta] = useState<number>(0);
  const [distance, setDistance] = useState<number>(0);
  const [isTracking, setIsTracking] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [enteredOtp, setEnteredOtp] = useState("");
  const [otpError, setOtpError] = useState("");
  const [otpResendCountdown, setOtpResendCountdown] = useState(0);
  const [isMounted, setIsMounted] = useState(false);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [rating, setRating] = useState(0);
  const [ratingComment, setRatingComment] = useState("");
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [returnReason, setReturnReason] = useState("");
  const [returnReasonOther, setReturnReasonOther] = useState("");
  const [isSubmittingReturn, setIsSubmittingReturn] = useState(false);
  
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locationStatus, setLocationStatus] = useState<"loading" | "granted" | "denied" | "unavailable">("loading");
  const [locationError, setLocationError] = useState<string>("");
  const [retryCount, setRetryCount] = useState(0);
  
  const trackingInterval = useRef<NodeJS.Timeout | null>(null);
  const progressInterval = useRef<NodeJS.Timeout | null>(null);
  const countdownInterval = useRef<NodeJS.Timeout | null>(null);
  const watchIdRef = useRef<number | null>(null);

  const userId = typeof window !== 'undefined' ? localStorage.getItem("user_id") : null;

  // Request push notification permission
  const requestNotificationPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        toast.success('Notifications enabled!');
      }
    }
  };

  // Send push notification
  const sendNotification = (title: string, body: string) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(title, { body, icon: '/favicon.ico' });
    }
  };

  useEffect(() => {
    requestNotificationPermission();
  }, []);

  const getUserLocation = () => {
    if (!navigator.geolocation) {
      setLocationStatus("unavailable");
      setLocationError("Geolocation is not supported");
      setUserLocation({ lat: 12.9716, lng: 77.5946 });
      setLocationStatus("granted");
      return;
    }
    
    setLocationStatus("loading");
    
    if (watchIdRef.current) {
      try { navigator.geolocation.clearWatch(watchIdRef.current); } catch (e) {}
      watchIdRef.current = null;
    }
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation({ lat: latitude, lng: longitude });
        setLocationStatus("granted");
        setLocationError("");
        setRetryCount(0);
        toast.success("📍 Live location activated!", { duration: 3000 });
        
        try {
          watchIdRef.current = navigator.geolocation.watchPosition(
            (newPosition) => setUserLocation({ lat: newPosition.coords.latitude, lng: newPosition.coords.longitude }),
            (watchError) => console.warn("Watch position error"),
            { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
          );
        } catch (watchError) { console.warn("Could not start watching position"); }
      },
      (error) => {
        console.error("Error getting location:", error);
        let errorMessage = "";
        
        if (error && typeof error.code !== 'undefined') {
          switch(error.code) {
            case error.PERMISSION_DENIED: 
              errorMessage = "Location permission denied. Please enable location access in your browser settings."; 
              break;
            case error.POSITION_UNAVAILABLE: 
              errorMessage = "Location unavailable. Using default location."; 
              setUserLocation({ lat: 12.9716, lng: 77.5946 }); 
              setLocationStatus("granted"); 
              break;
            case error.TIMEOUT: 
              errorMessage = "Location request timed out. Retrying..."; 
              setTimeout(() => getUserLocation(), 3000); 
              break;
            default: 
              errorMessage = "Unable to get location.";
          }
        } else {
          errorMessage = "Unable to get location. Please check your browser settings.";
        }
        
        setLocationError(errorMessage);
        setLocationStatus("denied");
        toast.error(errorMessage);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
    );
  };

  const retryLocation = () => { setRetryCount(0); getUserLocation(); toast("Retrying location access..."); };

  useEffect(() => { getUserLocation(); return () => { if (watchIdRef.current) { try { navigator.geolocation.clearWatch(watchIdRef.current); } catch (e) {} watchIdRef.current = null; } }; }, []);

  useEffect(() => {
    setIsMounted(true);
    if (userId) { fetchOrders(); } else { router.push("/login"); }
    return () => {
      if (trackingInterval.current) clearInterval(trackingInterval.current);
      if (progressInterval.current) clearInterval(progressInterval.current);
      if (countdownInterval.current) clearInterval(countdownInterval.current);
    };
  }, [userId]);

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`http://127.0.0.1:8000/orders/${userId}`);
      const ordersData = response.data.orders || [];
      
      // Fetch user details
      const userResponse = await axios.get(`http://127.0.0.1:8000/user/${userId}`);
      const userData = userResponse.data;
      
      const enhancedOrders = ordersData.map((order: Order, index: number) => {
        const randomDest = DELIVERY_LOCATIONS[index % DELIVERY_LOCATIONS.length];
        return {
          ...order,
          user_name: userData.full_name,
          user_email: userData.email,
          estimated_delivery: new Date(new Date(order.created_at).getTime() + 5 * 24 * 60 * 60 * 1000).toISOString(),
          delivery_partner: (order.order_status === "shipped" || order.order_status === "out_for_delivery") 
            ? { ...deliveryPartners[index % deliveryPartners.length], current_lat: WAREHOUSE_LOCATION.lat, current_lng: WAREHOUSE_LOCATION.lng }
            : undefined,
          delivery_otp: order.delivery_otp,
          destination: randomDest,
          rating: order.rating || 0
        };
      });
      
      setOrders(enhancedOrders);
    } catch (error: any) {
      console.error("Error fetching orders:", error);
      toast.error("Failed to load orders");
      setOrders([]);
    } finally {
      setIsLoading(false);
    }
  };

  const downloadInvoice = async (order: Order) => {
    const doc = new jsPDF();
    
    // Colors
    const primaryColor = [79, 70, 229];
    const grayColor = [100, 100, 100];
    
    let yPos = 20;
    
    // ==================== HEADER SECTION ====================
    doc.setFontSize(26);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.text("SHOPHUB", 20, yPos);
    
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(grayColor[0], grayColor[1], grayColor[2]);
    doc.text("E-commerce Private Limited", 20, yPos + 6);
    
    doc.setFontSize(8);
    doc.text("123, MG Road, Koramangala", 140, yPos);
    doc.text("Bangalore - 560001, Karnataka", 140, yPos + 5);
    doc.text("Tel: +91 98765 43210", 140, yPos + 10);
    doc.text("Email: support@shophub.com", 140, yPos + 15);
    doc.text("GSTIN: 29ABCDE1234F1Z5", 140, yPos + 20);
    
    yPos += 35;
    
    doc.setDrawColor(200, 200, 200);
    doc.line(20, yPos, 190, yPos);
    yPos += 10;
    
    doc.setFontSize(24);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.text("TAX INVOICE", 105, yPos, { align: "center" });
    yPos += 12;
    
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(0, 0, 0);
    
    doc.setFont("helvetica", "bold");
    doc.text("Invoice No:", 20, yPos);
    doc.setFont("helvetica", "normal");
    doc.text(order.order_number, 55, yPos);
    
    doc.setFont("helvetica", "bold");
    doc.text("Invoice Date:", 20, yPos + 6);
    doc.setFont("helvetica", "normal");
    doc.text(new Date(order.created_at).toLocaleDateString('en-IN'), 55, yPos + 6);
    
    doc.setFont("helvetica", "bold");
    doc.text("Order No:", 20, yPos + 12);
    doc.setFont("helvetica", "normal");
    doc.text(order.order_number, 55, yPos + 12);
    
    doc.setFont("helvetica", "bold");
    doc.text("Payment Status:", 130, yPos);
    doc.setFont("helvetica", "normal");
    const paymentStatus = order.payment_status === "completed" ? "Paid" : "Pending";
    doc.setTextColor(paymentStatus === "Paid" ? 34 : 220, paymentStatus === "Paid" ? 197 : 38, paymentStatus === "Paid" ? 94 : 38);
    doc.text(paymentStatus, 175, yPos);
    doc.setTextColor(0, 0, 0);
    
    doc.setFont("helvetica", "bold");
    doc.text("Payment Mode:", 130, yPos + 6);
    doc.setFont("helvetica", "normal");
    doc.text(order.payment_method?.toUpperCase() || "COD", 175, yPos + 6);
    
    doc.setFont("helvetica", "bold");
    doc.text("Order Date:", 130, yPos + 12);
    doc.setFont("helvetica", "normal");
    doc.text(new Date(order.created_at).toLocaleDateString('en-IN'), 175, yPos + 12);
    
    yPos += 25;
    doc.line(20, yPos, 190, yPos);
    yPos += 10;
    
    // ==================== BILL TO SECTION ====================
    doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.rect(20, yPos - 4, 170, 8, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text("BILL TO", 25, yPos);
    
    doc.setTextColor(0, 0, 0);
    yPos += 10;
    
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    const customerName = order.shipping_address?.fullName || order.user_name || "Customer";
    doc.text(customerName, 25, yPos);
    
    doc.setFont("helvetica", "normal");
    yPos += 6;
    
    const address = order.shipping_address;
    if (address && address.addressLine && address.addressLine !== "N/A") {
      doc.text(address.addressLine, 25, yPos);
      yPos += 5;
      doc.text(`${address.city || ""}, ${address.state || ""} - ${address.pincode || ""}`, 25, yPos);
      yPos += 5;
      doc.text(`Phone: ${address.phone || "N/A"}`, 25, yPos);
      yPos += 5;
      doc.text(`Email: ${order.user_email || address.email || "customer@example.com"}`, 25, yPos);
    } else {
      doc.text("Address not available", 25, yPos);
      yPos += 5;
      doc.text(`Phone: ${address?.phone || "N/A"}`, 25, yPos);
      yPos += 5;
      doc.text(`Email: ${order.user_email || "customer@example.com"}`, 25, yPos);
    }
    
    yPos += 15;
    
    // ==================== ITEMS TABLE ====================
    doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.rect(20, yPos - 4, 170, 8, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.text("SL NO", 25, yPos);
    doc.text("DESCRIPTION", 50, yPos);
    doc.text("QTY", 120, yPos);
    doc.text("PRICE", 145, yPos);
    doc.text("TOTAL", 175, yPos);
    
    doc.setTextColor(0, 0, 0);
    let tableY = yPos + 6;
    let subtotal = 0;
    
    order.items.forEach((item, index) => {
      const itemTotal = item.product_price * item.quantity;
      subtotal += itemTotal;
      
      if (index % 2 === 0) {
        doc.setFillColor(245, 245, 245);
        doc.rect(20, tableY - 3, 170, 7, 'F');
      }
      
      doc.setFontSize(8);
      doc.setFont("helvetica", "normal");
      doc.text((index + 1).toString(), 25, tableY);
      
      const productName = item.product_name.length > 35 ? item.product_name.substring(0, 32) + "..." : item.product_name;
      doc.text(productName, 50, tableY);
      doc.text(item.quantity.toString(), 122, tableY);
      doc.text(`₹${item.product_price.toFixed(2)}`, 147, tableY);
      doc.text(`₹${itemTotal.toFixed(2)}`, 175, tableY, { align: "right" });
      
      tableY += 7;
      
      if (tableY > 250) {
        doc.addPage();
        tableY = 30;
        doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
        doc.rect(20, tableY - 4, 170, 8, 'F');
        doc.setTextColor(255, 255, 255);
        doc.text("SL NO", 25, tableY);
        doc.text("DESCRIPTION", 50, tableY);
        doc.text("QTY", 120, tableY);
        doc.text("PRICE", 145, tableY);
        doc.text("TOTAL", 175, tableY);
        doc.setTextColor(0, 0, 0);
        tableY += 6;
      }
    });
    
    tableY += 5;
    doc.setDrawColor(200, 200, 200);
    doc.line(20, tableY, 190, tableY);
    tableY += 8;
    
    const cgst = subtotal * 0.09;
    const sgst = subtotal * 0.09;
    const grandTotal = subtotal + cgst + sgst;
    
    const totalsX = 130;
    let totalsY = tableY;
    
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.text("Subtotal:", totalsX, totalsY);
    doc.text(`₹${subtotal.toFixed(2)}`, 185, totalsY, { align: "right" });
    
    totalsY += 6;
    doc.text("CGST (9%):", totalsX, totalsY);
    doc.text(`₹${cgst.toFixed(2)}`, 185, totalsY, { align: "right" });
    
    totalsY += 6;
    doc.text("SGST (9%):", totalsX, totalsY);
    doc.text(`₹${sgst.toFixed(2)}`, 185, totalsY, { align: "right" });
    
    totalsY += 8;
    doc.setDrawColor(0, 0, 0);
    doc.line(totalsX - 5, totalsY - 2, 190, totalsY - 2);
    
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.text("GRAND TOTAL:", totalsX, totalsY);
    doc.text(`₹${grandTotal.toFixed(2)}`, 185, totalsY, { align: "right" });
    
    totalsY += 10;
    
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    doc.text("Amount in Words:", 20, totalsY);
    doc.setFont("helvetica", "normal");
    const amountInWords = numberToWords(Math.floor(grandTotal));
    doc.text(`Rupees ${amountInWords} Only`, 60, totalsY);
    
    totalsY += 15;
    
    doc.setFillColor(250, 250, 250);
    doc.rect(20, totalsY - 3, 170, 35, 'F');
    
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.text("Terms & Conditions:", 25, totalsY);
    
    doc.setFont("helvetica", "normal");
    const terms = [
      "1. Goods once sold will not be taken back.",
      "2. This is a computer generated invoice and requires no signature.",
      "3. Subject to Bangalore jurisdiction.",
      "4. Please check all items at the time of delivery."
    ];
    
    terms.forEach((term, index) => {
      doc.text(term, 25, totalsY + 6 + (index * 4));
    });
    
    totalsY += 38;
    
    // ==================== SIGNATURE WITH IMAGE ====================
    try {
      // Load signature from public folder
      const img = new Image();
      img.src = '/images/signature.jpeg';
      
      // Wait for image to load
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
      });
      
      // Convert image to canvas and then to data URL
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      ctx?.drawImage(img, 0, 0);
      const signatureBase64 = canvas.toDataURL('image/jpeg');
      
      // Add signature image
      doc.addImage(signatureBase64, 'JPEG', 140, totalsY - 10, 50, 20);
      
      // Add line below signature
      doc.setDrawColor(0, 0, 0);
      doc.line(140, totalsY + 12, 190, totalsY + 12);
      doc.setFontSize(8);
      doc.setFont("helvetica", "normal");
      doc.text("Authorized Signatory", 165, totalsY + 18, { align: "center" });
    } catch (error) {
      console.error("Signature error:", error);
      // Fallback - draw signature box
      doc.setDrawColor(0, 0, 0);
      doc.setLineWidth(0.5);
      doc.rect(140, totalsY - 5, 50, 25);
      doc.setFontSize(8);
      doc.setFont("helvetica", "italic");
      doc.text("Authorized Signatory", 165, totalsY + 15, { align: "center" });
    }
    
    totalsY += 25;
    
    // ==================== FOOTER ====================
    doc.setFontSize(7);
    doc.setTextColor(grayColor[0], grayColor[1], grayColor[2]);
    doc.text("Thank you for shopping with ShopHub!", 105, 280, { align: "center" });
    doc.text("For any queries, please contact support@shophub.com", 105, 286, { align: "center" });
    
    // Save the PDF
    doc.save(`Invoice_${order.order_number}.pdf`);
    toast.success("Invoice downloaded!");
  };

  // Helper function to convert numbers to words
  function numberToWords(num: number): string {
    if (num === 0) return 'Zero';
    
    const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
    const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
    const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
    
    function convert(n: number): string {
      if (n < 10) return ones[n];
      if (n < 20) return teens[n - 10];
      if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 !== 0 ? ' ' + ones[n % 10] : '');
      if (n < 1000) return ones[Math.floor(n / 100)] + ' Hundred' + (n % 100 !== 0 ? ' ' + convert(n % 100) : '');
      if (n < 100000) return convert(Math.floor(n / 1000)) + ' Thousand' + (n % 1000 !== 0 ? ' ' + convert(n % 1000) : '');
      if (n < 10000000) return convert(Math.floor(n / 100000)) + ' Lakh' + (n % 100000 !== 0 ? ' ' + convert(n % 100000) : '');
      return convert(Math.floor(n / 10000000)) + ' Crore' + (n % 10000000 !== 0 ? ' ' + convert(n % 10000000) : '');
    }
    
    return convert(num);
  }

  const submitRating = async () => {
    if (rating === 0) {
      toast.error("Please select a rating");
      return;
    }
    try {
      await axios.post(`http://127.0.0.1:8000/order/rate/${selectedOrder?.id}`, {
        rating: rating,
        comment: ratingComment
      });
      toast.success("Thank you for your feedback!");
      setShowRatingModal(false);
      setRating(0);
      setRatingComment("");
      fetchOrders();
    } catch (error: any) {
      console.error("Rating error:", error);
      toast.error(error.response?.data?.detail || "Failed to submit rating");
    }
  };

  const submitReturnRequest = async () => {
    if (!returnReason) {
      toast.error("Please select a reason");
      return;
    }
    
    const finalReason = returnReason === "other" ? returnReasonOther : returnReason;
    
    if (!finalReason || finalReason.trim() === "") {
      toast.error("Please provide a reason for return");
      return;
    }
    
    setIsSubmittingReturn(true);
    
    try {
      await axios.post(
        `http://127.0.0.1:8000/order/return/${selectedOrder?.id}`,
        { reason: finalReason },
        {
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );
      
      toast.success("Return request submitted successfully!");
      setShowReturnModal(false);
      setReturnReason("");
      setReturnReasonOther("");
    } catch (error: any) {
      console.error("Return request error:", error);
      if (error.response?.status === 404) {
        toast.error("Return endpoint not found. Please contact support.");
      } else if (error.response?.data?.detail) {
        toast.error(error.response.data.detail);
      } else {
        toast.error("Failed to submit return request. Please try again.");
      }
    } finally {
      setIsSubmittingReturn(false);
    }
  };

  const simulateArrival = () => {
    if (trackingInterval.current) clearInterval(trackingInterval.current);
    if (progressInterval.current) clearInterval(progressInterval.current);
    setIsTracking(false);
    setShowOtpModal(true);
    toast.success("Delivery partner has arrived! Please provide OTP to complete delivery.", { duration: 8000, icon: "🔐" });
  };

  const startResendCountdown = () => {
    setOtpResendCountdown(30);
    if (countdownInterval.current) clearInterval(countdownInterval.current);
    countdownInterval.current = setInterval(() => {
      setOtpResendCountdown(prev => { if (prev <= 1) { clearInterval(countdownInterval.current!); return 0; } return prev - 1; });
    }, 1000);
  };

  const resendOtp = async () => {
    if (otpResendCountdown > 0) return;
    
    try {
      const response = await axios.post(`http://127.0.0.1:8000/order/resend-otp/${selectedOrder?.id}`);
      const newOtp = response.data.otp;
      
      setSelectedOrder(prev => prev ? { ...prev, delivery_otp: newOtp } : prev);
      startResendCountdown();
      toast.success(`New OTP sent!`, { duration: 5000 });
      sendNotification("OTP Resent", `Your new delivery OTP is ${newOtp}`);
    } catch (error) {
      console.error("Error resending OTP:", error);
      toast.error("Failed to resend OTP. Please try again.");
    }
  };

  const verifyOtpAndComplete = async () => {
    if (!enteredOtp || enteredOtp.length !== 6) {
      setOtpError("Please enter a valid 6-digit OTP");
      return;
    }
    
    try {
      const verifyResponse = await axios.post(`http://127.0.0.1:8000/order/verify-otp/${selectedOrder?.id}`, {
        otp: enteredOtp
      });
      
      if (verifyResponse.data.valid) {
        await axios.put(`http://127.0.0.1:8000/order/deliver/${selectedOrder?.id}`);
        toast.success("OTP verified! Order delivered successfully! 🎉", { duration: 5000, icon: "✅" });
        sendNotification("Order Delivered", `Your order ${selectedOrder?.order_number} has been delivered!`);
        setShowOtpModal(false);
        setEnteredOtp("");
        fetchOrders();
        setSelectedOrder(null);
      } else {
        setOtpError(verifyResponse.data.message || "Invalid OTP. Please try again.");
        setEnteredOtp("");
      }
    } catch (error: any) {
      console.error("Error verifying OTP:", error);
      setOtpError(error.response?.data?.message || "Failed to verify OTP. Please try again.");
      setEnteredOtp("");
    }
  };

  const startRealTimeTracking = (order: Order) => {
    if (!order.delivery_partner) return;
    const destLat = userLocation?.lat || order.destination?.lat || DELIVERY_LOCATIONS[0].lat;
    const destLng = userLocation?.lng || order.destination?.lng || DELIVERY_LOCATIONS[0].lng;
    setIsTracking(true);
    const startLat = WAREHOUSE_LOCATION.lat;
    const startLng = WAREHOUSE_LOCATION.lng;
    const totalSteps = 100;
    let currentStep = 0;
    const latStep = (destLat - startLat) / totalSteps;
    const lngStep = (destLng - startLng) / totalSteps;
    setDeliveryPosition({ lat: startLat, lng: startLng });
    setDeliveryRoute([[startLat, startLng]]);
    if (trackingInterval.current) clearInterval(trackingInterval.current);
    if (progressInterval.current) clearInterval(progressInterval.current);
    trackingInterval.current = setInterval(() => {
      if (currentStep < totalSteps) {
        currentStep++;
        const newLat = startLat + latStep * currentStep;
        const newLng = startLng + lngStep * currentStep;
        setDeliveryPosition({ lat: newLat, lng: newLng });
        setDeliveryRoute(prev => [...prev, [newLat, newLng]]);
        const remainingLat = destLat - newLat;
        const remainingLng = destLng - newLng;
        const remainingDistance = Math.sqrt(remainingLat * remainingLat + remainingLng * remainingLng) * 111;
        const remainingTime = Math.round(remainingDistance * 2);
        setEta(Math.max(1, remainingTime));
        setDistance(Math.round(remainingDistance));
      } else { simulateArrival(); }
    }, 2000);
    progressInterval.current = setInterval(() => {
      const progress = Math.round((currentStep / totalSteps) * 100);
      toast.success(`Delivery progress: ${progress}%`, { icon: "🚚", duration: 2000 });
    }, 10000);
  };

  const stopTracking = () => {
    if (trackingInterval.current) clearInterval(trackingInterval.current);
    if (progressInterval.current) clearInterval(progressInterval.current);
    setIsTracking(false);
    setDeliveryPosition(null);
    setDeliveryRoute([]);
  };

  const cancelOrder = async (orderId: number) => {
    try {
      await axios.put(`http://127.0.0.1:8000/order/cancel/${orderId}`);
      toast.success("Order cancelled successfully");
      fetchOrders();
    } catch (error: any) {
      toast.error(error.response?.data?.detail || "Failed to cancel order");
    }
  };

  const simulateManualDelivery = async (orderId: number) => {
    try {
      await axios.put(`http://127.0.0.1:8000/order/update-status/${orderId}?status=out_for_delivery`, {}, { headers: { 'Content-Type': 'application/json' } });
      const otpResponse = await axios.post(`http://127.0.0.1:8000/order/generate-otp/${orderId}`);
      const otp = otpResponse.data.otp;
      setOrders(prevOrders => prevOrders.map(order => order.id === orderId ? { ...order, order_status: "out_for_delivery", delivery_otp: otp } : order));
      toast.success(`Order #${orderId} is now Out for Delivery!`, { duration: 10000, icon: "🚚" });
      sendNotification("Order Out for Delivery", `Your order #${orderId} is out for delivery! OTP: ${otp}`);
      fetchOrders();
    } catch (error) {
      console.error("Error simulating delivery:", error);
      toast.error("Failed to simulate delivery.");
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "delivered": return <CheckCircleIcon className="w-5 h-5 text-green-500" />;
      case "out_for_delivery": return <TruckIcon className="w-5 h-5 text-orange-500" />;
      case "shipped": return <TruckIcon className="w-5 h-5 text-blue-500" />;
      case "processing": return <ClockIcon className="w-5 h-5 text-yellow-500" />;
      case "cancelled": return <XCircleIcon className="w-5 h-5 text-red-500" />;
      default: return <ClockIcon className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered": return "text-green-600 bg-green-50 border-green-200";
      case "out_for_delivery": return "text-orange-600 bg-orange-50 border-orange-200";
      case "shipped": return "text-blue-600 bg-blue-50 border-blue-200";
      case "processing": return "text-yellow-600 bg-yellow-50 border-yellow-200";
      case "cancelled": return "text-red-600 bg-red-50 border-red-200";
      default: return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "delivered": return "Delivered";
      case "out_for_delivery": return "Out for Delivery";
      case "shipped": return "Shipped";
      case "processing": return "Processing";
      case "cancelled": return "Cancelled";
      default: return status;
    }
  };

  const filteredOrders = filterStatus === "all" ? orders : orders.filter(order => order.order_status === filterStatus);
  const getStatusCount = (status: string) => status === "all" ? orders.length : orders.filter(order => order.order_status === status).length;

  const getEstimatedDeliveryText = (date: string) => {
    const deliveryDate = new Date(date);
    const today = new Date();
    const diffDays = Math.ceil((deliveryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays < 0) return "Delivered";
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Tomorrow";
    return `by ${deliveryDate.toLocaleDateString()}`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div><p className="mt-4 text-gray-600">Loading your orders...</p></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Toaster position="top-right" />
      
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white sticky top-0 z-10">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button onClick={() => router.push("/")} className="text-white hover:text-gray-200 transition">← Back to Home</button>
              <div><h1 className="text-2xl font-bold">My Orders</h1><p className="text-white/80 text-sm mt-1">Track and manage your orders in real-time</p></div>
            </div>
            <div className="flex gap-2">
              <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-lg">
                {locationStatus === "loading" && <><div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div><span className="text-sm">Getting location...</span></>}
                {locationStatus === "granted" && userLocation && <><GlobeAltIcon className="w-4 h-4 text-green-300" /><span className="text-sm">Live Location Active</span></>}
                {locationStatus === "denied" && <><GlobeAltIcon className="w-4 h-4 text-yellow-300" /><span className="text-sm">Using Default Location</span><button onClick={retryLocation} className="ml-2 text-xs bg-white/20 px-2 py-0.5 rounded hover:bg-white/30">Retry</button></>}
              </div>
              <button onClick={fetchOrders} className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-lg hover:bg-white/30 transition"><ArrowPathIcon className="w-4 h-4" /><span>Refresh</span></button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
          <div className="flex flex-wrap gap-3">
            {[
              { value: "all", label: "All Orders", icon: "📦" },
              { value: "processing", label: "Processing", icon: "⏳" },
              { value: "shipped", label: "Shipped", icon: "🚚" },
              { value: "out_for_delivery", label: "Out for Delivery", icon: "🚚" },
              { value: "delivered", label: "Delivered", icon: "✅" },
              { value: "cancelled", label: "Cancelled", icon: "❌" },
            ].map((filter) => (
              <button key={filter.value} onClick={() => setFilterStatus(filter.value)} className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 flex items-center gap-2 ${filterStatus === filter.value ? "bg-blue-600 text-white shadow-md" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}>
                <span>{filter.icon}</span><span>{filter.label}</span><span className={`px-1.5 py-0.5 rounded-full text-xs ${filterStatus === filter.value ? "bg-white/20 text-white" : "bg-gray-200 text-gray-600"}`}>{getStatusCount(filter.value)}</span>
              </button>
            ))}
          </div>
        </div>

        {filteredOrders.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4"><CubeIcon className="w-12 h-12 text-gray-400" /></div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No orders found</h3>
            <p className="text-gray-500 mb-6">{filterStatus === "all" ? "You haven't placed any orders yet" : `You don't have any ${filterStatus} orders`}</p>
            <button onClick={() => router.push("/")} className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition">Start Shopping</button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order, idx) => (
              <motion.div key={order.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }} className="bg-white rounded-xl shadow-sm hover:shadow-md transition overflow-hidden">
                <div className="p-6 border-b bg-gray-50/50">
                  <div className="flex flex-wrap justify-between items-start gap-4">
                    <div>
                      <div className="flex items-center gap-3 mb-2"><CubeIcon className="w-5 h-5 text-blue-600" /><p className="text-sm font-semibold text-gray-800">Order #{order.order_number}</p></div>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1"><CalendarIcon className="w-4 h-4" /><span>{new Date(order.created_at).toLocaleDateString()}</span></div>
                        <div className="flex items-center gap-1"><span>•</span><span>{order.items?.length || 0} items</span></div>
                        {order.estimated_delivery && <div className="flex items-center gap-1 text-green-600"><TruckIcon className="w-4 h-4" /><span>Est. Delivery: {getEstimatedDeliveryText(order.estimated_delivery)}</span></div>}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className={`px-3 py-1.5 rounded-full text-sm font-medium flex items-center gap-2 border ${getStatusColor(order.order_status)}`}>{getStatusIcon(order.order_status)}<span>{getStatusText(order.order_status)}</span></div>
                      <button onClick={() => { setSelectedOrder(order); if (order.order_status === "out_for_delivery" && order.delivery_partner) startRealTimeTracking(order); else if (order.order_status === "confirmed" || order.order_status === "processing") toast.info("Tracking will be available once order is out for delivery"); }} className="text-blue-600 hover:text-blue-700 text-sm flex items-center gap-1 px-3 py-1.5 rounded-lg hover:bg-blue-50 transition"><EyeIcon className="w-4 h-4" /><span>Track Order</span></button>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex flex-wrap justify-between items-center gap-4">
                    <div className="flex-1"><p className="text-gray-500 text-sm mb-1">Total Amount</p><p className="text-2xl font-bold text-blue-600">₹{order.total_amount.toLocaleString()}</p></div>
                    <div className="flex-1"><p className="text-gray-500 text-sm mb-2">Items</p><div className="flex -space-x-2">{order.items?.slice(0, 4).map((item, idx) => (<div key={idx} className="w-10 h-10 bg-gray-100 rounded-full border-2 border-white overflow-hidden" title={item.product_name}><img src={item.product_image || "https://via.placeholder.com/40"} alt={item.product_name} className="w-full h-full object-cover" /></div>))}{order.items?.length > 4 && <div className="w-10 h-10 bg-gray-200 rounded-full border-2 border-white flex items-center justify-center text-xs font-semibold text-gray-600">+{order.items.length - 4}</div>}</div></div>
                    <div className="flex gap-2 flex-wrap">
                      {order.order_status === "processing" && <button onClick={() => simulateManualDelivery(order.id)} className="px-4 py-2 border border-purple-500 text-purple-500 rounded-lg text-sm font-semibold hover:bg-purple-50 transition flex items-center gap-1"><TruckIcon className="w-4 h-4" /> Simulate Delivery</button>}
                      {order.order_status === "processing" && <button onClick={() => cancelOrder(order.id)} className="px-4 py-2 border border-red-500 text-red-500 rounded-lg text-sm font-semibold hover:bg-red-50 transition">Cancel Order</button>}
                      {order.order_status === "delivered" && !order.rating && <button onClick={() => { setSelectedOrder(order); setShowRatingModal(true); }} className="px-4 py-2 border border-yellow-500 text-yellow-500 rounded-lg text-sm font-semibold hover:bg-yellow-50 transition flex items-center gap-1"><StarIcon className="w-4 h-4" /> Rate Order</button>}
                      {order.order_status === "delivered" && <button onClick={() => { setSelectedOrder(order); setShowReturnModal(true); }} className="px-4 py-2 border border-orange-500 text-orange-500 rounded-lg text-sm font-semibold hover:bg-orange-50 transition flex items-center gap-1"><ArrowPathIcon className="w-4 h-4" /> Return/Replace</button>}
                      <button onClick={() => downloadInvoice(order)} className="px-4 py-2 border border-green-500 text-green-500 rounded-lg text-sm font-semibold hover:bg-green-50 transition flex items-center gap-1"><ArrowDownTrayIcon className="w-4 h-4" /> Invoice</button>
                      <button onClick={() => { setSelectedOrder(order); if (order.order_status === "out_for_delivery" && order.delivery_partner) startRealTimeTracking(order); }} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition flex items-center gap-1"><EyeIcon className="w-4 h-4" /> Track Order</button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Order Details Modal */}
      {isMounted && selectedOrder && (
        <AnimatePresence>
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => { setSelectedOrder(null); stopTracking(); }}>
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <div className="sticky top-0 bg-white p-4 border-b flex justify-between items-center">
                <div><h2 className="text-xl font-bold">Order Details</h2><p className="text-sm text-gray-500">Order #{selectedOrder.order_number}</p></div>
                <button onClick={() => { setSelectedOrder(null); stopTracking(); }} className="p-1 hover:bg-gray-100 rounded-lg transition"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button>
              </div>
              
              <div className="p-6 space-y-6">
                {/* Location Status */}
                <div className={`rounded-lg p-3 flex items-center justify-between ${locationStatus === "granted" ? "bg-green-50 border border-green-200" : "bg-yellow-50 border border-yellow-200"}`}>
                  <div className="flex items-center gap-2">
                    {locationStatus === "loading" && <><div className="animate-spin rounded-full h-5 w-5 border-2 border-blue-600 border-t-transparent"></div><span className="text-sm text-gray-600">Fetching your location...</span></>}
                    {locationStatus === "granted" && userLocation && <><GlobeAltIcon className="w-5 h-5 text-green-600" /><span className="text-sm text-gray-600">📍 Live location: {userLocation.lat.toFixed(4)}, {userLocation.lng.toFixed(4)}</span></>}
                    {locationStatus === "denied" && <><GlobeAltIcon className="w-5 h-5 text-yellow-600" /><span className="text-sm text-gray-600">⚠️ {locationError || "Using default location"}</span></>}
                  </div>
                  {locationStatus === "denied" && <button onClick={retryLocation} className="text-xs bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700">Retry Location</button>}
                </div>

                {/* Delivery Partner Info */}
                {selectedOrder.delivery_partner && (selectedOrder.order_status === "out_for_delivery" || selectedOrder.order_status === "shipped") && (
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4">
                    <h3 className="font-semibold mb-3 flex items-center gap-2"><TruckIcon className="w-5 h-5 text-blue-600" /> Delivery Partner</h3>
                    <div className="flex items-center gap-4">
                      <img src={selectedOrder.delivery_partner.profile_pic} alt="" className="w-12 h-12 rounded-full object-cover" />
                      <div className="flex-1"><p className="font-semibold">{selectedOrder.delivery_partner.name}</p><p className="text-sm text-gray-500 flex items-center gap-2"><StarIcon className="w-4 h-4 text-yellow-400" /> {selectedOrder.delivery_partner.rating} ★</p><p className="text-sm text-gray-500">{selectedOrder.delivery_partner.vehicle_number}</p></div>
                      <a href={`tel:${selectedOrder.delivery_partner.phone}`} className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-green-700 transition flex items-center gap-2"><PhoneIcon className="w-4 h-4" /> Call</a>
                    </div>
                    {eta > 0 && <div className="mt-3 pt-3 border-t border-blue-200"><p className="text-sm text-gray-600">⏱️ Estimated arrival in <span className="font-bold text-blue-600">{eta} minutes</span></p><p className="text-sm text-gray-500">📍 Distance: {distance} km away</p></div>}
                  </div>
                )}

                {/* Order Status Message */}
                {selectedOrder.order_status !== "out_for_delivery" && selectedOrder.order_status !== "delivered" && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
                    <ClockIcon className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                    <h3 className="font-semibold text-blue-800">Order Status: {getStatusText(selectedOrder.order_status)}</h3>
                    <p className="text-sm text-blue-600 mt-1">
                      {selectedOrder.order_status === "processing" && "Your order is being processed. Tracking will be available soon!"}
                      {selectedOrder.order_status === "shipped" && "Your order has been shipped! Tracking will be available shortly."}
                      {selectedOrder.order_status === "confirmed" && "Your order is confirmed! Delivery partner will be assigned soon."}
                    </p>
                  </div>
                )}

                {/* OTP Section */}
                {selectedOrder.order_status === "out_for_delivery" && selectedOrder.delivery_otp && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2"><KeyIcon className="w-5 h-5 text-yellow-600" /><h3 className="font-semibold text-yellow-800">Delivery OTP</h3></div>
                    <p className="text-sm text-yellow-700 mb-3">Share this OTP with the delivery partner to receive your order.<strong className="block mt-1 text-2xl font-mono tracking-wider text-center">{selectedOrder.delivery_otp}</strong></p>
                    <button onClick={() => { navigator.clipboard.writeText(selectedOrder.delivery_otp!); toast.success("OTP copied to clipboard!"); }} className="text-sm bg-white px-3 py-1 rounded border border-yellow-300 hover:bg-yellow-100 transition">Copy OTP</button>
                  </div>
                )}

                {/* Live Map Tracking */}
                {selectedOrder.order_status === "out_for_delivery" && (
                  <div className="border rounded-lg overflow-hidden">
                    <div className="bg-gray-50 p-3 border-b flex justify-between items-center">
                      <h3 className="font-semibold flex items-center gap-2"><MapPinIcon className="w-5 h-5 text-red-500" /> Live GPS Tracking</h3>
                      {isTracking && <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full animate-pulse">● Live</span>}
                      {userLocation && <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">📍 Your Location</span>}
                    </div>
                    <div className="h-96 w-full relative">
                      <MapContainer center={userLocation ? [userLocation.lat, userLocation.lng] : [WAREHOUSE_LOCATION.lat, WAREHOUSE_LOCATION.lng]} zoom={userLocation ? 15 : 12} style={{ height: "100%", width: "100%" }}>
                        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; OpenStreetMap' />
                        <Marker position={[WAREHOUSE_LOCATION.lat, WAREHOUSE_LOCATION.lng]} icon={warehouseIcon}><Popup>🏭 Warehouse</Popup></Marker>
                        {userLocation && (<><Marker position={[userLocation.lat, userLocation.lng]} icon={userLocationIcon}><Popup><div className="text-center"><p className="font-semibold text-blue-600">📍 You are here!</p><p className="text-sm text-gray-600">Your current location</p><p className="text-xs text-gray-500 mt-1">Lat: {userLocation.lat.toFixed(6)}<br />Lng: {userLocation.lng.toFixed(6)}</p></div></Popup></Marker><Circle center={[userLocation.lat, userLocation.lng]} radius={100} pathOptions={{ color: '#3B82F6', fillColor: '#3B82F6', fillOpacity: 0.1 }} /></>)}
                        {deliveryPosition && deliveryIcon && <Marker position={[deliveryPosition.lat, deliveryPosition.lng]} icon={deliveryIcon}><Popup><div className="text-center"><p className="font-semibold">{selectedOrder.delivery_partner?.name}</p><p className="text-sm text-green-600">Moving towards you!</p><p className="text-xs text-gray-500">ETA: {eta} minutes</p><p className="text-xs text-gray-400">Distance: {distance} km away</p></div></Popup></Marker>}
                        {deliveryRoute.length > 0 && <Polyline positions={deliveryRoute} color="#3B82F6" weight={4} opacity={0.8} />}
                      </MapContainer>
                    </div>
                    {isTracking && deliveryRoute.length > 0 && (
                      <div className="bg-gray-50 p-3">
                        <div className="flex justify-between text-sm text-gray-600 mb-1"><span>🏭 Warehouse</span><span>📍 Your Location {userLocation && "(Live)"}</span></div>
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden"><div className="h-full bg-blue-600 rounded-full transition-all duration-500" style={{ width: `${(deliveryRoute.length / 100) * 100}%` }} /></div>
                        <p className="text-center text-xs text-gray-500 mt-2">🚚 Delivery partner is on the way • ETA: {eta} minutes</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Order Items */}
                <div><h3 className="font-semibold mb-3">Items</h3><div className="space-y-3">{selectedOrder.items?.map((item: any, idx: number) => (<div key={idx} className="flex gap-3 border-b pb-3"><img src={item.product_image || "https://via.placeholder.com/80"} alt={item.product_name} className="w-16 h-16 object-cover rounded-lg" /><div className="flex-1"><p className="font-semibold text-gray-800">{item.product_name}</p><p className="text-sm text-gray-500">Quantity: {item.quantity}</p><p className="text-sm font-medium text-blue-600 mt-1">₹{item.product_price}</p></div><div className="text-right"><p className="font-bold">₹{item.product_price * item.quantity}</p></div></div>))}</div></div>

                {/* Price Summary */}
                <div className="border-t pt-4"><div className="flex justify-between items-center"><span className="text-gray-600">Subtotal</span><span>₹{selectedOrder.total_amount}</span></div><div className="flex justify-between items-center mt-2"><span className="text-gray-600">Shipping</span><span className="text-green-600">Free</span></div><div className="flex justify-between items-center mt-2 pt-2 border-t"><span className="text-lg font-bold">Total</span><span className="text-xl font-bold text-blue-600">₹{selectedOrder.total_amount}</span></div></div>

                {/* Shipping Address */}
                {selectedOrder.shipping_address && (<div className="border-t pt-4"><h3 className="font-semibold mb-2 flex items-center gap-2"><MapPinIcon className="w-5 h-5" /> Shipping Address</h3><div className="bg-gray-50 rounded-lg p-3"><p className="font-medium">{selectedOrder.shipping_address.fullName}</p><p className="text-sm text-gray-600">{selectedOrder.shipping_address.addressLine}</p><p className="text-sm text-gray-600">{selectedOrder.shipping_address.city}, {selectedOrder.shipping_address.state} - {selectedOrder.shipping_address.pincode}</p><p className="text-sm text-gray-600">Phone: {selectedOrder.shipping_address.phone}</p></div></div>)}

                {/* Rating Display */}
                {selectedOrder.rating && selectedOrder.rating > 0 && (
                  <div className="border-t pt-4">
                    <h3 className="font-semibold mb-2">Your Rating</h3>
                    <div className="flex items-center gap-2">
                      <div className="flex text-yellow-400">
                        {[...Array(5)].map((_, i) => i < selectedOrder.rating! ? <StarSolidIcon key={i} className="w-5 h-5 fill-current" /> : <StarIcon key={i} className="w-5 h-5" />)}
                      </div>
                      {selectedOrder.rating_comment && <p className="text-sm text-gray-600">{selectedOrder.rating_comment}</p>}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4 border-t flex-wrap">
                  <button onClick={() => downloadInvoice(selectedOrder)} className="px-4 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition flex items-center gap-2"><ArrowDownTrayIcon className="w-5 h-5" /> Download Invoice</button>
                  <button onClick={() => { setSelectedOrder(null); router.push("/"); }} className="flex-1 bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition">Continue Shopping</button>
                  {selectedOrder.order_status === "processing" && <button onClick={() => { cancelOrder(selectedOrder.id); setSelectedOrder(null); }} className="flex-1 border border-red-500 text-red-500 py-2 rounded-lg font-semibold hover:bg-red-50 transition">Cancel Order</button>}
                </div>
              </div>
            </motion.div>
          </div>
        </AnimatePresence>
      )}

      {/* OTP Verification Modal */}
      {isMounted && showOtpModal && selectedOrder && (
        <AnimatePresence>
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[60] p-4">
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="bg-white rounded-2xl max-w-md w-full overflow-hidden shadow-2xl">
              <div className="bg-gradient-to-r from-green-600 to-teal-600 p-4 text-white text-center"><ShieldCheckIcon className="w-12 h-12 mx-auto mb-2" /><h2 className="text-xl font-bold">Verify Delivery</h2><p className="text-sm text-white/80">Please provide OTP to complete delivery</p></div>
              <div className="p-6">
                <div className="text-center mb-6"><p className="text-gray-600 mb-2">Delivery Partner has arrived</p><div className="flex items-center justify-center gap-2 text-sm text-gray-500"><TruckIcon className="w-4 h-4" /><span>{selectedOrder.delivery_partner?.name}</span><span>•</span><span>{selectedOrder.delivery_partner?.vehicle_number}</span></div></div>
                <div className="mb-6"><label className="block text-sm font-medium text-gray-700 mb-2">Enter 6-digit OTP</label><input type="text" maxLength={6} value={enteredOtp} onChange={(e) => { const value = e.target.value.replace(/[^0-9]/g, ''); setEnteredOtp(value); setOtpError(""); }} className={`w-full text-center text-2xl tracking-widest py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono ${otpError ? "border-red-500 focus:ring-red-500" : "border-gray-300"}`} placeholder="------" autoFocus />{otpError && <p className="text-red-500 text-sm mt-1">{otpError}</p>}</div>
                <div className="mb-6 text-center"><p className="text-sm text-gray-500 mb-2">Didn't receive OTP? {otpResendCountdown > 0 ? `Wait ${otpResendCountdown}s` : ""}</p><button onClick={resendOtp} disabled={otpResendCountdown > 0} className={`text-sm font-medium ${otpResendCountdown > 0 ? "text-gray-400 cursor-not-allowed" : "text-blue-600 hover:text-blue-700"}`}>Resend OTP</button></div>
                <div className="flex gap-3"><button onClick={() => { setShowOtpModal(false); setEnteredOtp(""); setOtpError(""); }} className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition">Cancel</button><button onClick={verifyOtpAndComplete} className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition flex items-center justify-center gap-2"><CheckCircleIcon className="w-5 h-5" /> Verify & Complete</button></div>
              </div>
            </motion.div>
          </div>
        </AnimatePresence>
      )}

      {/* Rating Modal */}
      {showRatingModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[60] p-4">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="bg-white rounded-2xl max-w-md w-full overflow-hidden shadow-2xl">
            <div className="bg-gradient-to-r from-yellow-500 to-orange-500 p-4 text-white text-center"><StarIcon className="w-12 h-12 mx-auto mb-2" /><h2 className="text-xl font-bold">Rate Your Order</h2><p className="text-sm text-white/80">How was your shopping experience?</p></div>
            <div className="p-6">
              <div className="flex justify-center gap-2 mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button key={star} onClick={() => setRating(star)} className="focus:outline-none">
                    {star <= rating ? <StarSolidIcon className="w-10 h-10 text-yellow-400" /> : <StarIcon className="w-10 h-10 text-gray-300" />}
                  </button>
                ))}
              </div>
              <textarea placeholder="Write your review (optional)" value={ratingComment} onChange={(e) => setRatingComment(e.target.value)} className="w-full border rounded-lg p-3 h-24 resize-none focus:outline-none focus:ring-2 focus:ring-yellow-500" />
              <div className="flex gap-3 mt-4">
                <button onClick={() => setShowRatingModal(false)} className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50">Cancel</button>
                <button onClick={submitRating} className="flex-1 px-4 py-2 bg-yellow-500 text-white rounded-lg font-semibold hover:bg-yellow-600">Submit Rating</button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Return/Replace Modal */}
      {showReturnModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[60] p-4">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="bg-white rounded-2xl max-w-md w-full overflow-hidden shadow-2xl">
            <div className="bg-gradient-to-r from-red-500 to-orange-500 p-4 text-white text-center">
              <ArrowPathIcon className="w-12 h-12 mx-auto mb-2" />
              <h2 className="text-xl font-bold">Return / Replace</h2>
              <p className="text-sm text-white/80">Tell us the reason for return</p>
            </div>
            <div className="p-6">
              <div className="space-y-3 mb-4">
                {["Wrong item received", "Damaged product", "Size/ Fit issue", "Quality issue", "Missing parts", "Other"].map((reason) => (
                  <label key={reason} className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="radio" 
                      name="returnReason" 
                      value={reason} 
                      onChange={(e) => setReturnReason(e.target.value)} 
                      className="w-4 h-4" 
                    />
                    <span className="text-sm">{reason}</span>
                  </label>
                ))}
              </div>
              {returnReason === "other" && (
                <textarea 
                  placeholder="Please specify your reason" 
                  value={returnReasonOther} 
                  onChange={(e) => setReturnReasonOther(e.target.value)} 
                  className="w-full border rounded-lg p-2 h-20 resize-none focus:outline-none focus:ring-2 focus:ring-red-500 mb-4" 
                />
              )}
              <div className="flex gap-3">
                <button 
                  onClick={() => {
                    setShowReturnModal(false);
                    setReturnReason("");
                    setReturnReasonOther("");
                  }} 
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button 
                  onClick={submitReturnRequest} 
                  disabled={isSubmittingReturn}
                  className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSubmittingReturn ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                      Submitting...
                    </>
                  ) : (
                    "Submit Request"
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-6 mt-8">
        <div className="container mx-auto px-4 text-center text-sm text-gray-400"><p>&copy; 2024 ShopHub. All rights reserved. | Need help? Call us at 1800-123-4567</p></div>
      </footer>
    </div>
  );
}

