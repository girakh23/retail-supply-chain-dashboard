import type { Insight } from "../types";
import { Pill } from "./Pill";

export function InsightCard({ ins, compact = false }: { ins: Insight; compact?: boolean }) {
  const toneColor = ins.tone === "warn" ? "var(--amber)" : "var(--good)";
  return (
    <div className="nl-panel-2" style={{ padding: 14, borderLeft: `3px solid ${toneColor}` }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
        <Pill tone={ins.tone === "warn" ? "warn" : "good"}>{ins.tag.toUpperCase()}</Pill>
        <span className="nl-mono" style={{ fontSize: 11, color: "var(--muted)" }}>{ins.confidence}% confidence</span>
      </div>
      <div className="nl-display" style={{ fontWeight: 600, fontSize: compact ? 13 : 14.5, marginBottom: 6 }}>{ins.title}</div>
      {!compact && <div style={{ fontSize: 12, color: "var(--muted)", lineHeight: 1.5, marginBottom: 10 }}>{ins.detail}</div>}
      <div style={{ height: 4, borderRadius: 999, background: "var(--panel-3)", overflow: "hidden", marginBottom: 8 }}>
        <div style={{ height: "100%", width: `${ins.confidence}%`, background: toneColor }} />
      </div>
      <div className="nl-mono" style={{ fontSize: 11.5, color: toneColor }}>{ins.impact}</div>
    </div>
  );
}
