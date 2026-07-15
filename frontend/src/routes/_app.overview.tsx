import { createFileRoute } from "@tanstack/react-router";
import { Building2, Activity, Server, RefreshCw } from "lucide-react";
import { KpiCard } from "@/components/kpi-card";
import { DataTable, type Column } from "@/components/data-table";
import { customerOverview, type CustomerOverview } from "@/mocks";
import { StatusBadge } from "@/components/status-badge";
import { formatDistanceToNow, format } from "date-fns";

export const Route = createFileRoute("/_app/overview")({
  head: () => ({ meta: [{ title: "Overview · RailTel OMS" }] }),
  component: OverviewPage,
});

const cols: Column<CustomerOverview>[] = [
  { key: "customer_id", header: "ID", mono: true, render: (r) => <span className="font-mono text-xs">{String(r.customer_id).padStart(3, "0")}</span> },
  { key: "customer_name", header: "Customer" },
  { key: "region_name", header: "Region" },
  { key: "state_code", header: "State", mono: true },
  { key: "total_projects", header: "Projects", mono: true },
  { key: "active_projects", header: "Active", mono: true },
  { key: "total_variants", header: "Variants", mono: true },
  { key: "live_variants", header: "Live", render: (r) => (
    <span className="inline-flex items-center gap-2">
      <span className="font-mono text-xs">{r.live_variants}</span>
      {r.live_variants > 0 && <StatusBadge value="Live" pulse />}
    </span>
  ) },
  { key: "total_servers", header: "Servers", mono: true },
  { key: "last_activity_on", header: "Last activity", render: (r) => <span className="font-mono text-xs text-muted-foreground">{format(new Date(r.last_activity_on), "dd MMM yyyy")}</span> },
];

function OverviewPage() {
  const totalCustomers = customerOverview.length;
  const totalActive = customerOverview.reduce((a, b) => a + b.active_projects, 0);
  const totalLive = customerOverview.reduce((a, b) => a + b.live_variants, 0);
  const totalServers = customerOverview.reduce((a, b) => a + b.total_servers, 0);
  const refreshed = customerOverview[0]?.refreshed_on ?? new Date().toISOString();

  return (
    <div className="space-y-6">
      <div>
        <div className="flex flex-wrap items-end justify-between gap-2">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Customer Overview</h1>
            <p className="text-sm text-muted-foreground">Auto-computed summary — read-only, refreshes from source of truth.</p>
          </div>
          <p className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
            <RefreshCw className="h-3 w-3" /> Last refreshed {formatDistanceToNow(new Date(refreshed), { addSuffix: true })}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <KpiCard label="Total Customers" value={totalCustomers} icon={Building2} tone="primary" />
        <KpiCard label="Active Projects" value={totalActive} icon={Activity} tone="success" />
        <KpiCard label="Live Variants" value={totalLive} icon={Activity} tone="info" />
        <KpiCard label="Total Servers" value={totalServers} icon={Server} tone="warning" />
      </div>

      <DataTable
        rows={customerOverview}
        columns={cols}
        searchKeys={["customer_name", "region_name", "state_code"]}
        pageSize={15}
      />
    </div>
  );
}
