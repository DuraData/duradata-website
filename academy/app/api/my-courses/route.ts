import { prisma } from "@/lib/prisma"
import { getSession } from "@/lib/auth"
import { getStudentCourseSummaries } from "@/lib/course-progress"

export async function GET() {
  const session = await getSession()
  if (!session) {
    return Response.json({ error: "Not logged in" }, { status: 401 })
  }
  if (session.role !== "student") {
    return Response.json({ error: "Only students can view enrolled courses" }, { status: 403 })
  }
  const userId = session.userId

  const paidCourses = await getStudentCourseSummaries(userId)
  const freeEnrollments = await prisma.tutorialEnrollment.findMany({
    where: { userId },
    include: { tutorial: { include: { sections: { include: { lessons: { where: { isPublished: true }, orderBy: { order: "asc" }, select: { id: true, slug: true } } }, orderBy: { order: "asc" } } } } },
    orderBy: { enrolledAt: "desc" },
  })
  const freeCourses = await Promise.all(freeEnrollments.map(async ({ tutorial }) => {
    const lessons = tutorial.sections.flatMap((section) => section.lessons)
    const completedLessons = await prisma.tutorialProgress.count({ where: { userId, tutorialId: tutorial.id, completedAt: { not: null } } })
    return { id: tutorial.id, title: tutorial.title, description: tutorial.shortDescription, price: 0, instructorId: "duradata-academy", thumbnail: tutorial.imageUrl ?? "/placeholder.jpg", instructorName: tutorial.ownerName, progressPercent: lessons.length ? Math.round(completedLessons / lessons.length * 100) : 0, totalLessons: lessons.length, completedLessons, firstLessonId: lessons[0]?.slug ?? null, kind: "free-learning", href: lessons[0] ? `/learn/${tutorial.slug}/${lessons[0].slug}` : `/learn/${tutorial.slug}` }
  }))
  const courses = [...freeCourses, ...paidCourses.map((course) => ({ ...course, kind: "course", href: `/learn/${course.id}` }))]

  return Response.json({ userId, courses })
}
