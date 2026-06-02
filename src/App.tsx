import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from "./utils/constants";
import { Headers, apiFetch } from "./Services/ApiClient";
import { getCart, addToCart, deleteCartItem } from "./Services/cartService";
import { getMyOrders, placeOrder } from "./Services/orderService";
import { useAuth } from "./context/AuthContext";
import { useShopData } from "./hooks/useShopData";
import { useProducts } from "./hooks/useProducts";
import EditProfileModal from "./components/modals/EditProfileModal";
import AppHeader from "./components/layout/AppHeader";
import SidebarDrawer from "./components/layout/SidebarDrawer";
import Toast from "./components/ui/Toast";
import ScreenRouter from "./components/navigation/ScreenRouter";
import MobileBottomBar from "./components/layout/MobileBottomBar";
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
      if (!userData) return;

      setCurrentUser(userData);
      setEditName(userData.name);
      setEditPremium(!!userData.isPremium);
      setShippingName(userData.name);
      setCurrentScreen((prev) => (prev === "welcome" ? "browse" : prev));
    } catch (err) {
      console.error("Error fetching current user:", err);
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

      <Toast notification={notification} />

      {currentUser && (
        <AppHeader
          currentUser={currentUser}
          cartTotalItems={cartTotalItems}
          isDarkMode={isDarkMode}
          setIsDarkMode={setIsDarkMode}
          setIsSidebarOpen={setIsSidebarOpen}
          setCurrentScreen={setCurrentScreen}
          triggerToast={triggerToast}
        />
      )}
      <SidebarDrawer
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
        currentUser={currentUser}
        currentScreen={currentScreen}
        cartTotalItems={cartTotalItems}
        setCurrentScreen={setCurrentScreen}
        handleLogout={handleLogout}
      />

      {/* --- MAIN PANEL SCROLL CONTAINER --- */}
      <main className={`flex-1 min-h-screen ${currentUser ? 'pt-24' : ''} bg-background font-sans overflow-y-auto`}>
        <div className="max-w-5xl mx-auto px-4 md:px-8 py-6 md:py-10 pb-20">
          
          <ScreenRouter
            currentScreen={currentScreen}
            currentUser={currentUser}
            products={products}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            selectedProductId={selectedProductId}
            setSelectedProductId={setSelectedProductId}
            cartItems={cartItems}
            cartSubtotal={cartSubtotal}
            cartTotalItems={cartTotalItems}
            orders={orders}
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
            isRegistering={isRegistering}
            setIsRegistering={setIsRegistering}
            authEmail={authEmail}
            setAuthEmail={setAuthEmail}
            authPassword={authPassword}
            setAuthPassword={setAuthPassword}
            authName={authName}
            setAuthName={setAuthName}
            authError={authError}
            authLoading={authLoading}
            setCurrentScreen={setCurrentScreen}
            setEditName={setEditName}
            setEditPremium={setEditPremium}
            setIsEditModalOpen={setIsEditModalOpen}
            triggerToast={triggerToast}
            handleAuthSubmit={handleAuthSubmit}
            handleQuickTester={handleQuickTester}
            handleAddToCart={handleAddToCart}
            handleUpdateCartQuantity={handleUpdateCartQuantity}
            handleDeleteCartItem={handleDeleteCartItem}
            handleCheckout={handleCheckout}
            handleBuyNow={handleBuyNow}
            handlePlaceOrder={handlePlaceOrder}
            handleCheckoutBack={handleCheckoutBack}
          />

        </div>
      </main>

      <MobileBottomBar
        currentUser={currentUser}
        currentScreen={currentScreen}
        cartTotalItems={cartTotalItems}
        setCurrentScreen={setCurrentScreen}
        triggerToast={triggerToast}
      />
