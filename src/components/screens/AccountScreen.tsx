import { motion } from "motion/react";
import {
  ArrowRight,
  Calendar,
  CheckCircle,
  Clock,
  Settings,
  ShoppingBag,
  Star,
  Store,
} from "lucide-react";
import ToyArt from "../ToyArt";
import type { Order, User as UserType } from "../../types";

type ScreenName = "welcome" | "browse" | "cart" | "detail" | "account" | "checkout";

type AccountScreenProps = {
  currentUser: UserType;
  orders: Order[];
  cartTotalItems: number;
  setCurrentScreen: React.Dispatch<React.SetStateAction<ScreenName>>;
  setEditName: React.Dispatch<React.SetStateAction<string>>;
  setEditPremium: React.Dispatch<React.SetStateAction<boolean>>;
  setIsEditModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  triggerToast: (
    message: string,
    type?: "success" | "info" | "error"
  ) => void;
};

export default function AccountScreen({
  currentUser,
  orders,
  cartTotalItems,
  setCurrentScreen,
  setEditName,
  setEditPremium,
  setIsEditModalOpen,
  triggerToast,
}: AccountScreenProps) {
  return (
    <motion.div
      key="account-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-8"
    >
      <section className="relative overflow-hidden rounded-3xl border border-stone-100 bg-surface-container-lowest p-6 shadow-sm md:p-8">
        <div className="pointer-events-none absolute right-0 top-0 h-64 w-64 translate-x-1/3 -translate-y-12 rounded-full bg-primary-container/10 blur-3xl" />

        <div className="flex flex-col items-center gap-6 sm:flex-row">
          <div className="relative shrink-0">
            <ToyArt type="user" className="h-24 w-24 border-4 border-white shadow" />
            <button
              onClick={() =>
                triggerToast(
                  "Profile image uploads are a placeholder in this mockup",
                  "info"
                )
              }
              className="absolute bottom-0 right-0 rounded-full bg-primary p-2 text-white shadow-md transition-transform hover:scale-110 active:scale-95"
            >
              <Settings className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="flex-1 space-y-2 text-center sm:text-left">
            <div className="flex flex-col items-center gap-2 sm:flex-row">
              <h1 className="font-display text-2xl font-black leading-none text-stone-900">
                {currentUser.name}
              </h1>

              {currentUser.isPremium && (
                <span className="inline-flex items-center gap-1 rounded-full bg-tertiary-container/35 px-3 py-0.5 text-[10px] font-extrabold uppercase tracking-wide text-stone-700">
                  <Star className="h-3.5 w-3.5 fill-current text-stone-600" />
                  Premium Member
                </span>
              )}
            </div>

            <p className="text-sm font-semibold leading-none text-stone-500">
              {currentUser.email}
            </p>

            <div className="inline-flex items-center gap-1.5 rounded-full bg-stone-100 px-4 py-1.5">
              <Calendar className="h-3.5 w-3.5 text-primary" />
              <span className="text-[11px] font-extrabold text-stone-500">
                Member Since {currentUser.memberSince}
              </span>
            </div>
          </div>

          <div className="shrink-0">
            <button
              id="edit-profile-trigger"
              onClick={() => {
                setEditName(currentUser.name);
                setEditPremium(currentUser.isPremium);
                setIsEditModalOpen(true);
              }}
              className="rounded-full bg-primary/10 px-5 py-2.5 text-xs font-extrabold text-primary transition-transform hover:bg-primary/15 active:scale-95"
            >
              Edit Profile Details
            </button>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-end justify-between">
          <h2 className="flex items-center gap-2 font-display text-2xl font-black tracking-tight text-[#1b1c1c]">
            <ShoppingBag className="h-6 w-6 text-primary" />
            Recent Orders
          </h2>

          <button
            id="orders-view-all"
            onClick={() =>
              triggerToast(
                "Listing all historic items on this single page layout.",
                "info"
              )
            }
            className="text-xs font-bold text-[#0c6780] underline decoration-2 underline-offset-4 hover:underline"
          >
            View All
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {orders.map((order) => (
            <div
              id={`order-card-${order.id}`}
              key={order.id}
              className="group flex cursor-pointer flex-col justify-between gap-4 rounded-2xl border border-stone-100 bg-surface-container-lowest p-5 shadow-sm transition-all hover:shadow-md md:flex-row md:items-center"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-stone-100">
                  <Store className="h-7 w-7 text-primary stroke-[1.8]" />
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-display text-stone-900 dark:text-stone-100 font-black">
                      Order #{order.id}
                    </h3>

                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider ${
                        order.orderStatus === "DELIVERED"
                          ? "bg-emerald-50 text-emerald-800"
                          : order.orderStatus === "SHIPPED"
                          ? "bg-[#e3f7ff] text-[#004d62]"
                          : "animate-pulse bg-amber-50 text-amber-800"
                      }`}
                    >
                      {order.orderStatus}
                    </span>
                  </div>

                  <p className="text-[11px] font-semibold leading-none text-stone-400">
                    Placed on {order.date}
                  </p>

                  <div className="space-y-0.5 pt-1 text-xs font-bold text-stone-500 dark:text-stone-400">
                    {order.items.map((it, idx) => (
                      <div key={idx} className="flex items-center gap-2.5">
                        <span className="text-[#0c6780] dark:text-sky-300">•</span>
                        <span>{it.name}</span>
                        <span className="font-medium text-stone-400 dark:text-stone-500">
                          x{it.quantity}
                        </span>
                      </div>
                    ))}
                  </div>

                  {order.address && (
                    <div className="mt-2 max-w-xs rounded-xl border border-stone-100/60 bg-stone-50/75 p-2.5 text-[10px] text-stone-400 dark:border-stone-850 dark:bg-stone-900/30 dark:text-stone-500">
                      <p className="mb-1 text-[8px] font-black uppercase tracking-widest text-stone-500 dark:text-stone-450">
                        Shipping Details
                      </p>
                      <p className="font-extrabold text-stone-800 dark:text-stone-200">
                        {order.address.fullName}
                      </p>
                      <p>
                        {order.address.streetAddress}, {order.address.city},{" "}
                        {order.address.state} {order.address.zipCode}
                      </p>
                      <p>Tel {order.address.phoneNumber}</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between gap-6 border-t border-stone-100 pt-3 md:justify-end md:border-t-0 md:pt-0">
                <div className="space-y-1 text-left md:text-right">
                  <p className="font-display text-2xl font-black leading-none text-primary">
                    ₹{order.total.toFixed(2)}
                  </p>
                  <div className="mt-1 flex items-center gap-1 text-[10px] font-bold uppercase leading-none tracking-wider text-emerald-600">
                    <CheckCircle className="h-3.5 w-3.5 shrink-0 text-emerald-500" />
                    <span>Paid {order.paymentMethod}</span>
                  </div>
                </div>

                <ArrowRight className="h-5 w-5 text-stone-400 transition-colors group-hover:text-primary" />
              </div>
            </div>
          ))}

          <div
            onClick={() =>
              triggerToast(
                "Your search logic is pre-indexed for prototype queries.",
                "info"
              )
            }
            className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-stone-200 bg-stone-50 p-6 text-center transition-all hover:border-primary/40 hover:bg-stone-100"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-stone-200 text-stone-500">
              <Clock className="h-5 w-5" />
            </span>
            <h3 className="text-sm font-extrabold tracking-tight text-stone-600">
              Browse Past Orders
            </h3>
            <p className="text-[11px] font-medium leading-none text-stone-400">
              Query additional records indices
            </p>
          </div>
        </div>
      </section>
    </motion.div>
  );
}