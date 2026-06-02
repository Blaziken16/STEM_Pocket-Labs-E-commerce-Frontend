import { AnimatePresence, motion } from "motion/react";
import {
  History,
  LogOut,
  ShoppingCart,
  Sparkles,
  Star,
  Store,
  X,
} from "lucide-react";
import ToyArt from "../ToyArt";
import type { User as UserType } from "../../types";

type ScreenName = "welcome" | "browse" | "cart" | "detail" | "account" | "checkout";

type SidebarDrawerProps = {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  currentUser: UserType | null;
  currentScreen: ScreenName;
  cartTotalItems: number;
  setCurrentScreen: React.Dispatch<React.SetStateAction<ScreenName>>;
  handleLogout: () => void;
};

export default function SidebarDrawer({
  isOpen,
  setIsOpen,
  currentUser,
  currentScreen,
  cartTotalItems,
  setCurrentScreen,
  handleLogout,
}: SidebarDrawerProps) {
  const navTo = (screen: ScreenName) => {
    setCurrentScreen(screen);
    setIsOpen(false);
  };

  return (
    <AnimatePresence>
      {isOpen && currentUser && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm"
          />

          <motion.nav
            initial={{ x: -100, opacity: 1 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -100, opacity: 1 }}
            transition={{ type: "spring", damping: 25, stiffness: 220 }}
            style={{ opacity: 1 }}
            className="fixed left-0 top-0 z-[110] flex h-full w-[85vw] max-w-[320px] flex-col border-r border-stone-100 bg-white py-6 shadow-2xl !opacity-100 dark:border-stone-900 dark:bg-black"
          >
            <div className="flex items-center justify-between border-b border-stone-100 px-6 pb-6 dark:border-stone-900">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <ToyArt type="user" className="h-12 w-12" />
                  {currentUser.isPremium && (
                    <span className="absolute bottom-0 right-0 rounded-full bg-secondary-container p-0.5 shadow-sm">
                      <Star className="h-2.5 w-2.5 fill-current text-white" />
                    </span>
                  )}
                </div>

                <div>
                  <h2 className="font-display text-base font-bold leading-tight text-slate-800 dark:text-stone-100">
                    {currentUser.name}
                  </h2>
                  <p className="mt-1 text-xs font-medium leading-none text-stone-500 dark:text-stone-400">
                    Happy playing
                  </p>
                </div>
              </div>

              <button
                id="drawer-close-btn"
                onClick={() => setIsOpen(false)}
                className="cursor-pointer rounded-full p-1.5 transition-colors hover:bg-stone-100 dark:text-stone-300 dark:hover:bg-stone-800"
              >
                <X className="h-5 w-5 text-stone-500 dark:text-stone-300" />
              </button>
            </div>

            <div className="flex flex-1 flex-col gap-1 overflow-y-auto px-3 py-4">
              {(
                [
                  {
                    id: "drawer-home",
                    screen: "browse" as ScreenName,
                    icon: Store,
                    label: "Browse Creations",
                    active:
                      currentScreen === "browse" || currentScreen === "detail",
                  },
                  {
                    id: "drawer-account",
                    screen: "account" as ScreenName,
                    icon: History,
                    label: "Order History & Profile",
                    active: currentScreen === "account",
                  },
                  {
                    id: "drawer-cart",
                    screen: "cart" as ScreenName,
                    icon: ShoppingCart,
                    label: "Shopping Cart",
                    active: currentScreen === "cart",
                    badge: cartTotalItems > 0 ? cartTotalItems : null,
                  },
                ] as const
              ).map(({ id, screen, icon: Icon, label, active, badge }) => (
                <button
                  key={id}
                  id={id}
                  onClick={() => navTo(screen)}
                  className={`flex cursor-pointer items-center gap-4 rounded-full px-4 py-3 text-left text-sm font-bold transition-all ${
                    active
                      ? "bg-primary/20 font-extrabold text-primary dark:text-sky-300"
                      : "text-stone-700 hover:bg-stone-100/50 hover:text-stone-950 dark:text-stone-100 dark:hover:bg-stone-800 dark:hover:text-white"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{label}</span>
                  {badge && (
                    <span className="ml-auto rounded-full bg-secondary-container px-2.5 py-0.5 text-[11px] font-extrabold text-on-secondary-container">
                      {badge}
                    </span>
                  )}
                </button>
              ))}

              <div className="mx-4 my-4 h-[1.5px] bg-stone-150 dark:bg-stone-800" />

              <div className="mx-1 rounded-2xl border border-primary-container/20 bg-primary-container/10 p-4">
                <div className="flex items-center gap-2 text-primary dark:text-sky-300">
                  <Sparkles className="h-4 w-4 animate-pulse fill-current" />
                  <span className="font-display text-xs font-bold uppercase tracking-wider">
                    Premium Help Desk
                  </span>
                </div>

                <p className="mt-1.5 text-[11px] font-medium text-stone-700 dark:text-stone-300">
                  Email Support
                </p>
                <a
                  href="mailto:support@pocketlabs.com"
                  className="text-xs font-bold text-primary hover:underline dark:text-sky-300"
                >
                  support@pocketlabs.com
                </a>

                <p className="mt-1.5 text-[11px] font-medium text-stone-700 dark:text-stone-300">
                  Helpline Support
                </p>
                <p className="text-xs font-bold text-stone-800 dark:text-stone-100">
                  91-9988776655
                </p>
              </div>

              <div className="mt-8">
                <button
                  onClick={() => {
                    handleLogout();
                    setIsOpen(false);
                  }}
                  className="flex w-full cursor-pointer items-center gap-4 rounded-full px-4 py-3 text-left font-bold text-rose-600 transition-colors hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-950/20"
                >
                  <LogOut className="h-5 w-5" />
                  Sign Out
                </button>
              </div>
            </div>

            <div className="mt-auto border-t border-stone-150 px-4 pt-4 dark:border-stone-900">
              <button
                id="drawer-cta-btn"
                onClick={() => navTo("browse")}
                className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-primary px-4 py-3 text-center text-sm font-bold text-white shadow-md transition-all hover:brightness-110 active:scale-95"
              >
                <Store className="h-4 w-4" />
                Go to Science Shop
              </button>
            </div>
          </motion.nav>
        </>
      )}
    </AnimatePresence>
  );
}