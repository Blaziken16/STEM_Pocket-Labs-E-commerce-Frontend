import { History, ShoppingCart, Store, User } from "lucide-react";
import type { User as UserType } from "../../types";

type ScreenName = "welcome" | "browse" | "cart" | "detail" | "account" | "checkout";

type MobileBottomBarProps = {
  currentUser: UserType | null;
  currentScreen: ScreenName;
  cartTotalItems: number;
  setCurrentScreen: React.Dispatch<React.SetStateAction<ScreenName>>;
  triggerToast: (message: string, type?: "success" | "info" | "error") => void;
};

export default function MobileBottomBar({
  currentUser,
  currentScreen,
  cartTotalItems,
  setCurrentScreen,
  triggerToast,
}: MobileBottomBarProps) {
  if (!currentUser) return null;

  return (
    <nav
      id="mobile-bottombar"
      className="fixed bottom-0 left-0 z-50 flex w-full items-center justify-around rounded-t-2xl border-t border-stone-150 bg-white px-2 py-3 shadow-[0px_-4px_10px_rgba(0,0,0,0.03)] md:hidden"
    >
      <button
        id="mobile-tab-shop"
        onClick={() => setCurrentScreen("browse")}
        className={`flex flex-col items-center justify-center gap-0.5 px-4 py-1 transition-transform active:scale-90 ${
          currentScreen === "browse" || currentScreen === "detail"
            ? "scale-102 text-primary"
            : "text-stone-400"
        }`}
      >
        <Store className="h-[22px] w-[22px] stroke-[2.2]" />
        <span className="text-[10px] font-black leading-none tracking-tight">
          Shop
        </span>
      </button>

      <button
        id="mobile-tab-orders"
        onClick={() => setCurrentScreen("account")}
        className={`flex flex-col items-center justify-center gap-0.5 px-4 py-1 transition-transform active:scale-90 ${
          currentScreen === "account" ? "scale-102 text-primary" : "text-stone-400"
        }`}
      >
        <History className="h-[22px] w-[22px] stroke-[2.2]" />
        <span className="text-[10px] font-black leading-none tracking-tight">
          Orders
        </span>
      </button>

      <button
        id="mobile-tab-cart"
        onClick={() => setCurrentScreen("cart")}
        className={`relative flex flex-col items-center justify-center gap-0.5 px-4 py-1 transition-transform active:scale-90 ${
          currentScreen === "cart" ? "scale-102 text-primary" : "text-stone-400"
        }`}
      >
        <ShoppingCart className="h-[22px] w-[22px] stroke-[2.2]" />
        <span className="text-[10px] font-black leading-none tracking-tight">
          Cart
        </span>

        {cartTotalItems > 0 && (
          <span className="absolute right-2 top-0.5 flex h-4.5 w-4.5 items-center justify-center rounded-full border border-white bg-secondary-container text-[9px] font-black text-on-secondary-container">
            {cartTotalItems}
          </span>
        )}
      </button>

      <button
        id="mobile-tab-profile"
        onClick={() => {
          setCurrentScreen("account");
          triggerToast("Active profile panel loaded.", "info");
        }}
        className="flex flex-col items-center justify-center gap-0.5 px-4 py-1 text-stone-400 transition-transform active:scale-90 hover:text-primary"
      >
        <User className="h-[22px] w-[22px] stroke-[2.2]" />
        <span className="text-[10px] font-black leading-none tracking-tight">
          Account
        </span>
      </button>
    </nav>
  );
}