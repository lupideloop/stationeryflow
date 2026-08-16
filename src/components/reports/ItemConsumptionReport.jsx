import React, { useMemo } from "react";

export default function ItemConsumptionReport({ transfers, items }) {
  const rows = useMemo(() => {
    const totals = {};
    transfers.forEach((t) => {
      if (!totals[t.item_id]) totals[t.item_id] = { qty: 0, cost: 0, departments: new Set() };
      totals[t.item_id].qty += Number(t.quantity_issued) || 0;
      totals[t.item_id].cost += Number(t.total_cost) || 0;
      totals[t.item_id].departments.add(t.department);
    });
    return Object.entries(totals).map(([item_id, v]) => {
      const item = items.find((i) => i.item_id === item_id);
      return {
        item_id,
        details: item?.details || "—",
        qty: v.qty,
        cost: v.cost,
        departments: Array.from(v.departments).join(", "),
      };
    }).sort((a, b) => b.qty - a.qty);
  }, [transfers, items]);

  if (rows.length === 0) {
    return <p className="text-sm text-slate-400 py-10 text-center">No consumption recorded for this selection.</p>;
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-slate-200">
      <table className="w-full text-sm">
        <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wide">
          <tr>
            <th className="text-left px-4 py-3">Item</th>
            <th className="text-left px-4 py-3">Department(s)</th>
            <th className="text-right px-4 py-3">Qty Issued</th>
            <th className="text-right px-4 py-3">Total Cost</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {rows.map((r) => (
            <tr key={r.item_id} className="hover:bg-slate-50/50">
              <td className="px-4 py-3">
                <p className="font-medium text-slate-800">{r.details}</p>
                <p className="text-xs text-slate-400">{r.item_id}</p>
              </td>
              <td className="px-4 py-3 text-slate-600">{r.departments}</td>
              <td className="px-4 py-3 text-right">{r.qty}</td>
              <td className="px-4 py-3 text-right">€{r.cost.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}