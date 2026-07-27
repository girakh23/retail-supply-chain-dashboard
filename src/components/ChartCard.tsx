import type { ReactNode } from "react";

interface ChartCardProps {
  title: string;
  action?: ReactNode;
  children: ReactNode;
  span?: number; // grid column span, 1-4
}

export function ChartCard({ title, action, children, span }: ChartCardProps) {
  return (
    <div className="nl-panel nl-fade-in" style={{ padding: 18, gridColumn: span ? `span ${span}` : undefined }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
        <div className="nl-display" style={{ fontWeight: 600, fontSize: 14.5 }}>{title}</div>
        {action}
      </div>
      {children}
    </div>
  );
}

export function TabToggle({ options, value, onChange }: { options: string[]; value: string; onChange: (v: string) => void }) {
  return (
    <div className="nl-panel-2" style={{ display: "flex", padding: 3, gap: 2 }}>
      {options.map((opt) => (
        <button
          key={opt}
          onClick={() => onChange(opt)}
          className="nl-mono"
          style={{
            padding: "4px 10px", fontSize: 11, borderRadius: 6, border: "none", cursor: "pointer",
            background: value === opt ? "var(--teal)" : "transparent",
            color: value === opt ? "#04211C" : "var(--muted)",
            fontWeight: 600,
          }}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}
