export const TABLE_PAGE_SIZES = [10, 25, 50, 100] as const
export const CATALOGUE_PAGE_SIZES = [12, 24, 48] as const

export type PaginationMetadata = {
  page: number
  pageSize: number
  totalItems: number
  totalPages: number
  hasNextPage: boolean
  hasPreviousPage: boolean
  startItem: number
  endItem: number
}

export type ListQuery<TSort extends string> = {
  page: number
  pageSize: number
  skip: number
  take: number
  search: string
  sort: TSort
  sortDirection: "asc" | "desc"
}

type ListQueryOptions<TSort extends string> = {
  defaultPageSize: number
  allowedPageSizes?: readonly number[]
  defaultSort: TSort
  allowedSorts: readonly TSort[]
  defaultSortDirection?: "asc" | "desc"
  maxSearchLength?: number
}

export class ListQueryError extends Error {}

export function parseOptionalEnum<T extends string>(searchParams: URLSearchParams, key: string, allowed: readonly T[]): T | null {
  const value = searchParams.get(key)
  if (value === null || value === "") return null
  if (!allowed.includes(value as T)) throw new ListQueryError(`${key} has an invalid value`)
  return value as T
}

export function parseOptionalBoolean(searchParams: URLSearchParams, key: string): boolean | null {
  const value = searchParams.get(key)
  if (value === null || value === "") return null
  if (value !== "true" && value !== "false") throw new ListQueryError(`${key} must be true or false`)
  return value === "true"
}

export function parseOptionalUuid(searchParams: URLSearchParams, key: string): string | null {
  const value = searchParams.get(key)
  if (value === null || value === "") return null
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value)) {
    throw new ListQueryError(`${key} must be a UUID`)
  }
  return value
}

function positiveInteger(value: string | null, fallback: number, field: string) {
  if (value === null || value === "") return fallback
  if (!/^\d+$/.test(value)) throw new ListQueryError(`${field} must be a positive integer`)
  const parsed = Number(value)
  if (!Number.isSafeInteger(parsed) || parsed < 1) throw new ListQueryError(`${field} must be a positive integer`)
  return parsed
}

export function parseListQuery<TSort extends string>(
  searchParams: URLSearchParams,
  options: ListQueryOptions<TSort>,
): ListQuery<TSort> {
  const allowedPageSizes = options.allowedPageSizes ?? TABLE_PAGE_SIZES
  const page = positiveInteger(searchParams.get("page"), 1, "page")
  const pageSize = positiveInteger(searchParams.get("pageSize"), options.defaultPageSize, "pageSize")
  if (!allowedPageSizes.includes(pageSize)) {
    throw new ListQueryError(`pageSize must be one of ${allowedPageSizes.join(", ")}`)
  }

  const rawSort = searchParams.get("sort") || options.defaultSort
  if (!options.allowedSorts.includes(rawSort as TSort)) throw new ListQueryError("Invalid sort field")
  const rawDirection = searchParams.get("sortDirection") || options.defaultSortDirection || "desc"
  if (rawDirection !== "asc" && rawDirection !== "desc") throw new ListQueryError("Invalid sort direction")

  const maxSearchLength = options.maxSearchLength ?? 100
  const search = (searchParams.get("search") ?? searchParams.get("q") ?? "").trim()
  if (search.length > maxSearchLength) throw new ListQueryError(`search must be at most ${maxSearchLength} characters`)

  return {
    page,
    pageSize,
    skip: (page - 1) * pageSize,
    take: pageSize,
    search,
    sort: rawSort as TSort,
    sortDirection: rawDirection,
  }
}

export function sanitizeListQueryParams<TSort extends string>(searchParams: URLSearchParams, options: ListQueryOptions<TSort>) {
  const sanitized = new URLSearchParams(searchParams)
  const allowedPageSizes = options.allowedPageSizes ?? TABLE_PAGE_SIZES
  const maxSearchLength = options.maxSearchLength ?? 100
  const isPositiveInteger = (value: string) => /^\d+$/.test(value) && Number.isSafeInteger(Number(value)) && Number(value) >= 1

  const page = sanitized.get("page")
  if (page !== null && !isPositiveInteger(page)) sanitized.delete("page")

  const pageSize = sanitized.get("pageSize")
  if (pageSize !== null && (!isPositiveInteger(pageSize) || !allowedPageSizes.includes(Number(pageSize)))) sanitized.delete("pageSize")

  const sort = sanitized.get("sort")
  if (sort !== null && !options.allowedSorts.includes(sort as TSort)) sanitized.delete("sort")

  const sortDirection = sanitized.get("sortDirection")
  if (sortDirection !== null && sortDirection !== "asc" && sortDirection !== "desc") sanitized.delete("sortDirection")

  const searchKey = sanitized.has("search") ? "search" : sanitized.has("q") ? "q" : null
  if (searchKey) {
    const search = sanitized.get(searchKey)?.trim() ?? ""
    if (search.length > maxSearchLength) sanitized.set(searchKey, search.slice(0, maxSearchLength))
  }

  return { params: sanitized, changed: sanitized.toString() !== searchParams.toString() }
}

export function paginationMetadata(page: number, pageSize: number, totalItems: number): PaginationMetadata {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize))
  const startItem = totalItems === 0 || page > totalPages ? 0 : (page - 1) * pageSize + 1
  const endItem = startItem === 0 ? 0 : Math.min(totalItems, startItem + pageSize - 1)
  return {
    page,
    pageSize,
    totalItems,
    totalPages,
    hasNextPage: page < totalPages,
    hasPreviousPage: page > 1 && totalItems > 0,
    startItem,
    endItem,
  }
}

export function listQueryErrorResponse(error: unknown) {
  if (error instanceof ListQueryError) return Response.json({ error: error.message }, { status: 400 })
  throw error
}
