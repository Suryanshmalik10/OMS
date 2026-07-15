import { createFileRoute } from "@tanstack/react-router";
import { Bell, ServerOff, UserPlus, FileSpreadsheet, ClipboardCheck, Edit3 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { notifications } from "@/mocks";
import { formatDistanceToNow } from "date-fns";

export const Route = createFileRoute("/_app/notifications")({
  head: () => ({ meta: [{ title: "Notifications · RailTel OMS" }] }),
  component: NotificationsPage,
});

const iconFor = {
  server_offline: { icon: ServerOff, tone: "text-destructive bg-destructive/10" },
  approval_pending: { icon: ClipboardCheck, tone: "text-warning bg-warning/15" },
  csv_imported: { icon: FileSpreadsheet, tone: "text-info bg-info/10" },
  project_updated: { icon: Edit3, tone: "text-primary bg-primary/10" },
  customer_added: { icon: UserPlus, tone: "text-success bg-success/10" },
} as const;

function NotificationsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Notifications</h1>
        <p className="text-sm text-muted-foreground">System events surfaced from all connected data sources.</p>
      </div>

      <Card className="border-border/60">
        <ul className="divide-y divide-border/60">
          {notifications.map((n) => {
            const cfg = iconFor[n.type] ?? { icon: Bell, tone: "text-muted-foreground bg-muted" };
            const Icon = cfg.icon;
            return (
              <li key={n.id} className="flex items-start gap-3 p-4 transition-colors hover:bg-accent/30">
                <div className={"flex h-9 w-9 flex-none items-center justify-center rounded-md " + cfg.tone}>
                  <Icon className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline justify-between gap-3">
                    <p className="text-sm font-medium">{n.title}</p>
                    <span className="whitespace-nowrap text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(n.timestamp), { addSuffix: true })}
                    </span>
                  </div>
                  <p className="mt-0.5 text-sm text-muted-foreground">{n.description}</p>
                </div>
              </li>
            );
          })}
        </ul>
      </Card>
    </div>
  );
}
