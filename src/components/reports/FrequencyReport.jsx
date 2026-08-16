import React, { useMemo } from "react";

// Transfer.date is stored as "DD/MM/YYYY"
function parseTransferDate(dateStr) {
  if (!dateStr) return null;
  const [day, month, year] = dateStr.split("/");
  if (!day || !month || !year) return null;
  return new Date(`${year}-${month}-${day}`);
}

export default function FrequencyReport({ transfers, items }) {
  const rows = useMemo(() => {
    const grouped = {};
    transfers.forEach((t) => {
      if (!grouped[t.item_id]) grouped[t.item_id] = { transactions: 0, qty: 0, dates: [] };
      grouped[t.item_id].transactions += 1;
      grouped[t.item_id].qty += Number(t.quantity_issued) || 0;
      const d = parseTransferDate(t.date);
      if (d) grouped[t.item_id].dates.push(d);
    });
    return Object.entries(grouped).map(([item_id, v]) => {
      const item = items.find((i) => i.item_id === item_id);
      const sortedDates = v.dates.sort((a, b) => a - b);
      let avgDaysBetween = null;
      let estimatedNextDate = null;
      if (sortedDates.length >= 2) {
        const gaps = [];
        for (let i = 1; i < sortedDates.length; i++) {
          gaps.push((sortedDates[i] - sortedDates[i - 1]) / (1000 * 60 * 60 * 24));
        }
        avgDaysBetween = gaps.reduce((a, b) => a + b, 0) / gaps.length;
        const lastDate = sortedDates[sortedDates.length - 1];
        estimatedNextDate = new Date(lastDate.getTime() + avgDaysBetween * 24 * 60 * 60 * 1000);
      }
      return {
        item_id,
        details: item?.details || "—",
        transactions: v.transactions,
        avgQty: v.transactions ? v.qty / v.transactions : 0,
        avgDaysBetween,
        estimatedNextDate,
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
            <th className="text-right px-4 py-3">Avg Days Between Requests</th>
            <th className="text-right px-4 py-3">Estimated Next Request</th>
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
              <td className="px-4 py-3 text-right">{r.avgDaysBetween !== null ? `${r.avgDaysBetween.toFixed(0)} days` : "—"}</td>
              <td className="px-4 py-3 text-right">
                {r.estimatedNextDate ? r.estimatedNextDate.toLocaleDateString("en-GB") : "—"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}