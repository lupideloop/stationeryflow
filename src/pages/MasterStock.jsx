import React, { useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Input } from "@/components/ui/input";
import StockItemTable from "@/components/stock/StockItemTable";
import Pagination from "@/components/Pagination";
import { useDebounce } from "@/hooks/useDebounce";
import { usePagination } from "@/hooks/usePagination";
import { useSort } from "@/hooks/useSort";
import { queryKeys } from "@/lib/queryKeys";
import { Search } from "lucide-react";

export default function MasterStock() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 250);

  const { data: items = [], isLoading } = useQuery({
    queryKey: queryKeys.stockItems,
    queryFn: () => base44.entities.StockItem.list("item_id", 1000),
  });

  const filtered = useMemo(() => {
    const q = debouncedSearch.toLowerCase();
    return items.filter((i) =>
      i.item_id.toLowerCase().includes(q) ||
      i.details.toLowerCase().includes(q) ||
      i.category.toLowerCase().includes(q)
    );
  }, [items, debouncedSearch]);

  const { sorted, sortKey, sortDir, toggleSort } = useSort(filtered);
  const { page, totalPages, setPage, paged } = usePagination(sorted, 50);

  const totalStockValue = items.reduce((sum, i) => sum + (Number(i.total_value) || 0), 0);

  if (isLoading) {
    return <div className="flex items-center justify-center h-64"><div className="w-6 h-6 border-2 border-slate-300 border-t-slate-800 rounded-full animate-spin" /></div>;
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Master Stock</h1>
          <p className="text-sm text-slate-500 mt-1">{items.length} items tracked</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-xs text-slate-500">Total Stock Value</p>
            <p className="text-lg font-semibold text-slate-900">€{totalStockValue.toFixed(2)}</p>
          </div>
          <div className="relative w-64">
            <Search className="absolute left-2.5 top-2.5 w-4 h-4 text-slate-400" />
            <Input placeholder="Search items..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-8" />
          </div>
        </div>
      </div>
      <StockItemTable
        items={paged}
        onChanged={() => queryClient.invalidateQueries({ queryKey: queryKeys.stockItems })}
        sortKey={sortKey}
        sortDir={sortDir}
        onSort={toggleSort}
      />
      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  );
}