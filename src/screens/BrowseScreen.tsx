import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Plus, Sparkles } from 'lucide-react';
import { Product } from '../types';
import { ToyArt } from '../components/ToyArt';
import { useAuth } from '../contexts/AuthContext';
import { useNavigation } from '../contexts/NavigationContext';
import { useCart } from '../contexts/CartContext';
import { useNotification } from '../contexts/NotificationContext';
import * as productApi from '../api/products';

export const BrowseScreen: React.FC = () => {
  const { currentUser } = useAuth();
  const { setCurrentScreen, setSelectedProductId } = useNavigation();
  const { addToCart } = useCart();
  const { triggerToast } = useNotification();
  
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  useEffect(() => {
    productApi.getProducts()
      .then(setProducts)
      .catch(err => triggerToast('Failed to fetch products', 'error'));
  }, [triggerToast]);

  const handleAddToCart = async (productId: string) => {
    if (!currentUser) {
      triggerToast('Please sign in to manage your cart.', 'error');
      setCurrentScreen('welcome');
      return;
    }
    try {
      await addToCart(productId, 1);
      triggerToast('Added item to shopping cart!', 'success');
      setProducts(prev => prev.map(p => p.id === productId ? { ...p, stock: p.stock - 1 } : p));
    } catch (err: any) {
      triggerToast(err.message || 'Error adding to cart', 'error');
    }
  };

  const filteredProducts = products.filter(
    (p) => selectedCategory === 'All' || p.category.toLowerCase() === selectedCategory.toLowerCase()
  );

  return (
    <motion.div
      key="browse-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-8"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black font-display text-stone-900 dark:text-stone-100 tracking-tight">Browse Pocket Labs Creations</h1>
          <p className="text-sm text-stone-500 font-medium">Explore Premium kits made for curious minds</p>
        </div>
        
        {currentUser && (
          <div className="bg-primary-container/20 text-on-primary-container px-4 py-2.5 rounded-full text-xs font-extrabold flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-primary fill-current" />
            <span>Hello, {currentUser.name}! You have premium support.</span>
          </div>
        )}
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
        {['All', 'Physics', 'Chemistry', 'Jumbo Kits'].map((catName) => (
          <button
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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 md:gap-8">
        {filteredProducts.map((toy) => (
          <motion.div
            key={toy.id}
            whileHover={{ y: -4, scale: 1.01 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className="bg-surface-container-lowest border border-stone-100/80 rounded-3xl p-5 shadow-sm hover:shadow-lg transition-all flex flex-col justify-between"
          >
            <div 
              className="relative group cursor-pointer h-52 bg-slate-50/50 rounded-2xl flex items-center justify-center p-4 overflow-hidden"
              onClick={() => {
                setSelectedProductId(toy.id);
                setCurrentScreen('detail');
              }}
            >
              <ToyArt type={toy.image as any} className="w-36 h-36 drop-shadow-md" />
              <span className="absolute top-3 left-3 bg-white/90 dark:bg-[#1e2025]/90 backdrop-blur-sm shadow px-2.5 py-1 rounded-full text-[10px] font-black uppercase text-stone-600 dark:text-stone-300 tracking-wider">
                {toy.category}
              </span>
            </div>

            <div className="mt-4 flex-1 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start gap-2">
                  <h3 className="font-display font-black text-xl text-stone-900 group-hover:text-primary leading-tight">
                    {toy.name}
                  </h3>
                  <p className="font-display font-extrabold text-primary text-lg whitespace-nowrap shrink-0">
                    ₹{toy.price.toFixed(2)}
                  </p>
                </div>
                <p className="text-xs text-stone-500 line-clamp-2 mt-1.5 font-medium leading-relaxed">
                  {toy.description}
                </p>
              </div>

              <div className="flex items-center justify-between mt-4">
                <span className={`text-[11px] font-extrabold px-3 py-1 rounded-full border ${
                  toy.stock > 10 
                    ? 'bg-emerald-50 border-emerald-100 text-emerald-800' 
                    : 'bg-amber-50 border-amber-100 text-amber-700'
                }`}>
                  {toy.stock} left in stock
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 mt-4 pt-1">
                <button
                  onClick={() => {
                    setSelectedProductId(toy.id);
                    setCurrentScreen('detail');
                  }}
                  className="w-full py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold rounded-xl text-xs text-center transition-colors border border-stone-200/40"
                >
                  View Details
                </button>
                <button
                  onClick={() => handleAddToCart(toy.id)}
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

      {filteredProducts.length === 0 && (
        <div className="bg-stone-50 text-center py-12 rounded-3xl border border-dashed border-stone-200">
          <p className="text-stone-500 font-bold mb-2">No toys inside this category currently</p>
          <button onClick={() => setSelectedCategory('All')} className="text-xs font-extrabold text-primary hover:underline">
            Back to All Toys
          </button>
        </div>
      )}
    </motion.div>
  );
};
