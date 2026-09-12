import { z } from "zod"
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
    list = parseListQuery(url.searchParams, { defaultPageSize: 10, defaultSort: "createdAt", allowedSorts: ["createdAt", "resolvedAt"] as const })
  } catch (error) {
    return listQueryErrorResponse(error)
  }
  const type = url.searchParams.get("type")
  const status = url.searchParams.get("status")
  const q = list.search

  const where: Record<string, unknown> = {}
  if (type && ["course_complaint", "user_report"].includes(type)) where.type = type
  if (status && ["open", "reviewing", "resolved", "dismissed"].includes(status)) where.status = status
  if (q) {
    const [reportIds, userIds, courseIds] = await Promise.all([mysqlContainsIds("Report", ["message"], q), mysqlContainsIds("User", ["email", "name"], q), mysqlContainsIds("Course", ["title"], q)])
    where.OR = [{ id: { in: reportIds } }, { reporterId: { in: userIds } }, { accusedUserId: { in: userIds } }, { courseId: { in: courseIds } }]
  }

  const [reports, totalItems] = await prisma.$transaction([
    prisma.report.findMany({ where, include: {
      reporter: { select: { id: true, name: true, email: true } },
      course: { select: { id: true, title: true, status: true } },
      accusedUser: { select: { id: true, name: true, email: true, role: true, status: true } },
      resolver: { select: { id: true, name: true, email: true } },
    }, orderBy: { [list.sort]: list.sortDirection }, skip: list.skip, take: list.take }),
    prisma.report.count({ where }),
  ])

  return Response.json({ reports, pagination: paginationMetadata(list.page, list.pageSize, totalItems) })
}

const PatchSchema = z.object({
  reportId: z.string().uuid(),
  action: z.enum([
    "markReviewing",
    "resolve",
    "dismiss",
    "suspendAccusedUser",
    "banAccusedUser",
    "suspendCourse",
    "deleteCourse",
  ]),
})

export async function PATCH(req: Request) {
  const auth = await requireAdmin()
  if (auth instanceof Response) return auth

  const json = await req.json().catch(() => null)
  const parsed = PatchSchema.safeParse(json)
  if (!parsed.success) return Response.json({ error: "Invalid request body" }, { status: 400 })

  const { reportId, action } = parsed.data

  const report = await prisma.report.findUnique({
    where: { id: reportId },
    select: { id: true, status: true, accusedUserId: true, courseId: true },
  })
  if (!report) return Response.json({ error: "Report not found" }, { status: 404 })

  if (action === "markReviewing") {
    const updated = await prisma.report.update({
      where: { id: reportId },
      data: { status: "reviewing" },
    })
    return Response.json({ success: true, report: updated })
  }

  if (action === "dismiss") {
    const updated = await prisma.report.update({
      where: { id: reportId },
      data: { status: "dismissed", resolvedAt: new Date(), resolverId: auth.user.id },
    })
    return Response.json({ success: true, report: updated })
  }

  if (action === "resolve") {
    const updated = await prisma.report.update({
      where: { id: reportId },
      data: { status: "resolved", resolvedAt: new Date(), resolverId: auth.user.id },
    })
    return Response.json({ success: true, report: updated })
  }

  if (action === "suspendAccusedUser" || action === "banAccusedUser") {
    if (!report.accusedUserId) return Response.json({ error: "No accused user on this report" }, { status: 400 })
    const newStatus = action === "banAccusedUser" ? "banned" : "suspended"
    await prisma.$transaction(async (tx) => {
      await tx.user.update({ where: { id: report.accusedUserId! }, data: { status: newStatus } })
      await tx.report.update({
        where: { id: reportId },
        data: { status: "resolved", resolvedAt: new Date(), resolverId: auth.user.id },
      })
    })
    return Response.json({ success: true })
  }

  if (action === "suspendCourse") {
    if (!report.courseId) return Response.json({ error: "No course linked to this report" }, { status: 400 })
    await prisma.$transaction(async (tx) => {
      await tx.course.update({ where: { id: report.courseId! }, data: { status: "suspended" } })
      await tx.report.update({
        where: { id: reportId },
        data: { status: "resolved", resolvedAt: new Date(), resolverId: auth.user.id },
      })
    })
    return Response.json({ success: true })
  }

  if (action === "deleteCourse") {
    if (!report.courseId) return Response.json({ error: "No course linked to this report" }, { status: 400 })
    await prisma.$transaction(async (tx) => {
      await tx.report.update({
        where: { id: reportId },
        data: { status: "resolved", resolvedAt: new Date(), resolverId: auth.user.id },
      })
      await tx.course.delete({ where: { id: report.courseId! } })
    })
    return Response.json({ success: true })
  }

  return Response.json({ error: "Unsupported action" }, { status: 400 })
}
