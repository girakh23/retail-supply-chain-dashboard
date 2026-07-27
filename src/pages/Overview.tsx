import { useEffect, useState } from "react";
import { Sparkles, Boxes, AlertTriangle, TrendingUp, ArrowUpRight, PieChart as PieIcon, MapPin } from "lucide-react";
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import { useShellContext } from "../Shell";
import { fetchPriceTrend, fetchInventoryByCategory, fetchRegionalPerformance, fetchStatusBreakdown, CATEGORIES } from "../api";
import type { TrendPoint, CategoryInventory, RegionalPerformance, StatusBreakdownSlice } from "../types";
import { InsightCard } from "../components/InsightCard";
import { KpiCard } from "../components/KpiCard";
import { ChartCard, TabToggle } from "../components/ChartCard";
import { ChartTooltip } from "../components/ChartTooltip";
import { ProgressList } from "../components/ProgressList";

export function Overview() {
  const { skus, insights, loading, dateRange } = useShellContext();
  const [trendCategory, setTrendCategory] = useState("Produce");
  const [chartMode, setChartMode] = useState<"Weekly" | "Cumulative">("Weekly");
  const [trend, setTrend] = useState<TrendPoint[]>([]);
  const [inventoryByCategory, setInventoryByCategory] = useState<CategoryInventory[]>([]);
  const [regional, setRegional] = useState<RegionalPerformance[]>([]);
  const [statusBreakdown, setStatusBreakdown] = useState<StatusBreakdownSlice[]>([]);

  useEffect(() => { fetchPriceTrend(trendCategory).then(setTrend); }, [trendCategory]);
  useEffect(() => { fetchInventoryByCategory().then(setInventoryByCategory); }, []);
  useEffect(() => { fetchRegionalPerformance().then(setRegional); }, []);
  useEffect(() => { fetchStatusBreakdown().then(setStatusBreakdown); }, []);

  const displayTrend = chartMode === "Cumulative"
    ? trend.reduce<TrendPoint[]>((acc, p, i) => {
        const prevTotal = i > 0 ? acc[i - 1].price : 0;
        acc.push({ week: p.week, price: +(prevTotal + p.price / 4).toFixed(2) });
        return acc;
      }, [])
    : trend;

  const avgMargin = skus.length ? (skus.reduce((a, b) => a + b.margin, 0) / skus.length).toFixed(1) : "—";
  const lowStock = skus.filter((s) => s.status !== "In Stock").length;
  const pricesUp = skus.filter((s) => s.price > s.prevPrice).length;

  return (
    <div className="nl-fade-in" style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      {/* KPI row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16 }}>
        <KpiCard
          label="Active SKUs" value={skus.length || "—"} icon={Boxes} loading={loading}
          bg="linear-gradient(135deg,#3D7BFF,#2F5FDB)" footerBg="#2955C7"
          sub={`Across ${CATEGORIES.length} categories`}
        />
        <KpiCard
          label="Low / Backordered" value={lowStock} icon={AlertTriangle} loading={loading}
          bg="linear-gradient(135deg,#FFAF3D,#F5891F)" footerBg="#D96F14"
          trend={{ value: "9 SKUs", positive: false }}
        />
        <KpiCard
          label="Avg. Margin" value={`${avgMargin}%`} icon={TrendingUp} loading={loading}
          bg="linear-gradient(135deg,#20D399,#0EA57A)" footerBg="#0B8C67"
          trend={{ value: "+1.4%", positive: true }}
        />
        <KpiCard
          label="Prices Trending Up" value={pricesUp} icon={ArrowUpRight} loading={loading}
          bg="linear-gradient(135deg,#9B7BFF,#7C5CFC)" footerBg="#6A48E0"
          sub={`of ${skus.length || "—"} total SKUs`}
        />
        <KpiCard
          label="AI Recommendations" value={insights.length} icon={Sparkles} loading={loading}
          bg="linear-gradient(135deg,#FF6FA5,#F5457F)" footerBg="#D9366A"
          sub={dateRange}
        />
      </div>

      {/* hero chart + donut */}
      <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: 18 }}>
        <div className="nl-panel" style={{ overflow: "hidden" }}>
          <div style={{ background: "linear-gradient(135deg,#3D7BFF,#2F5FDB)", padding: "18px 20px 8px", color: "#fff" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
              <div className="nl-display" style={{ fontWeight: 700, fontSize: 15 }}>Price Trend</div>
              <div style={{ display: "flex", gap: 8 }}>
                <TabToggle options={["Weekly", "Cumulative"]} value={chartMode} onChange={(v) => setChartMode(v as "Weekly" | "Cumulative")} />
                <select
                  value={trendCategory}
                  onChange={(e) => setTrendCategory(e.target.value)}
                  className="nl-mono"
                  style={{ background: "rgba(255,255,255,0.18)", color: "#fff", border: "1px solid rgba(255,255,255,0.3)", borderRadius: 6, padding: "4px 8px", fontSize: 11.5 }}
                >
                  {CATEGORIES.map((c) => <option key={c} value={c} style={{ color: "#1A2036" }}>{c}</option>)}
                </select>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={190}>
              <AreaChart data={displayTrend} margin={{ top: 6, left: -20, right: 6, bottom: 0 }}>
                <defs>
                  <linearGradient id="heroFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#fff" stopOpacity={0.55} />
                    <stop offset="100%" stopColor="#fff" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Area type="monotone" dataKey="price" name={`${trendCategory} price`} stroke="#fff" strokeWidth={2.5} fill="url(#heroFill)" dot={false} activeDot={{ r: 5, fill: "#fff" }} />
                <Tooltip content={<ChartTooltip />} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div style={{ display: "flex", padding: "16px 20px", gap: 32 }}>
            <div>
              <div className="nl-display" style={{ fontSize: 20, fontWeight: 700 }}>${displayTrend.length ? displayTrend[displayTrend.length - 1].price.toFixed(2) : "—"}</div>
              <div style={{ fontSize: 11.5, color: "var(--muted)" }}>Current avg. price</div>
            </div>
            <div>
              <div className="nl-display" style={{ fontSize: 20, fontWeight: 700 }}>{trendCategory}</div>
              <div style={{ fontSize: 11.5, color: "var(--muted)" }}>Category tracked</div>
            </div>
          </div>
        </div>

        <ChartCard title="SKU Status Breakdown" action={<PieIcon size={15} color="var(--muted)" />}>
          <ResponsiveContainer width="100%" height={170}>
            <PieChart>
              <Pie data={statusBreakdown} dataKey="count" nameKey="status" innerRadius={48} outerRadius={70} paddingAngle={3}>
                {statusBreakdown.map((s, i) => <Cell key={i} fill={s.color} stroke="var(--panel)" strokeWidth={2} />)}
              </Pie>
              <Tooltip content={<ChartTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 8 }}>
            {statusBreakdown.map((s) => (
              <div key={s.status} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: 12 }}>
                <span style={{ display: "flex", alignItems: "center", gap: 7 }}>
                  <span style={{ width: 8, height: 8, borderRadius: 999, background: s.color, display: "inline-block" }} />
                  {s.status}
                </span>
                <span className="nl-mono" style={{ color: "var(--muted)" }}>{s.count}</span>
              </div>
            ))}
          </div>
        </ChartCard>
      </div>

      {/* second charts row */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
        <ChartCard title="Inventory vs. Reorder Point">
          <ResponsiveContainer width="100%" height={230}>
            <BarChart data={inventoryByCategory} layout="vertical" margin={{ left: 10 }}>
              <CartesianGrid stroke="#E6E9F2" strokeDasharray="3 3" horizontal={false} />
              <XAxis type="number" stroke="#98A2B8" fontSize={11} />
              <YAxis type="category" dataKey="category" stroke="#98A2B8" fontSize={10.5} width={82} />
              <Tooltip content={<ChartTooltip />} cursor={{ fill: "rgba(61,123,255,0.06)" }} />
              <Legend wrapperStyle={{ fontSize: 11.5, color: "var(--muted)" }} />
              <Bar dataKey="onHand" fill="#3D7BFF" radius={[0, 4, 4, 0]} name="On hand" />
              <Bar dataKey="reorder" fill="#FFAF3D" radius={[0, 4, 4, 0]} name="Reorder target" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Regional Fulfillment Health" action={<MapPin size={14} color="var(--muted)" />}>
          <ProgressList
            loading={regional.length === 0}
            rows={regional.map((r) => ({ label: r.region, value: r.score, color: r.color }))}
          />
        </ChartCard>
      </div>

      {/* AI insights */}
      <ChartCard title="Top AI Recommendations" action={<Sparkles size={15} color="var(--teal)" />}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))", gap: 12 }}>
          {insights.slice(0, 4).map((ins) => <InsightCard key={ins.id} ins={ins} compact />)}
        </div>
      </ChartCard>
    </div>
  );
}
