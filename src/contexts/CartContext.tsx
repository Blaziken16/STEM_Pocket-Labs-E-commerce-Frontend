import React, { createContext, useContext, useState, ReactNode } from 'react';
import { CartItem, Product } from '../types';
import * as cartApi from '../api/cart';

interface CartContextType {
  cartItems: CartItem[];
  setCartItems: (items: CartItem[]) => void;
  addToCart: (productId: string, quantity?: number) => Promise<void>;
  updateQuantity: (productId: string, currentQty: number, offset: number) => Promise<void>;
  removeCartItem: (itemId: string) => Promise<void>;
  cartSubtotal: number;
  cartTotalItems: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const cartSubtotal = cartItems.reduce((acc, item) => {
    return acc + (item.product ? item.product.price * item.quantity : 0);
  }, 0);

  const cartTotalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const addToCart = async (productId: string, quantity = 1) => {
    const updatedCart = await cartApi.addToCart(productId, quantity);
    setCartItems(updatedCart);
  };

  const updateQuantity = async (productId: string, currentQty: number, offset: number) => {
    const targetQty = currentQty + offset;
    if (targetQty <= 0) {
      await removeCartItem(productId);
      return;
    }
    const updatedCart = await cartApi.addToCart(productId, targetQty);
    setCartItems(updatedCart);
  };

  const removeCartItem = async (productId: string) => {
    const updatedCart = await cartApi.removeCartItem(productId);
    setCartItems(updatedCart);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        setCartItems,
        addToCart,
        updateQuantity,
        removeCartItem,
        cartSubtotal,
        cartTotalItems,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
};
