import { createFileRoute } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";

export const Route = createFileRoute("/_app/terms")({
  head: () => ({ meta: [{ title: "Terms of Use · RailTel OMS" }] }),
  component: TermsPage,
});

function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Terms of Use</h1>
        <p className="text-sm text-muted-foreground">Effective {new Date().toLocaleDateString("en-IN", { year: "numeric", month: "long" })}</p>
      </div>
      <Card className="border-border/60 p-6 text-sm leading-relaxed text-muted-foreground [&_h2]:mb-2 [&_h2]:mt-6 [&_h2]:text-base [&_h2]:font-semibold [&_h2]:text-foreground [&_p]:mt-2">
        <h2>1. Acceptance</h2>
        <p>
          Access to the RailTel Operations Management System ("OMS") is restricted to authorised personnel of RailTel Corporation of India and its designated partners. By signing in, you accept these terms and confirm you are acting in an official capacity.
        </p>
        <h2>2. Confidentiality</h2>
        <p>
          All data displayed within the OMS — including customer, project, variant and datacenter server information — is classified as internal and must not be shared outside the sanctioned distribution list.
        </p>
        <h2>3. Acceptable use</h2>
        <p>
          Do not attempt to bypass access controls, export data en masse without approval, or use OMS credentials on unmanaged devices. All actions are logged in the immutable audit trail.
        </p>
        <h2>4. Availability</h2>
        <p>
          The OMS is offered on a best-effort 24×7 basis. Planned maintenance windows will be posted in the Notifications panel at least 48 hours in advance.
        </p>
        <h2>5. Contact</h2>
        <p>
          For access questions, contact <span className="font-mono text-foreground">oms-support@railtelindia.com</span>.
        </p>
      </Card>
    </div>
  );
}
