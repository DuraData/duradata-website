"use client"

import Link from "next/link"
import { useCallback, useEffect, useState } from "react"
import { FilePenLine, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty"
import { StatusBadge } from "@/components/admin/status-badge"
import { ConfirmDialog } from "@/components/admin/confirm-dialog"
import { toast } from "@/hooks/use-toast"
import { formatZimLevel, formatExaminingBody } from "@/lib/zim-education"
import { useListUrlState } from "@/hooks/use-list-url-state"
import { ListPagination } from "@/components/shared/list-pagination"
import type { PaginationMetadata } from "@/lib/list-query"

type SubjectRow = {
  id: string
  title: string
  subject: string
  grade: number
  moderationNote: string | null
  price: number
  status: "draft" | "pending" | "approved" | "rejected" | "suspended"
  examiningBody: string
  createdAt: string
  teacher: { id: string; name: string; email: string } | null
  category: { id: string; name: string } | null
  _count: { enrollments: number; liveLessons: number }
}

const formatUsd = (amount: number) =>
  new Intl.NumberFormat("en-ZW", { style: "currency", currency: "USD" }).format(amount)

export function AdminSubjectsTable() {
  const [rows, setRows] = useState<SubjectRow[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const listState = useListUrlState(10)
  const status = listState.value("status")
  const [pagination, setPagination] = useState<PaginationMetadata>({ page: 1, pageSize: 10, totalItems: 0, totalPages: 1, hasNextPage: false, hasPreviousPage: false, startItem: 0, endItem: 0 })
  const [busyId, setBusyId] = useState<string | null>(null)

  const load = useCallback(async (signal?: AbortSignal) => {
    setIsLoading(true)
    setError(null)
    const res = await fetch(`/api/admin/subjects${listState.queryString}`, { cache: "no-store", signal }).catch(() => null)
    const json = res ? await res.json().catch(() => null) : null

    if (signal?.aborted) return

    if (!res || !res.ok) {
      setRows([])
      setIsLoading(false)
      setError(json?.error ?? "Failed to load subjects")
      return
    }

    setRows((json?.subjects ?? []) as SubjectRow[])
    if (json?.pagination) setPagination(json.pagination)
    setIsLoading(false)
  }, [listState.queryString])

  useEffect(() => {
    const controller = new AbortController()
    void load(controller.signal)
    return () => controller.abort()
  }, [load])

  const act = async (subjectId: string, action: string) => {
    setBusyId(subjectId)
    try {
      const res = await fetch("/api/admin/subjects", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subjectId, action }),
      }).catch(() => null)
      const json = res ? await res.json().catch(() => null) : null
      if (!res || !res.ok) throw new Error(json?.error ?? "Request failed")
      toast({ title: "Subject updated" })
      await load()
    } catch (e) {
      toast({ title: "Failed to update subject", description: e instanceof Error ? e.message : "Unknown error" })
    } finally {
      setBusyId(null)
    }
  }

  return (
    <div className="bg-card rounded-xl border border-border shadow-sm">
      <div className="flex flex-col gap-4 p-5 border-b border-border">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Subjects</h2>
          <p className="text-sm text-muted-foreground">Review subject packages and approve or reject submissions</p>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-center gap-3">
          <div className="flex-1">
            <Input value={listState.search} onChange={(e) => listState.setSearch(e.target.value)} aria-label="Search academic subjects" placeholder="Search title, subject, tutor..." />
          </div>
          <select
            value={status}
            onChange={(e) => listState.setValue("status", e.target.value)}
            aria-label="Filter academic subjects by status"
            className="h-9 rounded-lg border border-input bg-background px-3 text-sm"
          >
            <option value="">All statuses</option>
            <option value="draft">Draft</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
            <option value="suspended">Suspended</option>
          </select>
          <select value={listState.value("sort") || "createdAt"} onChange={(e) => listState.setValue("sort", e.target.value)} aria-label="Sort academic subjects" className="h-9 rounded-lg border border-input bg-background px-3 text-sm"><option value="createdAt">Newest</option><option value="updatedAt">Recently updated</option><option value="title">Title A-Z</option><option value="price">Price</option></select>
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
              <EmptyTitle>No subjects found</EmptyTitle>
              <EmptyDescription>Try adjusting your filters or search term.</EmptyDescription>
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
                  Subject
                </th>
                <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Status
                </th>
                <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Level
                </th>
                <th className="px-5 py-3 text-right text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Price
                </th>
                <th className="px-5 py-3 text-right text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Students
                </th>
                <th className="px-5 py-3 text-right text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {rows.map((s) => {
                const busy = busyId === s.id
                return (
                  <tr key={s.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-5 py-4">
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">{s.title}</p>
                        <p className="text-xs text-muted-foreground truncate">
                          {s.teacher?.name ?? "Unassigned"} &middot; {formatExaminingBody(s.examiningBody)}
                        </p>
                        {s.moderationNote ? (
                          <div className="mt-2 min-w-0 space-y-1">
                            <Badge variant="outline" className="text-[10px]">
                              Has note
                            </Badge>
                            <p className="truncate text-xs text-muted-foreground">{s.moderationNote}</p>
                          </div>
                        ) : null}
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <StatusBadge kind="subject" value={s.status} />
                    </td>
                    <td className="px-5 py-4 text-sm text-muted-foreground">
                      {formatZimLevel(s.grade)} &middot; {s.category?.name ?? "Uncategorized"}
                    </td>
                    <td className="px-5 py-4 text-right text-sm text-foreground tabular-nums">{formatUsd(s.price)}</td>
                    <td className="px-5 py-4 text-right text-sm text-foreground tabular-nums">{s._count.enrollments}</td>
                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-2">
                        <Button asChild variant="outline" size="sm">
                          <Link href={`/admin/subjects/${s.id}`}>
                            <FilePenLine className="mr-2 h-4 w-4" />
                            Review
                          </Link>
                        </Button>
                        <ConfirmDialog
                          trigger={
                            <Button variant="destructive" size="sm" loading={busy}>
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </Button>
                          }
                          title="Delete subject?"
                          description="This action is permanent. Enrollments and related data may be affected."
                          confirmText="Delete"
                          onConfirm={() => void act(s.id, "delete")}
                          disabled={busy}
                        />
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      ) : null}
      <ListPagination pagination={pagination} onPageChange={listState.setPage} onPageSizeChange={listState.setPageSize} />
    </div>
  )
}
