import { prisma } from "@/lib/prisma"
import { getSession } from "@/lib/auth"
import { getCompletedLessonTotals, getCourseLessonTotals } from "@/lib/course-progress"
import { listQueryErrorResponse, paginationMetadata, parseListQuery } from "@/lib/list-query"

export async function GET(req: Request) {
  const session = await getSession()
  if (!session) return Response.json({ error: "Not logged in" }, { status: 401 })
  if (session.role !== "instructor") return Response.json({ error: "Forbidden" }, { status: 403 })

  const instructor = await prisma.user.findUnique({
    where: { id: session.userId },
    select: { id: true, role: true },
  })
  if (!instructor || instructor.role !== "instructor") {
    return Response.json({ error: "Invalid session" }, { status: 401 })
  }
  const url = new URL(req.url)
  let list
  try {
    list = parseListQuery(url.searchParams, { defaultPageSize: 10, defaultSort: "createdAt", allowedSorts: ["createdAt"] as const })
  } catch (error) {
    return listQueryErrorResponse(error)
  }

  const courses = await prisma.course.findMany({
    where: { instructorId: instructor.id },
    select: { id: true, title: true, price: true },
    orderBy: { title: "asc" },
  })

  const courseIds = courses.map((course) => course.id)
  const totalLessonsByCourseId = await getCourseLessonTotals(courseIds)

  const courseId = url.searchParams.get("courseId")
  const where: Record<string, unknown> = { courseId: { in: courseIds } }
  if (courseId) where.courseId = { in: courseIds.filter((id) => id === courseId) }
  if (list.search) where.OR = [{ user: { name: { contains: list.search } } }, { user: { email: { contains: list.search } } }, { course: { title: { contains: list.search } } }]
  const [enrollments, totalItems] = await prisma.$transaction([prisma.enrollment.findMany({
    where,
    include: { user: { select: { id: true, name: true, email: true } }, course: { select: { id: true, title: true } } },
    orderBy: { createdAt: list.sortDirection }, skip: list.skip, take: list.take,
  }), prisma.enrollment.count({ where })])

  const completedTotals = await getCompletedLessonTotals(courseIds, Array.from(new Set(enrollments.map((enrollment) => enrollment.userId))))
  const rows = enrollments.map((e) => {
      const totalLessons = totalLessonsByCourseId.get(e.courseId) ?? 0
      const completedLessons = completedTotals.get(`${e.userId}:${e.courseId}`) ?? 0
      const percent = totalLessons === 0 ? 0 : Math.round((completedLessons / totalLessons) * 100)
      return {
        courseId: e.courseId,
        courseTitle: e.course.title,
        userId: e.userId,
        studentName: e.user.name,
        studentEmail: e.user.email,
        completedLessons,
        totalLessons,
        percent,
      }
    })

  return Response.json({
    totalStudents: new Set(rows.map((r) => r.userId)).size,
    rows, courses, pagination: paginationMetadata(list.page, list.pageSize, totalItems),
  })
}

