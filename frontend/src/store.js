import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import * as api from "./api";

const StoreContext = createContext(null);
export const useStore = () => useContext(StoreContext);

const DEFAULT_CART = {
  items: [],
  count: 0,
  subtotal: 0,
  shipping: 0,
  total: 0,
  free_ship_threshold: 799,
};

const DEFAULT_CONFIG = {
  categories: [],
  upi_id: "9650858890@ybl",
  payee_name: "EverydayFinds",
  whatsapp_number: "919650858890",
  free_ship_threshold: 799,
};

function getCartId() {
  let id = localStorage.getItem("ef_cart_id");
  if (!id) {
    id = "cart-" + Math.random().toString(36).slice(2) + Date.now().toString(36);
    localStorage.setItem("ef_cart_id", id);
  }
  return id;
}

export function StoreProvider({ children }) {
  const [cartId] = useState(getCartId);
  const [config, setConfig] = useState(DEFAULT_CONFIG);
  const [cart, setCart] = useState(DEFAULT_CART);
  const [cartOpen, setCartOpen] = useState(false);
  const [justAdded, setJustAdded] = useState(null);

  // Helper to ensure cart object always maintains valid array properties
  const safeSetCart = (data) => {
    if (!data || typeof data !== "object") {
      setCart(DEFAULT_CART);
      return;
    }
    setCart({
      ...DEFAULT_CART,
      ...data,
      items: Array.isArray(data.items) ? data.items : [],
    });
  };

  const refreshCart = useCallback(async () => {
    try {
      const data = await api.getCart(cartId);
      safeSetCart(data);
    } catch (err) {
      console.error("Failed to refresh cart:", err);
      setCart(DEFAULT_CART);
    }
  }, [cartId]);

  useEffect(() => {
    api
      .getConfig()
      .then((data) => {
        if (data && typeof data === "object") {
          setConfig({
            ...DEFAULT_CONFIG,
            ...data,
            categories: Array.isArray(data.categories) ? data.categories : [],
          });
        }
      })
      .catch((err) => {
        console.error("Failed to load config:", err);
      });
    refreshCart();
  }, [refreshCart]);

  const add = async (product, qty = 1) => {
    try {
      const data = await api.addToCart(cartId, product.id, qty);
      safeSetCart(data);
      setJustAdded(product.id);
      setCartOpen(true);
      setTimeout(() => setJustAdded(null), 1500);
    } catch (err) {
      console.error("Failed to add to cart:", err);
    }
  };

  const update = async (pid, qty) => {
    try {
      const data = await api.updateCartItem(cartId, pid, qty);
      safeSetCart(data);
    } catch (err) {
      console.error("Failed to update cart item:", err);
    }
  };

  const remove = async (pid) => {
    try {
      const data = await api.removeCartItem(cartId, pid);
      safeSetCart(data);
    } catch (err) {
      console.error("Failed to remove cart item:", err);
    }
  };

  const clear = async () => {
    try {
      const data = await api.clearCart(cartId);
      safeSetCart(data);
    } catch (err) {
      console.error("Failed to clear cart:", err);
    }
  };

  return (
    <StoreContext.Provider
      value={{
        cartId,
        config,
        cart,
        refreshCart,
        add,
        update,
        remove,
        clear,
        cartOpen,
        setCartOpen,
        justAdded,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}