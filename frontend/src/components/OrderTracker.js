import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, PackageSearch, Check, Package, Truck, Home, Clipboard } from "lucide-react";
import { trackOrder, inr } from "../api";

const ICONS = [Clipboard, Package, Truck, Home];

export default function OrderTracker({ open, onClose }) {
  const [q, setQ] = useState("");
  const [order, setOrder] = useState(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const search = async () => {
    if (!q.trim()) return setError("Enter an Order ID or phone number");
    setBusy(true);
    setError("");
    setOrder(null);
    try {
      const res = await trackOrder(q.trim());
      setOrder(res);
    } catch {
      setError("No order found. Try order ID EF-89421 as a demo.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-[60] flex items-center justify-center bg-ink/60 p-4 backdrop-blur-sm"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            data-testid="order-tracker-modal"
            className="relative w-full max-w-md rounded-3xl bg-surface p-6 sm:p-7"
          >
            <button onClick={onClose} className="absolute right-4 top-4 rounded-full p-2 hover:bg-cream" data-testid="tracker-close">
              <X className="h-5 w-5" />
            </button>
            <h3 className="flex items-center gap-2 font-serif text-2xl font-semibold text-ink">
              <PackageSearch className="h-6 w-6 text-terracotta" /> Track your order
            </h3>
            <p className="mt-1 text-sm text-muted">Enter your Order ID or registered phone number.</p>

            <div className="mt-4 flex gap-2">
              <input
                data-testid="order-tracker-id-input"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && search()}
                placeholder="e.g. EF-89421"
                className="flex-1 rounded-xl border border-borderline bg-cream px-4 py-3 text-sm outline-none focus:border-terracotta"
              />
              <button
                onClick={search}
                disabled={busy}
                data-testid="order-tracker-search-button"
                className="rounded-xl bg-terracotta px-5 text-sm font-semibold text-sand hover:bg-terracottadark disabled:opacity-60"
              >
                {busy ? "..." : "Track"}
              </button>
            </div>
            {error && <p className="mt-3 text-sm font-medium text-terracotta">{error}</p>}

            {order && (
              <div className="mt-6" data-testid="order-tracker-status-stepper">
                <div className="mb-4 flex items-center justify-between rounded-xl bg-cream px-4 py-3">
                  <div>
                    <div className="font-mono text-sm font-bold text-terracotta">{order.order_id}</div>
                    <div className="text-xs text-muted">{order.customer_name}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-muted">Total</div>
                    <div className="font-serif text-lg font-bold text-ink">{inr(order.total)}</div>
                  </div>
                </div>
                <div className="space-y-1">
                  {order.steps.map((step, i) => {
                    const done = i <= order.current_step;
                    const Icon = ICONS[i] || Check;
                    return (
                      <div key={step} className="flex items-center gap-3">
                        <div className="flex flex-col items-center">
                          <span
                            className={`flex h-9 w-9 items-center justify-center rounded-full ${
                              done ? "bg-sage text-sand" : "bg-cream text-muted"
                            }`}
                          >
                            <Icon className="h-4 w-4" />
                          </span>
                          {i < order.steps.length - 1 && (
                            <span className={`h-6 w-0.5 ${i < order.current_step ? "bg-sage" : "bg-borderline"}`} />
                          )}
                        </div>
                        <div className={`pb-4 text-sm font-semibold ${done ? "text-ink" : "text-muted"}`}>
                          {step}
                          {i === order.current_step && <span className="ml-2 text-xs font-medium text-terracotta">• Current</span>}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
