import React from "react";

export default function StockTakePrintView({ entries, month, year }) {
  return (
    <div className="hidden print:block p-6">
      <h1 className="text-xl font-semibold mb-1">Stock Take — {month}/{year}</h1>
      <p className="text-sm text-slate-500 mb-4">{entries.length} items</p>
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="border-b border-slate-400">
            <th className="text-left py-2 pr-2">Code</th>
            <th className="text-left py-2 pr-2">Item Description</th>
            <th className="text-right py-2 pr-2">Stock on Record</th>
            <th className="text-right py-2 pr-2">Stock Found</th>
            <th className="text-right py-2 pr-2">Variance</th>
            <th className="text-center py-2 pr-2">Checked</th>
          </tr>
        </thead>
        <tbody>
          {entries.map((e) => {
            const variance = (Number(e.stock_found) || 0) - (Number(e.stock_on_record) || 0);
            return (
              <tr key={e.id} className="border-b border-slate-200">
                <td className="py-1.5 pr-2">{e.code}</td>
                <td className="py-1.5 pr-2">{e.item_description}</td>
                <td className="py-1.5 pr-2 text-right">{e.stock_on_record}</td>
                <td className="py-1.5 pr-2 text-right">{e.stock_found}</td>
                <td className="py-1.5 pr-2 text-right">{variance > 0 ? "+" : ""}{variance}</td>
                <td className="py-1.5 pr-2 text-center">{e.checked ? "✓" : ""}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}