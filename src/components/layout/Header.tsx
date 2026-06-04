import React, { useEffect, useState } from 'react';
import { Menu, ShoppingCart, Star, Sun, Moon } from 'lucide-react';
import { ToyArt } from '../ToyArt';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';
import { useNavigation } from '../../contexts/NavigationContext';
import { useNotification } from '../../contexts/NotificationContext';

export const Header: React.FC<{ onOpenSidebar: () => void }> = ({ onOpenSidebar }) => {
  const { currentUser } = useAuth();
  const { cartTotalItems } = useCart();
  const { setCurrentScreen } = useNavigation();
  const { triggerToast } = useNotification();

  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('toybox_theme');
    if (saved) return saved === 'dark';
    return document.documentElement.classList.contains('dark') || 
           (typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('toybox_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('toybox_theme', 'light');
    }
  }, [isDarkMode]);

  if (!currentUser) return null;

  return (
    <header 
      id="global-topappbar"
      className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-4 md:px-8 bg-surface-container-lowest/80 backdrop-blur-md h-20 border-b border-stone-150/60 shadow-sm"
    >
      <div className="flex items-center gap-3 md:gap-5">
        <button 
          id="menu-hamburger-btn"
          onClick={onOpenSidebar}
          className="text-primary hover:scale-105 transition-transform active:scale-95 p-2 rounded-full hover:bg-stone-50 focus:outline-none cursor-pointer"
          title="Open Navigation Menu"
        >
          <Menu className="w-6 h-6 stroke-[2.5]" />
        </button>
        
        <div className="font-display text-2xl md:text-3xl font-extrabold text-primary tracking-tight flex items-center gap-1.5 cursor-pointer selection:bg-transparent" onClick={() => setCurrentScreen('browse')}>
          Pocket Labs
          <span className="w-2.5 h-2.5 rounded-full bg-secondary-container animate-pulse"></span>
        </div>
      </div>

      <div className="flex items-center gap-2 md:gap-4">
        <button
          id="theme-toggle-btn"
          onClick={() => {
            setIsDarkMode(prev => !prev);
            triggerToast(!isDarkMode ? "Enabled slate dark theme!" : "Enabled light theme!", "info");
          }}
          className="text-primary hover:scale-105 transition-transform active:scale-95 p-2 rounded-full hover:bg-stone-50 dark:hover:bg-stone-800 focus:outline-none cursor-pointer flex items-center justify-center"
          title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          {isDarkMode ? <Sun className="w-6 h-6 stroke-[2.5]" /> : <Moon className="w-6 h-6 stroke-[2.5]" />}
        </button>

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
  );
};
