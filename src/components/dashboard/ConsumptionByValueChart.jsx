import React, { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { MONTHS, getYearOptions, currentMonthYear } from "@/lib/dateOptions";

export default function ConsumptionByValueChart({ transfers }) {
  const [year, setYear] = useState(currentMonthYear().year);

  const data = useMemo(() => {
    return MONTHS.map((m) => {
      const key = `${year}-${m.value}`;
      const value = transfers.filter((t) => t.month_year === key).reduce((sum, t) => sum + (Number(t.total_cost) || 0), 0);
      return { month: m.label.slice(0, 3), value: Number(value.toFixed(2)) };
    });
  }, [transfers, year]);

  return (
    <Card className="shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <CardTitle className="text-base font-semibold">Consumption by Value</CardTitle>
        <Select value={year} onValueChange={setYear}>
          <SelectTrigger className="w-24 h-8 text-xs"><SelectValue /></SelectTrigger>
          <SelectContent>{getYearOptions().map((y) => <SelectItem key={y} value={String(y)}>{y}</SelectItem>)}</SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
            <XAxis dataKey="month" tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
            <Tooltip formatter={(v) => [`€${v}`, "Value"]} />
            <Bar dataKey="value" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}