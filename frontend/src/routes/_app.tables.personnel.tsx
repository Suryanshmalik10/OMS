import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { DataTable, type Column } from "@/components/data-table";
import { TableActions } from "@/components/table-actions";
import { personnel, variants, projects, type Personnel, type PersonnelRole } from "@/mocks";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { AlertCircle } from "lucide-react";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";

export const Route = createFileRoute("/_app/tables/personnel")({
  head: () => ({ meta: [{ title: "Personnel · RailTel OMS" }] }),
  component: PersonnelPage,
});

const roleTone: Record<PersonnelRole, string> = {
  "PMT Primary": "bg-primary/10 text-primary ring-primary/30",
  "System Admin Primary": "bg-info/10 text-info ring-info/30",
  "Module Lead": "bg-warning/10 text-warning ring-warning/30",
};

function RoleBadge({ value }: { value: PersonnelRole }) {
  return (
    <span className={cn("inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ring-1 ring-inset", roleTone[value])}>
      {value}
    </span>
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

const cols: Column<Personnel>[] = [
  { key: "personnel_id", header: "ID", mono: true },
  { key: "variant_id", header: "Project — Variant", render: (r) => variantCell(r.variant_id), className: "max-w-[260px]" },
  { key: "full_name", header: "Full Name" },
  { key: "role_type", header: "Role", render: (r) => <RoleBadge value={r.role_type} /> },
  { key: "updated_on", header: "Updated", render: (r) => <span className="font-mono text-xs text-muted-foreground">{format(new Date(r.updated_on), "dd MMM yyyy")}</span> },
];

const TEMPLATE: Array<[string, string]> = [
  ["Personnel ID", "personnel_id"],
  ["Project Variant", "variant_id"],
  ["Full Name", "full_name"],
  ["Role Type", "role_type"],
];

function PersonnelPage() {
  const [roleFilter, setRoleFilter] = useState("all");
  const [duplicateAttempt, setDuplicateAttempt] = useState<{ variantId: number; role: PersonnelRole } | null>(null);

  const rows = roleFilter === "all" ? personnel : personnel.filter((p) => p.role_type === roleFilter);

  // Mock validation demo — pick a variant that already has a PMT Primary, illustrating the guard.
  const demoConflict = useMemo(() => {
    const seen = new Map<string, boolean>();
    for (const p of personnel) {
      const k = `${p.variant_id}:${p.role_type}`;
      if (seen.get(k)) return { variantId: p.variant_id, role: p.role_type };
      seen.set(k, true);
    }
    return null;
  }, []);

  return (
    <div className="space-y-4">
      <TableActions entity="Personnel" columns={TEMPLATE} templateFilename="personnel_template.csv" />

      {duplicateAttempt && (
        <div className="flex items-center gap-2 rounded-md border border-destructive/40 bg-destructive/5 px-3 py-2 text-sm text-destructive">
          <AlertCircle className="h-4 w-4" />
          This variant already has a {duplicateAttempt.role} assigned.
          <button className="ml-auto text-xs underline" onClick={() => setDuplicateAttempt(null)}>Dismiss</button>
        </div>
      )}

      <DataTable
        rows={rows}
        columns={cols}
        searchKeys={["full_name", "role_type"]}
        filters={
          <div className="flex items-center gap-2">
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="h-9 w-44"><SelectValue placeholder="Role" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All roles</SelectItem>
                <SelectItem value="PMT Primary">PMT Primary</SelectItem>
                <SelectItem value="System Admin Primary">System Admin Primary</SelectItem>
                <SelectItem value="Module Lead">Module Lead</SelectItem>
              </SelectContent>
            </Select>
            {demoConflict && (
              <button
                onClick={() => setDuplicateAttempt(demoConflict)}
                className="hidden text-xs text-muted-foreground underline hover:text-foreground sm:inline"
                title="Preview the mock duplicate-role validation"
              >
                Preview duplicate-role warning
              </button>
            )}
          </div>
        }
      />
    </div>
  );
}
