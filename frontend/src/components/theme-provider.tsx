import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

type Theme = "light" | "dark" | "auto";

const ThemeContext = createContext<{
  theme: Theme;
  setTheme: (t: Theme) => void;
  resolved: "light" | "dark";
}>({ theme: "auto", setTheme: () => {}, resolved: "light" });

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("auto");
  const [resolved, setResolved] = useState<"light" | "dark">("light");

  useEffect(() => {
    const stored = (localStorage.getItem("railtel-theme") as Theme | null) ?? "auto";
    setThemeState(stored);
  }, []);

  useEffect(() => {
    const apply = () => {
      const isDark =
        theme === "dark" ||
        (theme === "auto" && window.matchMedia("(prefers-color-scheme: dark)").matches);
      document.documentElement.classList.toggle("dark", isDark);
      setResolved(isDark ? "dark" : "light");
    };
    apply();
    if (theme === "auto") {
      const mq = window.matchMedia("(prefers-color-scheme: dark)");
      mq.addEventListener("change", apply);
      return () => mq.removeEventListener("change", apply);
    }
  }, [theme]);

  const setTheme = (t: Theme) => {
    localStorage.setItem("railtel-theme", t);
    setThemeState(t);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, resolved }}>{children}</ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
