import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { Radio, ArrowRight, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { NetworkGrid } from "@/components/network-grid";
import { RailTelLogo } from "@/components/railtel-logo";
import { useRole, type Role } from "@/components/role-context";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Sign in · RailTel OMS Dashboard" },
      { name: "description", content: "Sign in to the RailTel Operations Management System." },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const { setRole } = useRole();
  const [role, setLocalRole] = useState<Role>("admin");
  const [email, setEmail] = useState("arjun.menon@railtelindia.com");
  const [password, setPassword] = useState("••••••••••");
  const [loading, setLoading] = useState(false);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setRole(role);
    setTimeout(() => navigate({ to: "/hero" }), 500);
  };

  return (
    <div className="grid min-h-screen grid-cols-1 lg:grid-cols-[1.1fr_1fr]">
      {/* Left branding panel */}
      <div className="relative hidden overflow-hidden bg-gradient-to-br from-primary/95 via-primary to-primary-glow text-primary-foreground lg:flex">
        <NetworkGrid className="opacity-40" />
        <div className="relative z-10 flex w-full flex-col justify-between p-12">
          <div className="flex items-center gap-2.5">
            <RailTelLogo className="h-9 w-9" />
            <span className="font-semibold tracking-tight">RailTel Corporation of India</span>
          </div>

          <div className="max-w-lg space-y-6">
            <div>
              <p className="mb-3 text-xs font-medium uppercase tracking-[0.2em] text-white/70">
                Operations Management System
              </p>
              <h1 className="text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
                Centralized visibility across India's digital backbone.
              </h1>
              <p className="mt-4 text-base leading-relaxed text-white/80">
                One console for customers, projects, variants and datacenter servers — the calm control room for RailTel's national operations.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-4">
              {[
                { k: "Regions", v: "6" },
                { k: "Customers", v: "40+" },
                { k: "Servers monitored", v: "300+" },
              ].map((s) => (
                <div key={s.k} className="rounded-lg border border-white/15 bg-white/5 px-4 py-3 backdrop-blur">
                  <p className="font-mono text-2xl font-semibold tabular-nums">{s.v}</p>
                  <p className="mt-0.5 text-[11px] uppercase tracking-wide text-white/70">{s.k}</p>
                </div>
              ))}
            </div>
          </div>

          <p className="text-xs text-white/60">© {new Date().getFullYear()} RailTel Corporation of India Ltd. · Ministry of Railways</p>
        </div>
      </div>

      {/* Right form panel */}
      <div className="relative flex items-center justify-center bg-background p-6 sm:p-10">
        <Card className="w-full max-w-md border-border/60 p-8 shadow-lg animate-in fade-in slide-in-from-bottom-4">
          <div className="mb-6 flex items-center gap-2 lg:hidden">
            <RailTelLogo className="h-8 w-8" />
            <span className="text-sm font-semibold">RailTel OMS</span>
          </div>

          <div className="mb-6">
            <h2 className="text-2xl font-semibold tracking-tight">Sign in to your console</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Use your RailTel single sign-on credentials.
            </p>
          </div>

          <form onSubmit={onSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email">Work email</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <button type="button" className="text-xs text-primary hover:underline">Forgot?</button>
              </div>
              <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>

            <div className="space-y-1.5">
              <Label>Sign in as</Label>
              <div className="grid grid-cols-2 gap-2 rounded-md border border-input p-1">
                {(["admin", "user"] as const).map((r) => (
                  <button
                    key={r} type="button" onClick={() => setLocalRole(r)}
                    className={`rounded px-3 py-1.5 text-sm font-medium capitalize transition-colors ${
                      role === r ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                    }`}
                  >{r}</button>
                ))}
              </div>
              <p className="text-[11px] text-muted-foreground">
                Demo mock — Admin sees Settings & Audit Logs; User does not.
              </p>
            </div>

            <Button type="submit" className="mt-2 w-full" disabled={loading}>
              {loading ? "Signing in…" : "Sign in"} <ArrowRight className="h-4 w-4" />
            </Button>

            <div className="flex items-center justify-center gap-1.5 text-[11px] text-muted-foreground">
              <ShieldCheck className="h-3 w-3" /> Protected by RailTel SSO · MFA enforced
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
