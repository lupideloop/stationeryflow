import React from "react";
import SortableHeader from "@/components/SortableHeader";

export default function PurchaseTable({ purchases, sortKey, sortDir, onSort }) {
  const headerProps = { sortKey, sortDir, onSort };

  return (
    <div className="overflow-x-auto rounded-lg border border-slate-200">
      <table className="w-full text-sm">
        <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wide">
          <tr>
            <SortableHeader label="Date" sortKeyName="date" {...headerProps} />
            <SortableHeader label="Item ID" sortKeyName="item_id" {...headerProps} />
            <SortableHeader label="Details" sortKeyName="details" {...headerProps} />
            <SortableHeader label="Quantity" sortKeyName="quantity_purchased" align="right" {...headerProps} />
            <SortableHeader label="Unit Price" sortKeyName="unit_price" align="right" {...headerProps} />
            <SortableHeader label="Line Total" sortKeyName="line_total" align="right" {...headerProps} />
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {purchases.map((p) => (
            <tr key={p.id} className="hover:bg-slate-50/50">
              <td className="px-4 py-3">{p.date}</td>
              <td className="px-4 py-3 font-medium text-slate-800">{p.item_id}</td>
              <td className="px-4 py-3 text-slate-700">{p.details}</td>
              <td className="px-4 py-3 text-right">{p.quantity_purchased}</td>
              <td className="px-4 py-3 text-right">€{Number(p.unit_price || 0).toFixed(2)}</td>
              <td className="px-4 py-3 text-right font-medium">€{Number(p.line_total || 0).toFixed(2)}</td>
            </tr>
          ))}
          {purchases.length === 0 && (
            <tr><td colSpan={6} className="px-4 py-8 text-center text-slate-400">No purchases recorded yet.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}