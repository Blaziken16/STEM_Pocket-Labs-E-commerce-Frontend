import { motion } from "motion/react";
import { ArrowRight, ShoppingCart, Sparkles } from "lucide-react";
import ToyArt from "../ToyArt";
import type { Product } from "../../types";

type ScreenName = "welcome" | "browse" | "cart" | "detail" | "account" | "checkout";

type DetailScreenProps = {
  products: Product[];
  selectedProductId: string | number;
  setCurrentScreen: React.Dispatch<React.SetStateAction<ScreenName>>;
  handleAddToCart: (productId: number, quantity?: number, redirectAfter?: boolean) => void;
  handleBuyNow: (product: Product) => void;
};

export default function DetailScreen({
  products,
  selectedProductId,
  setCurrentScreen,
  handleAddToCart,
  handleBuyNow,
}: DetailScreenProps) {
  const toy = products.find((p) => p.id === selectedProductId);

  if (!toy) return null;

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
          onClick={() => setCurrentScreen("browse")}
          className="flex items-center gap-1.5 rounded-full bg-stone-100 px-3.5 py-1.5 text-xs font-bold text-stone-500 hover:text-stone-800"
        >
          <ArrowRight className="h-3.5 w-3.5 rotate-180" />
          Back
        </button>

        <div className="flex cursor-default select-none items-center gap-1 text-[11px] font-bold text-stone-400">
          <span>Home</span>
          <span>&gt;</span>
          <span>{toy.category}</span>
          <span>&gt;</span>
          <span className="text-stone-500">{toy.name}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 items-start gap-8 md:grid-cols-2">
        <div className="flex aspect-square items-center justify-center rounded-[2rem] border border-stone-100 bg-surface-container-lowest p-6 shadow-md">
          <ToyArt
            type={toy.image as any}
            className="w-full max-w-80 drop-shadow-lg"
          />
        </div>

        <div className="space-y-6">
          <div>
            <span className="rounded-full bg-[#feeeeb] px-4 py-1.5 text-[10px] font-black uppercase tracking-wider text-secondary">
              {toy.category.toUpperCase()}
            </span>
          </div>

          <h1 className="font-display text-4xl font-black leading-tight tracking-tight text-[#1b1c1c] md:text-5xl">
            {toy.name}
          </h1>

          <div className="flex items-baseline gap-4 border-b border-stone-100 pb-4">
            <p className="font-display text-3xl font-black leading-none text-primary">
              ₹{toy.price.toFixed(2)}
            </p>
            <span className="text-xs font-extrabold tracking-tight text-stone-400">
              In Stock · {toy.stock} available
            </span>
          </div>

          <div className="rounded-3xl border border-stone-100 bg-[#fcfbf9] p-5 text-sm font-semibold leading-relaxed text-stone-600 shadow-inner md:p-6">
            {toy.description}
          </div>

          <div className="flex flex-col gap-3 pt-4 sm:flex-row">
            <button
              id="detail-add-to-cart-btn"
              onClick={() => handleAddToCart(toy.id, 1)}
              className="flex flex-1 items-center justify-center gap-2 rounded-full bg-toy-accent py-3.5 font-black text-[#004d62] shadow-lg shadow-toy-accent/15 transition-transform hover:brightness-105 active:scale-95"
            >
              <ShoppingCart className="h-4 w-4 stroke-[2.5]" />
              Add to Cart
            </button>

            <button
              id="detail-buy-now-btn"
              onClick={() => handleBuyNow(toy)}
              className="flex flex-1 items-center justify-center gap-2 rounded-full border-2 border-[#a43c12] py-3.5 font-black text-[#a43c12] transition-transform hover:bg-rose-50/20 active:scale-95"
            >
              <Sparkles className="h-4 w-4" />
              Buy Now
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}