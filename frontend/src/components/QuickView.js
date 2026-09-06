import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, Star, Check, Minus, Plus, MessageCircle, ShoppingBag, Truck } from "lucide-react";
import { inr } from "../api";
import { useStore } from "../store";

export default function QuickView({ product, onClose }) {
  const { add, config } = useStore();
  const [qty, setQty] = useState(1);
  const [pin, setPin] = useState("");
  const [eta, setEta] = useState(null);

  const checkPin = () => {
    if (/^\d{6}$/.test(pin)) {
      const days = 3 + (parseInt(pin[5], 10) % 4);
      setEta(`Delivers in ${days}-${days + 2} days`);
    } else {
      setEta("Enter a valid 6-digit PIN code");
    }
  };

  const whatsappOrder = () => {
    const num = config?.whatsapp_number || "919650858890";
    const msg = `Hi EverydayFinds! 👋%0AI'd like to order:%0A*${product.name}*%0AQty: ${qty}%0APrice: ${inr(product.price)} each%0ATotal: ${inr(product.price * qty)}`;
    window.open(`https://wa.me/${num}?text=${msg}`, "_blank");
  };

  const discount = product ? Math.round(((product.mrp - product.price) / product.mrp) * 100) : 0;

  return (
    <AnimatePresence>
      {product && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink/50 p-4 backdrop-blur-sm"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 28 }}
            onClick={(e) => e.stopPropagation()}
            data-testid="product-detail-modal"
            className="relative grid max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-3xl bg-surface md:grid-cols-2"
          >
            <button
              onClick={onClose}
              data-testid="product-detail-close"
              className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/80 text-ink backdrop-blur transition-colors hover:bg-white"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="relative bg-cream">
              <img
                src={product.image}
                alt={product.name}
                onError={(e) => {
                  e.currentTarget.src = `https://placehold.co/700x700/F4EFE6/C85A32?text=EverydayFinds`;
                }}
                className="h-64 w-full object-cover md:h-full"
              />
              {discount > 0 && (
                <span className="absolute left-4 top-4 rounded-full bg-terracotta px-3 py-1 text-xs font-bold text-sand">
                  {discount}% OFF
                </span>
              )}
            </div>

            <div className="flex flex-col p-6 sm:p-8">
              <div className="mb-2 flex items-center gap-1 text-sm text-muted">
                <Star className="h-4 w-4 fill-amberglow text-amberglow" />
                <span className="font-semibold text-stoney">{product.rating}</span>
                <span>({product.reviews.toLocaleString("en-IN")} reviews)</span>
              </div>
              <h2 className="font-serif text-2xl font-semibold leading-tight text-ink">{product.name}</h2>
              <div className="mt-3 flex items-center gap-3">
                <span className="font-serif text-3xl font-bold text-ink">{inr(product.price)}</span>
                <span className="text-lg text-muted line-through">{inr(product.mrp)}</span>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-stoney">{product.description}</p>

              <ul className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
                {(product.features || []).map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-stoney">
                    <Check className="h-4 w-4 shrink-0 text-sage" /> {f}
                  </li>
                ))}
              </ul>

              <div className="mt-5">
                <div className="flex gap-2">
                  <div className="flex items-center rounded-full border border-borderline bg-cream px-2">
                    <MapTruck />
                    <input
                      data-testid="product-detail-pin-check-input"
                      value={pin}
                      onChange={(e) => setPin(e.target.value.replace(/\D/g, "").slice(0, 6))}
                      placeholder="Delivery PIN"
                      className="w-28 bg-transparent px-2 py-2 text-sm outline-none"
                    />
                  </div>
                  <button
                    onClick={checkPin}
                    className="rounded-full border border-sage px-4 text-sm font-semibold text-sage transition-colors hover:bg-sage hover:text-sand"
                  >
                    Check
                  </button>
                </div>
                {eta && <p className="mt-2 text-xs font-medium text-sage">{eta}</p>}
              </div>

              <div className="mt-5 flex items-center gap-4">
                <div className="flex items-center rounded-full border border-borderline">
                  <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="p-2.5" data-testid="qv-qty-minus">
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="w-8 text-center font-semibold" data-testid="qv-qty-value">
                    {qty}
                  </span>
                  <button onClick={() => setQty((q) => q + 1)} className="p-2.5" data-testid="qv-qty-plus">
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                <span className="text-sm text-muted">
                  Subtotal <span className="font-bold text-ink">{inr(product.price * qty)}</span>
                </span>
              </div>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <button
                  onClick={() => {
                    add(product, qty);
                    onClose();
                  }}
                  data-testid="product-detail-add-to-cart-button"
                  className="flex flex-1 items-center justify-center gap-2 rounded-full bg-terracotta px-6 py-3.5 text-sm font-semibold text-sand transition-colors hover:bg-terracottadark active:scale-95"
                >
                  <ShoppingBag className="h-4 w-4" /> Add to Cart
                </button>
                <button
                  onClick={whatsappOrder}
                  data-testid="product-detail-whatsapp-order-button"
                  className="flex flex-1 items-center justify-center gap-2 rounded-full border border-sage px-6 py-3.5 text-sm font-semibold text-sage transition-colors hover:bg-sage hover:text-sand"
                >
                  <MessageCircle className="h-4 w-4" /> Order on WhatsApp
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function MapTruck() {
  return <Truck className="ml-1 h-4 w-4 text-muted" />;
}
