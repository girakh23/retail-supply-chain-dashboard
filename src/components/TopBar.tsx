import { useState } from "react";
import { useLocation } from "react-router-dom";
import { Search, Bell, ChevronDown, Calendar, Menu } from "lucide-react";
import type { Role } from "../types";

const PAGE_TITLES: Record<string, string> = {
  "/overview": "Overview",
  "/inventory": "Inventory",
  "/pricing": "Pricing",
  "/insights": "AI Insights",
};

const DATE_RANGES = ["Last 4 Weeks", "Last 8 Weeks", "Last Quarter"];

interface TopBarProps {
  role: Role;
  onRoleChange: (r: Role) => void;
  dateRange: string;
  onDateRangeChange: (r: string) => void;
  sidebarOpen: boolean;
  onToggleSidebar: () => void;
}

export function TopBar({ role, onRoleChange, dateRange, onDateRangeChange, sidebarOpen, onToggleSidebar }: TopBarProps) {
  const location = useLocation();
  const [dateOpen, setDateOpen] = useState(false);
  const title = PAGE_TITLES[location.pathname] ?? "Overview";

  return (
    <div style={{ padding: "14px 24px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, flexWrap: "wrap", background: "var(--canvas)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <button
          onClick={onToggleSidebar}
          title={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
          style={{ width: 32, height: 32, borderRadius: 8, background: "var(--panel-2)", border: "1px solid var(--border)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}
        >
          <Menu size={15} color="var(--muted)" />
        </button>
        <div>
          <div className="nl-display" style={{ fontSize: 19, fontWeight: 700 }}>{title}</div>
          <div style={{ fontSize: 11.5, color: "var(--muted-2)" }}>Retail Supply Chain Analytics Dashboard</div>
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6, background: "var(--panel-2)", border: "1px solid var(--border)", borderRadius: 8, padding: "7px 12px", width: 190 }}>
          <Search size={13} color="var(--muted)" />
          <input
            placeholder="Search dashboard…"
            style={{ background: "transparent", border: "none", outline: "none", color: "var(--text)", fontSize: 12.5, width: "100%" }}
          />
        </div>

        <div style={{ position: "relative" }}>
          <button
            onClick={() => setDateOpen((o) => !o)}
            className="nl-mono"
            style={{ display: "flex", alignItems: "center", gap: 7, background: "var(--panel-2)", border: "1px solid var(--border)", borderRadius: 8, padding: "7px 11px", fontSize: 11.5, color: "var(--text)", cursor: "pointer" }}
          >
            <Calendar size={13} color="var(--muted)" />
            {dateRange}
            <ChevronDown size={12} color="var(--muted)" />
          </button>
          {dateOpen && (
            <div className="nl-panel-2 nl-fade-in" style={{ position: "absolute", top: "calc(100% + 6px)", right: 0, zIndex: 20, minWidth: 150, padding: 4 }}>
              {DATE_RANGES.map((r) => (
                <div
                  key={r}
                  onClick={() => { onDateRangeChange(r); setDateOpen(false); }}
                  style={{ padding: "7px 10px", fontSize: 12, borderRadius: 6, cursor: "pointer", color: r === dateRange ? "var(--teal)" : "var(--text)", background: r === dateRange ? "var(--panel-3)" : "transparent" }}
                >
                  {r}
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={{ position: "relative" }}>
          <button style={{ width: 32, height: 32, borderRadius: 8, background: "var(--panel-2)", border: "1px solid var(--border)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Bell size={14} color="var(--muted)" />
          </button>
          <span style={{ position: "absolute", top: 6, right: 6, width: 6, height: 6, borderRadius: 999, background: "var(--rose)" }} />
        </div>

        <div className="nl-panel-2" style={{ display: "flex", padding: 3, gap: 2 }}>
          {(["analyst", "manager", "admin"] as Role[]).map((r) => (
            <button
              key={r}
              onClick={() => onRoleChange(r)}
              className="nl-mono"
              style={{
                padding: "6px 11px", fontSize: 11, borderRadius: 6, border: "none", cursor: "pointer",
                textTransform: "uppercase", letterSpacing: 0.4,
                background: role === r ? "var(--teal)" : "transparent",
                color: role === r ? "#04211C" : "var(--muted)",
                fontWeight: 600,
              }}
            >
              {r}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
