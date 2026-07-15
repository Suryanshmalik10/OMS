import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { DataTable, type Column } from "@/components/data-table";
import { TableActions } from "@/components/table-actions";
import { StatusBadge } from "@/components/status-badge";
import { projects, customers, type Project } from "@/mocks";
import { format } from "date-fns";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";

export const Route = createFileRoute("/_app/tables/projects")({
  head: () => ({ meta: [{ title: "Projects · RailTel OMS" }] }),
  component: ProjectsPage,
});

const cols: Column<Project>[] = [
  { key: "project_id", header: "ID", mono: true, render: (r) => <span className="font-mono text-xs">{String(r.project_id).padStart(2, "0")}</span> },
  { key: "customer_id", header: "Customer", render: (r) => customers.find((c) => c.customer_id === r.customer_id)?.customer_name ?? "—" },
  { key: "project_code", header: "Code", mono: true },
  { key: "project_name", header: "Project" },
  { key: "ip_address", header: "IP", mono: true },
  { key: "host_name", header: "Host", mono: true, className: "max-w-[220px] truncate" },
  { key: "status", header: "Status", render: (r) => <StatusBadge value={r.status} pulse /> },
  { key: "updated_on", header: "Updated", render: (r) => <span className="font-mono text-xs text-muted-foreground">{format(new Date(r.updated_on), "dd MMM yyyy")}</span> },
];

function ProjectsPage() {
  const [statusFilter, setStatusFilter] = useState("all");
  const rows = statusFilter === "all" ? projects : projects.filter((p) => p.status === statusFilter);

  return (
    <div className="space-y-4">
      <TableActions entity="Projects" columns={["project_id", "customer_id", "project_code", "project_name", "ip_address", "host_name", "status", "created_by", "created_on", "updated_by", "updated_on"]} templateFilename="projects_template.csv" />
      <DataTable
        rows={rows}
        columns={cols}
        searchKeys={["project_name", "project_code", "host_name", "ip_address"]}
        filters={
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="h-9 w-40"><SelectValue placeholder="Status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              <SelectItem value="Active">Active</SelectItem>
              <SelectItem value="Inactive">Inactive</SelectItem>
              <SelectItem value="Decommissioned">Decommissioned</SelectItem>
            </SelectContent>
          </Select>
        }
      />
    </div>
  );
}
