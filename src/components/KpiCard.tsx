import type { LucideIcon } from "lucide-react";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

interface KpiCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  bg: string;       // main card background (color or gradient)
  footerBg: string; // darker footer strip background
  trend?: { value: string; positive: boolean };
  sub?: string;
  loading?: boolean;
}

/** Bold, color-blocked KPI card: colored body + icon badge + darker footer trend strip. */
export function KpiCard({ label, value, icon: Icon, bg, footerBg, trend, sub, loading }: KpiCardProps) {
  return (
    <div
      className="nl-hover-lift"
      style={{
        borderRadius: 16, overflow: "hidden", background: bg, color: "#fff",
        boxShadow: "0 10px 26px -14px rgba(30,41,79,0.35)", display: "flex", flexDirection: "column",
      }}
    >
      <div style={{ padding: "18px 18px 16px", display: "flex", flexDirection: "column", gap: 14 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <div className="nl-display" style={{ fontSize: 26, fontWeight: 700, lineHeight: 1.1 }}>
              {loading ? "—" : value}
            </div>
            <div style={{ fontSize: 12.5, opacity: 0.92, marginTop: 4, fontWeight: 500 }}>{label}</div>
            {sub && <div style={{ fontSize: 11, opacity: 0.75, marginTop: 2 }}>{sub}</div>}
          </div>
          <div style={{ width: 38, height: 38, borderRadius: 10, background: "rgba(255,255,255,0.22)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <Icon size={18} color="#fff" />
          </div>
        </div>
      </div>
      <div style={{ background: footerBg, padding: "9px 18px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ fontSize: 11, opacity: 0.85 }}>vs last period</span>
        {trend && (
          <span className="nl-mono" style={{ display: "inline-flex", alignItems: "center", gap: 3, fontSize: 11.5, fontWeight: 600 }}>
            {trend.positive ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
            {trend.value}
          </span>
        )}
      </div>
    </div>
  );
}
