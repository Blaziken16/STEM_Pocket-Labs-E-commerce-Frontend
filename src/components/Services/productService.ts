import { apiFetch } from "./apiClient";
import type { Product } from "../types";

export const getProducts = () => {
  return apiFetch<Product[]>("products");
};