import { useShellContext } from "../Shell";
import { InsightCard } from "../components/InsightCard";

export function Insights() {
  const { insights, loading } = useShellContext();

  if (loading) {
    return <div style={{ padding: 40, textAlign: "center", color: "var(--muted)", fontSize: 13 }}>Loading insights from API…</div>;
  }

  return (
    <div className="nl-fade-in" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 14 }}>
      {insights.map((ins) => <InsightCard key={ins.id} ins={ins} />)}
    </div>
  );
}
