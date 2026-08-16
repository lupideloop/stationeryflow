import React, { useEffect, useState, useCallback } from "react";
import { base44 } from "@/api/base44Client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import PurchaseForm from "@/components/purchases/PurchaseForm";
import PurchaseTable from "@/components/purchases/PurchaseTable";

export default function Purchases() {
  const [items, setItems] = useState([]);
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    const [i, p] = await Promise.all([
      base44.entities.StockItem.list("item_id", 1000),
      base44.entities.Purchase.list("-date", 1000),
    ]);
    setItems(i);
    setPurchases(p);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  if (loading) {
    return <div className="flex items-center justify-center h-64"><div className="w-6 h-6 border-2 border-slate-300 border-t-slate-800 rounded-full animate-spin" /></div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Purchases</h1>
        <p className="text-sm text-slate-500 mt-1">Record incoming stock and update unit costs.</p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <Card className="shadow-sm border-slate-200 lg:col-span-1">
          <CardHeader><CardTitle className="text-base font-semibold">New Purchase</CardTitle></CardHeader>
          <CardContent><PurchaseForm items={items} onSaved={load} /></CardContent>
        </Card>
        <div className="lg:col-span-2">
          <PurchaseTable purchases={purchases} />
        </div>
      </div>
    </div>
  );
}