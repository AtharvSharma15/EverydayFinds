import React from "react";
import { motion } from "framer-motion";
import { Star, Eye, Plus } from "lucide-react";
import { inr } from "../api";
import { useStore } from "../store";

export default function ProductCard({ product, index = 0, onQuickView }) {
  const { add, justAdded } = useStore();
  
  // Safe math fallbacks to avoid NaN
  const mrp = product?.mrp || 0;
  const price = product?.price || 0;
  const discount = mrp > 0 ? Math.round(((mrp - price) / mrp) * 100) : 0;
  const added = justAdded === product?.id;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.45, delay: (index % 4) * 0.06 }}
      data-testid="product-card"
      className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-borderline bg-surface transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-ink/5"
    >
      <div>
        {/* Image & Overlay Badges */}
        <div className="relative aspect-square overflow-hidden bg-cream">
          <img
            src={product?.image}
            alt={product?.name || "Product"}
            loading="lazy"
            onError={(e) => {
              e.currentTarget.src = `https://placehold.co/600x600/F4EFE6/C85A32?text=${encodeURIComponent(
                "EverydayFinds"
              )}`;
            }}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />

          {/* Badges: Tightened padding & positioning for mobile */}
          {product?.badge && (
            <span className="absolute left-1.5 top-1.5 rounded-full bg-ink/85 px-2 py-0.5 text-[9px] font-semibold text-sand backdrop-blur sm:left-3 sm:top-3 sm:px-2.5 sm:py-1 sm:text-[11px]">
              {product.badge}
            </span>
          )}

          {discount > 0 && (
            <span className="absolute right-1.5 top-1.5 rounded-full bg-terracotta px-2 py-0.5 text-[9px] font-bold text-sand sm:right-3 sm:top-3 sm:px-2.5 sm:py-1 sm:text-[11px]">
              {discount}% OFF
            </span>
          )}

          {/* Quick View Button: Scaled down for mobile */}
          <button
            onClick={() => onQuickView(product)}
            data-testid="product-quick-view-button"
            className="absolute inset-x-2 bottom-2 flex translate-y-3 items-center justify-center gap-1.5 rounded-full border border-white/50 bg-white/80 py-1.5 text-xs font-semibold text-ink opacity-0 backdrop-blur-md transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 sm:inset-x-3 sm:bottom-3 sm:gap-2 sm:py-2 sm:text-sm"
          >
            <Eye className="h-3.5 w-3.5 sm:h-4 sm:w-4" /> Quick view
          </button>
        </div>

        {/* Content Section: Scaled padding and typography */}
        <div className="flex flex-col p-2.5 sm:p-4">
          <div className="mb-1 flex items-center gap-1 text-[11px] text-muted sm:text-xs">
            <Star className="h-3 w-3 fill-amberglow text-amberglow sm:h-3.5 sm:w-3.5" />
            <span className="font-semibold text-stoney">{product?.rating || 4.8}</span>
            <span>({Number(product?.reviews || 0).toLocaleString("en-IN")})</span>
          </div>

          <h3
            data-testid="product-title"
            className="line-clamp-2 font-serif text-xs font-semibold leading-snug text-ink sm:text-base"
          >
            {product?.name}
          </h3>
        </div>
      </div>

      {/* Footer / Price & Add to Cart */}
      <div className="flex items-end justify-between p-2.5 pt-0 sm:p-4 sm:pt-0">
        <div className="flex flex-col sm:flex-row sm:items-baseline sm:gap-1.5">
          <span
            data-testid="product-price"
            className="font-serif text-sm font-bold text-ink sm:text-lg"
          >
            {inr(product?.price)}
          </span>
          {mrp > price && (
            <span className="text-[10px] text-muted line-through sm:text-xs">
              {inr(mrp)}
            </span>
          )}
        </div>

        <button
          onClick={() => add(product)}
          data-testid="product-add-to-cart-button"
          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sand transition-all active:scale-90 sm:h-10 sm:w-10 ${
            added ? "bg-sage" : "bg-terracotta hover:bg-terracottadark"
          }`}
          aria-label="Add to cart"
        >
          <Plus className="h-4 w-4 sm:h-5 sm:w-5" />
        </button>
      </div>
    </motion.div>
  );
}