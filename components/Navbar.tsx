"use client";

import { motion } from "framer-motion";
import { useCart } from "@/lib/cart-context";

const LINKS = [
  { label: "Product", href: "#journey" },
  { label: "Colors", href: "#colors" },
  { label: "Facts", href: "#facts" },
  { label: "FAQ", href: "#faq" },
];

export default function Navbar() {
  const { count, open } = useCart();
  return (
    <motion.header
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 0.61, 0.36, 1] }}
      className="fixed top-0 left-0 right-0 z-30 backdrop-blur-md bg-white/70 border-b border-line/70"
    >
      <div className="max-w-[1160px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <a href="#top" className="font-display font-bold tracking-[0.08em] text-ink">
          FREZORA
        </a>
        <nav className="hidden md:flex items-center gap-7 text-sm text-ink/70">
          {LINKS.map((l) => (
            <a key={l.href} href={l.href} className="hover:text-ink transition-colors">
              {l.label}
            </a>
          ))}
        </nav>
        <button
          onClick={open}
          className="btn-lift relative h-10 px-4 rounded-full bg-ink text-white text-sm font-medium"
        >
          Cart{count > 0 ? ` (${count})` : ""}
        </button>
      </div>
    </motion.header>
  );
}
