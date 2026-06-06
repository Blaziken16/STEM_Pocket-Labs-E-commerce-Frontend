import React from 'react';
import { motion } from 'motion/react';
import { Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react';
import { ToyArt } from '../components/ToyArt';
import { useNavigation } from '../contexts/NavigationContext';
import { useCart } from '../contexts/CartContext';
import { useNotification } from '../contexts/NotificationContext';

export const CartScreen: React.FC = () => {
  const { setCurrentScreen, setCheckoutSource } = useNavigation();
  const { cartItems, updateQuantity, removeCartItem, cartSubtotal } = useCart();
  const { triggerToast } = useNotification();

  const handleUpdateCartQuantity = async (productId: string, currentQty: number, offset: number) => {
    try {
      await updateQuantity(productId, currentQty, offset);
    } catch (err: any) {
      triggerToast(err.message || 'Error updating quantity', 'error');
    }
  };

  const handleDeleteCartItem = async (productId: string) => {
    try {
      await removeCartItem(productId);
      triggerToast('Item removed from cart.', 'info');
    } catch (err: any) {
      triggerToast(err.message || 'Error removing item', 'error');
    }
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      triggerToast('Your cart is empty', 'error');
      return;
    }
    setCheckoutSource('cart');
    setCurrentScreen('checkout');
  };

  return (
    <motion.div
      key="cart-screen"
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-6 md:space-y-8"
    >
      <div 
        id="cart-container-box" 
        className="bg-surface-container-lowest border border-stone-150 rounded-3xl px-6 py-10 md:p-12 shadow-xl flex flex-col justify-between max-w-2xl mx-auto"
      >
        <div className="flex items-end justify-between pb-6 border-b border-stone-100">
          <div>
            <h1 className="text-4xl font-extrabold font-display text-stone-900 tracking-tight">Your Cart</h1>
            <p id="cart-item-count" className="text-stone-400 font-semibold text-sm leading-none mt-2">
              {cartItems.length} {cartItems.length === 1 ? 'Item' : 'Items'}
            </p>
          </div>

          <button
            onClick={() => setCurrentScreen('browse')}
            className="text-primary hover:underline font-bold text-sm tracking-tight"
          >
            Continue Shopping
          </button>
        </div>

        <div className="py-8 space-y-4">
          {cartItems.map((item) => (
            <div
              key={item.id}
              className="bg-stone-50/70 border border-stone-100 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4"
            >
              <div className="flex items-center gap-4 w-full sm:w-auto">
                <ToyArt type={item.product?.image as any || 'elephant'} className="w-16 h-16 shrink-0" />
                <div>
                  <h3 className="font-display font-extrabold text-lg text-stone-900">{item.product?.name || 'Toy Item'}</h3>
                  <p className="text-xs text-stone-400 font-semibold">
                    ₹{item.product?.price.toFixed(2)} each
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 justify-between sm:justify-start w-full sm:w-auto">
                <div className="flex items-center bg-stone-200/50 rounded-full py-1.5 px-3 border border-stone-200">
                  <button
                    onClick={() => handleUpdateCartQuantity(item.productId, item.quantity, -1)}
                    className="text-stone-500 hover:text-stone-800 transition-colors p-1"
                  >
                    <Minus className="w-3.5 h-3.5 stroke-[2.5]" />
                  </button>
                  <span className="font-display font-black text-stone-800 text-sm px-4 select-none">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => handleUpdateCartQuantity(item.productId, item.quantity, 1)}
                    className="text-stone-500 hover:text-stone-800 transition-colors p-1"
                  >
                    <Plus className="w-3.5 h-3.5 stroke-[2.5]" strokeWidth={2.5} />
                  </button>
                </div>

                <div className="flex items-center gap-4">
                  <p className="font-display font-extrabold text-stone-800 text-lg w-20 text-right">
                    ₹{(item.product ? item.product.price * item.quantity : 0).toFixed(2)}
                  </p>
                  
                  <button
                    onClick={() => handleDeleteCartItem(item.productId)}
                    className="text-rose-500 hover:text-rose-700 bg-rose-50 p-2.5 rounded-full hover:scale-105 transition-all"
                  >
                    <Trash2 className="w-4 h-4 stroke-[2.5]" />
                  </button>
                </div>
              </div>

            </div>
          ))}

          {cartItems.length === 0 && (
            <div className="text-center py-12">
              <ShoppingBag className="w-16 h-16 text-stone-300 mx-auto mb-4 stroke-[1.5]" />
              <p className="text-stone-500 font-bold text-lg">Your shopping cart is empty</p>
              <p className="text-stone-400 text-xs mt-1">Browse the toy catalog to add cute creations</p>
              <button
                onClick={() => setCurrentScreen('browse')}
                className="mt-6 px-6 py-2.5 bg-primary text-white font-extrabold rounded-full text-xs shadow-md"
              >
                Explore Toys Now
              </button>
            </div>
          )}
        </div>

        {cartItems.length > 0 && (
          <div className="pt-6 border-t border-stone-100 flex flex-col items-center">
            <div className="flex flex-col items-center text-center">
              <p className="text-stone-500 font-bold text-sm tracking-tight">Total:</p>
              <p className="font-display font-black text-toy-accent text-5xl md:text-6xl mt-1 tracking-tight leading-none">
                ₹{cartSubtotal.toFixed(2)}
              </p>
              <p className="text-[10px] text-stone-400 font-semibold uppercase tracking-wider mt-3 leading-none">
                Taxes and shipping calculated at checkout
              </p>
            </div>

            <button
              onClick={handleCheckout}
              className="mt-8 w-full max-w-sm py-4 bg-toy-accent hover:brightness-105 text-[#004d62] font-black rounded-full shadow-lg shadow-toy-accent/15 tracking-tight text-center text-sm transition-transform active:scale-95"
            >
              Proceed to Checkout
            </button>
          </div>
        )}

      </div>

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
  );
};
