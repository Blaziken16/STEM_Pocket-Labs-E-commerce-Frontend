import { apiFetch } from './client';
import { CartItem } from '../types';

const mapCartItem = (raw: any): CartItem => ({
  id: String(raw.itemId),
  productId: String(raw.productId),
  quantity: raw.quantity,
  product: raw.product ? {
    id: String(raw.product.id),
    name: raw.product.name,
    price: raw.product.price,
    description: raw.product.description,
    category: raw.product.category,
    stock: raw.product.stock,
    image: raw.product.image_url,
  } : undefined,
});

export const getCart = async (): Promise<CartItem[]> => {
  const data = await apiFetch('/cart');
  return data.map(mapCartItem);
};

export const addToCart = async (productId: string, quantity: number): Promise<CartItem[]> => {
  const data = await apiFetch('/cart/add', {
    method: 'POST',
    body: JSON.stringify({ productId: parseInt(productId, 10), quantity }),
  });
  return data.map(mapCartItem);
};

export const removeCartItem = async (itemId: string): Promise<CartItem[]> => {
  const data = await apiFetch(`/cart/${itemId}`, {
    method: 'DELETE',
  });
  return data.map(mapCartItem);
};
