import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Journey from "@/components/Journey";
import ColorPicker from "@/components/ColorPicker";
import Facts from "@/components/Facts";
import FAQ from "@/components/FAQ";
import Footer from "@/components/Footer";
import { getProductByHandle } from "@/lib/shopify";

export const revalidate = 60;

export default async function Home() {
  let product = null;
  try {
    product = await getProductByHandle(
      "bladeless-neck-fan-4000mah-rechargeable-hands-free-cooling"
    );
  } catch {
    // Storefront API not configured yet — page still renders, Add to cart
    // will just be disabled until SHOPIFY_STORE_DOMAIN / TOKEN are set.
  }

  return (
    <main>
      <Navbar />
      <Hero />
      <Journey modelSrc="/models/frezora-black.glb" />
      <ColorPicker product={product} />
      <Facts />
      <FAQ />
      <Footer />
    </main>
  );
}
