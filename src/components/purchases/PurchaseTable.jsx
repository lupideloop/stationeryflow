import React from "react";

export default function PurchaseTable({ purchases }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-slate-200">
      <table className="w-full text-sm">
        <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wide">
          <tr>
            <th className="text-left px-4 py-3">Date</th>
            <th className="text-left px-4 py-3">Item ID</th>
            <th className="text-left px-4 py-3">Details</th>
            <th className="text-right px-4 py-3">Quantity</th>
            <th className="text-right px-4 py-3">Unit Price</th>
            <th className="text-right px-4 py-3">Line Total</th>
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