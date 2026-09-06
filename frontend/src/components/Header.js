import React, { useState } from "react";
import { ShoppingBag, Search, PackageSearch, Menu, X } from "lucide-react";
import { useStore } from "../store";

const NAV = [
  { label: "Shop", href: "#catalog" },
  { label: "Bestsellers", href: "#bestsellers" },
  { label: "Reviews", href: "#reviews" },
];

export default function Header({ onOpenTracker, onSearch, search }) {
  const { cart, setCartOpen } = useStore();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-borderline bg-sand/80 backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-7xl items-center gap-4 px-4 sm:px-6 lg:px-8">
        <a href="#top" data-testid="nav-logo" className="flex items-center gap-2 shrink-0">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-terracotta font-serif text-xl font-bold text-sand">
            E
          </span>
          <span className="font-serif text-2xl font-semibold tracking-tight text-ink">
            Everyday<span className="text-terracotta">Finds</span>
          </span>
        </a>

        <nav className="ml-6 hidden items-center gap-7 lg:flex">
          {NAV.map((n) => (
            <a
              key={n.label}
              href={n.href}
              data-testid={`nav-link-${n.label.toLowerCase()}`}
              className="text-sm font-medium text-stoney transition-colors hover:text-terracotta"
            >
              {n.label}
            </a>
          ))}
        </nav>

        <div className="ml-auto hidden items-center rounded-full border border-borderline bg-surface px-3 py-2 md:flex">
          <Search className="h-4 w-4 text-muted" />
          <input
            data-testid="nav-search-input"
            value={search}
            onChange={(e) => onSearch(e.target.value)}
            placeholder="Search finds..."
            className="w-40 bg-transparent px-2 text-sm outline-none placeholder:text-muted"
          />
        </div>

        <button
          data-testid="nav-order-tracker-link"
          onClick={onOpenTracker}
          className="hidden items-center gap-2 rounded-full px-3 py-2 text-sm font-medium text-stoney transition-colors hover:text-terracotta sm:flex"
        >
          <PackageSearch className="h-4 w-4" />
          Track
        </button>

        <button
          data-testid="nav-cart-trigger-button"
          onClick={() => setCartOpen(true)}
          className="relative flex items-center gap-2 rounded-full bg-ink px-4 py-2.5 text-sm font-semibold text-sand transition-transform hover:scale-105 active:scale-95"
        >
          <ShoppingBag className="h-4 w-4" />
          <span className="hidden sm:inline">Cart</span>
          {cart.count > 0 && (
            <span
              data-testid="cart-count-badge"
              className="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-terracotta px-1 text-xs font-bold text-sand"
            >
              {cart.count}
            </span>
          )}
        </button>

        <button className="lg:hidden" onClick={() => setMobileOpen((v) => !v)} data-testid="mobile-menu-toggle">
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="border-t border-borderline bg-sand px-4 py-4 lg:hidden">
          <div className="mb-3 flex items-center rounded-full border border-borderline bg-surface px-3 py-2">
            <Search className="h-4 w-4 text-muted" />
            <input
              value={search}
              onChange={(e) => onSearch(e.target.value)}
              placeholder="Search finds..."
              className="w-full bg-transparent px-2 text-sm outline-none"
            />
          </div>
          {NAV.map((n) => (
            <a
              key={n.label}
              href={n.href}
              onClick={() => setMobileOpen(false)}
              className="block py-2 text-base font-medium text-stoney"
            >
              {n.label}
            </a>
          ))}
          <button onClick={onOpenTracker} className="py-2 text-base font-medium text-stoney">
            Track Order
          </button>
        </div>
      )}
    </header>
  );
}
