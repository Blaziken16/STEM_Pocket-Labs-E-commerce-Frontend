import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, ShoppingCart, Sparkles } from 'lucide-react';
import { Product } from '../types';
import { ToyArt } from '../components/ToyArt';
import { useAuth } from '../contexts/AuthContext';
import { useNavigation } from '../contexts/NavigationContext';
import { useCart } from '../contexts/CartContext';
import { useNotification } from '../contexts/NotificationContext';
import * as productApi from '../api/products';

export const DetailScreen: React.FC = () => {
  const { currentUser } = useAuth();
  const { setCurrentScreen, selectedProductId, setCheckoutSource, setCheckoutProduct, setCheckoutQuantity } = useNavigation();
  const { addToCart } = useCart();
  const { triggerToast } = useNotification();
  
  const [product, setProduct] = useState<Product | null>(null);

  useEffect(() => {
    productApi.getProducts()
      .then(products => {
        const p = products.find(prod => prod.id === selectedProductId);
        if (p) setProduct(p);
      })
      .catch(err => triggerToast('Failed to fetch product details', 'error'));
  }, [selectedProductId, triggerToast]);

  const handleAddToCart = async () => {
    if (!currentUser) {
      triggerToast('Please sign in to manage your cart.', 'error');
      setCurrentScreen('welcome');
      return;
    }
    if (!product) return;
    try {
      await addToCart(product.id, 1);
      triggerToast('Added item to shopping cart!', 'success');
      setProduct({ ...product, stock: product.stock - 1 });
    } catch (err: any) {
      triggerToast(err.message || 'Error adding to cart', 'error');
    }
  };

  const handleBuyNow = () => {
    if (!currentUser) {
      triggerToast('Please sign in to make a purchase.', 'error');
      setCurrentScreen('welcome');
      return;
    }
    if (!product) return;
    setCheckoutSource('buynow');
    setCheckoutProduct(product);
    setCheckoutQuantity(1);
    setCurrentScreen('checkout');
  };

  if (!product) return null;

  return (
    <motion.div
      key="detail-screen"
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <button
          onClick={() => setCurrentScreen('browse')}
          className="flex items-center gap-1.5 text-stone-500 hover:text-stone-800 text-xs font-bold bg-stone-100 px-3.5 py-1.5 rounded-full"
        >
          <ArrowRight className="w-3.5 h-3.5 rotate-180" />
          Back
        </button>
        
        <div className="text-[11px] font-bold text-stone-400 flex items-center gap-1 cursor-default select-none">
          <span>Home</span>
          <span>&gt;</span>
          <span>{product.category || 'Category'}</span>
          <span>&gt;</span>
          <span className="text-stone-500">{product.name}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        <div className="bg-surface-container-lowest border border-stone-100 rounded-[2rem] p-6 shadow-md aspect-square flex items-center justify-center">
          <ToyArt type={product.image as any} className="w-full max-w-[80%] drop-shadow-lg" />
        </div>

        <div className="space-y-6">
          <div>
            <span className="bg-[#feeeeb] text-secondary font-black text-[10px] tracking-wider uppercase px-4 py-1.5 rounded-full">
              {product.category.toUpperCase()}
            </span>
          </div>

          <h1 className="font-display font-black text-4xl md:text-5xl text-[#1b1c1c] leading-tight tracking-tight">
            {product.name}
          </h1>

          <div className="flex items-baseline gap-4 border-b border-stone-100 pb-4">
            <p className="font-display font-black text-primary text-3xl leading-none">
              ₹{product.price.toFixed(2)}
            </p>
            <span className="text-xs text-stone-400 font-extrabold tracking-tight">
              In Stock ({product.stock} available)
            </span>
          </div>

          <div className="bg-[#fcfbf9] border border-stone-100 rounded-3xl p-5 md:p-6 shadow-inner text-stone-600 font-semibold text-sm leading-relaxed">
            {product.description}
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <button
              onClick={handleAddToCart}
              className="flex-1 py-3.5 bg-toy-accent hover:brightness-105 text-[#004d62] font-black rounded-full flex justify-center items-center gap-2 transition-transform transform active:scale-95 shadow-lg shadow-toy-accent/15"
            >
              <ShoppingCart className="w-4 h-4 stroke-[2.5]" />
              Add to Cart
            </button>
            
            <button
              onClick={handleBuyNow}
              className="flex-1 py-3.5 border-2 border-[#a43c12] text-[#a43c12] hover:bg-rose-50/20 font-black rounded-full flex justify-center items-center gap-2 transition-transform transform active:scale-95 cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              Buy Now
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
