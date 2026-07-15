import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard, Database, Globe2, Building2, Server, Layers, MapPin, Boxes,
  FileBarChart, Bell, ShieldCheck, Settings, User, FileText, LogOut, Radio, Users2,
} from "lucide-react";
import {
  Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent,
  SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem,
  SidebarMenuSub, SidebarMenuSubButton, SidebarMenuSubItem, useSidebar,
} from "@/components/ui/sidebar";
import { RailTelLogo } from "@/components/railtel-logo";
import { useRole } from "@/components/role-context";
import { cn } from "@/lib/utils";

const tableItems = [
  { title: "Regions", url: "/tables/regions", icon: Globe2 },
  { title: "States", url: "/tables/states", icon: MapPin },
  { title: "Customers", url: "/tables/customers", icon: Building2 },
  { title: "Projects", url: "/tables/projects", icon: Layers },
  { title: "Project Variants", url: "/tables/variants", icon: Boxes },
  { title: "Personnel", url: "/tables/personnel", icon: Users2 },
  { title: "Servers", url: "/tables/servers", icon: Server },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { role } = useRole();
  const isActive = (p: string) => pathname === p || pathname.startsWith(p + "/");

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b border-sidebar-border">
        <div className={cn("flex items-center gap-2 px-2 py-2", collapsed && "justify-center")}>
          <RailTelLogo className="h-8 w-8 shrink-0" showText={!collapsed} />
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Main</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive("/dashboard")}>
                  <Link to="/dashboard"><LayoutDashboard /> <span>Dashboard</span></Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton isActive={pathname.startsWith("/tables")}>
                  <Database /> <span>Tables</span>
                </SidebarMenuButton>
                {!collapsed && (
                  <SidebarMenuSub>
                    {tableItems.map((t) => (
                      <SidebarMenuSubItem key={t.url}>
                        <SidebarMenuSubButton asChild isActive={isActive(t.url)}>
                          <Link to={t.url}><t.icon className="h-3.5 w-3.5" /> <span>{t.title}</span></Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                )}
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive("/overview")}>
                  <Link to="/overview"><FileBarChart /> <span>Overview</span></Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive("/reports")}>
                  <Link to="/reports"><FileText /> <span>Reports</span></Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive("/notifications")}>
                  <Link to="/notifications"><Bell /> <span>Notifications</span></Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {role === "admin" && (
                <>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={isActive("/audit-logs")}>
                      <Link to="/audit-logs"><ShieldCheck /> <span>Audit Logs</span></Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={isActive("/settings")}>
                      <Link to="/settings"><Settings /> <span>Settings</span></Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </>
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={isActive("/profile")}>
              <Link to="/profile"><User /> <span>Profile</span></Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={isActive("/terms")}>
              <Link to="/terms"><FileText /> <span>Terms of Use</span></Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link to="/"><LogOut /> <span>Logout</span></Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
