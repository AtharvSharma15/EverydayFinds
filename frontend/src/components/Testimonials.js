import React from "react";
import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

const REVIEWS = [
  { name: "Priya M.", city: "Mumbai", text: "The wooden wall clock is stunning — looks way more premium than the price. Delivery was quick too!", rating: 5 },
  { name: "Rahul K.", city: "Delhi", text: "Ordered the storage rack and travel tumbler. Great quality and the WhatsApp ordering was super convenient.", rating: 5 },
  { name: "Sneha R.", city: "Bengaluru", text: "The butterfly necklace is gorgeous and got so many compliments. UPI payment was smooth and instant.", rating: 5 },
];

export default function Testimonials() {
  return (
    <section id="reviews" className="mx-auto max-w-7xl scroll-mt-24 px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-10 text-center">
        <span className="text-xs font-semibold uppercase tracking-widest text-terracotta">Happy homes</span>
        <h2 className="mt-2 font-serif text-3xl font-semibold tracking-tight text-ink sm:text-4xl">What our shoppers say</h2>
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        {REVIEWS.map((r, i) => (
          <motion.div
            key={r.name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            data-testid="testimonial-card"
            className="relative rounded-3xl border border-borderline bg-surface p-7"
          >
            <Quote className="absolute right-6 top-6 h-8 w-8 text-cream" />
            <div className="mb-3 flex gap-0.5">
              {[...Array(r.rating)].map((_, j) => (
                <Star key={j} className="h-4 w-4 fill-amberglow text-amberglow" />
              ))}
            </div>
            <p className="text-sm leading-relaxed text-stoney">"{r.text}"</p>
            <div className="mt-5 flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-terracotta font-serif text-lg font-bold text-sand">
                {r.name[0]}
              </span>
              <div>
                <div className="text-sm font-bold text-ink">{r.name}</div>
                <div className="text-xs text-muted">{r.city}</div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
