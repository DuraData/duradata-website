import { z } from "zod"
import { prisma } from "@/lib/prisma"
import { requireAdmin } from "@/lib/rbac"
import { listQueryErrorResponse, paginationMetadata, parseListQuery, parseOptionalBoolean, parseOptionalEnum, parseOptionalUuid } from "@/lib/list-query"
import { mysqlContainsIds } from "@/lib/mysql-search"

export async function GET(req: Request) {
  const auth = await requireAdmin()
  if (auth instanceof Response) return auth

  const url = new URL(req.url)
  let list, status, featured, categoryId, instructorId
  try {
    list = parseListQuery(url.searchParams, { defaultPageSize: 10, defaultSort: "createdAt", allowedSorts: ["createdAt", "updatedAt", "title", "popular"] as const })
    status = parseOptionalEnum(url.searchParams, "status", ["draft", "pending", "approved", "rejected", "suspended"] as const)
    featured = parseOptionalBoolean(url.searchParams, "featured")
    categoryId = parseOptionalUuid(url.searchParams, "categoryId")
    instructorId = parseOptionalUuid(url.searchParams, "instructorId")
  } catch (error) {
    return listQueryErrorResponse(error)
  }
  const q = list.search

  const where: Record<string, unknown> = {}
  if (status) where.status = status
  if (featured !== null) where.featured = featured
  if (categoryId) where.categoryId = categoryId
  if (instructorId) where.instructorId = instructorId
  if (q) {
    const [courseIds, userIds, categoryIds] = await Promise.all([
      mysqlContainsIds("Course", ["title", "description", "moderationNote"], q),
      mysqlContainsIds("User", ["name", "email"], q),
      mysqlContainsIds("Category", ["name"], q),
    ])
    where.OR = [
      { id: { in: courseIds } },
      { instructorId: { in: userIds } },
      { categoryId: { in: categoryIds } },
    ]
  }

  const direction = list.sortDirection
  const orderBy = list.sort === "title" ? { title: direction } : list.sort === "updatedAt" ? { updatedAt: direction } : list.sort === "popular" ? { enrollments: { _count: direction } } : { createdAt: direction }
  const [courses, totalItems] = await prisma.$transaction([
    prisma.course.findMany({
      where,
      include: {
        instructor: { select: { id: true, name: true, email: true } },
        category: { select: { id: true, name: true } },
        _count: { select: { enrollments: true, sections: true } },
      },
      orderBy,
      skip: list.skip,
      take: list.take,
    }),
    prisma.course.count({ where }),
  ])

  return Response.json({ courses, pagination: paginationMetadata(list.page, list.pageSize, totalItems) })
}

const PatchSchema = z.object({
  courseId: z.string().uuid(),
  action: z.enum(["approve", "reject", "suspend", "delete", "feature", "unfeature", "setCategory"]),
  categoryId: z.string().uuid().nullable().optional(),
})

export async function PATCH(req: Request) {
  const auth = await requireAdmin()
  if (auth instanceof Response) return auth

  const json = await req.json().catch(() => null)
  const parsed = PatchSchema.safeParse(json)
  if (!parsed.success) return Response.json({ error: "Invalid request body" }, { status: 400 })

  const { courseId, action, categoryId } = parsed.data

  if (action === "delete") {
    await prisma.course.delete({ where: { id: courseId } })
    return Response.json({ success: true })
  }

  if (action === "feature" || action === "unfeature") {
    const updated = await prisma.course.update({
      where: { id: courseId },
      data: { featured: action === "feature" },
      select: { id: true, featured: true },
    })
    return Response.json({ success: true, course: updated })
  }

  if (action === "setCategory") {
    const updated = await prisma.course.update({
      where: { id: courseId },
      data: { categoryId: categoryId ?? null },
      select: { id: true, categoryId: true },
    })
    return Response.json({ success: true, course: updated })
  }

  const statusMap = {
    approve: "approved",
    reject: "rejected",
    suspend: "suspended",
  } as const

  const updated = await prisma.course.update({
    where: { id: courseId },
    data: { status: statusMap[action], updatedAt: new Date() },
    select: { id: true, status: true },
  })

  return Response.json({ success: true, course: updated })
}
