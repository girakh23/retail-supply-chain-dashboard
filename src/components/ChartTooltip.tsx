interface TooltipPayloadItem {
  name?: string;
  value?: number | string;
  color?: string;
  dataKey?: string;
}

export function ChartTooltip({ active, payload, label }: { active?: boolean; payload?: TooltipPayloadItem[]; label?: string }) {
  if (!active || !payload || !payload.length) return null;
  return (
    <div
      className="nl-panel-3"
      style={{ padding: "8px 12px", borderRadius: 8, fontSize: 12, boxShadow: "0 8px 24px -8px rgba(0,0,0,0.6)" }}
    >
      {label && <div className="nl-mono" style={{ color: "var(--muted)", fontSize: 10.5, marginBottom: 4 }}>{label}</div>}
      {payload.map((p, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: 6, marginTop: i ? 3 : 0 }}>
          <span style={{ width: 7, height: 7, borderRadius: 999, background: p.color, display: "inline-block", flexShrink: 0 }} />
          <span style={{ color: "var(--muted)" }}>{p.name}:</span>
          <span className="nl-mono" style={{ fontWeight: 600 }}>{p.value}</span>
        </div>
      ))}
    </div>
  );
}
