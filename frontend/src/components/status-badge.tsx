import { cn } from "@/lib/utils";

type Variant =
  | "active" | "inactive" | "suspended" | "decommissioned"
  | "live" | "not-live"
  | "primary" | "replica" | "standby" | "dr";

const styles: Record<Variant, string> = {
  active: "bg-success/12 text-success ring-success/25",
  live: "bg-success/12 text-success ring-success/25",
  inactive: "bg-muted text-muted-foreground ring-border",
  "not-live": "bg-muted text-muted-foreground ring-border",
  suspended: "bg-destructive/12 text-destructive ring-destructive/25",
  decommissioned: "bg-destructive/12 text-destructive ring-destructive/25",
  primary: "bg-primary/12 text-primary ring-primary/25",
  replica: "bg-info/12 text-info ring-info/25",
  standby: "bg-warning/15 text-warning-foreground ring-warning/40 dark:text-warning",
  dr: "bg-accent text-accent-foreground ring-border",
};

export function StatusBadge({
  value,
  pulse = false,
}: {
  value: string;
  pulse?: boolean;
}) {
  const key = value.toLowerCase().replace(/\s+/g, "-") as Variant;
  const style = styles[key] ?? styles.inactive;
  const showPulse = pulse && (key === "active" || key === "live" || key === "primary");
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset",
        style,
      )}
    >
      <span className="relative flex h-1.5 w-1.5">
        {showPulse && (
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-current opacity-60" />
        )}
        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-current" />
      </span>
      {value}
    </span>
  );
}
