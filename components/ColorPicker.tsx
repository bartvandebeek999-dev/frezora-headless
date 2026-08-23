"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { useCart } from "@/lib/cart-context";
import type { Product } from "@/lib/shopify";

const COLORS = [
  { key: "blue", label: "Blue", hex: "#2A5CB0", poster: "/images/frezora-blue-poster.png" },
  { key: "white", label: "White", hex: "#F5F5F2", poster: "/images/frezora-white-poster.png" },
  { key: "black", label: "Black", hex: "#14161A", poster: "/images/frezora-black-poster.png" },
];

export default function ColorPicker({ product }: { product: Product | null }) {
  const [selected, setSelected] = useState("black");
  const { addLine } = useCart();
  const active = COLORS.find((c) => c.key === selected)!;

  const variant = product?.variants.find((v) =>
    v.title.toLowerCase().includes(selected)
  );
  const price = variant?.price.amount || product?.priceRange.minVariantPrice.amount || "39.95";
  const currency = variant?.price.currencyCode || product?.priceRange.minVariantPrice.currencyCode || "USD";

  function handleAdd() {
    if (!variant || !product) return;
    addLine({
      variantId: variant.id,
      productTitle: product.title,
      variantTitle: variant.title,
      price: parseFloat(variant.price.amount),
      currency: variant.price.currencyCode,
      image: active.poster,
    });
  }

  return (
    <section id="colors" className="py-24 bg-paper">
      <div className="max-w-[1160px] mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <span className="eyebrow text-ice justify-center">AVAILABLE IN THREE COLORS</span>
          <h2 className="font-display font-semibold text-3xl sm:text-4xl mt-3">
            Blue. White. Black. Choose yours.
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            key={selected}
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.45, ease: [0.22, 0.61, 0.36, 1] }}
            className="rounded-3xl bg-white border border-line p-10 flex items-center justify-center"
          >
            <img src={active.poster} alt={`Frezora ${active.label}`} className="w-full max-w-sm" />
          </motion.div>

          <div>
            <div className="flex gap-3 mb-8">
              {COLORS.map((c) => (
                <button
                  key={c.key}
                  onClick={() => setSelected(c.key)}
                  className={`w-12 h-12 rounded-full border-2 transition-all ${
                    selected === c.key ? "border-ink scale-110" : "border-transparent"
                  }`}
                  style={{ background: c.hex }}
                  aria-label={c.label}
                />
              ))}
            </div>
            <p className="text-sm text-ink/50 mb-1">{active.label}</p>
            <p className="font-display font-semibold text-3xl mb-6">
              {new Intl.NumberFormat("en-US", { style: "currency", currency }).format(
                parseFloat(price)
              )}
            </p>
            <button
              onClick={handleAdd}
              className="btn-lift w-full sm:w-auto h-12 px-8 rounded-full bg-ink text-white text-sm font-medium"
            >
              Add {active.label} to cart
            </button>
            <p className="mt-4 text-xs text-ink/45">
              Free US shipping · International rates at checkout · 30-day returns
            </p>
            <div className="mt-6 flex items-center gap-3 p-3 rounded-xl bg-white border border-line">
              <img src="/images/tested-seal.png" alt="Tested by Frezora" className="w-11 h-11" />
              <p className="text-xs text-ink/60">
                We ordered the same unit we sell, tested it in person, and only then listed it.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
