import React, { useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function TopConsumedChart({ transfers, items }) {
  const data = useMemo(() => {
    const totals = {};
    transfers.forEach((t) => {
      if (!totals[t.item_id]) totals[t.item_id] = 0;
      totals[t.item_id] += Number(t.total_cost) || 0;
    });
    return Object.entries(totals)
      .map(([item_id, cost]) => {
        const item = items.find((i) => i.item_id === item_id);
        return { name: item?.details || item_id, cost: Number(cost.toFixed(2)) };
      })
      .sort((a, b) => b.cost - a.cost)
      .slice(0, 10);
  }, [transfers, items]);

  if (data.length === 0) {
    return <p className="text-sm text-slate-400 py-10 text-center">No consumption recorded for this selection.</p>;
  }

  return (
    <ResponsiveContainer width="100%" height={360}>
      <BarChart data={data} layout="vertical" margin={{ left: 20, right: 20 }}>
        <CartesianGrid strokeDasharray="3 3" horizontal={false} />
        <XAxis type="number" tickFormatter={(v) => `€${v}`} />
        <YAxis type="category" dataKey="name" width={160} tick={{ fontSize: 12 }} />
        <Tooltip formatter={(v) => [`€${v}`, "Total Cost"]} />
        <Bar dataKey="cost" fill="#0f172a" radius={[0, 4, 4, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}