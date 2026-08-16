import React, { useEffect, useState, useCallback } from "react";
import { base44 } from "@/api/base44Client";
import { Input } from "@/components/ui/input";
import StockItemTable from "@/components/stock/StockItemTable";
import { Search } from "lucide-react";

export default function MasterStock() {
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    const data = await base44.entities.StockItem.list("item_id", 1000);
    setItems(data);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const filtered = items.filter((i) =>
    i.item_id.toLowerCase().includes(search.toLowerCase()) ||
    i.details.toLowerCase().includes(search.toLowerCase()) ||
    i.category.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return <div className="flex items-center justify-center h-64"><div className="w-6 h-6 border-2 border-slate-300 border-t-slate-800 rounded-full animate-spin" /></div>;
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Master Stock</h1>
          <p className="text-sm text-slate-500 mt-1">{items.length} items tracked</p>
        </div>
        <div className="relative w-64">
          <Search className="absolute left-2.5 top-2.5 w-4 h-4 text-slate-400" />
          <Input placeholder="Search items..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-8" />
        </div>
      </div>
      <StockItemTable items={filtered} onChanged={load} />
    </div>
  );
}