import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import * as api from "./api";

const StoreContext = createContext(null);
export const useStore = () => useContext(StoreContext);

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
  const [config, setConfig] = useState(null);
  const [cart, setCart] = useState({ items: [], count: 0, subtotal: 0, shipping: 0, total: 0, free_ship_threshold: 799 });
  const [cartOpen, setCartOpen] = useState(false);
  const [justAdded, setJustAdded] = useState(null);

  const refreshCart = useCallback(async () => {
    const data = await api.getCart(cartId);
    setCart(data);
  }, [cartId]);

  useEffect(() => {
    api.getConfig().then(setConfig).catch(() => {});
    refreshCart();
  }, [refreshCart]);

  const add = async (product, qty = 1) => {
    const data = await api.addToCart(cartId, product.id, qty);
    setCart(data);
    setJustAdded(product.id);
    setCartOpen(true);
    setTimeout(() => setJustAdded(null), 1500);
  };
  const update = async (pid, qty) => setCart(await api.updateCartItem(cartId, pid, qty));
  const remove = async (pid) => setCart(await api.removeCartItem(cartId, pid));
  const clear = async () => setCart(await api.clearCart(cartId));

  return (
    <StoreContext.Provider
      value={{ cartId, config, cart, refreshCart, add, update, remove, clear, cartOpen, setCartOpen, justAdded }}
    >
      {children}
    </StoreContext.Provider>
  );
}
