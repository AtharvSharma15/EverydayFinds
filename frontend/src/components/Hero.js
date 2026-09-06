import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, Star, MessageCircle } from "lucide-react";

export default function Hero({ config, onWhatsApp }) {
  return (
    <section id="top" className="grain-bg relative overflow-hidden">
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-14 sm:px-6 lg:grid-cols-2 lg:gap-8 lg:py-20 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-borderline bg-surface px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-tagtext">
            <span className="h-1.5 w-1.5 rounded-full bg-sage" /> Useful products for everyday life
          </span>
          <h1
            data-testid="hero-headline"
            className="mt-6 font-serif text-4xl font-semibold leading-[1.08] tracking-tight text-ink text-balance sm:text-5xl lg:text-6xl"
          >
            Everyday goods,
            <br />
            <span className="text-terracotta italic">beautifully</span> made.
          </h1>
          <p className="mt-5 max-w-md text-base leading-relaxed text-stoney sm:text-lg">
            Handpicked gadgets, home essentials and jewellery for modern Indian homes — quality you can feel,
            prices that make sense.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a
              href="#catalog"
              data-testid="hero-shop-collection-button"
              className="group inline-flex items-center gap-2 rounded-full bg-terracotta px-7 py-3.5 text-sm font-semibold text-sand shadow-lg shadow-terracotta/20 transition-all hover:bg-terracottadark hover:shadow-terracotta/30 active:scale-95"
            >
              Shop the collection
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </a>
            <button
              onClick={onWhatsApp}
              data-testid="hero-whatsapp-inquiry-button"
              className="inline-flex items-center gap-2 rounded-full border border-sage px-6 py-3.5 text-sm font-semibold text-sage transition-colors hover:bg-sage hover:text-sand"
            >
              <MessageCircle className="h-4 w-4" /> Order on WhatsApp
            </button>
          </div>

          <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
            <Stat value="50,000+" label="Happy homes" />
            <div className="hidden h-10 w-px bg-borderline sm:block" />
            <div>
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-amberglow text-amberglow" />
                ))}
                <span className="ml-1 font-serif text-xl font-semibold text-ink">4.9</span>
              </div>
              <div className="text-sm text-muted">Rated by shoppers</div>
            </div>
            <div className="hidden h-10 w-px bg-borderline sm:block" />
            <Stat value="7-Day" label="Easy replacement" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.15 }}
          className="relative"
          data-testid="hero-featured-image"
        >
          <div className="relative overflow-hidden rounded-[2rem] border border-borderline bg-cream shadow-2xl shadow-ink/10">
            <img
              src="https://images.unsplash.com/photo-1615876234886-fd9a39fda97f?crop=entropy&cs=srgb&fm=jpg&q=85&w=1000"
              alt="Warm home interior"
              className="h-[380px] w-full object-cover sm:h-[500px]"
            />
            <div className="absolute inset-x-4 bottom-4 flex items-center justify-between rounded-2xl border border-white/40 bg-white/70 px-5 py-4 backdrop-blur-md">
              <div>
                <div className="font-serif text-lg font-semibold text-ink">Curated for your everyday</div>
                <div className="text-sm text-stoney">Gadgets · Home · Jewellery</div>
              </div>
              <span className="rounded-full bg-terracotta px-3 py-1 text-xs font-bold text-sand">Up to 50% off</span>
            </div>
          </div>
          <div className="absolute -left-4 top-8 hidden rotate-[-6deg] rounded-2xl border border-borderline bg-surface px-4 py-3 shadow-xl sm:block">
            <div className="text-xs font-semibold uppercase tracking-wider text-sage">Free shipping</div>
            <div className="text-sm text-stoney">on orders over ₹{config?.free_ship_threshold || 799}</div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function Stat({ value, label }) {
  return (
    <div>
      <div className="font-serif text-2xl font-semibold text-ink">{value}</div>
      <div className="text-sm text-muted">{label}</div>
    </div>
  );
}
