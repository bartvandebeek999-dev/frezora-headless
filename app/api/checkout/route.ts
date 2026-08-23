import { NextRequest, NextResponse } from "next/server";
import { createCheckoutUrl } from "@/lib/shopify";

export async function POST(req: NextRequest) {
  try {
    const { lines } = await req.json();
    if (!Array.isArray(lines) || lines.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }
    const url = await createCheckoutUrl(lines);
    return NextResponse.json({ url });
  } catch (err: unknown) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "Checkout failed" }, { status: 500 });
  }
}
