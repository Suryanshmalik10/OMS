import { createFileRoute } from "@tanstack/react-router";
import { DataTable, type Column } from "@/components/data-table";
import { TableActions } from "@/components/table-actions";
import { regions, type Region } from "@/mocks";
import { format } from "date-fns";

export const Route = createFileRoute("/_app/tables/regions")({
  head: () => ({ meta: [{ title: "Regions · RailTel OMS" }] }),
  component: RegionsPage,
});

const cols: Column<Region>[] = [
  { key: "region_id", header: "ID", mono: true, sortable: true },
  { key: "region_name", header: "Region", sortable: true },
  { key: "region_code", header: "Code", mono: true, sortable: true, render: (r) => (
    <span className="inline-flex items-center rounded-md bg-primary/10 px-2 py-0.5 font-mono text-xs font-semibold text-primary ring-1 ring-inset ring-primary/30">
      {r.region_code}
    </span>
  ) },
  { key: "created_by", header: "Created by", mono: true },
  { key: "created_on", header: "Created on", render: (r) => <span className="font-mono text-xs text-muted-foreground">{format(new Date(r.created_on), "dd MMM yyyy")}</span> },
  { key: "updated_by", header: "Updated by", mono: true },
  { key: "updated_on", header: "Updated on", render: (r) => <span className="font-mono text-xs text-muted-foreground">{format(new Date(r.updated_on), "dd MMM yyyy")}</span> },
];

const TEMPLATE: Array<[string, string]> = [
  ["Region ID", "region_id"],
  ["Region Name", "region_name"],
  ["Region Code", "region_code"],
  ["Created By", "created_by"],
  ["Created On", "created_on"],
  ["Updated By", "updated_by"],
  ["Updated On", "updated_on"],
];

function RegionsPage() {
  return (
    <div className="space-y-4">
      <TableActions entity="Regions" columns={TEMPLATE} templateFilename="regions_template.csv" />
      <DataTable rows={regions} columns={cols} searchKeys={["region_name", "region_code", "created_by"]} />
    </div>
  );
}
