import React from "react";
import { ArrowUp, ArrowDown, ArrowUpDown } from "lucide-react";

export default function SortableHeader({ label, sortKeyName, sortKey, sortDir, onSort, align = "left" }) {
  const active = sortKey === sortKeyName;
  const Icon = active ? (sortDir === "asc" ? ArrowUp : ArrowDown) : ArrowUpDown;
  const justify = align === "right" ? "justify-end" : align === "center" ? "justify-center" : "justify-start";

  return (
    <th className={`px-4 py-3 text-${align}`}>
      <button
        type="button"
        onClick={() => onSort(sortKeyName)}
        className={`inline-flex items-center gap-1 w-full ${justify} hover:text-slate-700 ${active ? "text-slate-800" : ""}`}
      >
        {label}
        <Icon className="w-3 h-3 shrink-0" />
      </button>
    </th>
  );
}