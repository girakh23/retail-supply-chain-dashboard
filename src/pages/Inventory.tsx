import { useShellContext } from "../Shell";
import { DataTable } from "../components/DataTable";

export function Inventory() {
  const { skus, loading, role } = useShellContext();
  return <DataTable rows={skus} loading={loading} role={role} />;
}
