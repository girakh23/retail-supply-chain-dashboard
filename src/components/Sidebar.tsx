import { NavLink } from "react-router-dom";
import { LayoutGrid, Boxes, Tags, Sparkles, Radio, FileBarChart, Settings } from "lucide-react";

const NAV = [
  { to: "/overview", label: "Overview", icon: LayoutGrid, color: "#3D7BFF" },
  { to: "/inventory", label: "Inventory", icon: Boxes, color: "#12B886" },
  { to: "/pricing", label: "Pricing", icon: Tags, color: "#7C5CFC" },
  { to: "/insights", label: "AI Insights", icon: Sparkles, color: "#FF5D8F" },
];

const SOON = [
  { label: "Reports", icon: FileBarChart },
  { label: "Settings", icon: Settings },
];

interface SidebarProps {
  open: boolean;
}

export function Sidebar({ open }: SidebarProps) {
  return (
    <div
      style={{
        width: open ? 216 : 72, flexShrink: 0, borderRight: "1px solid var(--border)", background: "var(--panel)",
        display: "flex", flexDirection: "column", padding: "18px 10px",
        transition: "width 0.22s ease", overflow: "hidden",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "0 6px", marginBottom: 26, justifyContent: open ? "flex-start" : "center" }}>
        <div style={{ width: 32, height: 32, borderRadius: 8, background: "linear-gradient(135deg,#F2A93B,#34D8C4)", flexShrink: 0 }} />
        {open && (
          <div style={{ whiteSpace: "nowrap" }}>
            <div className="nl-display" style={{ fontWeight: 700, fontSize: 14, lineHeight: 1.15 }}>Retail Analytics</div>
            <div style={{ fontSize: 10, color: "var(--muted-2)", display: "flex", alignItems: "center", gap: 4 }}>
              <Radio size={9} color="var(--teal)" /> Live demo
            </div>
          </div>
        )}
      </div>

      {open && <div style={{ fontSize: 10.5, color: "var(--muted-2)", letterSpacing: 0.6, padding: "0 8px", marginBottom: 6, whiteSpace: "nowrap" }} className="nl-mono">MAIN</div>}
      <nav style={{ display: "flex", flexDirection: "column", gap: 2, marginBottom: 22 }}>
        {NAV.map((n) => {
          const Icon = n.icon;
          return (
            <NavLink key={n.to} to={n.to} className="nl-navlink" title={open ? undefined : n.label}>
              {({ isActive }) => (
                <div
                  style={{
                    display: "flex", alignItems: "center", gap: 10, padding: "9px 10px", borderRadius: 8, cursor: "pointer",
                    justifyContent: open ? "flex-start" : "center",
                    background: isActive ? `${n.color}14` : "transparent",
                    color: isActive ? n.color : "var(--muted)",
                    borderLeft: isActive ? `2px solid ${n.color}` : "2px solid transparent",
                  }}
                >
                  <Icon size={16} color={isActive ? n.color : "var(--muted)"} style={{ flexShrink: 0 }} />
                  {open && <span style={{ fontSize: 13, fontWeight: isActive ? 600 : 500, whiteSpace: "nowrap" }}>{n.label}</span>}
                </div>
              )}
            </NavLink>
          );
        })}
      </nav>

      {open && <div style={{ fontSize: 10.5, color: "var(--muted-2)", letterSpacing: 0.6, padding: "0 8px", marginBottom: 6, whiteSpace: "nowrap" }} className="nl-mono">MORE</div>}
      <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {SOON.map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} style={{ display: "flex", alignItems: "center", justifyContent: open ? "space-between" : "center", padding: "9px 10px", borderRadius: 8, opacity: 0.5 }} title={open ? undefined : s.label}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <Icon size={16} color="var(--muted)" style={{ flexShrink: 0 }} />
                {open && <span style={{ fontSize: 13, color: "var(--muted)", whiteSpace: "nowrap" }}>{s.label}</span>}
              </div>
              {open && <span className="nl-mono" style={{ fontSize: 9, color: "var(--muted-2)", border: "1px solid var(--border)", borderRadius: 4, padding: "1px 5px" }}>SOON</span>}
            </div>
          );
        })}
      </div>

      <div style={{ flex: 1 }} />

      <div className="nl-panel-2" style={{ display: "flex", alignItems: "center", gap: 10, padding: 10, justifyContent: open ? "flex-start" : "center" }}>
        <div style={{ width: 30, height: 30, borderRadius: 999, background: "linear-gradient(135deg,#8B7CF6,#4C8DFF)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, flexShrink: 0 }}>JL</div>
        {open && (
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 12, fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>Jenn Linsley</div>
            <div style={{ fontSize: 10.5, color: "var(--muted)", whiteSpace: "nowrap" }}>Retail Ops Lead</div>
          </div>
        )}
      </div>
    </div>
  );
}
