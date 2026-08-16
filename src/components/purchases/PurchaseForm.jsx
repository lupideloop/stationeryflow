import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { computeDerivedFields } from "@/lib/stockCalculations";
import { useToast } from "@/components/ui/use-toast";

export default function PurchaseForm({ items, onSaved }) {
  const { toast } = useToast();
  const [form, setForm] = useState({ date: new Date().toISOString().slice(0, 10), item_id: "", quantity_purchased: "", unit_price: "" });
  const [saving, setSaving] = useState(false);

  const qty = Number(form.quantity_purchased) || 0;
  const price = Number(form.unit_price) || 0;
  const lineTotal = qty * price;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.item_id || qty <= 0 || price < 0) {
      toast({ title: "Missing fields", description: "Select an item and enter a valid quantity and price.", variant: "destructive" });
      return;
    }
    setSaving(true);
    const item = items.find((i) => i.item_id === form.item_id);
    await base44.entities.Purchase.create({
      date: form.date,
      item_id: form.item_id,
      details: item.details,
      quantity_purchased: qty,
      unit_price: price,
      line_total: Number(lineTotal.toFixed(2)),
    });
    const updatedItem = { ...item, qty_in: (Number(item.qty_in) || 0) + qty, unit_cost: price };
    const derived = computeDerivedFields(updatedItem);
    await base44.entities.StockItem.update(item.id, {
      qty_in: updatedItem.qty_in,
      unit_cost: price,
      stock_level: derived.stock_level,
      total_value: derived.total_value,
      status: derived.status,
    });
    setSaving(false);
    setForm({ date: new Date().toISOString().slice(0, 10), item_id: "", quantity_purchased: "", unit_price: "" });
    toast({ title: "Purchase recorded" });
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
          <Label className="text-xs">Quantity Purchased</Label>
          <Input type="number" value={form.quantity_purchased} onChange={(e) => setForm((f) => ({ ...f, quantity_purchased: e.target.value }))} />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs">Unit Price</Label>
          <Input type="number" value={form.unit_price} onChange={(e) => setForm((f) => ({ ...f, unit_price: e.target.value }))} />
        </div>
      </div>
      <div className="flex items-center justify-between text-sm bg-slate-50 rounded-lg px-4 py-2.5">
        <span className="text-slate-500">Line Total</span>
        <span className="font-semibold text-slate-800">€{lineTotal.toFixed(2)}</span>
      </div>
      <Button type="submit" disabled={saving} className="w-full">{saving ? "Recording..." : "Record Purchase"}</Button>
    </form>
  );
}