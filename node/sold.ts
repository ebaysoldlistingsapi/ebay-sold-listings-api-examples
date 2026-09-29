// eBay sold listings in TypeScript (Node 18+, Deno, Bun, Workers).
// EBAY_SOLD_API_KEY=eb_... npx tsx sold.ts "steam deck oled"
const API = "https://api.ebaysoldlistingsapi.com";
const KEY = process.env.EBAY_SOLD_API_KEY!;
const RETRY = new Set([429, 502, 503, 504]);

export type Sale = {
  itemId: string;
  title: string;
  soldPrice: string;
  soldCurrency: string;
  endedAt: string;
  condition: string;
  buyingFormat: "auction" | "buyItNow";
  totalPrice: string | null;
  sellerUsername: string;
  url: string;
  bestOfferAccepted?: boolean;
};

export async function sold(keyword: string, params: Record<string, string> = {}): Promise<Sale[]> {
  const qs = new URLSearchParams({ keyword, ...params });
  for (let attempt = 0; attempt < 4; attempt++) {
    const res = await fetch(`${API}/scrape?${qs}`, {
      headers: { Authorization: `Bearer ${KEY}` },
      signal: AbortSignal.timeout(90_000),
    });
    if (!RETRY.has(res.status)) {
      const body = await res.json();
      if (!res.ok) throw new Error(`${body.code}: ${body.error}`);
      return body.results as Sale[];
    }
    const wait = Number(res.headers.get("Retry-After") ?? 2 ** attempt);
    await new Promise((r) => setTimeout(r, wait * 1000));
  }
  throw new Error("eBay sold search failed after retries");
}

export function median(sales: Sale[]): number | null {
  const p = sales.map((s) => Number(s.soldPrice)).filter(Number.isFinite).sort((a, b) => a - b);
  if (!p.length) return null;
  const m = Math.floor(p.length / 2);
  return p.length % 2 ? p[m] : (p[m - 1] + p[m]) / 2;
}

const keyword = process.argv.slice(2).join(" ") || "steam deck oled";
const sales = await sold(keyword, { itemCondition: "used" });
console.log(`${keyword}: ${sales.length} sales, median ${median(sales)}`);
