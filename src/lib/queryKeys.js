// Centralized TanStack Query keys — keep entity list queries consistent
// across pages so cache reads/invalidations stay in sync.
export const queryKeys = {
  stockItems: ["StockItem"],
  purchases: ["Purchase"],
  transfers: ["Transfer"],
  requisitions: ["Requisition"],
  stockTake: (month, year) => ["StockTake", month, year],
};