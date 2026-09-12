import { prisma } from "@/lib/prisma"
import { requireAdmin } from "@/lib/rbac"
import { listQueryErrorResponse, paginationMetadata, parseListQuery } from "@/lib/list-query"
import { mysqlContainsIds } from "@/lib/mysql-search"

export async function GET(req: Request) {
  const auth = await requireAdmin()
  if (auth instanceof Response) return auth

  const url = new URL(req.url)
  let list
  try {
    list = parseListQuery(url.searchParams, { defaultPageSize: 10, defaultSort: "createdAt", allowedSorts: ["createdAt", "updatedAt", "name", "email"] as const })
  } catch (error) {
    return listQueryErrorResponse(error)
  }
  const status = url.searchParams.get("status")
  const q = list.search

  const where: Record<string, unknown> = { role: "instructor" }
  if (status && ["active", "suspended", "banned"].includes(status)) where.status = status
  if (q) where.id = { in: await mysqlContainsIds("User", ["email", "name"], q) }

  const [instructors, totalItems] = await prisma.$transaction([
    prisma.user.findMany({ where, select: {
      id: true,
      name: true,
      email: true,
      role: true,
      status: true,
      createdAt: true,
      _count: { select: { courses: true } },
    }, orderBy: { [list.sort]: list.sortDirection }, skip: list.skip, take: list.take }),
    prisma.user.count({ where }),
  ])

  const courseIds = await prisma.course.findMany({
    where: { instructorId: { in: instructors.map((i) => i.id) } },
    select: { id: true, instructorId: true },
  })

  const courseIdsByInstructor = new Map<string, string[]>()
  for (const c of courseIds) {
    const list = courseIdsByInstructor.get(c.instructorId) ?? []
    list.push(c.id)
    courseIdsByInstructor.set(c.instructorId, list)
  }

  const enrollmentCounts = await prisma.enrollment.groupBy({
    by: ["courseId"],
    where: { courseId: { in: courseIds.map((c) => c.id) } },
    _count: { _all: true },
  })

  const enrollmentCountByCourseId = new Map(enrollmentCounts.map((r) => [r.courseId, r._count._all]))

  const instructorPayoutAgg = await prisma.transaction.groupBy({
    by: ["userId"],
    where: { type: "payout", status: "succeeded", currency: "USD", userId: { in: instructors.map((i) => i.id) } },
    _sum: { amount: true },
  })

  const payoutByInstructorId = new Map(instructorPayoutAgg.map((r) => [r.userId ?? "", r._sum.amount ?? 0]))

  return Response.json({
    pagination: paginationMetadata(list.page, list.pageSize, totalItems),
    instructors: instructors.map((i) => {
      const ids = courseIdsByInstructor.get(i.id) ?? []
      const students = ids.reduce((sum, courseId) => sum + (enrollmentCountByCourseId.get(courseId) ?? 0), 0)
      return {
        id: i.id,
        name: i.name,
        email: i.email,
        role: i.role,
        status: i.status,
        createdAt: i.createdAt,
        courses: i._count.courses,
        students,
        payoutsUsd: payoutByInstructorId.get(i.id) ?? 0,
      }
    }),
  })
}
