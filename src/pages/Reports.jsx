import React, { useEffect, useState, useCallback, useMemo } from "react";
import { base44 } from "@/api/base44Client";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ReportFilters from "@/components/reports/ReportFilters";
import DepartmentConsumptionReport from "@/components/reports/DepartmentConsumptionReport";
import ItemConsumptionReport from "@/components/reports/ItemConsumptionReport";
import FrequencyReport from "@/components/reports/FrequencyReport";
import TopConsumedChart from "@/components/reports/TopConsumedChart";
import LowStockReport from "@/components/reports/LowStockReport";

function defaultStartDate() {
  const d = new Date();
  d.setMonth(d.getMonth() - 3);
  return d.toISOString().slice(0, 10);
}
function defaultEndDate() {
  return new Date().toISOString().slice(0, 10);
}

// Transfer.date is stored as "DD/MM/YYYY" — convert to a Date for comparison
function parseTransferDate(dateStr) {
  if (!dateStr) return null;
  const [day, month, year] = dateStr.split("/");
  if (!day || !month || !year) return null;
  return new Date(`${year}-${month}-${day}`);
}

export default function Reports() {
  const [transfers, setTransfers] = useState([]);
  const [stockItems, setStockItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    startDate: defaultStartDate(),
    endDate: defaultEndDate(),
    department: "all",
    category: "all",
    item: "all",
  });

  const load = useCallback(async () => {
    const [t, s] = await Promise.all([
      base44.entities.Transfer.list("-date", 5000),
      base44.entities.StockItem.list(),
    ]);
    setTransfers(t);
    setStockItems(s);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleFilterChange = (patch) => setFilters((prev) => ({ ...prev, ...patch }));

  const filteredTransfers = useMemo(() => {
    const start = filters.startDate ? new Date(filters.startDate) : null;
    const end = filters.endDate ? new Date(filters.endDate) : null;
    return transfers.filter((t) => {
      const tDate = parseTransferDate(t.date);
      if (start && tDate && tDate < start) return false;
      if (end && tDate && tDate > end) return false;
      if (filters.department !== "all" && t.department !== filters.department) return false;
      if (filters.category !== "all") {
        const item = stockItems.find((i) => i.item_id === t.item_id);
        if (!item || item.category !== filters.category) return false;
      }
      if (filters.item !== "all" && t.item_id !== filters.item) return false;
      return true;
    });
  }, [transfers, filters, stockItems]);

  if (loading) {
    return <div className="flex items-center justify-center h-64"><div className="w-6 h-6 border-2 border-slate-300 border-t-slate-800 rounded-full animate-spin" /></div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Reports</h1>
        <p className="text-sm text-slate-500 mt-1">Analyze consumption trends across departments and items.</p>
      </div>

      <ReportFilters
        startDate={filters.startDate}
        endDate={filters.endDate}
        department={filters.department}
        category={filters.category}
        item={filters.item}
        items={stockItems}
        onChange={handleFilterChange}
      />

      <Tabs defaultValue="department">
        <TabsList className="flex-wrap h-auto">
          <TabsTrigger value="department">By Department</TabsTrigger>
          <TabsTrigger value="item">By Item</TabsTrigger>
          <TabsTrigger value="frequency">Consumption Frequency</TabsTrigger>
          <TabsTrigger value="top">Top Consumed (Value)</TabsTrigger>
          <TabsTrigger value="lowstock">Low Stock</TabsTrigger>
        </TabsList>

        <TabsContent value="department">
          <Card>
            <CardHeader><CardTitle className="text-base">Consumption by Department</CardTitle></CardHeader>
            <CardContent><DepartmentConsumptionReport transfers={filteredTransfers} /></CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="item">
          <Card>
            <CardHeader><CardTitle className="text-base">Consumption by Item</CardTitle></CardHeader>
            <CardContent><ItemConsumptionReport transfers={filteredTransfers} items={stockItems} /></CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="frequency">
          <Card>
            <CardHeader><CardTitle className="text-base">Consumption Frequency by Item</CardTitle></CardHeader>
            <CardContent><FrequencyReport transfers={filteredTransfers} items={stockItems} /></CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="top">
          <Card>
            <CardHeader><CardTitle className="text-base">Top 10 Items by Consumption Value</CardTitle></CardHeader>
            <CardContent><TopConsumedChart transfers={filteredTransfers} items={stockItems} /></CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="lowstock">
          <Card>
            <CardHeader><CardTitle className="text-base">Items Currently Low on Stock</CardTitle></CardHeader>
            <CardContent><LowStockReport stockItems={stockItems} /></CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}