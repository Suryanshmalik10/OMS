import { createFileRoute } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/theme-provider";
import { Sun, Moon, Laptop } from "lucide-react";

export const Route = createFileRoute("/_app/settings")({
  head: () => ({ meta: [{ title: "Settings · RailTel OMS" }] }),
  component: SettingsPage,
});

function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const opts = [
    { v: "light", label: "Light", icon: Sun },
    { v: "dark", label: "Dark", icon: Moon },
    { v: "auto", label: "Auto (system)", icon: Laptop },
  ] as const;

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
        <p className="text-sm text-muted-foreground">Personal preferences for the console.</p>
      </div>

      <Card className="border-border/60 p-5">
        <h2 className="mb-1 text-base font-semibold">Appearance</h2>
        <p className="mb-4 text-sm text-muted-foreground">Choose how RailTel OMS looks.</p>
        <div className="grid grid-cols-3 gap-2">
          {opts.map((o) => (
            <button
              key={o.v}
              onClick={() => setTheme(o.v)}
              className={`flex flex-col items-start gap-2 rounded-md border p-4 text-left transition ${
                theme === o.v ? "border-primary ring-2 ring-primary/20" : "border-border hover:border-muted-foreground/30"
              }`}
            >
              <o.icon className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">{o.label}</span>
            </button>
          ))}
        </div>
      </Card>

      <Card className="border-border/60 p-5">
        <h2 className="mb-4 text-base font-semibold">Notifications</h2>
        <div className="space-y-4">
          {[
            ["Email alerts", "Get critical infra alerts to your inbox"],
            ["Daily digest", "Receive a summary every morning at 08:30 IST"],
            ["Approval requests", "Notify me when items need my approval"],
          ].map(([title, desc], i) => (
            <div key={title} className="flex items-center justify-between">
              <div>
                <Label className="text-sm">{title}</Label>
                <p className="text-xs text-muted-foreground">{desc}</p>
              </div>
              <Switch defaultChecked={i !== 1} />
            </div>
          ))}
        </div>
      </Card>

      <div className="flex justify-end">
        <Button size="sm">Save changes</Button>
      </div>
    </div>
  );
}
