import React, { useMemo } from "react";

export default function DepartmentConsumptionReport({ transfers, departments = [] }) {
  const rows = useMemo(() => {
    return departments.map((d) => {
      const deptTransfers = transfers.filter((t) => t.department === d.name);
      const totalQty = deptTransfers.reduce((sum, t) => sum + (Number(t.quantity_issued) || 0), 0);
      const totalCost = deptTransfers.reduce((sum, t) => sum + (Number(t.total_cost) || 0), 0);
      return { department: d.name, totalQty, totalCost };
    }).filter((r) => r.totalQty > 0 || r.totalCost > 0);
  }, [transfers, departments]);

  const grandTotal = rows.reduce((sum, r) => sum + r.totalCost, 0);

  if (rows.length === 0) {
    return <p className="text-sm text-slate-400 py-10 text-center">No consumption recorded for this selection.</p>;
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-slate-200">
      <table className="w-full text-sm">
        <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wide">
          <tr>
            <th className="text-left px-4 py-3">Department</th>
            <th className="text-right px-4 py-3">Items Issued</th>
            <th className="text-right px-4 py-3">Total Cost</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {rows.map((r) => (
            <tr key={r.department} className="hover:bg-slate-50/50">
              <td className="px-4 py-3 font-medium text-slate-800">{r.department}</td>
              <td className="px-4 py-3 text-right">{r.totalQty}</td>
              <td className="px-4 py-3 text-right">€{r.totalCost.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr className="bg-slate-50 font-semibold">
            <td className="px-4 py-3">Total</td>
            <td className="px-4 py-3"></td>
            <td className="px-4 py-3 text-right">€{grandTotal.toFixed(2)}</td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}