import React, { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MONTHS, getYearOptions, currentMonthYear } from "@/lib/dateOptions";

export default function ConsumptionByItemCard({ transfers, items }) {
  const cur = currentMonthYear();
  const [month, setMonth] = useState(cur.month);
  const [year, setYear] = useState(cur.year);

  const rows = useMemo(() => {
    const key = `${year}-${month}`;
    const totals = {};
    transfers.filter((t) => t.month_year === key).forEach((t) => {
      if (!totals[t.item_id]) totals[t.item_id] = { qty: 0, value: 0 };
      totals[t.item_id].qty += Number(t.quantity_issued) || 0;
      totals[t.item_id].value += Number(t.total_cost) || 0;
    });
    return Object.entries(totals).map(([item_id, v]) => {
      const item = items.find((i) => i.item_id === item_id);
      return { item_id, details: item?.details || "—", qty: v.qty, value: v.value };
    }).sort((a, b) => b.qty - a.qty);
  }, [transfers, items, month, year]);

  return (
    <Card className="shadow-sm stat-card-3">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <CardTitle className="text-base font-semibold">Consumption by Item</CardTitle>
        <div className="flex gap-2">
          <Select value={month} onValueChange={setMonth}>
            <SelectTrigger className="w-32 h-8 text-xs"><SelectValue /></SelectTrigger>
            <SelectContent>{MONTHS.map((m) => <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>)}</SelectContent>
          </Select>
          <Select value={year} onValueChange={setYear}>
            <SelectTrigger className="w-24 h-8 text-xs"><SelectValue /></SelectTrigger>
            <SelectContent>{getYearOptions().map((y) => <SelectItem key={y} value={String(y)}>{y}</SelectItem>)}</SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        {rows.length === 0 ? (
          <p className="text-sm text-muted-foreground py-6 text-center">No consumption recorded for this period.</p>
        ) : (
          <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
            {rows.map((r) => (
              <div key={r.item_id} className="flex items-center justify-between text-sm py-1.5 border-b border-border last:border-0">
                <div>
                  <p className="font-medium text-foreground">{r.details}</p>
                  <p className="text-xs text-muted-foreground">{r.item_id}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-foreground">{r.qty} units</p>
                  <p className="text-xs text-muted-foreground">€{r.value.toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}