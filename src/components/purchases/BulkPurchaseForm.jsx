import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { computeDerivedFields } from "@/lib/stockCalculations";
import { useToast } from "@/components/ui/use-toast";
import BulkPurchaseRow from "./BulkPurchaseRow";

const emptyRow = () => ({ date: new Date().toISOString().slice(0, 10), item_id: "", quantity_purchased: "", unit_price: "" });

export default function BulkPurchaseForm({ items, onSaved }) {
  const { toast } = useToast();
  const [rows, setRows] = useState([emptyRow()]);
  const [saving, setSaving] = useState(false);

  const updateRow = (index, field, value) => {
    setRows((prev) => prev.map((r, i) => (i === index ? { ...r, [field]: value } : r)));
  };
  const addRow = () => setRows((prev) => [...prev, emptyRow()]);
  const removeRow = (index) => setRows((prev) => prev.filter((_, i) => i !== index));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validRows = rows.filter((r) => r.item_id && Number(r.quantity_purchased) > 0 && Number(r.unit_price) >= 0);
    if (validRows.length === 0) {
      toast({ title: "No valid rows", description: "Add at least one complete row.", variant: "destructive" });
      return;
    }
    setSaving(true);
    const itemState = {};
    items.forEach((i) => { itemState[i.item_id] = { ...i }; });

    for (const row of validRows) {
      const qty = Number(row.quantity_purchased);
      const price = Number(row.unit_price);
      const item = itemState[row.item_id];
      await base44.entities.Purchase.create({
        date: row.date,
        item_id: row.item_id,
        details: item.details,
        quantity_purchased: qty,
        unit_price: price,
        line_total: Number((qty * price).toFixed(2)),
      });
      item.qty_in = (Number(item.qty_in) || 0) + qty;
      item.unit_cost = price;
    }

    const touchedIds = [...new Set(validRows.map((r) => r.item_id))];
    for (const itemId of touchedIds) {
      const item = itemState[itemId];
      const derived = computeDerivedFields(item);
      await base44.entities.StockItem.update(item.id, {
        qty_in: item.qty_in,
        unit_cost: item.unit_cost,
        stock_level: derived.stock_level,
        total_value: derived.total_value,
        status: derived.status,
      });
    }

    setSaving(false);
    setRows([emptyRow()]);
    toast({ title: `${validRows.length} purchase(s) recorded` });
    onSaved?.();
  };

  const grandTotal = rows.reduce((sum, r) => sum + (Number(r.quantity_purchased) || 0) * (Number(r.unit_price) || 0), 0);

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
        {rows.map((row, index) => (
          <BulkPurchaseRow
            key={index}
            row={row}
            items={items}
            onChange={(field, value) => updateRow(index, field, value)}
            onRemove={() => removeRow(index)}
            canRemove={rows.length > 1}
          />
        ))}
      </div>
      <Button type="button" variant="outline" size="sm" onClick={addRow} className="w-full">
        <Plus className="w-4 h-4 mr-1" /> Add Row
      </Button>
      <div className="flex items-center justify-between text-sm bg-slate-50 rounded-lg px-4 py-2.5">
        <span className="text-slate-500">Grand Total</span>
        <span className="font-semibold text-slate-800">€{grandTotal.toFixed(2)}</span>
      </div>
      <Button type="submit" disabled={saving} className="w-full">{saving ? "Recording..." : "Record All Purchases"}</Button>
    </form>
  );
}