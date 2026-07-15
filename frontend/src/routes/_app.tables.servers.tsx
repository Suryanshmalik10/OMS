import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { DataTable, type Column } from "@/components/data-table";
import { TableActions } from "@/components/table-actions";
import { servers, variants, projects, MONTH_NAMES, type Server, type ServerType } from "@/mocks";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";

export const Route = createFileRoute("/_app/tables/servers")({
  head: () => ({ meta: [{ title: "Servers · RailTel OMS" }] }),
  component: ServersPage,
});

const serverTypeTone: Record<ServerType, string> = {
  Prod: "bg-success/10 text-success ring-success/30",
  Dev: "bg-info/10 text-info ring-info/30",
  Staging: "bg-warning/10 text-warning ring-warning/30",
  Testing: "bg-primary/10 text-primary ring-primary/30",
};

function TypeBadge({ value }: { value: ServerType }) {
  return (
    <span className={cn("inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ring-1 ring-inset", serverTypeTone[value])}>
      {value}
    </span>
  );
}

function DcDrBadge({ value }: { value: "DC" | "DR" }) {
  return (
    <span className={cn(
      "inline-flex items-center rounded-md px-2 py-0.5 font-mono text-xs font-semibold ring-1 ring-inset",
      value === "DC" ? "bg-primary/10 text-primary ring-primary/30" : "bg-warning/10 text-warning ring-warning/30",
    )}>{value}</span>
  );
}

function variantCell(variantId: number) {
  const v = variants.find((x) => x.variant_id === variantId);
  const p = v ? projects.find((pr) => pr.project_id === v.project_id) : undefined;
  return (
    <div className="min-w-0">
      <p className="truncate text-sm">{p?.project_name ?? "—"}</p>
      <p className="truncate text-xs text-muted-foreground">{v?.variant_name ?? "—"}</p>
    </div>
  );
}

const cols: Column<Server>[] = [
  { key: "server_id", header: "ID", mono: true },
  { key: "variant_id", header: "Project — Variant", render: (r) => variantCell(r.variant_id), className: "max-w-[240px]" },
  { key: "vm_name", header: "VM Name", mono: true },
  { key: "server_type", header: "Type", render: (r) => <TypeBadge value={r.server_type} /> },
  { key: "dc_dr", header: "DC/DR", render: (r) => <DcDrBadge value={r.dc_dr} /> },
  { key: "year", header: "Year", mono: true },
  { key: "month", header: "Month", render: (r) => <span className="text-xs">{MONTH_NAMES[r.month - 1]}</span> },
  { key: "service_name", header: "Service", render: (r) => <span className="text-xs">{r.service_name ?? "—"}</span> },
  { key: "serial_no", header: "Serial No.", mono: true, render: (r) => <span className="font-mono text-xs text-muted-foreground">{r.serial_no ?? "—"}</span> },
  { key: "ip_address", header: "IP Address", mono: true, render: (r) => <span className="font-mono text-xs">{r.ip_address ?? "—"}</span> },
  { key: "host_name", header: "Host Name", mono: true, render: (r) => <span className="font-mono text-xs text-muted-foreground">{r.host_name ?? "—"}</span> },
  { key: "updated_on", header: "Updated", render: (r) => <span className="font-mono text-xs text-muted-foreground">{format(new Date(r.updated_on), "dd MMM yyyy")}</span> },
];

const TEMPLATE: Array<[string, string]> = [
  ["Server ID", "server_id"],
  ["Project Variant", "variant_id"],
  ["VM Name", "vm_name"],
  ["Server Type", "server_type"],
  ["DC / DR", "dc_dr"],
  ["Year", "year"],
  ["Month", "month"],
  ["Service Name", "service_name"],
  ["Serial No.", "serial_no"],
  ["IP Address", "ip_address"],
  ["Host Name", "host_name"],
];

function ServersPage() {
  const [typeFilter, setTypeFilter] = useState("all");
  const rows = typeFilter === "all" ? servers : servers.filter((s) => s.server_type === typeFilter);

  return (
    <div className="space-y-4">
      <TableActions entity="Servers" columns={TEMPLATE} templateFilename="servers_template.csv" />
      <DataTable
        rows={rows}
        columns={cols}
        searchKeys={["vm_name", "service_name", "host_name", "ip_address"]}
        filters={
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="h-9 w-36"><SelectValue placeholder="Type" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All types</SelectItem>
              <SelectItem value="Prod">Prod</SelectItem>
              <SelectItem value="Dev">Dev</SelectItem>
              <SelectItem value="Staging">Staging</SelectItem>
              <SelectItem value="Testing">Testing</SelectItem>
            </SelectContent>
          </Select>
        }
      />
    </div>
  );
}
