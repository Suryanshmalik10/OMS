import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Users,
  Layers,
  Activity,
  Clock,
  CheckCircle2,
  Server,
  FlaskConical,
  Code2,
  ArrowUpRight,
  Plus,
  Search,
} from "lucide-react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  LineChart,
  Line,
  CartesianGrid,
} from "recharts";
import { KpiCard } from "@/components/kpi-card";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StatusBadge } from "@/components/status-badge";
import {
  customers,
  projects,
  servers,
  variants,
  regions,
  states,
  monthlyGrowth,
  activity,
  notifications,
  serverEnvCounts,
} from "@/mocks";
import { formatDistanceToNow } from "date-fns";

export const Route = createFileRoute("/_app/dashboard")({
  head: () => ({
    meta: [{ title: "Dashboard · RailTel OMS" }],
  }),
  component: Dashboard,
});

const CHART_COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
];

function Dashboard() {
  const totalCustomers = customers.length;
  const totalProjects = projects.length;
  const activeProjects = projects.filter((p) => p.status === "Active").length;
  const pendingProjects = projects.filter((p) => p.status === "Inactive").length;
  const completedProjects = projects.filter((p) => p.status === "Decommissioned").length;

  const regionData = regions.map((r) => {
    const c = customers.filter((cu) => {
      const st = states.find((s) => s.state_id === cu.state_id);
      return st?.region_id === r.region_id;
    }).length;
    return { name: r.region_name, value: c };
  });

  const stateData = states.slice(0, 10).map((s) => ({
    name: s.state_code,
    projects: projects.filter((p) => {
      const cu = customers.find((c) => c.customer_id === p.customer_id);
      return cu?.state_id === s.state_id;
    }).length,
  }));

  const projectStatusData = [
    { name: "Active", value: activeProjects },
    { name: "Inactive", value: pendingProjects },
    { name: "Decommissioned", value: completedProjects },
  ];

  const variantData = [
    { name: "Live", value: variants.filter((v) => v.is_live).length },
    { name: "Not live", value: variants.filter((v) => !v.is_live).length },
  ];

  const serverHealth = [
    {
      role: "Prod",
      count: servers.filter((s) => s.server_type === "Prod").length,
      tone: "bg-success",
    },
    {
      role: "Staging",
      count: servers.filter((s) => s.server_type === "Staging").length,
      tone: "bg-warning",
    },
    {
      role: "Testing",
      count: servers.filter((s) => s.server_type === "Testing").length,
      tone: "bg-primary",
    },
    { role: "Dev", count: servers.filter((s) => s.server_type === "Dev").length, tone: "bg-info" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Operations Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Real-time snapshot across regions, customers, and infrastructure.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input className="h-9 w-64 pl-9" placeholder="Search customers, projects…" />
          </div>
        </div>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4">
        <KpiCard label="Total Customers" value={totalCustomers} icon={Users} tone="primary" />
        <KpiCard label="Total Projects" value={totalProjects} icon={Layers} tone="info" />
        <KpiCard label="Active Projects" value={activeProjects} icon={Activity} tone="success" />
        <KpiCard label="Pending" value={pendingProjects} icon={Clock} tone="warning" />
        <KpiCard label="Completed" value={completedProjects} icon={CheckCircle2} tone="neutral" />
        <KpiCard
          label="Production"
          value={serverEnvCounts.production}
          icon={Server}
          tone="primary"
        />
        <KpiCard
          label="Testing"
          value={serverEnvCounts.testing}
          icon={FlaskConical}
          tone="warning"
        />
        <KpiCard label="Development" value={serverEnvCounts.development} icon={Code2} tone="info" />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="border-border/60 p-4">
          <div className="mb-3 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold">Region distribution</h3>
              <p className="text-xs text-muted-foreground">Customers per region</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={regionData}
                dataKey="value"
                nameKey="name"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={2}
              >
                {regionData.map((_, i) => (
                  <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={tooltipStyle} />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-2 grid grid-cols-2 gap-1 text-xs">
            {regionData.map((r, i) => (
              <div key={r.name} className="flex items-center gap-1.5">
                <span
                  className="h-2 w-2 rounded-sm"
                  style={{ background: CHART_COLORS[i % CHART_COLORS.length] }}
                />
                <span className="text-muted-foreground">{r.name}</span>
                <span className="ml-auto font-mono">{r.value}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card className="border-border/60 p-4 lg:col-span-2">
          <div className="mb-3">
            <h3 className="text-sm font-semibold">State distribution</h3>
            <p className="text-xs text-muted-foreground">Projects by state (top 10)</p>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={stateData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis
                dataKey="name"
                tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "var(--accent)" }} />
              <Bar dataKey="projects" fill="var(--primary)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card className="border-border/60 p-4">
          <div className="mb-3">
            <h3 className="text-sm font-semibold">Project status</h3>
            <p className="text-xs text-muted-foreground">Breakdown across lifecycle</p>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={projectStatusData}
                dataKey="value"
                nameKey="name"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={2}
              >
                <Cell fill="var(--success)" />
                <Cell fill="var(--warning)" />
                <Cell fill="var(--destructive)" />
              </Pie>
              <Tooltip contentStyle={tooltipStyle} />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        <Card className="border-border/60 p-4">
          <div className="mb-3">
            <h3 className="text-sm font-semibold">Server health</h3>
            <p className="text-xs text-muted-foreground">By role</p>
          </div>
          <div className="space-y-3">
            {serverHealth.map((s) => {
              const total = serverHealth.reduce((a, b) => a + b.count, 0);
              const pct = (s.count / total) * 100;
              return (
                <div key={s.role}>
                  <div className="mb-1 flex items-center justify-between text-xs">
                    <span className="font-medium">{s.role}</span>
                    <span className="font-mono text-muted-foreground">{s.count}</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-muted">
                    <div className={`h-full ${s.tone}`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        <Card className="border-border/60 p-4">
          <div className="mb-3">
            <h3 className="text-sm font-semibold">Monthly growth</h3>
            <p className="text-xs text-muted-foreground">Customers & projects</p>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={monthlyGrowth}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis
                dataKey="month"
                tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip contentStyle={tooltipStyle} />
              <Line
                type="monotone"
                dataKey="customers"
                stroke="var(--primary)"
                strokeWidth={2}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="projects"
                stroke="var(--chart-3)"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <Card className="border-border/60 p-4">
          <div className="mb-3">
            <h3 className="text-sm font-semibold">Variant distribution</h3>
            <p className="text-xs text-muted-foreground">Live vs not live</p>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={variantData}
                dataKey="value"
                nameKey="name"
                innerRadius={50}
                outerRadius={80}
              >
                <Cell fill="var(--success)" />
                <Cell fill="var(--muted-foreground)" />
              </Pie>
              <Tooltip contentStyle={tooltipStyle} />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Bottom widgets */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="border-border/60 p-4 lg:col-span-2">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-semibold">Recent activity</h3>
            <Button size="sm" variant="ghost" className="h-7 text-xs">
              View all <ArrowUpRight className="h-3 w-3" />
            </Button>
          </div>
          <ol className="space-y-3">
            {activity.map((a) => (
              <li
                key={a.id}
                className="flex items-start gap-3 rounded-md p-2 transition-colors hover:bg-accent/40"
              >
                <div className="mt-1 h-1.5 w-1.5 flex-none rounded-full bg-primary" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm">
                    <span className="font-mono text-xs text-muted-foreground">{a.actor}</span>{" "}
                    <span className="text-muted-foreground">{a.action}</span>{" "}
                    <span className="font-medium">{a.target}</span>
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(a.timestamp), { addSuffix: true })}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </Card>

        <div className="space-y-4">
          <Card className="border-border/60 p-4">
            <h3 className="mb-3 text-sm font-semibold">Notifications</h3>
            <ul className="space-y-2">
              {notifications.slice(0, 4).map((n) => (
                <li key={n.id} className="rounded-md border border-border/60 p-2.5">
                  <div className="flex items-center gap-2">
                    <StatusBadge
                      value={
                        n.type === "server_offline"
                          ? "Suspended"
                          : n.type === "approval_pending"
                            ? "Not Live"
                            : "Active"
                      }
                    />
                    <p className="text-sm font-medium">{n.title}</p>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">{n.description}</p>
                </li>
              ))}
            </ul>
          </Card>

          <Card className="border-border/60 p-4">
            <h3 className="mb-3 text-sm font-semibold">Quick actions</h3>
            <div className="grid grid-cols-2 gap-2">
              <Button asChild size="sm" variant="outline" className="justify-start">
                <Link to="/tables/customers">
                  <Plus className="h-3.5 w-3.5" /> Customer
                </Link>
              </Button>
              <Button asChild size="sm" variant="outline" className="justify-start">
                <Link to="/tables/projects">
                  <Plus className="h-3.5 w-3.5" /> Project
                </Link>
              </Button>
              <Button asChild size="sm" variant="outline" className="justify-start">
                <Link to="/tables/variants">
                  <Plus className="h-3.5 w-3.5" /> Variant
                </Link>
              </Button>
              <Button asChild size="sm" variant="outline" className="justify-start">
                <Link to="/tables/servers">
                  <Plus className="h-3.5 w-3.5" /> Server
                </Link>
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

const tooltipStyle: React.CSSProperties = {
  background: "var(--popover)",
  border: "1px solid var(--border)",
  borderRadius: 8,
  fontSize: 12,
  color: "var(--foreground)",
};
