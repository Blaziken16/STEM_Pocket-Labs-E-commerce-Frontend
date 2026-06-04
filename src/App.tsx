import React, { useState } from 'react';
import { AnimatePresence } from 'motion/react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { NavigationProvider, useNavigation } from './contexts/NavigationContext';
import { CartProvider } from './contexts/CartContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { Header } from './components/layout/Header';
import { Sidebar, MobileBottomBar } from './components/layout/Sidebar';
import { WelcomeScreen } from './screens/WelcomeScreen';
import { BrowseScreen } from './screens/BrowseScreen';
import { DetailScreen } from './screens/DetailScreen';
import { CartScreen } from './screens/CartScreen';
import { CheckoutScreen } from './screens/CheckoutScreen';
import { AccountScreen } from './screens/AccountScreen';
import { OrderSuccessScreen } from './screens/OrderSuccessScreen';
import { AdminScreen } from './screens/AdminScreen';

const MainLayout: React.FC = () => {
  const { currentUser } = useAuth();
  const { currentScreen } = useNavigation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background font-sans text-stone-800 flex flex-col md:flex-row antialiased relative selection:bg-primary-container selection:text-on-primary-container">
      <Header onOpenSidebar={() => setIsSidebarOpen(true)} />
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      
      <main className={`flex-1 min-h-screen ${currentUser ? 'pt-24' : ''} bg-background font-sans overflow-y-auto`}>
        <div className="max-w-5xl mx-auto px-4 md:px-8 py-6 md:py-10 pb-20">
          <AnimatePresence mode="wait">
            {currentScreen === 'welcome' && <WelcomeScreen key="welcome" />}
            {currentScreen === 'browse' && <BrowseScreen key="browse" />}
            {currentScreen === 'cart' && <CartScreen key="cart" />}
            {currentScreen === 'detail' && <DetailScreen key="detail" />}
            {currentScreen === 'checkout' && <CheckoutScreen key="checkout" />}
            {currentScreen === 'account' && <AccountScreen key="account" />}
            {currentScreen === 'order-success' && <OrderSuccessScreen key="order-success" />}
            {currentScreen === 'admin' && <AdminScreen key="admin" />}
          </AnimatePresence>
        </div>
      </main>

      <MobileBottomBar />
    </div>
  );
};

export default function App() {
  return (
    <NotificationProvider>
      <AuthProvider>
        <NavigationProvider>
          <CartProvider>
            <MainLayout />
          </CartProvider>
        </NavigationProvider>
      </AuthProvider>
    </NotificationProvider>
  );
}
