import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Check } from 'lucide-react';
import { useNavigation } from '../contexts/NavigationContext';
import { useAuth } from '../contexts/AuthContext';
import { useNotification } from '../contexts/NotificationContext';
import { useCart } from '../contexts/CartContext';
import * as productApi from '../api/products';
import { Product } from '../types';
import { ToyArt } from '../components/ToyArt';

export const OrderSuccessScreen: React.FC = () => {
  const { setCurrentScreen, placedOrder, placedOrderAddress } = useNavigation();
  const { currentUser } = useAuth();
  const { addToCart } = useCart();
  const { triggerToast } = useNotification();
  
  const [recommendations, setRecommendations] = useState<Product[]>([]);

  useEffect(() => {
    productApi.getProducts().then(allProducts => {
      setRecommendations(allProducts.slice(0, 2));
    }).catch(console.error);
  }, []);

  const handleQuickAdd = async (productId: string) => {
    if (!currentUser) {
      triggerToast('Please sign in first.', 'error');
      return;
    }
    try {
      await addToCart(productId, 1);
      triggerToast('Added to cart!', 'success');
    } catch (err: any) {
      triggerToast(err.message || 'Error', 'error');
    }
  };

  if (!placedOrder) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
        <p className="text-stone-500 font-bold">No recent order found.</p>
        <button onClick={() => setCurrentScreen('browse')} className="text-primary font-black hover:underline">
          Go Browse Products
        </button>
      </div>
    );
  }

  const subtotal = placedOrder.items.reduce((acc, it) => acc + (it.pricePaid * it.quantity), 0);
  const shipping = 5.00;
  const total = subtotal + shipping;

  return (
    <motion.div
      key="order-success-screen"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="max-w-5xl mx-auto space-y-8"
    >
      <div className="flex items-center justify-between pb-4 border-b border-stone-200 dark:border-stone-800">
        <button 
          onClick={() => setCurrentScreen('browse')}
          className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 hover:border-stone-300 dark:hover:border-stone-700 rounded-full text-stone-600 dark:text-stone-400 font-bold text-sm shadow-sm transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Browse More Products</span>
        </button>
        <span className="text-[10px] font-black text-[#0c6780] dark:text-sky-400 tracking-widest uppercase">
          Live Order Dispatch Tracker
        </span>
      </div>

      <div className="bg-[#f2fbf7] dark:bg-emerald-950/20 border border-[#e2f5ec] dark:border-emerald-900/30 rounded-[2rem] p-8 flex items-center gap-6 shadow-sm">
        <div className="w-16 h-16 bg-[#d1f4e0] dark:bg-emerald-900/50 rounded-full flex items-center justify-center shrink-0 border-[4px] border-[#e8fbf0] dark:border-emerald-950">
          <Check className="w-8 h-8 text-[#10b981] stroke-[3]" />
        </div>
        <div>
          <h2 className="text-2xl font-black font-display text-[#065f46] dark:text-emerald-400">Order Successfully Placed!</h2>
          <p className="text-sm font-semibold text-[#047857] dark:text-emerald-500 mt-1">
            Your science companion is being prepared and packed for shipment. Please have payment ready at delivery!
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white dark:bg-surface-container-lowest border border-stone-200 dark:border-stone-850 rounded-[2rem] p-8 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <h3 className="font-display font-black text-lg text-stone-900 dark:text-stone-100">Estimated Delivery</h3>
              <span className="text-xs font-bold text-orange-500">2-3 Business Days</span>
            </div>

            {placedOrder.orderStatus === 'CANCELLED' ? (
              <div className="bg-red-50/80 dark:bg-red-950/20 border border-red-100 dark:border-red-900/30 rounded-2xl p-6 text-center mb-8 backdrop-blur-sm">
                <h4 className="font-display font-black text-xl text-red-600 dark:text-red-400">Order Cancelled</h4>
                <p className="text-sm font-semibold text-red-500 dark:text-red-500/80 mt-1">This order was cancelled by the administrator.</p>
              </div>
            ) : (
              <div className="relative flex justify-between items-center px-4 mb-8">
                <div className="absolute left-8 right-8 top-1/2 -translate-y-1/2 h-[2px] bg-stone-100 dark:bg-stone-850 -z-10" />
                <div 
                  className="absolute left-8 top-1/2 -translate-y-1/2 h-[2px] bg-[#0c6780] dark:bg-sky-500 -z-10 transition-all duration-700"
                  style={{ width: placedOrder.orderStatus === 'DELIVERED' ? 'calc(100% - 4rem)' : placedOrder.orderStatus === 'SHIPPED' ? 'calc(50% - 2rem)' : '0%' }}
                />
                
                <div className="flex flex-col items-center gap-2 bg-white dark:bg-surface-container-lowest px-2">
                  <div className="w-8 h-8 rounded-full bg-[#0c6780] dark:bg-sky-500 flex items-center justify-center text-white shadow-md">
                    <Check className="w-4 h-4 stroke-[3]" />
                  </div>
                  <div className="text-center">
                    <p className="text-xs font-black text-stone-900 dark:text-stone-200">Placed</p>
                    <p className="text-[10px] font-bold text-stone-400">Secure COD</p>
                  </div>
                </div>
                
                <div className="flex flex-col items-center gap-2 bg-white dark:bg-surface-container-lowest px-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-sm transition-colors duration-500 ${
                    placedOrder.orderStatus === 'DELIVERED' 
                      ? 'bg-[#0c6780] dark:bg-sky-500 text-white shadow-md' 
                      : placedOrder.orderStatus === 'SHIPPED'
                        ? 'border-2 border-[#0c6780] dark:border-sky-500 text-[#0c6780] dark:text-sky-500 bg-white dark:bg-surface-container-lowest shadow-sm'
                        : 'border-2 border-stone-200 dark:border-stone-800 text-stone-400 bg-white dark:bg-surface-container-lowest'
                  }`}>
                    {placedOrder.orderStatus === 'DELIVERED' ? <Check className="w-4 h-4 stroke-[3]" /> : '2'}
                  </div>
                  <div className="text-center">
                    <p className={`text-xs font-black ${placedOrder.orderStatus === 'SHIPPED' || placedOrder.orderStatus === 'DELIVERED' ? 'text-stone-900 dark:text-stone-200' : 'text-stone-400'}`}>Shipping</p>
                    <p className={`text-[10px] font-bold ${placedOrder.orderStatus === 'SHIPPED' || placedOrder.orderStatus === 'DELIVERED' ? 'text-stone-500 dark:text-stone-400' : 'text-stone-300 dark:text-stone-500'}`}>In transit</p>
                  </div>
                </div>

                <div className="flex flex-col items-center gap-2 bg-white dark:bg-surface-container-lowest px-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-sm transition-colors duration-500 ${
                    placedOrder.orderStatus === 'DELIVERED' 
                      ? 'bg-[#0c6780] dark:bg-sky-500 text-white shadow-md' 
                      : 'border-2 border-stone-200 dark:border-stone-800 text-stone-400 bg-white dark:bg-surface-container-lowest'
                  }`}>
                    {placedOrder.orderStatus === 'DELIVERED' ? <Check className="w-4 h-4 stroke-[3]" /> : '3'}
                  </div>
                  <div className="text-center">
                    <p className={`text-xs font-black ${placedOrder.orderStatus === 'DELIVERED' ? 'text-stone-900 dark:text-stone-200' : 'text-stone-400'}`}>Delivered</p>
                    <p className={`text-[10px] font-bold ${placedOrder.orderStatus === 'DELIVERED' ? 'text-stone-500 dark:text-stone-400' : 'text-stone-300 dark:text-stone-500'}`}>At your door</p>
                  </div>
                </div>
              </div>
            )}

            <div className="border-t border-stone-100 dark:border-stone-850 pt-6">
              <h4 className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-4">
                Recipient & Dispatch Point
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs font-semibold text-stone-500 mb-1">Customer Details</p>
                  <p className="text-sm font-black text-stone-900 dark:text-stone-100">{placedOrderAddress?.fullName || currentUser?.name}</p>
                  <p className="text-xs font-bold text-stone-600 dark:text-stone-400 mt-0.5">Tel: {placedOrderAddress?.phoneNumber || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-stone-500 mb-1">Shipping Destination</p>
                  <p className="text-sm font-bold text-[#0c6780] dark:text-sky-400">
                    {placedOrderAddress ? `${placedOrderAddress.streetAddress}, ${placedOrderAddress.city}, ${placedOrderAddress.state} ${placedOrderAddress.zipCode}` : 'Default Address'}
                  </p>
                  {placedOrderAddress?.landmark && (
                    <p className="text-xs font-bold text-stone-400 italic mt-0.5">Landmark: {placedOrderAddress.landmark}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="pt-6">
            <div className="flex items-end justify-between mb-4">
              <div>
                <h3 className="font-display font-black text-lg text-stone-900 dark:text-stone-100">Recommended Science Companions</h3>
                <p className="text-xs font-medium text-stone-400">Interactive stem experiments chosen to expand your lab horizons</p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {recommendations.map(toy => (
                <div key={toy.id} className="bg-white dark:bg-surface-container-lowest border border-stone-200 dark:border-stone-850 rounded-3xl p-4 flex flex-col justify-between hover:shadow-md transition-shadow">
                  <div className="relative bg-stone-50 dark:bg-stone-900/30 rounded-2xl h-32 flex items-center justify-center p-2 mb-4">
                    <ToyArt type={toy.image as any} className="w-20 h-20 drop-shadow-sm" />
                    <span className="absolute top-2 right-2 bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 px-2 py-0.5 rounded-full text-[8px] font-black text-stone-500 dark:text-stone-400 uppercase tracking-wider shadow-sm">
                      {toy.category}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-display font-black text-sm text-stone-900 dark:text-stone-100 leading-tight mb-1">{toy.name}</h4>
                    <p className="text-[10px] text-stone-500 line-clamp-2 leading-relaxed">{toy.description}</p>
                  </div>
                  <div className="flex items-center justify-between mt-4">
                    <span className="font-display font-black text-[#0c6780] dark:text-sky-300 text-sm">₹{toy.price.toFixed(2)}</span>
                    <button 
                      onClick={() => handleQuickAdd(toy.id)}
                      className="text-xs font-extrabold text-[#0c6780] dark:text-sky-400 hover:text-[#004d62] dark:hover:text-sky-300 transition-colors"
                    >
                      Quick Add
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-5">
          <div className="bg-white dark:bg-surface-container-lowest border border-stone-200 dark:border-stone-850 rounded-[2rem] p-8 shadow-sm sticky top-28">
            <h3 className="font-display font-black text-lg text-stone-900 dark:text-stone-100 mb-6">Receipt Summary</h3>
            
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-stone-100 dark:border-stone-850">
              <span className="text-xs font-bold text-stone-600 dark:text-stone-400">Order Code:</span>
              <span className="text-sm font-black text-[#0c6780] dark:text-sky-400">#TB-{placedOrder.id.padStart(4, '0')}</span>
            </div>

            <div className="space-y-4 mb-6">
              {placedOrder.items.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-stone-50 dark:bg-stone-900/40 rounded-lg flex items-center justify-center shrink-0 border border-stone-100 dark:border-stone-800">
                      <ToyArt type={item.image as any} className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-xs font-black text-stone-900 dark:text-stone-100 line-clamp-1">{item.name}</p>
                      <p className="text-[10px] font-bold text-stone-500">Qty: {item.quantity}</p>
                    </div>
                  </div>
                  <span className="text-xs font-black text-stone-900 dark:text-stone-100">₹{(item.pricePaid * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="space-y-3 pt-4 border-t border-stone-100 dark:border-stone-850">
              <div className="flex justify-between items-center text-xs">
                <span className="text-stone-600 dark:text-stone-400 font-bold">Subtotal:</span>
                <span className="text-stone-900 dark:text-stone-100 font-black">₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-stone-600 dark:text-stone-400 font-bold">Standard Shipping:</span>
                <span className="text-stone-900 dark:text-stone-100 font-black">₹{shipping.toFixed(2)}</span>
              </div>
              <div className="h-[1px] bg-stone-100 dark:bg-stone-850 my-4" />
              <div className="flex justify-between items-center">
                <span className="text-sm text-stone-900 dark:text-stone-100 font-black">Total Payable:</span>
                <span className="text-xl font-display font-black text-stone-900 dark:text-stone-100">₹{total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
