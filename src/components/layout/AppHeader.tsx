import { Menu, Moon, ShoppingCart, Sparkles, Star, Sun } from "lucide-react";
import ToyArt from "../ToyArt";
import type { User as UserType } from "../../types";

type ScreenName = "welcome" | "browse" | "cart" | "detail" | "account" | "checkout";

type AppHeaderProps = {
  currentUser: UserType | null;
  cartTotalItems: number;
  isDarkMode: boolean;
  setIsDarkMode: React.Dispatch<React.SetStateAction<boolean>>;
  setIsSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setCurrentScreen: React.Dispatch<React.SetStateAction<ScreenName>>;
  triggerToast: (message: string, type?: "success" | "info" | "error") => void;
};

export default function AppHeader({
  currentUser,
  cartTotalItems,
  isDarkMode,
  setIsDarkMode,
  setIsSidebarOpen,
  setCurrentScreen,
  triggerToast,
}: AppHeaderProps) {
  if (!currentUser) return null;

  return (
    <header
      id="global-topappbar"
      className="fixed left-0 top-0 z-50 flex h-20 w-full items-center justify-between border-b border-stone-150/60 bg-surface-container-lowest/80 px-4 shadow-sm backdrop-blur-md md:px-8"
    >
      <div className="flex items-center gap-3 md:gap-5">
        <button
          id="menu-hamburger-btn"
          onClick={() => setIsSidebarOpen(true)}
          title="Open Navigation Menu"
          className="cursor-pointer rounded-full p-2 text-primary transition-transform hover:bg-stone-50 hover:scale-105 active:scale-95 focus:outline-none"
        >
          <Menu className="h-6 w-6 stroke-[2.5]" />
        </button>

        <div
          className="flex cursor-pointer items-center gap-1.5 font-display text-2xl font-extrabold tracking-tight text-primary selection:bg-transparent md:text-3xl"
          onClick={() => setCurrentScreen("browse")}
        >
          Pocket Labs
          <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-secondary-container" />
        </div>
      </div>

      <div className="flex items-center gap-2 md:gap-4">
        <button
          id="theme-toggle-btn"
          onClick={() => {
            setIsDarkMode((prev) => !prev);
            triggerToast(
              !isDarkMode ? "Enabled slate dark theme!" : "Enabled light theme!",
              "info"
            );
          }}
          title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          className="flex cursor-pointer items-center justify-center rounded-full p-2 text-primary transition-transform hover:bg-stone-50 hover:scale-105 active:scale-95 dark:hover:bg-stone-800 focus:outline-none"
        >
          {isDarkMode ? (
            <Sun className="h-6 w-6 stroke-[2.5]" />
          ) : (
            <Moon className="h-6 w-6 stroke-[2.5]" />
          )}
        </button>

        <button
          id="header-cart-indicator"
          onClick={() => setCurrentScreen("cart")}
          title="View Shopping Cart"
          className="relative cursor-pointer rounded-full p-2 text-primary transition-transform hover:bg-stone-50 hover:scale-105 active:scale-95 focus:outline-none"
        >
          <ShoppingCart className="h-6 w-6 stroke-[2.5]" />
          {cartTotalItems > 0 && (
            <span className="absolute -right-0.5 -top-0.5 flex h-5 w-5 items-center justify-center rounded-full border-2 border-white bg-secondary-container text-[10px] font-black text-on-secondary-container">
              {cartTotalItems}
            </span>
          )}
        </button>

        <button
          id="header-profile-indicator"
          onClick={() => {
            setCurrentScreen("account");
            triggerToast("Loaded your account dashboard.", "info");
          }}
          title="View Account Profile"
          className="relative cursor-pointer overflow-hidden rounded-full border border-stone-200 p-0.5 transition-all hover:ring-2 hover:ring-primary/25 focus:outline-none"
        >
          <ToyArt type="user" className="h-9 w-9" />
          {currentUser.isPremium && (
            <span className="absolute bottom-0 right-0 rounded-full bg-secondary-container p-0.5 shadow-sm text-on-secondary-container">
              <Star className="h-2 w-2 fill-current" />
            </span>
          )}
        </button>
      </div>
    </header>
  );
}