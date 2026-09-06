import React from "react";
import { Truck, ShieldCheck, RotateCcw, BadgeIndianRupee } from "lucide-react";

const ITEMS = [
  { icon: Truck, title: "Free Shipping", sub: "On orders over ₹799", testid: "trust-badge-free-shipping" },
  { icon: BadgeIndianRupee, title: "Cash on Delivery", sub: "Available across India", testid: "trust-badge-cod" },
  { icon: ShieldCheck, title: "Quality Checked", sub: "Every item inspected", testid: "trust-badge-quality" },
  { icon: RotateCcw, title: "7-Day Replacement", sub: "Hassle-free returns", testid: "trust-badge-returns" },
];

export default function TrustBar() {
  return (
    <section className="border-y border-borderline bg-cream">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-4 py-8 sm:px-6 lg:grid-cols-4 lg:px-8">
        {ITEMS.map((it) => (
          <div key={it.title} data-testid={it.testid} className="flex items-center gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-surface text-terracotta shadow-sm">
              <it.icon className="h-5 w-5" />
            </span>
            <div>
              <div className="text-sm font-bold text-ink">{it.title}</div>
              <div className="text-xs text-muted">{it.sub}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
