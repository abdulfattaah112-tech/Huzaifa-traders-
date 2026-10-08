import React, { useState, useEffect } from 'react';

import { getCategories } from './api/categories.js';
import { getProducts, createProduct, updateProduct, deleteProduct } from './api/products.js';
import { getOrders, createOrder, updateOrderStatus, updateOrderNotes, deleteOrder, deleteCompletedOrders } from './api/orders.js';
import { getHistory, createHistory, updateHistory, deleteHistory } from './api/history.js';
import { getBusinessDetails, updateBusinessDetails } from './api/businessDetails.js';
import { createCategory, deleteCategory } from './api/categories.js';

import HistoryDashboard from "./HistoryDashboard";
import SecurityDashboard from "./SecurityDashboard";
import FirewallTestCenter from "./FirewallTestCenter";
import CustomerAuth from "./CustomerAuth";
import { format } from "date-fns";
import jsPDF from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";
import { 
  Search, ShoppingBag, Menu, User, Bell, 
  Apple, Croissant, Leaf, CupSoda, Cookie,
  Clock, Star, Plus, Minus, X, Trash2, ArrowRight, ArrowLeft, Home, Grid, Heart, ShoppingCart, Settings, LogIn, Save,
  Printer, CheckCircle, ClipboardList, Check, Moon, Sun, MessageCircle, ArrowUp, MapPin, Phone, Navigation
} from 'lucide-react';
import './App.css';


const translations = {
  en: {
    
    searchPlaceholder: "Search for products...",
    inStock: "In Stock",
    rs: "Rs.",
    off: "OFF",
    cleaningProducts: "Cleaning Products",

    "Kodu Jharu": "Kodu Jharu",
    "Phool Jharu": "Phool Jharu",
    "Brush": "Brush",

    all: "All",
    backToStore: "Back to Store",
    backToProducts: "Back to Products",
    myCart: "My Cart",
    outOfStock: "Out of Stock",
    addToCart: "Add to Cart",

    home: "Home",
    products: "Products",
    contact: "Contact",
    cart: "Cart",
    wishlist: "Wishlist",
    admin: "Admin",
    logout: "Logout",
    heroTitle: "Welcome to Huzaifa Traders",
    heroDesc: "Huzaifa Traders is your trusted wholesale supplier of premium-quality Kodu Jharu, Phool Jharu, Floor Brushes, Wipers, and other household cleaning products. We deliver quality, affordability, and reliability to retailers and businesses across Pakistan.",
    shopNow: "Shop Now",
    exploreCategories: "Explore Categories",
    allCategories: "All Categories",
    categories: "Categories",
    ourProducts: "Our Products",
    addToCart: "Add to Cart",
    outOfStock: "Out of Stock",
    noProducts: "No products found in this category.",
    contactUs: "Contact Us",
    address: "123 Market Street, Foodville",
    phone: "+1 234 567 8900",
    email: "contact@huzaifatraders.com",
    openingHours: "Mon-Sat: 8am - 10pm",
    quickLinks: "Quick Links",
    aboutUs: "About Us",
    deliveryInfo: "Delivery Information",
    privacyPolicy: "Privacy Policy",
    termsConditions: "Terms & Conditions",
    newsletter: "Newsletter",
    newsletterDesc: "Subscribe for fresh updates and offers.",
    subscribe: "Subscribe",
    rightsReserved: "All rights reserved.",
    checkout: "Checkout",
    subtotal: "Subtotal",
    total: "Total",
    items: "items",
    item: "item",
    emptyCart: "Your cart is empty",
    startShopping: "Looks like you haven't added anything to your cart yet.",
    placeOrder: "Place Order",
    customerInfo: "Customer Information",
    fullName: "Full Name",
    mobileNumber: "Mobile Number",
    deliveryAddress: "Delivery Address",
    adminPanel: "Admin Panel",
    dashboard: "Dashboard",
    orders: "Orders",
    settings: "Settings",
    addProduct: "Add New Product",
    productName: "Product Name",
    productNameUr: "Product Name (Urdu)",
    description: "Description",
    descriptionUr: "Description (Urdu)",
    price: "Price",
    category: "Category",
    imageURL: "Image URL",
    stock: "Stock",
    saveProduct: "Save Product",
    manageProducts: "Manage Products",
    manageCategories: "Manage Categories",
    storeSettings: "Store Settings",
    storeName: "Store Name",
    currency: "Currency",
    saveSettings: "Save Settings",
    pending: "Pending",
    completed: "Completed",
    totalOrders: "Total Orders",
    totalRevenue: "Total Revenue",
    manageOrders: "Manage Orders",
    printAll: "Print All",
    orderId: "Order ID",
    customer: "Customer",
    status: "Status",
    actions: "Actions",
    noOrders: "No orders yet.",
    printReceipt: "Print Receipt",
    completeOrder: "Complete",
    sendWhatsApp: "WhatsApp",
    language: "Language",
    emptyWishlist: "Your wishlist is empty",
    emptyWishlistDesc: "Looks like you haven't saved any items yet."
  },
  ur: {
    
    searchPlaceholder: "مصنوعات تلاش کریں...",
    inStock: "اسٹاک میں",
    rs: "روپے",
    off: "رعایت",
    cleaningProducts: "صفائی کی مصنوعات",

    "Kodu Jharu": "کودو جھاڑو",
    "Phool Jharu": "پھول جھاڑو",
    "Brush": "برش",
    "Wiper": "واپر",

    all: "سب",
    backToStore: "اسٹور پر واپس جائیں",
    backToProducts: "مصنوعات پر واپس جائیں",
    myCart: "میرا کارٹ",
    outOfStock: "اسٹاک ختم",
    addToCart: "کارٹ میں شامل کریں",

    home: "ہوم",
    products: "مصنوعات",
    contact: "رابطہ کریں",
    cart: "کارٹ",
    wishlist: "پسندیدہ",
    admin: "ایڈمن",
    logout: "لاگ آؤٹ",
    heroTitle: "حذیفہ ٹریڈرز میں خوش آمدید",
    heroDesc: "حذیفہ ٹریڈرز پریمیم کوالٹی کودو جھاڑو، پھول جھاڑو، فرش کے برش، وائپرز اور گھریلو صفائی کی دیگر مصنوعات کا آپ کا بھروسہ مند ہول سیل سپلائر ہے۔ ہم پورے پاکستان میں ریٹیلرز اور کاروباروں کو معیاری اور قابل اعتماد مصنوعات سستے داموں فراہم کرتے ہیں۔",
    shopNow: "ابھی خریدیں",
    exploreCategories: "کیٹیگریز دیکھیں",
    allCategories: "تمام کیٹیگریز",
    categories: "کیٹیگریز",
    ourProducts: "ہماری مصنوعات",
    addToCart: "کارٹ میں شامل کریں",
    outOfStock: "دستیاب نہیں",
    noProducts: "اس کیٹیگری میں کوئی مصنوعات نہیں ملیں۔",
    contactUs: "ہم سے رابطہ کریں",
    address: "123 مارکیٹ اسٹریٹ، فوڈویل",
    phone: "+1 234 567 8900",
    email: "contact@huzaifatraders.com",
    openingHours: "پیر تا ہفتہ: صبح 8 سے رات 10",
    quickLinks: "فوری لنکس",
    aboutUs: "ہمارے بارے میں",
    deliveryInfo: "ترسیل کی معلومات",
    privacyPolicy: "رازداری کی پالیسی",
    termsConditions: "شرائط و ضوابط",
    newsletter: "نیوز لیٹر",
    newsletterDesc: "تازہ ترین اپڈیٹس اور آفرز کے لیے سبسکرائب کریں۔",
    subscribe: "سبسکرائب کریں",
    rightsReserved: "جملہ حقوق محفوظ ہیں۔",
    checkout: "چیک آؤٹ",
    subtotal: "کل رقم",
    total: "کل",
    items: "اشیاء",
    item: "شے",
    emptyCart: "آپ کا کارٹ خالی ہے",
    startShopping: "ایسا لگتا ہے کہ آپ نے کارٹ میں کچھ شامل نہیں کیا۔",
    placeOrder: "آرڈر دیں",
    customerInfo: "گاہک کی معلومات",
    fullName: "پورا نام",
    mobileNumber: "موبائل نمبر",
    deliveryAddress: "ترسیل کا پتہ",
    adminPanel: "ایڈمن پینل",
    dashboard: "ڈیش بورڈ",
    orders: "آرڈرز",
    settings: "ترتیبات",
    addProduct: "نئی پروڈکٹ شامل کریں",
    productName: "پروڈکٹ کا نام",
    productNameUr: "پروڈکٹ کا نام (اردو)",
    description: "تفصیل",
    descriptionUr: "تفصیل (اردو)",
    price: "قیمت",
    category: "کیٹیگری",
    imageURL: "تصویر کا یو آر ایل",
    stock: "اسٹاک",
    saveProduct: "محفوظ کریں",
    manageProducts: "مصنوعات کا انتظام",
    manageCategories: "کیٹیگریز کا انتظام",
    storeSettings: "اسٹور کی ترتیبات",
    storeName: "اسٹور کا نام",
    currency: "کرنسی",
    saveSettings: "محفوظ کریں",
    pending: "زیر التواء",
    completed: "مکمل",
    totalOrders: "کل آرڈرز",
    totalRevenue: "کل آمدنی",
    manageOrders: "آرڈرز کا انتظام",
    printAll: "سب پرنٹ کریں",
    orderId: "آرڈر آئی ڈی",
    customer: "گاہک",
    status: "حیثیت",
    actions: "ایکشنز",
    noOrders: "ابھی کوئی آرڈر نہیں ہے۔",
    printReceipt: "رسید پرنٹ کریں",
    completeOrder: "مکمل کریں",
    sendWhatsApp: "واٹس ایپ",
    language: "زبان",
    emptyWishlist: "آپ کی پسندیدہ اشیاء کی فہرست خالی ہے",
    emptyWishlistDesc: "ایسا لگتا ہے کہ آپ نے کوئی شے محفوظ نہیں کی۔"
  }
};

const MOCK_PRODUCTS = [
  {
    id: 1,
    name: 'Kodu Jharu',
    nameUr: 'کودو جھاڑو',
    weight: '1 piece',
    price: 5.99,
    oldPrice: null,
    rating: 4.8,
    image: '/kodu_jharu.jpg',
    discount: null,
    isNew: true,
    category: 'Kodu Jharu',
    stock: 150,
    shortDescription: 'Strong outdoor broom for sweeping courtyards, roads, warehouses, and rough surfaces.',
    shortDescriptionUr: 'صحن اور کھردری سطحوں کی صفائی کے لیے مضبوط بیرونی جھاڑو۔',
    description: 'The Kodu Jharu is a traditional, heavy-duty broom designed for the toughest cleaning jobs. Crafted from durable natural fibers, it effortlessly sweeps away leaves, dust, and debris from rough outdoor surfaces like concrete, stone, and asphalt. Built to last, it is an essential tool for maintaining clean courtyards, warehouses, and driveways.',
    descriptionUr: 'کودو جھاڑو ایک روایتی اور مضبوط جھاڑو ہے جو سخت صفائی کے لیے بنایا گیا ہے۔ قدرتی ریشوں سے تیار کردہ، یہ صحن، گودام اور کھردری سطحوں سے دھول اور کچرا آسانی سے صاف کرتا ہے۔',
    specifications: [
      { key: 'Material', value: 'Natural hard fibers' },
      { key: 'Usage', value: 'Outdoor, rough surfaces' },
      { key: 'Durability', value: 'High' }
    ],
    featured: true,
    bestSeller: true,
    enabled: true,
    images: ['/kodu_jharu.jpg'],
    reviews: []
  },
  {
    id: 2,
    name: 'Phool Jharu',
    nameUr: 'پھول جھاڑو',
    weight: '1 piece',
    price: 3.49,
    oldPrice: 4.00,
    rating: 4.9,
    image: '/phool_jharu.jpg',
    discount: '12% OFF',
    category: 'Phool Jharu',
    stock: 200,
    shortDescription: 'Soft broom designed for indoor floor cleaning and daily dust removal.',
    shortDescriptionUr: 'اندرونی فرش اور روزمرہ کی دھول صاف کرنے کے لیے نرم جھاڑو۔',
    description: 'Experience effortless indoor cleaning with the Phool Jharu. Made from premium, soft natural grass, this broom is gentle on all types of indoor floors, including tiles, marble, and wood. Its dense bristles effectively capture fine dust and hair, making daily sweeping a breeze without leaving scratches.',
    descriptionUr: 'پھول جھاڑو کے ساتھ اندرونی صفائی کا بہترین تجربہ کریں۔ نرم قدرتی گھاس سے بنا یہ جھاڑو ٹائل، ماربل اور لکڑی کے فرش کے لیے بہترین ہے۔ یہ باریک دھول اور بالوں کو آسانی سے سمیٹتا ہے۔',
    specifications: [
      { key: 'Material', value: 'Soft natural grass' },
      { key: 'Usage', value: 'Indoor, smooth floors' },
      { key: 'Weight', value: 'Lightweight' }
    ],
    featured: true,
    bestSeller: true,
    enabled: true,
    images: ['/phool_jharu.jpg'],
    reviews: []
  },
  {
    id: 3,
    name: 'Cleaning Brush',
    nameUr: 'صفائی کا برش',
    weight: '1 piece',
    price: 2.99,
    oldPrice: null,
    rating: 4.7,
    image: '/cleaning_brush.jpg',
    discount: null,
    category: 'Brush',
    stock: 300,
    shortDescription: 'Durable scrubbing brush suitable for bathrooms, kitchens, tiles, and heavy-duty cleaning.',
    shortDescriptionUr: 'باتھ روم اور کچن کی ٹائلز کے لیے مضبوط برش۔',
    description: 'Tackle tough stains and grime with our Heavy-Duty Cleaning Brush. Featuring stiff, durable bristles and an ergonomic handle, it provides excellent scrubbing power for bathrooms, kitchen tiles, and floors. The brush is designed to reach into corners and grout lines, ensuring a sparkling clean finish every time.',
    descriptionUr: 'ہمارے مضبوط صفائی کے برش کے ساتھ ضدی داغوں کو صاف کریں۔ اس کے سخت ریشے اور آرام دہ ہینڈل باتھ روم اور کچن کی ٹائلز کی بہترین صفائی فراہم کرتے ہیں۔',
    specifications: [
      { key: 'Bristle Type', value: 'Stiff synthetic' },
      { key: 'Handle', value: 'Ergonomic plastic' },
      { key: 'Usage', value: 'Tiles, bathroom, kitchen' }
    ],
    featured: false,
    bestSeller: false,
    enabled: true,
    images: ['/cleaning_brush.jpg'],
    reviews: []
  },
  {
    id: 4,
    name: 'Floor Wiper',
    nameUr: 'فلور وائپر',
    weight: '1 piece',
    price: 8.99,
    oldPrice: 10.00,
    rating: 4.6,
    image: '/floor_wiper.jpg',
    discount: '10% OFF',
    isNew: true,
    category: 'Wiper',
    stock: 80,
    shortDescription: 'High-quality floor wiper for removing water and keeping floors clean and dry.',
    description: 'Keep your floors spotless and dry in seconds with our Premium Floor Wiper. The high-quality rubber blade seamlessly sweeps away water, spills, and dirt without leaving streaks. Complete with a sturdy, rust-resistant handle, it is perfect for bathrooms, kitchens, and large living areas.',
    specifications: [
      { key: 'Blade Material', value: 'High-grade rubber' },
      { key: 'Handle Material', value: 'Stainless steel / Plastic' },
      { key: 'Usage', value: 'Water removal, smooth floors' }
    ],
    featured: false,
    bestSeller: true,
    enabled: true,
    images: ['/floor_wiper.jpg'],
    reviews: []
  }
];
const INITIAL_CATEGORIES = [
  { name: 'Kodu Jharu',
    nameUr: 'کودو جھاڑو', image: '/kodu_jharu.jpg', active: true },
  { name: 'Phool Jharu',
    nameUr: 'پھول جھاڑو', image: '/phool_jharu.jpg', active: false },
  { name: 'Brush', image: '/cleaning_brush.jpg', active: false },
  { name: 'Wiper', image: '/floor_wiper.jpg', active: false }
];

function App() {
  const [language, setLanguage] = useState(() => localStorage.getItem('app_language') || 'ur');
  const t = (key) => (translations[language] && translations[language][key]) || translations['en'][key] || key;

  useEffect(() => {
    localStorage.setItem('app_language', language);
    document.documentElement.dir = language === 'ur' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language]);

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'ur' : 'en');
  };

  const getProductName = (product) => {
    if (!product) return '';
    return language === 'ur' && product.nameUr ? product.nameUr : product.name;
  };

  const getProductDesc = (product) => {
    if (!product) return '';
    return language === 'ur' && product.descriptionUr ? product.descriptionUr : product.description;
  };

  const getProductShortDesc = (product) => {
    if (!product) return '';
    return language === 'ur' && product.shortDescriptionUr ? product.shortDescriptionUr : product.shortDescription;
  };

  const [categories, setCategories] = useState([]);

  const [messageTemplate, setMessageTemplate] = useState(() => {
    const saved = localStorage.getItem('messageTemplate');
    return saved || `ہیلو {CustomerName}،\n\nحذیفہ ٹریڈرز سے آپ کا آرڈر اب پک اپ / ڈیلیوری کے لیے تیار ہے۔\n\nآرڈر آئی ڈی: {OrderID}\n\nحذیفہ ٹریڈرز کا انتخاب کرنے کا شکریہ۔\n\nکسی بھی سوال کے لیے، براہ کرم ہم سے رابطہ کریں۔\n\nوالسلام،\nحذیفہ ٹریڈرز`;
  });

  const [products, setProducts] = useState([]);
  const [history, setHistory] = useState([]);


  const [cartOpen, setCartOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [currentView, setCurrentView] = useState('home');
  const [activeProduct, setActiveProduct] = useState(null);
  const [activeCategory, setActiveCategory] = useState("");
  
  // Sync currentView with Browser History for Mobile Back Button
  useEffect(() => {
    // Require admin password on every refresh by logging out on mount
    fetch("/api/admin/logout", { method: 'POST' }).catch(() => {});
    setIsAdminAuthenticated(false);
    localStorage.removeItem("freshmart_admin_hint");
  }, []);

  useEffect(() => {
    if (!window.history.state) {
      window.history.replaceState({ view: currentView }, '', `?view=${currentView}`);
    } else if (window.history.state.view !== currentView) {
      window.history.pushState({ view: currentView }, '', `?view=${currentView}`);
    }
  }, [currentView]);

  useEffect(() => {
    const handlePopState = (event) => {
      if (event.state && event.state.view) {
        setCurrentView(event.state.view);
      } else {
        setCurrentView('home');
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState('');
  const [wishlistItems, setWishlistItems] = useState([]);
  
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [adminUsernameInput, setAdminUsernameInput] = useState('');
  const [adminPasswordInput, setAdminPasswordInput] = useState('');
  
  const [orders, setOrders] = useState([]);


  
  const fetchHistory = async () => {
    try {
      let error; let data; try { const res = await getHistory(); data = res.data; } catch(e) { error = e; }
      if (error) throw error;
      setHistory(data || []);
    } catch (err) {
      console.error("Error fetching history:", err.message);
    }
  };

  const fetchProducts = async () => {
    let error; let data; try { const res = await getProducts(); data = res.data; } catch(e) { error = e; }
    if (data) setProducts(data);
  };

  const fetchOrders = async () => {
    let error; let data; try { const res = await getOrders(); data = res.data; } catch(e) { error = e; }
    if (data) {
      setOrders(data.map(o => ({
        ...o,
        id: '#ORD-' + String(o.id).padStart(5, '0'),
        dbId: o.id,
        customerName: o.customer_name,
        paymentMethod: o.payment_method || 'Cash on Delivery',
        paymentStatus: o.payment_status || 'Pending',
        customerNotes: o.customer_notes || '',
        internalNotes: o.internal_notes || ''
      })));
    }
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await getCategories();
        if (data && data.length > 0) {
          setCategories(data);
        } else {
          const defaults = [
            { name: "Kodu Jharu", active: true },
            { name: "Phool Jharu", active: true },
            { name: "Brush", active: true },
            { name: "Wiper", active: true }
          ];
          // Leaving the insert untouched for now to migrate only the select
          
          setCategories(defaults);
        }
      } catch (err) {
        console.error('Error fetching categories from Neon:', err);
      }
    };

    const fetchBusinessDetails = async () => {
      try {
        const res = await getBusinessDetails(); const bd = res && res.data ? res.data[0] : null;
        if (bd) {
          let phoneStr = bd.phone || '';
          let actualPhone = phoneStr;
          let whatsappNum = '';
          if (phoneStr.includes('|||')) {
            const parts = phoneStr.split('|||');
            actualPhone = parts[0];
            whatsappNum = parts[1];
          } else {
            whatsappNum = phoneStr.replace(/[^0-9]/g, '');
          }
          const updatedDetails = {
            address: bd.address || '',
            phone: actualPhone,
            whatsapp: whatsappNum || '923001234567',
            mapUrl: bd.map_url || '',
            emailKey: bd.email_key || '',
            emailEnabled: bd.email_enabled || false,
            whatsappApiKey: bd.whatsapp_api_key || ''
          };
          setBusinessDetails(updatedDetails);
          localStorage.setItem('freshmart_business', JSON.stringify(updatedDetails));
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchProducts();
    fetchOrders();
    fetchHistory();
    fetchCategories();
    fetchBusinessDetails();

    const eventSource = new EventSource('/api/neon/realtime');
      eventSource.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.type === 'heartbeat' || data.type === 'connected') return;
        if (data.resource === 'products') fetchProducts();
        if (data.resource === 'orders') fetchOrders();
        if (data.resource === 'categories') fetchCategories();
      };

    return () => {
      eventSource.close();
    };
  }, []);

  const [isCheckoutForm, setIsCheckoutForm] = useState(false);
  const [checkoutData, setCheckoutData] = useState({ name: '', phone: '', address: '', paymentMethod: 'Cash on Delivery', customerNotes: '' });
  
  const [adminTab, setAdminTab] = useState('products');
  const [orderSearchQuery, setOrderSearchQuery] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState('All');


  const [newProduct, setNewProduct] = useState({ nameUr: '', descriptionUr: '', name: '', weight: '', price: '', image: '', discount: '', category: '', stock: 0, shortDescription: '', description: '', specifications: [], featured: false, bestSeller: false, enabled: true, images: [], reviews: [] });

  const [productVideo, setProductVideo] = useState('');

  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('freshmart_theme');
    if (saved) return saved === 'dark';
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  const [showBackToTop, setShowBackToTop] = useState(false);

  const [userProfile, setUserProfile] = useState(null);
  const [customerAuth, setCustomerAuth] = useState({ isAuthenticated: false, user: null });
  
  // Load real profile on mount
  useEffect(() => {
    fetch("/api/neon/auth/profile")
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setCustomerAuth({ isAuthenticated: true, user: data.user });
          setUserProfile(data.user);
        }
      })
      .catch(() => {});
  }, []);

  // Auto-populate checkout data when user is logged in
  useEffect(() => {
    if (isCheckoutForm && userProfile && customerAuth?.isAuthenticated) {
      setCheckoutData(prev => ({
        ...prev,
        name: prev.name || userProfile.name || '',
        phone: prev.phone || userProfile.phone || '',
        address: prev.address || userProfile.address || ''
      }));
    }
  }, [isCheckoutForm, userProfile, customerAuth?.isAuthenticated]);

      const [businessDetails, setBusinessDetails] = useState(() => {
    const saved = localStorage.getItem('freshmart_business');
    return saved ? JSON.parse(saved) : {
      address: 'Shah Faisal Colony, Karachi, Pakistan',
      phone: '+92 300 1234567',
      whatsapp: '923001234567',
      mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14479.880400810237!2d67.1423456!3d24.8903932!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3eb339ef14cda64b%3A0xa196ab5cd3e545!2sShah%20Faisal%20Colony%2C%20Karachi%2C%20Karachi%20City%2C%20Sindh%2C%20Pakistan!5e0!3m2!1sen!2s!4v1700000000000!5m2!1sen!2s'
    };
  });
  const [isSavingBusiness, setIsSavingBusiness] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
    localStorage.setItem('freshmart_theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e) => {
      setIsDarkMode(e.matches);
    };
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);






  useEffect(() => { localStorage.setItem('freshmart_categories', JSON.stringify(categories)); }, [categories]);
    useEffect(() => { localStorage.setItem('freshmart_wishlist', JSON.stringify(wishlistItems)); }, [wishlistItems]);
    useEffect(() => { localStorage.setItem('freshmart_video', productVideo); }, [productVideo]);
  useEffect(() => { localStorage.setItem('freshmart_business', JSON.stringify(businessDetails)); }, [businessDetails]);
    useEffect(() => { localStorage.setItem('freshmart_userprofile', JSON.stringify(userProfile)); }, [userProfile]);
  useEffect(() => { localStorage.setItem('freshmart_theme', isDarkMode ? 'dark' : 'light'); }, [isDarkMode]);

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    try {
      if (productVideo && !productVideo.startsWith('blob:')) {
        localStorage.setItem('freshmart_video', productVideo);
      }
    } catch (e) {
      console.warn("Storage quota exceeded", e);
    }
  }, [productVideo]);

  


  const toggleWishlist = (product) => {
    if (wishlistItems.find(item => item.id === product.id)) {
      setWishlistItems(wishlistItems.filter(item => item.id !== product.id));
      showToast('Removed from wishlist');
    } else {
      setWishlistItems([...wishlistItems, product]);
      showToast('Added to wishlist');
    }
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const handleAdminLogout = async () => {
    try {
      await fetch("/api/admin/logout", { method: 'POST' });
    } catch (e) {
      console.error(e);
    }
    setIsAdminAuthenticated(false); localStorage.removeItem("freshmart_admin_hint");
    window.csrfToken = null;
    showToast('Logged out successfully');
  };
  const handleAdminLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/admin/login", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: adminUsernameInput, password: adminPasswordInput })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setIsAdminAuthenticated(true); localStorage.setItem("freshmart_admin_hint", "true"); showToast('Login successful!'); fetchOrders(); fetchHistory();
        setAdminUsernameInput('');
        setAdminPasswordInput('');
        // Fetch CSRF token after login
        const csrfRes = await fetch("/api/csrf-token", { cache: 'no-store' });
        if (csrfRes.ok) {
          const csrfData = await csrfRes.json();
          window.csrfToken = csrfData.csrfToken;
          localStorage.setItem('csrf_token', csrfData.csrfToken);
        }
      } else {
        showToast(data.error || 'Incorrect credentials!');
      }
    } catch (err) {
      showToast('Login failed. Server error.');
    }
  };

  
  const handleSaveBusinessDetails = async () => {
    setIsSavingBusiness(true);
    try {
      // ALWAYS save locally as fallback
      localStorage.setItem('freshmart_business', JSON.stringify(businessDetails));
      
      let data; try { const res = await getBusinessDetails(); data = res.data; } catch(e) {}
      if (data && data.length > 0) {
        const phoneData = `${businessDetails.phone}|||${businessDetails.whatsapp}`;
        let error; try { await updateBusinessDetails(data[0].id, {
          address: businessDetails.address,
          phone: phoneData,
          map_url: businessDetails.mapUrl,
          email_key: businessDetails.emailKey,
          email_enabled: businessDetails.emailEnabled,
          whatsapp_api_key: businessDetails.whatsappApiKey
        }); } catch(e) { error = e; }
      } else {
        const phoneData = `${businessDetails.phone}|||${businessDetails.whatsapp}`;
        let error; try { /* not using insert for bd */ } catch(e) { error = e; }
      }
      showToast('Business details saved successfully!');
    } catch (e) {
      showToast('Business details saved locally!');
    } finally {
      setIsSavingBusiness(false);
    }
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!checkoutData.name || !checkoutData.phone || !checkoutData.address) {
      showToast('Please fill all checkout fields');
      return;
    }
    try {
      const responseData = await createOrder({ customer_name: checkoutData.name, mobile: checkoutData.phone, address: checkoutData.address, items: cartItems.map(i => ({ id: i.id, quantity: i.quantity })), payment_method: checkoutData.paymentMethod, customer_notes: checkoutData.customerNotes }); if (!responseData.success) {
        throw new Error(responseData.error || 'Failed to place order');
      }

      const o = responseData.order;
      const placedId = '#ORD-' + String(o.id).padStart(5, '0');
      
      setOrders([{
        ...o,
        id: placedId,
        dbId: o.id,
        customerName: o.customer_name
      }, ...orders]);
      
      // Update local state for stock immediately
      for (const item of cartItems) {
        setProducts(prevProducts => prevProducts.map(p => 
          p.id === item.id ? { ...p, stock: Math.max(0, (p.stock || 0) - item.quantity) } : p
        ));
      }

      setCartItems([]);
      setCheckoutData({ name: '', phone: '', address: '', paymentMethod: 'Cash on Delivery', customerNotes: '' });
      setIsCheckoutForm(false);
      setCartOpen(false);
      showToast(`Order ${placedId} placed!`);
      
      try {
        if (businessDetails.whatsappApiKey) {
          const orderSummary = (o.items || []).map(i => `${i.quantity}x ${i.name}`).join('\n');
          const text = `*New Order: ${placedId}*\n*Name:* ${o.customer_name}\n*Phone:* ${o.mobile}\n*Address:* ${o.address}\n\n*Items:*\n${orderSummary}\n\n*Total: Rs ${o.total}*\n*Payment:* ${o.payment_method || 'Cash on Delivery'}`;
          
          const phoneForBot = businessDetails.whatsapp.replace(/[^0-9]/g, '');
          const url = `https://api.callmebot.com/whatsapp.php?phone=${phoneForBot}&text=${encodeURIComponent(text)}&apikey=${businessDetails.whatsappApiKey}`;
          
          fetch(url, { mode: 'no-cors' }).catch(err => console.error("CallMeBot fetch error:", err));
        }
      } catch (err) {
        console.error("WhatsApp notification error:", err);
      }
      
    } catch (error) {
      console.error("Order API error:", error);
      showToast(error.message);
    }
  };

  const handleMarkCompleted = (orderId) => {
    setOrders(orders.map(o => o.id === orderId ? { ...o, status: 'Completed' } : o));
    showToast(`Order ${orderId} marked as completed`);
  };

  const handleChangeOrderStatus = async (orderId, newStatus) => {
    const order = orders.find(o => o.id === orderId);
    if (!order) return;
    let error; try { await updateOrderStatus(order.dbId, newStatus); } catch(e) { error = e; }
    if (error) {
      showToast('Error updating status: ' + error.message);
      return;
    }
    setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    showToast(`Order status updated to ${newStatus}`);
  };

  const handleCompleteAndNotify = async (order) => {
    let error; try { await updateOrderStatus(order.dbId, 'Completed'); } catch(e) { error = e; }
    
    try {
      const today = new Date();
      const dateStr = format(today, 'yyyy-MM-dd');
      const dayStr = format(today, 'EEEE');
      
      const currentStock = products.reduce((sum, p) => sum + (Number(p.stock) || 0), 0);
      const outOfStockCount = products.filter(p => Number(p.stock) <= 0).length;
      
      const orderItems = order.items || [];
      const orderTotal = Number(order.total) || 0;
      const itemsCount = orderItems.reduce((sum, item) => sum + (item.quantity || 1), 0);
      
      const soldItemsArr = orderItems.map(item => ({
        name: item.name,
        quantity: item.quantity || 1,
        price: item.price
      }));

      const existingHistory = null; // Mock since we moved to backend history tracking completely.
        
      if (existingHistory) {
        const updatedSoldItems = [...(existingHistory.soldItems || []), ...soldItemsArr];
        await updateHistory(existingHistory.id, { totalStock : currentStock,
          totalItemsSold: (existingHistory.totalItemsSold || 0) + itemsCount,
          salesAmount: (Number(existingHistory.salesAmount) || 0) + orderTotal,
          earnings: (Number(existingHistory.earnings) || 0) + orderTotal,
          outOfStockItems: outOfStockCount,
          soldItems: updatedSoldItems
         });
      } else {
        await createHistory({ date: dateStr, 
          day: dayStr,
          totalStock: currentStock,
          totalItemsSold: itemsCount,
          salesAmount: orderTotal,
          earnings: orderTotal,
          outOfStockItems: outOfStockCount,
          soldItems: soldItemsArr
         });
      }
      fetchHistory();
    } catch (err) {
      console.error("Error updating history:", err.message);
    }

    if (error) {
      showToast('Error completing order: ' + error.message);
      return;
    }
    setOrders(orders.map(o => o.id === order.id ? { 
      ...o, 
      status: 'Completed',
      notificationSent: true,
      notificationTime: new Date().toISOString()
    } : o));
    showToast(`Order Completed! Notification simulating sent to ${order.mobile}`);
  };

  const handleSaveInternalNotes = async (orderId, notes) => {
    const order = orders.find(o => o.id === orderId);
    if (!order) return;
    let error; try { await updateOrderNotes(order.dbId, notes); } catch(e) { error = e; }
    if (!error) {
      showToast('Internal notes saved');
      setOrders(orders.map(o => o.id === orderId ? { ...o, internalNotes: notes } : o));
    }
  };
  const handleDeleteAllCompleted = async () => {
    const completedOrders = orders.filter(o => o.status === 'Completed');
    if (completedOrders.length === 0) {
      showToast('No completed orders to delete.');
      return;
    }
    if (window.confirm(`Are you sure you want to permanently delete all ${completedOrders.length} completed orders?`)) {
      let error; try { await deleteCompletedOrders(); } catch(e) { error = e; }
      if (error) {
        showToast('Error deleting orders: ' + error.message);
        return;
      }
      setOrders(orders.filter(o => o.status !== 'Completed'));
      showToast(`Successfully deleted ${completedOrders.length} completed orders.`);
    }
  };
  const handleDeleteOrder = async (order) => {
    if (window.confirm(`Are you sure you want to delete order ${order.id}?`)) {
      let error; try { await deleteOrder(order.dbId); } catch(e) { error = e; }
      if (error) {
        showToast('Error deleting order: ' + error.message);
        return;
      }
      setOrders(orders.filter(o => o.id !== order.id));
      showToast('Order deleted successfully!');
    }
  };

  const sendWhatsAppMessage = (order) => {
    let msg = messageTemplate;
    msg = msg.replace('{CustomerName}', order.customerName).replace('{OrderID}', order.id);
    window.open(`https://wa.me/${order.mobile.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  const printAllOrders = () => {
    if (orders.length === 0) {
      showToast('No orders to print');
      return;
    }
    
    const allReceiptsHtml = orders.map(order => {
      const itemsHtml = order.items.map(item => `
        <div style="display:flex; justify-content:space-between; margin-bottom: 5px;">
          <span>${item.quantity}x ${item.name}</span>
          <span>${t("rs")} ${(item.price * item.quantity).toFixed(2)}</span>
        </div>
      `).join('');
      
      return `
        <div style="padding: 20px; max-width: 300px; margin: 0 auto; page-break-after: always;">
          <h2 style="text-align:center;">Huzaifa Traders</h2>
          <p style="text-align:center;">Receipt: ${order.id}</p>
          <hr/>
          <p><strong>Customer:</strong> ${order.customerName}</p>
          <p><strong>Phone:</strong> ${order.mobile}</p>
          <p><strong>Address:</strong> ${order.address}</p>
          <p><strong>Date:</strong> ${new Date(order.date).toLocaleString()}</p>
          <hr/>
          ${itemsHtml}
          <hr/>
          <h3 style="text-align:right;">Total: ${t("rs")} ${order.total.toFixed(2)}</h3>
          <p style="text-align:center; margin-top: 20px;">Thank you for your purchase!</p>
        </div>
      `;
    }).join('');

    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    document.body.appendChild(iframe);
    iframe.contentDocument.write(`
      <html><head><title>Print All Orders</title></head>
      <body style="font-family: monospace; margin: 0; padding: 0;">
        ${allReceiptsHtml}
      </body></html>
    `);
    iframe.contentDocument.close();
    
    setTimeout(() => {
      iframe.contentWindow.focus();
      iframe.contentWindow.print();
      setTimeout(() => document.body.removeChild(iframe), 1000);
    }, 500);
  };

  const printReceipt = (order) => {
    const itemsHtml = order.items.map(item => `
      <div style="display:flex; justify-content:space-between; margin-bottom: 5px;">
        <span>${item.quantity}x ${item.name}</span>
        <span>${t("rs")} ${(item.price * item.quantity).toFixed(2)}</span>
      </div>
    `).join('');
    
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    document.body.appendChild(iframe);
    iframe.contentDocument.write(`
      <html><head><title>Receipt ${order.id}</title></head>
      <body style="font-family: monospace; padding: 20px; max-width: 300px; margin: 0 auto;">
        <h2 style="text-align:center;">Huzaifa Traders</h2>
        <p style="text-align:center;">Receipt: ${order.id}</p>
        <hr/>
        <p><strong>Customer:</strong> ${order.customerName}</p>
        <p><strong>Phone:</strong> ${order.mobile}</p>
        <p><strong>Address:</strong> ${order.address}</p>
        <p><strong>Date:</strong> ${new Date(order.date).toLocaleString()}</p>
        <hr/>
        ${itemsHtml}
        <hr/>
        <h3 style="text-align:right;">Total: ${t("rs")} ${order.total.toFixed(2)}</h3>
        <p style="text-align:center; margin-top: 20px;">Thank you for your purchase!</p>
      </body></html>
    `);
    iframe.contentDocument.close();
    
    setTimeout(() => {
      iframe.contentWindow.focus();
      iframe.contentWindow.print();
      setTimeout(() => document.body.removeChild(iframe), 1000);
    }, 500);
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    if (!newProduct.name || !newProduct.price || !newProduct.image) {
      showToast('Please fill all required fields');
      return;
    }
    
    const productPayload = {
      name: newProduct.name,
      weight: newProduct.weight || '1 item',
      price: parseFloat(newProduct.price),
      old_price: newProduct.oldPrice || null,
      rating: newProduct.rating || 5.0,
      image: newProduct.image,
      discount: newProduct.discount || null,
      category: newProduct.category || (categories.length > 0 ? categories[0].name : ''),
      stock: parseInt(newProduct.stock) || 0,
      short_description: newProduct.shortDescription || '',
      description: newProduct.description || '',
      specifications: newProduct.specifications || [],
      featured: newProduct.featured || false,
      best_seller: newProduct.bestSeller || false,
      active: newProduct.enabled !== undefined ? newProduct.enabled : true,
      enabled: newProduct.enabled !== undefined ? newProduct.enabled : true,
      images: newProduct.images || [],
      reviews: newProduct.reviews || []
    };
    
    try {
      if (newProduct.id) {
        // Update existing
        let data, error; try { const res = await updateProduct(newProduct.id, productPayload); data = res.data; } catch(e) { error = e; }
        if (error) throw error;
        if (data && data.length > 0) {
          setProducts(products.map(p => p.id === newProduct.id ? data[0] : p));
          showToast('Product updated successfully!');
        }
      } else {
        // Insert new
        let data, error; try { const res = await createProduct(productPayload); data = res.data; } catch(e) { error = e; }
        if (error) throw error;
        if (data && data.length > 0) {
          setProducts([data[0], ...products]);
          showToast('Product added successfully!');
        }
      }
      setNewProduct({ nameUr: '', descriptionUr: '', name: '', weight: '', price: '', image: '', discount: '', category: categories.length > 0 ? categories[0].name : '', stock: 0, shortDescription: '', description: '', specifications: [], featured: false, bestSeller: false, enabled: true, images: [], reviews: [] });
    } catch (err) {
      console.error(err);
      showToast('Database Error: ' + err.message);
    }
  };

  const handleRemoveProduct = async (id) => {
    try {
      let error; try { await deleteProduct(id); } catch(e) { error = e; }
      if (error) throw error;
      setProducts(products.filter(p => p.id !== id));
      setCartItems(cartItems => cartItems.filter(item => item.id !== id));
      showToast('Product removed');
    } catch (err) {
      showToast('Database Error: ' + err.message);
    }
  };

  const handleVideoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 4 * 1024 * 1024) { // 4MB
        showToast('Video too large to save (max 4MB). Using temporary preview.');
        setProductVideo(URL.createObjectURL(file));
      } else {
        const reader = new FileReader();
        reader.onloadend = () => {
          setProductVideo(reader.result);
          showToast('Video uploaded successfully!');
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const [cartItems, setCartItems] = useState([]);
  const [timeLeft, setTimeLeft] = useState({ hours: 14, minutes: 22, seconds: 59 });

  // Simulate countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const cartTotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const freeDeliveryThreshold = 30;
  const deliveryProgress = Math.min(100, (cartTotal / freeDeliveryThreshold) * 100);

  const updateQuantity = (id, delta) => {
    setCartItems(items => items.map(item => {
      if (item.id === id) {
        const newQty = item.quantity + delta;
        return newQty > 0 ? { ...item, quantity: newQty } : item;
      }
      return item;
    }));
  };

  const removeItem = (id) => {
    setCartItems(items => items.filter(item => item.id !== id));
  };

  return (
    <div className="app-container">
      {/* Sticky Header */}
      <header className="header-wrapper glass animate-slide-down">
        <div className="container header-content">
          <div className="logo" style={{ cursor: 'pointer', color: 'var(--primary)', fontWeight: '800' }} onClick={() => setCurrentView('home')}>
            <img src="/logo.jpg" alt="Logo" style={{ height: '32px', borderRadius: '4px' }} />
            Huzaifa Traders
          </div>

          <div className="search-bar" style={{ alignItems: 'center', backgroundColor: 'white', border: '1px solid #E2E8F0', borderRadius: '9999px', padding: '0.25rem 0.5rem', width: '100%', maxWidth: '600px' }}>
            <Search className="text-muted" size={20} style={{ marginLeft: '0.75rem', color: '#94A3B8' }} />
            <input 
              type="text" 
              style={{ border: 'none', outline: 'none', padding: '0.5rem 1rem', flex: 1, backgroundColor: 'transparent' }}
              placeholder={t("searchPlaceholder")} 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="header-actions">
            <button className="lang-toggle-btn" onClick={toggleLanguage} style={{ padding: '0.25rem 0.5rem', borderRadius: '9999px', backgroundColor: 'var(--primary)', color: 'white', fontWeight: 600, border: 'none', cursor: 'pointer', fontSize: '0.875rem', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', whiteSpace: 'nowrap' }}>
              {language === 'en' ? 'UR 🇵🇰' : '🇬🇧 EN'}
            </button>
            <button onClick={() => setIsDarkMode(!isDarkMode)} className="icon-btn" title="Toggle Dark Mode">
              {isDarkMode ? <Sun size={24} color="var(--text-main)" /> : <Moon size={24} color="var(--text-main)" />}
            </button>
            <button onClick={() => setCurrentView('profile')} className="icon-btn" onDoubleClick={() => setCurrentView('admin')}>
              <User size={24} color="var(--text-main)" />
            </button>
            <button className="icon-btn d-none-mobile" onClick={() => setCurrentView('wishlist')} style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.9rem', fontWeight: 500 }}>
              <Heart size={20} />
              Wishlist
              <span style={{ backgroundColor: '#F1F5F9', color: '#64748B', borderRadius: '50%', padding: '0.1rem 0.4rem', fontSize: '0.7rem', marginLeft: '0.25rem' }}>{wishlistItems.length}</span>
            </button>
            
            <button className="icon-btn" onClick={() => { setCartOpen(true); setIsCheckoutForm(false); }} style={{ backgroundColor: '#F1F5F9', padding: '0.5rem', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
              <ShoppingCart size={20} color="#0F172A" />
              {cartItems.length > 0 && (
                <span className="badge animate-fade-in" style={{ backgroundColor: 'var(--primary)', color: 'white', position: 'absolute', top: '-5px', right: '-5px' }}>{cartItems.length}</span>
              )}
            </button>
            <button className="icon-btn menu-btn" onClick={() => setMenuOpen(true)}>
              <Menu size={24} />
            </button>
          </div>
        </div>
      </header>

      <main>
        {currentView === 'home' && (
          <>
        {/* Hero Section */}
        <section className="hero-section">
          <div className="hero-overlay"></div>
          <div className="container hero-content">
            <div className="hero-text animate-fade-in" style={{ maxWidth: '650px', padding: '4rem 0' }}>
              <h1 className="hero-title" style={{ fontWeight: 800, lineHeight: 1.2, marginBottom: '1.5rem', fontSize: 'clamp(2rem, 6vw, 3.5rem)' }}>
                {t("heroTitle")}
              </h1>
              <p className="hero-subtitle" style={{ fontSize: 'clamp(1rem, 2.5vw, 1.125rem)', marginBottom: '2rem', lineHeight: 1.6 }}>
                {t("heroDesc")}
              </p>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
                <button 
                  className="btn-primary" 
                  style={{ fontSize: '1.125rem', padding: '0.75rem 2.5rem', borderRadius: '0.5rem', boxShadow: '0 4px 14px 0 rgba(16, 185, 129, 0.39)' }}
                  onClick={() => document.getElementById('shop-section')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  Shop Wholesale
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Video Section */}
        {productVideo && (
          <section className="container" style={{ paddingTop: '2rem' }}>
            <div style={{ marginBottom: '1.5rem' }}>
              <h2 className="section-title" style={{ fontSize: '1.5rem', fontWeight: 700, margin: 0 }}>Featured Product</h2>
            </div>
            <div style={{ borderRadius: '1.5rem', overflow: 'hidden', position: 'relative', width: '100%', paddingTop: '45%', backgroundColor: '#000', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}>
              <video 
                src={productVideo}
                autoPlay
                loop
                muted
                controls
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
          </section>
        )}

        
          
        {/* Cleaning Products Main Section */}
        <section id="shop-section" className="container" style={{ paddingTop: '3rem', paddingBottom: '4rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '2rem' }}>
            <h2 className="section-title" style={{ fontSize: '2rem', fontWeight: 800, margin: 0 }}>{t("cleaningProducts")}</h2>
            
            {/* Filtering and Search */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'space-between', alignItems: 'center' }}>
              <div className="categories-scroll" style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.5rem', flex: '1 1 100%' }}>
                <button 
                  className={`category-pill ${activeCategory === '' ? 'active' : ''}`} 
                  onClick={() => setActiveCategory('')}
                >
                  {t('all')}
                </button>
                {categories.map(cat => (
                  <button 
                    key={cat.name}
                    className={`category-pill ${activeCategory === cat.name ? 'active' : ''}`}
                    onClick={() => setActiveCategory(cat.name)}
                  >
                    {t(cat.name)}
                  </button>
                ))}
              </div>
              
              <div style={{ position: 'relative', flex: '1 1 100%', maxWidth: '400px' }}>
                <Search size={18} className="search-icon" />
                <input 
                  type="text" 
                  placeholder={t("searchPlaceholder")} 
                  className="search-input"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{ width: '100%', paddingLeft: '2.5rem' }}
                />
              </div>
            </div>
          </div>

          {/* Product Grid */}
          <div className="products-grid">
            {products
              .filter(p => (p.active ?? p.enabled ?? true))
              .filter(p => activeCategory === '' || (p.category && p.category.trim().toLowerCase() === activeCategory.trim().toLowerCase()))
              .filter(p => {
                if (!searchQuery) return true;
                const query = searchQuery.toLowerCase().replace('whiper', 'wiper').replace('jharoo', 'jharu');
                const tokens = query.split(' ').filter(t => t.trim() !== '');
                if (tokens.length === 0) return true;
                
                return tokens.some(token => 
                  (p.name && p.name.toLowerCase().includes(token)) || 
                  (p.category && p.category.toLowerCase().includes(token)) ||
                  (p.shortDescription && p.shortDescription.toLowerCase().includes(token)) ||
                  (p.description && p.description.toLowerCase().includes(token))
                );
              })
              .map(product => (
              <div key={product.id} className="product-card" style={{ display: 'flex', flexDirection: 'column', height: '100%', position: 'relative' }}>
                {product.isNew && (
                  <div className="new-arrival-badge">New Arrival</div>
                )}
                {product.discount && (
                  <div className="discount-badge" style={{ zIndex: 10 }}>{product.discount ? product.discount.replace('{t("off")}', t("off")).replace("OFF", t("off")) : null}</div>
                )}
                <button onClick={() => toggleWishlist(product)} className="fav-btn" style={{ zIndex: 10, color: wishlistItems.find(i => i.id === product.id) ? '#EF4444' : 'var(--text-muted)' }}>
                  <Heart size={18} fill={wishlistItems.find(i => i.id === product.id) ? '#EF4444' : 'none'} />
                </button>
                
                
                <div className="product-image-wrapper" style={{ cursor: 'pointer', position: 'relative' }} onClick={(e) => { 
                  if (e.target.closest('.floating-actions')) return;
                  setActiveProduct(product); 
                  setCurrentView('product-details'); 
                }}>
                  <img src={product.image} alt={getProductName(product)} />
                  <div className="floating-actions" style={{ position: 'absolute', bottom: '0', left: '0', right: '0', padding: '0.75rem', display: 'flex', gap: '0.5rem', background: 'rgba(255,255,255,0.5)', backdropFilter: 'blur(8px)', justifyContent: 'center', padding: '0.4rem' }}>
                    {product.stock > 0 ? (
                      <>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            const existing = cartItems.find(i => i.id === product.id);
                            if (existing) {
                              updateQuantity(product.id, 1);
                            } else {
                              setCartItems([...cartItems, { ...product, quantity: 1 }]);
                            }
                            showToast('Added to cart');
                          }}
                          style={{ flex: 1, padding: '0.4rem 0.2rem', borderRadius: '0.25rem', border: 'none', backgroundColor: 'var(--primary)', color: 'white', fontWeight: 600, fontSize: '0.75rem', cursor: 'pointer', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', whiteSpace: 'nowrap' }}
                        >
                          Add to Cart
                        </button>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            const existing = cartItems.find(i => i.id === product.id);
                            if (!existing) {
                              setCartItems([...cartItems, { ...product, quantity: 1 }]);
                            }
                            setCartOpen(true);
                            setIsCheckoutForm(true);
                          }}
                          style={{ flex: 1, padding: '0.4rem 0.2rem', borderRadius: '0.25rem', border: 'none', backgroundColor: '#F97316', color: 'white', fontWeight: 600, fontSize: '0.75rem', cursor: 'pointer', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', whiteSpace: 'nowrap' }}
                        >
                          Buy Now
                        </button>
                      </>
                    ) : (
                      <div style={{ padding: '0.3rem', width: '100%', textAlign: 'center', backgroundColor: '#FEE2E2', color: '#DC2626', fontWeight: 700, borderRadius: '0.25rem', fontSize: '0.75rem', whiteSpace: 'nowrap' }}>
                        Out of Stock
                      </div>
                    )}
                  </div>
                </div>

                
                <div className="product-info" style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.25rem' }}>
                    <h3 style={{ cursor: 'pointer' }} onClick={() => { setActiveProduct(product); setCurrentView('product-details'); }}>{getProductName(product)}</h3>
                    <div style={{ fontSize: '0.75rem', fontWeight: 600, padding: '0.1rem 0.4rem', borderRadius: '4px', backgroundColor: product.stock > 0 ? '#D1FAE5' : '#FEE2E2', color: product.stock > 0 ? '#047857' : '#DC2626' }}>
                      {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                    </div>
                  </div>
                  
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '0.75rem', flex: 1, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {getProductShortDesc(product) || getProductDesc(product)}
                  </p>
                  
                  <div className="product-rating">
                    <Star size={14} className="star-icon" /><Star size={14} className="star-icon" /><Star size={14} className="star-icon" /><Star size={14} className="star-icon" /><Star size={14} className="star-icon" />
                    <span style={{ marginLeft: '0.25rem' }}>({product.rating})</span>
                  </div>
                  
                  <div className="product-footer" style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid #F1F5F9' }}>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.25rem' }}>
                      <span className="price">{t("rs")} {product.price.toFixed(2)}</span>
                      {product.oldPrice && <span className="old-price">{t("rs")} {product.oldPrice.toFixed(2)}</span>}
                    </div>
                  </div>
                  

                </div>
              </div>
            ))}
            {products.length === 0 && (
              <div style={{ gridColumn: '1 / -1', padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                No products found.
              </div>
            )}
          </div>
        </section>

          {/* Our Location Section */}
          <section className="map-section container" style={{ marginTop: '2rem' }}>
            <h2 className="section-title" style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '2rem' }}>Our Location</h2>
            <div className="map-container" style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem' }}>
              <div style={{ flex: '1 1 400px', minHeight: '300px' }}>
                <iframe 
                  src={(() => {
                    const url = businessDetails.mapUrl || '';
                    const match = url.match(/src=["'](.*?)["']/);
                    return match ? match[1] : url;
                  })()}
                  width="100%" 
                  height="100%" 
                  style={{ border: 0 }} 
                  allowFullScreen="" 
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Google Maps Location"
                ></iframe>
              </div>
              <div style={{ flex: '1 1 300px', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '2rem' }}>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1.5rem', color: 'var(--primary)' }}>Huzaifa Traders</h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                  <MapPin size={24} color="var(--text-muted)" />
                  <span style={{ fontSize: '1.1rem' }}>{businessDetails.address}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                  <Phone size={24} color="var(--text-muted)" />
                  <span style={{ fontSize: '1.1rem' }}>{businessDetails.phone}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                  <MessageCircle size={24} color="#25D366" />
                  <span style={{ fontSize: '1.1rem' }}>{businessDetails.whatsapp}</span>
                </div>
                <a 
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(businessDetails.address)}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="btn-primary"
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '1rem', borderRadius: '0.5rem', textDecoration: 'none' }}
                >
                  <Navigation size={20} />
                  Get Directions
                </a>
              </div>
            </div>
          </section>
        </>
        )}
        
        
        {/* Product Details Page */}
        {currentView === 'product-details' && activeProduct && (
          <section className="container" style={{ padding: '4rem 0', animation: 'fadeIn 0.3s ease-out forwards' }}>
            <button onClick={() => setCurrentView('home')} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', backgroundColor: 'transparent', border: 'none', cursor: 'pointer', fontWeight: 600, marginBottom: '2rem', padding: '0.5rem 0', transition: 'color 0.2s' }}>
              <ArrowLeft size={20} /> Back to Products
            </button>
            <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
              
              {/* Image Gallery */}
              <div style={{ flex: '1 1 400px', maxWidth: '100%' }}>
                <div style={{ width: '100%', aspectRatio: '1', borderRadius: '1.5rem', overflow: 'hidden', backgroundColor: '#F8FAFC', marginBottom: '1rem', position: 'relative' }}>
                  <img src={activeProduct.image} alt={getProductName(activeProduct)} style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '2rem' }} />
                  {activeProduct.discount && (
                    <div className="discount-badge" style={{ top: '1rem', left: '1rem', padding: '0.5rem 1rem', fontSize: '1rem' }}>
                      {activeProduct.discount}
                    </div>
                  )}
                </div>
                <div style={{ display: 'flex', gap: '1rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
                  {(() => {
                    const imgs = activeProduct.images?.filter(Boolean) || [];
                    return imgs.length > 0 ? imgs : [activeProduct.image];
                  })().map((img, idx) => (
                    <div key={idx} style={{ width: '80px', height: '80px', borderRadius: '0.5rem', overflow: 'hidden', border: '2px solid var(--primary)', cursor: 'pointer', flexShrink: 0 }}>
                      <img src={img} alt="Thumbnail" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                  ))}
                </div>
              </div>

              {/* Product Info */}
              <div style={{ flex: '1 1 400px', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--primary)', backgroundColor: '#ECFDF5', padding: '0.25rem 0.75rem', borderRadius: '9999px' }}>{t(activeProduct.category)}</span>
                    {activeProduct.bestSeller && <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#D97706', backgroundColor: '#FEF3C7', padding: '0.25rem 0.75rem', borderRadius: '9999px' }}>Best Seller</span>}
                  </div>
                  <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '0.5rem', color: 'var(--text-main)', lineHeight: 1.2 }}>{getProductName(activeProduct)}</h1>
                  <div className="product-rating" style={{ fontSize: '1rem' }}>
                    <Star size={16} className="star-icon" /><Star size={16} className="star-icon" /><Star size={16} className="star-icon" /><Star size={16} className="star-icon" /><Star size={16} className="star-icon" />
                    <span style={{ marginLeft: '0.5rem', fontWeight: 600 }}>{activeProduct.rating} / 5.0</span>
                    <span style={{ marginLeft: '0.5rem', color: 'var(--text-muted)' }}>({(activeProduct.reviews || []).length} Reviews)</span>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'baseline', gap: '1rem' }}>
                  <span style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-main)' }}>{t("rs")} {activeProduct.price.toFixed(2)}</span>
                  {activeProduct.oldPrice && <span style={{ fontSize: '1.25rem', color: 'var(--text-muted)', textDecoration: 'line-through' }}>{t("rs")} {activeProduct.oldPrice.toFixed(2)}</span>}
                </div>

                <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                  {getProductDesc(activeProduct) || getProductShortDesc(activeProduct)}
                </p>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem 0', borderTop: '1px solid #E2E8F0', borderBottom: '1px solid #E2E8F0' }}>
                  <span style={{ fontWeight: 600 }}>Status:</span>
                  <span style={{ fontWeight: 700, color: activeProduct.stock > 0 ? '#10B981' : '#EF4444' }}>
                    {activeProduct.stock > 0 ? `In Stock (${activeProduct.stock} available)` : 'Out of Stock'}
                  </span>
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                  <button 
                    className="btn-primary" 
                    style={{ flex: 1, padding: '1rem', fontSize: '1.1rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', opacity: activeProduct.stock > 0 ? 1 : 0.5 }}
                    disabled={activeProduct.stock <= 0}
                    onClick={() => {
                      const existing = cartItems.find(i => i.id === activeProduct.id);
                      if (existing) {
                        updateQuantity(activeProduct.id, 1);
                      } else {
                        setCartItems([...cartItems, { ...activeProduct, quantity: 1 }]);
                      }
                      showToast('Added to cart');
                    }}
                  >
                    <ShoppingCart size={20} /> Add to Cart
                  </button>
                  <button 
                    className="btn-primary" 
                    style={{ flex: 1, padding: '1rem', fontSize: '1.1rem', backgroundColor: 'transparent', color: 'var(--primary)', border: '2px solid var(--primary)', opacity: activeProduct.stock > 0 ? 1 : 0.5 }}
                    disabled={activeProduct.stock <= 0}
                    onClick={() => {
                      const existing = cartItems.find(i => i.id === activeProduct.id);
                      if (!existing) {
                        setCartItems([...cartItems, { ...activeProduct, quantity: 1 }]);
                      }
                      setCartOpen(true);
                      setIsCheckoutForm(true);
                    }}
                  >
                    Buy Now
                  </button>
                  <button 
                    className="btn-primary" 
                    style={{ padding: '1rem', backgroundColor: wishlistItems.find(i => i.id === activeProduct.id) ? '#FEE2E2' : 'transparent', color: wishlistItems.find(i => i.id === activeProduct.id) ? '#EF4444' : 'var(--text-main)', border: '1px solid var(--glass-border)' }}
                    onClick={() => toggleWishlist(activeProduct)}
                  >
                    <Heart size={24} fill={wishlistItems.find(i => i.id === activeProduct.id) ? '#EF4444' : 'none'} />
                  </button>
                </div>

                {/* Specifications */}
                {activeProduct.specifications && activeProduct.specifications.length > 0 && (
                  <div style={{ marginTop: '2rem' }}>
                    <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Specifications</h3>
                    <div style={{ display: 'grid', gap: '0.5rem' }}>
                      {activeProduct.specifications.map((spec, idx) => (
                        <div key={idx} style={{ display: 'grid', gridTemplateColumns: '150px 1fr', padding: '0.75rem', backgroundColor: idx % 2 === 0 ? 'var(--glass-bg)' : 'transparent', borderRadius: '0.5rem', border: '1px solid var(--glass-border)' }}>
                          <span style={{ fontWeight: 600, color: 'var(--text-muted)' }}>{spec.key}</span>
                          <span style={{ fontWeight: 500 }}>{spec.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Related Products */}
            <div style={{ marginTop: '4rem', paddingTop: '2rem', borderTop: '1px solid #E2E8F0' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '2rem' }}>Related Products</h2>
              <div className="flash-deals-scroll">
                {products.filter(p => p.id !== activeProduct.id && p.category === activeProduct.category).map(product => (
                  <div key={product.id} className="product-card" style={{ display: 'flex', flexDirection: 'column' }}>
                    
                <div className="product-image-wrapper" style={{ cursor: 'pointer', position: 'relative' }} onClick={(e) => { 
                  if (e.target.closest('.floating-actions')) return;
                  setActiveProduct(product); 
                  window.scrollTo({ top: 0, behavior: 'smooth' }); 
                }}>
                  <img src={product.image} alt={getProductName(product)} />
                  <div className="floating-actions" style={{ position: 'absolute', bottom: '0', left: '0', right: '0', padding: '0.75rem', display: 'flex', gap: '0.5rem', background: 'rgba(255,255,255,0.5)', backdropFilter: 'blur(8px)', justifyContent: 'center', padding: '0.4rem' }}>
                    {product.stock > 0 ? (
                      <>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            const existing = cartItems.find(i => i.id === product.id);
                            if (existing) {
                              updateQuantity(product.id, 1);
                            } else {
                              setCartItems([...cartItems, { ...product, quantity: 1 }]);
                            }
                            showToast('Added to cart');
                          }}
                          style={{ flex: 1, padding: '0.4rem 0.2rem', borderRadius: '0.25rem', border: 'none', backgroundColor: 'var(--primary)', color: 'white', fontWeight: 600, fontSize: '0.75rem', cursor: 'pointer', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', whiteSpace: 'nowrap' }}
                        >
                          Add to Cart
                        </button>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            const existing = cartItems.find(i => i.id === product.id);
                            if (!existing) {
                              setCartItems([...cartItems, { ...product, quantity: 1 }]);
                            }
                            setCartOpen(true);
                            setIsCheckoutForm(true);
                          }}
                          style={{ flex: 1, padding: '0.4rem 0.2rem', borderRadius: '0.25rem', border: 'none', backgroundColor: '#F97316', color: 'white', fontWeight: 600, fontSize: '0.75rem', cursor: 'pointer', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', whiteSpace: 'nowrap' }}
                        >
                          Buy Now
                        </button>
                      </>
                    ) : (
                      <div style={{ padding: '0.3rem', width: '100%', textAlign: 'center', backgroundColor: '#FEE2E2', color: '#DC2626', fontWeight: 700, borderRadius: '0.25rem', fontSize: '0.75rem', whiteSpace: 'nowrap' }}>
                        Out of Stock
                      </div>
                    )}
                  </div>
                </div>

                    <div className="product-info" style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                      <h3 style={{ cursor: 'pointer' }} onClick={() => { setActiveProduct(product); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>{getProductName(product)}</h3>
                      <div className="product-footer" style={{ marginTop: 'auto', paddingTop: '1rem' }}>
                        <span className="price">{t("rs")} {product.price.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {currentView === 'profile' && (
          <section className="container" style={{ padding: '4rem 0', animation: 'fadeIn 0.3s ease-out forwards', maxWidth: '600px' }}>
            <button onClick={() => setCurrentView('home')} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', backgroundColor: 'transparent', border: 'none', cursor: 'pointer', fontWeight: 600, marginBottom: '2rem', padding: '0.5rem 0', transition: 'color 0.2s' }}>
              <ArrowLeft size={20} /> Back to Store
            </button>
            <h2 className="section-title" style={{ marginBottom: '2rem' }}>
              <User className="text-emerald-600" size={28} color="var(--primary)" />
              User Profile
            </h2>
            
            {!customerAuth.isAuthenticated || !userProfile ? (
              <CustomerAuth onLoginSuccess={(user) => {
                setCustomerAuth({ isAuthenticated: true, user });
                setUserProfile(user);
              }} />
            ) : (
            <div className="glass" style={{ padding: '2rem', borderRadius: '1rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', borderBottom: '1px solid #E2E8F0', paddingBottom: '1.5rem' }}>
                <div style={{ width: '80px', height: '80px', backgroundColor: '#E2E8F0', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <User size={40} color="var(--text-muted)" />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.5rem', margin: 0 }}>{userProfile.name}</h3>
                  <p style={{ color: 'var(--text-muted)', margin: 0 }}>{userProfile.email}</p>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem' }}>{t("fullName")}</label>
                  <input type="text" value={userProfile.name} onChange={(e) => setUserProfile({...userProfile, name: e.target.value})} className="search-input" style={{ width: '100%' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem' }}>Email</label>
                  <input type="email" value={userProfile.email} onChange={(e) => setUserProfile({...userProfile, email: e.target.value})} className="search-input" style={{ width: '100%' }} disabled />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem' }}>Phone Number</label>
                  <input type="text" value={userProfile.phone} onChange={(e) => setUserProfile({...userProfile, phone: e.target.value})} className="search-input" style={{ width: '100%' }} />
                </div>
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem' }}>{t("deliveryAddress")}</label>
                  <input type="text" value={userProfile.address} onChange={(e) => setUserProfile({...userProfile, address: e.target.value})} className="search-input" style={{ width: '100%' }} />
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
                <button className="btn-primary" style={{ backgroundColor: 'transparent', color: '#DC2626', border: '1px solid #FEE2E2' }} onClick={async () => {
                  await fetch("/api/neon/auth/logout", { method: 'POST' });
                  setCustomerAuth({ isAuthenticated: false, user: null });
                  setUserProfile(null);
                }}>Logout</button>
                <button className="btn-primary" style={{ backgroundColor: 'transparent', color: 'var(--text-main)', border: '1px solid #E2E8F0' }} onClick={() => setCurrentView('home')}>Close</button>
                <button className="btn-primary" onClick={async () => {
                  const res = await fetch("/api/neon/auth/profile", {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(userProfile)
                  });
                  if (res.ok) {
                    showToast('Profile updated successfully!');
                  } else {
                    showToast('Failed to update profile');
                  }
                }}>Save Changes</button>
              </div>
            </div>
            )}
          </section>
        )}

        {currentView === 'admin' && (
          <section className="container" style={{ padding: '4rem 0', animation: 'fadeIn 0.3s ease-out forwards' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <h2 className="section-title" style={{ marginBottom: 0 }}>
                <Settings className="text-emerald-600" size={28} color="var(--primary)" />
                Admin Panel
              </h2>
              <button onClick={() => setCurrentView('home')} style={{ color: 'var(--text-muted)', backgroundColor: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600 }}>
                <ArrowLeft size={20} /> Back to Store
              </button>
            </div>
            
            {!isAdminAuthenticated ? (
              <div className="glass" style={{ padding: '2rem', borderRadius: '1rem', maxWidth: '400px', margin: '0 auto', textAlign: 'center' }}>
                <div style={{ width: '64px', height: '64px', backgroundColor: '#ECFDF5', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                  <LogIn size={32} color="var(--primary)" />
                </div>
                <h3 style={{ marginBottom: '1rem', fontSize: '1.25rem' }}>Admin Authentication</h3>
                <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '0.875rem' }}>Please enter your username and admin password to continue.</p>
                <form onSubmit={handleAdminLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <input 
                    type="text" 
                    value={adminUsernameInput}
                    onChange={(e) => setAdminUsernameInput(e.target.value)}
                    placeholder="Enter username" 
                    className="search-input" 
                    style={{ width: '100%', textAlign: 'center' }} 
                    required
                  />
                  <input 
                    type="password" 
                    value={adminPasswordInput}
                    onChange={(e) => setAdminPasswordInput(e.target.value)}
                    placeholder="Enter password" 
                    className="search-input" 
                    style={{ width: '100%', textAlign: 'center' }} 
                    required
                  />
                  <button type="submit" className="btn-primary" style={{ width: '100%' }}>Login</button>
                </form>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', borderBottom: '1px solid #E2E8F0', paddingBottom: '1rem' }}>
                  <button onClick={() => setAdminTab('products')} style={{ padding: '0.5rem 1rem', fontWeight: 600, color: adminTab === 'products' ? 'var(--primary)' : 'var(--text-muted)', borderBottom: adminTab === 'products' ? '2px solid var(--primary)' : 'transparent', transition: 'all 0.2s' }}>{t("products")}</button>
                  <button onClick={() => setAdminTab('orders')} style={{ padding: '0.5rem 1rem', fontWeight: 600, color: adminTab === 'orders' ? 'var(--primary)' : 'var(--text-muted)', borderBottom: adminTab === 'orders' ? '2px solid var(--primary)' : 'transparent', transition: 'all 0.2s' }}>{t("orders")}</button>
                  <button onClick={() => setAdminTab('history')} style={{ padding: '0.5rem 1rem', fontWeight: 600, color: adminTab === 'history' ? 'var(--primary)' : 'var(--text-muted)', borderBottom: adminTab === 'history' ? '2px solid var(--primary)' : 'transparent', transition: 'all 0.2s' }}>History</button>
                  <button onClick={() => setAdminTab('categories')} style={{ padding: '0.5rem 1rem', fontWeight: 600, color: adminTab === 'categories' ? 'var(--primary)' : 'var(--text-muted)', borderBottom: adminTab === 'categories' ? '2px solid var(--primary)' : 'transparent', transition: 'all 0.2s' }}>Categories</button>
                  <button onClick={() => setAdminTab('settings')} style={{ padding: '0.5rem 1rem', fontWeight: 600, color: adminTab === 'settings' ? 'var(--primary)' : 'var(--text-muted)', borderBottom: adminTab === 'settings' ? '2px solid var(--primary)' : 'transparent', transition: 'all 0.2s' }}>Settings</button>
                </div>
                
                {adminTab === 'categories' ? (
                  <div className="glass" style={{ padding: '2rem', borderRadius: '1rem' }}>
                    <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Grid size={20} color="var(--primary)" /> Manage Categories
                    </h3>
                    <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
                      <input 
                        type="text" 
                        id="newCategoryName" 
                        placeholder="New Category Name" 
                        className="search-input" 
                        style={{ flex: 1, height: '42px' }} 
                        onKeyDown={e => {
                          if (e.key === 'Enter') {
                            document.getElementById('addCategoryBtn').click();
                          }
                        }}
                      />
                      <button 
                        id="addCategoryBtn"
                        className="btn-primary" 
                        style={{ height: '42px', padding: '0 1.5rem' }}
                        onClick={() => {
                          const input = document.getElementById('newCategoryName');
                          const val = input.value.trim();
                          if (val) {
                            if (categories.find(c => c.name.toLowerCase() === val.toLowerCase())) {
                              showToast('Category already exists!');
                            } else {
                              createCategory({ name: val, active: false }).then(({ error }) => {
                                if (error) { showToast('Error adding category: ' + error.message); }
                                else {
                                  setCategories([...categories, { name: val, active: false }]);
                              input.value = '';
                              showToast('Category added successfully!');
                            
                                }
                              });
                            }
                          }
                        }}
                      >
                        Add
                      </button>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      {categories.map((cat, idx) => (
                        <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', backgroundColor: 'transparent', border: '1px solid var(--glass-border)', borderRadius: '0.5rem' }}>
                          <span style={{ fontWeight: 600 }}>{t(cat.name)}</span>
                          <button 
                            style={{ color: '#EF4444', backgroundColor: 'transparent', border: 'none', cursor: 'pointer', padding: '0.5rem' }}
                            onClick={() => {
                              if (window.confirm(`Delete category "${cat.name}"?`)) {
                                deleteCategory(cat.name).then(({ error }) => {
                                  if (error) { showToast('Error deleting category: ' + error.message); }
                                  else {
                                    setCategories(categories.filter(c => c.name !== cat.name));
                                    showToast('Category deleted!');
                                  }
                                });
                              }
                            }}
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : adminTab === 'settings' ? (
                  <div className="glass" style={{ padding: '2rem', borderRadius: '1rem' }}>
                    <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Settings size={20} color="var(--primary)" /> Store Settings
                    </h3>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem' }}>Front Page Video URL</label>
                      <input 
                        type="text" 
                        value={productVideo} 
                        onChange={e => setProductVideo(e.target.value)} 
                        className="search-input" 
                        style={{ width: '100%', marginBottom: '1rem' }} 
                        placeholder="Enter video URL (mp4, webm, etc.)" 
                      />
                      <div style={{ display: 'flex', alignItems: 'center', margin: '1rem 0' }}>
                        <div style={{ flex: 1, height: '1px', backgroundColor: '#E2E8F0' }}></div>
                        <span style={{ padding: '0 1rem', color: '#94A3B8', fontSize: '0.875rem', fontWeight: 600 }}>OR</span>
                        <div style={{ flex: 1, height: '1px', backgroundColor: '#E2E8F0' }}></div>
                      </div>
                      <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem' }}>Upload Video from Device (Max 4MB)</label>
                      <input 
                        type="file" 
                        accept="video/*" 
                        onChange={handleVideoUpload} 
                        className="search-input" 
                        style={{ width: '100%', marginBottom: '1.5rem', padding: '0.5rem' }} 
                      />
                      <div style={{ display: 'flex', gap: '1rem' }}>
                        <button className="btn-primary" style={{ flex: 1 }} onClick={() => showToast('Video settings saved!')}>Save Settings</button>
                        <button 
                          className="btn-primary" 
                          style={{ flex: 1, backgroundColor: '#FEF2F2', color: '#EF4444', border: '1px solid #FECACA' }} 
                          onClick={() => {
                            setProductVideo('');
                            localStorage.removeItem('freshmart_video');
                            showToast('Video removed successfully!');
                          }}
                        >
                          Remove Video
                        </button>
                      </div>
                      
                      <div style={{ marginTop: '2rem', paddingTop: '2rem', borderTop: '1px solid #E2E8F0' }}>
                        <h4 style={{ fontSize: '1.1rem', marginBottom: '1rem', fontWeight: 700 }}>Business Location & Contact Details</h4>
                        
                        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem' }}>Business Address</label>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Note: Changing this text will NOT automatically update the map image below. You must also update the Google Maps Embed URL to change the visual map.</p>
                        <input 
                          type="text" 
                          value={businessDetails.address} 
                          onChange={e => setBusinessDetails({...businessDetails, address: e.target.value})} 
                          className="search-input" 
                          style={{ width: '100%', marginBottom: '1rem' }} 
                        />
                        
                        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem' }}>Phone Number</label>
                        <input 
                          type="text" 
                          value={businessDetails.phone} 
                          onChange={e => setBusinessDetails({...businessDetails, phone: e.target.value})} 
                          className="search-input" 
                          style={{ width: '100%', marginBottom: '1rem' }} 
                        />
                        
                        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem' }}>WhatsApp Number (Include Country Code, e.g., 923001234567)</label>
                        <input 
                          type="text" 
                          value={businessDetails.whatsapp} 
                          onChange={e => setBusinessDetails({...businessDetails, whatsapp: e.target.value})} 
                          className="search-input" 
                          style={{ width: '100%', marginBottom: '1rem' }} 
                        />
                        
                        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem' }}>Google Maps Embed URL</label>
                        <input 
                          type="text" 
                          value={businessDetails.mapUrl} 
                          onChange={e => {
                            let val = e.target.value;
                            const match = val.match(/src=["'](.*?)["']/);
                            if (match) val = match[1];
                            setBusinessDetails({...businessDetails, mapUrl: val});
                          }} 
                          className="search-input" 
                          style={{ width: '100%', marginBottom: '1.5rem' }} 
                        />
                        <button className="btn-primary" style={{ width: '100%' }} onClick={handleSaveBusinessDetails} disabled={isSavingBusiness}>
                          {isSavingBusiness ? 'Saving to Database...' : 'Save Details'}
                        </button>
                      </div>
                    </div>

                    <div style={{ backgroundColor: 'var(--bg-color)', padding: '1.5rem', borderRadius: '0.5rem', border: '1px solid var(--glass-border)', marginTop: '2rem' }}>
                      <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1rem' }}>Email Notifications (Free)</h3>
                      <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                        Get instant email alerts when a new order is placed. <br/>
                        1. Go to <a href="https://web3forms.com" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary)', textDecoration: 'underline' }}>Web3Forms.com</a>.<br/>
                        2. Enter your email address to get a free Access Key sent to your inbox.<br/>
                        3. Paste the Access Key below and enable notifications.
                      </p>
                      
                      <div style={{ marginBottom: '1rem' }}>
                        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem' }}>Web3Forms Access Key</label>
                        <input 
                          type="text" 
                          value={businessDetails.emailKey} 
                          onChange={e => setBusinessDetails({...businessDetails, emailKey: e.target.value})} 
                          className="search-input" 
                          placeholder="e.g. 1234abcd-5678-efgh..."
                          style={{ width: '100%', marginBottom: '1rem' }} 
                        />
                      </div>
                      
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
                        <input 
                          type="checkbox" 
                          id="enableEmail"
                          checked={businessDetails.emailEnabled} 
                          onChange={e => setBusinessDetails({...businessDetails, emailEnabled: e.target.checked})} 
                          style={{ width: '1.25rem', height: '1.25rem', accentColor: 'var(--primary)' }}
                        />
                        <label htmlFor="enableEmail" style={{ fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer' }}>Enable Email Alerts</label>
                      </div>
                      
                      <button className="btn-primary" onClick={handleSaveBusinessDetails} disabled={isSavingBusiness}>{isSavingBusiness ? 'Saving to Database...' : 'Save Email Settings'}</button>
                    </div>

                    <div style={{ backgroundColor: 'var(--bg-color)', padding: '1.5rem', borderRadius: '0.5rem', border: '1px solid var(--glass-border)', marginTop: '2rem' }}>
                      <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1rem' }}>Automated WhatsApp Alerts (CallMeBot)</h3>
                      <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                        Get instant WhatsApp notifications when an order is placed (without redirecting the customer). <br/>
                        1. Add <b>+34 624 53 14 05</b> (or other CallMeBot numbers) to your phone contacts.<br/>
                        2. Send exactly <code>I allow callmebot to send me messages</code> to it via WhatsApp.<br/>
                        3. It will reply with your API Key. Paste it below!
                      </p>
                      
                      <div style={{ marginBottom: '1rem' }}>
                        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem' }}>CallMeBot API Key</label>
                        <input 
                          type="text" 
                          value={businessDetails.whatsappApiKey} 
                          onChange={e => setBusinessDetails({...businessDetails, whatsappApiKey: e.target.value})} 
                          className="search-input" 
                          placeholder="e.g. 123456"
                          style={{ width: '100%', marginBottom: '1rem' }} 
                        />
                      </div>
                      
                      <button className="btn-primary" onClick={handleSaveBusinessDetails} disabled={isSavingBusiness}>{isSavingBusiness ? 'Saving to Database...' : 'Save WhatsApp Settings'}</button>
                    </div>

                  </div>
                ) : adminTab === 'history' ? (
                  <HistoryDashboard history={history} fetchHistory={fetchHistory}  t={t} products={products} />
                ) : adminTab === 'products' ? (
                  <>
                    {/* Add/Edit Product Form */}
                <div className="glass" style={{ padding: '2rem', borderRadius: '1rem' }}>
                  <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Plus size={20} color="var(--primary)" /> Add / Edit Product
                  </h3>
                  <form onSubmit={handleSaveProduct} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem' }}>Product Name *</label>
                      <input type="text" value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})} className="search-input" style={{ width: '100%' }} required />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem' }}>Category</label>
                      <select value={newProduct.category || (categories.length > 0 ? categories[0].name : '')} onChange={e => setNewProduct({...newProduct, category: e.target.value})} className="search-input" style={{ width: '100%', height: '42px' }}>
                        {categories.map(c => <option key={c.name} value={c.name}>{t(c.name)}</option>)}
                      </select>
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem' }}>Price *</label>
                      <input type="number" step="0.01" value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: parseFloat(e.target.value)})} className="search-input" style={{ width: '100%' }} required />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem' }}>Stock Quantity *</label>
                      <input type="number" value={newProduct.stock} onChange={e => setNewProduct({...newProduct, stock: parseInt(e.target.value)})} className="search-input" style={{ width: '100%' }} required />
                    </div>
                    <div style={{ gridColumn: '1 / -1', display: 'flex', gap: '1rem', alignItems: 'flex-end', flexWrap: 'wrap' }}>
                      <div style={{ flex: '1 1 200px' }}>
                        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem' }}>Main Image URL *</label>
                        <input type="text" value={newProduct.image} onChange={e => setNewProduct({...newProduct, image: e.target.value})} className="search-input" style={{ width: '100%' }} required />
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', paddingBottom: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>OR</div>
                      <div style={{ flex: '1 1 200px' }}>
                        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem' }}>Upload from Device</label>
                        <input 
                          type="file" 
                          accept="image/*"
                          className="search-input"
                          style={{ width: '100%', padding: '0.4rem', backgroundColor: 'transparent' }}
                          onChange={(e) => {
                            const file = e.target.files[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onloadend = () => {
                                const img = new Image();
                                img.onload = () => {
                                  const canvas = document.createElement('canvas');
                                  const MAX_WIDTH = 600;
                                  const scaleSize = MAX_WIDTH / img.width;
                                  canvas.width = MAX_WIDTH;
                                  canvas.height = img.height * scaleSize;
                                  const ctx = canvas.getContext('2d');
                                  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                                  const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.6);
                                  setNewProduct({...newProduct, image: compressedDataUrl});
                                };
                                img.src = reader.result;
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                          className="search-input" 
                          style={{ width: '100%', padding: '0.4rem', backgroundColor: 'white' }} 
                        />
                      </div>
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem' }}>Discount (%)</label>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <input 
                          type="number" 
                          value={newProduct.discount ? parseFloat(newProduct.discount) || '' : ''} 
                          onChange={e => setNewProduct({...newProduct, discount: e.target.value ? `${e.target.value}% OFF` : ''})} 
                          onBlur={e => {
                            const val = parseFloat(e.target.value);
                            if (!isNaN(val) && val > 0 && val < 100) {
                              let newPrice = newProduct.price;
                              let oldPrice = newProduct.oldPrice;
                              if (newProduct.oldPrice) {
                                newPrice = parseFloat((newProduct.oldPrice * (1 - val/100)).toFixed(2));
                              } else if (newProduct.price) {
                                oldPrice = newProduct.price;
                                newPrice = parseFloat((newProduct.price * (1 - val/100)).toFixed(2));
                              }
                              setNewProduct(prev => ({
                                ...prev,
                                price: newPrice,
                                oldPrice: oldPrice || prev.oldPrice
                              }));
                            }
                          }}
                          className="search-input" 
                          style={{ flex: 1 }} 
                          placeholder="e.g. 10" 
                        />
                        <span style={{ fontWeight: 700, color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>% {t("off")}</span>
                      </div>
                    </div>
                    <div style={{ gridColumn: '1 / -1' }}>
                      <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem' }}>Short Description</label>
                      <input type="text" value={newProduct.shortDescription} onChange={e => setNewProduct({...newProduct, shortDescription: e.target.value})} className="search-input" style={{ width: '100%' }} />
                    </div>
                    <div style={{ gridColumn: '1 / -1' }}>
                      <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem' }}>Detailed Description</label>
                      <textarea value={newProduct.description} onChange={e => setNewProduct({...newProduct, description: e.target.value})} className="search-input" style={{ width: '100%', minHeight: '80px', resize: 'vertical' }} />
                    </div>
                    
                    <div style={{ display: 'flex', gap: '1.5rem', gridColumn: '1 / -1', padding: '1rem', backgroundColor: 'transparent', border: '1px solid var(--glass-border)', borderRadius: '0.5rem', flexWrap: 'wrap' }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontWeight: 600, fontSize: '0.875rem' }}>
                        <input type="checkbox" checked={newProduct.featured} onChange={e => setNewProduct({...newProduct, featured: e.target.checked})} />
                        Featured Product
                      </label>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontWeight: 600, fontSize: '0.875rem' }}>
                        <input type="checkbox" checked={newProduct.bestSeller} onChange={e => setNewProduct({...newProduct, bestSeller: e.target.checked})} />
                        Best Seller
                      </label>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontWeight: 600, fontSize: '0.875rem' }}>
                        <input type="checkbox" checked={newProduct.enabled} onChange={e => setNewProduct({...newProduct, enabled: e.target.checked})} />
                        Enabled
                      </label>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'flex-end', gridColumn: '1 / -1', gap: '1rem' }}>
                      <button type="submit" className="btn-primary" style={{ flex: 1, height: '42px' }}>{newProduct.id ? 'Update Product' : 'Add Product'}</button>
                      {newProduct.id && (
                        <button type="button" className="btn-primary" style={{ backgroundColor: '#F8FAFC', color: '#0F172A', border: '1px solid #E2E8F0', height: '42px' }} onClick={() => setNewProduct({ nameUr: '', descriptionUr: '', name: '', weight: '', price: '', image: '', discount: '', category: categories.length > 0 ? categories[0].name : '', stock: 0, shortDescription: '', description: '', specifications: [], featured: false, bestSeller: false, enabled: true, images: [], reviews: [] })}>
                          Cancel Edit
                        </button>
                      )}
                    </div>
                  </form>
                </div>

                {/* Products List */}
                <div className="glass" style={{ padding: '2rem', borderRadius: '1rem' }}>
                  <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Grid size={20} color="var(--primary)" /> Manage Products
                  </h3>
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                      <thead>
                        <tr style={{ borderBottom: '2px solid #E2E8F0', color: 'var(--text-muted)' }}>
                          <th style={{ padding: '1rem', fontWeight: 600 }}>Image</th>
                          <th style={{ padding: '1rem', fontWeight: 600 }}>Product Name</th>
                          <th style={{ padding: '1rem', fontWeight: 600 }}>Category</th>
                          <th style={{ padding: '1rem', fontWeight: 600 }}>Price</th>
                          <th style={{ padding: '1rem', fontWeight: 600 }}>Stock</th>
                          <th style={{ padding: '1rem', fontWeight: 600 }}>Status</th>
                          <th style={{ padding: '1rem', fontWeight: 600 }}>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {products.map(product => (
                          <tr key={product.id} style={{ borderBottom: '1px solid #E2E8F0' }}>
                            <td style={{ padding: '1rem' }}>
                              <img src={product.image} alt={getProductName(product)} style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '0.5rem', backgroundColor: '#F8FAFC' }} />
                            </td>
                            <td style={{ padding: '1rem', fontWeight: 500 }}>{getProductName(product)}</td>
                            <td style={{ padding: '1rem', fontSize: '0.875rem' }}>{t(product.category)}</td>
                            <td style={{ padding: '1rem', fontWeight: 700, color: 'var(--primary)' }}>{t("rs")} {product.price.toFixed(2)}</td>
                            <td style={{ padding: '1rem' }}>{product.stock}</td>
                            <td style={{ padding: '1rem' }}>
                              <span style={{ fontSize: '0.75rem', fontWeight: 600, padding: '0.25rem 0.5rem', borderRadius: '9999px', backgroundColor: product.enabled ? '#D1FAE5' : '#FEE2E2', color: product.enabled ? '#047857' : '#DC2626' }}>
                                {product.enabled ? 'Active' : 'Disabled'}
                              </span>
                            </td>
                            <td style={{ padding: '1rem' }}>
                              <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <button 
                                  onClick={() => {
                                    setNewProduct({
                                      ...product,
                                      enabled: product.active !== undefined ? product.active : (product.enabled ?? true)
                                    });
                                    window.scrollTo({ top: 0, behavior: 'smooth' });
                                  }}
                                  style={{ color: '#3B82F6', backgroundColor: '#EFF6FF', padding: '0.5rem 1rem', borderRadius: '0.5rem', fontWeight: 600, border: 'none', cursor: 'pointer' }}
                                >
                                  Edit
                                </button>
                                <button 
                                  onClick={() => handleRemoveProduct(product.id)}
                                  style={{ color: '#EF4444', backgroundColor: '#FEE2E2', padding: '0.5rem 1rem', borderRadius: '0.5rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem', border: 'none', cursor: 'pointer' }}
                                >
                                  <Trash2 size={16} /> Remove
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {products.length === 0 && (
                      <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>No products in store. Add some!</div>
                    )}
                  </div>
                </div>
                </>
) : (
                  <>
                    {/* Orders Analytics & List */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                      <div className="glass" style={{ padding: '1.5rem', borderRadius: '1rem', textAlign: 'center' }}>
                        <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-main)' }}>{orders.length}</div>
                        <div style={{ color: 'var(--text-muted)', fontWeight: 600 }}>{t("totalOrders")}</div>
                      </div>
                      <div className="glass" style={{ padding: '1.5rem', borderRadius: '1rem', textAlign: 'center' }}>
                        <div style={{ fontSize: '2rem', fontWeight: 800, color: '#10B981' }}>{t("rs")} {orders.filter(o => o.status === 'Completed').reduce((sum, o) => sum + o.total, 0).toFixed(2)}</div>
                        <div style={{ color: 'var(--text-muted)', fontWeight: 600 }}>{t("totalRevenue")}</div>
                      </div>
                      <div className="glass" style={{ padding: '1.5rem', borderRadius: '1rem', textAlign: 'center' }}>
                        <div style={{ fontSize: '2rem', fontWeight: 800, color: '#F59E0B' }}>{orders.filter(o => o.status === 'Pending').length}</div>
                        <div style={{ color: 'var(--text-muted)', fontWeight: 600 }}>Pending Orders</div>
                      </div>
                    </div>
                    
                    <div className="glass" style={{ padding: '2rem', borderRadius: '1rem', marginBottom: '2rem' }}>
                      <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <MessageCircle size={20} color="#25D366" /> WhatsApp Message Template
                      </h3>
                      <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '1rem' }}>
                        Use <strong>{'{CustomerName}'}</strong> and <strong>{'{OrderID}'}</strong> in your text. They will be replaced with actual order details.
                      </p>
                      <textarea 
                        className="search-input"
                        value={messageTemplate}
                        onChange={(e) => {
                          setMessageTemplate(e.target.value);
                          localStorage.setItem('messageTemplate', e.target.value);
                        }}
                        style={{ width: '100%', minHeight: '180px', padding: '1rem', borderRadius: '0.5rem', border: '1px solid var(--glass-border)', fontSize: '1rem', resize: 'vertical' }}
                        dir="auto"
                      />
                    </div>

                    <div className="glass" style={{ padding: '2rem', borderRadius: '1rem' }}>
                      <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <ClipboardList size={20} color="var(--primary)" /> Manage Orders
                        </div>
                        <button onClick={printAllOrders} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: 'transparent', color: 'var(--text-main)', padding: '0.5rem 1rem', borderRadius: '0.5rem', border: '1px solid var(--glass-border)', fontWeight: 600, cursor: 'pointer', fontSize: '0.875rem' }} title="Print all orders in one go">
                          <Printer size={16} /> Print All
                        </button>
                      </h3>
                      <div style={{ overflowX: 'auto' }}>
                        
                    <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
                      <div style={{ flex: 1, minWidth: '200px', position: 'relative' }}>
                        <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                        <input 
                          type="text" 
                          placeholder="Search Order ID or Customer Name..." 
                          value={orderSearchQuery}
                          onChange={(e) => setOrderSearchQuery(e.target.value)}
                          className="search-input"
                          style={{ paddingLeft: '2.5rem', width: '100%' }}
                        />
                      </div>
                      <select 
                        value={orderStatusFilter} 
                        onChange={(e) => setOrderStatusFilter(e.target.value)}
                        className="search-input"
                        style={{ minWidth: '150px' }}
                      >
                        <option value="All">All Statuses</option>
                        <option value="Pending">Pending</option>
                        <option value="Confirmed">Confirmed</option>
                        <option value="Processing">Processing</option>
                        <option value="Ready">Ready</option>
                        <option value="Completed">Completed</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </div>
                    <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'flex-end' }}>
                      <button 
                        onClick={handleDeleteAllCompleted} 
                        style={{ color: '#fff', backgroundColor: '#EF4444', padding: '0.75rem 1.5rem', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', cursor: 'pointer', fontWeight: 600, gap: '0.5rem' }} 
                        title="Delete all Completed Orders"
                      >
                        <Trash2 size={18} /> Delete All Completed Orders
                      </button>
                    </div>
                    
                    <div style={{ overflowX: 'auto', backgroundColor: 'var(--bg-color)', borderRadius: '0.5rem', border: '1px solid var(--glass-border)' }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '1000px' }}>
                        <thead>
                          <tr style={{ backgroundColor: 'var(--glass-border)', textAlign: 'left' }}>
                            <th style={{ padding: '1rem', fontWeight: 600 }}>Order ID</th>
                            <th style={{ padding: '1rem', fontWeight: 600 }}>Customer Info</th>
                            <th style={{ padding: '1rem', fontWeight: 600 }}>Items & Amount</th>
                            <th style={{ padding: '1rem', fontWeight: 600 }}>Payment & Notes</th>
                            <th style={{ padding: '1rem', fontWeight: 600 }}>Status</th>
                            <th style={{ padding: '1rem', fontWeight: 600 }}>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {orders
                            .filter(o => orderStatusFilter === 'All' || o.status === orderStatusFilter)
                            .filter(o => o.id.toLowerCase().includes(orderSearchQuery.toLowerCase()) || o.customerName.toLowerCase().includes(orderSearchQuery.toLowerCase()))
                            .map((order) => (
                              <tr key={order.id} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                                <td style={{ padding: '1rem', fontWeight: 700, verticalAlign: 'top' }}>
                                  <div>{order.id}</div>
                                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 400, marginTop: '0.25rem' }}>{new Date(order.date).toLocaleString()}</div>
                                </td>
                                <td style={{ padding: '1rem', verticalAlign: 'top' }}>
                                  <div style={{ fontWeight: 600 }}>{order.customerName}</div>
                                  <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>{order.mobile}</div>
                                  <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '0.25rem', maxWidth: '200px' }}>{order.address}</div>
                                </td>
                                <td style={{ padding: '1rem', verticalAlign: 'top' }}>
                                  <div style={{ fontWeight: 700, color: 'var(--primary)', marginBottom: '0.5rem', fontSize: '1.1rem' }}>Rs {order.total.toFixed(2)}</div>
                                  <div style={{ fontSize: '0.875rem', maxHeight: '100px', overflowY: 'auto' }}>
                                    {order.items.map((item, idx) => (
                                      <div key={idx} style={{ marginBottom: '0.25rem' }}>{item.quantity}x {item.name}</div>
                                    ))}
                                  </div>
                                </td>
                                <td style={{ padding: '1rem', verticalAlign: 'top', maxWidth: '250px' }}>
                                  <div style={{ fontSize: '0.875rem', marginBottom: '0.5rem' }}><strong>Method:</strong> {order.paymentMethod}</div>
                                  <div style={{ fontSize: '0.875rem', marginBottom: '0.5rem' }}><strong>Status:</strong> {order.paymentStatus}</div>
                                  {order.customerNotes && (
                                    <div style={{ fontSize: '0.875rem', padding: '0.5rem', backgroundColor: '#FEF3C7', color: '#B45309', borderRadius: '0.25rem', marginBottom: '0.5rem' }}>
                                      <strong>Note:</strong> {order.customerNotes}
                                    </div>
                                  )}
                                  <textarea 
                                    placeholder="Internal notes..." 
                                    defaultValue={order.internalNotes}
                                    onBlur={(e) => { if(e.target.value !== order.internalNotes) handleSaveInternalNotes(order.id, e.target.value) }}
                                    style={{ width: '100%', fontSize: '0.75rem', padding: '0.25rem', minHeight: '40px', resize: 'vertical', border: '1px solid var(--glass-border)', borderRadius: '0.25rem', backgroundColor: 'transparent', color: 'var(--text-main)' }}
                                  />
                                </td>
                                <td style={{ padding: '1rem', verticalAlign: 'top' }}>
                                  <select 
                                    value={order.status} 
                                    onChange={(e) => handleChangeOrderStatus(order.id, e.target.value)}
                                    style={{ 
                                      backgroundColor: order.status === 'Completed' ? '#D1FAE5' : order.status === 'Cancelled' ? '#FEE2E2' : '#FEF3C7', 
                                      color: order.status === 'Completed' ? '#047857' : order.status === 'Cancelled' ? '#B91C1C' : '#D97706', 
                                      padding: '0.25rem 0.75rem', 
                                      borderRadius: '9999px', 
                                      fontSize: '0.875rem', 
                                      fontWeight: 600,
                                      border: 'none',
                                      cursor: 'pointer',
                                      outline: 'none',
                                      width: '100%'
                                    }}
                                  >
                                    <option value="Pending">Pending</option>
                                    <option value="Confirmed">Confirmed</option>
                                    <option value="Processing">Processing</option>
                                    <option value="Ready">Ready</option>
                                    <option value="Completed">Completed</option>
                                    <option value="Cancelled">Cancelled</option>
                                  </select>
                                  {order.notificationSent && (
                                    <div style={{ fontSize: '0.75rem', color: '#10B981', marginTop: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                      <CheckCircle size={12} /> Notified
                                    </div>
                                  )}
                                </td>
                                <td style={{ padding: '1rem', verticalAlign: 'top' }}>
                                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                                    {order.status === 'Pending' && (
                                      <>
                                        <button onClick={() => handleChangeOrderStatus(order.id, 'Confirmed')} style={{ color: '#fff', backgroundColor: '#3B82F6', padding: '0.5rem', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', cursor: 'pointer', flex: 1 }} title="Accept Order">
                                          <Check size={16} /> Accept
                                        </button>
                                        <button onClick={() => handleChangeOrderStatus(order.id, 'Cancelled')} style={{ color: '#fff', backgroundColor: '#EF4444', padding: '0.5rem', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', cursor: 'pointer', flex: 1 }} title="Reject Order">
                                          <X size={16} /> Reject
                                        </button>
                                      </>
                                    )}
                                    {order.status !== 'Completed' && order.status !== 'Cancelled' && (
                                      <button onClick={() => handleCompleteAndNotify(order)} style={{ color: '#10B981', backgroundColor: '#ECFDF5', padding: '0.5rem', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #10B981', fontWeight: 600, fontSize: '0.875rem', gap: '0.25rem', cursor: 'pointer', flex: '1 1 100%' }} title="Complete Order & Notify">
                                        <CheckCircle size={16} /> Complete
                                      </button>
                                    )}
                                    <button onClick={() => sendWhatsAppMessage(order)} style={{ color: '#fff', backgroundColor: '#25D366', padding: '0.5rem', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', fontWeight: 600, fontSize: '0.875rem', gap: '0.25rem', cursor: 'pointer', flex: '1 1 100%' }} title="Send WhatsApp">
                                      <MessageCircle size={16} /> WhatsApp
                                    </button>
                                    <button onClick={() => printReceipt(order)} style={{ color: '#64748B', backgroundColor: '#F1F5F9', padding: '0.5rem', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', cursor: 'pointer', flex: 1 }} title="Print Receipt">
                                      <Printer size={18} /> Print
                                    </button>
                                    {order.status === 'Completed' && (
                                      <button onClick={() => handleDeleteOrder(order)} style={{ color: '#fff', backgroundColor: '#EF4444', padding: '0.5rem', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', cursor: 'pointer', flex: 1 }} title="Delete Order">
                                        <Trash2 size={16} /> Delete
                                      </button>
                                    )}
                                  </div>
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>

                      </div>
                    </div>
                  </>
                )}
              </div>
            )}
          </section>
        )}

        {currentView === 'wishlist' && (
          <section className="container" style={{ padding: '4rem 0', animation: 'fadeIn 0.3s ease-out forwards' }}>
            <button onClick={() => setCurrentView('home')} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', backgroundColor: 'transparent', border: 'none', cursor: 'pointer', fontWeight: 600, marginBottom: '2rem', padding: '0.5rem 0', transition: 'color 0.2s' }}>
              <ArrowLeft size={20} /> Back to Store
            </button>
            <h2 className="section-title" style={{ marginBottom: '2rem' }}>
              <Heart className="text-emerald-600" size={28} color="#EF4444" />
              My Wishlist
            </h2>
            
            {wishlistItems.length === 0 ? (
              <div className="glass" style={{ padding: '4rem 2rem', borderRadius: '1rem', textAlign: 'center' }}>
                <Heart size={48} color="#CBD5E1" style={{ margin: '0 auto 1rem' }} />
                <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Your wishlist is empty</h3>
                <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Looks like you haven't saved any items yet.</p>
                <button className="btn-primary" onClick={() => setCurrentView('home')}>Start Shopping</button>
              </div>
            ) : (
              <div className="products-grid">
                {wishlistItems.map(product => (
                  <div key={product.id} className="product-card" style={{ padding: '1.5rem', border: '1px solid #E2E8F0', borderRadius: '1rem', position: 'relative', overflow: 'hidden' }}>
                    <button onClick={() => toggleWishlist(product)} style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', cursor: 'pointer', color: '#EF4444', zIndex: 5 }}>
                      <Heart size={20} fill="#EF4444" />
                    </button>
                    
                    
                <div className="product-image-wrapper" style={{ cursor: 'pointer', position: 'relative' }} onClick={(e) => { 
                  if (e.target.closest('.floating-actions')) return;
                  setActiveProduct(product); 
                  setCurrentView('product-details'); 
                }}>
                  <img src={product.image} alt={getProductName(product)} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                  <div className="floating-actions" style={{ position: 'absolute', bottom: '0', left: '0', right: '0', padding: '0.75rem', display: 'flex', gap: '0.5rem', background: 'rgba(255,255,255,0.5)', backdropFilter: 'blur(8px)', justifyContent: 'center', padding: '0.4rem' }}>
                    {product.stock > 0 ? (
                      <>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            const existing = cartItems.find(i => i.id === product.id);
                            if (existing) {
                              updateQuantity(product.id, 1);
                            } else {
                              setCartItems([...cartItems, { ...product, quantity: 1 }]);
                            }
                            showToast('Added to cart');
                          }}
                          style={{ flex: 1, padding: '0.4rem 0.2rem', borderRadius: '0.25rem', border: 'none', backgroundColor: 'var(--primary)', color: 'white', fontWeight: 600, fontSize: '0.75rem', cursor: 'pointer', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', whiteSpace: 'nowrap' }}
                        >
                          Add to Cart
                        </button>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            const existing = cartItems.find(i => i.id === product.id);
                            if (!existing) {
                              setCartItems([...cartItems, { ...product, quantity: 1 }]);
                            }
                            setCartOpen(true);
                            setIsCheckoutForm(true);
                          }}
                          style={{ flex: 1, padding: '0.4rem 0.2rem', borderRadius: '0.25rem', border: 'none', backgroundColor: '#F97316', color: 'white', fontWeight: 600, fontSize: '0.75rem', cursor: 'pointer', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', whiteSpace: 'nowrap' }}
                        >
                          Buy Now
                        </button>
                      </>
                    ) : (
                      <div style={{ padding: '0.3rem', width: '100%', textAlign: 'center', backgroundColor: '#FEE2E2', color: '#DC2626', fontWeight: 700, borderRadius: '0.25rem', fontSize: '0.75rem', whiteSpace: 'nowrap' }}>
                        Out of Stock
                      </div>
                    )}
                  </div>
                </div>

                    
                    <div className="product-info">
                      <h3 style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>{getProductName(product)}</h3>
                      <div className="product-rating" style={{ display: 'flex', gap: '0.25rem', color: '#FBBF24', marginBottom: '0.5rem' }}>
                        <Star size={14} fill="currentColor" /><Star size={14} fill="currentColor" /><Star size={14} fill="currentColor" /><Star size={14} fill="currentColor" /><Star size={14} fill="currentColor" />
                      </div>
                      
                      <div className="product-footer" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '1rem' }}>
                        <div className="price-block" style={{ display: 'flex', alignItems: 'baseline', gap: '0.25rem' }}>
                          <span className="price" style={{ fontSize: '1.25rem', fontWeight: 700 }}>{t("rs")} {product.price.toFixed(2)}</span>
                          <span style={{ fontSize: '0.75rem', color: '#94A3B8' }}>/ unit</span>
                        </div>
                        
                        <div className="card-hover-action">
                          <button className="btn-primary" style={{ width: '100%', padding: '0.5rem', borderRadius: '0.5rem', fontSize: '0.875rem' }} onClick={() => {
                              const existing = cartItems.find(i => i.id === product.id);
                              if (existing) {
                                updateQuantity(product.id, 1);
                              } else {
                                setCartItems([...cartItems, { ...product, quantity: 1 }]);
                              }
                              setCartOpen(true);
                          }}>
                            Add to Cart
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}
      </main>

      {/* Menu Drawer */}
      <div className={`cart-overlay ${menuOpen ? 'open' : ''}`} onClick={() => setMenuOpen(false)}></div>
      <div className={`cart-drawer ${menuOpen ? 'open' : ''}`} style={{ left: menuOpen ? 0 : '-100%', right: 'auto', boxShadow: '10px 0 30px rgba(0, 0, 0, 0.1)', transition: 'left 0.3s cubic-bezier(0.4, 0, 0.2, 1)' }}>
        <div className="cart-header">
          <h2 className="cart-title">
            <img src="/logo.jpg" alt="Logo" style={{ height: '24px', borderRadius: '4px' }} />
            Huzaifa Traders
          </h2>
          <button className="close-btn" onClick={() => setMenuOpen(false)}>
            <X size={24} />
          </button>
        </div>
        <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          
          <div style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Account</div>
          <button style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.75rem', borderRadius: '0.5rem', color: 'var(--text-main)', textAlign: 'left', fontWeight: 600, transition: 'all 0.2s' }} onClick={() => { setCurrentView('profile'); setMenuOpen(false); }}>
            <User size={20} />
            My Profile
          </button>
          <button style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.75rem', borderRadius: '0.5rem', color: 'var(--text-main)', textAlign: 'left', fontWeight: 600, transition: 'all 0.2s' }} onClick={() => { setCartOpen(true); setIsCheckoutForm(false); setMenuOpen(false); }}>
            <ShoppingBag size={20} />
            My Cart
          </button>
          <button style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.75rem', borderRadius: '0.5rem', color: currentView === 'wishlist' ? 'var(--primary)' : 'var(--text-main)', textAlign: 'left', fontWeight: 600, transition: 'all 0.2s' }} onClick={() => { setCurrentView('wishlist'); setMenuOpen(false); }}>
            <Heart size={20} />
            Wishlist
          </button>
          
          <hr style={{ border: 'none', borderTop: '1px solid #E2E8F0', margin: '1rem 0' }} />
          <div style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Management</div>
          <button style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.75rem', borderRadius: '0.5rem', color: 'var(--text-main)', textAlign: 'left', fontWeight: 600, transition: 'all 0.2s' }} onClick={() => { setCurrentView('admin'); setMenuOpen(false); }}>
            <Settings size={20} />
            Admin Panel
          </button>
        </div>
      </div>

      {/* Cart Drawer */}
      <div className={`cart-overlay ${cartOpen ? 'open' : ''}`} onClick={() => setCartOpen(false)}></div>
      <div className={`cart-drawer ${cartOpen ? 'open' : ''}`} style={{ padding: '2rem 1.5rem', backgroundColor: '#F8FAFC' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>Shopping Cart</h2>
          <button onClick={() => setCartOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B' }}>
            <X size={20} />
          </button>
        </div>

        {isCheckoutForm ? (
          <div style={{ display: 'flex', flexDirection: 'column', height: '100%', flex: 1, padding: '0.5rem 0' }}>
            <h3 style={{ marginBottom: '1.5rem', fontSize: '1.1rem', color: 'var(--text-muted)' }}>Complete your order</h3>
            <form onSubmit={handlePlaceOrder} style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', overflowY: 'auto', paddingRight: '0.5rem', paddingBottom: '1rem' }}>
                <div className="glass" style={{ marginBottom: '0.5rem', padding: '1rem', borderRadius: '0.5rem' }}>
                  <h4 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '0.75rem' }}>Order Summary ({cartItems.length} items)</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '120px', overflowY: 'auto' }}>
                    {cartItems.map(item => (
                      <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                        <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', paddingRight: '1rem' }}>{item.quantity}x {item.name}</span>
                        <span style={{ fontWeight: 600, flexShrink: 0 }}>{t("rs")} {(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 600 }}>{t("fullName")}</label>
                  <input type="text" placeholder="John Doe" value={checkoutData.name} onChange={e => setCheckoutData({...checkoutData, name: e.target.value})} className="search-input" style={{ width: '100%' }} required />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 600 }}>{t("mobileNumber")}</label>
                  <input type="tel" placeholder="+1 (555) 000-0000" value={checkoutData.phone} onChange={e => setCheckoutData({...checkoutData, phone: e.target.value})} className="search-input" style={{ width: '100%' }} required />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 600 }}>{t("deliveryAddress")}</label>
                  <textarea placeholder="123 Main St, City, Country" value={checkoutData.address} onChange={e => setCheckoutData({...checkoutData, address: e.target.value})} className="search-input" style={{ width: '100%', minHeight: '80px', resize: 'vertical' }} required />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 600 }}>Payment Method</label>
                  <select value={checkoutData.paymentMethod} onChange={e => setCheckoutData({...checkoutData, paymentMethod: e.target.value})} className="search-input" style={{ width: '100%' }}>
                    <option value="Cash on Delivery">Cash on Delivery</option>
                    <option value="Bank Transfer">Bank Transfer</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 600 }}>Order Notes (Optional)</label>
                  <textarea placeholder="Any special instructions?" value={checkoutData.customerNotes} onChange={e => setCheckoutData({...checkoutData, customerNotes: e.target.value})} className="search-input" style={{ width: '100%', minHeight: '60px', resize: 'vertical' }} />
                </div>
              </div>
              
              <div style={{ marginTop: 'auto', paddingTop: '1.5rem', borderTop: '1px solid #E2E8F0', flexShrink: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', fontWeight: 700, fontSize: '1.25rem' }}>
                  <span>Total to Pay</span>
                  <span style={{ color: 'var(--primary)' }}>{t("rs")} {cartTotal.toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <button type="button" className="btn-primary" style={{ backgroundColor: 'transparent', color: 'var(--text-main)', border: '1px solid #E2E8F0', flex: 1, padding: '1rem' }} onClick={() => setIsCheckoutForm(false)}>Back</button>
                  <button type="submit" className="btn-primary" style={{ flex: 2, padding: '1rem' }}>Confirm Order</button>
                </div>
              </div>
            </form>
          </div>
        ) : (
          <>
            {deliveryProgress >= 100 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#10B981', fontSize: '0.875rem', fontWeight: 600, marginBottom: '1.5rem' }}>
                <div style={{ width: '16px', height: '16px', borderRadius: '50%', backgroundColor: '#10B981', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✓</div>
                Free delivery
              </div>
            )}

            <div className="cart-items" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', flex: 1, overflowY: 'auto', minHeight: 0 }}>
              {cartItems.length === 0 ? (
                <div style={{ textAlign: 'center', color: 'var(--text-muted)', marginTop: '2rem' }}>
                  Your cart is empty.
                </div>
              ) : (
                cartItems.map(item => (
                  <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.5rem', borderBottom: '1px solid #E2E8F0' }}>
                    <img src={item.image} alt={item.name} style={{ width: '50px', height: '50px', objectFit: 'contain', backgroundColor: 'white', borderRadius: '0.5rem', padding: '0.25rem' }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.25rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.name}</div>
                      <div style={{ fontSize: '0.875rem', fontWeight: 700 }}>{t("rs")} {item.price.toFixed(2)}</div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.5rem' }}>
                      <button type="button" onClick={() => removeItem(item.id)} style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer' }}><Trash2 size={16} /></button>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: '#F1F5F9', color: '#0F172A', padding: '0.25rem 0.5rem', borderRadius: '0.25rem' }}>
                        <button type="button" onClick={() => updateQuantity(item.id, -1)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B' }}><Minus size={12}/></button>
                        <span style={{ fontSize: '0.875rem', fontWeight: 600, width: '16px', textAlign: 'center' }}>{item.quantity}</span>
                        <button type="button" onClick={() => updateQuantity(item.id, 1)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B' }}><Plus size={12}/></button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div style={{ marginTop: 'auto', paddingTop: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <span style={{ fontSize: '1.25rem', fontWeight: 700 }}>{t("total")}</span>
                <span style={{ fontSize: '1.25rem', fontWeight: 700 }}>{t("rs")} {cartTotal.toFixed(2)}</span>
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 600 }}>
                <span>Free Delivery</span>
                <span style={{ color: deliveryProgress >= 100 ? '#10B981' : '#94A3B8' }}>{deliveryProgress >= 100 ? '+ FREE' : `Add ${t("rs")} ${(freeDeliveryThreshold - cartTotal).toFixed(2)}`}</span>
              </div>
              <div style={{ width: '100%', height: '8px', backgroundColor: '#E2E8F0', borderRadius: '4px', marginBottom: '1.5rem', overflow: 'hidden' }}>
                <div style={{ height: '100%', backgroundColor: '#10B981', width: `${deliveryProgress}%` }}></div>
              </div>
              
              <button type="button" className="btn-primary" onClick={() => setIsCheckoutForm(true)} disabled={cartItems.length === 0} style={{ width: '100%', padding: '1rem', borderRadius: '0.5rem', fontSize: '1rem' }}>
                Checkout
              </button>
            </div>
          </>
        )}
      </div>

      {/* Mobile Navigation */}
      <nav className="mobile-nav">
        <a href="#" className={`nav-item ${currentView === 'home' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); setCurrentView('home'); }}>
          <Home size={24} />
          <span>{t("home")}</span>
        </a>
        
        <a href="#" className={`nav-item ${currentView === 'wishlist' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); setCurrentView('wishlist'); }}>
          <Heart size={24} />
          <span>{t("wishlist")}</span>
        </a>
        <a href="#" className="nav-item" onClick={(e) => { e.preventDefault(); setCartOpen(true); setIsCheckoutForm(false); }}>
          <div style={{ position: 'relative' }}>
            <ShoppingCart size={24} />
            {cartItems.length > 0 && (
              <span className="badge" style={{ top: '-4px', right: '-8px', width: '16px', height: '16px', fontSize: '0.6rem' }}>
                {cartItems.length}
              </span>
            )}
          </div>
          <span>{t("cart")}</span>
        </a>
      </nav>

      {/* Toast Notification */}
      <div className={`toast-notification ${toastMessage ? 'show' : ''}`}>
        {toastMessage}
      </div>

      {/* Floating Buttons */}
      <a 
        href={`https://wa.me/${businessDetails.whatsapp}?text=${encodeURIComponent('Hello Huzaifa Traders, I would like to place a wholesale order.')}`}
        target="_blank"
        rel="noopener noreferrer"
        className="whatsapp-btn"
        title="Order on WhatsApp"
      >
        <MessageCircle size={32} />
      </a>

      <button 
        className={`back-to-top ${showBackToTop ? 'show' : ''}`}
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        title="Back to Top"
      >
        <ArrowUp size={24} />
      </button>

    </div>
  );
}

export default App;

