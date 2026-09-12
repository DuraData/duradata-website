"use client"

import { Button } from "@/components/ui/button"
import type { PaginationMetadata } from "@/lib/list-query"
import { useListUrlState } from "@/hooks/use-list-url-state"

function pageWindow(current: number, total: number): Array<number | "ellipsis-left" | "ellipsis-right"> {
  if (total <= 7) return Array.from({ length: total }, (_, index) => index + 1)
  const pages: Array<number | "ellipsis-left" | "ellipsis-right"> = [1]
  const start = Math.max(2, current - 1)
  const end = Math.min(total - 1, current + 1)
  if (start > 2) pages.push("ellipsis-left")
  for (let page = start; page <= end; page += 1) pages.push(page)
  if (end < total - 1) pages.push("ellipsis-right")
  pages.push(total)
  return pages
}

export function ListPagination({
  pagination,
  onPageChange,
  onPageSizeChange,
  pageSizes = [10, 25, 50, 100],
}: {
  pagination: PaginationMetadata
  onPageChange: (page: number) => void
  onPageSizeChange: (pageSize: number) => void
  pageSizes?: readonly number[]
}) {
  return (
    <nav aria-label="Pagination" className="flex flex-col gap-3 border-t border-border px-4 py-4 lg:flex-row lg:items-center lg:justify-between">
      <p className="text-sm text-muted-foreground" aria-live="polite">
        Showing {pagination.startItem}-{pagination.endItem} of {pagination.totalItems}
      </p>
      <div className="flex flex-wrap items-center gap-2">
        <label className="flex items-center gap-2 text-sm text-muted-foreground">
          Rows per page
          <select
            aria-label="Rows per page"
            className="h-9 rounded-md border border-input bg-background px-2 text-sm"
            value={pagination.pageSize}
            onChange={(event) => onPageSizeChange(Number(event.target.value))}
          >
            {pageSizes.map((size) => <option key={size} value={size}>{size}</option>)}
          </select>
        </label>
        <Button type="button" variant="outline" size="sm" disabled={!pagination.hasPreviousPage} onClick={() => onPageChange(pagination.page - 1)}>Previous</Button>
        {pageWindow(pagination.page, pagination.totalPages).map((item) => typeof item === "number" ? (
          <Button
            key={item}
            type="button"
            variant={item === pagination.page ? "default" : "outline"}
            size="sm"
            aria-label={`Page ${item}`}
            aria-current={item === pagination.page ? "page" : undefined}
            onClick={() => onPageChange(item)}
          >{item}</Button>
        ) : <span key={item} aria-hidden="true" className="px-1 text-muted-foreground">…</span>)}
        <Button type="button" variant="outline" size="sm" disabled={!pagination.hasNextPage} onClick={() => onPageChange(pagination.page + 1)}>Next</Button>
      </div>
    </nav>
  )
}

export function UrlListPagination({ pagination, pageSizes }: { pagination: PaginationMetadata; pageSizes?: readonly number[] }) {
  const state = useListUrlState(pagination.pageSize)
  return <ListPagination pagination={pagination} pageSizes={pageSizes} onPageChange={state.setPage} onPageSizeChange={state.setPageSize} />
}
