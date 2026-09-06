import React from "react";
import { Instagram, Facebook, Twitter, MessageCircle } from "lucide-react";

export default function Footer({ config, onOpenTracker }) {
  const num = config?.whatsapp_number || "919650858890";
  return (
    <footer className="border-t border-borderline bg-sand">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-14 sm:px-6 md:grid-cols-4 lg:px-8">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-terracotta font-serif text-xl font-bold text-sand">E</span>
            <span className="font-serif text-2xl font-semibold text-ink">Everyday<span className="text-terracotta">Finds</span></span>
          </div>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-stoney">
            Thoughtfully crafted everyday goods for modern Indian homes. Gadgets, home essentials and jewellery —
            quality you can feel.
          </p>
          <div className="mt-5 flex gap-3">
            {[Instagram, Facebook, Twitter].map((Icon, i) => (
              <a key={i} href="#top" className="flex h-10 w-10 items-center justify-center rounded-full border border-borderline text-stoney transition-colors hover:border-terracotta hover:text-terracotta">
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>
        <div>
          <h4 className="font-serif text-lg font-semibold text-ink">Shop</h4>
          <ul className="mt-4 space-y-2 text-sm text-stoney">
            <li><a href="#catalog" className="hover:text-terracotta">All Finds</a></li>
            <li><a href="#bestsellers" className="hover:text-terracotta">Bestsellers</a></li>
            <li><a href="#reviews" className="hover:text-terracotta">Reviews</a></li>
            <li><button onClick={onOpenTracker} className="hover:text-terracotta" data-testid="footer-track-order">Track Order</button></li>
          </ul>
        </div>
        <div>
          <h4 className="font-serif text-lg font-semibold text-ink">Help</h4>
          <ul className="mt-4 space-y-2 text-sm text-stoney">
            <li>Free shipping over ₹799</li>
            <li>7-day easy replacement</li>
            <li>Cash on delivery</li>
            <li>
              <a href={`https://wa.me/${num}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-sage hover:underline">
                <MessageCircle className="h-3.5 w-3.5" /> Chat on WhatsApp
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-borderline py-5 text-center text-xs text-muted">
        © {new Date().getFullYear()} EverydayFinds. Made with care in India. Prices in ₹ INR.
      </div>
    </footer>
  );
}
