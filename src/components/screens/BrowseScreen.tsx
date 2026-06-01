import { motion } from "motion/react";
import { Plus, Sparkles } from "lucide-react";
import ToyArt from "../ToyArt";
import type { Product, User as UserType } from "../../types";

type ScreenName = "welcome" | "browse" | "cart" | "detail" | "account" | "checkout";

type BrowseScreenProps = {
  products: Product[];
  selectedCategory: string;
  setSelectedCategory: React.Dispatch<React.SetStateAction<string>>;
  currentUser: UserType | null;
  setSelectedProductId: React.Dispatch<React.SetStateAction<string>>;
  setCurrentScreen: React.Dispatch<React.SetStateAction<ScreenName>>;
  handleAddToCart: (productId: number, quantity?: number, redirectAfter?: boolean) => void;
};

const categories = ["All", "Physics", "Chemistry", "Jumbo Kits"];

export default function BrowseScreen({
  products,
  selectedCategory,
  setSelectedCategory,
  currentUser,
  setSelectedProductId,
  setCurrentScreen,
  handleAddToCart,
}: BrowseScreenProps) {
  const filteredProducts =
    selectedCategory === "All"
      ? products
      : products.filter((product) => product.category === selectedCategory);

  return (
    <motion.div
      key="browse-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-8"
    >
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="font-display text-3xl font-black tracking-tight text-stone-900 dark:text-stone-100">
            Browse Pocket Labs Creations
          </h1>
          <p className="text-sm font-medium text-stone-500">
            Explore premium toys made for curious, playful minds.
          </p>
        </div>

        {currentUser && (
          <div className="flex items-center gap-2 rounded-full bg-primary-container/20 px-4 py-2.5 text-xs font-extrabold text-on-primary-container">
            <Sparkles className="h-4 w-4 fill-current text-primary" />
            <span>Hello, {currentUser.name}! You have premium support.</span>
          </div>
        )}
      </div>

      <div className="scrollbar-none flex gap-2 overflow-x-auto pb-2">
        {categories.map((catName) => (
          <button
            id={`filter-pill-${catName.toLowerCase().replace(/\s+/g, "-")}`}
            key={catName}
            onClick={() => setSelectedCategory(catName)}
            className={`whitespace-nowrap rounded-full px-5 py-2.5 text-xs font-bold transition-all ${
              selectedCategory === catName
                ? "bg-primary text-white shadow-md shadow-primary/10"
                : "bg-stone-100 text-stone-600 hover:bg-stone-200/60"
            }`}
          >
            {catName}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-2 md:gap-8">
        {filteredProducts.map((toy) => (
          <motion.div
            id={`toy-card-${toy.id}`}
            key={toy.id}
            whileHover={{ y: -4, scale: 1.01 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="flex flex-col justify-between rounded-3xl border border-stone-100/80 bg-surface-container-lowest p-5 shadow-sm transition-all hover:shadow-lg"
          >
            <div className="group relative flex h-52 cursor-pointer items-center justify-center rounded-2xl bg-slate-50/50 p-4">
              <ToyArt type={toy.image as any} className="h-36 w-36 drop-shadow-md" />
              <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-stone-600 shadow backdrop-blur-sm dark:bg-[#1e2025]/90 dark:text-stone-300">
                {toy.category}
              </span>
            </div>

            <div className="mt-4 flex flex-1 flex-col justify-between">
              <div>
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-display text-xl font-black leading-tight text-stone-900 group-hover:text-primary">
                    {toy.name}
                  </h3>
                  <p className="shrink-0 whitespace-nowrap font-display text-lg font-extrabold text-primary">
                    ₹{toy.price.toFixed(2)}
                  </p>
                </div>

                <p className="mt-1.5 line-clamp-2 text-xs font-medium leading-relaxed text-stone-500">
                  {toy.description}
                </p>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <span
                  className={`rounded-full border px-3 py-1 text-[11px] font-extrabold ${
                    toy.stock > 10
                      ? "border-emerald-100 bg-emerald-50 text-emerald-800"
                      : "border-amber-100 bg-amber-50 text-amber-700"
                  }`}
                >
                  {toy.stock} left in stock
                </span>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-2 pt-1">
                <button
                  id={`toy-card-detail-btn-${toy.id}`}
                  onClick={() => {
                    setSelectedProductId(toy.id);
                    setCurrentScreen("detail");
                  }}
                  className="w-full rounded-xl border border-stone-200/40 bg-stone-100 py-2.5 text-center text-xs font-bold text-stone-700 transition-colors hover:bg-stone-200"
                >
                  View Details
                </button>

                <button
                  id={`toy-card-add-btn-${toy.id}`}
                  onClick={() => handleAddToCart(toy.id, 1)}
                  className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-secondary-container py-2.5 text-xs font-extrabold text-on-secondary-container transition-transform active:scale-95 hover:brightness-105"
                >
                  <Plus className="h-3.5 w-3.5 stroke-[2.5]" />
                  Add to Cart
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="rounded-3xl border border-dashed border-stone-200 bg-stone-50 py-12 text-center">
          <p className="mb-2 font-bold text-stone-500">
            No toys inside this category currently
          </p>
          <button
            onClick={() => setSelectedCategory("All")}
            className="text-xs font-extrabold text-primary hover:underline"
          >
            Back to All Toys
          </button>
        </div>
      )}
    </motion.div>
  );
}