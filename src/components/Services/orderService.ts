import { apiFetch } from "./apiClient";
import type { Order } from "../types";

const getAuthHeaders = (token: string) => ({
  Authorization: `Bearer ${token}`,
});

interface PlaceOrderPayload {
  paymentMethod: string;
}

export const getMyOrders = (token: string) => {
  return apiFetch<Order[]>("orders/my", {
    headers: getAuthHeaders(token),
  });
};

export const placeOrder = (
  token: string,
  payload: PlaceOrderPayload = { paymentMethod: "COD" }
) => {
  return apiFetch<Order>("orders", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(token),
    },
    body: JSON.stringify(payload),
  });
};