import { prisma } from "@/lib/prisma"
import { requireInternalInstructor } from "@/lib/rbac"
import { getCourseLessonTotals } from "@/lib/course-progress"
import { listQueryErrorResponse, paginationMetadata, parseListQuery } from "@/lib/list-query"
import { mysqlContainsIds } from "@/lib/mysql-search"

export async function GET(req: Request) {
  const auth = await requireInternalInstructor()
  if (auth instanceof Response) return auth

  const url = new URL(req.url)
  const courseId = url.searchParams.get("courseId")
  let list
  try { list = parseListQuery(url.searchParams, { defaultPageSize: 10, defaultSort: "createdAt", allowedSorts: ["createdAt"] as const }) } catch (error) { return listQueryErrorResponse(error) }

  const where: Record<string, unknown> = {
    course: { instructorId: auth.user.id },
  }
  if (courseId) where.courseId = courseId
  if (list.search) {
    const [userIds, courseIds] = await Promise.all([mysqlContainsIds("User", ["name", "email"], list.search), mysqlContainsIds("Course", ["title"], list.search)])
    where.OR = [{ userId: { in: userIds } }, { courseId: { in: courseIds } }]
  }

  const [enrollments, totalItems] = await prisma.$transaction([prisma.enrollment.findMany({
    where,
    include: {
      user: { select: { id: true, name: true, email: true } },
      course: { select: { id: true, title: true, price: true, status: true } },
    },
    orderBy: { createdAt: list.sortDirection }, skip: list.skip, take: list.take,
  }), prisma.enrollment.count({ where })])

  const courseIds = Array.from(new Set(enrollments.map((e) => e.courseId)))
  const userIds = Array.from(new Set(enrollments.map((e) => e.userId)))

  const totalLessonsByCourseId = await getCourseLessonTotals(courseIds)

  const progress = await prisma.progress.findMany({
    where: {
      completed: true,
      userId: { in: userIds },
      lesson: { section: { courseId: { in: courseIds } } },
    },
    select: { userId: true, lesson: { select: { section: { select: { courseId: true } } } } },
  })

  const completedByUserCourse = new Map<string, number>()
  for (const p of progress) {
    const cid = p.lesson.section.courseId
    const key = `${p.userId}:${cid}`
    completedByUserCourse.set(key, (completedByUserCourse.get(key) ?? 0) + 1)
  }

  return Response.json({
    enrollments: enrollments.map((e) => {
      const total = totalLessonsByCourseId.get(e.courseId) ?? 0
      const completed = completedByUserCourse.get(`${e.userId}:${e.courseId}`) ?? 0
      const percent = total === 0 ? 0 : Math.min(100, Math.round((completed / total) * 100))
      return {
        id: e.id,
        createdAt: e.createdAt,
        user: e.user,
        course: e.course,
        progress: { totalLessons: total, completedLessons: completed, percent },
      }
    }), pagination: paginationMetadata(list.page, list.pageSize, totalItems),
  })
}
