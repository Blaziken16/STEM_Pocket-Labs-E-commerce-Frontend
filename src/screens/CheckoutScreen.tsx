import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Check, CheckCircle, ChevronLeft, ChevronRight, CreditCard, MapPin, ShoppingBag, Truck } from 'lucide-react';
import { ToyArt } from '../components/ToyArt';
import { useNavigation } from '../contexts/NavigationContext';
import { useCart } from '../contexts/CartContext';
import { useNotification } from '../contexts/NotificationContext';
import * as orderApi from '../api/orders';

export const CheckoutScreen: React.FC = () => {
  const { setCurrentScreen, checkoutSource, checkoutProduct, checkoutQuantity, setPlacedOrder, setPlacedOrderAddress } = useNavigation();
  const { cartItems, cartSubtotal, setCartItems } = useCart();
  const { triggerToast } = useNotification();

  const [currentCheckoutIndex, setCurrentCheckoutIndex] = useState(0);
  const [shippingName, setShippingName] = useState('');
  const [shippingPhone, setShippingPhone] = useState('');
  const [shippingStreet, setShippingStreet] = useState('');
  const [shippingCity, setShippingCity] = useState('');
  const [shippingState, setShippingState] = useState('');
  const [shippingZip, setShippingZip] = useState('');
  const [shippingLandmark, setShippingLandmark] = useState('');

  const handleCheckoutBack = () => {
    if (checkoutSource === 'buynow') {
      setCurrentScreen('detail');
    } else {
      setCurrentScreen('cart');
    }
  };

  const handlePlaceOrder = async () => {
    try {
      const isDirect = checkoutSource === 'buynow';
      const addressData = {
        fullName: shippingName,
        phoneNumber: shippingPhone,
        streetAddress: shippingStreet,
        city: shippingCity,
        state: shippingState,
        zipCode: shippingZip,
        landmark: shippingLandmark
      };

      const orderData: orderApi.PlaceOrderData = {
        paymentMethod: 'COD',
        address: addressData,
      };

      if (isDirect) {
        if (!checkoutProduct) return;
        orderData.directItems = [{
          productId: checkoutProduct.id,
          quantity: checkoutQuantity
        }];
      }

      const placedOrder = await orderApi.placeOrder(orderData);
      triggerToast('Order placed successfully! Cash On Delivery (COD) chosen.', 'success');
      
      setPlacedOrder(placedOrder);
      setPlacedOrderAddress(addressData);

      if (!isDirect) {
        setCartItems([]);
      }
      
      setCurrentScreen('order-success');
    } catch (err: any) {
      triggerToast(err.message || 'Checkout failed', 'error');
    }
  };

  const itemsCount = checkoutSource === 'buynow' ? 1 : cartItems.length;
  const activeItemProduct = checkoutSource === 'buynow' 
    ? checkoutProduct 
    : cartItems[currentCheckoutIndex]?.product;
  const activeItemQty = checkoutSource === 'buynow'
    ? checkoutQuantity
    : cartItems[currentCheckoutIndex]?.quantity || 1;
  const calculatedSubtotal = checkoutSource === 'buynow'
    ? (checkoutProduct?.price || 0) * checkoutQuantity
    : cartSubtotal;
  const calculatedTotal = calculatedSubtotal + 5.00; // Adding shipping

  return (
    <motion.div
      key="checkout-screen"
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-6 md:space-y-8 max-w-4xl mx-auto"
    >
      <div className="flex items-center justify-between pb-4 border-b border-stone-150 dark:border-stone-850">
        <button
          onClick={handleCheckoutBack}
          className="flex items-center gap-2 text-stone-500 hover:text-stone-800 dark:text-stone-400 dark:hover:text-stone-200 font-extrabold text-sm cursor-pointer transition-colors"
        >
          <ArrowRight className="w-4 h-4 rotate-180" />
          <span>Back to {checkoutSource === 'buynow' ? 'Product' : 'Cart'}</span>
        </button>
        <h2 className="text-sm font-black text-stone-400 dark:text-stone-500 uppercase tracking-widest font-sans">
          Secure Checkout
        </h2>
        <div className="w-10"></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-surface-container-lowest border border-stone-150 dark:border-stone-850 rounded-[2rem] p-6 shadow-xl relative flex flex-col justify-between">
            <div className="relative group min-h-[220px] rounded-[1.8rem] bg-stone-50/50 dark:bg-stone-900/10 flex flex-col items-center justify-center p-6 border border-stone-100/50 dark:border-stone-900/50">
              {activeItemProduct ? (
                <ToyArt type={activeItemProduct.image as any} className="w-36 h-36 drop-shadow-md" />
              ) : (
                <div className="text-center py-10">
                  <ShoppingBag className="w-12 h-12 text-stone-300 mx-auto" />
                  <p className="text-xs text-stone-400 font-bold mt-2">No product found</p>
                </div>
              )}
            </div>

            {itemsCount > 1 && (
              <div className="flex items-center justify-center gap-1.5 mt-4">
                {Array.from({ length: itemsCount }).map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentCheckoutIndex(idx)}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      currentCheckoutIndex === idx 
                        ? 'bg-[#004d62] dark:bg-sky-400 w-4' 
                        : 'bg-stone-250 dark:bg-stone-800 hover:bg-stone-300'
                    }`}
                  />
                ))}
              </div>
            )}

            {itemsCount > 1 && (
              <div className="absolute top-[40%] left-2 right-2 flex justify-between pointer-events-none px-2">
                <button
                  onClick={() => setCurrentCheckoutIndex((prev) => (prev > 0 ? prev - 1 : itemsCount - 1))}
                  className="pointer-events-auto p-1.5 rounded-full bg-white/90 dark:bg-[#1a1c20]/90 text-stone-700 dark:text-stone-300 hover:scale-105 active:scale-95 shadow-md transition-all cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4 font-black" />
                </button>
                <button
                  onClick={() => setCurrentCheckoutIndex((prev) => (prev < itemsCount - 1 ? prev + 1 : 0))}
                  className="pointer-events-auto p-1.5 rounded-full bg-white/90 dark:bg-[#1a1c20]/90 text-stone-700 dark:text-stone-300 hover:scale-105 active:scale-95 shadow-md transition-all cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4 font-black" />
                </button>
              </div>
            )}

            <div className="mt-5 flex items-start justify-between gap-4">
              <div>
                <h3 className="font-display font-black text-stone-900 dark:text-stone-100 text-lg leading-snug">
                  {activeItemProduct?.name || 'Scientific Creation'}
                </h3>
                <p className="text-stone-400 dark:text-stone-500 font-extrabold text-xs mt-1">
                  Quantity: {activeItemQty}
                </p>
              </div>
              <p className="font-display font-black text-[#0c6780] dark:text-sky-300 text-lg whitespace-nowrap">
                ₹{((activeItemProduct?.price || 0) * activeItemQty).toFixed(2)}
              </p>
            </div>
          </div>

          <div className="bg-surface-container-lowest border border-stone-150 dark:border-stone-850 rounded-[2rem] p-8 shadow-xl">
            <h4 className="text-[10px] font-black uppercase text-stone-400 dark:text-stone-500 tracking-widest font-sans mb-4">
              ORDER SUMMARY
            </h4>
            <div className="space-y-3">
              <div className="flex justify-between items-center text-xs">
                <span className="text-stone-500 dark:text-stone-400 font-semibold">Subtotal</span>
                <span className="font-display font-bold text-stone-800 dark:text-stone-250">₹{calculatedSubtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-stone-500 dark:text-stone-400 font-semibold">Standard Shipping</span>
                <span className="font-display font-bold text-stone-800 dark:text-stone-250">₹5.00</span>
              </div>
              
              <div className="h-[1px] bg-stone-100 dark:bg-stone-800 my-3" />

              <div className="flex justify-between items-end">
                <span className="text-stone-900 dark:text-stone-100 font-extrabold text-sm leading-none">Total</span>
                <span className="font-display font-black text-toy-accent dark:text-[#37b0dd] text-3xl leading-none tracking-tight">
                  ₹{calculatedTotal.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-7 space-y-6">
          <div className="bg-surface-container-lowest border border-stone-150 dark:border-stone-850 rounded-[2rem] p-6 shadow-xl space-y-4">
            <h3 className="font-display text-base font-black text-stone-900 dark:text-stone-100 tracking-tight leading-none">
              Choose Payment Method
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="border-2 border-[#0c6780] dark:border-sky-400 bg-teal-50/5 dark:bg-sky-950/10 rounded-2xl p-4 flex items-start gap-3 relative cursor-pointer shadow-sm select-none">
                <div className="bg-[#0c6780] text-white dark:bg-sky-400 dark:text-stone-950 p-0.5 rounded-full absolute top-4 right-4">
                  <Check className="w-3 h-3 stroke-[3.5]" />
                </div>
                <Truck className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h4 className="font-display font-extrabold text-sm text-stone-900 dark:text-stone-100 leading-tight">
                    Cash on Delivery
                  </h4>
                  <p className="text-[11px] text-stone-400 dark:text-stone-500 font-semibold leading-relaxed">
                    Pay securely at your doorstep.
                  </p>
                </div>
              </div>

              <div className="border border-stone-150 dark:border-stone-800 rounded-2xl p-4 flex items-start gap-3 opacity-50 dark:opacity-45 cursor-not-allowed select-none relative bg-stone-50/50 dark:bg-stone-900/10">
                <span className="absolute top-4 right-4 bg-orange-100 dark:bg-orange-950 text-orange-600 dark:text-orange-400 text-[8px] font-black uppercase px-1.5 py-0.5 rounded-full tracking-wider leading-none">
                  Coming Soon
                </span>
                <CreditCard className="w-5 h-5 text-stone-400 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h4 className="font-display font-extrabold text-sm text-stone-500 dark:text-stone-400 leading-tight">
                    Online Payment
                  </h4>
                  <p className="text-[11px] text-stone-400 dark:text-stone-450 font-semibold leading-relaxed">
                    Card, Netbanking, UPI
                  </p>
                </div>
              </div>
            </div>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!shippingName.trim() || !shippingPhone.trim() || !shippingStreet.trim() || !shippingCity.trim() || !shippingState.trim() || !shippingZip.trim()) {
                triggerToast('Please fill out all required address fields.', 'error');
                return;
              }
              handlePlaceOrder();
            }}
            className="bg-surface-container-lowest border border-stone-150 dark:border-stone-850 rounded-[2rem] p-8 shadow-xl space-y-5"
          >
            <div className="flex items-center gap-2 text-stone-900 dark:text-stone-100 pb-2 border-b border-stone-100 dark:border-stone-850">
              <MapPin className="w-5 h-5 text-primary" />
              <h3 className="font-display text-base font-black tracking-tight leading-none">
                Delivery Address
              </h3>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-stone-400 dark:text-stone-500 uppercase tracking-wider block">Full Name *</label>
                  <input
                    type="text"
                    value={shippingName}
                    onChange={(e) => setShippingName(e.target.value)}
                    placeholder="Parent's Name"
                    required
                    className="w-full px-4 py-2.5 bg-stone-100/50 dark:bg-stone-900/40 border border-stone-200/50 dark:border-stone-800 rounded-xl text-stone-800 dark:text-stone-100 placeholder-stone-400 dark:placeholder-stone-600 font-bold text-sm focus:outline-none focus:border-primary focus:bg-white dark:focus:bg-[#1a1b1f] transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-stone-400 dark:text-stone-500 uppercase tracking-wider block">Phone Number *</label>
                  <input
                    type="tel"
                    value={shippingPhone}
                    onChange={(e) => setShippingPhone(e.target.value)}
                    placeholder="+91 xxxx-xxxx"
                    required
                    className="w-full px-4 py-2.5 bg-stone-100/50 dark:bg-stone-900/40 border border-stone-200/50 dark:border-stone-800 rounded-xl text-stone-800 dark:text-stone-100 placeholder-stone-400 dark:placeholder-stone-600 font-bold text-sm focus:outline-none focus:border-primary focus:bg-white dark:focus:bg-[#1a1b1f] transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-stone-400 dark:text-stone-500 uppercase tracking-wider block">Street Address *</label>
                <input
                  type="text"
                  value={shippingStreet}
                  onChange={(e) => setShippingStreet(e.target.value)}
                  placeholder="Address"
                  required
                  className="w-full px-4 py-2.5 bg-stone-100/50 dark:bg-stone-900/40 border border-stone-200/50 dark:border-stone-800 rounded-xl text-stone-800 dark:text-stone-100 placeholder-stone-400 dark:placeholder-stone-600 font-bold text-sm focus:outline-none focus:border-primary focus:bg-white dark:focus:bg-[#1a1b1f] transition-all"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-stone-400 dark:text-stone-500 uppercase tracking-wider block">City *</label>
                  <input
                    type="text"
                    value={shippingCity}
                    onChange={(e) => setShippingCity(e.target.value)}
                    placeholder="City"
                    required
                    className="w-full px-4 py-2.5 bg-stone-100/50 dark:bg-stone-900/40 border border-stone-200/50 dark:border-stone-800 rounded-xl text-stone-800 dark:text-stone-100 placeholder-stone-400 dark:placeholder-stone-600 font-bold text-sm focus:outline-none focus:border-primary focus:bg-white dark:focus:bg-[#1a1b1f] transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-stone-400 dark:text-stone-500 uppercase tracking-wider block">State *</label>
                  <input
                    type="text"
                    value={shippingState}
                    onChange={(e) => setShippingState(e.target.value)}
                    placeholder="State"
                    required
                    className="w-full px-4 py-2.5 bg-stone-100/50 dark:bg-stone-900/40 border border-stone-200/50 dark:border-stone-800 rounded-xl text-stone-800 dark:text-stone-100 placeholder-stone-400 dark:placeholder-stone-600 font-bold text-sm focus:outline-none focus:border-primary focus:bg-white dark:focus:bg-[#1a1b1f] transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-stone-400 dark:text-stone-500 uppercase tracking-wider block">Zip / Pincode *</label>
                  <input
                    type="text"
                    value={shippingZip}
                    onChange={(e) => setShippingZip(e.target.value)}
                    placeholder="90210"
                    required
                    className="w-full px-4 py-2.5 bg-stone-100/50 dark:bg-stone-900/40 border border-stone-200/50 dark:border-stone-800 rounded-xl text-stone-800 dark:text-stone-100 placeholder-stone-400 dark:placeholder-stone-600 font-bold text-sm focus:outline-none focus:border-primary focus:bg-white dark:focus:bg-[#1a1b1f] transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-stone-400 dark:text-stone-500 uppercase tracking-wider block">Landmark (Optional)</label>
                  <input
                    type="text"
                    value={shippingLandmark}
                    onChange={(e) => setShippingLandmark(e.target.value)}
                    placeholder="Near the big park"
                    className="w-full px-4 py-2.5 bg-stone-100/50 dark:bg-stone-900/40 border border-stone-200/50 dark:border-stone-800 rounded-xl text-stone-800 dark:text-stone-100 placeholder-stone-400 dark:placeholder-stone-600 font-bold text-sm focus:outline-none focus:border-primary focus:bg-white dark:focus:bg-[#1a1b1f] transition-all"
                  />
                </div>
              </div>
            </div>

            <div className="pt-4 flex flex-col items-center space-y-3">
              <button
                type="submit"
                className="w-full py-4 bg-[#89d0ed] hover:brightness-105 active:scale-98 text-[#004d62] font-black rounded-full shadow-lg shadow-toy-accent/15 tracking-tight text-center text-sm transition-transform cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Place Order</span>
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </button>

              <div className="flex items-center gap-1 text-[10px] font-extrabold text-stone-400 dark:text-stone-500">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>Cash collected only after delivery. Safe & Secure.</span>
              </div>
            </div>
          </form>
        </div>
      </div>
    </motion.div>
  );
};
