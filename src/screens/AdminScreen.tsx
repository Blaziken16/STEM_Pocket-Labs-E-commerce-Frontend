import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Settings, Package, ShoppingBag, Plus, Edit2, Trash2, X, Check } from 'lucide-react';
import { Product, Order } from '../types';
import { useNotification } from '../contexts/NotificationContext';
import { getProducts, createProduct, updateProduct, deleteProduct } from '../api/products';
import { getAllOrders, updateOrderStatus } from '../api/orders';

export const AdminScreen: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'products' | 'orders'>('products');
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const { triggerToast } = useNotification();

  // Modal State
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'products') {
        const data = await getProducts();
        setProducts(data);
      } else {
        const data = await getAllOrders();
        setOrders(data);
      }
    } catch (error) {
      triggerToast('Failed to load data', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct?.name || !editingProduct?.price || !editingProduct?.image) {
      triggerToast('Please fill all required fields', 'error');
      return;
    }

    try {
      if (editingProduct.id) {
        await updateProduct(editingProduct.id, editingProduct);
        triggerToast('Product updated successfully', 'success');
      } else {
        await createProduct(editingProduct);
        triggerToast('Product created successfully', 'success');
      }
      setIsProductModalOpen(false);
      fetchData();
    } catch (error) {
      triggerToast('Failed to save product', 'error');
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await deleteProduct(id);
      triggerToast('Product deleted', 'success');
      fetchData();
    } catch (error) {
      triggerToast('Failed to delete product', 'error');
    }
  };

  const handleStatusChange = async (orderId: string, status: string) => {
    try {
      await updateOrderStatus(orderId, status);
      triggerToast('Order status updated', 'success');
      fetchData();
    } catch (error: any) {
      triggerToast(error.message || 'Failed to update status', 'error');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-6xl mx-auto pb-24"
    >
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
          <Settings className="w-5 h-5 text-primary" />
        </div>
        <h1 className="text-2xl font-display font-bold text-slate-800 dark:text-stone-100">
          Admin Dashboard
        </h1>
      </div>

      <div className="flex gap-4 mb-8">
        <button
          onClick={() => setActiveTab('products')}
          className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold transition-all ${
            activeTab === 'products'
              ? 'bg-primary text-white shadow-md'
              : 'bg-white dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-700'
          }`}
        >
          <Package className="w-4 h-4" /> Products
        </button>
        <button
          onClick={() => setActiveTab('orders')}
          className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold transition-all ${
            activeTab === 'orders'
              ? 'bg-primary text-white shadow-md'
              : 'bg-white dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-700'
          }`}
        >
          <ShoppingBag className="w-4 h-4" /> Orders
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
        </div>
      ) : (
        <div className="bg-white dark:bg-stone-900 rounded-3xl p-6 shadow-sm border border-stone-100 dark:border-stone-800">
          {activeTab === 'products' ? (
            <>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold font-display">Manage Products</h2>
                <button
                  onClick={() => {
                    setEditingProduct({ name: '', description: '', price: 0, stock: 10, image: '', category: 'General' });
                    setIsProductModalOpen(true);
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary hover:bg-primary/20 rounded-xl font-bold transition-colors"
                >
                  <Plus className="w-4 h-4" /> Add Product
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-stone-200 dark:border-stone-800">
                      <th className="pb-3 font-bold text-sm text-stone-500">Image</th>
                      <th className="pb-3 font-bold text-sm text-stone-500">Name</th>
                      <th className="pb-3 font-bold text-sm text-stone-500">Price</th>
                      <th className="pb-3 font-bold text-sm text-stone-500">Stock</th>
                      <th className="pb-3 font-bold text-sm text-stone-500 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map(product => (
                      <tr key={product.id} className="border-b border-stone-100 dark:border-stone-800 last:border-0">
                        <td className="py-3">
                          <img src={product.image} alt={product.name} className="w-12 h-12 rounded-lg object-cover bg-stone-100" />
                        </td>
                        <td className="py-3 font-bold">{product.name}</td>
                        <td className="py-3 text-primary font-bold">₹{product.price.toFixed(2)}</td>
                        <td className="py-3">{product.stock || 10}</td>
                        <td className="py-3 text-right">
                          <button
                            onClick={() => {
                              setEditingProduct(product);
                              setIsProductModalOpen(true);
                            }}
                            className="p-2 text-sky-500 hover:bg-sky-50 dark:hover:bg-sky-900/20 rounded-lg transition-colors mr-2"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(product.id)}
                            className="p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          ) : (
            <>
              <h2 className="text-xl font-bold font-display mb-6">Manage Orders</h2>
              <div className="space-y-4">
                {orders.length === 0 ? (
                  <p className="text-stone-500 py-8 text-center font-medium">No orders found across the platform.</p>
                ) : (
                  orders.map(order => (
                    <div key={order.id} className="border border-stone-200 dark:border-stone-800 rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <span className="font-bold font-mono text-sm">#{order.id}</span>
                          <span className="text-sm text-stone-500">{order.date}</span>
                        </div>
                        <div className="text-sm">
                          <span className="font-bold">{order.items.reduce((acc, i) => acc + i.quantity, 0)} items</span>
                          <span className="mx-2 text-stone-300">|</span>
                          <span className="font-bold text-primary">₹{order.total.toFixed(2)}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <select
                          value={order.orderStatus || 'PROCESSING'}
                          onChange={(e) => handleStatusChange(order.id, e.target.value)}
                          className="bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 border border-stone-200 dark:border-stone-700 rounded-xl px-4 py-2 font-bold text-sm outline-none focus:ring-2 focus:ring-primary/50"
                        >
                          <option value="PROCESSING" className="dark:bg-stone-800">Processing</option>
                          <option value="SHIPPED" className="dark:bg-stone-800">Shipped</option>
                          <option value="DELIVERED" className="dark:bg-stone-800">Delivered</option>
                          <option value="CANCELLED" className="dark:bg-stone-800">Cancelled</option>
                        </select>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </>
          )}
        </div>
      )}

      {/* Product Modal */}
      {isProductModalOpen && editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-stone-900 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-stone-100 dark:border-stone-800">
              <h3 className="font-display font-bold text-xl">
                {editingProduct.id ? 'Edit Product' : 'Add Product'}
              </h3>
              <button onClick={() => setIsProductModalOpen(false)} className="p-2 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-full">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSaveProduct} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-500 mb-1">Name</label>
                <input
                  required
                  value={editingProduct.name || ''}
                  onChange={e => setEditingProduct({...editingProduct, name: e.target.value})}
                  className="w-full bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl px-4 py-3 outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-stone-500 mb-1">Image URL</label>
                <input
                  required
                  value={editingProduct.image || ''}
                  onChange={e => setEditingProduct({...editingProduct, image: e.target.value})}
                  className="w-full bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl px-4 py-3 outline-none focus:border-primary"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-500 mb-1">Price</label>
                  <input
                    required
                    type="number"
                    step="0.01"
                    value={editingProduct.price || ''}
                    onChange={e => setEditingProduct({...editingProduct, price: parseFloat(e.target.value)})}
                    className="w-full bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl px-4 py-3 outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-500 mb-1">Stock</label>
                  <input
                    required
                    type="number"
                    value={editingProduct.stock || ''}
                    onChange={e => setEditingProduct({...editingProduct, stock: parseInt(e.target.value)})}
                    className="w-full bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl px-4 py-3 outline-none focus:border-primary"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-stone-500 mb-1">Category</label>
                <input
                  required
                  value={editingProduct.category || ''}
                  onChange={e => setEditingProduct({...editingProduct, category: e.target.value})}
                  className="w-full bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl px-4 py-3 outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-stone-500 mb-1">Description</label>
                <textarea
                  required
                  rows={3}
                  value={editingProduct.description || ''}
                  onChange={e => setEditingProduct({...editingProduct, description: e.target.value})}
                  className="w-full bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl px-4 py-3 outline-none focus:border-primary resize-none"
                />
              </div>
              
              <button
                type="submit"
                className="w-full bg-primary text-white font-bold py-3 rounded-xl shadow-md flex items-center justify-center gap-2 mt-4"
              >
                <Check className="w-5 h-5" /> Save Product
              </button>
            </form>
          </div>
        </div>
      )}
    </motion.div>
  );
};
