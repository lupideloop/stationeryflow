import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DEPARTMENTS } from "@/lib/departments";
import { CATEGORIES } from "@/lib/categories";

export default function ReportFilters({ startDate, endDate, department, category, item, items = [], onChange }) {
  const filteredItems = category === "all" ? items : items.filter((i) => i.category === category);
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
      <div>
        <Label className="text-xs text-slate-500">Category</Label>
        <Select
          value={category}
          onValueChange={(v) => onChange({ category: v, item: "all" })}
        >
          <SelectTrigger className="w-48"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label className="text-xs text-slate-500">Item</Label>
        <Select value={item} onValueChange={(v) => onChange({ item: v })}>
          <SelectTrigger className="w-56"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Items</SelectItem>
            {filteredItems.map((i) => <SelectItem key={i.item_id} value={i.item_id}>{i.details} ({i.item_id})</SelectItem>)}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}