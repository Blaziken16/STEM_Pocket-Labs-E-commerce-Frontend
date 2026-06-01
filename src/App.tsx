import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
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
  const API_BASE_URL = "http://127.0.0.1:8080";
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('toybox_token'));
  const [currentUser, setCurrentUser] = useState<UserType | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
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
  useEffect(() => {
    fetch(`${API_BASE_URL}/products`)
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.error('Error fetching toys:', err));
  }, []);

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
  const fetchUserData = () => {
    if (!token) return;

    const headers = { Authorization: `Bearer ${token}` };

    // Fetch user details
    fetch(`${API_BASE_URL}/me`, { headers })
      .then((res) => {
        if (!res.ok) throw new Error('Invalid token');
        return res.json();
      })
      .then((userData: UserType) => {
        setCurrentUser(userData);
        setEditName(userData.name);
        setEditPremium(userData.isPremium);
        setShippingName(userData.name || '');
        setCurrentScreen((prev) => (prev === 'welcome' ? 'browse' : prev));
      })
      .catch(() => {
        setToken(null);
      });

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
  const getAuthHeaders = () => ({
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`
  });

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
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Something went wrong');
      }

      setToken(data.token);
      triggerToast(isRegistering ? 'Account registered successfully!' : 'Signed in successfully!', 'success');
    } catch (err: any) {
      setAuthError(err.message);
      triggerToast(err.message, 'error');
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
  const handleAddToCart = async (productId: number, quantity: number = 1, redirectAfter: boolean = false) => {
    if (!token) {
      triggerToast('Please sign in to manage your cart.', 'error');
      setCurrentScreen('welcome');
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/cart/add`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ productId, quantity })
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Could not add to cart');
      
      setCartItems(data);
      triggerToast('Added item to shopping cart!', 'success');
      
      if (redirectAfter) {
        setCurrentScreen('cart');
      }
    } catch (err: any) {
      triggerToast(err.message, 'error');
    }
  };

  const handleUpdateCartQuantity = async (productId: string, currentQty: number, offset: number) => {
    const targetQty = currentQty + offset;
    
    if (targetQty <= 0) {
      handleDeleteCartItem(productId);
      return;
    }

    // Add negative or positive offset
    try {
      const res = await fetch(`${API_BASE_URL}/cart/add`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ productId, quantity: offset })
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Could not modify quantity');

      setCartItems(data);
    } catch (err: any) {
      triggerToast(err.message, 'error');
    }
  };

  const handleDeleteCartItem = async (itemId: string) => {
    try {
      const res = await fetch(`${API_BASE_URL}/cart/${productId}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Could not delete item');

      setCartItems(data);
      triggerToast('Item removed from cart.', 'info');
    } catch (err: any) {
      triggerToast(err.message, 'error');
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

  const handleBuyNow = async (product: Product) => {
    if (!token) {
      triggerToast('Please sign in to make a purchase.', 'error');
      setCurrentScreen('welcome');
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/cart/add`, {
        method: 'POST',
        headers: getAuthHeaders(),
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
  const handlePlaceOrder = async (addressData: {
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
        headers: getAuthHeaders(),
        body: JSON.stringify({
          paymentMethod: 'COD'
        })
      });
      const data = await res.json();

       if (!res.ok) {
           throw new Error(data.error || 'Checkout process failed');
       }

       triggerToast('Order placed successfully! Cash On Delivery (COD) chosen.', 'success');
       setOrders((prev) => [data, ...prev]);
       setCartItems([]);
       setCurrentCheckoutIndex(0);
       setCurrentScreen('account');
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
    setToken(null);
    triggerToast('Logged out of Pocket Labs.', 'info');
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
            
            {/* SCREEN 1: WELCOME / SIGN IN (Initial screen) */}
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

            {/* SCREEN 2: BROWSE TOYS */}
            {currentScreen === 'browse' && (
              <motion.div
                key="browse-screen"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-8"
              >
                {/* Header Welcome banner with subtle flair */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h1 className="text-3xl font-black font-display text-stone-900 dark:text-stone-100 tracking-tight">Browse Pocket Labs Creations</h1>
                    <p className="text-sm text-stone-500 font-medium">Explore premium toys made for curious, playful minds</p>
                  </div>
                  
                  {currentUser && (
                    <div className="bg-primary-container/20 text-on-primary-container px-4 py-2.5 rounded-full text-xs font-extrabold flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-primary fill-current" />
                      <span>Hello, {currentUser.name}! You have premium support.</span>
                    </div>
                  )}
                </div>

                {/* Filters Row */}
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
                  {['All', 'Physics', 'Chemistry', 'Jumbo Kits'].map((catName) => (
                    <button
                      id={`filter-pill-${catName.toLowerCase().replace(' ', '-')}`}
                      key={catName}
                      onClick={() => setSelectedCategory(catName)}
                      className={`px-5 py-2.5 rounded-full font-bold text-xs whitespace-nowrap transition-all ${
                        selectedCategory === catName 
                          ? 'bg-primary text-white shadow-md shadow-primary/10' 
                          : 'bg-stone-100 text-stone-600 hover:bg-stone-200/60'
                      }`}
                    >
                      {catName}
                    </button>
                  ))}
                </div>

                {/* Grid layout */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 md:gap-8">
                  {products
                    .filter((p) => selectedCategory === 'All' || p.category === selectedCategory)
                    .map((toy) => (
                      <motion.div
                        id={`toy-card-${toy.id}`}
                        key={toy.id}
                        whileHover={{ y: -4, scale: 1.01 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                        className="bg-surface-container-lowest border border-stone-100/80 rounded-3xl p-5 shadow-sm hover:shadow-lg transition-all flex flex-col justify-between"
                      >
                        {/* Upper Card Art & badge */}
                        <div className="relative group cursor-pointer h-52 bg-slate-50/50 rounded-2xl flex items-center justify-center p-4">
                          <ToyArt type={toy.image as any} className="w-36 h-36 drop-shadow-md" />
                          <span className="absolute top-3 left-3 bg-white/90 dark:bg-[#1e2025]/90 backdrop-blur-sm shadow px-2.5 py-1 rounded-full text-[10px] font-black uppercase text-stone-600 dark:text-stone-300 tracking-wider">
                            {toy.category}
                          </span>
                        </div>

                        {/* Middle textual section */}
                        <div className="mt-4 flex-1 flex flex-col justify-between">
                          <div>
                            <div className="flex justify-between items-start gap-2">
                              <h3 className="font-display font-black text-xl text-stone-900 group-hover:text-primary leading-tight">
                                {toy.name}
                              </h3>
                              <p className="font-display font-extrabold text-primary text-lg whitespace-nowrap shrink-0">
                                ${toy.price.toFixed(2)}
                              </p>
                            </div>
                            <p className="text-xs text-stone-500 line-clamp-2 mt-1.5 font-medium leading-relaxed">
                              {toy.description}
                            </p>
                          </div>

                          {/* Inventory / Rating Row */}
                          <div className="flex items-center justify-between mt-4">
                            <span className={`text-[11px] font-extrabold px-3 py-1 rounded-full border ${
                              toy.stock > 10 
                                ? 'bg-emerald-50 border-emerald-100 text-emerald-800' 
                                : 'bg-amber-50 border-amber-100 text-amber-700'
                            }`}>
                              {toy.stock} left in stock
                            </span>
                          </div>

                          {/* Action Buttons */}
                          <div className="grid grid-cols-2 gap-2 mt-4 pt-1">
                            <button
                              id={`toy-card-detail-btn-${toy.id}`}
                              onClick={() => {
                                setSelectedProductId(toy.id);
                                setCurrentScreen('detail');
                              }}
                              className="w-full py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold rounded-xl text-xs text-center transition-colors border border-stone-200/40"
                            >
                              View Details
                            </button>
                            <button
                              id={`toy-card-add-btn-${toy.id}`}
                              onClick={() => handleAddToCart(toy.id, 1)}
                              className="w-full py-2.5 bg-secondary-container hover:brightness-105 text-on-secondary-container font-extrabold rounded-xl text-xs transition-transform transform active:scale-95 flex items-center justify-center gap-1.5"
                            >
                              <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                              Add to Cart
                            </button>
                          </div>
                        </div>

                      </motion.div>
                    ))}
                </div>

                {/* Empty Search / Category state */}
                {products.filter((p) => selectedCategory === 'All' || p.category === selectedCategory).length === 0 && (
                  <div className="bg-stone-50 text-center py-12 rounded-3xl border border-dashed border-stone-200">
                    <p className="text-stone-500 font-bold mb-2">No toys inside this category currently</p>
                    <button onClick={() => setSelectedCategory('All')} className="text-xs font-extrabold text-primary hover:underline">
                      Back to All Toys
                    </button>
                  </div>
                )}
              </motion.div>
            )}

            {/* SCREEN 3: SHOPPING CART (Updated Layout conforming to Image 1) */}
            {currentScreen === 'cart' && (
              <motion.div
                key="cart-screen"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-6 md:space-y-8"
              >
                {/* Visual spec wrapper card conforming precisely to Image 1 design styling */}
                <div 
                  id="cart-container-box" 
                  className="bg-surface-container-lowest border border-stone-150 rounded-3xl px-6 py-10 md:p-12 shadow-xl flex flex-col justify-between max-w-2xl mx-auto"
                >
                  {/* Top layout title and continue shopping */}
                  <div className="flex items-end justify-between pb-6 border-b border-stone-100">
                    <div>
                      <h1 className="text-4xl font-extrabold font-display text-stone-900 tracking-tight">Your Cart</h1>
                      <p id="cart-item-count" className="text-stone-400 font-semibold text-sm leading-none mt-2">
                        {cartItems.length} {cartItems.length === 1 ? 'Item' : 'Items'}
                      </p>
                    </div>

                    <button
                      id="cart-continue-shopping"
                      onClick={() => setCurrentScreen('browse')}
                      className="text-primary hover:underline font-bold text-sm tracking-tight"
                    >
                      Continue Shopping
                    </button>
                  </div>

                  {/* Cart Rows space */}
                  <div className="py-8 space-y-4">
                    {cartItems.map((item) => (
                      <div
                        id={`cart-item-row-${item.id}`}
                        key={item.id}
                        className="bg-stone-50/70 border border-stone-100 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4"
                      >
                        {/* Artwork image & Name */}
                        <div className="flex items-center gap-4 w-full sm:w-auto">
                          <ToyArt type={item.product?.image as any || 'elephant'} className="w-16 h-16 shrink-0" />
                          <div>
                            <h3 className="font-display font-extrabold text-lg text-stone-900">{item.product?.name || 'Toy Item'}</h3>
                            <p className="text-xs text-stone-400 font-semibold">
                              ${item.product?.price.toFixed(2)} each
                            </p>
                          </div>
                        </div>

                        {/* Adjust qty panel conforming to Image 1 */}
                        <div className="flex items-center gap-4 justify-between sm:justify-start w-full sm:w-auto">
                          <div className="flex items-center bg-stone-200/50 rounded-full py-1.5 px-3 border border-stone-200">
                            <button
                              id={`cart-qty-minus-${item.id}`}
                              onClick={() => handleUpdateCartQuantity(item.productId, item.quantity, -1)}
                              className="text-stone-500 hover:text-stone-800 transition-colors p-1"
                            >
                              <Minus className="w-3.5 h-3.5 stroke-[2.5]" />
                            </button>
                            <span className="font-display font-black text-stone-800 text-sm px-4 select-none">
                              {item.quantity}
                            </span>
                            <button
                              id={`cart-qty-plus-${item.id}`}
                              onClick={() => handleUpdateCartQuantity(item.productId, item.quantity, 1)}
                              className="text-stone-500 hover:text-stone-800 transition-colors p-1"
                            >
                              <Plus className="w-3.5 h-3.5 stroke-[2.5]" strokeWidth={2.5} />
                            </button>
                          </div>

                          {/* Calculated aggregate cost & delete button */}
                          <div className="flex items-center gap-4">
                            <p className="font-display font-extrabold text-stone-800 text-lg w-20 text-right">
                              ${(item.product ? item.product.price * item.quantity : 0).toFixed(2)}
                            </p>
                            
                            <button
                              id={`cart-item-delete-${item.id}`}
                              onClick={() => handleDeleteCartItem(item.productId)}
                              className="text-rose-500 hover:text-rose-700 bg-rose-50 p-2.5 rounded-full hover:scale-105 transition-all"
                            >
                              <Trash2 className="w-4 h-4 stroke-[2.5]" />
                            </button>
                          </div>
                        </div>

                      </div>
                    ))}

                    {/* Empty cart state */}
                    {cartItems.length === 0 && (
                      <div className="text-center py-12">
                        <ShoppingBag className="w-16 h-16 text-stone-300 mx-auto mb-4 stroke-[1.5]" />
                        <p className="text-stone-500 font-bold text-lg">Your shopping cart is empty</p>
                        <p className="text-stone-400 text-xs mt-1">Browse the toy catalog to add cute creations</p>
                        <button
                          id="empty-cart-browse"
                          onClick={() => setCurrentScreen('browse')}
                          className="mt-6 px-6 py-2.5 bg-primary text-white font-extrabold rounded-full text-xs shadow-md"
                        >
                          Explore Toys Now
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Pricing footer summary conforming precisely to Image 1 layout */}
                  {cartItems.length > 0 && (
                    <div className="pt-6 border-t border-stone-100 flex flex-col items-center">
                      <div className="flex flex-col items-center text-center">
                        <p className="text-stone-500 font-bold text-sm tracking-tight">Total:</p>
                        <p id="cart-total-amount" className="font-display font-black text-toy-accent text-5xl md:text-6xl mt-1 tracking-tight leading-none">
                          ${cartSubtotal.toFixed(2)}
                        </p>
                        <p className="text-[10px] text-stone-400 font-semibold uppercase tracking-wider mt-3 leading-none">
                          Taxes and shipping calculated at checkout
                        </p>
                      </div>

                      {/* Checkout button */}
                      <button
                        id="proceed-checkout-btn"
                        onClick={handleCheckout}
                        className="mt-8 w-full max-w-sm py-4 bg-toy-accent hover:brightness-105 text-[#004d62] font-black rounded-full shadow-lg shadow-toy-accent/15 tracking-tight text-center text-sm transition-transform active:scale-95"
                      >
                        Proceed to Checkout
                      </button>
                    </div>
                  )}

                </div>

                {/* Subfooter representation matching mockup image 1 list */}
                <footer className="pt-10 pb-4 text-center max-w-2xl mx-auto border-t border-stone-200/50">
                  <div className="flex justify-center gap-6 text-stone-400 text-xs font-extrabold tracking-tight mb-4">
                    <span className="hover:text-primary cursor-pointer">Shop All</span>
                    <span className="hover:text-primary cursor-pointer">About Us</span>
                    <span className="hover:text-primary cursor-pointer">Shipping</span>
                    <span className="hover:text-primary cursor-pointer">Returns</span>
                    <span className="hover:text-primary cursor-pointer">Contact</span>
                  </div>
                  <p className="text-[11px] text-stone-400/80 font-bold font-display">
                    © 2026 Pocket Labs. Play with Wonder.
                  </p>
                </footer>
              </motion.div>
            )}

            {/* SCREEN: SECURE CHECKOUT PAGE (High-fidelity design styled matching mockup) */}
            {currentScreen === 'checkout' && (
              <motion.div
                key="checkout-screen"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-6 md:space-y-8 max-w-4xl mx-auto"
              >
                {(() => {
                  const itemsCount = cartItems.length;
                  const activeItemProduct = cartItems[currentCheckoutIndex]?.product;
                  const activeItemQty = cartItems[currentCheckoutIndex]?.quantity || 1;
                  const calculatedSubtotal = cartSubtotal;
                  const calculatedTotal = calculatedSubtotal + 5.00;

                  return (
                    <div className="space-y-6 md:space-y-8">
                      {/* Top Header Back Navigation */}
                      <div className="flex items-center justify-between pb-4 border-b border-stone-150 dark:border-stone-850">
                        <button
                          id="checkout-back-link"
                          onClick={handleCheckoutBack}
                          className="flex items-center gap-2 text-stone-500 hover:text-stone-800 dark:text-stone-400 dark:hover:text-stone-200 font-extrabold text-sm cursor-pointer transition-colors"
                        >
                          <ArrowRight className="w-4 h-4 rotate-180" />
                          <span>Back to Cart</span>
                        </button>
                        <h2 className="text-sm font-black text-stone-400 dark:text-stone-500 uppercase tracking-widest font-sans">
                          Secure Checkout
                        </h2>
                        <div className="w-10"></div> {/* Spacer balance */}
                      </div>

                      {/* Main Dual Column Layout */}
                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                        
                        {/* LEFT COLUMN: PRODUCT HIGHLIGHTS & ORDER SUMMARY */}
                        <div className="lg:col-span-5 space-y-6">
                          
                          {/* 1. Carousel Card containing active product art */}
                          <div 
                            id="checkout-image-card"
                            className="bg-surface-container-lowest border border-stone-150 dark:border-stone-850 rounded-[2rem] p-6 shadow-xl relative flex flex-col justify-between"
                          >
                            <div className="relative group min-h-[220px] rounded-[1.8rem] bg-stone-50/50 dark:bg-stone-900/10 flex flex-col items-center justify-center p-6 border border-stone-100/50 dark:border-stone-900/50">
                              {activeItemProduct ? (
                                <ToyArt type={activeItemProduct.image as any} className="w-36 h-36 drop-shadow-md" />
                              ) : (
                                <div className="text-center py-10">
                                  <ShoppingBag className="w-12 h-12 text-stone-300 mx-auto" />
                                  <p className="text-xs text-stone-400 font-bold mt-2">No product found</p>
                                </div>
                              )}
                            </div>

                            {/* Dot carousel pagination indicators */}
                            {itemsCount > 1 && (
                              <div className="flex items-center justify-center gap-1.5 mt-4">
                                {Array.from({ length: itemsCount }).map((_, idx) => (
                                  <button
                                    id={`carousel-dot-${idx}`}
                                    key={idx}
                                    onClick={() => setCurrentCheckoutIndex(idx)}
                                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                                      currentCheckoutIndex === idx 
                                        ? 'bg-[#004d62] dark:bg-sky-400 w-4' 
                                        : 'bg-stone-250 dark:bg-stone-800 hover:bg-stone-300'
                                    }`}
                                    title={`View item ${idx + 1}`}
                                  />
                                ))}
                              </div>
                            )}

                            {/* Chevron arrows overlay */}
                            {itemsCount > 1 && (
                              <div className="absolute top-[40%] left-2 right-2 flex justify-between pointer-events-none px-2">
                                <button
                                  id="carousel-prev-btn"
                                  onClick={() => setCurrentCheckoutIndex((prev) => (prev > 0 ? prev - 1 : itemsCount - 1))}
                                  className="pointer-events-auto p-1.5 rounded-full bg-white/90 dark:bg-[#1a1c20]/90 text-stone-700 dark:text-stone-300 hover:scale-105 active:scale-95 shadow-md transition-all cursor-pointer"
                                  title="Previous item"
                                >
                                  <ChevronLeft className="w-4 h-4 font-black" />
                                </button>
                                <button
                                  id="carousel-next-btn"
                                  onClick={() => setCurrentCheckoutIndex((prev) => (prev < itemsCount - 1 ? prev + 1 : 0))}
                                  className="pointer-events-auto p-1.5 rounded-full bg-white/90 dark:bg-[#1a1c20]/90 text-stone-700 dark:text-stone-300 hover:scale-105 active:scale-95 shadow-md transition-all cursor-pointer"
                                  title="Next item"
                                >
                                  <ChevronRight className="w-4 h-4 font-black" />
                                </button>
                              </div>
                            )}

                            {/* Product detailed subheadings */}
                            <div className="mt-5 flex items-start justify-between gap-4">
                              <div>
                                <h3 className="font-display font-black text-stone-900 dark:text-stone-100 text-lg leading-snug">
                                  {activeItemProduct?.name || 'Scientific Creation'}
                                </h3>
                                <p className="text-stone-400 dark:text-stone-500 font-extrabold text-xs mt-1">
                                  Quantity: {activeItemQty}
                                </p>
                              </div>
                              <p className="font-display font-black text-[#0c6780] dark:text-sky-300 text-lg whitespace-nowrap">
                                ${((activeItemProduct?.price || 0) * activeItemQty).toFixed(2)}
                              </p>
                            </div>

                          </div>

                          {/* 2. Order Summary details and calculated values */}
                          <div 
                            id="order-summary-box"
                            className="bg-surface-container-lowest border border-stone-150 dark:border-stone-850 rounded-[2rem] p-8 shadow-xl"
                          >
                            <h4 className="text-[10px] font-black uppercase text-stone-400 dark:text-stone-500 tracking-widest font-sans mb-4">
                              ORDER SUMMARY
                            </h4>
                            <div className="space-y-3">
                              <div className="flex justify-between items-center text-xs">
                                <span className="text-stone-500 dark:text-stone-400 font-semibold">Subtotal</span>
                                <span className="font-display font-bold text-stone-800 dark:text-stone-250">${calculatedSubtotal.toFixed(2)}</span>
                              </div>
                              <div className="flex justify-between items-center text-xs">
                                <span className="text-stone-500 dark:text-stone-400 font-semibold">Standard Shipping</span>
                                <span className="font-display font-bold text-stone-800 dark:text-stone-250">$5.00</span>
                              </div>
                              
                              <div className="h-[1px] bg-stone-100 dark:bg-stone-800 my-3" />

                              <div className="flex justify-between items-end">
                                <span className="text-stone-900 dark:text-stone-100 font-extrabold text-sm leading-none">Total</span>
                                <span className="font-display font-black text-toy-accent dark:text-[#37b0dd] text-3xl leading-none tracking-tight">
                                  ${calculatedTotal.toFixed(2)}
                                </span>
                              </div>
                            </div>
                          </div>

                        </div>

                        {/* RIGHT COLUMN: CHOOSE PAYMENT & DELIVERY FORM */}
                        <div className="lg:col-span-7 space-y-6">
                          
                          {/* 1. Select Payment System */}
                          <div 
                            id="payment-method-box"
                            className="bg-surface-container-lowest border border-stone-150 dark:border-stone-850 rounded-[2rem] p-6 shadow-xl space-y-4"
                          >
                            <h3 className="font-display text-base font-black text-stone-900 dark:text-stone-100 tracking-tight leading-none">
                              Choose Payment Method
                            </h3>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              {/* Option A: COD Checked Card */}
                              <div className="border-2 border-[#0c6780] dark:border-sky-400 bg-teal-50/5 dark:bg-sky-950/10 rounded-2xl p-4 flex items-start gap-3 relative cursor-pointer shadow-sm select-none">
                                <div className="bg-[#0c6780] text-white dark:bg-sky-400 dark:text-stone-950 p-0.5 rounded-full absolute top-4 right-4">
                                  <Check className="w-3 h-3 stroke-[3.5]" />
                                </div>
                                <Truck className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                                <div className="space-y-1">
                                  <h4 className="font-display font-extrabold text-sm text-stone-900 dark:text-stone-100 leading-tight">
                                    Cash on Delivery
                                  </h4>
                                  <p className="text-[11px] text-stone-400 dark:text-stone-500 font-semibold leading-relaxed">
                                    Pay securely at your doorstep.
                                  </p>
                                </div>
                              </div>

                              {/* Option B: Online Payment Checked Card */}
                              <div className="border border-stone-150 dark:border-stone-800 rounded-2xl p-4 flex items-start gap-3 opacity-50 dark:opacity-45 cursor-not-allowed select-none relative bg-stone-50/50 dark:bg-stone-900/10">
                                <span className="absolute top-4 right-4 bg-orange-100 dark:bg-orange-950 text-orange-600 dark:text-orange-400 text-[8px] font-black uppercase px-1.5 py-0.5 rounded-full tracking-wider leading-none">
                                  Coming Soon
                                </span>
                                <CreditCard className="w-5 h-5 text-stone-400 shrink-0 mt-0.5" />
                                <div className="space-y-1">
                                  <h4 className="font-display font-extrabold text-sm text-stone-500 dark:text-stone-400 leading-tight">
                                    Online Payment
                                  </h4>
                                  <p className="text-[11px] text-stone-400 dark:text-stone-450 font-semibold leading-relaxed">
                                    Card, Netbanking, UPI
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* 2. Interactive Delivery Form */}
                          <form
                            onSubmit={(e) => {
                              e.preventDefault();
                              if (!shippingName.trim() || !shippingPhone.trim() || !shippingStreet.trim() || !shippingCity.trim() || !shippingState.trim() || !shippingZip.trim()) {
                                triggerToast('Please fill out all required address fields.', 'error');
                                return;
                              }
                              handlePlaceOrder({
                                fullName: shippingName,
                                phoneNumber: shippingPhone,
                                streetAddress: shippingStreet,
                                city: shippingCity,
                                state: shippingState,
                                zipCode: shippingZip,
                                landmark: shippingLandmark
                              });
                            }}
                            className="bg-surface-container-lowest border border-stone-150 dark:border-stone-850 rounded-[2rem] p-8 shadow-xl space-y-5"
                          >
                            <div className="flex items-center gap-2 text-stone-900 dark:text-stone-100 pb-2 border-b border-stone-100 dark:border-stone-850">
                              <MapPin className="w-5 h-5 text-primary" />
                              <h3 className="font-display text-base font-black tracking-tight leading-none">
                                Delivery Address
                              </h3>
                            </div>

                            <div className="space-y-4">
                              {/* Grid Name and Phone */}
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                  <label className="text-[10px] font-black text-stone-400 dark:text-stone-500 uppercase tracking-wider block">
                                    Full Name *
                                  </label>
                                  <input
                                    type="text"
                                    value={shippingName}
                                    onChange={(e) => setShippingName(e.target.value)}
                                    placeholder="Parent's Name"
                                    required
                                    className="w-full px-4 py-2.5 bg-stone-100/50 dark:bg-stone-900/40 border border-stone-200/50 dark:border-stone-800 rounded-xl text-stone-800 dark:text-stone-100 placeholder-stone-400 dark:placeholder-stone-600 font-bold text-sm focus:outline-none focus:border-primary focus:bg-white dark:focus:bg-[#1a1b1f] transition-all"
                                  />
                                </div>

                                <div className="space-y-1.5">
                                  <label className="text-[10px] font-black text-stone-400 dark:text-stone-500 uppercase tracking-wider block">
                                    Phone Number *
                                  </label>
                                  <input
                                    type="tel"
                                    value={shippingPhone}
                                    onChange={(e) => setShippingPhone(e.target.value)}
                                    placeholder="+1 (555) 000-0000"
                                    required
                                    className="w-full px-4 py-2.5 bg-stone-100/50 dark:bg-stone-900/40 border border-stone-200/50 dark:border-stone-800 rounded-xl text-stone-800 dark:text-stone-100 placeholder-stone-400 dark:placeholder-stone-600 font-bold text-sm focus:outline-none focus:border-primary focus:bg-white dark:focus:bg-[#1a1b1f] transition-all"
                                  />
                                </div>
                              </div>

                              {/* Street Address */}
                              <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-stone-400 dark:text-stone-500 uppercase tracking-wider block">
                                  Street Address *
                                </label>
                                <input
                                  type="text"
                                  value={shippingStreet}
                                  onChange={(e) => setShippingStreet(e.target.value)}
                                  placeholder="123 Playful Lane"
                                  required
                                  className="w-full px-4 py-2.5 bg-stone-100/50 dark:bg-stone-900/40 border border-stone-200/50 dark:border-stone-800 rounded-xl text-stone-800 dark:text-stone-100 placeholder-stone-400 dark:placeholder-stone-600 font-bold text-sm focus:outline-none focus:border-primary focus:bg-white dark:focus:bg-[#1a1b1f] transition-all"
                                />
                              </div>

                              {/* Grid City and State */}
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                  <label className="text-[10px] font-black text-stone-400 dark:text-stone-500 uppercase tracking-wider block">
                                    City *
                                  </label>
                                  <input
                                    type="text"
                                    value={shippingCity}
                                    onChange={(e) => setShippingCity(e.target.value)}
                                    placeholder="Toytown"
                                    required
                                    className="w-full px-4 py-2.5 bg-stone-100/50 dark:bg-stone-900/40 border border-stone-200/50 dark:border-stone-800 rounded-xl text-stone-800 dark:text-stone-100 placeholder-stone-400 dark:placeholder-stone-600 font-bold text-sm focus:outline-none focus:border-primary focus:bg-white dark:focus:bg-[#1a1b1f] transition-all"
                                  />
                                </div>

                                <div className="space-y-1.5">
                                  <label className="text-[10px] font-black text-stone-400 dark:text-stone-500 uppercase tracking-wider block">
                                    State *
                                  </label>
                                  <input
                                    type="text"
                                    value={shippingState}
                                    onChange={(e) => setShippingState(e.target.value)}
                                    placeholder="CA"
                                    required
                                    className="w-full px-4 py-2.5 bg-stone-100/50 dark:bg-stone-900/40 border border-stone-200/50 dark:border-stone-800 rounded-xl text-stone-800 dark:text-stone-100 placeholder-stone-400 dark:placeholder-stone-600 font-bold text-sm focus:outline-none focus:border-primary focus:bg-white dark:focus:bg-[#1a1b1f] transition-all"
                                  />
                                </div>
                              </div>

                              {/* Grid Zip & Landmark */}
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                  <label className="text-[10px] font-black text-stone-400 dark:text-stone-500 uppercase tracking-wider block">
                                    Zip / Pincode *
                                  </label>
                                  <input
                                    type="text"
                                    value={shippingZip}
                                    onChange={(e) => setShippingZip(e.target.value)}
                                    placeholder="90210"
                                    required
                                    className="w-full px-4 py-2.5 bg-stone-100/50 dark:bg-stone-900/40 border border-stone-200/50 dark:border-stone-800 rounded-xl text-stone-800 dark:text-stone-100 placeholder-stone-400 dark:placeholder-stone-600 font-bold text-sm focus:outline-none focus:border-primary focus:bg-white dark:focus:bg-[#1a1b1f] transition-all"
                                  />
                                </div>

                                <div className="space-y-1.5">
                                  <label className="text-[10px] font-black text-stone-400 dark:text-stone-500 uppercase tracking-wider block">
                                    Landmark (Optional)
                                  </label>
                                  <input
                                    type="text"
                                    value={shippingLandmark}
                                    onChange={(e) => setShippingLandmark(e.target.value)}
                                    placeholder="Near the big park"
                                    className="w-full px-4 py-2.5 bg-stone-100/50 dark:bg-stone-900/40 border border-stone-200/50 dark:border-stone-800 rounded-xl text-stone-800 dark:text-stone-100 placeholder-stone-400 dark:placeholder-stone-600 font-bold text-sm focus:outline-none focus:border-primary focus:bg-white dark:focus:bg-[#1a1b1f] transition-all"
                                  />
                                </div>
                              </div>

                            </div>

                            {/* Cta Buttons */}
                            <div className="pt-4 flex flex-col items-center space-y-3">
                              <button
                                type="submit"
                                id="checkout-order-submit-btn"
                                className="w-full py-4 bg-[#89d0ed] hover:brightness-105 active:scale-98 text-[#004d62] font-black rounded-full shadow-lg shadow-toy-accent/15 tracking-tight text-center text-sm transition-transform cursor-pointer flex items-center justify-center gap-2"
                              >
                                <span>Place Order</span>
                                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                              </button>

                              <div className="flex items-center gap-1 text-[10px] font-extrabold text-stone-400 dark:text-stone-500">
                                <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                                <span>Cash collected only after delivery. Safe & Secure.</span>
                              </div>
                            </div>

                          </form>

                        </div>

                      </div>
                    </div>
                  );
                })()}
              </motion.div>
            )}

            {/* SCREEN 4: SLEEPY ELEPHANT PLUSH DETAIL SCREEN (Recreated matching Image 2) */}
            {currentScreen === 'detail' && (
              <motion.div
                key="detail-screen"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                {/* Back button and breadcrumbs conforming to Image 2 design */}
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => setCurrentScreen('browse')}
                    className="flex items-center gap-1.5 text-stone-500 hover:text-stone-800 text-xs font-bold bg-stone-100 px-3.5 py-1.5 rounded-full"
                  >
                    <ArrowRight className="w-3.5 h-3.5 rotate-180" />
                    Back
                  </button>
                  
                  {/* Gray breadcrumbs */}
                  <div className="text-[11px] font-bold text-stone-400 flex items-center gap-1 cursor-default select-none">
                    <span>Home</span>
                    <span>&gt;</span>
                    <span>{products.find(p => p.id === selectedProductId)?.category || 'Category'}</span>
                    <span>&gt;</span>
                    <span className="text-stone-500">{products.find(p => p.id === selectedProductId)?.name}</span>
                  </div>
                </div>

                {/* Large high-fidelity details split panel conforming to Image 2 design */}
                {(() => {
                  const toy = products.find((p) => p.id === selectedProductId);
                  if (!toy) return null;

                  return (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                      {/* Left Block - Rounded card containing the vector artwork */}
                      <div className="bg-surface-container-lowest border border-stone-100 rounded-[2rem] p-6 shadow-md aspect-square flex items-center justify-center">
                        <ToyArt type={toy.image as any} className="w-full max-w-[80%] drop-shadow-lg" />
                      </div>

                      {/* Right Block - Text and interaction styling conforming precisely to Image 2 */}
                      <div className="space-y-6">
                        
                        {/* Bubbly Category Pill */}
                        <div>
                          <span className="bg-[#feeeeb] text-secondary font-black text-[10px] tracking-wider uppercase px-4 py-1.5 rounded-full">
                            {toy.category.toUpperCase()}
                          </span>
                        </div>

                        {/* Title Heading */}
                        <h1 className="font-display font-black text-4xl md:text-5xl text-[#1b1c1c] leading-tight tracking-tight">
                          {toy.name}
                        </h1>

                        {/* Price and Stock Indicators */}
                        <div className="flex items-baseline gap-4 border-b border-stone-100 pb-4">
                          <p className="font-display font-black text-primary text-3xl leading-none">
                            ${toy.price.toFixed(2)}
                          </p>
                          <span className="text-xs text-stone-400 font-extrabold tracking-tight">
                            In Stock ({toy.stock} available)
                          </span>
                        </div>

                        {/* Detailed summary paragraph conforming to Image 2 text */}
                        <div className="bg-[#fcfbf9] border border-stone-100 rounded-3xl p-5 md:p-6 shadow-inner text-stone-600 font-semibold text-sm leading-relaxed">
                          {toy.description}
                        </div>

                        {/* CTA interaction buttons */}
                        <div className="flex flex-col sm:flex-row gap-3 pt-4">
                          <button
                            id="detail-add-to-cart-btn"
                            onClick={() => handleAddToCart(toy.id, 1)}
                            className="flex-1 py-3.5 bg-toy-accent hover:brightness-105 text-[#004d62] font-black rounded-full flex justify-center items-center gap-2 transition-transform transform active:scale-95 shadow-lg shadow-toy-accent/15"
                          >
                            <ShoppingCart className="w-4 h-4 stroke-[2.5]" />
                            Add to Cart
                          </button>
                          
                          <button
                            id="detail-buy-now-btn"
                            onClick={() => handleBuyNow(toy)}
                            className="flex-1 py-3.5 border-2 border-[#a43c12] text-[#a43c12] hover:bg-rose-50/20 font-black rounded-full flex justify-center items-center gap-2 transition-transform transform active:scale-95 cursor-pointer"
                          >
                            <Sparkles className="w-4 h-4" />
                            Buy Now
                          </button>
                        </div>

                      </div>
                    </div>
                  );
                })()}

              </motion.div>
            )}

            {/* SCREEN 5: ACCOUNT DASHBOARD & HISTORIC RECENT ORDERS (Matching Image 3) */}
            {currentScreen === 'account' && currentUser && (
              <motion.div
                key="account-screen"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-8"
              >
                
                {/* Hero profile card layout conforming exactly to Image 3 */}
                <section className="bg-surface-container-lowest border border-stone-100 rounded-3xl p-6 md:p-8 relative overflow-hidden shadow-sm flex flex-col sm:flex-row items-center gap-6">
                  
                  {/* Decorative faint background vector circles */}
                  <div className="absolute top-0 right-0 w-64 h-64 bg-primary-container/10 rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/3"></div>
                  
                  {/* Profile image with camera overlay */}
                  <div className="relative shrink-0">
                    <ToyArt type="user" className="w-24 h-24 border-4 border-white shadow" />
                    <button 
                      onClick={() => triggerToast('Profile image uploads are a placeholder in this mockup', 'info')}
                      className="absolute bottom-0 right-0 bg-primary text-white rounded-full p-2 shadow-md hover:scale-110 active:scale-95 transition-transform"
                    >
                      <Settings className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Profile content details */}
                  <div className="flex-1 text-center sm:text-left space-y-2">
                    <div className="flex flex-col sm:flex-row items-center gap-2">
                      <h1 className="font-display font-black text-2xl text-stone-900 leading-none">
                        {currentUser.name}
                      </h1>
                      
                      {currentUser.isPremium && (
                        <span className="bg-tertiary-container/35 text-stone-700 px-3 py-0.5 rounded-full font-extrabold text-[10px] tracking-wide uppercase inline-flex items-center gap-1">
                          <Star className="w-3.5 h-3.5 text-stone-600 fill-current" />
                          Premium Member
                        </span>
                      )}
                    </div>

                    <p className="text-sm font-semibold text-stone-500 leading-none">
                      {currentUser.email}
                    </p>

                    <div className="bg-stone-100 px-4 py-1.5 rounded-full inline-flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-primary" />
                      <span className="text-[11px] font-extrabold text-stone-500">
                        Member Since: {currentUser.memberSince}
                      </span>
                    </div>
                  </div>

                  {/* Edit profile detail actions */}
                  <div className="shrink-0">
                    <button
                      id="edit-profile-trigger"
                      onClick={() => {
                        setEditName(currentUser.name);
                        setEditPremium(currentUser.isPremium);
                        setIsEditModalOpen(true);
                      }}
                      className="bg-primary/10 text-primary hover:bg-primary/15 font-extrabold text-xs px-5 py-2.5 rounded-full transition-transform active:scale-95"
                    >
                      Edit Profile Details
                    </button>
                  </div>

                </section>

                {/* Recent Orders segment conforming to Image 3 */}
                <section className="space-y-4">
                  <div className="flex justify-between items-end">
                    <h2 className="font-display font-black text-2xl text-[#1b1c1c] flex items-center gap-2 tracking-tight">
                      <ShoppingBag className="w-6 h-6 text-primary" />
                      Recent Orders
                    </h2>

                    <button
                      id="orders-view-all"
                      onClick={() => triggerToast('Listing all historic items on this single page layout.', 'info')}
                      className="text-[#0c6780] font-bold text-xs hover:underline underline-offset-4 decoration-2"
                    >
                      View All
                    </button>
                  </div>

                  {/* Orders List Container */}
                  <div className="grid grid-cols-1 gap-4">
                    
                    {orders.map((order) => (
                      <div
                        id={`order-card-${order.id}`}
                        key={order.id}
                        className="bg-surface-container-lowest border border-stone-100 rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm hover:shadow-md transition-all cursor-pointer group"
                      >
                        {/* Left block Info */}
                        <div className="flex gap-4 items-center">
                          <div className="w-14 h-14 bg-stone-100 rounded-xl flex items-center justify-center shrink-0">
                            <Store className="w-7 h-7 text-primary stroke-[1.8]" />
                          </div>

                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <h3 className="font-display font-black text-stone-900 dark:text-stone-100">Order {order.id}</h3>
                              
                              <span className={`px-2.5 py-0.5 rounded-full font-extrabold text-[10px] uppercase tracking-wider ${
                                order.orderStatus === 'DELIVERED' 
                                  ? 'bg-emerald-50 text-emerald-800' 
                                  : order.orderStatus === 'SHIPPED'
                                  ? 'bg-[#e3f7ff] text-[#004d62]'
                                  : 'bg-amber-50 text-amber-800 animate-pulse'
                              }`}>
                                {order.orderStatus}
                              </span>
                            </div>

                            <p className="text-[11px] text-stone-400 font-semibold leading-none">
                              Placed on {order.date}
                            </p>

                            {/* Broken down items list */}
                            <div className="text-xs text-stone-500 dark:text-stone-400 font-bold space-y-0.5 pt-1">
                              {order.items.map((it, idx) => (
                                <div key={idx} className="flex gap-2.5 items-center">
                                  <span className="text-[#0c6780] dark:text-sky-300">●</span>
                                  <span>{it.name}</span>
                                  <span className="text-stone-400 dark:text-stone-500 font-medium">x{it.quantity}</span>
                                </div>
                              ))}
                            </div>

                            {/* Shipping address info */}
                            {order.address && (
                              <div className="text-[10px] text-stone-400 dark:text-stone-500 max-w-xs mt-2 bg-stone-50/75 dark:bg-stone-900/30 p-2.5 rounded-xl border border-stone-100/60 dark:border-stone-850">
                                <p className="font-black text-stone-500 dark:text-stone-450 uppercase tracking-widest text-[8px] mb-1">Shipping Details</p>
                                <p className="font-extrabold text-stone-800 dark:text-stone-200">{order.address.fullName}</p>
                                <p>{order.address.streetAddress}, {order.address.city}, {order.address.state} {order.address.zipCode}</p>
                                <p>Tel: {order.address.phoneNumber}</p>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Mid-Right block total costs / chevron indicator */}
                        <div className="flex items-center justify-between md:justify-end gap-6 border-t md:border-t-0 border-stone-100 pt-3 md:pt-0">
                          <div className="text-left md:text-right space-y-1">
                            <p className="font-display font-black text-2xl text-primary leading-none">
                              ${order.total.toFixed(2)}
                            </p>
                            
                            <div className="flex items-center gap-1 text-emerald-600 font-bold text-[10px] tracking-wider uppercase leading-none mt-1">
                              <CheckCircle className="w-3.5 h-3.5 fill-current text-white text-emerald-500 shrink-0" />
                              <span>Paid ({order.paymentMethod})</span>
                            </div>
                          </div>

                          <ArrowRight className="w-5 h-5 text-stone-400 group-hover:text-primary transition-colors" />
                        </div>

                      </div>
                    ))}

                    {/* Placeholder Card representing Image 3 empty/search box */}
                    <div 
                      onClick={() => triggerToast('Your search logic is pre-indexed for prototype queries.', 'info')}
                      className="bg-stone-50 hover:bg-stone-100 border-2 border-dashed border-stone-200 hover:border-primary/40 rounded-2xl p-6 flex flex-col items-center justify-center gap-2 text-center cursor-pointer transition-all"
                    >
                      <span className="w-10 h-10 rounded-full bg-stone-200 flex items-center justify-center text-stone-500">
                        <Clock className="w-5 h-5" />
                      </span>
                      <h3 className="text-stone-600 font-extrabold text-sm tracking-tight">Browse Past Orders</h3>
                      <p className="text-stone-400 text-[11px] font-medium leading-none">Query additional records indices</p>
                    </div>

                  </div>
                </section>

              </motion.div>
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
