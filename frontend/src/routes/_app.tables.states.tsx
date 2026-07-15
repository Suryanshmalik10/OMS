import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { DataTable, type Column } from "@/components/data-table";
import { TableActions } from "@/components/table-actions";
import { states, regions, type State } from "@/mocks";
import { format } from "date-fns";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";

export const Route = createFileRoute("/_app/tables/states")({
  head: () => ({ meta: [{ title: "States · RailTel OMS" }] }),
  component: StatesPage,
});

const cols: Column<State>[] = [
  { key: "state_id", header: "ID", mono: true },
  { key: "state_code", header: "Code", mono: true },
  { key: "state_name", header: "State" },
  { key: "region_id", header: "Region", render: (r) => regions.find((rg) => rg.region_id === r.region_id)?.region_name ?? "—" },
  { key: "created_by", header: "Created by", mono: true },
  { key: "updated_on", header: "Updated", render: (r) => <span className="font-mono text-xs text-muted-foreground">{format(new Date(r.updated_on), "dd MMM yyyy")}</span> },
];

function StatesPage() {
  const [regionFilter, setRegionFilter] = useState("all");
  const rows = regionFilter === "all" ? states : states.filter((s) => String(s.region_id) === regionFilter);

  return (
    <div className="space-y-4">
      <TableActions entity="States" columns={["state_id", "region_id", "state_code", "state_name", "created_by", "created_on", "updated_by", "updated_on"]} templateFilename="states_template.csv" />
      <DataTable
        rows={rows}
        columns={cols}
        searchKeys={["state_name", "state_code"]}
        filters={
          <Select value={regionFilter} onValueChange={setRegionFilter}>
            <SelectTrigger className="h-9 w-40"><SelectValue placeholder="Region" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All regions</SelectItem>
              {regions.map((r) => <SelectItem key={r.region_id} value={String(r.region_id)}>{r.region_name}</SelectItem>)}
            </SelectContent>
          </Select>
        }
      />
    </div>
  );
}
