import { useMemo, useState, type ReactNode } from "react";
import { ChevronDown, ChevronUp, LayoutGrid, List, Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

export type Column<T> = {
  key: keyof T | string;
  header: string;
  className?: string;
  render?: (row: T) => ReactNode;
  sortable?: boolean;
  mono?: boolean;
  accessor?: (row: T) => string | number;
};

interface DataTableProps<T extends Record<string, any>> {
  rows: T[];
  columns: Column<T>[];
  searchKeys?: (keyof T)[];
  onRowClick?: (row: T) => void;
  cardRender?: (row: T) => ReactNode;
  filters?: ReactNode;
  emptyLabel?: string;
  pageSize?: number;
  actions?: ReactNode;
}

export function DataTable<T extends Record<string, any>>({
  rows,
  columns,
  searchKeys,
  onRowClick,
  cardRender,
  filters,
  emptyLabel = "No rows match the current filters.",
  pageSize = 10,
  actions,
}: DataTableProps<T>) {
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<{ key: string; dir: "asc" | "desc" } | null>(null);
  const [view, setView] = useState<"table" | "cards">("table");
  const [page, setPage] = useState(0);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q || !searchKeys?.length) return rows;
    return rows.filter((r) =>
      searchKeys.some((k) => String(r[k] ?? "").toLowerCase().includes(q)),
    );
  }, [rows, query, searchKeys]);

  const sorted = useMemo(() => {
    if (!sort) return filtered;
    const col = columns.find((c) => c.key === sort.key);
    if (!col) return filtered;
    const acc = col.accessor ?? ((r: T) => r[col.key as keyof T] as any);
    return [...filtered].sort((a, b) => {
      const av = acc(a); const bv = acc(b);
      if (av == null) return 1; if (bv == null) return -1;
      if (av < bv) return sort.dir === "asc" ? -1 : 1;
      if (av > bv) return sort.dir === "asc" ? 1 : -1;
      return 0;
    });
  }, [filtered, sort, columns]);

  const pageCount = Math.max(1, Math.ceil(sorted.length / pageSize));
  const currentPage = Math.min(page, pageCount - 1);
  const paged = sorted.slice(currentPage * pageSize, currentPage * pageSize + pageSize);

  const toggleSort = (key: string) =>
    setSort((s) => (s?.key === key ? (s.dir === "asc" ? { key, dir: "desc" } : null) : { key, dir: "asc" }));

  return (
    <div className="space-y-3">
      {actions}
      <Card className="border-border/60 p-3 sm:p-4">
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative min-w-[220px] flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => { setQuery(e.target.value); setPage(0); }}
              placeholder="Search…"
              className="h-9 pl-9"
            />
          </div>
          {filters}
          {(query) && (
            <Button size="sm" variant="ghost" onClick={() => { setQuery(""); setPage(0); }}>
              <X className="h-4 w-4" /> Clear
            </Button>
          )}
          <div className="ml-auto flex items-center gap-1 rounded-md border border-border/60 bg-background p-0.5">
            <Button
              size="sm" variant={view === "table" ? "secondary" : "ghost"}
              className="h-7 px-2" onClick={() => setView("table")} aria-label="Table view"
            >
              <List className="h-4 w-4" />
            </Button>
            <Button
              size="sm" variant={view === "cards" ? "secondary" : "ghost"}
              className="h-7 px-2" onClick={() => setView("cards")} aria-label="Card view"
              disabled={!cardRender}
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>

      {view === "table" ? (
        <Card className="overflow-hidden border-border/60 p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-muted/40">
                <TableRow>
                  {columns.map((c) => (
                    <TableHead key={String(c.key)} className={cn("whitespace-nowrap text-xs font-semibold uppercase tracking-wide text-muted-foreground", c.className)}>
                      {c.sortable !== false ? (
                        <button
                          type="button" onClick={() => toggleSort(String(c.key))}
                          className="inline-flex items-center gap-1 hover:text-foreground"
                        >
                          {c.header}
                          {sort?.key === c.key ? (
                            sort.dir === "asc" ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />
                          ) : null}
                        </button>
                      ) : c.header}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {paged.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={columns.length} className="h-32 text-center text-sm text-muted-foreground">
                      {emptyLabel}
                    </TableCell>
                  </TableRow>
                )}
                {paged.map((row, i) => (
                  <TableRow
                    key={i}
                    onClick={onRowClick ? () => onRowClick(row) : undefined}
                    className={cn(onRowClick && "cursor-pointer transition-colors hover:bg-accent/40")}
                  >
                    {columns.map((c) => (
                      <TableCell key={String(c.key)} className={cn("text-sm", c.mono && "font-mono text-[13px]", c.className)}>
                        {c.render ? c.render(row) : String(row[c.key as keyof T] ?? "")}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {paged.map((row, i) => (
            <div key={i} onClick={onRowClick ? () => onRowClick(row) : undefined}
              className={cn(onRowClick && "cursor-pointer")}>
              {cardRender?.(row)}
            </div>
          ))}
          {paged.length === 0 && (
            <Card className="col-span-full p-8 text-center text-sm text-muted-foreground">{emptyLabel}</Card>
          )}
        </div>
      )}

      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>
          Showing <span className="font-medium text-foreground">{paged.length}</span> of{" "}
          <span className="font-medium text-foreground">{sorted.length}</span> rows
        </span>
        <div className="flex items-center gap-2">
          <Button size="sm" variant="outline" disabled={currentPage === 0} onClick={() => setPage((p) => p - 1)}>Prev</Button>
          <span>Page {currentPage + 1} / {pageCount}</span>
          <Button size="sm" variant="outline" disabled={currentPage >= pageCount - 1} onClick={() => setPage((p) => p + 1)}>Next</Button>
        </div>
      </div>
    </div>
  );
}
