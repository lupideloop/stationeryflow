import React from "react";

export default function TransferTable({ transfers }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-slate-200">
      <table className="w-full text-sm">
        <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wide">
          <tr>
            <th className="text-left px-4 py-3">Date</th>
            <th className="text-left px-4 py-3">Item ID</th>
            <th className="text-left px-4 py-3">Details</th>
            <th className="text-right px-4 py-3">Qty Issued</th>
            <th className="text-left px-4 py-3">Department</th>
            <th className="text-right px-4 py-3">Unit Price</th>
            <th className="text-right px-4 py-3">Total Cost</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {transfers.map((t) => (
            <tr key={t.id} className="hover:bg-slate-50/50">
              <td className="px-4 py-3">{t.date}</td>
              <td className="px-4 py-3 font-medium text-slate-800">{t.item_id}</td>
              <td className="px-4 py-3 text-slate-700">{t.details}</td>
              <td className="px-4 py-3 text-right">{t.quantity_issued}</td>
              <td className="px-4 py-3 text-slate-500">{t.department}</td>
              <td className="px-4 py-3 text-right">€{Number(t.unit_price || 0).toFixed(2)}</td>
              <td className="px-4 py-3 text-right font-medium">€{Number(t.total_cost || 0).toFixed(2)}</td>
            </tr>
          ))}
          {transfers.length === 0 && (
            <tr><td colSpan={7} className="px-4 py-8 text-center text-slate-400">No transfers recorded yet.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}