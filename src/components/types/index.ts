export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  category: string;
  stock: number;
  image: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  isPremium: boolean;
  memberSince: string;
}

export interface CartItem {
  id: string;
  productId: string;
  quantity: number;
  product?: Product;
}

export type OrderStatus = 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
export type PaymentStatus = 'PENDING' | 'SUCCESSFUL';

export interface OrderItem {
  productId: string;
  name: string;
  quantity: number;
  pricePaid: number;
  image: string;
}

export interface Order {
  id: string;
  date: string;
  items: OrderItem[];
  total: number;
  paymentMethod: 'COD';
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  address?: {
    fullName: string;
    phoneNumber: string;
    streetAddress: string;
    city: string;
    state: string;
    zipCode: string;
    landmark?: string;
  };
}
