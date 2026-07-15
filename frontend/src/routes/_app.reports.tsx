import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { FileDown, FileSpreadsheet, FileType2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/reports")({
  head: () => ({ meta: [{ title: "Reports · RailTel OMS" }] }),
  component: ReportsPage,
});

const types = [
  { key: "customer", label: "Customer-wise" },
  { key: "region", label: "Region-wise" },
  { key: "state", label: "State-wise" },
  { key: "server", label: "Server-wise" },
  { key: "monthly", label: "Monthly" },
];

function ReportsPage() {
  const [range, setRange] = useState("30");

  const trigger = (fmt: string) => toast.success(`${fmt} export queued`, { description: "Mocked download — will hit your API." });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Reports</h1>
        <p className="text-sm text-muted-foreground">Export operational reports across dimensions.</p>
      </div>

      <Tabs defaultValue="customer">
        <TabsList className="w-full justify-start overflow-x-auto">
          {types.map((t) => <TabsTrigger key={t.key} value={t.key}>{t.label}</TabsTrigger>)}
        </TabsList>

        {types.map((t) => (
          <TabsContent key={t.key} value={t.key} className="mt-4 space-y-4">
            <Card className="border-border/60 p-4">
              <div className="flex flex-wrap items-end gap-3">
                <div>
                  <label className="mb-1 block text-xs font-medium text-muted-foreground">Date range</label>
                  <Select value={range} onValueChange={setRange}>
                    <SelectTrigger className="h-9 w-40"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="7">Last 7 days</SelectItem>
                      <SelectItem value="30">Last 30 days</SelectItem>
                      <SelectItem value="90">Last 90 days</SelectItem>
                      <SelectItem value="365">Last 12 months</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="ml-auto flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => trigger("PDF")}><FileType2 className="h-4 w-4" /> PDF</Button>
                  <Button size="sm" variant="outline" onClick={() => trigger("CSV")}><FileDown className="h-4 w-4" /> CSV</Button>
                  <Button size="sm" onClick={() => trigger("Excel")}><FileSpreadsheet className="h-4 w-4" /> Excel</Button>
                </div>
              </div>
            </Card>

            <Card className="border-border/60 p-8 text-center">
              <p className="text-sm font-medium">{t.label} report preview</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Preview rendering wires to your API. This surface is complete UI-side.
              </p>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
