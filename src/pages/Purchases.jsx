import React from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import PurchaseForm from "@/components/purchases/PurchaseForm";
import BulkPurchaseForm from "@/components/purchases/BulkPurchaseForm";
import PurchaseTable from "@/components/purchases/PurchaseTable";
import Pagination from "@/components/Pagination";
import { usePagination } from "@/hooks/usePagination";
import { queryKeys } from "@/lib/queryKeys";

export default function Purchases() {
  const queryClient = useQueryClient();

  const { data: items = [], isLoading: itemsLoading } = useQuery({
    queryKey: queryKeys.stockItems,
    queryFn: () => base44.entities.StockItem.list("item_id", 1000),
  });
  const { data: purchases = [], isLoading: purchasesLoading } = useQuery({
    queryKey: queryKeys.purchases,
    queryFn: () => base44.entities.Purchase.list("-date", 1000),
  });

  const loading = itemsLoading || purchasesLoading;
  const { page, totalPages, setPage, paged } = usePagination(purchases, 50);

  const onSaved = () => {
    queryClient.invalidateQueries({ queryKey: queryKeys.stockItems });
    queryClient.invalidateQueries({ queryKey: queryKeys.purchases });
  };

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
          <CardContent>
            <Tabs defaultValue="single">
              <TabsList className="w-full">
                <TabsTrigger value="single" className="flex-1">Single</TabsTrigger>
                <TabsTrigger value="bulk" className="flex-1">Bulk</TabsTrigger>
              </TabsList>
              <TabsContent value="single"><PurchaseForm items={items} onSaved={onSaved} /></TabsContent>
              <TabsContent value="bulk"><BulkPurchaseForm items={items} onSaved={onSaved} /></TabsContent>
            </Tabs>
          </CardContent>
        </Card>
        <div className="lg:col-span-2 space-y-3">
          <PurchaseTable purchases={paged} />
          <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
        </div>
      </div>
    </div>
  );
}