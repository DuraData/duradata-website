import assert from "node:assert/strict"
import test from "node:test"
import { ListQueryError, paginationMetadata, parseListQuery, parseOptionalBoolean, parseOptionalEnum, parseOptionalUuid } from "../../lib/list-query"

const options = { defaultPageSize: 10, defaultSort: "createdAt" as const, allowedSorts: ["createdAt", "title"] as const }

test("list query validates page, size, search, and sort", () => {
  const query = parseListQuery(new URLSearchParams("page=3&pageSize=25&search=React&sort=title&sortDirection=asc"), options)
  assert.deepEqual(query, { page: 3, pageSize: 25, skip: 50, take: 25, search: "React", sort: "title", sortDirection: "asc" })
  assert.throws(() => parseListQuery(new URLSearchParams("page=0"), options), ListQueryError)
  assert.throws(() => parseListQuery(new URLSearchParams("pageSize=100000"), options), ListQueryError)
  assert.throws(() => parseListQuery(new URLSearchParams("sort=passwordHash"), options), ListQueryError)
  assert.throws(() => parseListQuery(new URLSearchParams("sortDirection=sideways"), options), ListQueryError)
  assert.throws(() => parseListQuery(new URLSearchParams(`search=${"x".repeat(101)}`), options), ListQueryError)
  assert.equal(parseListQuery(new URLSearchParams("pageSize=100"), options).take, 100)
})

test("list filters reject values outside their explicit whitelist", () => {
  assert.equal(parseOptionalEnum(new URLSearchParams("status=approved"), "status", ["draft", "approved"]), "approved")
  assert.throws(() => parseOptionalEnum(new URLSearchParams("status=deleted"), "status", ["draft", "approved"]), ListQueryError)
  assert.equal(parseOptionalBoolean(new URLSearchParams("featured=false"), "featured"), false)
  assert.throws(() => parseOptionalBoolean(new URLSearchParams("featured=yes"), "featured"), ListQueryError)
  assert.equal(parseOptionalUuid(new URLSearchParams("courseId=91664ff1-0dc5-4fab-b164-7da6db30a892"), "courseId"), "91664ff1-0dc5-4fab-b164-7da6db30a892")
  assert.throws(() => parseOptionalUuid(new URLSearchParams("courseId=all"), "courseId"), ListQueryError)
})

test("pagination metadata handles first, middle, last, empty, and out-of-range pages", () => {
  assert.deepEqual(paginationMetadata(1, 10, 0), { page: 1, pageSize: 10, totalItems: 0, totalPages: 1, hasNextPage: false, hasPreviousPage: false, startItem: 0, endItem: 0 })
  assert.equal(paginationMetadata(1, 10, 247).endItem, 10)
  assert.deepEqual(paginationMetadata(13, 10, 247), { page: 13, pageSize: 10, totalItems: 247, totalPages: 25, hasNextPage: true, hasPreviousPage: true, startItem: 121, endItem: 130 })
  assert.equal(paginationMetadata(25, 10, 247).endItem, 247)
  assert.equal(paginationMetadata(26, 10, 247).startItem, 0)
})
