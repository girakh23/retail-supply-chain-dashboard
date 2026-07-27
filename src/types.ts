export type Role = "analyst" | "manager" | "admin";

export type SkuStatus = "In Stock" | "Low Stock" | "Backordered";

export interface Sku {
  id: string;
  name: string;
  category: string;
  region: string;
  price: number;
  prevPrice: number;
  inventory: number;
  reorderPoint: number;
  velocity: number;
  status: SkuStatus;
  margin: number;
}

export interface TrendPoint {
  week: string;
  price: number;
}

export interface CategoryInventory {
  category: string;
  onHand: number;
  reorder: number;
}

export interface RegionalPerformance {
  region: string;
  score: number; // 0-100
  color: string;
}

export interface StatusBreakdownSlice {
  status: SkuStatus;
  count: number;
  color: string;
}

export type InsightTone = "good" | "warn";

export interface Insight {
  id: number;
  tag: string;
  title: string;
  detail: string;
  confidence: number;
  impact: string;
  tone: InsightTone;
}
