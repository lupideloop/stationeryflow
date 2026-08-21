import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { queryKeys } from "@/lib/queryKeys";

export default function Requisitions() {
  const queryClient = useQueryClient();

  const { data: requisitions = [], isLoading } = useQuery({
    queryKey: queryKeys.requisitions,
    queryFn: () => base44.entities.Requisition.list("-request_date", 200),
  });

  const toggleMutation = useMutation({
    mutationFn: (req) => base44.entities.Requisition.update(req.id, { status: req.status === "Pending" ? "Reviewed" : "Pending" }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.requisitions }),
  });

  if (isLoading) {
    return <div className="flex items-center justify-center h-64"><div className="w-6 h-6 border-2 border-slate-300 border-t-slate-800 rounded-full animate-spin" /></div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Requisitions</h1>
        <p className="text-sm text-muted-foreground mt-1">Review requisition requests submitted by departments.</p>
      </div>

      {requisitions.length === 0 && (
        <p className="text-sm text-muted-foreground">No requisitions submitted yet.</p>
      )}

      <div className="space-y-4">
        {requisitions.map((req) => (
          <Card key={req.id}>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base">{req.department} — {req.requester_name}</CardTitle>
                <p className="text-xs text-muted-foreground mt-1">{req.request_date}</p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={req.status === "Reviewed" ? "secondary" : "default"}>{req.status}</Badge>
                <Button size="sm" variant="outline" onClick={() => toggleMutation.mutate(req)}>
                  Mark {req.status === "Pending" ? "Reviewed" : "Pending"}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-muted-foreground border-b">
                    <th className="py-1.5 pr-3">Requested Item</th>
                    <th className="py-1.5 pr-3">Qty</th>
                    <th className="py-1.5 pr-3">Item ID</th>
                    <th className="py-1.5 pr-3">Stock Level</th>
                  </tr>
                </thead>
                <tbody>
                  {(req.items || []).map((it, idx) => (
                    <tr key={idx} className="border-b last:border-0">
                      <td className="py-1.5 pr-3">{it.item_name}</td>
                      <td className="py-1.5 pr-3">{it.quantity}</td>
                      <td className="py-1.5 pr-3">{it.matched_item_id || <span className="text-muted-foreground">No match</span>}</td>
                      <td className="py-1.5 pr-3">
                        {it.stock_level != null ? (
                          <span className={it.stock_level <= 0 ? "text-red-600 font-medium" : ""}>{it.stock_level}</span>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}