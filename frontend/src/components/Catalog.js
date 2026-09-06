import React from "react";
import ProductCard from "./ProductCard";

const SORTS = [
  { value: "", label: "Featured" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "rating", label: "Top Rated" },
  { value: "discount", label: "Biggest Discount" },
];

export default function Catalog({
  products = [],
  categories = [],
  category,
  setCategory,
  sort,
  setSort,
  loading,
  onQuickView,
}) {
  const safeCategories = Array.isArray(categories) ? categories : [];
  const safeProducts = Array.isArray(products) ? products : [];

  const pills = [{ slug: "all", label: "All Finds" }, ...safeCategories];

  return (
    <section id="catalog" className="mx-auto max-w-7xl scroll-mt-24 px-3 py-10 sm:px-6 sm:py-16 lg:px-8">
      {/* Header Section */}
      <div className="mb-6 flex flex-col gap-3 sm:mb-8 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <span className="text-xs font-semibold uppercase tracking-widest text-terracotta">
            The Collection
          </span>
          <h2 className="mt-1 font-serif text-2xl font-semibold tracking-tight text-ink sm:mt-2 sm:text-4xl">
            Shop everyday finds
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-xs text-muted sm:text-sm">Sort</label>
          <select
            data-testid="catalog-sort-select"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="rounded-full border border-borderline bg-surface px-3 py-1.5 text-xs font-medium text-ink outline-none focus:border-terracotta sm:px-4 sm:py-2 sm:text-sm"
          >
            {SORTS.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Category Pills: Horizontal Scroll on Mobile, Wrapped on Desktop */}
      <div className="-mx-3 mb-6 flex overflow-x-auto px-3 pb-2 pt-1 no-scrollbar sm:mx-0 sm:mb-8 sm:flex-wrap sm:gap-2.5 sm:px-0">
        <div className="flex gap-2 sm:flex-wrap sm:gap-2.5">
          {(pills || []).map((c) => (
            <button
              key={c.slug}
              data-testid={`category-pill-${c.slug}`}
              onClick={() => setCategory(c.slug)}
              className={`whitespace-nowrap rounded-full border px-4 py-1.5 text-xs font-semibold transition-all sm:px-5 sm:py-2 sm:text-sm ${
                category === c.slug
                  ? "border-ink bg-ink text-sand"
                  : "border-borderline bg-surface text-stoney hover:border-terracotta hover:text-terracotta"
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* Product Grid: Tighter gap on mobile (gap-2.5) */}
      {loading ? (
        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="aspect-[3/4] animate-pulse rounded-2xl bg-cream" />
          ))}
        </div>
      ) : safeProducts.length === 0 ? (
        <div className="rounded-2xl border border-borderline bg-surface py-16 text-center text-sm text-stoney sm:py-20 sm:text-base">
          No finds match your search. Try another keyword.
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4">
          {safeProducts.map((p, i) => (
            <ProductCard key={p.id || i} product={p} index={i} onQuickView={onQuickView} />
          ))}
        </div>
      )}
    </section>
  );
}