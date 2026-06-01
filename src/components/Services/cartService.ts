import { apiFetch } from "./apiClient";
import type { CartItem } from "../types";

const getAuthHeaders = (token: string) => ({
  Authorization: `Bearer ${token}`,
});

export const getCart = (token: string) => {
  return apiFetch<CartItem[]>("cart", {
    headers: getAuthHeaders(token),
  });
};

export const addToCart = (
  token: string,
  productId: string | number,
  quantity: number
) => {
  return apiFetch<CartItem[]>("cart/add", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(token),
    },
    body: JSON.stringify({
      productId,
      quantity,
    }),
  });
};

export const deleteCartItem = (token: string, productId: string | number) => {
  return apiFetch<CartItem[]>(`cart/${productId}`, {
    method: "DELETE",
    headers: getAuthHeaders(token),
  });
};