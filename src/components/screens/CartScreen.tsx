import { motion } from "motion/react";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import ToyArt from "../ToyArt";
import type { CartItem } from "../../types";

type ScreenName = "welcome" | "browse" | "cart" | "detail" | "account" | "checkout";

type CartScreenProps = {
  cartItems: CartItem[];
  cartSubtotal: number;
  handleUpdateCartQuantity: (
    productId: string,
    currentQty: number,
    offset: number
  ) => void;
  handleDeleteCartItem: (productId: string | number) => void;
  handleCheckout: () => void;
  setCurrentScreen: React.Dispatch<React.SetStateAction<ScreenName>>;
};

export default function CartScreen({
  cartItems,
  cartSubtotal,
  handleUpdateCartQuantity,
  handleDeleteCartItem,
  handleCheckout,
  setCurrentScreen,
}: CartScreenProps) {
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
        className="mx-auto flex max-w-2xl flex-col justify-between rounded-3xl border border-stone-150 bg-surface-container-lowest px-6 py-10 shadow-xl md:p-12"
      >
        <div className="flex items-end justify-between border-b border-stone-100 pb-6">
          <div>
            <h1 className="font-display text-4xl font-extrabold tracking-tight text-stone-900">
              Your Cart
            </h1>
            <p
              id="cart-item-count"
              className="mt-2 text-sm font-semibold leading-none text-stone-400"
            >
              {cartItems.length} {cartItems.length === 1 ? "Item" : "Items"}
            </p>
          </div>

          <button
            id="cart-continue-shopping"
            onClick={() => setCurrentScreen("browse")}
            className="text-sm font-bold tracking-tight text-primary hover:underline"
          >
            Continue Shopping
          </button>
        </div>

        <div className="space-y-4 py-8">
          {cartItems.map((item) => (
            <div
              id={`cart-item-row-${item.id}`}
              key={item.id}
              className="flex flex-col items-center justify-between gap-4 rounded-2xl border border-stone-100 bg-stone-50/70 p-4 sm:flex-row"
            >
              <div className="flex w-full items-center gap-4 sm:w-auto">
                <ToyArt
                  type={(item.product?.image as any) || "elephant"}
                  className="h-16 w-16 shrink-0"
                />
                <div>
                  <h3 className="font-display text-lg font-extrabold text-stone-900">
                    {item.product?.name || "Toy Item"}
                  </h3>
                  <p className="text-xs font-semibold text-stone-400">
                    ₹{item.product?.price?.toFixed(2) ?? "0.00"} each
                  </p>
                </div>
              </div>

              <div className="flex w-full items-center justify-between gap-4 sm:w-auto sm:justify-start">
                <div className="flex items-center rounded-full border border-stone-200 bg-stone-200/50 px-3 py-1.5">
                  <button
                    id={`cart-qty-minus-${item.id}`}
                    onClick={() =>
                      handleUpdateCartQuantity(String(item.productId), item.quantity, -1)
                    }
                    className="p-1 text-stone-500 transition-colors hover:text-stone-800"
                  >
                    <Minus className="h-3.5 w-3.5 stroke-[2.5]" />
                  </button>

                  <span className="select-none px-4 font-display text-sm font-black text-stone-800">
                    {item.quantity}
                  </span>

                  <button
                    id={`cart-qty-plus-${item.id}`}
                    onClick={() =>
                      handleUpdateCartQuantity(String(item.productId), item.quantity, 1)
                    }
                    className="p-1 text-stone-500 transition-colors hover:text-stone-800"
                  >
                    <Plus className="h-3.5 w-3.5 stroke-[2.5]" />
                  </button>
                </div>

                <div className="flex items-center gap-4">
                  <p className="w-20 text-right font-display text-lg font-extrabold text-stone-800">
                    ₹
                    {(
                      item.product ? item.product.price * item.quantity : 0
                    ).toFixed(2)}
                  </p>

                  <button
                    id={`cart-item-delete-${item.id}`}
                    onClick={() => handleDeleteCartItem(item.productId)}
                    className="rounded-full bg-rose-50 p-2.5 text-rose-500 transition-all hover:scale-105 hover:text-rose-700"
                  >
                    <Trash2 className="h-4 w-4 stroke-[2.5]" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {cartItems.length === 0 && (
          <div className="py-12 text-center">
            <ShoppingBag className="mx-auto mb-4 h-16 w-16 text-stone-300 stroke-[1.5]" />
            <p className="text-lg font-bold text-stone-500">
              Your shopping cart is empty
            </p>
            <p className="mt-1 text-xs text-stone-400">
              Browse the toy catalog to add cute creations
            </p>
            <button
              id="empty-cart-browse"
              onClick={() => setCurrentScreen("browse")}
              className="mt-6 rounded-full bg-primary px-6 py-2.5 text-xs font-extrabold text-white shadow-md"
            >
              Explore Toys Now
            </button>
          </div>
        )}

        {cartItems.length > 0 && (
          <div className="flex flex-col items-center border-t border-stone-100 pt-6">
            <div className="flex flex-col items-center text-center">
              <p className="text-sm font-bold tracking-tight text-stone-500">Total</p>
              <p
                id="cart-total-amount"
                className="mt-1 font-display text-5xl font-black leading-none tracking-tight text-toy-accent md:text-6xl"
              >
                ₹{cartSubtotal.toFixed(2)}
              </p>
              <p className="mt-3 text-[10px] font-semibold uppercase leading-none tracking-wider text-stone-400">
                Taxes and shipping calculated at checkout
              </p>
            </div>

            <button
              id="proceed-checkout-btn"
              onClick={handleCheckout}
              className="mt-8 w-full max-w-sm rounded-full bg-toy-accent py-4 text-center text-sm font-black tracking-tight text-[#004d62] shadow-lg shadow-toy-accent/15 transition-transform hover:brightness-105 active:scale-95"
            >
              Proceed to Checkout
            </button>
          </div>
        )}
      </div>

      <footer className="mx-auto max-w-2xl border-t border-stone-200/50 pt-10 pb-4 text-center">
        <div className="mb-4 flex justify-center gap-6 text-xs font-extrabold tracking-tight text-stone-400">
          <span className="cursor-pointer hover:text-primary">Shop All</span>
          <span className="cursor-pointer hover:text-primary">About Us</span>
          <span className="cursor-pointer hover:text-primary">Shipping</span>
          <span className="cursor-pointer hover:text-primary">Returns</span>
          <span className="cursor-pointer hover:text-primary">Contact</span>
        </div>

        <p className="font-display text-[11px] font-bold text-stone-400/80">
          © 2026 Pocket Labs. Play with Wonder.
        </p>
      </footer>
    </motion.div>
  );
}