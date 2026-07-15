import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Role = "admin" | "user";

const RoleContext = createContext<{
  role: Role;
  setRole: (r: Role) => void;
  user: { name: string; email: string };
}>({
  role: "admin",
  setRole: () => {},
  user: { name: "Arjun Menon", email: "arjun.menon@railtelindia.com" },
});

export function RoleProvider({ children }: { children: ReactNode }) {
  const [role, setRoleState] = useState<Role>("admin");

  useEffect(() => {
    const stored = localStorage.getItem("railtel-role") as Role | null;
    if (stored) setRoleState(stored);
  }, []);

  const setRole = (r: Role) => {
    localStorage.setItem("railtel-role", r);
    setRoleState(r);
  };

  const user =
    role === "admin"
      ? { name: "Arjun Menon", email: "arjun.menon@railtelindia.com" }
      : { name: "Priya Sharma", email: "priya.sharma@railtelindia.com" };

  return <RoleContext.Provider value={{ role, setRole, user }}>{children}</RoleContext.Provider>;
}

export const useRole = () => useContext(RoleContext);
