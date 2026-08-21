import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MONTHS, getYearOptions, currentMonthYear } from "@/lib/dateOptions";
import DepartmentSummaryTable from "@/components/summary/DepartmentSummaryTable";
import { Button } from "@/components/ui/button";
import { queryKeys } from "@/lib/queryKeys";
import { Printer } from "lucide-react";

export default function MonthlySummary() {
  const cur = currentMonthYear();
  const [month, setMonth] = useState(cur.month);
  const [year, setYear] = useState(cur.year);

  const { data: transfers = [], isLoading } = useQuery({
    queryKey: queryKeys.transfers,
    queryFn: () => base44.entities.Transfer.list("-date", 5000),
  });

  if (isLoading) {
    return <div className="flex items-center justify-center h-64"><div className="w-6 h-6 border-2 border-slate-300 border-t-slate-800 rounded-full animate-spin" /></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Monthly Summary</h1>
          <p className="text-sm text-slate-500 mt-1">Department-wise consumption and cost.</p>
        </div>
        <div className="flex gap-2 print:hidden">
          <Select value={month} onValueChange={setMonth}>
            <SelectTrigger className="w-36"><SelectValue /></SelectTrigger>
            <SelectContent>{MONTHS.map((m) => <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>)}</SelectContent>
          </Select>
          <Select value={year} onValueChange={setYear}>
            <SelectTrigger className="w-24"><SelectValue /></SelectTrigger>
            <SelectContent>{getYearOptions().map((y) => <SelectItem key={y} value={String(y)}>{y}</SelectItem>)}</SelectContent>
          </Select>
          <Button variant="outline" onClick={() => window.print()}>
            <Printer className="w-4 h-4 mr-2" />
            Print
          </Button>
        </div>
      </div>
      <DepartmentSummaryTable transfers={transfers} month={month} year={year} />
    </div>
  );
}