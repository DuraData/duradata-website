import Link from "next/link"
import { Briefcase } from "lucide-react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { CourseCard } from "@/components/shared/course-card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { businessTrainingPrograms, type TrainingBadge } from "@/lib/business-training"
import { prisma } from "@/lib/prisma"

// Feature switches are administrative controls and must take effect immediately.
export const dynamic = "force-dynamic"

const programColors = [
  "bg-blue-100 text-blue-700",
  "bg-pink-100 text-pink-700",
  "bg-emerald-100 text-emerald-700",
  "bg-violet-100 text-violet-700",
  "bg-cyan-100 text-cyan-700",
  "bg-amber-100 text-amber-700",
] as const

function badgeVariant(badge: TrainingBadge) {
  if (badge === "Most Popular") return "default" as const
  if (badge === "Enterprise Favorite") return "secondary" as const
  if (badge === "New") return "outline" as const
  return "default" as const
}

export default async function CoursesPage() {
  const courses = await prisma.course.findMany({
    where: { status: "approved" },
    include: { instructor: { select: { name: true } } },
    orderBy: { title: "asc" },
    take: 500,
  })

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-16">
        <section className="py-10 md:py-14">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">Courses</h1>
                <p className="mt-2 text-muted-foreground">Browse all available courses</p>
              </div>
              <Button asChild variant="outline">
                <Link href="/">Back to Home</Link>
              </Button>
            </div>

            {courses.length === 0 ? (
              <div className="mt-8">
                <section aria-labelledby="corporate-training-heading">
                  <div className="mb-8">
                    <h2 id="corporate-training-heading" className="text-2xl font-semibold tracking-tight text-foreground">Corporate Training Programs</h2>
                    <p className="mt-2 text-muted-foreground">
                      Explore practical training programs available for teams and organizations.
                    </p>
                  </div>
                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {businessTrainingPrograms.map((program, index) => (
                      <Link key={program.slug} href={`/business-training/${program.slug}`} className="group block">
                        <Card className="h-full shadow-sm transition-all duration-200 group-hover:border-muted-foreground/20 group-hover:shadow-md">
                          <CardHeader className="pb-2">
                            <div className={`mb-3 flex h-12 w-12 items-center justify-center rounded-xl ${programColors[index % programColors.length]}`}>
                              <Briefcase className="h-5 w-5" />
                            </div>
                            <div className="flex items-start justify-between gap-3">
                              <CardTitle className="text-base leading-snug">{program.title}</CardTitle>
                              <Badge variant={badgeVariant(program.badge)}>{program.badge}</Badge>
                            </div>
                          </CardHeader>
                          <CardContent className="space-y-3">
                            <p className="text-sm text-muted-foreground">{program.shortDescription}</p>
                            <div className="grid gap-2 text-sm">
                              <div className="flex items-start justify-between gap-3">
                                <span className="text-muted-foreground">Typical duration</span>
                                <span className="font-medium text-foreground">{program.duration}</span>
                              </div>
                              <div className="flex items-start justify-between gap-3">
                                <span className="text-muted-foreground">Delivery</span>
                                <span className="text-right font-medium text-foreground">{program.deliveryOptions.join(", ")}</span>
                              </div>
                            </div>
                            <p className="text-sm font-medium text-foreground transition-colors group-hover:text-accent">
                              View training details
                            </p>
                          </CardContent>
                        </Card>
                      </Link>
                    ))}
                  </div>
                </section>
              </div>
            ) : (
              <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {courses.map((course) => (
                  <CourseCard
                    key={course.id}
                    id={course.id}
                    title={course.title}
                    description={course.description}
                    price={course.price}
                    instructorName={course.instructor.name}
                    thumbnail="/placeholder.jpg"
                    titleHoverClassName="group-hover:text-primary"
                  />
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
