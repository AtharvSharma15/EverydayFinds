import React from "react";
import ProductCard from "./ProductCard";

export default function Bestsellers({ products, onQuickView }) {
  const top = [...products].sort((a, b) => b.reviews - a.reviews).slice(0, 4);
  if (top.length === 0) return null;
  return (
    <section id="bestsellers" className="scroll-mt-24 bg-cream py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 text-center">
          <span className="text-xs font-semibold uppercase tracking-widest text-terracotta">Loved by thousands</span>
          <h2 className="mt-2 font-serif text-3xl font-semibold tracking-tight text-ink sm:text-4xl">This week's bestsellers</h2>
        </div>
        <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
          {top.map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} onQuickView={onQuickView} />
          ))}
        </div>
      </div>
    </section>
  );
}
