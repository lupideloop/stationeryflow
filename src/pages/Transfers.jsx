import React from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import TransferForm from "@/components/transfers/TransferForm";
import BulkTransferForm from "@/components/transfers/BulkTransferForm";
import TransferTable from "@/components/transfers/TransferTable";
import Pagination from "@/components/Pagination";
import { usePagination } from "@/hooks/usePagination";
import { queryKeys } from "@/lib/queryKeys";

export default function Transfers() {
  const queryClient = useQueryClient();

  const { data: items = [], isLoading: itemsLoading } = useQuery({
    queryKey: queryKeys.stockItems,
    queryFn: () => base44.entities.StockItem.list("item_id", 1000),
  });
  const { data: transfers = [], isLoading: transfersLoading } = useQuery({
    queryKey: queryKeys.transfers,
    queryFn: () => base44.entities.Transfer.list("-date", 5000),
  });
  const { data: departments = [], isLoading: departmentsLoading } = useQuery({
    queryKey: queryKeys.departments,
    queryFn: () => base44.entities.Department.list("name", 200),
  });

  const loading = itemsLoading || transfersLoading || departmentsLoading;
  const { page, totalPages, setPage, paged } = usePagination(transfers, 50);

  const onSaved = () => {
    queryClient.invalidateQueries({ queryKey: queryKeys.stockItems });
    queryClient.invalidateQueries({ queryKey: queryKeys.transfers });
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64"><div className="w-6 h-6 border-2 border-slate-300 border-t-slate-800 rounded-full animate-spin" /></div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Transfers</h1>
        <p className="text-sm text-slate-500 mt-1">Issue stock to departments.</p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <Card className="shadow-sm border-slate-200 lg:col-span-1">
          <CardHeader><CardTitle className="text-base font-semibold">New Transfer</CardTitle></CardHeader>
          <CardContent>
            <Tabs defaultValue="single">
              <TabsList className="w-full">
                <TabsTrigger value="single" className="flex-1">Single</TabsTrigger>
                <TabsTrigger value="bulk" className="flex-1">Bulk</TabsTrigger>
              </TabsList>
              <TabsContent value="single"><TransferForm items={items} departments={departments} onSaved={onSaved} /></TabsContent>
              <TabsContent value="bulk"><BulkTransferForm items={items} departments={departments} onSaved={onSaved} /></TabsContent>
            </Tabs>
          </CardContent>
        </Card>
        <div className="lg:col-span-2 space-y-3">
          <TransferTable transfers={paged} />
          <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
        </div>
      </div>
    </div>
  );
}