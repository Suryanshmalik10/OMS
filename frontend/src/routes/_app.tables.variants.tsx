import { createFileRoute } from "@tanstack/react-router";
import { DataTable, type Column } from "@/components/data-table";
import { TableActions } from "@/components/table-actions";
import { StatusBadge } from "@/components/status-badge";
import { variants, projects, personnel, type Variant, type CaseType } from "@/mocks";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_app/tables/variants")({
  head: () => ({ meta: [{ title: "Project Variants · RailTel OMS" }] }),
  component: VariantsPage,
});

const caseTypeTone: Record<CaseType, string> = {
  "NIC MoU": "bg-primary/10 text-primary ring-primary/30",
  "Non-MoU": "bg-muted text-muted-foreground ring-border",
};

function CaseTypeBadge({ value }: { value: CaseType }) {
  return (
    <span className={cn("inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ring-1 ring-inset", caseTypeTone[value])}>
      {value}
    </span>
  );
}

const cols: Column<Variant>[] = [
  { key: "variant_id", header: "ID", mono: true },
  { key: "project_id", header: "Project", render: (r) => projects.find((p) => p.project_id === r.project_id)?.project_code ?? "—", mono: true },
  { key: "variant_name", header: "Variant" },
  { key: "case_type", header: "Case type", render: (r) => <CaseTypeBadge value={r.case_type} /> },
  { key: "is_live", header: "Live", render: (r) => <StatusBadge value={r.is_live ? "Live" : "Not Live"} pulse /> },
  { key: "variant_id", header: "Personnel", render: (r) => {
    const n = personnel.filter((p) => p.variant_id === r.variant_id).length;
    return <span className="font-mono text-xs text-muted-foreground">{n} / 3</span>;
  } },
  { key: "updated_on", header: "Updated", render: (r) => <span className="font-mono text-xs text-muted-foreground">{format(new Date(r.updated_on), "dd MMM yyyy")}</span> },
];

const TEMPLATE: Array<[string, string]> = [
  ["Variant ID", "variant_id"],
  ["Project", "project_id"],
  ["Variant Name", "variant_name"],
  ["Case Type", "case_type"],
  ["Is Live", "is_live"],
];

function VariantsPage() {
  return (
    <div className="space-y-4">
      <TableActions entity="Project Variants" columns={TEMPLATE} templateFilename="variants_template.csv" />
      <DataTable rows={variants} columns={cols} searchKeys={["variant_name", "case_type"]} />
    </div>
  );
}
