import { useEffect, useState } from "react";
import { Outlet, useOutletContext } from "react-router-dom";
import { Tokens, useGoogleFonts } from "./components/Tokens";
import { Sidebar } from "./components/Sidebar";
import { TopBar } from "./components/TopBar";
import { fetchSkus, fetchAiInsights } from "./api";
import type { Role, Sku, Insight } from "./types";

export interface ShellContext {
  skus: Sku[];
  insights: Insight[];
  loading: boolean;
  role: Role;
  dateRange: string;
}

/** Typed hook so route pages can pull shared data loaded once at the Shell level. */
export function useShellContext() {
  return useOutletContext<ShellContext>();
}

/**
 * App shell: labeled sidebar nav, top bar (search / date range / role switcher),
 * and the routed page content. Loads SKU + AI insight data once via the mock
 * REST layer in api.ts and hands it down to routed pages through
 * <Outlet context>.
 */
export function Shell() {
  useGoogleFonts();

  const [role, setRole] = useState<Role>("manager");
  const [dateRange, setDateRange] = useState("Last 8 Weeks");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [skus, setSkus] = useState<Sku[]>([]);
  const [insights, setInsights] = useState<Insight[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    Promise.all([fetchSkus(), fetchAiInsights()])
      .then(([skuData, insightData]) => {
        if (cancelled) return;
        setSkus(skuData);
        setInsights(insightData);
        setError(null);
      })
      .catch(() => !cancelled && setError("Could not load data from the API."))
      .finally(() => !cancelled && setLoading(false));
    return () => { cancelled = true; };
  }, []);

  return (
    <div className="nl-root" style={{ minHeight: 680, width: "100%", display: "flex", borderRadius: 12, overflow: "hidden" }}>
      <Tokens />
      <Sidebar open={sidebarOpen} />

      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        <TopBar
          role={role} onRoleChange={setRole}
          dateRange={dateRange} onDateRangeChange={setDateRange}
          sidebarOpen={sidebarOpen} onToggleSidebar={() => setSidebarOpen((o) => !o)}
        />

        <div style={{ flex: 1, overflow: "auto", padding: 24 }} className="nl-scroll">
          {error && <div style={{ color: "var(--danger)", marginBottom: 12, fontSize: 13 }}>{error}</div>}
          <Outlet context={{ skus, insights, loading, role, dateRange } satisfies ShellContext} />
        </div>
      </div>
    </div>
  );
}
