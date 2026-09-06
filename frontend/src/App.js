import React, { useEffect, useMemo, useState } from "react";
import "./App.css";
import { StoreProvider, useStore } from "./store";
import { getProducts } from "./api";
import Header from "./components/Header";
import Hero from "./components/Hero";
import TrustBar from "./components/TrustBar";
import Bestsellers from "./components/Bestsellers";
import Catalog from "./components/Catalog";
import QuickView from "./components/QuickView";
import CartDrawer from "./components/CartDrawer";
import CheckoutModal from "./components/CheckoutModal";
import Testimonials from "./components/Testimonials";
import Newsletter from "./components/Newsletter";
import Footer from "./components/Footer";
import OrderTracker from "./components/OrderTracker";

function Store() {
  const { config } = useStore();
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("all");
  const [sort, setSort] = useState("");
  const [search, setSearch] = useState("");

  const [quickView, setQuickView] = useState(null);
  const [trackerOpen, setTrackerOpen] = useState(false);
  const [checkout, setCheckout] = useState({ open: false, mode: "upi", meta: null });

  useEffect(() => {
    setLoading(true);
    getProducts({ sort })
      .then((d) => {
        // Fall back to empty array if d or d.products is undefined
        const productsList = Array.isArray(d?.products) ? d.products : [];
        setAllProducts(productsList);
      })
      .catch((err) => {
        console.error("Failed to load products:", err);
        setAllProducts([]);
      })
      .finally(() => setLoading(false));
  }, [sort]);

  const filtered = useMemo(() => {
    // Ensure list is always an array before filtering
    let list = Array.isArray(allProducts) ? allProducts : [];
    if (category !== "all") list = list.filter((p) => p.category === category);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (p) =>
          p.name?.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q)
      );
    }
    return list;
  }, [allProducts, category, search]);

  const openWhatsApp = () => {
    const num = config?.whatsapp_number || "919650858890";
    window.open(
      `https://wa.me/${num}?text=${encodeURIComponent(
        "Hi EverydayFinds! I'd like to know more about your products."
      )}`,
      "_blank"
    );
  };

  const categories = config?.categories || [];

  return (
    <div className="App">
      <Header onOpenTracker={() => setTrackerOpen(true)} onSearch={setSearch} search={search} />
      <main>
        <Hero config={config} onWhatsApp={openWhatsApp} />
        <TrustBar />
        <Bestsellers products={allProducts || []} onQuickView={setQuickView} />
        <Catalog
          products={filtered}
          categories={categories}
          category={category}
          setCategory={setCategory}
          sort={sort}
          setSort={setSort}
          loading={loading}
          onQuickView={setQuickView}
        />
        <Testimonials />
        <Newsletter />
      </main>
      <Footer config={config} onOpenTracker={() => setTrackerOpen(true)} />

      <QuickView product={quickView} onClose={() => setQuickView(null)} />
      <CartDrawer onCheckout={(mode, meta) => setCheckout({ open: true, mode, meta })} />
      <CheckoutModal
        open={checkout.open}
        mode={checkout.mode}
        meta={checkout.meta}
        onClose={() => setCheckout({ open: false, mode: "upi", meta: null })}
      />
      <OrderTracker open={trackerOpen} onClose={() => setTrackerOpen(false)} />
    </div>
  );
}

export default function App() {
  return (
    <StoreProvider>
      <Store />
    </StoreProvider>
  );
}