import React, { useEffect, useState, useCallback } from "react";
import { base44 } from "@/api/base44Client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ConsumptionByItemCard from "@/components/dashboard/ConsumptionByItemCard";
import ConsumptionByValueChart from "@/components/dashboard/ConsumptionByValueChart";
import NewItemForm from "@/components/dashboard/NewItemForm";
import { AlertTriangle } from "lucide-react";

export default function Dashboard() {
  const [items, setItems] = useState([]);
  const [transfers, setTransfers] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    const [i, t] = await Promise.all([
      base44.entities.StockItem.list("-created_date", 1000),
      base44.entities.Transfer.list("-date", 2000),
    ]);
    setItems(i);
    setTransfers(t);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const lowStock = items.filter((i) => i.status === "Low Stock");

  if (loading) {
    return <div className="flex items-center justify-center h-64"><div className="w-6 h-6 border-2 border-muted border-t-primary rounded-full animate-spin" /></div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">Overview of consumption, value and stock health.</p>
      </div>

      {lowStock.length > 0 && (
        <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-lg p-4 stat-card-1">
          <AlertTriangle className="w-5 h-5 text-amber-500 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-amber-800">{lowStock.length} item{lowStock.length > 1 ? "s" : ""} at or below minimum stock level</p>
            <p className="text-xs text-amber-600 mt-0.5">{lowStock.slice(0, 5).map((i) => i.details).join(", ")}{lowStock.length > 5 ? "…" : ""}</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <ConsumptionByItemCard transfers={transfers} items={items} />
        <ConsumptionByValueChart transfers={transfers} />
      </div>

      <Card className="shadow-sm max-w-xl">
        <CardHeader>
          <CardTitle className="text-base font-semibold">Register New Item</CardTitle>
        </CardHeader>
        <CardContent>
          <NewItemForm items={items} onCreated={load} />
        </CardContent>
      </Card>
    </div>
  );
}