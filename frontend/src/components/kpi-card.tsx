import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface KpiCardProps {
  label: string;
  value: number;
  icon: LucideIcon;
  tone?: "primary" | "success" | "warning" | "info" | "destructive" | "neutral";
  hint?: string;
}

const toneMap = {
  primary: "text-primary bg-primary/10",
  success: "text-success bg-success/10",
  warning: "text-warning bg-warning/10",
  info: "text-info bg-info/10",
  destructive: "text-destructive bg-destructive/10",
  neutral: "text-muted-foreground bg-muted",
};

export function KpiCard({ label, value, icon: Icon, tone = "primary", hint }: KpiCardProps) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const duration = 900;
    const start = performance.now();
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setDisplay(Math.round(value * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value]);

  return (
    <Card className="group relative overflow-hidden border-border/60 p-5 transition-shadow hover:shadow-md">
      <div className="flex items-center justify-between gap-2">
        <p className="min-w-0 truncate text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {label}
        </p>
        <div className={cn("shrink-0 rounded-lg p-2", toneMap[tone])}>
          <Icon className="h-4 w-4" />
        </div>
      </div>
      <p className="mt-3 font-mono text-2xl font-semibold tabular-nums tracking-tight text-foreground sm:text-3xl">
        {display.toLocaleString("en-IN")}
      </p>
      {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
    </Card>
  );
}
