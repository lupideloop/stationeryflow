import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import SortableHeader from "@/components/SortableHeader";
import StockItemFormDialog from "./StockItemFormDialog";

export default function StockItemTable({ items, onChanged, sortKey, sortDir, onSort }) {
  const [editing, setEditing] = useState(null);
  const headerProps = { sortKey, sortDir, onSort };

  return (
    <div className="overflow-x-auto rounded-lg border border-slate-200">
      <table className="w-full text-sm">
        <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wide">
          <tr>
            <SortableHeader label="Item ID" sortKeyName="item_id" {...headerProps} />
            <SortableHeader label="Details" sortKeyName="details" {...headerProps} />
            <SortableHeader label="Category" sortKeyName="category" {...headerProps} />
            <SortableHeader label="Qty In" sortKeyName="qty_in" align="right" {...headerProps} />
            <SortableHeader label="Qty Out" sortKeyName="qty_out" align="right" {...headerProps} />
            <SortableHeader label="Stock Level" sortKeyName="stock_level" align="right" {...headerProps} />
            <SortableHeader label="Unit Cost" sortKeyName="unit_cost" align="right" {...headerProps} />
            <SortableHeader label="Total Value" sortKeyName="total_value" align="right" {...headerProps} />
            <SortableHeader label="Min Level" sortKeyName="minimum_stock_level" align="right" {...headerProps} />
            <SortableHeader label="Status" sortKeyName="status" align="center" {...headerProps} />
            <th className="px-4 py-3"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {items.map((item) => {
            const isLow = Number(item.stock_level) <= Number(item.minimum_stock_level);
            return (
            <tr key={item.id} className={isLow ? "bg-red-50 hover:bg-red-100/70" : "hover:bg-slate-50/50"}>
              <td className="px-4 py-3 font-medium text-slate-800">{item.item_id}</td>
              <td className="px-4 py-3 text-slate-700">{item.details}</td>
              <td className="px-4 py-3 text-slate-500">{item.category}</td>
              <td className="px-4 py-3 text-right">{item.qty_in}</td>
              <td className="px-4 py-3 text-right">{item.qty_out}</td>
              <td className="px-4 py-3 text-right font-medium">{item.stock_level}</td>
              <td className="px-4 py-3 text-right">€{Number(item.unit_cost || 0).toFixed(2)}</td>
              <td className="px-4 py-3 text-right">€{Number(item.total_value || 0).toFixed(2)}</td>
              <td className="px-4 py-3 text-right">{item.minimum_stock_level}</td>
              <td className="px-4 py-3 text-center">
                <Badge className={item.status === "Low Stock" ? "bg-red-100 text-red-700 hover:bg-red-100" : "bg-emerald-100 text-emerald-700 hover:bg-emerald-100"}>
                  {item.status}
                </Badge>
              </td>
              <td className="px-4 py-3 text-right">
                <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => setEditing(item)}>
                  <Pencil className="w-3.5 h-3.5" />
                </Button>
              </td>
            </tr>
            );
          })}
          {items.length === 0 && (
            <tr><td colSpan={11} className="px-4 py-8 text-center text-slate-400">No items yet.</td></tr>
          )}
        </tbody>
      </table>
      <StockItemFormDialog item={editing} open={!!editing} onOpenChange={(v) => !v && setEditing(null)} onSaved={onChanged} />
    </div>
  );
}