import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from "react";
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

// Recompute totals locally so the UI can update instantly, without
// waiting for the server round-trip.
function recomputeTotals(items) {
  const subtotal = items.reduce((sum, it) => sum + it.price * it.quantity, 0);
  const count = items.reduce((sum, it) => sum + it.quantity, 0);
  return { subtotal, count, shipping: 0, total: subtotal };
}

export function StoreProvider({ children }) {
  const [cartId] = useState(getCartId);
  const [config, setConfig] = useState(DEFAULT_CONFIG);
  const [cart, setCart] = useState(DEFAULT_CART);
  const [cartOpen, setCartOpen] = useState(false);
  const [justAdded, setJustAdded] = useState(null);

  // Holds pending debounce timers per product id, so rapid clicks on the
  // same item collapse into a single network request instead of one per click.
  const updateTimers = useRef({});

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

  // FIX: no longer opens the cart drawer on every click, and updates the
  // UI instantly instead of waiting for the (possibly slow) server response.
  const add = (product, qty = 1) => {
    setCart((prev) => {
      const existing = prev.items.find((it) => it.id === product.id);
      let items;
      if (existing) {
        items = prev.items.map((it) =>
          it.id === product.id ? { ...it, quantity: it.quantity + qty } : it
        );
      } else {
        items = [...prev.items, { ...product, quantity: qty }];
      }
      return { ...prev, items, ...recomputeTotals(items) };
    });

    setJustAdded(product.id);
    setTimeout(() => setJustAdded(null), 1500);

    // Sync with the server quietly in the background — the person doesn't
    // need to wait for this, or see the cart pop open, to keep browsing.
    api
      .addToCart(cartId, product.id, qty)
      .then((data) => safeSetCart(data))
      .catch((err) => {
        console.error("Failed to add to cart:", err);
        refreshCart();
      });
  };

  // FIX: optimistic + debounced update. The visible quantity/total change
  // instantly on every click; the actual server sync only fires 400ms after
  // the last click on that same item, so rapid clicking sends one request
  // instead of many, and the UI never has to "wait" or "catch up."
  const update = (pid, qty) => {
    setCart((prev) => {
      let items;
      if (qty <= 0) {
        items = prev.items.filter((it) => it.id !== pid);
      } else {
        items = prev.items.map((it) => (it.id === pid ? { ...it, quantity: qty } : it));
      }
      return { ...prev, items, ...recomputeTotals(items) };
    });

    if (updateTimers.current[pid]) {
      clearTimeout(updateTimers.current[pid]);
    }
    updateTimers.current[pid] = setTimeout(async () => {
      try {
        const data = await api.updateCartItem(cartId, pid, qty);
        safeSetCart(data);
      } catch (err) {
        console.error("Failed to update cart item:", err);
        // Re-sync with the server truth if the optimistic update drifted
        // due to a failed request.
        refreshCart();
      } finally {
        delete updateTimers.current[pid];
      }
    }, 400);
  };

  const remove = async (pid) => {
    // Optimistic removal too, for the same instant-feedback reason.
    setCart((prev) => {
      const items = prev.items.filter((it) => it.id !== pid);
      return { ...prev, items, ...recomputeTotals(items) };
    });
    if (updateTimers.current[pid]) {
      clearTimeout(updateTimers.current[pid]);
      delete updateTimers.current[pid];
    }
    try {
      const data = await api.removeCartItem(cartId, pid);
      safeSetCart(data);
    } catch (err) {
      console.error("Failed to remove cart item:", err);
      refreshCart();
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