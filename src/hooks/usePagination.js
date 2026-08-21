import { useMemo, useState } from "react";

// Pages an in-memory array. Returns the current page's slice plus controls.
export function usePagination(items, pageSize = 50) {
  const [page, setPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));
  const currentPage = Math.min(page, totalPages);

  const paged = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return items.slice(start, start + pageSize);
  }, [items, currentPage, pageSize]);

  return { page: currentPage, totalPages, setPage, paged };
}