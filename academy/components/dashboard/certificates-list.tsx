"use client"

import Link from "next/link"
import { useCallback, useEffect, useState } from "react"
import { Download, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty"
import { ListPagination } from "@/components/shared/list-pagination"
import { useListUrlState } from "@/hooks/use-list-url-state"
import type { PaginationMetadata } from "@/lib/list-query"

type CertificateRow = {
  id: string
  certificateId: string
  issuedAt: string
  course: { id: string; title: string }
}

export function CertificatesList() {
  const [rows, setRows] = useState<CertificateRow[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const listState = useListUrlState(10)
  const [pagination, setPagination] = useState<PaginationMetadata>({ page: 1, pageSize: 10, totalItems: 0, totalPages: 1, hasNextPage: false, hasPreviousPage: false, startItem: 0, endItem: 0 })

  const load = useCallback(async () => {
      setIsLoading(true)
      setError(null)
      const res = await fetch(`/api/certificates${listState.queryString}`, { cache: "no-store" }).catch(() => null)
      const json = res ? await res.json().catch(() => null) : null
      if (!res || !res.ok) {
        setRows([])
        setError(json?.error ?? "Failed to load certificates")
        setIsLoading(false)
        return
      }
      setRows((json?.certificates ?? []) as CertificateRow[])
      if (json?.pagination) setPagination(json.pagination)
      setIsLoading(false)
  }, [listState.queryString])
  useEffect(() => { void load() }, [load])

  if (isLoading) {
    return (
      <div className="rounded-xl border border-border bg-card p-6">
        <p className="text-sm text-muted-foreground">Loading certificates...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-xl border border-border bg-card p-6">
        <p className="text-sm text-destructive">{error}</p>
      </div>
    )
  }

  if (rows.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-card p-6">
        <Empty className="border border-dashed">
          <EmptyHeader>
            <EmptyMedia variant="icon" />
            <EmptyTitle>No certificates yet</EmptyTitle>
            <EmptyDescription>Finish a course to earn your first certificate.</EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button asChild>
              <Link href="/dashboard/courses">Go to My Courses</Link>
            </Button>
          </EmptyContent>
        </Empty>
      </div>
    )
  }

  return (
    <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
      <div className="flex flex-wrap items-center gap-3 border-b border-border p-4"><select aria-label="Filter certificates by learning type" value={listState.value("kind")} onChange={(event) => listState.setValue("kind", event.target.value)} className="h-10 rounded-md border bg-background px-3"><option value="">All certificates</option><option value="free-learning">Free Learning</option><option value="course">Corporate Learning</option></select><select aria-label="Sort certificates" value={listState.value("sortDirection") || "desc"} onChange={(event) => listState.setValue("sortDirection", event.target.value)} className="h-10 rounded-md border bg-background px-3"><option value="desc">Newest</option><option value="asc">Oldest</option></select><Button variant="ghost" onClick={listState.clear}>Clear</Button></div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Course
              </th>
              <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Completion date
              </th>
              <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Certificate ID
              </th>
              <th className="px-5 py-3 text-right text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {rows.map((c) => {
              const date = new Date(c.issuedAt).toLocaleDateString("en-ZW")
              return (
                <tr key={c.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-5 py-4">
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{c.course.title}</p>
                      <p className="text-xs text-muted-foreground truncate">{c.course.id}</p>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-sm text-foreground whitespace-nowrap">{date}</td>
                  <td className="px-5 py-4 text-sm text-muted-foreground whitespace-nowrap">{c.certificateId}</td>
                  <td className="px-5 py-4">
                    <div className="flex justify-end gap-2">
                      <Button asChild variant="secondary" size="sm">
                        <Link href={`/dashboard/certificates/${c.id}`}>
                          <Eye className="h-4 w-4 mr-2" />
                          View
                        </Link>
                      </Button>
                      <Button asChild variant="outline" size="sm">
                        <a href={`/api/certificates/${c.id}/download`}>
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </a>
                      </Button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
      <ListPagination pagination={pagination} onPageChange={listState.setPage} onPageSizeChange={listState.setPageSize} />
    </div>
  )
}
