import { Bell, Moon, Search, Sun, Laptop } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useTheme } from "@/components/theme-provider";
import { useRole } from "@/components/role-context";
import { Link } from "@tanstack/react-router";
import { notifications } from "@/mocks";

export function TopBar() {
  const { theme, setTheme, resolved } = useTheme();
  const { user, role, setRole } = useRole();
  const initials = user.name.split(" ").map((p) => p[0]).slice(0, 2).join("");

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-2 border-b border-border/60 bg-background/85 px-3 backdrop-blur">
      <SidebarTrigger className="text-muted-foreground" />
      <div className="relative hidden max-w-md flex-1 sm:block">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="Search customers, projects, servers…" className="h-9 pl-9" />
      </div>
      <div className="ml-auto flex items-center gap-1">
        <Badge variant="outline" className="hidden font-mono text-[10px] uppercase sm:inline-flex">
          {role}
        </Badge>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" aria-label="Theme">
              {resolved === "dark" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setTheme("light")}>
              <Sun className="h-4 w-4" /> Light {theme === "light" && "•"}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("dark")}>
              <Moon className="h-4 w-4" /> Dark {theme === "dark" && "•"}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("auto")}>
              <Laptop className="h-4 w-4" /> Auto {theme === "auto" && "•"}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative" aria-label="Notifications">
              <Bell className="h-4 w-4" />
              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-destructive" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel>Recent notifications</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {notifications.slice(0, 5).map((n) => (
              <DropdownMenuItem key={n.id} className="flex-col items-start gap-0.5">
                <span className="text-sm font-medium">{n.title}</span>
                <span className="text-xs text-muted-foreground">{n.description}</span>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild><Link to="/notifications">View all</Link></DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="gap-2 pl-1.5">
              <Avatar className="h-7 w-7">
                <AvatarFallback className="bg-primary text-xs font-medium text-primary-foreground">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <span className="hidden text-sm font-medium sm:inline">{user.name}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="font-medium">{user.name}</div>
              <div className="text-xs font-normal text-muted-foreground">{user.email}</div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild><Link to="/profile">Profile</Link></DropdownMenuItem>
            <DropdownMenuItem asChild><Link to="/settings">Settings</Link></DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">Switch role (demo)</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => setRole("admin")}>Admin {role === "admin" && "•"}</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setRole("user")}>User {role === "user" && "•"}</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild><Link to="/">Sign out</Link></DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
