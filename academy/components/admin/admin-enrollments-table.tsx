"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty"
import { Button } from "@/components/ui/button"
import { ListPagination } from "@/components/shared/list-pagination"
import { useListUrlState } from "@/hooks/use-list-url-state"
import type { PaginationMetadata } from "@/lib/list-query"

type EnrollmentRow = {
  id: string
  createdAt: string
  user: { id: string; name: string; email: string }
  course: { id: string; title: string; price: number; instructor: { id: string; name: string; email: string } }
  progress: { totalLessons: number; completedLessons: number; percent: number }
}

const formatUsd = (amount: number) =>
  new Intl.NumberFormat("en-ZW", { style: "currency", currency: "USD" }).format(amount)

export function AdminEnrollmentsTable() {
  const [rows, setRows] = useState<EnrollmentRow[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const listState = useListUrlState(10)
  const courseId = listState.value("courseId")
  const [pagination, setPagination] = useState<PaginationMetadata>({ page: 1, pageSize: 10, totalItems: 0, totalPages: 1, hasNextPage: false, hasPreviousPage: false, startItem: 0, endItem: 0 })

  const load = useCallback(async (signal?: AbortSignal) => {
    setIsLoading(true)
    setError(null)
    const res = await fetch(`/api/admin/enrollments${listState.queryString}`, { cache: "no-store", signal }).catch(() => null)
    const json = res ? await res.json().catch(() => null) : null
    if (!res || !res.ok) {
      setRows([])
      setIsLoading(false)
      setError(json?.error ?? "Failed to load enrollments")
      return
    }
    setRows((json?.enrollments ?? []) as EnrollmentRow[])
    if (json?.pagination) setPagination(json.pagination)
    setIsLoading(false)
  }, [listState.queryString])

  useEffect(() => {
    const controller = new AbortController()
    void load(controller.signal)
    return () => controller.abort()
  }, [load])

  const courseOptions = useMemo(() => {
    const map = new Map<string, string>()
    for (const r of rows) map.set(r.course.id, r.course.title)
    return Array.from(map.entries()).map(([id, title]) => ({ id, title }))
  }, [rows])

  return (
    <div className="bg-card rounded-xl border border-border shadow-sm">
      <div className="flex flex-col gap-4 p-5 border-b border-border">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Enrollments</h2>
          <p className="text-sm text-muted-foreground">View student enrollments and progress</p>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-center gap-3">
          <div className="flex-1">
            <Input
              value={listState.search}
              onChange={(e) => listState.setSearch(e.target.value)}
              aria-label="Search enrollments"
              placeholder="Search student, course, or instructor..."
            />
          </div>
          <select
            value={courseId}
            onChange={(e) => listState.setValue("courseId", e.target.value)}
            aria-label="Filter enrollments by course"
            className="h-9 rounded-lg border border-input bg-background px-3 text-sm"
          >
            <option value="">All courses</option>
            {courseOptions.map((c) => (
              <option key={c.id} value={c.id}>
                {c.title}
              </option>
            ))}
          </select>
          <select value={listState.value("sortDirection") || "desc"} onChange={(e) => listState.setValue("sortDirection", e.target.value)} aria-label="Sort enrollments" className="h-9 rounded-lg border border-input bg-background px-3 text-sm"><option value="desc">Newest</option><option value="asc">Oldest</option></select>
          <Button type="button" variant="ghost" size="sm" onClick={listState.clear}>Clear</Button>
        </div>

        {error ? <p className="text-sm text-destructive">{error}</p> : null}
      </div>

      {isLoading ? (
        <div className="p-6">
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      ) : null}

      {!isLoading && rows.length === 0 ? (
        <div className="p-6">
          <Empty className="border border-dashed">
            <EmptyHeader>
              <EmptyMedia variant="icon" />
              <EmptyTitle>No enrollments</EmptyTitle>
              <EmptyDescription>No enrollments match the selected filters.</EmptyDescription>
            </EmptyHeader>
            <EmptyContent />
          </Empty>
        </div>
      ) : null}

      {rows.length ? (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Student
                </th>
                <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Course
                </th>
                <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground hidden lg:table-cell">
                  Instructor
                </th>
                <th className="px-5 py-3 text-right text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Paid
                </th>
                <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Progress
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {rows.map((r) => (
                <tr key={r.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-5 py-4">
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{r.user.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{r.user.email}</p>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <div className="min-w-0">
                      <p className="text-sm text-foreground truncate">{r.course.title}</p>
                      <p className="text-xs text-muted-foreground lg:hidden truncate">{r.course.instructor.name}</p>
                    </div>
                  </td>
                  <td className="px-5 py-4 hidden lg:table-cell">
                    <div className="min-w-0">
                      <p className="text-sm text-foreground truncate">{r.course.instructor.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{r.course.instructor.email}</p>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-right text-sm text-foreground tabular-nums">{formatUsd(r.course.price)}</td>
                  <td className="px-5 py-4">
                    <div className="space-y-2 min-w-[220px]">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">
                          {r.progress.completedLessons}/{r.progress.totalLessons} lessons
                        </span>
                        <span className="font-medium text-foreground">{r.progress.percent}%</span>
                      </div>
                      <Progress value={r.progress.percent} className="h-2" />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
      <ListPagination pagination={pagination} onPageChange={listState.setPage} onPageSizeChange={listState.setPageSize} />
    </div>
  )
}
