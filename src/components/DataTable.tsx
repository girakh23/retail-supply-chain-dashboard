import { useEffect, useMemo, useState } from "react";
import { Search, ChevronLeft, ChevronRight, ShieldCheck, ArrowUpRight, ArrowDownRight } from "lucide-react";
import type { Role, Sku, SkuStatus } from "../types";
import { StatusPill } from "./Pill";
import { CATEGORIES } from "../api";

const STATUS_OPTIONS: SkuStatus[] = ["In Stock", "Low Stock", "Backordered"];

const CATEGORY_COLORS: Record<string, string> = {
  Produce: "#12B886",
  Dairy: "#3D7BFF",
  Bakery: "#F5A524",
  Beverages: "#7C5CFC",
  Snacks: "#FF5D8F",
  Household: "#2BB8C4",
  "Health & Beauty": "#F1494F",
  Frozen: "#5C7CFA",
};

const ROLE_COLUMNS: Record<Role, (keyof Sku | "id" | "stockLevel")[]> = {
  analyst: ["id", "name", "category", "region", "velocity", "stockLevel", "status"],
  manager: ["id", "name", "category", "price", "margin", "stockLevel", "status"],
  admin: ["id", "name", "category", "region", "price", "margin", "velocity", "stockLevel", "status"],
};

const th: React.CSSProperties = { padding: "10px 10px", fontWeight: 600, whiteSpace: "nowrap", fontSize: 11, textTransform: "uppercase", letterSpacing: 0.4 };
const td: React.CSSProperties = { padding: "10px 10px", whiteSpace: "nowrap" };

function StockLevelBar({ inventory, reorderPoint }: { inventory: number; reorderPoint: number }) {
  const ratio = Math.min(100, Math.round((inventory / (reorderPoint * 2)) * 100));
  const color = ratio < 35 ? "var(--danger)" : ratio < 65 ? "var(--amber)" : "var(--good)";
  return (
    <div style={{ width: 84 }}>
      <div style={{ height: 5, borderRadius: 999, background: "var(--panel-3)", overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${ratio}%`, background: color, borderRadius: 999 }} />
      </div>
    </div>
  );
}
const selStyle: React.CSSProperties = { background: "var(--panel-2)", color: "var(--text)", border: "1px solid var(--border)", borderRadius: 8, padding: "6px 10px", fontSize: 12 };

function pageBtn(disabled: boolean): React.CSSProperties {
  return {
    width: 26, height: 26, borderRadius: 6, border: "1px solid var(--border)",
    background: "var(--panel-2)", color: disabled ? "#4A5876" : "var(--text)",
    cursor: disabled ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center",
  };
}

interface DataTableProps {
  rows: Sku[];
  loading: boolean;
  role: Role;
  pageSize?: number;
}

/** Reusable table: search + category/status filtering + client-side pagination + role-based columns. */
export function DataTable({ rows, loading, role, pageSize = 8 }: DataTableProps) {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState<"All" | SkuStatus>("All");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    return rows.filter((s) => {
      const matchesSearch =
        search.trim() === "" ||
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.id.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = categoryFilter === "All" || s.category === categoryFilter;
      const matchesStatus = statusFilter === "All" || s.status === statusFilter;
      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [rows, search, categoryFilter, statusFilter]);

  useEffect(() => setPage(1), [search, categoryFilter, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const pageRows = filtered.slice((page - 1) * pageSize, page * pageSize);
  const cols = ROLE_COLUMNS[role];

  return (
    <div className="nl-fade-in nl-panel" style={{ padding: 20 }}>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 16, alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6, background: "var(--panel-2)", border: "1px solid var(--border)", borderRadius: 8, padding: "6px 10px", flex: "1 1 220px" }}>
          <Search size={14} color="var(--muted)" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search SKU or name…"
            style={{ background: "transparent", border: "none", outline: "none", color: "var(--text)", fontSize: 12.5, width: "100%" }}
          />
        </div>
        <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className="nl-mono" style={selStyle}>
          <option value="All">All categories</option>
          {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as "All" | SkuStatus)} className="nl-mono" style={selStyle}>
          <option value="All">All statuses</option>
          {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {loading ? (
        <div style={{ padding: 40, textAlign: "center", color: "var(--muted)", fontSize: 13 }}>Loading from API…</div>
      ) : (
        <>
          <div style={{ overflowX: "auto", maxHeight: 420, overflowY: "auto", borderRadius: 8, border: "1px solid var(--border-soft)" }} className="nl-scroll">
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12.5 }}>
              <thead>
                <tr style={{ textAlign: "left", color: "var(--muted)", background: "var(--panel-2)", position: "sticky", top: 0, zIndex: 1 }}>
                  {cols.includes("id") && <th style={th}>SKU</th>}
                  {cols.includes("name") && <th style={th}>Name</th>}
                  {cols.includes("category") && <th style={th}>Category</th>}
                  {cols.includes("region") && <th style={th}>Region</th>}
                  {cols.includes("price") && <th style={th}>Price</th>}
                  {cols.includes("margin") && <th style={th}>Margin</th>}
                  {cols.includes("velocity") && <th style={th}>Velocity/wk</th>}
                  {cols.includes("stockLevel") && <th style={th}>Stock Level</th>}
                  {cols.includes("status") && <th style={th}>Status</th>}
                </tr>
              </thead>
              <tbody>
                {pageRows.map((r, i) => (
                  <tr
                    key={r.id}
                    style={{ borderBottom: "1px solid var(--border)", background: i % 2 === 1 ? "var(--panel-2)" : "transparent" }}
                  >
                    {cols.includes("id") && <td className="nl-mono" style={{ ...td, color: "var(--muted)" }}>{r.id}</td>}
                    {cols.includes("name") && <td style={{ ...td, fontWeight: 500 }}>{r.name}</td>}
                    {cols.includes("category") && (
                      <td style={{ ...td, color: "var(--muted)" }}>
                        <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                          <span style={{ width: 7, height: 7, borderRadius: 999, background: CATEGORY_COLORS[r.category] ?? "var(--muted)", display: "inline-block", flexShrink: 0 }} />
                          {r.category}
                        </span>
                      </td>
                    )}
                    {cols.includes("region") && <td style={{ ...td, color: "var(--muted)" }}>{r.region}</td>}
                    {cols.includes("price") && (
                      <td className="nl-mono" style={td}>
                        <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
                          ${r.price.toFixed(2)}
                          {r.price > r.prevPrice ? <ArrowUpRight size={12} color="var(--good)" /> : <ArrowDownRight size={12} color="var(--danger)" />}
                        </span>
                      </td>
                    )}
                    {cols.includes("margin") && <td className="nl-mono" style={td}>{r.margin}%</td>}
                    {cols.includes("velocity") && <td className="nl-mono" style={td}>{r.velocity}</td>}
                    {cols.includes("stockLevel") && <td style={td}><StockLevelBar inventory={r.inventory} reorderPoint={r.reorderPoint} /></td>}
                    {cols.includes("status") && <td style={td}><StatusPill status={r.status} /></td>}
                  </tr>
                ))}
                {pageRows.length === 0 && (
                  <tr><td colSpan={9} style={{ padding: 24, textAlign: "center", color: "var(--muted)" }}>No SKUs match these filters.</td></tr>
                )}
              </tbody>
            </table>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 14 }}>
            <span style={{ fontSize: 11.5, color: "var(--muted)" }}>
              Showing {pageRows.length === 0 ? 0 : (page - 1) * pageSize + 1}–{Math.min(page * pageSize, filtered.length)} of {filtered.length}
            </span>
            <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
              <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} style={pageBtn(page === 1)}><ChevronLeft size={14} /></button>
              <span className="nl-mono" style={{ fontSize: 12, color: "var(--muted)" }}>{page} / {totalPages}</span>
              <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages} style={pageBtn(page === totalPages)}><ChevronRight size={14} /></button>
            </div>
          </div>
          <div style={{ marginTop: 10, fontSize: 11, color: "var(--muted)", display: "flex", alignItems: "center", gap: 6 }}>
            <ShieldCheck size={13} /> Columns shown reflect the <strong style={{ color: "var(--text)" }}>{role}</strong> role.
          </div>
        </>
      )}
    </div>
  );
}
