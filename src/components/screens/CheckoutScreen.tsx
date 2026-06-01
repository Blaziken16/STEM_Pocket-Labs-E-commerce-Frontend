import { motion } from "motion/react";
import {
  ArrowRight,
  Check,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  MapPin,
  ShoppingBag,
  Truck,
} from "lucide-react";
import ToyArt from "../ToyArt";
import type { CartItem } from "../../types";

type ScreenName = "welcome" | "browse" | "cart" | "detail" | "account" | "checkout";

type CheckoutScreenProps = {
  cartItems: CartItem[];
  cartSubtotal: number;
  currentCheckoutIndex: number;
  setCurrentCheckoutIndex: React.Dispatch<React.SetStateAction<number>>;
  shippingName: string;
  setShippingName: React.Dispatch<React.SetStateAction<string>>;
  shippingPhone: string;
  setShippingPhone: React.Dispatch<React.SetStateAction<string>>;
  shippingStreet: string;
  setShippingStreet: React.Dispatch<React.SetStateAction<string>>;
  shippingCity: string;
  setShippingCity: React.Dispatch<React.SetStateAction<string>>;
  shippingState: string;
  setShippingState: React.Dispatch<React.SetStateAction<string>>;
  shippingZip: string;
  setShippingZip: React.Dispatch<React.SetStateAction<string>>;
  shippingLandmark: string;
  setShippingLandmark: React.Dispatch<React.SetStateAction<string>>;
  handlePlaceOrder: (addressData: {
    fullName: string;
    phoneNumber: string;
    streetAddress: string;
    city: string;
    state: string;
    zipCode: string;
    landmark?: string;
  }) => void;
  handleCheckoutBack: () => void;
  triggerToast: (
    message: string,
    type?: "success" | "info" | "error"
  ) => void;
};

export default function CheckoutScreen({
  cartItems,
  cartSubtotal,
  currentCheckoutIndex,
  setCurrentCheckoutIndex,
  shippingName,
  setShippingName,
  shippingPhone,
  setShippingPhone,
  shippingStreet,
  setShippingStreet,
  shippingCity,
  setShippingCity,
  shippingState,
  setShippingState,
  shippingZip,
  setShippingZip,
  shippingLandmark,
  setShippingLandmark,
  handlePlaceOrder,
  handleCheckoutBack,
  triggerToast,
}: CheckoutScreenProps) {
  const itemsCount = cartItems.length;
  const activeItemProduct = cartItems[currentCheckoutIndex]?.product;
  const activeItemQty = cartItems[currentCheckoutIndex]?.quantity ?? 1;
  const calculatedSubtotal = cartSubtotal;
  const calculatedTotal = calculatedSubtotal + 5.0;

  return (
    <motion.div
      key="checkout-screen"
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
      className="mx-auto max-w-4xl space-y-6 md:space-y-8"
    >
      <div className="flex items-center justify-between border-b border-stone-150 pb-4 dark:border-stone-850">
        <button
          id="checkout-back-link"
          onClick={handleCheckoutBack}
          className="flex cursor-pointer items-center gap-2 text-sm font-extrabold text-stone-500 transition-colors hover:text-stone-800 dark:text-stone-400 dark:hover:text-stone-200"
        >
          <ArrowRight className="h-4 w-4 rotate-180" />
          <span>Back to Cart</span>
        </button>

        <h2 className="font-sans text-sm font-black uppercase tracking-widest text-stone-400 dark:text-stone-500">
          Secure Checkout
        </h2>

        <div className="w-10" />
      </div>

      <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
        <div className="space-y-6 lg:col-span-5">
          <div
            id="checkout-image-card"
            className="relative flex flex-col justify-between rounded-[2rem] border border-stone-150 bg-surface-container-lowest p-6 shadow-xl dark:border-stone-850"
          >
            <div className="relative flex min-h-[220px] flex-col items-center justify-center rounded-[1.8rem] border border-stone-100/50 bg-stone-50/50 p-6 dark:border-stone-900/50 dark:bg-stone-900/10">
              {activeItemProduct ? (
                <ToyArt
                  type={activeItemProduct.image as any}
                  className="h-36 w-36 drop-shadow-md"
                />
              ) : (
                <div className="py-10 text-center">
                  <ShoppingBag className="mx-auto h-12 w-12 text-stone-300" />
                  <p className="mt-2 text-xs font-bold text-stone-400">
                    No product found
                  </p>
                </div>
              )}
            </div>

            {itemsCount > 1 && (
              <div className="mt-4 flex items-center justify-center gap-1.5">
                {Array.from({ length: itemsCount }).map((_, idx) => (
                  <button
                    id={`carousel-dot-${idx}`}
                    key={idx}
                    onClick={() => setCurrentCheckoutIndex(idx)}
                    title={`View item ${idx + 1}`}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      currentCheckoutIndex === idx
                        ? "w-4 bg-[#004d62] dark:bg-sky-400"
                        : "w-2 bg-stone-250 hover:bg-stone-300 dark:bg-stone-800"
                    }`}
                  />
                ))}
              </div>
            )}

            {itemsCount > 1 && (
              <div className="pointer-events-none absolute left-2 right-2 top-40 flex justify-between px-2">
                <button
                  id="carousel-prev-btn"
                  onClick={() =>
                    setCurrentCheckoutIndex((prev) =>
                      prev > 0 ? prev - 1 : itemsCount - 1
                    )
                  }
                  title="Previous item"
                  className="pointer-events-auto cursor-pointer rounded-full bg-white/90 p-1.5 text-stone-700 shadow-md transition-all hover:scale-105 active:scale-95 dark:bg-[#1a1c20]/90 dark:text-stone-300"
                >
                  <ChevronLeft className="h-4 w-4 font-black" />
                </button>

                <button
                  id="carousel-next-btn"
                  onClick={() =>
                    setCurrentCheckoutIndex((prev) =>
                      prev < itemsCount - 1 ? prev + 1 : 0
                    )
                  }
                  title="Next item"
                  className="pointer-events-auto cursor-pointer rounded-full bg-white/90 p-1.5 text-stone-700 shadow-md transition-all hover:scale-105 active:scale-95 dark:bg-[#1a1c20]/90 dark:text-stone-300"
                >
                  <ChevronRight className="h-4 w-4 font-black" />
                </button>
              </div>
            )}

            <div className="mt-5 flex items-start justify-between gap-4">
              <div>
                <h3 className="font-display text-lg font-black leading-snug text-stone-900 dark:text-stone-100">
                  {activeItemProduct?.name ?? "Scientific Creation"}
                </h3>
                <p className="mt-1 text-xs font-extrabold text-stone-400 dark:text-stone-500">
                  Quantity {activeItemQty}
                </p>
              </div>

              <p className="whitespace-nowrap font-display text-lg font-black text-[#0c6780] dark:text-sky-300">
                ₹{((activeItemProduct?.price ?? 0) * activeItemQty).toFixed(2)}
              </p>
            </div>
          </div>

          <div
            id="order-summary-box"
            className="rounded-[2rem] border border-stone-150 bg-surface-container-lowest p-8 shadow-xl dark:border-stone-850"
          >
            <h4 className="mb-4 font-sans text-[10px] font-black uppercase tracking-widest text-stone-400 dark:text-stone-500">
              ORDER SUMMARY
            </h4>

            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-stone-500 dark:text-stone-400">
                  Subtotal
                </span>
                <span className="font-display font-bold text-stone-800 dark:text-stone-250">
                  ₹{calculatedSubtotal.toFixed(2)}
                </span>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-stone-500 dark:text-stone-400">
                  Standard Shipping
                </span>
                <span className="font-display font-bold text-stone-800 dark:text-stone-250">
                  ₹5.00
                </span>
              </div>

              <div className="my-3 h-px bg-stone-100 dark:bg-stone-800" />

              <div className="flex items-end justify-between">
                <span className="text-sm font-extrabold leading-none text-stone-900 dark:text-stone-100">
                  Total
                </span>
                <span className="font-display text-3xl font-black leading-none tracking-tight text-toy-accent dark:text-[#37b0dd]">
                  ₹{calculatedTotal.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6 lg:col-span-7">
          <div
            id="payment-method-box"
            className="space-y-4 rounded-[2rem] border border-stone-150 bg-surface-container-lowest p-6 shadow-xl dark:border-stone-850"
          >
            <h3 className="font-display text-base font-black leading-none tracking-tight text-stone-900 dark:text-stone-100">
              Choose Payment Method
            </h3>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="relative flex cursor-pointer items-start gap-3 rounded-2xl border-2 border-[#0c6780] bg-teal-50/5 p-4 shadow-sm select-none dark:border-sky-400 dark:bg-sky-950/10">
                <div className="absolute right-4 top-4 rounded-full bg-[#0c6780] p-0.5 text-white dark:bg-sky-400 dark:text-stone-950">
                  <Check className="h-3 w-3 stroke-[3.5]" />
                </div>

                <Truck className="mt-0.5 h-5 w-5 shrink-0 text-primary" />

                <div className="space-y-1">
                  <h4 className="font-display text-sm font-extrabold leading-tight text-stone-900 dark:text-stone-100">
                    Cash on Delivery
                  </h4>
                  <p className="text-[11px] font-semibold leading-relaxed text-stone-400 dark:text-stone-500">
                    Pay securely at your doorstep.
                  </p>
                </div>
              </div>

              <div className="relative flex cursor-not-allowed select-none items-start gap-3 rounded-2xl border border-stone-150 bg-stone-50/50 p-4 opacity-50 dark:border-stone-800 dark:bg-stone-900/10 dark:opacity-45">
                <span className="absolute right-4 top-4 rounded-full bg-orange-100 px-1.5 py-0.5 text-[8px] font-black uppercase leading-none tracking-wider text-orange-600 dark:bg-orange-950 dark:text-orange-400">
                  Coming Soon
                </span>

                <CreditCard className="mt-0.5 h-5 w-5 shrink-0 text-stone-400" />

                <div className="space-y-1">
                  <h4 className="font-display text-sm font-extrabold leading-tight text-stone-500 dark:text-stone-400">
                    Online Payment
                  </h4>
                  <p className="text-[11px] font-semibold leading-relaxed text-stone-400 dark:text-stone-450">
                    Card, Netbanking, UPI
                  </p>
                </div>
              </div>
            </div>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();

              if (
                !shippingName.trim() ||
                !shippingPhone.trim() ||
                !shippingStreet.trim() ||
                !shippingCity.trim() ||
                !shippingState.trim() ||
                !shippingZip.trim()
              ) {
                triggerToast(
                  "Please fill out all required address fields.",
                  "error"
                );
                return;
              }

              handlePlaceOrder({
                fullName: shippingName,
                phoneNumber: shippingPhone,
                streetAddress: shippingStreet,
                city: shippingCity,
                state: shippingState,
                zipCode: shippingZip,
                landmark: shippingLandmark,
              });
            }}
            className="space-y-5 rounded-[2rem] border border-stone-150 bg-surface-container-lowest p-8 shadow-xl dark:border-stone-850"
          >
            <div className="flex items-center gap-2 border-b border-stone-100 pb-2 text-stone-900 dark:border-stone-850 dark:text-stone-100">
              <MapPin className="h-5 w-5 text-primary" />
              <h3 className="font-display text-base font-black leading-none tracking-tight">
                Delivery Address
              </h3>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-black uppercase tracking-wider text-stone-400 dark:text-stone-500">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={shippingName}
                    onChange={(e) => setShippingName(e.target.value)}
                    placeholder="Parent's Name"
                    required
                    className="w-full rounded-xl border border-stone-200/50 bg-stone-100/50 px-4 py-2.5 text-sm font-bold text-stone-800 placeholder-stone-400 transition-all focus:border-primary focus:bg-white focus:outline-none dark:border-stone-800 dark:bg-stone-900/40 dark:text-stone-100 dark:placeholder-stone-600 dark:focus:bg-[#1a1b1f]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[10px] font-black uppercase tracking-wider text-stone-400 dark:text-stone-500">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={shippingPhone}
                    onChange={(e) => setShippingPhone(e.target.value)}
                    placeholder="+91 555 000-0000"
                    required
                    className="w-full rounded-xl border border-stone-200/50 bg-stone-100/50 px-4 py-2.5 text-sm font-bold text-stone-800 placeholder-stone-400 transition-all focus:border-primary focus:bg-white focus:outline-none dark:border-stone-800 dark:bg-stone-900/40 dark:text-stone-100 dark:placeholder-stone-600 dark:focus:bg-[#1a1b1f]"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-[10px] font-black uppercase tracking-wider text-stone-400 dark:text-stone-500">
                  Street Address
                </label>
                <input
                  type="text"
                  value={shippingStreet}
                  onChange={(e) => setShippingStreet(e.target.value)}
                  placeholder="123 Playful Lane"
                  required
                  className="w-full rounded-xl border border-stone-200/50 bg-stone-100/50 px-4 py-2.5 text-sm font-bold text-stone-800 placeholder-stone-400 transition-all focus:border-primary focus:bg-white focus:outline-none dark:border-stone-800 dark:bg-stone-900/40 dark:text-stone-100 dark:placeholder-stone-600 dark:focus:bg-[#1a1b1f]"
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-black uppercase tracking-wider text-stone-400 dark:text-stone-500">
                    City
                  </label>
                  <input
                    type="text"
                    value={shippingCity}
                    onChange={(e) => setShippingCity(e.target.value)}
                    placeholder="Toytown"
                    required
                    className="w-full rounded-xl border border-stone-200/50 bg-stone-100/50 px-4 py-2.5 text-sm font-bold text-stone-800 placeholder-stone-400 transition-all focus:border-primary focus:bg-white focus:outline-none dark:border-stone-800 dark:bg-stone-900/40 dark:text-stone-100 dark:placeholder-stone-600 dark:focus:bg-[#1a1b1f]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[10px] font-black uppercase tracking-wider text-stone-400 dark:text-stone-500">
                    State
                  </label>
                  <input
                    type="text"
                    value={shippingState}
                    onChange={(e) => setShippingState(e.target.value)}
                    placeholder="UP"
                    required
                    className="w-full rounded-xl border border-stone-200/50 bg-stone-100/50 px-4 py-2.5 text-sm font-bold text-stone-800 placeholder-stone-400 transition-all focus:border-primary focus:bg-white focus:outline-none dark:border-stone-800 dark:bg-stone-900/40 dark:text-stone-100 dark:placeholder-stone-600 dark:focus:bg-[#1a1b1f]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-black uppercase tracking-wider text-stone-400 dark:text-stone-500">
                    Zip / Pincode
                  </label>
                  <input
                    type="text"
                    value={shippingZip}
                    onChange={(e) => setShippingZip(e.target.value)}
                    placeholder="208001"
                    required
                    className="w-full rounded-xl border border-stone-200/50 bg-stone-100/50 px-4 py-2.5 text-sm font-bold text-stone-800 placeholder-stone-400 transition-all focus:border-primary focus:bg-white focus:outline-none dark:border-stone-800 dark:bg-stone-900/40 dark:text-stone-100 dark:placeholder-stone-600 dark:focus:bg-[#1a1b1f]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[10px] font-black uppercase tracking-wider text-stone-400 dark:text-stone-500">
                    Landmark Optional
                  </label>
                  <input
                    type="text"
                    value={shippingLandmark}
                    onChange={(e) => setShippingLandmark(e.target.value)}
                    placeholder="Near the big park"
                    className="w-full rounded-xl border border-stone-200/50 bg-stone-100/50 px-4 py-2.5 text-sm font-bold text-stone-800 placeholder-stone-400 transition-all focus:border-primary focus:bg-white focus:outline-none dark:border-stone-800 dark:bg-stone-900/40 dark:text-stone-100 dark:placeholder-stone-600 dark:focus:bg-[#1a1b1f]"
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-col items-center space-y-3 pt-4">
              <button
                type="submit"
                id="checkout-order-submit-btn"
                className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-[#89d0ed] py-4 text-center text-sm font-black tracking-tight text-[#004d62] shadow-lg shadow-toy-accent/15 transition-transform hover:brightness-105 active:scale-95"
              >
                <span>Place Order</span>
                <ArrowRight className="h-4 w-4 stroke-[2.5]" />
              </button>

              <div className="flex items-center gap-1 text-[10px] font-extrabold text-stone-400 dark:text-stone-500">
                <CheckCircle className="h-3.5 w-3.5 shrink-0 text-emerald-500" />
                <span>Cash collected only after delivery. Safe & Secure.</span>
              </div>
            </div>
          </form>
        </div>
      </div>
    </motion.div>
  );
}