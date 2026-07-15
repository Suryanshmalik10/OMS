import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, FileText, Radio, Activity, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NetworkGrid } from "@/components/network-grid";
import { lastSyncedAt } from "@/mocks";
import { formatDistanceToNow } from "date-fns";

export const Route = createFileRoute("/hero")({
  head: () => ({
    meta: [
      { title: "Operations Summary · RailTel OMS" },
      { name: "description", content: "Centralized operations control platform for RailTel — launch the dashboard or generate a report." },
    ],
  }),
  component: Hero,
});

function Hero() {
  const lastSynced = formatDistanceToNow(lastSyncedAt, { addSuffix: true });

  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <NetworkGrid className="opacity-60" />
      <div className="relative z-10 mx-auto flex min-h-screen max-w-5xl flex-col items-center justify-center px-6 py-16 text-center">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/70 px-3 py-1 text-xs backdrop-blur">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-70" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-success" />
          </span>
          <span className="text-muted-foreground">All systems operational · Last synced {lastSynced}</span>
        </div>

        <h1 className="max-w-3xl bg-gradient-to-b from-foreground to-foreground/70 bg-clip-text text-4xl font-semibold tracking-tight text-transparent sm:text-6xl animate-in fade-in slide-in-from-bottom-3">
          RailTel Operations Management System
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
          Centralized Operations Control Platform — a unified surface for customers, projects, variants and datacenter servers, engineered for the people who keep India connected.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Button asChild size="lg" className="h-11 px-6">
            <Link to="/dashboard">Launch Dashboard <ArrowRight className="h-4 w-4" /></Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="h-11 px-6">
            <Link to="/reports"><FileText className="h-4 w-4" /> Generate Report</Link>
          </Button>
        </div>

        <div className="mt-16 grid w-full max-w-3xl grid-cols-1 gap-4 sm:grid-cols-3">
          {[
            { icon: Radio, label: "Network coverage", value: "6 regions · 25 states", tone: "text-primary" },
            { icon: Activity, label: "Live variants", value: "133 of 200 active", tone: "text-success" },
            { icon: ShieldCheck, label: "Encrypted servers", value: "225 of 300", tone: "text-info" },
          ].map((s) => (
            <div key={s.label} className="rounded-xl border border-border/60 bg-card/70 p-5 text-left backdrop-blur">
              <s.icon className={`h-4 w-4 ${s.tone}`} />
              <p className="mt-2 text-xs uppercase tracking-wide text-muted-foreground">{s.label}</p>
              <p className="mt-1 font-mono text-sm font-medium">{s.value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
