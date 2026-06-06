import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Store, History, ShoppingCart, Sparkles, LogOut, X, Star, Settings } from 'lucide-react';
import { ToyArt } from '../ToyArt';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigation } from '../../contexts/NavigationContext';
import { useCart } from '../../contexts/CartContext';
import { useNotification } from '../../contexts/NotificationContext';

export const Sidebar: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const { currentUser, logout } = useAuth();
  const { currentScreen, setCurrentScreen } = useNavigation();
  const { cartTotalItems } = useCart();
  const { triggerToast } = useNotification();

  if (!currentUser) return null;

  const handleLogout = () => {
    logout();
    setCurrentScreen('welcome');
    onClose();
    triggerToast('Logged out of Pocket Labs.', 'info');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm"
          />

          <motion.nav 
            initial={{ x: '-100%', opacity: 1 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '-100%', opacity: 1 }}
            transition={{ type: 'spring', damping: 25, stiffness: 220 }}
            className="fixed left-0 top-0 h-full w-[85%] max-w-[320px] z-[110] bg-white dark:!bg-[#000000] shadow-2xl flex flex-col py-6 border-r border-stone-100 dark:border-stone-900"
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
                onClick={onClose}
                className="p-1.5 rounded-full hover:bg-stone-100 dark:hover:bg-stone-800 dark:text-stone-300 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5 text-stone-500 dark:text-stone-300" />
              </button>
            </div>

            <div className="flex-1 py-4 px-3 flex flex-col gap-1 overflow-y-auto">
              <button
                onClick={() => { setCurrentScreen('browse'); onClose(); }}
                className={`flex items-center gap-4 px-4 py-3 rounded-full font-bold text-sm text-left transition-all cursor-pointer ${
                  currentScreen === 'browse' || currentScreen === 'detail'
                    ? 'bg-primary/20 text-primary dark:text-sky-300 font-extrabold' 
                    : 'text-stone-700 dark:text-stone-100 hover:text-stone-950 dark:hover:text-white hover:bg-stone-100/50 dark:hover:bg-stone-800'
                }`}
              >
                <Store className="w-5 h-5" /> Browse Creations
              </button>

              <button
                onClick={() => { setCurrentScreen('account'); onClose(); }}
                className={`flex items-center gap-4 px-4 py-3 rounded-full font-bold text-sm text-left transition-all cursor-pointer ${
                  currentScreen === 'account' 
                    ? 'bg-primary/20 text-primary dark:text-sky-300 font-extrabold' 
                    : 'text-stone-700 dark:text-stone-100 hover:text-stone-950 dark:hover:text-white hover:bg-stone-100/50 dark:hover:bg-stone-800'
                }`}
              >
                <History className="w-5 h-5" /> Order History & Profile
              </button>

              <button
                onClick={() => { setCurrentScreen('cart'); onClose(); }}
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

              {currentUser.role === 'admin' && (
                <button
                  onClick={() => { setCurrentScreen('admin'); onClose(); }}
                  className={`flex items-center gap-4 px-4 py-3 rounded-full font-bold text-sm text-left transition-all cursor-pointer ${
                    currentScreen === 'admin'
                      ? 'bg-primary/20 text-primary dark:text-sky-300 font-extrabold'
                      : 'text-stone-700 dark:text-stone-100 hover:text-stone-950 dark:hover:text-white hover:bg-stone-100/50 dark:hover:bg-stone-800'
                  }`}
                >
                  <Settings className="w-5 h-5" /> Admin Dashboard
                </button>
              )}

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
                  onClick={handleLogout}
                  className="flex items-center gap-4 px-4 py-3 rounded-full font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/20 w-full text-left transition-colors cursor-pointer"
                >
                  <LogOut className="w-5 h-5" /> Sign Out
                </button>
              </div>
            </div>

            <div className="px-4 pt-4 border-t border-stone-150 dark:border-stone-900 mt-auto">
              <button
                onClick={() => { setCurrentScreen('browse'); onClose(); }}
                className="w-full bg-primary text-white font-bold py-3 px-4 rounded-full shadow-md text-sm text-center flex items-center justify-center gap-2 cursor-pointer hover:brightness-110 active:scale-95 transition-all"
              >
                <Store className="w-4 h-4" /> Go to Science Shop
              </button>
            </div>
          </motion.nav>
        </>
      )}
    </AnimatePresence>
  );
};

// Also adding a Mobile Bottom Bar layout component here to keep layouts together
import { User as UserIcon, Settings as SettingsIcon } from 'lucide-react';
export const MobileBottomBar: React.FC = () => {
  const { currentUser } = useAuth();
  const { currentScreen, setCurrentScreen } = useNavigation();
  const { cartTotalItems } = useCart();
  const { triggerToast } = useNotification();

  if (!currentUser) return null;

  return (
    <nav 
      id="mobile-bottombar"
      className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-2 py-3 bg-white border-t border-stone-150 shadow-[0px_-4px_10px_rgba(0,0,0,0.03)] rounded-t-2xl md:hidden"
    >
      <button
        onClick={() => setCurrentScreen('browse')}
        className={`flex flex-col items-center justify-center gap-0.5 px-4 py-1 transition-transform active:scale-90 ${
          currentScreen === 'browse' || currentScreen === 'detail' ? 'text-primary scale-102' : 'text-stone-400'
        }`}
      >
        <Store className="w-[22px] h-[22px] stroke-[2.2]" />
        <span className="text-[10px] font-black tracking-tight leading-none">Shop</span>
      </button>

      <button
        onClick={() => setCurrentScreen('account')}
        className={`flex flex-col items-center justify-center gap-0.5 px-4 py-1 transition-transform active:scale-90 ${
          currentScreen === 'account' ? 'text-primary scale-102' : 'text-stone-400'
        }`}
      >
        <History className="w-[22px] h-[22px] stroke-[2.2]" />
        <span className="text-[10px] font-black tracking-tight leading-none font-sans">Orders</span>
      </button>

      {currentUser.role === 'admin' && (
        <button
          onClick={() => setCurrentScreen('admin')}
          className={`flex flex-col items-center justify-center gap-0.5 px-4 py-1 transition-transform active:scale-90 ${
            currentScreen === 'admin' ? 'text-primary scale-102' : 'text-stone-400'
          }`}
        >
          <SettingsIcon className="w-[22px] h-[22px] stroke-[2.2]" />
          <span className="text-[10px] font-black tracking-tight leading-none">Admin</span>
        </button>
      )}

      <button
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
        onClick={() => {
          setCurrentScreen('account');
          triggerToast('Active profile panel loaded.', 'info');
        }}
        className="flex flex-col items-center justify-center gap-0.5 px-4 py-1 text-stone-400 hover:text-primary transition-transform active:scale-90"
      >
        <UserIcon className="w-[22px] h-[22px] stroke-[2.2]" />
        <span className="text-[10px] font-black tracking-tight leading-none">Account</span>
      </button>
    </nav>
  );
};
