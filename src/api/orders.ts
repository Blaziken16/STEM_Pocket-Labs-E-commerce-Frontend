import { apiFetch } from './client';
import { Order } from '../types';

export interface PlaceOrderData {
  paymentMethod: string;
  address: {
    fullName: string;
    phoneNumber: string;
    streetAddress: string;
    city: string;
    state: string;
    zipCode: string;
    landmark?: string;
  };
  directItems?: Array<{ productId: string; quantity: number }>;
}

const mapOrder = (raw: any): Order => ({
  id: String(raw.orderId),
  date: raw.date || new Date().toLocaleDateString(),
  items: (raw.items || []).map((item: any) => ({
    productId: String(item.productId),
    name: item.name,
    quantity: item.quantity,
    pricePaid: item.pricePaid,
    image: item.image,
  })),
  total: raw.totalAmount,
  paymentMethod: raw.paymentMethod,
  paymentStatus: raw.paymentStatus,
  orderStatus: raw.orderStatus,
});

export const getOrders = async (): Promise<Order[]> => {
  const data = await apiFetch('/orders/my');
  return data.map(mapOrder);
};

export const placeOrder = async (orderData: PlaceOrderData): Promise<Order> => {
  const raw = await apiFetch('/orders', {
    method: 'POST',
    body: JSON.stringify(orderData),
  });
  return mapOrder(raw);
};

export const getAllOrders = async (): Promise<Order[]> => {
  const data = await apiFetch('/admin/orders');
  return data.map(mapOrder);
};

export const updateOrderStatus = async (orderId: string, status: string): Promise<void> => {
  await apiFetch(`/admin/orders/${orderId}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  });
};
