import { createFileRoute } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useRole } from "@/components/role-context";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/_app/profile")({
  head: () => ({ meta: [{ title: "Profile · RailTel OMS" }] }),
  component: ProfilePage,
});

function ProfilePage() {
  const { user, role } = useRole();
  const initials = user.name.split(" ").map((p) => p[0]).slice(0, 2).join("");
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Profile</h1>
        <p className="text-sm text-muted-foreground">Your operator identity within RailTel OMS.</p>
      </div>
      <Card className="border-border/60 p-6">
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarFallback className="bg-primary text-lg font-medium text-primary-foreground">{initials}</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-lg font-semibold">{user.name}</p>
            <p className="font-mono text-sm text-muted-foreground">{user.email}</p>
            <Badge variant="outline" className="mt-2 font-mono text-[10px] uppercase">{role}</Badge>
          </div>
        </div>
        <dl className="mt-6 grid grid-cols-2 gap-3 text-sm">
          {[
            ["Department", "Network Operations"],
            ["Location", "Gurugram HQ"],
            ["Reports to", "Ops Director"],
            ["Employee ID", "RTL-002841"],
          ].map(([k, v]) => (
            <div key={k} className="rounded-md border border-border/60 p-3">
              <dt className="text-[11px] uppercase tracking-wide text-muted-foreground">{k}</dt>
              <dd className="mt-1 font-medium">{v}</dd>
            </div>
          ))}
        </dl>
      </Card>
    </div>
  );
}
