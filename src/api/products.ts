import { apiFetch } from './client';
import { Product } from '../types';

const mapProduct = (raw: any): Product => ({
  id: String(raw.id),
  name: raw.name,
  price: raw.price,
  description: raw.description,
  category: raw.category,
  stock: raw.stock,
  image: raw.image_url,
});

export const getProducts = async (): Promise<Product[]> => {
  const data = await apiFetch('/products');
  return data.map(mapProduct);
};

export const getProductById = async (id: string): Promise<Product> => {
  return await apiFetch(`/products/${id}`);
};

export const createProduct = async (data: Partial<Product>): Promise<Product> => {
  const { image, id, ...rest } = data;
  const payload = { ...rest, image_url: image };
  const result = await apiFetch('/products', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  return mapProduct(result);
};

export const updateProduct = async (id: string, data: Partial<Product>): Promise<Product> => {
  const { image, id: _id, ...rest } = data;
  const payload = { ...rest, image_url: image };
  const result = await apiFetch(`/products/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
  return mapProduct(result);
};

export const deleteProduct = async (id: string): Promise<void> => {
  await apiFetch(`/products/${id}`, {
    method: 'DELETE',
  });
};
