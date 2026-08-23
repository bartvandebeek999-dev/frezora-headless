"use client";

import { createContext, useContext, useEffect, useMemo, useState, ReactNode } from "react";

export type CartLine = {
  variantId: string;
  productTitle: string;
  variantTitle: string;
  price: number;
  currency: string;
  image: string;
  quantity: number;
};

type CartState = {
  lines: CartLine[];
  isOpen: boolean;
  isCheckingOut: boolean;
  addLine: (line: Omit<CartLine, "quantity">, qty?: number) => void;
  removeLine: (variantId: string) => void;
  setQuantity: (variantId: string, qty: number) => void;
  open: () => void;
  close: () => void;
  subtotal: number;
  count: number;
  checkout: () => Promise<void>;
};

const CartContext = createContext<CartState | null>(null);
const STORAGE_KEY = "frezora_cart_v1";

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setLines(JSON.parse(raw));
    } catch {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
    } catch {}
  }, [lines]);

  function addLine(line: Omit<CartLine, "quantity">, qty = 1) {
    setLines((prev) => {
      const existing = prev.find((l) => l.variantId === line.variantId);
      if (existing) {
        return prev.map((l) =>
          l.variantId === line.variantId ? { ...l, quantity: l.quantity + qty } : l
        );
      }
      return [...prev, { ...line, quantity: qty }];
    });
    setIsOpen(true);
  }

  function removeLine(variantId: string) {
    setLines((prev) => prev.filter((l) => l.variantId !== variantId));
  }

  function setQuantity(variantId: string, qty: number) {
    if (qty <= 0) return removeLine(variantId);
    setLines((prev) => prev.map((l) => (l.variantId === variantId ? { ...l, quantity: qty } : l)));
  }

  async function checkout() {
    setIsCheckingOut(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lines: lines.map((l) => ({ variantId: l.variantId, quantity: l.quantity })),
        }),
      });
      const data = await res.json();
      if (data.url) {
        // Hands off to Shopify's own checkout — same Shopify Payments account.
        window.location.href = data.url;
      } else {
        throw new Error(data.error || "Checkout failed");
      }
    } finally {
      setIsCheckingOut(false);
    }
  }

  const subtotal = useMemo(
    () => lines.reduce((sum, l) => sum + l.price * l.quantity, 0),
    [lines]
  );
  const count = useMemo(() => lines.reduce((sum, l) => sum + l.quantity, 0), [lines]);

  return (
    <CartContext.Provider
      value={{
        lines,
        isOpen,
        isCheckingOut,
        addLine,
        removeLine,
        setQuantity,
        open: () => setIsOpen(true),
        close: () => setIsOpen(false),
        subtotal,
        count,
        checkout,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
