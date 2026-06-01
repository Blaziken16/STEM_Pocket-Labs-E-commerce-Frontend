import { useCallback, useEffect, useState } from "react";
import type { CartItem, Order, Product } from "../types";
import { apiFetch } from "../services/apiClient";

type ToastType = "success" | "info" | "error";

interface UseShopDataParams {
  token: string | null;
  setCurrentScreen: React.Dispatch<
    React.SetStateAction<"welcome" | "browse" | "cart" | "detail" | "account" | "checkout">
  >;
  setCurrentCheckoutIndex: React.Dispatch<React.SetStateAction<number>>;
  triggerToast: (message: string, type?: ToastType) => void;
}

interface PlaceOrderAddress {
  fullName: string;
  phoneNumber: string;
  streetAddress: string;
  city: string;
  state: string;
  zipCode: string;
  landmark?: string;
}

export const useShopData = ({
  token,
  setCurrentScreen,
  setCurrentCheckoutIndex,
  triggerToast,
}: UseShopDataParams) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);

  const getAuthHeaders = useCallback(() => {
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
  }, [token]);

  const loadCart = useCallback(async () => {
    if (!token) {
      setCartItems([]);
      return;
    }

    try {
      const data = await apiFetch<CartItem[]>("/cart", {
        headers: getAuthHeaders(),
      });
      setCartItems(data);
    } catch (err) {
      console.error("Error fetching cart:", err);
    }
  }, [token, getAuthHeaders]);

  const loadOrders = useCallback(async () => {
    if (!token) {
      setOrders([]);
      return;
    }

    try {
      const data = await apiFetch<Order[]>("/orders/my", {
        headers: getAuthHeaders(),
      });
      setOrders(data);
    } catch (err) {
      console.error("Error fetching orders:", err);
    }
  }, [token, getAuthHeaders]);

  const loadShopData = useCallback(async () => {
    await Promise.all([loadCart(), loadOrders()]);
  }, [loadCart, loadOrders]);

  useEffect(() => {
    if (!token) {
      setCartItems([]);
      setOrders([]);
      return;
    }

    loadShopData();
  }, [token, loadShopData]);

  const addToCart = useCallback(
    async (productId: number | string, quantity: number = 1, redirectAfter = false) => {
      if (!token) {
        triggerToast("Please sign in to manage your cart.", "error");
        setCurrentScreen("welcome");
        return;
      }

      try {
        const data = await apiFetch<CartItem[]>("/cart/add", {
          method: "POST",
          headers: getAuthHeaders(),
          body: JSON.stringify({
            productId,
            quantity,
          }),
        });

        setCartItems(data);
        triggerToast("Added item to shopping cart!", "success");

        if (redirectAfter) {
          setCurrentScreen("cart");
        }
      } catch (err: any) {
        triggerToast(err.message || "Could not add to cart", "error");
      }
    },
    [token, getAuthHeaders, triggerToast, setCurrentScreen]
  );

  const deleteCartItem = useCallback(
    async (productId: number | string) => {
      if (!token) return;

      try {
        const data = await apiFetch<CartItem[]>(`/cart/${productId}`, {
          method: "DELETE",
          headers: getAuthHeaders(),
        });

        setCartItems(data);
        triggerToast("Item removed from cart.", "info");
      } catch (err: any) {
        triggerToast(err.message || "Could not delete item", "error");
      }
    },
    [token, getAuthHeaders, triggerToast]
  );

  const updateCartQuantity = useCallback(
    async (productId: number | string, currentQty: number, offset: number) => {
      const targetQty = currentQty + offset;

      if (targetQty <= 0) {
        await deleteCartItem(productId);
        return;
      }

      try {
        const data = await apiFetch<CartItem[]>("/cart/add", {
          method: "POST",
          headers: getAuthHeaders(),
          body: JSON.stringify({
            productId,
            quantity: offset,
          }),
        });

        setCartItems(data);
      } catch (err: any) {
        triggerToast(err.message || "Could not modify quantity", "error");
      }
    },
    [deleteCartItem, getAuthHeaders, triggerToast]
  );

  const buyNow = useCallback(
    async (product: Product) => {
      if (!token) {
        triggerToast("Please sign in to make a purchase.", "error");
        setCurrentScreen("welcome");
        return;
      }

      try {
        const data = await apiFetch<CartItem[]>("/cart/add", {
          method: "POST",
          headers: getAuthHeaders(),
          body: JSON.stringify({
            productId: product.id,
            quantity: 1,
          }),
        });

        setCartItems(data);
        setCurrentCheckoutIndex(0);
        setCurrentScreen("checkout");
        triggerToast("Item added to cart. Proceeding to checkout!", "success");
      } catch (err: any) {
        triggerToast(err.message || "Could not add item to cart", "error");
      }
    },
    [token, getAuthHeaders, triggerToast, setCurrentScreen, setCurrentCheckoutIndex]
  );

  const placeOrder = useCallback(
    async (_addressData: PlaceOrderAddress) => {
      try {
        const data = await apiFetch<Order>("/orders", {
          method: "POST",
          headers: getAuthHeaders(),
          body: JSON.stringify({
            paymentMethod: "COD",
          }),
        });

        setOrders((prev) => [data, ...prev]);
        setCartItems([]);
        setCurrentCheckoutIndex(0);
        setCurrentScreen("account");
        triggerToast("Order placed successfully! Cash On Delivery chosen.", "success");
      } catch (err: any) {
        triggerToast(err.message || "Checkout process failed", "error");
      }
    },
    [getAuthHeaders, triggerToast, setCurrentCheckoutIndex, setCurrentScreen]
  );

  return {
    cartItems,
    orders,
    setCartItems,
    setOrders,
    loadCart,
    loadOrders,
    loadShopData,
    addToCart,
    updateCartQuantity,
    deleteCartItem,
    buyNow,
    placeOrder,
  };
};