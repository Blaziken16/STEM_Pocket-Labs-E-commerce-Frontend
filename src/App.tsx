import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { API_BASE_URL } from "./utils/constants";
import { Headers, apiFetch } from "./Services/ApiClient";
import { getCart, addToCart, deleteCartItem } from "./Services/cartService";
import { getMyOrders, placeOrder } from "./Services/orderService";
import { useAuth } from "./context/AuthContext";
import { useShopData } from "./hooks/useShopData";
import { useProducts } from "./hooks/useProducts";
import BrowseScreen from "./components/screens/BrowseScreen";
import CartScreen from "./components/screens/CartScreen";
import DetailScreen from "./components/screens/DetailScreen";
import CheckoutScreen from "./components/screens/CheckoutScreen";
import AccountScreen from "./components/screens/AccountScreen";
import {
  getCurrentUser,
  loginUser,
  registerUser,
} from "./Services/authService";
import { 
  Store, 
  User, 
  ShoppingCart, 
  History, 
  Settings, 
  LogOut, 
  Trash2, 
  Plus, 
  Minus, 
  Star, 
  Calendar, 
  ArrowRight, 
  Check, 
  X, 
  Heart, 
  Menu, 
  Sparkles,
  ShoppingBag,
  Info,
  CheckCircle,
  Clock,
  Briefcase,
  Sun,
  Moon,
  ArrowLeft,
  MapPin,
  CreditCard,
  Truck,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { Product, CartItem, Order, User as UserType } from './types';
import { ToyArt } from './components/ToyArt';

export default function App() {
  // State
const {
  token,
  currentUser,
  login,
  register,
  logout,
  refreshCurrentUser,
  setCurrentUser,
  authReady,
} = useAuth();

const {
  cartItems,
  orders,
  setCartItems,
  setOrders,
  loadShopData,
  addToCart,
  updateCartQuantity,
  deleteCartItem,
  buyNow,
  placeOrder,
} = useShopData({
  token,
  setCurrentScreen,
  setCurrentCheckoutIndex,
  triggerToast,
});

const {
  products,
  productsLoading,
  productsError,
  reloadProducts,
} = useProducts();
  const [currentScreen, setCurrentScreen] = useState<'welcome' | 'browse' | 'cart' | 'detail' | 'account' | 'checkout'>('welcome');
  const [selectedProductId, setSelectedProductId] = useState<string>('sleepy-elephant-plush');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const [currentCheckoutIndex, setCurrentCheckoutIndex] = useState<number>(0);

  // Shipping details state
  const [shippingName, setShippingName] = useState('');
  const [shippingPhone, setShippingPhone] = useState('');
  const [shippingStreet, setShippingStreet] = useState('');
  const [shippingCity, setShippingCity] = useState('');
  const [shippingState, setShippingState] = useState('');
  const [shippingZip, setShippingZip] = useState('');
  const [shippingLandmark, setShippingLandmark] = useState('');
  
  // Auth Form State
  const [isRegistering, setIsRegistering] = useState(false);
  const [authEmail, setAuthEmail] = useState('alex@example.com');
  const [authPassword, setAuthPassword] = useState('password');
  const [authName, setAuthName] = useState('Alex Playmaker');
  const [authError, setAuthError] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState(false);

  // Edit Profile Details Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editName, setEditName] = useState('');
  const [editPremium, setEditPremium] = useState(false);

  // Unified Sidebar Drawer State
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Theme dark mode state
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('toybox_theme');
    if (saved) {
      return saved === 'dark';
    }
    return document.documentElement.classList.contains('dark') || 
           (typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });

  // Effect to apply/remove class on root element
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('toybox_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('toybox_theme', 'light');
    }
  }, [isDarkMode]);

  // Interactive Popup Notifications
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null);

  // Fetch initial products


  // Sync token to localStorage
  useEffect(() => {
    if (token) {
      localStorage.setItem('toybox_token', token);
      fetchUserData();
    } else {
      localStorage.removeItem('toybox_token');
      setCurrentUser(null);
      setCartItems([]);
      setOrders([]);
      setCurrentScreen('welcome');
    }
  }, [token]);

  // Fetch user data, cart and orders
  const fetchUserData = async () => {
    if (!token) return;

    try {
      const userData = await getCurrentUser(token);
      if(!userData) return;
      });

      setCurrentUser(userData);
      setEditName(userData.name);
      setEditPremium(!!userData.isPremium);
      setShippingName(userData.name);
      setCurrentScreen((prev) => (prev === "welcome" ? "browse" : prev));
    } catch {
      setToken(null);
      return;
    }

    try {
      const cartData = await getCart(token);
      setCartItems(cartData);
    } catch (err) {
      console.error("Error fetching cart:", err);
    }

    try {
     const ordersData = await getMyOrders(token);
     setOrders(ordersData);
    } catch (err) {
      console.error("Error fetching orders:", err);
    }
  };

    fetch(`${API_BASE_URL}/cart`, { headers })
      .then((res) => res.json())
      .then((data: CartItem[]) => setCartItems(data))
      .catch((err) => console.error('Error fetching cart:', err));

    fetch(`${API_BASE_URL}/orders/my`, { headers })
      .then((res) => res.json())
      .then((data: Order[]) => setOrders(data))
      .catch((err) => console.error('Error fetching orders:', err));
  };
  useEffect(() => {
    if (token) {
      fetchUserData();
    }
  }, [currentScreen]);

  const triggerToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification((prev) => (prev?.message === message ? null : prev));
    }, 4000);
  };

  // Helper Headers

  // Auth Submit Handler
  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setAuthLoading(true);

    const url = isRegistering ? `${API_BASE_URL}/auth/register` : `${API_BASE_URL}/auth/login`;
    const body = isRegistering 
      ? { email: authEmail, password: authPassword, name: authName }
      : { email: authEmail, password: authPassword };

    try {
      if (isRegistering) {
        await register({
          name: authName,
          email: authEmail,
          password: authPassword,
        });
        triggerToast("Account registered successfully!", "success");
      } else {
        await login({
          email: authEmail,
          password: authPassword,
        });
        triggerToast("Signed in successfully!", "success");
      }
    } catch (err: any) {
      setAuthError(err.message);
      triggerToast(err.message, "error");
    } finally {
      setAuthLoading(false);
    }
  };

  // Handle Quick Login Click for Evaluation Efficiency
  const handleQuickTester = () => {
    setAuthEmail('alex@example.com');
    setAuthPassword('password');
    setIsRegistering(false);
    triggerToast('Quick tester credentials populated. Click Sign In!', 'info');
  };

  // Cart Adjustments
  const addToCart = async (productId: number, quantity: number = 1, redirectAfter: boolean = false) => {
    if (!token) {
      triggerToast('Please sign in to manage your cart.', 'error');
      setCurrentScreen('welcome');
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/cart/add`, {
        method: 'POST',
        headers: getAuthHeaders(token),
        body: JSON.stringify({ productId, quantity })
      });
      const data = await addToCart(token, productId, quantity);
      setCartItems(data);
      triggerToast("Added item to shopping cart!", "success");
      if (redirectAfter) setCurrentScreen("cart");
      
      if (redirectAfter) {
        setCurrentScreen('cart');
      }
    } catch (err: any) {
      triggerToast(err.message, 'error');
    }
  };

  const updateCartQuantity = async (productId: string, currentQty: number, offset: number) => {
    const targetQty = currentQty + offset;
    
    if (targetQty <= 0) {
      deleteCartItem(productId);
      return;
    }
    try {
      const res = await fetch(`${API_BASE_URL}/cart/add`, {
        method: 'POST',
        headers: getAuthHeaders(token),
        body: JSON.stringify({ productId, quantity: offset })
      });
      const data = await addToCart(token, productId, offset);

      if (!res.ok) throw new Error(data.error || 'Could not modify quantity');

      setCartItems(data);
    } catch (err: any) {
      triggerToast(err.message, 'error');
    }
  };

  const deleteCartItem = async (productId: string | number) => {
    if (!token) return;

    try {
      const data = await deleteCartItem(token, productId);

      setCartItems(data);
      triggerToast("Item removed from cart.", "info");
    } catch (err: any) {
      triggerToast(err.message, "error");
    }
  };

  // Checkout Transition
  const handleCheckout = () => {
    if (cartItems.length === 0) {
      triggerToast('Your cart is empty', 'error');
      return;
    }

    setCurrentCheckoutIndex(0);
    setCurrentScreen('checkout');
  };

  const buyNow = async (product: Product) => {
    if (!token) {
      triggerToast('Please sign in to make a purchase.', 'error');
      setCurrentScreen('welcome');
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/cart/add`, {
        method: 'POST',
        headers: getAuthHeaders(token),
        body: JSON.stringify({
          productId: product.id,
          quantity: 1
        })
      });

      const data = await res.json();
      if (!res.ok) {
          throw new Error(data.error || 'Could not add item to cart');
      }

      setCartItems(data);
      setCurrentCheckoutIndex(0);
      setCurrentScreen('checkout');
      triggerToast('Item added to cart. Proceeding to checkout!', 'success');
    } catch (err: any) {
        triggerToast(err.message, 'error');
    }
};
  const placeOrder = async (addressData: {
    fullName: string;
    phoneNumber: string;
    streetAddress: string;
    city: string;
    state: string;
    zipCode: string;
    landmark?: string;
  }) => {
    try {
      const res = await fetch(`${API_BASE_URL}/orders`, {
        method: 'POST',
        headers: getAuthHeaders(token),
        body: JSON.stringify({
          paymentMethod: 'COD'
        })
      });
       const data = await placeOrder(token, {
         paymentMethod: "COD",
       });

       triggerToast("Order placed successfully! Cash On Delivery COD chosen.", "success");
       setOrders((prev) => [data, ...prev]);
       setCartItems([]);
       setCurrentCheckoutIndex(0);
       setCurrentScreen("account");
       } catch (err: any) {
           triggerToast(err.message, 'error');
    }
};

  const handleCheckoutBack = () => {
    setCurrentScreen('cart');
  };

  const handleSaveProfileDetails = () => {
    if (!currentUser) return;
    
    // update simple profile representation
    setCurrentUser({
      ...currentUser,
      name: editName,
      isPremium: editPremium
    });
    
    setIsEditModalOpen(false);
    triggerToast('Profile updated locally!', 'success');
  };

  const handleLogout = () => {
    logout();
    setCartItems([]);
    setOrders([]);
    setCurrentScreen("welcome");
    triggerToast("Logged out of Pocket Labs.", "info");
  };

  // Calculations
  const cartSubtotal = cartItems.reduce((acc, item) => {
    return acc + (item.product ? item.product.price * item.quantity : 0);
  }, 0);

  const cartTotalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  // Screens Rendering Router
  return (
    <div className="min-h-screen bg-background font-sans text-stone-800 flex flex-col md:flex-row antialiased relative selection:bg-primary-container selection:text-on-primary-container">
      
      {/* Toast Notification Popup */}
      <AnimatePresence>
        {notification && (
          <motion.div
            id="toast-notification"
            initial={{ opacity: 0, y: 50, x: "-50%", scale: 0.9 }}
            animate={{ opacity: 1, y: 0, x: "-50%", scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, y: 20, x: "-50%" }}
            className={`fixed bottom-6 left-1/2 z-[150] rounded-xl shadow-lg p-4 flex items-center gap-3 border w-[calc(100%-2rem)] max-w-sm ${
              notification.type === 'success' 
                ? 'bg-emerald-50 border-emerald-200 text-emerald-800' 
                : notification.type === 'error'
                ? 'bg-rose-50 border-rose-200 text-rose-800'
                : 'bg-sky-50 border-sky-200 text-sky-800'
            }`}
          >
            {notification.type === 'success' && <Check className="w-5 h-5 text-emerald-600 shrink-0" />}
            {notification.type === 'error' && <X className="w-5 h-5 text-rose-600 shrink-0" />}
            {notification.type === 'info' && <Info className="w-5 h-5 text-sky-600 shrink-0" />}
            
            <p className="font-semibold text-sm">{notification.message}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- UNIFIED APPLICATION TOP HEADER BAR --- */}
      {currentUser && (
        <header 
          id="global-topappbar"
          className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-4 md:px-8 bg-surface-container-lowest/80 backdrop-blur-md h-20 border-b border-stone-150/60 shadow-sm"
        >
          {/* Left: Hamburger trigger and Brand Logo */}
          <div className="flex items-center gap-3 md:gap-5">
            <button 
              id="menu-hamburger-btn"
              onClick={() => setIsSidebarOpen(true)}
              className="text-primary hover:scale-105 transition-transform active:scale-95 p-2 rounded-full hover:bg-stone-50 focus:outline-none cursor-pointer"
              title="Open Navigation Menu"
            >
              <Menu className="w-6 h-6 stroke-[2.5]" />
            </button>
            
            <div className="font-display text-2xl md:text-3xl font-extrabold text-primary tracking-tight flex items-center gap-1.5 cursor-pointer selection:bg-transparent" onClick={() => { setCurrentScreen('browse'); setIsSidebarOpen(false); }}>
              Pocket Labs
              <span className="w-2.5 h-2.5 rounded-full bg-secondary-container animate-pulse"></span>
            </div>
          </div>

          {/* Right: Quick shortcuts (Shopping Cart, Profile Avatar) */}
          <div className="flex items-center gap-2 md:gap-4">
            {/* Theme Toggle Button */}
            <button
              id="theme-toggle-btn"
              onClick={() => {
                setIsDarkMode(prev => !prev);
                triggerToast(!isDarkMode ? "Enabled slate dark theme!" : "Enabled light theme!", "info");
              }}
              className="text-primary hover:scale-105 transition-transform active:scale-95 p-2 rounded-full hover:bg-stone-50 dark:hover:bg-stone-800 focus:outline-none cursor-pointer flex items-center justify-center"
              title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {isDarkMode ? (
                <Sun className="w-6 h-6 stroke-[2.5]" />
              ) : (
                <Moon className="w-6 h-6 stroke-[2.5]" />
              )}
            </button>

            {/* Shopping Cart Indicator */}
            <button 
              id="header-cart-indicator"
              onClick={() => setCurrentScreen('cart')}
              className="text-primary hover:scale-105 transition-transform active:scale-95 p-2 rounded-full hover:bg-stone-50 focus:outline-none relative cursor-pointer"
              title="View Shopping Cart"
            >
              <ShoppingCart className="w-6 h-6 stroke-[2.5]" />
              {cartTotalItems > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-secondary-container text-on-secondary-container text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-white">
                  {cartTotalItems}
                </span>
              )}
            </button>

            {/* Profile Avatar Shortcut */}
            <button
              id="header-profile-indicator"
              onClick={() => {
                setCurrentScreen('account');
                triggerToast('Loaded your account dashboard.', 'info');
              }}
              className="relative rounded-full overflow-hidden border border-stone-200 hover:ring-2 hover:ring-primary/25 transition-all p-0.5 focus:outline-none cursor-pointer"
              title="View Account Profile"
            >
              <ToyArt type="user" className="w-9 h-9" />
              {currentUser.isPremium && (
                <span className="absolute bottom-0 right-0 bg-secondary-container text-on-secondary-container rounded-full p-0.5 shadow-sm">
                  <Star className="w-2 h-2 fill-current" />
                </span>
              )}
            </button>
          </div>
        </header>
      )}

      {/* --- UNIFIED NAVIGATION SIDEBAR DRAWER OVERLAY --- */}
      <AnimatePresence>
        {isSidebarOpen && currentUser && (
          <>
            {/* Dark fuzzy backdrop blur */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSidebarOpen(false)}
              className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm"
            />

            {/* Slide Panel Drawer */}
            <motion.nav 
              initial={{ x: '-100%', opacity: 1 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: '-100%', opacity: 1 }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              style={{ opacity: 1 }}
              className="fixed left-0 top-0 h-full w-[85%] max-w-[320px] z-[110] bg-white dark:bg-black !opacity-100 shadow-2xl flex flex-col py-6 border-r border-stone-100 dark:border-stone-900"
            >
              <div className="flex items-center justify-between px-6 pb-6 border-b border-stone-100 dark:border-stone-900">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <ToyArt type="user" className="w-12 h-12" />
                    {currentUser.isPremium && (
                      <span className="absolute bottom-0 right-0 bg-secondary-container rounded-full p-0.5 shadow-sm">
                        <Star className="w-2.5 h-2.5 text-white fill-current" />
                      </span>
                    )}
                  </div>
                  <div>
                    <h2 className="font-display text-slate-800 dark:text-stone-100 font-bold text-base leading-tight">{currentUser.name || 'Pocket Labs Member'}</h2>
                    <p className="text-xs text-stone-500 dark:text-stone-400 font-medium leading-none mt-1">Happy playing</p>
                  </div>
                </div>

                <button 
                  id="drawer-close-btn"
                  onClick={() => setIsSidebarOpen(false)}
                  className="p-1.5 rounded-full hover:bg-stone-100 dark:hover:bg-stone-800 dark:text-stone-300 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5 text-stone-500 dark:text-stone-300" />
                </button>
              </div>

              {/* Navigation Items */}
              <div className="flex-1 py-4 px-3 flex flex-col gap-1 overflow-y-auto">
                <button
                  id="drawer-home"
                  onClick={() => { setCurrentScreen('browse'); setIsSidebarOpen(false); }}
                  className={`flex items-center gap-4 px-4 py-3 rounded-full font-bold text-sm text-left transition-all cursor-pointer ${
                    currentScreen === 'browse' || currentScreen === 'detail'
                      ? 'bg-primary/20 text-primary dark:text-sky-300 font-extrabold' 
                      : 'text-stone-700 dark:text-stone-100 hover:text-stone-950 dark:hover:text-white hover:bg-stone-100/50 dark:hover:bg-stone-800'
                  }`}
                >
                  <Store className="w-5 h-5" />
                  Browse Creations
                </button>

                <button
                  id="drawer-account"
                  onClick={() => { setCurrentScreen('account'); setIsSidebarOpen(false); }}
                  className={`flex items-center gap-4 px-4 py-3 rounded-full font-bold text-sm text-left transition-all cursor-pointer ${
                    currentScreen === 'account' 
                      ? 'bg-primary/20 text-primary dark:text-sky-300 font-extrabold' 
                      : 'text-stone-700 dark:text-stone-100 hover:text-stone-950 dark:hover:text-white hover:bg-stone-100/50 dark:hover:bg-stone-800'
                  }`}
                >
                  <History className="w-5 h-5" />
                  Order History & Profile
                </button>

                <button
                  id="drawer-cart"
                  onClick={() => { setCurrentScreen('cart'); setIsSidebarOpen(false); }}
                  className={`flex items-center gap-4 px-4 py-3 rounded-full font-bold text-sm text-left transition-all cursor-pointer relative ${
                    currentScreen === 'cart' 
                      ? 'bg-primary/20 text-primary dark:text-sky-300 font-extrabold' 
                      : 'text-stone-700 dark:text-stone-100 hover:text-stone-950 dark:hover:text-white hover:bg-stone-100/50 dark:hover:bg-stone-800'
                  }`}
                >
                  <ShoppingCart className="w-5 h-5" />
                  <span>Shopping Cart</span>
                  {cartTotalItems > 0 && (
                    <span className="ml-auto bg-secondary-container text-on-secondary-container font-extrabold text-[11px] px-2.5 py-0.5 rounded-full">
                      {cartTotalItems}
                    </span>
                  )}
                </button>

                <div className="my-4 h-[1.5px] bg-stone-150 dark:bg-stone-800 mx-4" />

                <div className="bg-primary-container/10 p-4 rounded-2xl mx-1 border border-primary-container/20">
                  <div className="flex items-center gap-2 text-primary dark:text-sky-300">
                    <Sparkles className="w-4 h-4 fill-current animate-pulse" />
                    <span className="text-xs font-bold font-display uppercase tracking-wider">Premium Help Desk</span>
                  </div>
                  <p className="text-[11px] text-stone-700 dark:text-stone-300 font-medium mt-1.5">Email Support:</p>
                  <a href="mailto:support@pocketlabs.com" className="text-xs font-bold text-primary dark:text-sky-300 hover:underline">support@pocketlabs.com</a>
                  <p className="text-[11px] text-stone-700 dark:text-stone-300 font-medium mt-1.5">Helpline Support:</p>
                  <p className="text-xs font-bold text-stone-800 dark:text-stone-100">+91-9988776655</p>
                </div>

                <div className="mt-8">
                  <button
                    onClick={() => { handleLogout(); setIsSidebarOpen(false); }}
                    className="flex items-center gap-4 px-4 py-3 rounded-full font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/20 w-full text-left transition-colors cursor-pointer"
                  >
                    <LogOut className="w-5 h-5" />
                    Sign Out
                  </button>
                </div>
              </div>

              {/* Drawer footer */}
              <div className="px-4 pt-4 border-t border-stone-150 dark:border-stone-900 mt-auto">
                <button
                  id="drawer-cta-btn"
                  onClick={() => { setCurrentScreen('browse'); setIsSidebarOpen(false); }}
                  className="w-full bg-primary text-white font-bold py-3 px-4 rounded-full shadow-md text-sm text-center flex items-center justify-center gap-2 cursor-pointer hover:brightness-110 active:scale-95 transition-all"
                >
                  <Store className="w-4 h-4" />
                  Go to Science Shop
                </button>
              </div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>

      {/* --- MAIN PANEL SCROLL CONTAINER --- */}
      <main className={`flex-1 min-h-screen ${currentUser ? 'pt-24' : ''} bg-background font-sans overflow-y-auto`}>
        <div className="max-w-5xl mx-auto px-4 md:px-8 py-6 md:py-10 pb-20">
          
          <AnimatePresence mode="wait">

            {currentScreen === 'welcome' && (
              <motion.div
                key="welcome-screen"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="min-h-[80vh] flex flex-col justify-center items-center py-6"
              >
                <div id="auth-box-container" className="bg-surface-container-lowest rounded-3xl p-6 md:p-10 shadow-xl border border-stone-100/80 max-w-md w-full relative overflow-hidden">
                  
                  {/* Decorative pastel arches */}
                  <div className="absolute -top-12 -right-12 w-32 h-32 bg-primary-container/20 rounded-full blur-xl pointer-events-none"></div>
                  <div className="absolute -bottom-12 -left-12 w-36 h-36 bg-secondary-container/20 rounded-full blur-xl pointer-events-none"></div>

                  <div className="text-center mb-8 relative z-10">
                    <span className="text-primary font-bold text-4xl block font-display uppercase tracking-tight mb-2">Pocket Labs</span>
                    <p className="text-stone-500 font-semibold text-sm">Where play, learning, and wonder unite!</p>
                  </div>

                  {/* Auth Mode Toggle */}
                  <div className="bg-stone-100 p-1 rounded-full flex mb-6">
                    <button
                      id="toggle-login"
                      type="button"
                      onClick={() => { setIsRegistering(false); setAuthError(null); }}
                      className={`flex-1 py-2 rounded-full font-bold text-stone-700 text-xs transition-all ${!isRegistering ? 'bg-white shadow' : 'opacity-60'}`}
                    >
                      Sign In
                    </button>
                    <button
                      id="toggle-register"
                      type="button"
                      onClick={() => { setIsRegistering(true); setAuthError(null); }}
                      className={`flex-1 py-2 rounded-full font-bold text-stone-700 text-xs transition-all ${isRegistering ? 'bg-white shadow' : 'opacity-60'}`}
                    >
                      Create Account
                    </button>
                  </div>

                  {/* Auth form */}
                  <form onSubmit={handleAuthSubmit} className="space-y-4">
                    {isRegistering && (
                      <div>
                        <label className="block text-xs font-extrabold text-stone-600 uppercase tracking-wider mb-1.5">Your Full Name</label>
                        <input
                          id="register-name"
                          type="text"
                          required
                          value={authName}
                          onChange={(e) => setAuthName(e.target.value)}
                          placeholder="Alex Playmaker"
                          className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm font-medium bg-white"
                        />
                      </div>
                    )}

                    <div>
                      <label className="block text-xs font-extrabold text-stone-600 uppercase tracking-wider mb-1.5">Email Address</label>
                      <input
                        id="auth-email"
                        type="email"
                        required
                        value={authEmail}
                        onChange={(e) => setAuthEmail(e.target.value)}
                        placeholder="alex@example.com"
                        className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm font-medium bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-extrabold text-stone-600 uppercase tracking-wider mb-1.5">Password</label>
                      <input
                        id="auth-password"
                        type="password"
                        required
                        value={authPassword}
                        onChange={(e) => setAuthPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm font-medium bg-white"
                      />
                    </div>

                    {authError && (
                      <div className="bg-rose-50 border border-rose-100 text-rose-800 p-3 rounded-xl text-xs font-bold leading-relaxed flex items-start gap-2">
                        <span className="bg-rose-500 text-white rounded-full p-0.5 text-[8px] font-black w-4 h-4 flex items-center justify-center shrink-0">!</span>
                        <span>{authError}</span>
                      </div>
                    )}

                    <button
                      id="auth-submit-btn"
                      type="submit"
                      disabled={authLoading}
                      className="w-full py-3.5 bg-primary text-white font-extrabold rounded-xl shadow-lg shadow-primary/20 hover:brightness-110 active:scale-95 transition-all text-sm flex items-center justify-center gap-2"
                    >
                      {authLoading ? 'Verifying Credentials...' : isRegistering ? 'Register & Start Playing' : 'Sign In To Pocket Labs'}
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </button>
                  </form>

                  {/* Quick-Tester helper panel for easy evaluation without manual input necessity */}
                  <div className="mt-8 border-t border-stone-150 pt-6">
                    <p className="text-[11px] font-extrabold text-[#76450c] uppercase tracking-wider mb-2.5 text-center flex items-center justify-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 fill-[#fbb674] text-amber-600 animate-pulse" />
                      Prototype Testing Utility Dashboard
                    </p>
                    <button
                      id="quick-tester-btn"
                      type="button"
                      onClick={handleQuickTester}
                      className="w-full py-2.5 border-2 border-dashed border-stone-200 rounded-xl hover:border-primary/40 text-stone-600 hover:text-primary transition-all text-xs font-extrabold block text-center"
                    >
                      Populate Tester (alex@example.com)
                    </button>
                  </div>

                </div>
              </motion.div>
            )}

            {
            {currentScreen === 'browse' && (
              <BrowseScreen
                  products={products}
                  selectedCategory={selectedCategory}
                  setSelectedCategory={setSelectedCategory}
                  currentUser={currentUser}
                  setSelectedProductId={setSelectedProductId}
                  setCurrentScreen={setCurrentScreen}
                  handleAddToCart={handleAddToCart}
                />
            )}
            {/* SCREEN 3: SHOPPING CART (Updated Layout conforming to Image 1) */}
            {currentScreen === 'cart' && (
               <CartScreen
                  cartItems={cartItems}
                  cartSubtotal={cartSubtotal}
                  handleUpdateCartQuantity={handleUpdateCartQuantity}
                  handleDeleteCartItem={handleDeleteCartItem}
                  handleCheckout={handleCheckout}
                  setCurrentScreen={setCurrentScreen}
                />
            )}

            {/* SCREEN: SECURE CHECKOUT PAGE (High-fidelity design styled matching mockup) */}
            {currentScreen === 'checkout' && (
              <CheckoutScreen
                  cartItems={cartItems}
                  cartSubtotal={cartSubtotal}
                  currentCheckoutIndex={currentCheckoutIndex}
                  setCurrentCheckoutIndex={setCurrentCheckoutIndex}
                  shippingName={shippingName}
                  setShippingName={setShippingName}
                  shippingPhone={shippingPhone}
                  setShippingPhone={setShippingPhone}
                  shippingStreet={shippingStreet}
                  setShippingStreet={setShippingStreet}
                  shippingCity={shippingCity}
                  setShippingCity={setShippingCity}
                  shippingState={shippingState}
                  setShippingState={setShippingState}
                  shippingZip={shippingZip}
                  setShippingZip={setShippingZip}
                  shippingLandmark={shippingLandmark}
                  setShippingLandmark={setShippingLandmark}
                  handlePlaceOrder={handlePlaceOrder}
                  handleCheckoutBack={handleCheckoutBack}
                  triggerToast={triggerToast}
                />
            )}
            {currentScreen === 'detail' && (
                <DetailScreen
                  products={products}
                  selectedProductId={selectedProductId}
                  setCurrentScreen={setCurrentScreen}
                  handleAddToCart={handleAddToCart}
                  handleBuyNow={handleBuyNow}
                />
            )}

            {/* SCREEN 5: ACCOUNT DASHBOARD & HISTORIC RECENT ORDERS (Matching Image 3) */}
            {currentScreen === 'account' && currentUser && (
              <AccountScreen
                  currentUser={currentUser}
                  orders={orders}
                  cartTotalItems={cartTotalItems}
                  setCurrentScreen={setCurrentScreen}
                  setEditName={setEditName}
                  setEditPremium={setEditPremium}
                  setIsEditModalOpen={setIsEditModalOpen}
                  triggerToast={triggerToast}
                />
            )}

          </AnimatePresence>

        </div>
      </main>

      {/* --- MOBILE NAVIGATION BOTTOM BAR (Image 3 conformable style) --- */}
      {currentUser && (
        <nav 
          id="mobile-bottombar"
          className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-2 py-3 bg-white border-t border-stone-150 shadow-[0px_-4px_10px_rgba(0,0,0,0.03)] rounded-t-2xl md:hidden"
        >
          <button
            id="mobile-tab-shop"
            onClick={() => setCurrentScreen('browse')}
            className={`flex flex-col items-center justify-center gap-0.5 px-4 py-1 transition-transform active:scale-90 ${
              currentScreen === 'browse' || currentScreen === 'detail' ? 'text-primary scale-102' : 'text-stone-400'
            }`}
          >
            <Store className="w-[22px] h-[22px] stroke-[2.2]" />
            <span className="text-[10px] font-black tracking-tight leading-none">Shop</span>
          </button>

          <button
            id="mobile-tab-orders"
            onClick={() => setCurrentScreen('account')}
            className={`flex flex-col items-center justify-center gap-0.5 px-4 py-1 transition-transform active:scale-90 ${
              currentScreen === 'account' ? 'text-primary scale-102' : 'text-stone-400'
            }`}
          >
            <History className="w-[22px] h-[22px] stroke-[2.2]" />
            <span className="text-[10px] font-black tracking-tight leading-none font-sans">Orders</span>
          </button>

          <button
            id="mobile-tab-cart"
            onClick={() => setCurrentScreen('cart')}
            className={`flex flex-col items-center justify-center gap-0.5 px-4 py-1 transition-transform active:scale-90 relative ${
              currentScreen === 'cart' ? 'text-primary scale-102' : 'text-stone-400'
            }`}
          >
            <ShoppingCart className="w-[22px] h-[22px] stroke-[2.2]" />
            <span className="text-[10px] font-black tracking-tight leading-none">Cart</span>
            {cartTotalItems > 0 && (
              <span className="absolute top-0.5 right-2 bg-secondary-container text-on-secondary-container font-black text-[9px] w-4.5 h-4.5 rounded-full flex items-center justify-center border border-white">
                {cartTotalItems}
              </span>
            )}
          </button>

          <button
            id="mobile-tab-profile"
            onClick={() => {
              setCurrentScreen('account');
              triggerToast('Active profile panel loaded.', 'info');
            }}
            className="flex flex-col items-center justify-center gap-0.5 px-4 py-1 text-stone-400 hover:text-primary transition-transform active:scale-90"
          >
            <User className="w-[22px] h-[22px] stroke-[2.2]" />
            <span className="text-[10px] font-black tracking-tight leading-none">Account</span>
          </button>
        </nav>
      )}

      {/* --- EDIT PROFILE DETAILS MODAL PANEL --- */}
      <AnimatePresence>
        {isEditModalOpen && (
          <>
            {/* Modal backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsEditModalOpen(false)}
              className="fixed inset-0 z-[100] bg-black"
            />

            {/* Modal Container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-x-4 top-20 md:top-32 max-w-md mx-auto z-[110] bg-surface-container-lowest rounded-3xl p-6 shadow-2xl border border-stone-100 flex flex-col gap-4"
            >
              <div className="flex justify-between items-center pb-3 border-b border-stone-100">
                <h3 className="font-display font-black text-xl text-stone-950">Edit Profile Details</h3>
                <button 
                  onClick={() => setIsEditModalOpen(false)}
                  className="p-1.5 rounded-full hover:bg-stone-50"
                >
                  <X className="w-5 h-5 text-stone-400" />
                </button>
              </div>

              {/* Form elements */}
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-extrabold text-stone-600 uppercase tracking-wider mb-1.5">Profile Name</label>
                  <input
                    id="edit-profile-name"
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    placeholder="Alex Playmaker"
                    className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm font-medium bg-white"
                  />
                </div>

                {/* Switch button for Premium status for demo toggles */}
                <div className="flex items-center justify-between p-3.5 bg-stone-50 rounded-2xl border border-stone-150">
                  <div className="space-y-0.5">
                    <p className="text-xs font-black text-stone-900 uppercase tracking-wide">Toggle Premium Stars Membership</p>
                    <p className="text-[10px] text-stone-500 font-medium">Earn stars badges and custom shipping discounts</p>
                  </div>

                  <button
                    id="edit-profile-premium-toggle"
                    type="button"
                    onClick={() => setEditPremium(!editPremium)}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                      editPremium ? 'bg-primary' : 'bg-stone-200'
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        editPremium ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              </div>

              {/* Action buttons */}
              <div className="grid grid-cols-2 gap-2 pt-4 border-t border-stone-100">
                <button
                  onClick={() => setIsEditModalOpen(false)}
                  className="w-full py-2.5 bg-stone-100 font-bold hover:bg-stone-200 text-stone-700 rounded-xl text-xs text-center"
                >
                  Cancel
                </button>
                <button
                  id="save-profile-btn"
                  onClick={handleSaveProfileDetails}
                  className="w-full py-2.5 bg-primary hover:brightness-105 font-extrabold text-white rounded-xl text-xs text-center shadow"
                >
                  Save Details
                </button>
              </div>

            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
}
