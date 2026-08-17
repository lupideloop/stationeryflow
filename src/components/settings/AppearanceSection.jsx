import React from "react";
import { useTheme, THEME_OPTIONS } from "@/lib/ThemeContext";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function AppearanceSection() {
  const { darkMode, setDarkMode, colorTheme, setColorTheme } = useTheme();

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <Label className="text-sm font-medium text-slate-800">Dark Mode</Label>
          <p className="text-xs text-slate-500 mt-0.5">Switch the app to a dark colour scheme.</p>
        </div>
        <Switch checked={darkMode} onCheckedChange={setDarkMode} />
      </div>
      <div>
        <Label className="text-sm font-medium text-slate-800">Theme</Label>
        <p className="text-xs text-slate-500 mt-0.5 mb-2">Choose the accent colour scheme used across the app.</p>
        <Select value={colorTheme} onValueChange={setColorTheme}>
          <SelectTrigger className="w-64"><SelectValue /></SelectTrigger>
          <SelectContent>
            {THEME_OPTIONS.map((t) => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}