import type { Sku, TrendPoint, CategoryInventory, Insight, RegionalPerformance, StatusBreakdownSlice } from "./types";

/* ---------------------------------------------------------------
   Mock REST data layer.
   In production these functions would be `fetch("/api/skus")` etc.
   against real pricing/inventory/AI-insight services. They are
   written as async functions returning Promises specifically so
   the calling components use the same loading/error/data pattern
   they would against a real backend (see useEffect in
   SupplyChainConsole.tsx). Swapping the body of each function for
   a real `fetch` call is the only change needed to go live.
--------------------------------------------------------------- */

function seeded(seed: number) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}
const rand = seeded(42);

export const CATEGORIES = ["Produce", "Dairy", "Bakery", "Beverages", "Snacks", "Household", "Health & Beauty", "Frozen"];
const REGIONS = ["Midwest", "Northeast", "Southeast", "West"];
const WEEKS = ["W1", "W2", "W3", "W4", "W5", "W6", "W7", "W8"];

function genSkus(n: number): Sku[] {
  const rows: Sku[] = [];
  for (let i = 0; i < n; i++) {
    const category = CATEGORIES[Math.floor(rand() * CATEGORIES.length)];
    const region = REGIONS[Math.floor(rand() * REGIONS.length)];
    const price = +(2 + rand() * 28).toFixed(2);
    const delta = +((rand() - 0.5) * 4).toFixed(2);
    const prevPrice = +(price - delta).toFixed(2);
    const inventory = Math.floor(20 + rand() * 480);
    const reorderPoint = Math.floor(60 + rand() * 120);
    const velocity = +(rand() * 9 + 1).toFixed(1);
    let status: Sku["status"] = "In Stock";
    if (inventory < reorderPoint * 0.5) status = "Backordered";
    else if (inventory < reorderPoint) status = "Low Stock";
    rows.push({
      id: `SKU-${1000 + i}`,
      name: `${category} Item ${i + 1}`,
      category,
      region,
      price,
      prevPrice,
      inventory,
      reorderPoint,
      velocity,
      status,
      margin: +(rand() * 22 + 8).toFixed(1),
    });
  }
  return rows;
}

const SKUS = genSkus(46);

const AI_INSIGHTS: Insight[] = [
  {
    id: 1,
    tag: "Reorder",
    title: "Frozen category trending toward stockout",
    detail: "Sell-through velocity in Frozen has outpaced replenishment for 3 consecutive weeks across the Midwest region.",
    confidence: 92,
    impact: "+$18.4k protected revenue",
    tone: "warn",
  },
  {
    id: 2,
    tag: "Pricing",
    title: "Elasticity window open on Beverages",
    detail: "Demand modeling suggests a 4–6% price increase on 3 Beverage SKUs would not meaningfully reduce unit velocity.",
    confidence: 81,
    impact: "+2.1% margin lift",
    tone: "good",
  },
  {
    id: 3,
    tag: "Overstock",
    title: "Household inventory 34% above target",
    detail: "Carrying cost on Household SKUs has crept above target band; a short-term promo could rebalance stock ahead of quarter close.",
    confidence: 76,
    impact: "-$6.2k carrying cost",
    tone: "warn",
  },
  {
    id: 4,
    tag: "Forecast",
    title: "Bakery demand forecast revised upward",
    detail: "Regional weather and seasonal patterns point to an 11% demand increase for Bakery over the next 2 weeks.",
    confidence: 68,
    impact: "Plan +11% units",
    tone: "good",
  },
];

function delay<T>(value: T, ms = 450): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

/** GET /api/skus — simulated REST call for the SKU/pricing/inventory table */
export async function fetchSkus(): Promise<Sku[]> {
  return delay(SKUS);
}

/** GET /api/inventory/by-category — simulated aggregate REST call */
export async function fetchInventoryByCategory(): Promise<CategoryInventory[]> {
  const result = CATEGORIES.map((c) => {
    const items = SKUS.filter((s) => s.category === c);
    const onHand = items.reduce((a, b) => a + b.inventory, 0);
    const reorder = items.reduce((a, b) => a + b.reorderPoint, 0);
    return { category: c, onHand, reorder: Math.round(reorder / Math.max(1, items.length)) * items.length };
  });
  return delay(result, 350);
}

/** GET /api/pricing/trend?category=... — simulated REST call with a query param */
export async function fetchPriceTrend(category: string): Promise<TrendPoint[]> {
  let base = 12 + (CATEGORIES.indexOf(category) % 5) * 2;
  const points = WEEKS.map((w) => {
    base += (rand() - 0.45) * 1.4;
    return { week: w, price: +Math.max(3, base).toFixed(2) };
  });
  return delay(points, 300);
}

/** GET /api/ai/insights — simulated call to an AI recommendation service (Azure-AI-style) */
export async function fetchAiInsights(): Promise<Insight[]> {
  return delay(AI_INSIGHTS, 600);
}

/** GET /api/regions/performance — simulated aggregate REST call for a regional scorecard */
export async function fetchRegionalPerformance(): Promise<RegionalPerformance[]> {
  const colors = ["#12B886", "#3D7BFF", "#7C5CFC", "#FFAF3D"];
  const result = REGIONS.map((region, i) => {
    const items = SKUS.filter((s) => s.region === region);
    const healthy = items.filter((s) => s.status === "In Stock").length;
    const score = items.length ? Math.round((healthy / items.length) * 100) : 0;
    return { region, score, color: colors[i % colors.length] };
  });
  return delay(result, 400);
}

/** GET /api/skus/status-breakdown — simulated REST call for a status distribution donut */
export async function fetchStatusBreakdown(): Promise<StatusBreakdownSlice[]> {
  const counts: Record<string, number> = { "In Stock": 0, "Low Stock": 0, "Backordered": 0 };
  SKUS.forEach((s) => { counts[s.status] += 1; });
  const colors: Record<string, string> = { "In Stock": "#12B886", "Low Stock": "#FFAF3D", "Backordered": "#F1494F" };
  const result = (Object.keys(counts) as Sku["status"][]).map((status) => ({
    status,
    count: counts[status],
    color: colors[status],
  }));
  return delay(result, 350);
}
