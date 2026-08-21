import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { computeDerivedFields } from "@/lib/stockCalculations";
import { toDisplayDate } from "@/lib/dateFormat";
import { useToast } from "@/components/ui/use-toast";
import BulkTransferRow from "./BulkTransferRow";

const emptyRow = () => ({ date: new Date().toISOString().slice(0, 10), item_id: "", quantity_issued: "", department: "" });

export default function BulkTransferForm({ items, departments = [], onSaved }) {
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
    const validRows = rows.filter((r) => r.item_id && r.department && Number(r.quantity_issued) > 0);
    if (validRows.length === 0) {
      toast({ title: "No valid rows", description: "Add at least one complete row.", variant: "destructive" });
      return;
    }
    setSaving(true);
    const itemState = {};
    items.forEach((i) => { itemState[i.item_id] = { ...i }; });

    for (const row of validRows) {
      const qty = Number(row.quantity_issued);
      const item = itemState[row.item_id];
      const unitPrice = Number(item.unit_cost) || 0;
      const monthYear = row.date.slice(0, 7);
      await base44.entities.Transfer.create({
        date: toDisplayDate(row.date),
        item_id: row.item_id,
        details: item.details,
        quantity_issued: qty,
        department: row.department,
        unit_price: unitPrice,
        total_cost: Number((qty * unitPrice).toFixed(2)),
        month_year: monthYear,
      });
      item.qty_out = (Number(item.qty_out) || 0) + qty;
    }

    const touchedIds = [...new Set(validRows.map((r) => r.item_id))];
    for (const itemId of touchedIds) {
      const item = itemState[itemId];
      const derived = computeDerivedFields(item);
      await base44.entities.StockItem.update(item.id, {
        qty_out: item.qty_out,
        stock_level: derived.stock_level,
        total_value: derived.total_value,
        status: derived.status,
      });
    }

    setSaving(false);
    setRows([emptyRow()]);
    toast({ title: `${validRows.length} transfer(s) recorded` });
    onSaved?.();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
        {rows.map((row, index) => (
          <BulkTransferRow
            key={index}
            row={row}
            items={items}
            departments={departments}
            onChange={(field, value) => updateRow(index, field, value)}
            onRemove={() => removeRow(index)}
            canRemove={rows.length > 1}
          />
        ))}
      </div>
      <Button type="button" variant="outline" size="sm" onClick={addRow} className="w-full">
        <Plus className="w-4 h-4 mr-1" /> Add Row
      </Button>
      <Button type="submit" disabled={saving} className="w-full">{saving ? "Recording..." : "Record All Transfers"}</Button>
    </form>
  );
}