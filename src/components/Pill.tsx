import type { ReactNode } from "react";
import type { SkuStatus } from "../types";

type Tone = "neutral" | "good" | "warn" | "danger";

const TONE_MAP: Record<Tone, { bg: string; fg: string; bd: string }> = {
  neutral: { bg: "#EEF1F8", fg: "#5B6785", bd: "#DEE3EF" },
  good: { bg: "#E4F9F1", fg: "#0EA57A", bd: "#BFEDDD" },
  warn: { bg: "#FDF1DD", fg: "#C4841A", bd: "#F5DCA8" },
  danger: { bg: "#FCE8E9", fg: "#D93C42", bd: "#F5C2C4" },
};

export function Pill({ children, tone = "neutral" }: { children: ReactNode; tone?: Tone }) {
  const s = TONE_MAP[tone];
  return (
    <span
      className="nl-mono"
      style={{
        fontSize: 11,
        padding: "2px 8px",
        borderRadius: 999,
        background: s.bg,
        color: s.fg,
        border: `1px solid ${s.bd}`,
        whiteSpace: "nowrap",
      }}
    >
      {children}
    </span>
  );
}

export function StatusPill({ status }: { status: SkuStatus }) {
  if (status === "In Stock") return <Pill tone="good">IN STOCK</Pill>;
  if (status === "Low Stock") return <Pill tone="warn">LOW STOCK</Pill>;
  return <Pill tone="danger">BACKORDERED</Pill>;
}
