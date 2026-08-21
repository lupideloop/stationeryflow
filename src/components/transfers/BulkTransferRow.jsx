import React from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

export default function BulkTransferRow({ row, items, departments = [], onChange, onRemove, canRemove }) {
  return (
    <div className="border border-slate-200 rounded-lg p-3 space-y-2 relative">
      {canRemove && (
        <Button type="button" variant="ghost" size="icon" className="absolute top-1 right-1 h-6 w-6" onClick={onRemove}>
          <X className="w-3.5 h-3.5" />
        </Button>
      )}
      <div className="grid grid-cols-2 gap-2 pr-6">
        <Input type="date" value={row.date} onChange={(e) => onChange("date", e.target.value)} />
        <Select value={row.item_id} onValueChange={(v) => onChange("item_id", v)}>
          <SelectTrigger><SelectValue placeholder="Select item" /></SelectTrigger>
          <SelectContent>{items.map((i) => <SelectItem key={i.item_id} value={i.item_id}>{i.item_id} — {i.details}</SelectItem>)}</SelectContent>
        </Select>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <Input type="number" placeholder="Qty" value={row.quantity_issued} onChange={(e) => onChange("quantity_issued", e.target.value)} />
        <Select value={row.department} onValueChange={(v) => onChange("department", v)}>
          <SelectTrigger><SelectValue placeholder="Department" /></SelectTrigger>
          <SelectContent>{departments.map((d) => <SelectItem key={d.id} value={d.name}>{d.name}</SelectItem>)}</SelectContent>
        </Select>
      </div>
    </div>
  );
}