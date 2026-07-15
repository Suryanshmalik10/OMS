// Mock data — realistic, relationally consistent. Ready to swap for real API.

export type Region = {
  region_id: number;
  region_name: string;
  region_code: string;
  created_by: string;
  created_on: string;
  updated_by: string;
  updated_on: string;
};

export type State = {
  state_id: number;
  region_id: number;
  state_code: string;
  state_name: string;
  created_by: string;
  created_on: string;
  updated_by: string;
  updated_on: string;
};

export type Customer = {
  customer_id: number;
  customer_code: string;
  customer_name: string;
  state_id: number;
  contact_email: string;
  contact_phone: string;
  status: "Active" | "Inactive" | "Suspended";
  created_by: string;
  created_on: string;
  updated_by: string;
  updated_on: string;
};

export type Project = {
  project_id: number;
  customer_id: number;
  project_code: string;
  project_name: string;
  ip_address: string;
  host_name: string;
  status: "Active" | "Inactive" | "Decommissioned";
  created_by: string;
  created_on: string;
  updated_by: string;
  updated_on: string;
};

export type CaseType = "NIC MoU" | "Non-MoU";

export type Variant = {
  variant_id: number;
  project_id: number;
  variant_name: string;
  case_type: CaseType;
  is_live: boolean;
  created_by: string;
  created_on: string;
  updated_by: string;
  updated_on: string;
};

export type ServerType = "Prod" | "Dev" | "Staging" | "Testing";
export type DcDr = "DC" | "DR";

export type Server = {
  server_id: number;
  variant_id: number;
  vm_name: string;
  server_type: ServerType;
  dc_dr: DcDr;
  year: number;
  month: number; // 1-12
  service_name?: string;
  serial_no?: string;
  ip_address?: string;
  host_name?: string;
  created_by: string;
  created_on: string;
  updated_by: string;
  updated_on: string;
};

export type PersonnelRole = "PMT Primary" | "System Admin Primary" | "Module Lead";

export type Personnel = {
  personnel_id: number;
  variant_id: number;
  full_name: string;
  role_type: PersonnelRole;
  created_by: string;
  created_on: string;
  updated_by: string;
  updated_on: string;
};

const ADMIN = "admin@railtelindia.com";
const OPS = "ops.lead@railtelindia.com";
const iso = (d: Date) => d.toISOString();
const daysAgo = (n: number) => iso(new Date(Date.now() - n * 86400_000));

export const regions: Region[] = [
  { region_id: 1, region_name: "Northern", region_code: "IN-N", created_by: ADMIN, created_on: daysAgo(420), updated_by: OPS, updated_on: daysAgo(35) },
  { region_id: 2, region_name: "Southern", region_code: "IN-S", created_by: ADMIN, created_on: daysAgo(420), updated_by: OPS, updated_on: daysAgo(12) },
  { region_id: 3, region_name: "Eastern", region_code: "IN-E", created_by: ADMIN, created_on: daysAgo(410), updated_by: OPS, updated_on: daysAgo(48) },
  { region_id: 4, region_name: "Western", region_code: "IN-W", created_by: ADMIN, created_on: daysAgo(410), updated_by: OPS, updated_on: daysAgo(7) },
  { region_id: 5, region_name: "Central", region_code: "IN-C", created_by: ADMIN, created_on: daysAgo(400), updated_by: OPS, updated_on: daysAgo(19) },
  { region_id: 6, region_name: "North-Eastern", region_code: "IN-NE", created_by: ADMIN, created_on: daysAgo(395), updated_by: OPS, updated_on: daysAgo(56) },
];

const rawStates: Array<[string, string, number]> = [
  ["DL", "Delhi", 1], ["PB", "Punjab", 1], ["HR", "Haryana", 1], ["JK", "Jammu & Kashmir", 1], ["UK", "Uttarakhand", 1],
  ["KA", "Karnataka", 2], ["TN", "Tamil Nadu", 2], ["KL", "Kerala", 2], ["AP", "Andhra Pradesh", 2], ["TG", "Telangana", 2],
  ["WB", "West Bengal", 3], ["OD", "Odisha", 3], ["JH", "Jharkhand", 3], ["BR", "Bihar", 3],
  ["MH", "Maharashtra", 4], ["GJ", "Gujarat", 4], ["RJ", "Rajasthan", 4], ["GA", "Goa", 4],
  ["MP", "Madhya Pradesh", 5], ["CG", "Chhattisgarh", 5], ["UP", "Uttar Pradesh", 5],
  ["AS", "Assam", 6], ["MN", "Manipur", 6], ["ML", "Meghalaya", 6], ["TR", "Tripura", 6],
];

export const states: State[] = rawStates.map(([code, name, rid], i) => ({
  state_id: i + 1,
  region_id: rid,
  state_code: code,
  state_name: name,
  created_by: ADMIN,
  created_on: daysAgo(380 - i),
  updated_by: OPS,
  updated_on: daysAgo(60 - (i % 45)),
}));

const custNames = [
  "Indian Railways", "NIC", "BSNL", "IRCTC", "Ministry of Home Affairs",
  "CBDT", "Election Commission", "DRDO", "SAIL", "ONGC",
  "Coal India", "Airport Authority", "NHAI", "Power Grid", "Bharat Petroleum",
  "Central Bank", "SBI", "LIC", "ISRO", "IOCL",
  "GAIL", "HAL", "BEL", "BEML", "NTPC",
  "Delhi Metro", "Kochi Metro", "Bangalore Metro", "Mumbai Port", "Chennai Port",
  "Kolkata Port", "AIIMS Delhi", "PGI Chandigarh", "IIT Bombay", "IIT Madras",
  "IIT Kanpur", "IISc Bangalore", "IIM Ahmedabad", "AAI Kolkata", "Konkan Railway",
];
const statuses = ["Active", "Active", "Active", "Active", "Inactive", "Suspended"] as const;

export const customers: Customer[] = custNames.map((name, i) => {
  const stateId = ((i * 7 + 3) % states.length) + 1;
  const code = name.replace(/[^A-Z]/g, "").slice(0, 3) || name.slice(0, 3).toUpperCase();
  return {
    customer_id: i + 1,
    customer_code: `${code}${String(100 + i)}`,
    customer_name: name,
    state_id: stateId,
    contact_email: `contact@${name.toLowerCase().replace(/[^a-z]/g, "")}.gov.in`,
    contact_phone: `+91 ${9000000000 + i * 111111}`.slice(0, 14),
    status: statuses[i % statuses.length],
    created_by: ADMIN,
    created_on: daysAgo(300 - i * 4),
    updated_by: OPS,
    updated_on: daysAgo((i * 3) % 60),
  };
});

const projectNames = [
  "Core Network Monitoring", "MPLS Backbone", "Data Center Migration", "Video Conferencing",
  "Passenger Wi-Fi", "SCADA Integration", "Signalling Comms", "Emergency Response",
  "Payment Gateway", "Ticketing Platform", "Freight Tracking", "Coach Provisioning",
];
const projectStatuses = ["Active", "Active", "Active", "Inactive", "Decommissioned"] as const;

export const projects: Project[] = Array.from({ length: 120 }, (_, i) => {
  const cust = (i % customers.length) + 1;
  const name = projectNames[i % projectNames.length];
  return {
    project_id: i + 1,
    customer_id: cust,
    project_code: `PRJ-${String(1000 + i)}`,
    project_name: `${name} — Phase ${(i % 4) + 1}`,
    ip_address: `10.${20 + (i % 40)}.${(i * 3) % 255}.${(i * 7) % 255}`,
    host_name: `rtl-${name.toLowerCase().split(" ")[0]}-${String(i).padStart(3, "0")}.railtel.net`,
    status: projectStatuses[i % projectStatuses.length],
    created_by: ADMIN,
    created_on: daysAgo(250 - i),
    updated_by: OPS,
    updated_on: daysAgo(i % 90),
  };
});

const variantNames = ["eFile", "Sparrow", "PIMS", "eOffice", "eHRMS", "SPARROW-IPS", "PFMS", "GeM"];
const caseTypes: CaseType[] = ["NIC MoU", "Non-MoU"];

export const variants: Variant[] = Array.from({ length: 200 }, (_, i) => {
  const p = (i % projects.length) + 1;
  return {
    variant_id: i + 1,
    project_id: p,
    variant_name: variantNames[i % variantNames.length],
    case_type: caseTypes[i % caseTypes.length],
    is_live: i % 3 !== 0,
    created_by: ADMIN,
    created_on: daysAgo(200 - i),
    updated_by: OPS,
    updated_on: daysAgo(i % 45),
  };
});

const serverTypes: ServerType[] = ["Prod", "Dev", "Staging", "Testing"];
const dcDrs: DcDr[] = ["DC", "DC", "DC", "DR"];
const serviceNames = ["nginx-web", "postgres-primary", "redis-cache", "kafka-broker", "elastic-search", "app-api", "monitor-agent", "keycloak-idp"];

export const servers: Server[] = Array.from({ length: 300 }, (_, i) => {
  const v = (i % variants.length) + 1;
  const type = serverTypes[i % serverTypes.length];
  return {
    server_id: i + 1,
    variant_id: v,
    vm_name: `vm-${type.toLowerCase()}-${String(i).padStart(4, "0")}`,
    server_type: type,
    dc_dr: dcDrs[i % dcDrs.length],
    year: 2024 + (i % 3),
    month: ((i * 5) % 12) + 1,
    service_name: serviceNames[i % serviceNames.length],
    serial_no: `SN-${String(100000 + i * 37).slice(0, 8)}`,
    ip_address: `10.${20 + (i % 40)}.${(i * 3) % 255}.${(i * 7) % 255}`,
    host_name: `rtl-${type.toLowerCase()}-${String(i).padStart(4, "0")}.dc${(i % 3) + 1}.railtel.net`,
    created_by: ADMIN,
    created_on: daysAgo(180 - (i % 180)),
    updated_by: OPS,
    updated_on: daysAgo(i % 40),
  };
});

// Personnel — up to 3 per variant, one of each role
const personnelNamesA = ["R. Iyer", "S. Chatterjee", "M. Rao", "K. Nair", "V. Deshmukh", "A. Khan"];
const personnelNamesB = ["N. Bhatt", "P. Gupta", "L. Reddy", "T. Menon", "H. Joshi", "D. Kaur"];
const personnelNamesC = ["G. Verma", "F. D'Souza", "B. Pillai", "J. Sinha", "Y. Kapoor", "C. Bose"];

export const personnel: Personnel[] = (() => {
  const rows: Personnel[] = [];
  let id = 1;
  variants.forEach((v, i) => {
    // Most variants get all 3 roles; skip some to show "Unassigned" state
    const roles: PersonnelRole[] = [];
    roles.push("PMT Primary");
    if (i % 5 !== 0) roles.push("System Admin Primary");
    if (i % 7 !== 0) roles.push("Module Lead");
    roles.forEach((role, ri) => {
      const pool = ri === 0 ? personnelNamesA : ri === 1 ? personnelNamesB : personnelNamesC;
      rows.push({
        personnel_id: id++,
        variant_id: v.variant_id,
        full_name: pool[(i + ri) % pool.length],
        role_type: role,
        created_by: ADMIN,
        created_on: daysAgo(190 - (i % 180)),
        updated_by: OPS,
        updated_on: daysAgo(i % 30),
      });
    });
  });
  return rows;
})();

// Server environments for the dashboard KPIs — now sourced from server_type
export const serverEnvCounts = {
  production: servers.filter((s) => s.server_type === "Prod").length,
  staging: servers.filter((s) => s.server_type === "Staging").length,
  testing: servers.filter((s) => s.server_type === "Testing").length,
  development: servers.filter((s) => s.server_type === "Dev").length,
};

export type CustomerOverview = {
  customer_id: number;
  customer_name: string;
  region_name: string;
  state_code: string;
  total_projects: number;
  active_projects: number;
  total_variants: number;
  live_variants: number;
  total_servers: number;
  last_activity_on: string;
  refreshed_on: string;
};

export const customerOverview: CustomerOverview[] = customers.map((c) => {
  const state = states.find((s) => s.state_id === c.state_id)!;
  const region = regions.find((r) => r.region_id === state.region_id)!;
  const cp = projects.filter((p) => p.customer_id === c.customer_id);
  const cv = variants.filter((v) => cp.some((p) => p.project_id === v.project_id));
  // Servers now attach to variants, not projects — aggregate via variants.
  const cs = servers.filter((s) => cv.some((v) => v.variant_id === s.variant_id));
  return {
    customer_id: c.customer_id,
    customer_name: c.customer_name,
    region_name: region.region_name,
    state_code: state.state_code,
    total_projects: cp.length,
    active_projects: cp.filter((p) => p.status === "Active").length,
    total_variants: cv.length,
    live_variants: cv.filter((v) => v.is_live).length,
    total_servers: cs.length,
    last_activity_on: cp[0]?.updated_on ?? c.updated_on,
    refreshed_on: iso(new Date(Date.now() - 3 * 60_000)),
  };
});

export type Notif = {
  id: number;
  type: "customer_added" | "project_updated" | "csv_imported" | "approval_pending" | "server_offline";
  title: string;
  description: string;
  timestamp: string;
};

export const notifications: Notif[] = [
  { id: 1, type: "server_offline", title: "Server offline", description: "vm-prod-0128 (dc2.railtel) is not responding", timestamp: daysAgo(0) },
  { id: 2, type: "approval_pending", title: "Approval pending", description: "3 variant updates awaiting Ops Lead approval", timestamp: daysAgo(0) },
  { id: 3, type: "csv_imported", title: "CSV imported", description: "42 customer records imported successfully", timestamp: daysAgo(1) },
  { id: 4, type: "project_updated", title: "Project updated", description: "Passenger Wi-Fi — Phase 2 host_name changed", timestamp: daysAgo(1) },
  { id: 5, type: "customer_added", title: "Customer added", description: "AAI Kolkata added to Eastern region", timestamp: daysAgo(2) },
  { id: 6, type: "project_updated", title: "Project decommissioned", description: "Legacy SCADA Integration retired", timestamp: daysAgo(3) },
  { id: 7, type: "approval_pending", title: "Approval pending", description: "Personnel role change requested", timestamp: daysAgo(4) },
  { id: 8, type: "csv_imported", title: "CSV imported", description: "128 server rows synced from datacenter export", timestamp: daysAgo(5) },
];

export type ActivityItem = {
  id: number;
  actor: string;
  action: string;
  target: string;
  timestamp: string;
};

export const activity: ActivityItem[] = [
  { id: 1, actor: "arjun.menon", action: "updated", target: "Customer · IRCTC", timestamp: daysAgo(0) },
  { id: 2, actor: "priya.sharma", action: "added", target: "Project · Freight Tracking — Phase 2", timestamp: daysAgo(0) },
  { id: 3, actor: "ops.lead", action: "imported", target: "42 rows into Customers", timestamp: daysAgo(1) },
  { id: 4, actor: "arjun.menon", action: "decommissioned", target: "Server · vm-prod-0212", timestamp: daysAgo(1) },
  { id: 5, actor: "priya.sharma", action: "toggled live", target: "Variant · eFile (PRJ-1023)", timestamp: daysAgo(2) },
  { id: 6, actor: "ops.lead", action: "created", target: "Region · North-Eastern", timestamp: daysAgo(3) },
];

export type AuditLog = {
  id: number;
  timestamp: string;
  actor: string;
  action: string;
  entity: string;
  entity_id: string;
  ip: string;
};

export const auditLogs: AuditLog[] = Array.from({ length: 60 }, (_, i) => ({
  id: i + 1,
  timestamp: iso(new Date(Date.now() - i * 3600_000)),
  actor: ["arjun.menon", "priya.sharma", "ops.lead", "admin"][i % 4],
  action: ["UPDATE", "INSERT", "DELETE", "LOGIN", "EXPORT"][i % 5],
  entity: ["customers", "projects", "variants", "servers", "personnel"][i % 5],
  entity_id: `#${1000 + i}`,
  ip: `10.${20 + (i % 40)}.${(i * 3) % 255}.${(i * 7) % 255}`,
}));

export const monthlyGrowth = [
  { month: "Jan", customers: 22, projects: 68 },
  { month: "Feb", customers: 25, projects: 74 },
  { month: "Mar", customers: 27, projects: 82 },
  { month: "Apr", customers: 29, projects: 89 },
  { month: "May", customers: 31, projects: 95 },
  { month: "Jun", customers: 33, projects: 101 },
  { month: "Jul", customers: 35, projects: 108 },
  { month: "Aug", customers: 37, projects: 114 },
  { month: "Sep", customers: 39, projects: 118 },
  { month: "Oct", customers: 40, projects: 120 },
];

export const lastSyncedAt = new Date(Date.now() - 2 * 60_000);

// Helper — pretty label for a variant lookup dropdown / display
export function variantLabel(variantId: number): string {
  const v = variants.find((x) => x.variant_id === variantId);
  if (!v) return "—";
  const p = projects.find((x) => x.project_id === v.project_id);
  return `${p?.project_name ?? "Unknown project"} — ${v.variant_name}`;
}

export const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
