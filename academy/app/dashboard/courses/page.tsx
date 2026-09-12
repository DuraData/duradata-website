import Link from "next/link"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { requireRoleForPage } from "@/lib/rbac"
import { getStudentCourseSummaries } from "@/lib/course-progress"

export const dynamic = "force-dynamic"

export default async function DashboardCoursesPage() {
  const auth = await requireRoleForPage("student")
  if (!auth) redirect("/")

  const paidCourses = (await getStudentCourseSummaries(auth.user.id)).map((course) => ({ ...course, percent: course.progressPercent, href: `/learn/${course.id}` }))
  const freeEnrollments = await prisma.tutorialEnrollment.findMany({ where: { userId: auth.user.id }, include: { tutorial: { include: { sections: { include: { lessons: { where: { isPublished: true }, orderBy: { order: "asc" }, select: { slug: true } } }, orderBy: { order: "asc" } } } } }, orderBy: { enrolledAt: "desc" } })
  const freeCourses = await Promise.all(freeEnrollments.map(async ({ tutorial }) => { const lessons = tutorial.sections.flatMap((section) => section.lessons); const completedLessons = await prisma.tutorialProgress.count({ where: { userId: auth.user.id, tutorialId: tutorial.id, completedAt: { not: null } } }); return { id: tutorial.id, title: tutorial.title, instructorName: tutorial.ownerName, percent: lessons.length ? Math.round(completedLessons / lessons.length * 100) : 0, completedLessons, totalLessons: lessons.length, href: lessons[0] ? `/learn/${tutorial.slug}/${lessons[0].slug}` : `/learn/${tutorial.slug}` } }))
  const courses = [...freeCourses, ...paidCourses]

  return (
    <div className="min-h-screen bg-background">
      <DashboardSidebar />
      <div className="lg:pl-64">
        <DashboardHeader />
        <main className="p-4 lg:p-6">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-semibold text-foreground">My Courses</h1>
                <p className="text-sm text-muted-foreground">All courses you are enrolled in</p>
              </div>
              <Button asChild variant="outline">
                <Link href="/learn">Browse Free Learning</Link>
              </Button>
            </div>

            {courses.length === 0 ? (
              <div className="rounded-xl border border-border bg-card p-6">
                <p className="text-sm text-muted-foreground">You have not enrolled in any courses yet.</p>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">
                {courses.map((course) => (
                  <div key={course.id} className="rounded-xl border border-border bg-card p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <p className="font-semibold text-foreground truncate">{course.title}</p>
                        <p className="mt-1 text-sm text-muted-foreground">by {course.instructorName}</p>
                      </div>
                      <Button asChild size="sm">
                        <Link href={course.href}>Continue</Link>
                      </Button>
                    </div>

                    <div className="mt-4 space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="font-medium text-foreground">{course.percent}%</span>
                      </div>
                      <Progress value={course.percent} className="h-2" />
                      <p className="text-xs text-muted-foreground">
                        {course.completedLessons}/{course.totalLessons} lessons completed
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
