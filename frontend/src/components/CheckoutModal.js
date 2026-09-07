import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { QRCodeSVG } from "qrcode.react";
import { X, Copy, Check, CheckCircle2, MessageCircle, QrCode, Truck, PackageCheck, ExternalLink } from "lucide-react";
import { inr, createOrder } from "../api";
import { useStore } from "../store";

export default function CheckoutModal({ open, mode, meta, onClose }) {
  const { cart, config, clear, setCartOpen } = useStore();
  const [step, setStep] = useState("details");
  const [form, setForm] = useState({ customer_name: "", phone: "", email: "", address: "", pincode: "" });
  const [payMethod, setPayMethod] = useState(mode === "whatsapp" ? "whatsapp" : "upi");
  const [utr, setUtr] = useState("");
  const [copied, setCopied] = useState(false);
  const [order, setOrder] = useState(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  React.useEffect(() => {
    if (open) {
      setStep("details");
      setPayMethod(mode === "whatsapp" ? "whatsapp" : "upi");
      setUtr("");
      setOrder(null);
      setError("");
    }
  }, [open, mode]);

  const total = meta?.total ?? cart.total;
  const upiId = config?.upi_id || "9650858890@ybl";
  const payee = config?.payee_name || "EverydayFinds";
  const upiLink = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(payee)}&am=${total}&cu=INR&tn=${encodeURIComponent("EverydayFinds Order")}`;

  const copyUpi = () => {
    navigator.clipboard.writeText(upiId);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const validDetails = () => {
    if (!form.customer_name.trim()) return "Please enter your name";
    if (!/^\d{10}$/.test(form.phone)) return "Enter a valid 10-digit phone number";
    if (!form.address.trim()) return "Please enter your delivery address";
    if (!/^\d{6}$/.test(form.pincode)) return "Enter a valid 6-digit PIN code";
    return "";
  };

  const buildPayload = (method, ref) => ({
    ...form,
    items: cart.items.map((i) => ({ product_id: i.id, name: i.name, price: i.price, quantity: i.quantity, image: i.image })),
    subtotal: cart.subtotal,
    shipping: 0,
    discount: meta?.discount || 0,
    total,
    payment_method: method,
    upi_ref: ref || null,
    coupon: meta?.coupon || null,
  });

  const proceed = () => {
    const err = validDetails();
    if (err) return setError(err);
    setError("");
    setStep("pay");
  };

  const placeUpiOrder = async () => {
    if (!utr.trim()) return setError("Please enter the UPI transaction / UTR reference");
    setBusy(true);
    try {
      const res = await createOrder(buildPayload("upi", utr.trim()));
      setOrder(res);
      setStep("success");
      clear();
    } catch (e) {
      setError("Could not place order. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  const placeCodOrder = async () => {
    setBusy(true);
    try {
      const res = await createOrder(buildPayload("cod"));
      setOrder(res);
      setStep("success");
      clear();
    } catch (e) {
      setError("Could not place order. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  const whatsappCheckout = async () => {
    setBusy(true);
    try {
      const res = await createOrder(buildPayload("whatsapp"));
      const lines = cart.items.map((i) => `• ${i.name} x${i.quantity} — ${inr(i.price * i.quantity)}`).join("%0A");
      const num = config?.whatsapp_number || "919650858890";
      const msg =
        `Hi EverydayFinds! 👋 New order *${res.order_id}*%0A%0A${lines}%0A%0A*Total: ${inr(total)}*%0A%0A` +
        `Name: ${form.customer_name}%0APhone: ${form.phone}%0AAddress: ${form.address}, ${form.pincode}`;
      window.open(`https://wa.me/${num}?text=${msg}`, "_blank");
      setOrder(res);
      setStep("success");
      clear();
    } catch (e) {
      setError("Could not place order. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  const field = (name, placeholder, props = {}) => (
    <input
      data-testid={`checkout-${name}`}
      value={form[name]}
      onChange={(e) => setForm({ ...form, [name]: e.target.value })}
      placeholder={placeholder}
      className="w-full rounded-xl border border-borderline bg-cream px-4 py-3 text-sm outline-none focus:border-terracotta"
      {...props}
    />
  );

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-[60] flex items-center justify-center bg-ink/60 p-4 backdrop-blur-sm"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            data-testid="checkout-modal"
            className="relative max-h-[92vh] w-full max-w-md overflow-y-auto rounded-3xl bg-surface p-6 sm:p-7"
          >
            <button onClick={onClose} className="absolute right-4 top-4 rounded-full p-2 hover:bg-cream" data-testid="checkout-close">
              <X className="h-5 w-5" />
            </button>

            {step === "details" && (
              <>
                <h3 className="font-serif text-2xl font-semibold text-ink">Delivery details</h3>
                <p className="mt-1 text-sm text-muted">Where should we send your finds?</p>
                <div className="mt-5 space-y-3">
                  {field("customer_name", "Full name")}
                  {field("phone", "10-digit phone number", { inputMode: "numeric", maxLength: 10, onChange: (e) => setForm({ ...form, phone: e.target.value.replace(/\D/g, "").slice(0, 10) }) })}
                  {field("email", "Email (optional)")}
                  {field("address", "Full delivery address")}
                  {field("pincode", "PIN code", { inputMode: "numeric", maxLength: 6, onChange: (e) => setForm({ ...form, pincode: e.target.value.replace(/\D/g, "").slice(0, 6) }) })}
                </div>
                {error && <p className="mt-3 text-sm font-medium text-terracotta">{error}</p>}
                <div className="mt-5 flex items-center justify-between rounded-xl bg-cream px-4 py-3">
                  <span className="text-sm text-stoney">Order total</span>
                  <span className="font-serif text-xl font-bold text-ink">{inr(total)}</span>
                </div>
                <button
                  onClick={proceed}
                  data-testid="checkout-continue-button"
                  className="mt-4 w-full rounded-full bg-terracotta py-3.5 text-sm font-semibold text-sand transition-colors hover:bg-terracottadark active:scale-95"
                >
                  Continue to payment
                </button>
              </>
            )}

            {step === "pay" && (
              <>
                <h3 className="font-serif text-2xl font-semibold text-ink">Payment</h3>
                <div className="mt-4 grid grid-cols-3 gap-2">
                  {[
                    { id: "upi", label: "UPI QR", icon: QrCode },
                    { id: "whatsapp", label: "WhatsApp", icon: MessageCircle },
                    { id: "cod", label: "COD", icon: Truck },
                  ].map((m) => (
                    <button
                      key={m.id}
                      onClick={() => setPayMethod(m.id)}
                      data-testid={`pay-method-${m.id}`}
                      className={`flex flex-col items-center gap-1 rounded-xl border p-3 text-xs font-semibold transition-all ${
                        payMethod === m.id ? "border-terracotta bg-tagbg text-tagtext" : "border-borderline text-stoney"
                      }`}
                    >
                      <m.icon className="h-5 w-5" />
                      {m.label}
                    </button>
                  ))}
                </div>

                {payMethod === "upi" && (
                  <div data-testid="upi-payment-modal" className="mt-5 flex flex-col items-center rounded-2xl border border-borderline bg-cream p-5">
                    {/* AUTOMATIC MOBILE APP LAUNCH BUTTON */}
                    <a
                      href={upiLink}
                      data-testid="upi-intent-button"
                      className="flex w-full items-center justify-center gap-2 rounded-full bg-terracotta py-3.5 text-sm font-semibold text-sand shadow-md transition-transform hover:bg-terracottadark active:scale-95"
                    >
                      <ExternalLink className="h-4 w-4" /> Open GPay / PhonePe / Paytm
                    </a>
                    <p className="mt-2 text-center text-xs text-muted">
                      Tap above to open payment apps on mobile
                    </p>

                    <div className="my-4 flex w-full items-center gap-3">
                      <div className="h-[1px] flex-1 bg-borderline"></div>
                      <span className="text-[11px] font-medium uppercase text-muted">or scan qr</span>
                      <div className="h-[1px] flex-1 bg-borderline"></div>
                    </div>

                    <div className="rounded-2xl bg-white p-4 shadow-sm" data-testid="upi-qr-image">
                      <QRCodeSVG value={upiLink} size={160} fgColor="#1C1917" level="M" />
                    </div>

                    <div className="mt-3 flex items-center gap-2 rounded-full border border-borderline bg-surface px-4 py-2">
                      <span className="font-mono text-sm font-semibold text-ink">{upiId}</span>
                      <button onClick={copyUpi} data-testid="upi-copy-id-button" className="text-terracotta">
                        {copied ? <Check className="h-4 w-4 text-sage" /> : <Copy className="h-4 w-4" />}
                      </button>
                    </div>

                    <p className="mt-3 text-center text-sm text-stoney">
                      Paying <span className="font-bold text-ink">{inr(total)}</span> to {payee}
                    </p>

                    <input
                      data-testid="upi-utr-input"
                      value={utr}
                      onChange={(e) => setUtr(e.target.value)}
                      placeholder="Enter 12-digit UPI transaction / UTR ID"
                      className="mt-4 w-full rounded-xl border border-borderline bg-surface px-4 py-3 text-sm outline-none focus:border-terracotta"
                    />
                    {error && <p className="mt-2 text-sm font-medium text-terracotta">{error}</p>}
                    <button
                      onClick={placeUpiOrder}
                      disabled={busy}
                      data-testid="upi-submit-payment-button"
                      className="mt-4 w-full rounded-full bg-ink py-3.5 text-sm font-semibold text-sand transition-colors hover:bg-ink/90 disabled:opacity-60"
                    >
                      {busy ? "Placing order..." : "I've paid — Place Order"}
                    </button>
                  </div>
                )}

                {payMethod === "whatsapp" && (
                  <div className="mt-5 rounded-2xl border border-borderline bg-cream p-5 text-center">
                    <MessageCircle className="mx-auto h-10 w-10 text-sage" />
                    <p className="mt-3 text-sm text-stoney">
                      We'll open WhatsApp with your full order pre-filled. Just hit send to confirm with our team.
                    </p>
                    {error && <p className="mt-2 text-sm font-medium text-terracotta">{error}</p>}
                    <button
                      onClick={whatsappCheckout}
                      disabled={busy}
                      data-testid="whatsapp-order-trigger"
                      className="mt-4 w-full rounded-full bg-sage py-3.5 text-sm font-semibold text-sand transition-colors hover:bg-sagedark disabled:opacity-60"
                    >
                      {busy ? "Preparing..." : `Send order on WhatsApp · ${inr(total)}`}
                    </button>
                  </div>
                )}

                {payMethod === "cod" && (
                  <div className="mt-5 rounded-2xl border border-borderline bg-cream p-5 text-center">
                    <Truck className="mx-auto h-10 w-10 text-terracotta" />
                    <p className="mt-3 text-sm text-stoney">Pay {inr(total)} in cash when your order arrives.</p>
                    {error && <p className="mt-2 text-sm font-medium text-terracotta">{error}</p>}
                    <button
                      onClick={placeCodOrder}
                      disabled={busy}
                      data-testid="cod-place-order-button"
                      className="mt-4 w-full rounded-full bg-terracotta py-3.5 text-sm font-semibold text-sand transition-colors hover:bg-terracottadark disabled:opacity-60"
                    >
                      {busy ? "Placing order..." : "Place COD Order"}
                    </button>
                  </div>
                )}
              </>
            )}

            {step === "success" && order && (
              <div className="py-6 text-center" data-testid="checkout-success">
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 260, damping: 18 }}>
                  <CheckCircle2 className="mx-auto h-16 w-16 text-sage" />
                </motion.div>
                <h3 className="mt-4 font-serif text-2xl font-semibold text-ink">Order placed!</h3>
                <p className="mt-1 text-sm text-stoney">Thank you, {form.customer_name.split(" ")[0] || "friend"}.</p>
                <div className="mx-auto mt-5 flex max-w-xs items-center justify-between rounded-xl bg-cream px-4 py-3">
                  <span className="text-sm text-muted">Order ID</span>
                  <span data-testid="success-order-id" className="font-mono text-lg font-bold text-terracotta">{order.order_id}</span>
                </div>
                <p className="mt-3 text-xs text-muted">Track it anytime using this ID or your phone number.</p>
                <button
                  onClick={() => {
                    onClose();
                    setCartOpen(false);
                  }}
                  className="mt-5 inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-sm font-semibold text-sand"
                >
                  <PackageCheck className="h-4 w-4" /> Continue shopping
                </button>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}