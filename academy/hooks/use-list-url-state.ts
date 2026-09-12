"use client"

import { useCallback, useEffect, useState } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"

export function useListUrlState(defaultPageSize = 10) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const urlSearch = searchParams.get("search") ?? searchParams.get("q") ?? ""
  const [search, setSearch] = useState(urlSearch)

  useEffect(() => setSearch(urlSearch), [urlSearch])

  const update = useCallback((updates: Record<string, string | number | null | undefined>, resetPage = true) => {
    const params = new URLSearchParams(searchParams.toString())
    for (const [key, value] of Object.entries(updates)) {
      params.delete(key === "search" ? "q" : key)
      if (value === null || value === undefined || value === "") params.delete(key)
      else params.set(key, String(value))
    }
    if (resetPage && !("page" in updates)) params.delete("page")
    const query = params.toString()
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false })
  }, [pathname, router, searchParams])

  useEffect(() => {
    if (search === urlSearch) return
    const timer = window.setTimeout(() => update({ search: search.trim() || null }), 350)
    return () => window.clearTimeout(timer)
  }, [search, update, urlSearch])

  const page = Math.max(1, Number(searchParams.get("page")) || 1)
  const pageSize = Number(searchParams.get("pageSize")) || defaultPageSize
  return {
    search,
    setSearch,
    page,
    pageSize,
    queryString: searchParams.toString() ? `?${searchParams.toString()}` : "",
    value: (key: string) => searchParams.get(key) ?? "",
    setValue: (key: string, value: string) => update({ [key]: value || null }),
    setPage: (nextPage: number) => update({ page: nextPage }, false),
    setPageSize: (nextPageSize: number) => update({ pageSize: nextPageSize, page: 1 }, false),
    clear: () => { setSearch(""); router.replace(pathname, { scroll: false }) },
  }
}
