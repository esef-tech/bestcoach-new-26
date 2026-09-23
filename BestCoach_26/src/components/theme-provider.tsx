"use client";

import * as React from "react";

type Theme = "light" | "dark" | "system";

type ThemeContextValue = {
  theme: Theme;
  setTheme: React.Dispatch<React.SetStateAction<Theme>>;
};

const ThemeContext = React.createContext<ThemeContextValue | undefined>(
  undefined
);

export function ThemeProvider({
  children,
  attribute = "class",
  defaultTheme = "light",
  enableSystem = true,
  enableColorScheme = true,
  disableTransitionOnChange = false,
}: {
  children: React.ReactNode;
  attribute?: "class" | `data-${string}`;
  defaultTheme?: Theme;
  enableSystem?: boolean;
  enableColorScheme?: boolean;
  disableTransitionOnChange?: boolean;
}) {
  const [theme, setTheme] = React.useState<Theme>(defaultTheme);

  React.useEffect(() => {
    const savedTheme = window.localStorage.getItem("theme") as Theme | null;
    const systemTheme: Theme = window.matchMedia("(prefers-color-scheme: dark)")
      .matches
      ? "dark"
      : "light";
    const nextTheme =
      savedTheme === "light" || savedTheme === "dark" || savedTheme === "system"
        ? savedTheme
        : defaultTheme;
    const resolvedTheme = enableSystem && nextTheme === "system" ? systemTheme : nextTheme;

    window.requestAnimationFrame(() => {
      setTheme(nextTheme);
      document.documentElement.setAttribute(attribute, resolvedTheme);
      if (enableColorScheme) {
        document.documentElement.style.colorScheme = resolvedTheme;
      }
    });
  }, [attribute, defaultTheme, enableColorScheme, enableSystem]);

  React.useEffect(() => {
    window.localStorage.setItem("theme", theme);
    const resolvedTheme =
      enableSystem && theme === "system"
        ? window.matchMedia("(prefers-color-scheme: dark)").matches
          ? "dark"
          : "light"
        : theme;
    document.documentElement.setAttribute(attribute, resolvedTheme);
    if (enableColorScheme) {
      document.documentElement.style.colorScheme = resolvedTheme;
    }
    if (disableTransitionOnChange) {
      document.documentElement.classList.add("disable-theme-transitions");
      window.setTimeout(
        () => document.documentElement.classList.remove("disable-theme-transitions"),
        0
      );
    }
  }, [attribute, disableTransitionOnChange, enableColorScheme, enableSystem, theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = React.useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
}
