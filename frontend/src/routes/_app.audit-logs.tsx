import { createFileRoute } from "@tanstack/react-router";
import { DataTable, type Column } from "@/components/data-table";
import { auditLogs, type AuditLog } from "@/mocks";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/_app/audit-logs")({
  head: () => ({ meta: [{ title: "Audit Logs · RailTel OMS" }] }),
  component: AuditPage,
});

const actionTone: Record<string, string> = {
  INSERT: "bg-success/12 text-success",
  UPDATE: "bg-info/12 text-info",
  DELETE: "bg-destructive/12 text-destructive",
  LOGIN: "bg-primary/12 text-primary",
  EXPORT: "bg-warning/15 text-warning",
};

const cols: Column<AuditLog>[] = [
  { key: "timestamp", header: "Time", render: (r) => <span className="font-mono text-xs">{format(new Date(r.timestamp), "dd MMM yyyy HH:mm")}</span> },
  { key: "actor", header: "Actor", mono: true },
  { key: "action", header: "Action", render: (r) => <Badge variant="outline" className={"font-mono text-[10px] " + (actionTone[r.action] ?? "")}>{r.action}</Badge> },
  { key: "entity", header: "Entity", mono: true },
  { key: "entity_id", header: "Row", mono: true },
  { key: "ip", header: "IP", mono: true },
];

function AuditPage() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Audit Logs</h1>
        <p className="text-sm text-muted-foreground">Immutable trail of every change across the platform.</p>
      </div>
      <DataTable rows={auditLogs} columns={cols} searchKeys={["actor", "entity", "action"]} pageSize={15} />
    </div>
  );
}
