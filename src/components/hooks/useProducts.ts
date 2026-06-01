import { useCallback, useEffect, useState } from "react";
import type { Product } from "../types";
import { getProducts } from "../services/productService";

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [productsError, setProductsError] = useState<string | null>(null);

  const loadProducts = useCallback(async () => {
    try {
      setProductsLoading(true);
      setProductsError(null);

      const data = await getProducts();
      setProducts(data);
    } catch (err: any) {
      console.error("Error fetching toys:", err);
      setProductsError(err.message || "Failed to load products");
    } finally {
      setProductsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  return {
    products,
    setProducts,
    productsLoading,
    productsError,
    reloadProducts: loadProducts,
  };
};