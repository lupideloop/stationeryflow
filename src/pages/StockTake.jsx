import React, { useEffect, useState, useCallback } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MONTHS, getYearOptions, currentMonthYear } from "@/lib/dateOptions";
import StockTakeTable from "@/components/stocktake/StockTakeTable";
import { useToast } from "@/components/ui/use-toast";
import { ClipboardCheck } from "lucide-react";

export default function StockTakePage() {
  const { toast } = useToast();
  const cur = currentMonthYear();
  const [month, setMonth] = useState(cur.month);
  const [year, setYear] = useState(cur.year);
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [starting, setStarting] = useState(false);

  const load = useCallback(async (m, y) => {
    const key = `${y}-${m}`;
    const data = await base44.entities.StockTake.filter({ month_year: key }, "code");
    setEntries(data);
    setLoading(false);
  }, []);

  useEffect(() => { setLoading(true); load(month, year); }, [month, year, load]);

  const handleStart = async () => {
    setStarting(true);
    const key = `${year}-${month}`;
    const existing = await base44.entities.StockTake.filter({ month_year: key });
    if (existing.length > 0) {
      toast({ title: "Already started", description: "A stock take for this month already exists." });
      setStarting(false);
      return;
    }
    const items = await base44.entities.StockItem.list("item_id", 1000);
    const now = new Date().toISOString();
    await base44.entities.StockTake.bulkCreate(items.map((i) => ({
      code: i.item_id,
      item_description: i.details,
      stock_on_record: i.stock_level,
      stock_found: 0,
      last_snapshot: now,
      checked: false,
      month_year: key,
    })));
    setStarting(false);
    toast({ title: "Monthly stock take started", description: `${items.length} items loaded.` });
    load(month, year);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Stock Take</h1>
          <p className="text-sm text-slate-500 mt-1">Audit physical stock against recorded levels.</p>
        </div>
        <div className="flex gap-2">
          <Select value={month} onValueChange={setMonth}>
            <SelectTrigger className="w-36"><SelectValue /></SelectTrigger>
            <SelectContent>{MONTHS.map((m) => <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>)}</SelectContent>
          </Select>
          <Select value={year} onValueChange={setYear}>
            <SelectTrigger className="w-24"><SelectValue /></SelectTrigger>
            <SelectContent>{getYearOptions().map((y) => <SelectItem key={y} value={String(y)}>{y}</SelectItem>)}</SelectContent>
          </Select>
          <Button onClick={handleStart} disabled={starting} className="gap-2">
            <ClipboardCheck className="w-4 h-4" /> {starting ? "Starting..." : "Start Monthly Stock Take"}
          </Button>
        </div>
      </div>
      {loading ? (
        <div className="flex items-center justify-center h-64"><div className="w-6 h-6 border-2 border-slate-300 border-t-slate-800 rounded-full animate-spin" /></div>
      ) : (
        <StockTakeTable entries={entries} onChanged={() => load(month, year)} />
      )}
    </div>
  );
}