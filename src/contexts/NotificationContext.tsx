import React, { createContext, useContext, useState, ReactNode } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Check, Info, X } from 'lucide-react';

type NotificationType = 'success' | 'info' | 'error';

interface NotificationContextType {
  triggerToast: (message: string, type?: NotificationType) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [notification, setNotification] = useState<{ message: string; type: NotificationType } | null>(null);

  const triggerToast = (message: string, type: NotificationType = 'success') => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification((prev) => (prev?.message === message ? null : prev));
    }, 4000);
  };

  return (
    <NotificationContext.Provider value={{ triggerToast }}>
      {children}
      <AnimatePresence>
        {notification && (
          <motion.div
            id="toast-notification"
            initial={{ opacity: 0, y: 50, x: "-50%", scale: 0.9 }}
            animate={{ opacity: 1, y: 0, x: "-50%", scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, y: 20, x: "-50%" }}
            className={`fixed bottom-6 left-1/2 z-[150] rounded-xl shadow-lg p-4 flex items-center gap-3 border w-[calc(100%-2rem)] max-w-sm ${
              notification.type === 'success' 
                ? 'bg-emerald-50 border-emerald-200 text-emerald-800' 
                : notification.type === 'error'
                ? 'bg-rose-50 border-rose-200 text-rose-800'
                : 'bg-sky-50 border-sky-200 text-sky-800'
            }`}
          >
            {notification.type === 'success' && <Check className="w-5 h-5 text-emerald-600 shrink-0" />}
            {notification.type === 'error' && <X className="w-5 h-5 text-rose-600 shrink-0" />}
            {notification.type === 'info' && <Info className="w-5 h-5 text-sky-600 shrink-0" />}
            
            <p className="font-semibold text-sm">{notification.message}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) throw new Error('useNotification must be used within a NotificationProvider');
  return context;
};
