import { AnimatePresence, motion } from "motion/react";
import { Check, Info, X } from "lucide-react";

type ToastProps = {
  notification: {
    message: string;
    type: "success" | "info" | "error";
  } | null;
};

export default function Toast({ notification }: ToastProps) {
  return (
    <AnimatePresence>
      {notification && (
        <motion.div
          id="toast-notification"
          initial={{ opacity: 0, y: 50, x: "-50%", scale: 0.9 }}
          animate={{ opacity: 1, y: 0, x: "-50%", scale: 1 }}
          exit={{ opacity: 0, scale: 0.9, y: 20, x: "-50%" }}
          className={`fixed bottom-6 left-1/2 z-[150] flex w-[calc(100%-2rem)] max-w-sm -translate-x-1/2 items-center gap-3 rounded-xl border p-4 shadow-lg ${
            notification.type === "success"
              ? "border-emerald-200 bg-emerald-50 text-emerald-800"
              : notification.type === "error"
              ? "border-rose-200 bg-rose-50 text-rose-800"
              : "border-sky-200 bg-sky-50 text-sky-800"
          }`}
        >
          {notification.type === "success" && (
            <Check className="h-5 w-5 shrink-0 text-emerald-600" />
          )}
          {notification.type === "error" && (
            <X className="h-5 w-5 shrink-0 text-rose-600" />
          )}
          {notification.type === "info" && (
            <Info className="h-5 w-5 shrink-0 text-sky-600" />
          )}
          <p className="text-sm font-semibold">{notification.message}</p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}