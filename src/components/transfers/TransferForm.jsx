import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DEPARTMENTS } from "@/lib/departments";
import { computeDerivedFields } from "@/lib/stockCalculations";
import { useToast } from "@/components/ui/use-toast";

export default function TransferForm({ items, onSaved }) {
  const { toast } = useToast();
  const [form, setForm] = useState({ date: new Date().toISOString().slice(0, 10), item_id: "", quantity_issued: "", department: "" });
  const [saving, setSaving] = useState(false);

  const selectedItem = items.find((i) => i.item_id === form.item_id);
  const qty = Number(form.quantity_issued) || 0;
  const unitPrice = Number(selectedItem?.unit_cost) || 0;
  const totalCost = qty * unitPrice;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.item_id || !form.department || qty <= 0) {
      toast({ title: "Missing fields", description: "Select an item, department and enter a valid quantity.", variant: "destructive" });
      return;
    }
    setSaving(true);
    const monthYear = form.date.slice(0, 7);
    await base44.entities.Transfer.create({
      date: form.date,
      item_id: form.item_id,
      details: selectedItem.details,
      quantity_issued: qty,
      department: form.department,
      unit_price: unitPrice,
      total_cost: Number(totalCost.toFixed(2)),
      month_year: monthYear,
    });
    const updatedItem = { ...selectedItem, qty_out: (Number(selectedItem.qty_out) || 0) + qty };
    const derived = computeDerivedFields(updatedItem);
    await base44.entities.StockItem.update(selectedItem.id, {
      qty_out: updatedItem.qty_out,
      stock_level: derived.stock_level,
      total_value: derived.total_value,
      status: derived.status,
    });
    setSaving(false);
    setForm({ date: new Date().toISOString().slice(0, 10), item_id: "", quantity_issued: "", department: "" });
    toast({ title: "Transfer recorded" });
    onSaved?.();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label className="text-xs">Date</Label>
          <Input type="date" value={form.date} onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))} />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs">Item</Label>
          <Select value={form.item_id} onValueChange={(v) => setForm((f) => ({ ...f, item_id: v }))}>
            <SelectTrigger><SelectValue placeholder="Select item" /></SelectTrigger>
            <SelectContent>{items.map((i) => <SelectItem key={i.item_id} value={i.item_id}>{i.item_id} — {i.details}</SelectItem>)}</SelectContent>
          </Select>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label className="text-xs">Quantity Issued</Label>
          <Input type="number" value={form.quantity_issued} onChange={(e) => setForm((f) => ({ ...f, quantity_issued: e.target.value }))} />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs">Department</Label>
          <Select value={form.department} onValueChange={(v) => setForm((f) => ({ ...f, department: v }))}>
            <SelectTrigger><SelectValue placeholder="Select department" /></SelectTrigger>
            <SelectContent>{DEPARTMENTS.map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent>
          </Select>
        </div>
      </div>
      <div className="flex items-center justify-between text-sm bg-slate-50 rounded-lg px-4 py-2.5">
        <span className="text-slate-500">Unit Price: €{unitPrice.toFixed(2)}</span>
        <span className="font-semibold text-slate-800">Total: €{totalCost.toFixed(2)}</span>
      </div>
      <Button type="submit" disabled={saving} className="w-full">{saving ? "Recording..." : "Record Transfer"}</Button>
    </form>
  );
}