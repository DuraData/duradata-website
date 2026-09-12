"use client"

import { useCallback, useEffect, useState } from "react"
import Link from "next/link"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { ListPagination } from "@/components/shared/list-pagination"
import { useListUrlState } from "@/hooks/use-list-url-state"
import type { PaginationMetadata } from "@/lib/list-query"

type TutorialRow = { id: string; slug: string; title: string; status: "draft" | "published"; difficulty: string; updatedAt: string; _count: { sections: number } }

export function TutorialAdminList({ basePath }: { basePath: "/admin" | "/internal-instructor" }) {
  const [tutorials, setTutorials] = useState<TutorialRow[]>([])
  const [loading, setLoading] = useState(true)
  const listState = useListUrlState(10)
  const [pagination, setPagination] = useState<PaginationMetadata>({ page: 1, pageSize: 10, totalItems: 0, totalPages: 1, hasNextPage: false, hasPreviousPage: false, startItem: 0, endItem: 0 })
  const load = useCallback(async () => { setLoading(true); const response = await fetch(`/api/content/tutorials${listState.queryString}`, { cache: "no-store" }); const data = await response.json(); setTutorials(data.tutorials ?? []); if (data.pagination) setPagination(data.pagination); setLoading(false) }, [listState.queryString])
  useEffect(() => { void load() }, [load])
  return <div className="space-y-6"><div className="flex flex-wrap items-center justify-between gap-3"><div><h1 className="text-2xl font-semibold">Free Tutorials</h1><p className="mt-1 text-sm text-muted-foreground">Create, preview, order, and publish Duradata Free Learning content.</p></div><Button asChild><Link href={`${basePath}/tutorials/new`}><Plus className="mr-2 h-4 w-4" />New tutorial</Link></Button></div><div className="grid gap-3 rounded-xl border border-border bg-card p-4 md:grid-cols-[minmax(0,1fr)_170px_170px_auto]"><Input aria-label="Search tutorials" value={listState.search} onChange={(event) => listState.setSearch(event.target.value)} placeholder="Search title, description, or category..." /><select aria-label="Filter tutorials by status" value={listState.value("status")} onChange={(event) => listState.setValue("status", event.target.value)} className="h-10 rounded-md border bg-background px-3"><option value="">All statuses</option><option value="draft">Draft</option><option value="published">Published</option><option value="archived">Archived</option></select><select aria-label="Sort tutorials" value={listState.value("sort") || "updatedAt"} onChange={(event) => listState.setValue("sort", event.target.value)} className="h-10 rounded-md border bg-background px-3"><option value="updatedAt">Recently updated</option><option value="createdAt">Newest</option><option value="title">Title A-Z</option></select><Button variant="ghost" onClick={listState.clear}>Clear</Button></div><div className="overflow-hidden rounded-xl border border-border bg-card">{loading ? <p className="p-6 text-sm text-muted-foreground">Loading tutorials…</p> : tutorials.length ? <div className="divide-y divide-border">{tutorials.map((tutorial) => <div key={tutorial.id} className="flex flex-wrap items-center justify-between gap-4 p-5"><div><div className="flex items-center gap-2"><p className="font-semibold">{tutorial.title}</p><Badge variant={tutorial.status === "published" ? "default" : "secondary"}>{tutorial.status}</Badge></div><p className="mt-1 text-sm text-muted-foreground">/{tutorial.slug} · {tutorial.difficulty} · {tutorial._count.sections} sections</p></div><div className="flex gap-2">{tutorial.status === "published" ? <Button asChild variant="outline" size="sm"><Link href={`/learn/${tutorial.slug}`} target="_blank">Preview</Link></Button> : null}<Button asChild size="sm"><Link href={`${basePath}/tutorials/${tutorial.id}`}>Edit</Link></Button></div></div>)}</div> : <div className="p-8 text-center text-sm text-muted-foreground"><p>{listState.search || listState.value("status") ? `No tutorials found${listState.search ? ` for “${listState.search}”` : ""}.` : "No tutorials exist yet."}</p>{listState.search || listState.value("status") ? <Button variant="ghost" className="mt-2" onClick={listState.clear}>Clear filters</Button> : null}</div>}<ListPagination pagination={pagination} onPageChange={listState.setPage} onPageSizeChange={listState.setPageSize} /></div></div>
}
