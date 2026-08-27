import React from "react";
import { base44 } from "@/api/base44Client";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";

export default function StockTakeTable({ entries, onChanged, allChecked, onToggleAll }) {
  const handleFoundChange = async (entry, value) => {
    await base44.entities.StockTake.update(entry.id, { stock_found: Number(value) || 0 });
    onChanged?.();
  };

  const handleCheckChange = async (entry, checked) => {
    await base44.entities.StockTake.update(entry.id, { checked });
    onChanged?.();
  };

  return (
    <div className="overflow-x-auto rounded-lg border border-slate-200">
      <table className="w-full text-sm">
        <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wide">
          <tr>
            <th className="text-left px-4 py-3">Code</th>
            <th className="text-left px-4 py-3">Item Description</th>
            <th className="text-right px-4 py-3">Stock on Record</th>
            <th className="text-right px-4 py-3">Stock Found</th>
            <th className="text-right px-4 py-3">Variance</th>
            <th className="text-left px-4 py-3">Last Snapshot</th>
            <th className="text-center px-4 py-3">
              <div className="flex items-center justify-center gap-1.5">
                <span>Checked</span>
                <Checkbox
                  checked={allChecked}
                  onCheckedChange={(v) => onToggleAll?.(!!v)}
                  title={allChecked ? "Deselect all" : "Select all"}
                />
              </div>
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {entries.map((e) => {
            const variance = (Number(e.stock_found) || 0) - (Number(e.stock_on_record) || 0);
            return (
              <tr key={e.id} className="hover:bg-slate-50/50">
                <td className="px-4 py-3 font-medium text-slate-800">{e.code}</td>
                <td className="px-4 py-3 text-slate-700">{e.item_description}</td>
                <td className="px-4 py-3 text-right">{e.stock_on_record}</td>
                <td className="px-4 py-3 text-right">
                  <Input
                    type="number"
                    defaultValue={e.stock_found}
                    className="w-24 h-8 text-right ml-auto"
                    onBlur={(ev) => handleFoundChange(e, ev.target.value)}
                  />
                </td>
                <td className="px-4 py-3 text-right">
                  {variance !== 0 ? (
                    <Badge className={variance < 0 ? "bg-red-100 text-red-700 hover:bg-red-100" : "bg-blue-100 text-blue-700 hover:bg-blue-100"}>
                      {variance > 0 ? "+" : ""}{variance}
                    </Badge>
                  ) : <span className="text-slate-400">0</span>}
                </td>
                <td className="px-4 py-3 text-slate-500 text-xs">{e.last_snapshot ? new Date(e.last_snapshot).toLocaleString() : "—"}</td>
                <td className="px-4 py-3 text-center">
                  <Checkbox checked={e.checked} onCheckedChange={(v) => handleCheckChange(e, !!v)} />
                </td>
              </tr>
            );
          })}
          {entries.length === 0 && (
            <tr><td colSpan={7} className="px-4 py-8 text-center text-slate-400">No stock take started for this month yet.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}