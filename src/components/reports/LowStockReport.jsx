import React, { useMemo } from "react";
import { Badge } from "@/components/ui/badge";

export default function LowStockReport({ stockItems }) {
  const rows = useMemo(
    () => stockItems.filter((i) => i.status === "Low Stock").sort((a, b) => a.stock_level - b.stock_level),
    [stockItems]
  );

  if (rows.length === 0) {
    return <p className="text-sm text-slate-400 py-10 text-center">No items are currently low on stock.</p>;
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-slate-200">
      <table className="w-full text-sm">
        <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wide">
          <tr>
            <th className="text-left px-4 py-3">Item</th>
            <th className="text-right px-4 py-3">Stock Level</th>
            <th className="text-right px-4 py-3">Minimum</th>
            <th className="text-right px-4 py-3">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {rows.map((r) => (
            <tr key={r.item_id} className="hover:bg-slate-50/50">
              <td className="px-4 py-3">
                <p className="font-medium text-slate-800">{r.details}</p>
                <p className="text-xs text-slate-400">{r.item_id}</p>
              </td>
              <td className="px-4 py-3 text-right">{r.stock_level}</td>
              <td className="px-4 py-3 text-right">{r.minimum_stock_level}</td>
              <td className="px-4 py-3 text-right">
                <Badge variant="destructive">Low Stock</Badge>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}