import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { DataTable, type Column } from "@/components/data-table";
import { TableActions } from "@/components/table-actions";
import { StatusBadge } from "@/components/status-badge";
import { customers, states, projects, variants, servers, type Customer } from "@/mocks";
import { format } from "date-fns";
import {
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription,
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";

export const Route = createFileRoute("/_app/tables/customers")({
  head: () => ({ meta: [{ title: "Customers · RailTel OMS" }] }),
  component: CustomersPage,
});

const cols: Column<Customer>[] = [
  { key: "customer_id", header: "ID", mono: true, render: (r) => <span className="font-mono text-xs">{String(r.customer_id).padStart(3, "0")}</span> },
  { key: "customer_code", header: "Code", mono: true },
  { key: "customer_name", header: "Customer" },
  { key: "state_id", header: "State", render: (r) => states.find((s) => s.state_id === r.state_id)?.state_code ?? "—" },
  { key: "contact_email", header: "Email", mono: true },
  { key: "contact_phone", header: "Phone", mono: true },
  { key: "status", header: "Status", render: (r) => <StatusBadge value={r.status} pulse /> },
  { key: "updated_on", header: "Updated", render: (r) => <span className="font-mono text-xs text-muted-foreground">{format(new Date(r.updated_on), "dd MMM yyyy")}</span> },
];

function CustomersPage() {
  const [statusFilter, setStatusFilter] = useState("all");
  const [selected, setSelected] = useState<Customer | null>(null);
  const rows = statusFilter === "all" ? customers : customers.filter((c) => c.status === statusFilter);

  return (
    <div className="space-y-4">
      <TableActions
        entity="Customers"
        columns={["customer_id", "customer_code", "customer_name", "state_id", "contact_email", "contact_phone", "status", "created_by", "created_on", "updated_by", "updated_on"]}
        templateFilename="customers_template.csv"
      />
      <DataTable
        rows={rows}
        columns={cols}
        searchKeys={["customer_name", "customer_code", "contact_email"]}
        onRowClick={setSelected}
        filters={
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="h-9 w-36"><SelectValue placeholder="Status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              <SelectItem value="Active">Active</SelectItem>
              <SelectItem value="Inactive">Inactive</SelectItem>
              <SelectItem value="Suspended">Suspended</SelectItem>
            </SelectContent>
          </Select>
        }
        cardRender={(r) => (
          <Card className="border-border/60 p-4 transition-shadow hover:shadow-md">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-xs text-muted-foreground font-mono">{r.customer_code}</p>
                <p className="mt-0.5 font-medium">{r.customer_name}</p>
              </div>
              <StatusBadge value={r.status} />
            </div>
            <p className="mt-3 text-xs font-mono text-muted-foreground">{r.contact_email}</p>
          </Card>
        )}
      />

      <Sheet open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
          {selected && (
            <>
              <SheetHeader>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs text-muted-foreground">{selected.customer_code}</span>
                  <StatusBadge value={selected.status} pulse />
                </div>
                <SheetTitle>{selected.customer_name}</SheetTitle>
                <SheetDescription>{selected.contact_email} · {selected.contact_phone}</SheetDescription>
              </SheetHeader>

              <Tabs defaultValue="overview" className="mt-6">
                <TabsList className="w-full justify-start overflow-x-auto">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="projects">Projects</TabsTrigger>
                  <TabsTrigger value="variants">Variants</TabsTrigger>
                  <TabsTrigger value="servers">Servers</TabsTrigger>
                  <TabsTrigger value="documents">Documents</TabsTrigger>
                  <TabsTrigger value="activity">Activity</TabsTrigger>
                </TabsList>
                <TabsContent value="overview" className="mt-4 space-y-3">
                  <MetaGrid customer={selected} />
                </TabsContent>
                <TabsContent value="projects" className="mt-4">
                  <RelatedList
                    items={projects.filter((p) => p.customer_id === selected.customer_id)}
                    render={(p) => (
                      <div>
                        <p className="font-medium text-sm">{p.project_name}</p>
                        <p className="font-mono text-xs text-muted-foreground">{p.project_code} · {p.host_name}</p>
                      </div>
                    )}
                    emptyLabel="No projects yet"
                  />
                </TabsContent>
                <TabsContent value="variants" className="mt-4">
                  <RelatedList
                    items={variants.filter((v) => projects.some((p) => p.project_id === v.project_id && p.customer_id === selected.customer_id))}
                    render={(v) => (
                      <div className="flex items-center justify-between gap-2">
                        <div>
                          <p className="font-medium text-sm">{v.variant_name}</p>
                          <p className="text-xs text-muted-foreground">{v.case_type}</p>
                        </div>
                        <StatusBadge value={v.is_live ? "Live" : "Not Live"} />
                      </div>
                    )}
                    emptyLabel="No variants"
                  />
                </TabsContent>
                <TabsContent value="servers" className="mt-4">
                  <RelatedList
                    items={servers.filter((s) => {
                      const v = variants.find((vr) => vr.variant_id === s.variant_id);
                      if (!v) return false;
                      const p = projects.find((pr) => pr.project_id === v.project_id);
                      return p?.customer_id === selected.customer_id;
                    })}
                    render={(s) => (
                      <div className="flex items-center justify-between gap-2">
                        <p className="font-mono text-xs">{s.vm_name}</p>
                        <StatusBadge value={s.server_type} />
                      </div>
                    )}
                    emptyLabel="No servers"
                  />
                </TabsContent>
                <TabsContent value="documents" className="mt-4">
                  <p className="text-sm text-muted-foreground">No documents uploaded. Document management ships next.</p>
                </TabsContent>
                <TabsContent value="activity" className="mt-4">
                  <p className="text-sm text-muted-foreground">Activity log for this customer will appear here once wired to the API.</p>
                </TabsContent>
              </Tabs>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}

function MetaGrid({ customer }: { customer: Customer }) {
  const state = states.find((s) => s.state_id === customer.state_id);
  const items = [
    ["Customer ID", String(customer.customer_id).padStart(3, "0"), true],
    ["Code", customer.customer_code, true],
    ["State", state ? `${state.state_name} (${state.state_code})` : "—", false],
    ["Status", customer.status, false],
    ["Created by", customer.created_by, true],
    ["Created on", format(new Date(customer.created_on), "dd MMM yyyy"), true],
    ["Updated by", customer.updated_by, true],
    ["Updated on", format(new Date(customer.updated_on), "dd MMM yyyy"), true],
  ] as const;
  return (
    <dl className="grid grid-cols-2 gap-3">
      {items.map(([k, v, mono]) => (
        <div key={k} className="rounded-md border border-border/60 p-3">
          <dt className="text-[11px] uppercase tracking-wide text-muted-foreground">{k}</dt>
          <dd className={"mt-1 text-sm " + (mono ? "font-mono" : "font-medium")}>{v}</dd>
        </div>
      ))}
    </dl>
  );
}

function RelatedList<T>({ items, render, emptyLabel }: { items: T[]; render: (i: T) => React.ReactNode; emptyLabel: string }) {
  if (!items.length) return <p className="text-sm text-muted-foreground">{emptyLabel}</p>;
  return (
    <ul className="space-y-2">
      {items.slice(0, 12).map((it, i) => (
        <li key={i} className="rounded-md border border-border/60 p-3">{render(it)}</li>
      ))}
      {items.length > 12 && (
        <li className="text-xs text-muted-foreground">+ {items.length - 12} more</li>
      )}
    </ul>
  );
}
