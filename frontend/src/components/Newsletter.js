import React, { useState } from "react";
import { Mail, Send } from "lucide-react";
import { subscribeNewsletter } from "../api";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!/^\S+@\S+\.\S+$/.test(email)) return setMsg("Please enter a valid email");
    setBusy(true);
    try {
      const res = await subscribeNewsletter(email);
      setMsg(res.message);
      if (!res.already) setEmail("");
    } catch {
      setMsg("Something went wrong. Try again.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="grain-bg overflow-hidden rounded-3xl bg-ink px-6 py-12 text-center sm:px-12">
        <Mail className="mx-auto h-10 w-10 text-terracotta" />
        <h2 className="mt-4 font-serif text-3xl font-semibold text-sand sm:text-4xl">Get ₹100 off your first order</h2>
        <p className="mx-auto mt-3 max-w-md text-sm text-sand/70">
          Join the EverydayFinds club for early access to new arrivals, exclusive drops and members-only deals.
        </p>
        <form onSubmit={submit} className="mx-auto mt-6 flex max-w-md flex-col gap-3 sm:flex-row">
          <input
            data-testid="newsletter-email-input"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="flex-1 rounded-full border border-white/15 bg-white/10 px-5 py-3.5 text-sm text-sand outline-none placeholder:text-sand/50 focus:border-terracotta"
          />
          <button
            type="submit"
            disabled={busy}
            data-testid="newsletter-submit-button"
            className="flex items-center justify-center gap-2 rounded-full bg-terracotta px-6 py-3.5 text-sm font-semibold text-sand transition-colors hover:bg-terracottadark disabled:opacity-60"
          >
            <Send className="h-4 w-4" /> Subscribe
          </button>
        </form>
        {msg && <p data-testid="newsletter-message" className="mt-3 text-sm font-medium text-sage">{msg}</p>}
      </div>
    </section>
  );
}
