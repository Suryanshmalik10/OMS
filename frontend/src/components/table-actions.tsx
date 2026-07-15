import { useState } from "react";
import { Download, Plus, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";

export type TemplateColumn = string | [label: string, field: string];

interface TableActionsProps {
  entity: string;
  columns: TemplateColumn[];
  templateFilename: string;
}

function toTuple(c: TemplateColumn): [string, string] {
  return typeof c === "string" ? [c, c] : c;
}

export function TableActions({ entity, columns, templateFilename }: TableActionsProps) {
  const [addOpen, setAddOpen] = useState(false);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<"idle" | "processing" | "success">("idle");
  const [dragOver, setDragOver] = useState(false);

  const tuples = columns.map(toTuple);

  const downloadTemplate = () => {
    // Two-row header: row 1 = friendly labels, row 2 = exact field names.
    const csv =
      tuples.map(([label]) => label).join(",") + "\n" +
      tuples.map(([, field]) => field).join(",") + "\n";
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = templateFilename; a.click();
    URL.revokeObjectURL(url);
    toast.success("Template downloaded", { description: `${templateFilename} · two-row header (label + field)` });
  };

  const startMockUpload = () => {
    setStatus("processing"); setProgress(0);
    const iv = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) { clearInterval(iv); setStatus("success"); return 100; }
        return Math.min(100, p + 8 + Math.random() * 10);
      });
    }, 120);
  };

  const resetUpload = () => { setUploadOpen(false); setStatus("idle"); setProgress(0); };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <h1 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">{entity}</h1>
      <div className="ml-auto flex flex-wrap items-center gap-2">
        <Button size="sm" variant="outline" onClick={downloadTemplate}>
          <Download className="h-4 w-4" /> Download Template
        </Button>
        <Button size="sm" variant="outline" onClick={() => setUploadOpen(true)}>
          <Upload className="h-4 w-4" /> Add CSV or Excel File
        </Button>
        <Button size="sm" onClick={() => setAddOpen(true)}>
          <Plus className="h-4 w-4" /> Add {entity.replace(/s$/, "")}
        </Button>
      </div>

      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add {entity.replace(/s$/, "")}</DialogTitle>
            <DialogDescription>
              Form fields will be wired to your PostgreSQL API. This is a UI preview.
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {tuples.slice(0, 6).map(([label, field]) => (
              <div key={field} className="space-y-1">
                <label className="text-xs font-medium text-muted-foreground">{label}</label>
                <p className="font-mono text-[10px] text-muted-foreground/70">{field}</p>
                <input className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm" placeholder={label} />
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setAddOpen(false)}>Cancel</Button>
            <Button
              onClick={() => {
                setAddOpen(false);
                toast.success(`${entity.replace(/s$/, "")} added`, { description: "Mocked — no data persisted." });
              }}
            >Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={uploadOpen} onOpenChange={(o) => (o ? setUploadOpen(true) : resetUpload())}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Import {entity}</DialogTitle>
            <DialogDescription>CSV or Excel — matches the {entity.toLowerCase()} template columns.</DialogDescription>
          </DialogHeader>
          {status === "idle" && (
            <div
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={(e) => { e.preventDefault(); setDragOver(false); startMockUpload(); }}
              className={`flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed p-10 text-center transition-colors ${
                dragOver ? "border-primary bg-primary/5" : "border-border"
              }`}
            >
              <Upload className="h-8 w-8 text-muted-foreground" />
              <p className="text-sm font-medium">Drop your file here</p>
              <p className="text-xs text-muted-foreground">or</p>
              <Button size="sm" variant="outline" onClick={startMockUpload}>Choose File</Button>
              <p className="mt-2 text-xs text-muted-foreground">.csv, .xls, .xlsx up to 10 MB</p>
            </div>
          )}
          {status === "processing" && (
            <div className="space-y-3 py-4">
              <p className="text-sm text-muted-foreground">Processing…</p>
              <Progress value={progress} />
              <p className="font-mono text-xs text-muted-foreground">{Math.floor(progress)}%</p>
            </div>
          )}
          {status === "success" && (
            <div className="space-y-2 py-4 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-success/15 text-success">
                <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5" /></svg>
              </div>
              <p className="font-medium">Success — 12 rows imported</p>
              <p className="text-xs text-muted-foreground">Mocked import — no data persisted.</p>
            </div>
          )}
          <DialogFooter>
            <Button variant="ghost" onClick={resetUpload}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
