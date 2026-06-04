import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Order } from '../types';

type ScreenType = 'welcome' | 'browse' | 'cart' | 'detail' | 'account' | 'checkout' | 'order-success' | 'admin';

interface NavigationContextType {
  currentScreen: ScreenType;
  setCurrentScreen: (screen: ScreenType) => void;
  selectedProductId: string;
  setSelectedProductId: (id: string) => void;
  checkoutSource: 'cart' | 'buynow';
  setCheckoutSource: (source: 'cart' | 'buynow') => void;
  checkoutProduct: any | null;
  setCheckoutProduct: (product: any | null) => void;
  checkoutQuantity: number;
  setCheckoutQuantity: (qty: number) => void;
  placedOrder: Order | null;
  setPlacedOrder: (order: Order | null) => void;
  placedOrderAddress: any | null;
  setPlacedOrderAddress: (address: any | null) => void;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export const NavigationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('welcome');
  const [selectedProductId, setSelectedProductId] = useState<string>('sleepy-elephant-plush');
  const [checkoutSource, setCheckoutSource] = useState<'cart' | 'buynow'>('cart');
  const [checkoutProduct, setCheckoutProduct] = useState<any | null>(null);
  const [checkoutQuantity, setCheckoutQuantity] = useState<number>(1);
  const [placedOrder, setPlacedOrder] = useState<Order | null>(null);
  const [placedOrderAddress, setPlacedOrderAddress] = useState<any | null>(null);

  return (
    <NavigationContext.Provider
      value={{
        currentScreen,
        setCurrentScreen,
        selectedProductId,
        setSelectedProductId,
        checkoutSource,
        setCheckoutSource,
        checkoutProduct,
        setCheckoutProduct,
        checkoutQuantity,
        setCheckoutQuantity,
        placedOrder,
        setPlacedOrder,
        placedOrderAddress,
        setPlacedOrderAddress,
      }}
    >
      {children}
    </NavigationContext.Provider>
  );
};

export const useNavigation = () => {
  const context = useContext(NavigationContext);
  if (!context) throw new Error('useNavigation must be used within a NavigationProvider');
  return context;
};
