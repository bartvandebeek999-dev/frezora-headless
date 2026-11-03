# Frezora — headless storefront

Custom Next.js storefront that reads products from Shopify (via the
Storefront API) and hands off to Shopify's own checkout for payment.
Your existing Shopify theme/backend, Shopify Payments, taxes and orders
are untouched — this is a new frontend only.

Shipping rates and destination availability are determined by the connected
Shopify store's shipping configuration at hosted checkout. The storefront
creates a cart with variant IDs and quantities and redirects to Shopify's
`checkoutUrl`; it does not fetch shipping rates or collect a shipping address.
Keep pre-checkout shipping copy region-neutral ("Shipping calculated at
checkout") rather than promising free shipping or delivery to a specific region.

## 1. Connect it to your Shopify store

Copy `.env.local.example` to `.env.local` and fill in:

- `SHOPIFY_STORE_DOMAIN` — your `*.myshopify.com` domain
- `SHOPIFY_STOREFRONT_TOKEN` — Storefront API access token
  (Shopify admin → Settings → Apps and sales channels → Develop apps →
  create an app → Configuration → Storefront API → enable read access to
  products and carts → Install → copy the token)

## 2. Run it locally (optional)

```
npm install
npm run dev
```

## 3. Deploy

Push this folder to a GitHub repo and import it on vercel.com, or deploy
directly with the Vercel CLI. Add the two env vars above in the Vercel
project settings. Then point your domain (frezora.org) at the Vercel
deployment — Vercel's dashboard has a "Domains" tab that shows exactly
which DNS record to add.

Your OLD Shopify theme stays exactly as it is and keeps working the whole
time — nothing here can break it. You only switch frezora.org over to the
new site once you're happy with it.
