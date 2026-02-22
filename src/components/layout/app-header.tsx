"use client";

import { usePathname } from "next/navigation";
import { ThemeToggle } from "./theme-toggle";

const pageTitles: Record<string, string> = {
  "/": "Dashboard",
  "/focus": "Focus Timer",
  "/tasks": "Tasks",
  "/calendar": "Calendar",
  "/analytics": "Analytics",
  "/settings": "Settings",
};

export function AppHeader() {
  const pathname = usePathname();
  const title = pageTitles[pathname] || "FocusFlow";

  return (
    <header className="flex h-14 items-center justify-between border-b border-slate-200 bg-white px-6 dark:border-slate-800 dark:bg-slate-950">
      <h1 className="text-lg font-semibold text-slate-900 dark:text-white">
        {title}
      </h1>
      <div className="flex items-center gap-3">
        <ThemeToggle />
      </div>
    </header>
  );
}
