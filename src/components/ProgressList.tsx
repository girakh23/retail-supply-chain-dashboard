interface ProgressRow {
  label: string;
  value: number; // 0-100
  color: string;
  suffix?: string;
}

export function ProgressList({ rows, loading }: { rows: ProgressRow[]; loading?: boolean }) {
  if (loading) {
    return <div style={{ padding: "20px 0", textAlign: "center", color: "var(--muted)", fontSize: 12.5 }}>Loading…</div>;
  }
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      {rows.map((r) => (
        <div key={r.label}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, fontSize: 12.5 }}>
            <span style={{ color: "var(--text)" }}>{r.label}</span>
            <span className="nl-mono" style={{ color: r.color, fontWeight: 600 }}>{r.value}{r.suffix ?? "%"}</span>
          </div>
          <div style={{ height: 6, borderRadius: 999, background: "var(--panel-3)", overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${r.value}%`, background: r.color, borderRadius: 999, transition: "width 0.4s ease" }} />
          </div>
        </div>
      ))}
    </div>
  );
}
