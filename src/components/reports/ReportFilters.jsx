import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DEPARTMENTS } from "@/lib/departments";

export default function ReportFilters({ startDate, endDate, department, onChange }) {
  return (
    <div className="flex flex-wrap items-end gap-3 bg-white border border-slate-200 rounded-lg p-4">
      <div>
        <Label className="text-xs text-slate-500">From</Label>
        <Input type="date" value={startDate} onChange={(e) => onChange({ startDate: e.target.value })} className="w-40" />
      </div>
      <div>
        <Label className="text-xs text-slate-500">To</Label>
        <Input type="date" value={endDate} onChange={(e) => onChange({ endDate: e.target.value })} className="w-40" />
      </div>
      <div>
        <Label className="text-xs text-slate-500">Department</Label>
        <Select value={department} onValueChange={(v) => onChange({ department: v })}>
          <SelectTrigger className="w-52"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Departments</SelectItem>
            {DEPARTMENTS.map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}