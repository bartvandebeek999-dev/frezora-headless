"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useCart } from "@/lib/cart-context";

function money(amount: number, currency: string) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(amount);
}

export default function CartDrawer() {
  const { lines, isOpen, close, setQuantity, removeLine, subtotal, isCheckingOut, checkout } =
    useCart();
  const currency = lines[0]?.currency || "USD";

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 bg-black/40 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
          />
          <motion.aside
            className="fixed top-0 right-0 h-full w-full sm:w-[420px] bg-white z-50 flex flex-col shadow-2xl"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 32, stiffness: 300 }}
          >
            <div className="flex items-center justify-between px-6 py-5 border-b border-line">
              <h2 className="font-display font-semibold text-lg">
                Your cart ({lines.reduce((s, l) => s + l.quantity, 0)})
              </h2>
              <button onClick={close} aria-label="Close cart" className="text-2xl leading-none">
                ×
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-5">
              {lines.length === 0 ? (
                <div className="text-center py-16">
                  <img
                    src="/images/frezora-blue-poster.png"
                    alt="Frezora"
                    className="w-40 mx-auto mb-6 rounded-2xl bg-paper"
                  />
                  <p className="text-sm text-ink/60">Your cart is empty.</p>
                </div>
              ) : (
                <ul className="space-y-5">
                  {lines.map((l) => (
                    <li key={l.variantId} className="flex gap-4">
                      <img
                        src={l.image}
                        alt={l.productTitle}
                        className="w-20 h-20 rounded-xl object-cover bg-paper flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm">{l.productTitle}</p>
                        <p className="text-xs text-ink/50 mt-0.5">{l.variantTitle}</p>
                        <div className="flex items-center justify-between mt-3">
                          <div className="flex items-center border border-line rounded-full">
                            <button
                              className="w-7 h-7 text-sm"
                              onClick={() => setQuantity(l.variantId, l.quantity - 1)}
                            >
                              −
                            </button>
                            <span className="w-6 text-center text-sm">{l.quantity}</span>
                            <button
                              className="w-7 h-7 text-sm"
                              onClick={() => setQuantity(l.variantId, l.quantity + 1)}
                            >
                              +
                            </button>
                          </div>
                          <span className="text-sm font-medium">
                            {money(l.price * l.quantity, l.currency)}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => removeLine(l.variantId)}
                        className="text-ink/30 hover:text-ink/70 text-sm self-start"
                        aria-label="Remove"
                      >
                        ×
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {lines.length > 0 && (
              <div className="px-6 py-5 border-t border-line space-y-4">
                <p className="text-sm text-ink/60">Shipping calculated at checkout.</p>
                <div className="flex items-center justify-between text-base font-semibold">
                  <span>Subtotal</span>
                  <span>{money(subtotal, currency)}</span>
                </div>
                <button
                  onClick={checkout}
                  disabled={isCheckingOut}
                  className="btn-lift w-full h-12 rounded-full bg-ink text-white text-sm font-medium disabled:opacity-60"
                >
                  {isCheckingOut ? "Redirecting to checkout…" : "Checkout"}
                </button>
                <p className="text-[11px] text-center text-ink/40">
                  Secure checkout powered by Shopify
                </p>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
