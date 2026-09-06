import React from "react";
import { motion } from "framer-motion";
import { Star, Eye, Plus } from "lucide-react";
import { inr } from "../api";
import { useStore } from "../store";

export default function ProductCard({ product, index = 0, onQuickView }) {
  const { add, justAdded } = useStore();
  const discount = Math.round(((product.mrp - product.price) / product.mrp) * 100);
  const added = justAdded === product.id;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.45, delay: (index % 4) * 0.06 }}
      data-testid="product-card"
      className="group flex flex-col overflow-hidden rounded-2xl border border-borderline bg-surface transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-ink/5"
    >
      <div className="relative aspect-square overflow-hidden bg-cream">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          onError={(e) => {
            e.currentTarget.src = `https://placehold.co/600x600/F4EFE6/C85A32?text=${encodeURIComponent("EverydayFinds")}`;
          }}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {product.badge && (
          <span className="absolute left-3 top-3 rounded-full bg-ink/85 px-2.5 py-1 text-[11px] font-semibold text-sand backdrop-blur">
            {product.badge}
          </span>
        )}
        {discount > 0 && (
          <span className="absolute right-3 top-3 rounded-full bg-terracotta px-2.5 py-1 text-[11px] font-bold text-sand">
            {discount}% OFF
          </span>
        )}
        <button
          onClick={() => onQuickView(product)}
          data-testid="product-quick-view-button"
          className="absolute inset-x-3 bottom-3 flex translate-y-3 items-center justify-center gap-2 rounded-full border border-white/50 bg-white/80 py-2 text-sm font-semibold text-ink opacity-0 backdrop-blur-md transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100"
        >
          <Eye className="h-4 w-4" /> Quick view
        </button>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <div className="mb-1 flex items-center gap-1 text-xs text-muted">
          <Star className="h-3.5 w-3.5 fill-amberglow text-amberglow" />
          <span className="font-semibold text-stoney">{product.rating}</span>
          <span>({product.reviews.toLocaleString("en-IN")})</span>
        </div>
        <h3 data-testid="product-title" className="line-clamp-2 font-serif text-lg font-semibold leading-snug text-ink">
          {product.name}
        </h3>
        <div className="mt-auto flex items-end justify-between pt-3">
          <div>
            <span data-testid="product-price" className="font-serif text-xl font-bold text-ink">
              {inr(product.price)}
            </span>
            <span className="ml-2 text-sm text-muted line-through">{inr(product.mrp)}</span>
          </div>
          <button
            onClick={() => add(product)}
            data-testid="product-add-to-cart-button"
            className={`flex h-10 w-10 items-center justify-center rounded-full text-sand transition-all active:scale-90 ${
              added ? "bg-sage" : "bg-terracotta hover:bg-terracottadark"
            }`}
            aria-label="Add to cart"
          >
            <Plus className="h-5 w-5" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
