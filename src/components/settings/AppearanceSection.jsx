import React from "react";
import { useTheme, THEME_OPTIONS } from "@/lib/ThemeContext";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

const THEME_SWATCHES = {
  basic: ["#171717", "#e5e5e5", "#fafafa"],
  monochrome: ["#595959", "#a6a6a6", "#333333"],
  ocean: ["#0e7490", "#22d3ee", "#0c4a6e"],
  emerald: ["#0d9488", "#34d399", "#064e3b"],
  vibrant: ["#db2777", "#f59e0b", "#7c3aed"],
};

export default function AppearanceSection() {
  const { darkMode, setDarkMode, colorTheme, setColorTheme } = useTheme();

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <Label className="text-sm font-medium text-foreground">Dark Mode</Label>
          <p className="text-xs text-muted-foreground mt-0.5">Switch the app to a dark colour scheme.</p>
        </div>
        <Switch checked={darkMode} onCheckedChange={setDarkMode} />
      </div>
      <div>
        <Label className="text-sm font-medium text-foreground">Theme</Label>
        <p className="text-xs text-muted-foreground mt-0.5 mb-3">Choose the accent colour scheme used across the app.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {THEME_OPTIONS.map((t) => {
            const swatches = THEME_SWATCHES[t.value] || [];
            const isActive = colorTheme === t.value;
            return (
              <button
                key={t.value}
                type="button"
                onClick={() => setColorTheme(t.value)}
                className={cn(
                  "flex items-center gap-3 rounded-lg border-2 px-3 py-2.5 text-left transition-all",
                  isActive
                    ? "border-primary bg-primary/5 ring-1 ring-primary"
                    : "border-border hover:border-primary/40 hover:bg-accent"
                )}
              >
                <div className="flex gap-1">
                  {swatches.map((c, i) => (
                    <span key={i} className="w-4 h-4 rounded-full" style={{ backgroundColor: c }} />
                  ))}
                </div>
                <span className={cn("text-sm font-medium", isActive ? "text-primary" : "text-foreground")}>
                  {t.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}