import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, Minus, Plus, Trash2, ShoppingBag, QrCode, MessageCircle, Tag } from "lucide-react";
import { inr } from "../api";
import { useStore } from "../store";

const COUPONS = { EVERYDAY10: { type: "pct", value: 10 }, WELCOME50: { type: "flat", value: 50 } };

export default function CartDrawer({ onCheckout }) {
  const { cart, cartOpen, setCartOpen, update, remove } = useStore();
  const [coupon, setCoupon] = useState("");
  const [applied, setApplied] = useState(null);
  const [msg, setMsg] = useState("");

  const discount = applied
    ? applied.type === "pct"
      ? Math.round((cart.subtotal * applied.value) / 100)
      : Math.min(applied.value, cart.subtotal)
    : 0;
  const total = Math.max(0, cart.subtotal - discount) + cart.shipping;
  const remaining = cart.free_ship_threshold - cart.subtotal;
  const progress = Math.min(100, (cart.subtotal / cart.free_ship_threshold) * 100);

  const applyCoupon = () => {
    const code = coupon.trim().toUpperCase();
    if (COUPONS[code]) {
      setApplied({ code, ...COUPONS[code] });
      setMsg(`Coupon ${code} applied!`);
    } else {
      setApplied(null);
      setMsg("Invalid coupon code");
    }
  };

  return (
    <AnimatePresence>
      {cartOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setCartOpen(false)}
          className="fixed inset-0 z-50 bg-ink/50 backdrop-blur-sm"
        >
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 34 }}
            onClick={(e) => e.stopPropagation()}
            data-testid="cart-drawer"
            className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-sand shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-borderline px-5 py-4">
              <h3 className="flex items-center gap-2 font-serif text-xl font-semibold text-ink">
                <ShoppingBag className="h-5 w-5 text-terracotta" /> Your Cart ({cart.count})
              </h3>
              <button onClick={() => setCartOpen(false)} data-testid="cart-close-button" className="rounded-full p-2 hover:bg-cream">
                <X className="h-5 w-5" />
              </button>
            </div>

            {cart.items.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-cream">
                  <ShoppingBag className="h-9 w-9 text-muted" />
                </div>
                <p className="text-stoney">Your cart is empty. Discover something you'll love.</p>
                <button
                  onClick={() => setCartOpen(false)}
                  className="rounded-full bg-terracotta px-6 py-2.5 text-sm font-semibold text-sand hover:bg-terracottadark"
                >
                  Start shopping
                </button>
              </div>
            ) : (
              <>
                <div className="border-b border-borderline bg-cream px-5 py-3">
                  {remaining > 0 ? (
                    <p className="text-xs font-medium text-stoney">
                      Add <span className="font-bold text-terracotta">{inr(remaining)}</span> more for FREE shipping
                    </p>
                  ) : (
                    <p className="text-xs font-bold text-sage">🎉 You've unlocked FREE shipping!</p>
                  )}
                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-borderline">
                    <div className="h-full rounded-full bg-sage transition-all duration-500" style={{ width: `${progress}%` }} />
                  </div>
                </div>

                <div className="flex-1 space-y-3 overflow-y-auto px-5 py-4">
                  {cart.items.map((item) => (
                    <div key={item.id} data-testid="cart-item-row" className="flex gap-3 rounded-2xl border border-borderline bg-surface p-3">
                      <img
                        src={item.image}
                        alt={item.name}
                        onError={(e) => (e.currentTarget.src = "https://placehold.co/120x120/F4EFE6/C85A32?text=EF")}
                        className="h-20 w-20 shrink-0 rounded-xl object-cover"
                      />
                      <div className="flex flex-1 flex-col">
                        <p className="line-clamp-2 text-sm font-semibold text-ink">{item.name}</p>
                        <div className="mt-1 text-sm font-bold text-terracotta">{inr(item.price)}</div>
                        <div className="mt-auto flex items-center justify-between">
                          <div className="flex items-center rounded-full border border-borderline">
                            <button onClick={() => update(item.id, item.quantity - 1)} className="p-1.5" data-testid="cart-item-decrease">
                              <Minus className="h-3.5 w-3.5" />
                            </button>
                            <span className="w-7 text-center text-sm font-semibold">{item.quantity}</span>
                            <button onClick={() => update(item.id, item.quantity + 1)} className="p-1.5" data-testid="cart-item-increase">
                              <Plus className="h-3.5 w-3.5" />
                            </button>
                          </div>
                          <button onClick={() => remove(item.id)} className="rounded-full p-1.5 text-muted hover:text-terracotta" data-testid="cart-item-remove">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-3 border-t border-borderline bg-surface px-5 py-4">
                  <div className="flex gap-2">
                    <div className="flex flex-1 items-center rounded-full border border-borderline bg-cream px-3">
                      <Tag className="h-4 w-4 text-muted" />
                      <input
                        data-testid="cart-coupon-input"
                        value={coupon}
                        onChange={(e) => setCoupon(e.target.value)}
                        placeholder="Coupon (try EVERYDAY10)"
                        className="w-full bg-transparent px-2 py-2 text-sm outline-none"
                      />
                    </div>
                    <button onClick={applyCoupon} data-testid="cart-apply-coupon" className="rounded-full bg-ink px-4 text-sm font-semibold text-sand">
                      Apply
                    </button>
                  </div>
                  {msg && <p className={`text-xs ${applied ? "text-sage" : "text-terracotta"}`}>{msg}</p>}

                  <div className="space-y-1.5 text-sm">
                    <Row label="Subtotal" value={inr(cart.subtotal)} testid="cart-subtotal-amount" />
                    {discount > 0 && <Row label={`Discount (${applied.code})`} value={`- ${inr(discount)}`} accent />}
                    <Row label="Shipping" value={cart.shipping === 0 ? "FREE" : inr(cart.shipping)} />
                    <div className="flex items-center justify-between border-t border-borderline pt-2 text-base font-bold text-ink">
                      <span>Total</span>
                      <span data-testid="cart-total-amount" className="font-serif text-xl">{inr(total)}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => onCheckout("upi", { discount, coupon: applied?.code, total })}
                    data-testid="cart-upi-checkout-button"
                    className="flex w-full items-center justify-center gap-2 rounded-full bg-terracotta py-3.5 text-sm font-semibold text-sand transition-colors hover:bg-terracottadark active:scale-95"
                  >
                    <QrCode className="h-4 w-4" /> Pay with UPI QR
                  </button>
                  <button
                    onClick={() => onCheckout("whatsapp", { discount, coupon: applied?.code, total })}
                    data-testid="cart-whatsapp-checkout-button"
                    className="flex w-full items-center justify-center gap-2 rounded-full border border-sage py-3.5 text-sm font-semibold text-sage transition-colors hover:bg-sage hover:text-sand"
                  >
                    <MessageCircle className="h-4 w-4" /> Checkout on WhatsApp
                  </button>
                </div>
              </>
            )}
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Row({ label, value, accent, testid }) {
  return (
    <div className="flex items-center justify-between text-stoney">
      <span>{label}</span>
      <span data-testid={testid} className={accent ? "font-semibold text-sage" : "font-semibold text-ink"}>
        {value}
      </span>
    </div>
  );
}
