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
  // Ensure safe fallback arrays for categories and products
  const safeCategories = Array.isArray(categories) ? categories : [];
  const safeProducts = Array.isArray(products) ? products : [];

  const pills = [{ slug: "all", label: "All Finds" }, ...safeCategories];

  return (
    <section id="catalog" className="mx-auto max-w-7xl scroll-mt-24 px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <span className="text-xs font-semibold uppercase tracking-widest text-terracotta">
            The Collection
          </span>
          <h2 className="mt-2 font-serif text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
            Shop everyday finds
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-sm text-muted">Sort</label>
          <select
            data-testid="catalog-sort-select"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="rounded-full border border-borderline bg-surface px-4 py-2 text-sm font-medium text-ink outline-none focus:border-terracotta"
          >
            {SORTS.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mb-8 flex flex-wrap gap-2.5">
        {(pills || []).map((c) => (
          <button
            key={c.slug}
            data-testid={`category-pill-${c.slug}`}
            onClick={() => setCategory(c.slug)}
            className={`rounded-full border px-5 py-2 text-sm font-semibold transition-all ${
              category === c.slug
                ? "border-ink bg-ink text-sand"
                : "border-borderline bg-surface text-stoney hover:border-terracotta hover:text-terracotta"
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="aspect-[3/4] animate-pulse rounded-2xl bg-cream" />
          ))}
        </div>
      ) : safeProducts.length === 0 ? (
        <div className="rounded-2xl border border-borderline bg-surface py-20 text-center text-stoney">
          No finds match your search. Try another keyword.
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
          {safeProducts.map((p, i) => (
            <ProductCard key={p.id || i} product={p} index={i} onQuickView={onQuickView} />
          ))}
        </div>
      )}
    </section>
  );
}