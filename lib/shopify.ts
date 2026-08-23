/**
 * Shopify Storefront API client.
 *
 * This reads products, prices, images and variants from the SAME Shopify
 * store that powers the old theme — it never touches checkout, payments,
 * inventory writes, or orders. Those all stay on Shopify exactly as they
 * are now. This file only READS product data.
 *
 * Required env vars (see .env.local.example):
 *   SHOPIFY_STORE_DOMAIN     e.g. "frezora-org.myshopify.com"
 *   SHOPIFY_STOREFRONT_TOKEN the Storefront API access token
 */

const DOMAIN = process.env.SHOPIFY_STORE_DOMAIN || "";
const TOKEN = process.env.SHOPIFY_STOREFRONT_TOKEN || "";
const API_VERSION = "2024-10";

function endpoint() {
  return `https://${DOMAIN}/api/${API_VERSION}/graphql.json`;
}

async function storefrontFetch<T>(query: string, variables: Record<string, unknown> = {}): Promise<T> {
  if (!DOMAIN || !TOKEN) {
    throw new Error(
      "Shopify Storefront API not configured. Set SHOPIFY_STORE_DOMAIN and SHOPIFY_STOREFRONT_TOKEN in .env.local"
    );
  }
  const res = await fetch(endpoint(), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": TOKEN,
    },
    body: JSON.stringify({ query, variables }),
    next: { revalidate: 60 }, // re-fetch prices/stock at most once a minute
  });
  const json = await res.json();
  if (json.errors) {
    throw new Error("Shopify Storefront API error: " + JSON.stringify(json.errors));
  }
  return json.data as T;
}

export type Money = { amount: string; currencyCode: string };

type ShopifyProductRaw = {
  id: string;
  handle: string;
  title: string;
  description: string;
  descriptionHtml: string;
  images: { nodes: { url: string; altText: string | null }[] };
  variants: { nodes: ProductVariant[] };
  priceRange: { minVariantPrice: Money };
};

export type ProductVariant = {
  id: string;
  title: string;
  availableForSale: boolean;
  price: Money;
  selectedOptions: { name: string; value: string }[];
  image: { url: string; altText: string | null } | null;
};

export type Product = {
  id: string;
  handle: string;
  title: string;
  description: string;
  descriptionHtml: string;
  images: { url: string; altText: string | null }[];
  variants: ProductVariant[];
  priceRange: { minVariantPrice: Money };
};

const PRODUCT_FIELDS = `
  id
  handle
  title
  description
  descriptionHtml
  images(first: 10) {
    nodes { url altText }
  }
  variants(first: 20) {
    nodes {
      id
      title
      availableForSale
      price { amount currencyCode }
      selectedOptions { name value }
      image { url altText }
    }
  }
  priceRange {
    minVariantPrice { amount currencyCode }
  }
`;

export async function getProductByHandle(handle: string): Promise<Product | null> {
  const query = `
    query ProductByHandle($handle: String!) {
      product(handle: $handle) {
        ${PRODUCT_FIELDS}
      }
    }
  `;
  const data = await storefrontFetch<{ product: ShopifyProductRaw | null }>(query, { handle });
  if (!data.product) return null;
  return normalizeProduct(data.product);
}

export async function getAllProducts(first = 20): Promise<Product[]> {
  const query = `
    query AllProducts($first: Int!) {
      products(first: $first) {
        nodes {
          ${PRODUCT_FIELDS}
        }
      }
    }
  `;
  const data = await storefrontFetch<{ products: { nodes: ShopifyProductRaw[] } }>(query, { first });
  return data.products.nodes.map(normalizeProduct);
}

function normalizeProduct(p: ShopifyProductRaw): Product {
  return {
    id: p.id,
    handle: p.handle,
    title: p.title,
    description: p.description,
    descriptionHtml: p.descriptionHtml,
    images: p.images.nodes,
    variants: p.variants.nodes,
    priceRange: p.priceRange,
  };
}

/**
 * Creates a Shopify cart via the Storefront API and returns its checkout URL.
 * This is the handoff point: once the customer clicks "Checkout", they land
 * on Shopify's own hosted checkout — same payment processing, same Shopify
 * Payments account, same order flow as the current theme.
 */
export async function createCheckoutUrl(
  lines: { variantId: string; quantity: number }[]
): Promise<string> {
  const query = `
    mutation CartCreate($lines: [CartLineInput!]!) {
      cartCreate(input: { lines: $lines }) {
        cart { checkoutUrl }
        userErrors { message }
      }
    }
  `;
  const data = await storefrontFetch<{
    cartCreate: { cart: { checkoutUrl: string } | null; userErrors: { message: string }[] };
  }>(query, {
    lines: lines.map((l) => ({ merchandiseId: l.variantId, quantity: l.quantity })),
  });
  if (data.cartCreate.userErrors.length) {
    throw new Error(data.cartCreate.userErrors.map((e) => e.message).join(", "));
  }
  if (!data.cartCreate.cart) {
    throw new Error("Shopify did not return a cart");
  }
  return data.cartCreate.cart.checkoutUrl;
}
