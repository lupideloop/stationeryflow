import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import StockItemFormDialog from "./StockItemFormDialog";

export default function StockItemTable({ items, onChanged }) {
  const [editing, setEditing] = useState(null);

  return (
    <div className="overflow-x-auto rounded-lg border border-slate-200">
      <table className="w-full text-sm">
        <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wide">
          <tr>
            <th className="text-left px-4 py-3">Item ID</th>
            <th className="text-left px-4 py-3">Details</th>
            <th className="text-left px-4 py-3">Category</th>
            <th className="text-right px-4 py-3">Qty In</th>
            <th className="text-right px-4 py-3">Qty Out</th>
            <th className="text-right px-4 py-3">Stock Level</th>
            <th className="text-right px-4 py-3">Unit Cost</th>
            <th className="text-right px-4 py-3">Total Value</th>
            <th className="text-right px-4 py-3">Min Level</th>
            <th className="text-center px-4 py-3">Status</th>
            <th className="px-4 py-3"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {items.map((item) => (
            <tr key={item.id} className="hover:bg-slate-50/50">
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
          ))}
          {items.length === 0 && (
            <tr><td colSpan={11} className="px-4 py-8 text-center text-slate-400">No items yet.</td></tr>
          )}
        </tbody>
      </table>
      <StockItemFormDialog item={editing} open={!!editing} onOpenChange={(v) => !v && setEditing(null)} onSaved={onChanged} />
    </div>
  );
}