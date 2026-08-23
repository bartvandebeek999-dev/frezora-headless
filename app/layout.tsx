import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/lib/cart-context";
import CartDrawer from "@/components/CartDrawer";
import Script from "next/script";

// Google Fonts are loaded via <link> in <head> below instead of next/font,
// because next/font needs to reach fonts.googleapis.com at BUILD time.
// This works identically once deployed (Vercel has normal internet access) —
// it just also works in sandboxes/CI with no outbound network.

export const metadata: Metadata = {
  title: "Frezora — Bladeless Neck Fan",
  description:
    "Frezora is a bladeless neck fan you wear, not hold. Three airflow settings, 4000mAh battery, USB-C charging.",
  metadataBase: new URL("https://frezora.org"),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body antialiased">
        <Script
          type="module"
          src="https://cdn.jsdelivr.net/npm/@google/model-viewer@4.0.0/dist/model-viewer.min.js"
          strategy="beforeInteractive"
        />
        <CartProvider>
          {children}
          <CartDrawer />
        </CartProvider>
      </body>
    </html>
  );
}
