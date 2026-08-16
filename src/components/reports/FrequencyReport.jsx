import React, { useMemo } from "react";

export default function FrequencyReport({ transfers, items }) {
  const rows = useMemo(() => {
    const counts = {};
    transfers.forEach((t) => {
      if (!counts[t.item_id]) counts[t.item_id] = { transactions: 0, qty: 0 };
      counts[t.item_id].transactions += 1;
      counts[t.item_id].qty += Number(t.quantity_issued) || 0;
    });
    return Object.entries(counts).map(([item_id, v]) => {
      const item = items.find((i) => i.item_id === item_id);
      return {
        item_id,
        details: item?.details || "—",
        transactions: v.transactions,
        avgQty: v.transactions ? v.qty / v.transactions : 0,
      };
    }).sort((a, b) => b.transactions - a.transactions);
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
            <th className="text-right px-4 py-3">Times Issued</th>
            <th className="text-right px-4 py-3">Avg Qty / Issue</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {rows.map((r) => (
            <tr key={r.item_id} className="hover:bg-slate-50/50">
              <td className="px-4 py-3">
                <p className="font-medium text-slate-800">{r.details}</p>
                <p className="text-xs text-slate-400">{r.item_id}</p>
              </td>
              <td className="px-4 py-3 text-right">{r.transactions}</td>
              <td className="px-4 py-3 text-right">{r.avgQty.toFixed(1)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}