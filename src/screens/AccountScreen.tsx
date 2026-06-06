import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, CheckCircle, Clock, Star, Store, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Order } from '../types';
import * as orderApi from '../api/orders';
import { ToyArt } from '../components/ToyArt';
import { useNotification } from '../contexts/NotificationContext';

export const AccountScreen: React.FC = () => {
  const { currentUser, setCurrentUser } = useAuth();
  const { triggerToast } = useNotification();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  
  const [editName, setEditName] = useState(currentUser?.name || '');
  const [editPremium, setEditPremium] = useState(currentUser?.isPremium || false);

  useEffect(() => {
    orderApi.getOrders().then(setOrders).catch(console.error);
    if (currentUser) {
      setEditName(currentUser.name);
      setEditPremium(currentUser.isPremium);
    }
  }, [currentUser]);

  const handleSaveProfileDetails = () => {
    if (!currentUser) return;
    setCurrentUser({
      ...currentUser,
      name: editName,
      isPremium: editPremium
    });
    setIsEditModalOpen(false);
    triggerToast('Profile updated locally!', 'success');
  };

  if (!currentUser) return null;

  return (
    <motion.div
      key="account-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-8"
    >
      <section className="bg-surface-container-lowest border border-stone-150 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-center gap-6 shadow-sm overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary-container/20 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
        
        <div className="relative group shrink-0">
          <ToyArt type="user" className="w-24 h-24 md:w-32 md:h-32 shadow-md ring-4 ring-white" />
          {currentUser.isPremium && (
            <div className="absolute bottom-1 right-1 bg-secondary-container rounded-full p-1.5 shadow-lg border-2 border-white">
              <Star className="w-4 h-4 text-on-secondary-container fill-current" />
            </div>
          )}
        </div>

        <div className="flex-1 text-center md:text-left z-10">
          <div className="inline-block px-3 py-1 bg-stone-100 text-stone-600 rounded-full text-[10px] font-black uppercase tracking-widest mb-3">
            Member Since {currentUser.memberSince}
          </div>
          <h2 className="font-display font-black text-3xl md:text-4xl text-stone-900 tracking-tight leading-none mb-2">
            {currentUser.name}
          </h2>
          <p className="text-stone-500 font-semibold">{currentUser.email}</p>
        </div>

        <div className="shrink-0 w-full md:w-auto z-10 mt-4 md:mt-0">
          <button 
            onClick={() => setIsEditModalOpen(true)}
            className="w-full md:w-auto px-6 py-3 border-2 border-stone-200 text-stone-600 font-extrabold hover:border-primary hover:text-primary rounded-xl transition-colors shadow-sm"
          >
            Edit Profile
          </button>
        </div>
      </section>

      <section>
        <div className="flex items-end justify-between mb-6">
          <div>
            <h2 className="font-display font-black text-2xl text-stone-900 tracking-tight">Recent Orders</h2>
            <p className="text-stone-500 text-sm font-medium mt-1">Review your past toys and kits</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-surface-container-lowest border border-stone-100 rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm hover:shadow-md transition-all cursor-pointer group"
            >
              <div className="flex gap-4 items-center">
                <div className="w-14 h-14 bg-stone-100 rounded-xl flex items-center justify-center shrink-0">
                  <Store className="w-7 h-7 text-primary stroke-[1.8]" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-display font-black text-stone-900 dark:text-stone-100">Order {order.id}</h3>
                    <span className={`px-2.5 py-0.5 rounded-full font-extrabold text-[10px] uppercase tracking-wider ${
                      order.orderStatus === 'DELIVERED' ? 'bg-emerald-50 text-emerald-800' 
                      : order.orderStatus === 'SHIPPED' ? 'bg-[#e3f7ff] text-[#004d62]'
                      : 'bg-amber-50 text-amber-800 animate-pulse'
                    }`}>
                      {order.orderStatus}
                    </span>
                  </div>
                  <p className="text-[11px] text-stone-400 font-semibold leading-none">Placed on {order.date}</p>
                  <div className="text-xs text-stone-500 font-bold space-y-0.5 pt-1">
                    {order.items.map((it, idx) => (
                      <div key={idx} className="flex gap-2.5 items-center">
                        <span className="text-[#0c6780]">●</span>
                        <span>{it.name}</span>
                        <span className="text-stone-400 font-medium">x{it.quantity}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between md:justify-end gap-6 border-t md:border-t-0 border-stone-100 pt-3 md:pt-0">
                <div className="text-left md:text-right space-y-1">
                  <p className="font-display font-black text-2xl text-primary leading-none">
                    ₹{order.total.toFixed(2)}
                  </p>
                  <div className="flex items-center gap-1 text-emerald-600 font-bold text-[10px] tracking-wider uppercase leading-none mt-1">
                    <CheckCircle className="w-3.5 h-3.5 fill-current text-white text-emerald-500 shrink-0" />
                    <span>Paid ({order.paymentMethod})</span>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-stone-400 group-hover:text-primary transition-colors" />
              </div>
            </div>
          ))}

          <div 
            onClick={() => triggerToast('Your search logic is pre-indexed for prototype queries.', 'info')}
            className="bg-stone-50 hover:bg-stone-100 border-2 border-dashed border-stone-200 hover:border-primary/40 rounded-2xl p-6 flex flex-col items-center justify-center gap-2 text-center cursor-pointer transition-all"
          >
            <span className="w-10 h-10 rounded-full bg-stone-200 flex items-center justify-center text-stone-500">
              <Clock className="w-5 h-5" />
            </span>
            <h3 className="text-stone-600 font-extrabold text-sm tracking-tight">Browse Past Orders</h3>
            <p className="text-stone-400 text-[11px] font-medium leading-none">Query additional records indices</p>
          </div>
        </div>
      </section>

      <AnimatePresence>
        {isEditModalOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsEditModalOpen(false)}
              className="fixed inset-0 z-[100] bg-black"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-x-4 top-20 md:top-32 max-w-md mx-auto z-[110] bg-white/70 dark:bg-stone-900/70 backdrop-blur-xl rounded-3xl p-6 shadow-2xl border border-stone-100 dark:border-stone-800 flex flex-col gap-4"
            >
              <div className="flex justify-between items-center pb-3 border-b border-stone-100">
                <h3 className="font-display font-black text-xl text-stone-950">Edit Profile Details</h3>
                <button onClick={() => setIsEditModalOpen(false)} className="p-1.5 rounded-full hover:bg-stone-50">
                  <X className="w-5 h-5 text-stone-400" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-extrabold text-stone-600 uppercase tracking-wider mb-1.5">Profile Name</label>
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    placeholder="Alex Playmaker"
                    className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm font-medium bg-white"
                  />
                </div>


              </div>

              <div className="grid grid-cols-2 gap-2 pt-4 border-t border-stone-100">
                <button
                  onClick={() => setIsEditModalOpen(false)}
                  className="w-full py-2.5 bg-stone-100 font-bold hover:bg-stone-200 text-stone-700 rounded-xl text-xs text-center"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveProfileDetails}
                  className="w-full py-2.5 bg-primary hover:brightness-105 font-extrabold text-white rounded-xl text-xs text-center shadow"
                >
                  Save Details
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
