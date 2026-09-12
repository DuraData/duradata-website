import Link from "next/link"
import { Briefcase } from "lucide-react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { CourseCard } from "@/components/shared/course-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { businessTrainingPrograms, type TrainingBadge } from "@/lib/business-training"
import { prisma } from "@/lib/prisma"
import { CATALOGUE_PAGE_SIZES, paginationMetadata, parseListQuery } from "@/lib/list-query"
import { UrlListPagination } from "@/components/shared/list-pagination"
import { notFound } from "next/navigation"
import { parseOptionalUuid } from "@/lib/list-query"

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

export default async function CoursesPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const raw = await searchParams
  const params = new URLSearchParams()
  for (const [key, value] of Object.entries(raw)) if (typeof value === "string") params.set(key, value)
  let list, categoryId
  try {
    list = parseListQuery(params, { defaultPageSize: 12, allowedPageSizes: CATALOGUE_PAGE_SIZES, defaultSort: "title", allowedSorts: ["title", "createdAt", "updatedAt", "popular"] as const, defaultSortDirection: "asc" })
    categoryId = parseOptionalUuid(params, "categoryId")
  } catch {
    notFound()
  }
  const where: Record<string, unknown> = { status: "approved" }
  if (categoryId) where.categoryId = categoryId
  if (list.search) where.OR = [{ title: { contains: list.search } }, { description: { contains: list.search } }, { instructor: { name: { contains: list.search } } }, { category: { name: { contains: list.search } } }]
  const orderBy = list.sort === "popular" ? { enrollments: { _count: list.sortDirection } } : { [list.sort]: list.sortDirection }
  const [courses, totalItems, allApproved, categories] = await prisma.$transaction([
    prisma.course.findMany({ where, include: { instructor: { select: { name: true } } }, orderBy, skip: list.skip, take: list.take }),
    prisma.course.count({ where }), prisma.course.count({ where: { status: "approved" } }),
    prisma.category.findMany({ where: { courses: { some: { status: "approved" } } }, select: { id: true, name: true }, orderBy: { name: "asc" }, take: 100 }),
  ])
  const staticMatches = businessTrainingPrograms.filter((program) => !list.search || [program.title, program.shortDescription, ...program.deliveryOptions].join(" ").toLowerCase().includes(list.search.toLowerCase()))
  const staticPage = staticMatches.slice(list.skip, list.skip + list.take)
  const pagination = paginationMetadata(list.page, list.pageSize, allApproved === 0 ? staticMatches.length : totalItems)

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
            <form method="get" className="mt-8 grid gap-3 rounded-xl border border-border bg-card p-4 md:grid-cols-[minmax(0,1fr)_220px_200px_auto_auto]">
              <label><span className="sr-only">Search courses</span><Input name="search" defaultValue={list.search} placeholder="Search title, category, or instructor..." /></label>
              {allApproved > 0 ? <select name="categoryId" defaultValue={categoryId ?? ""} aria-label="Filter courses by category" className="h-10 rounded-md border border-input bg-background px-3 text-sm"><option value="">All categories</option>{categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}</select> : <input type="hidden" name="categoryId" value="" />}
              <select name="sort" defaultValue={list.sort} aria-label="Sort courses" className="h-10 rounded-md border border-input bg-background px-3 text-sm"><option value="title">Title A-Z</option>{allApproved > 0 ? <><option value="createdAt">Newest</option><option value="updatedAt">Recently updated</option><option value="popular">Most enrolled</option></> : null}</select>
              <input type="hidden" name="pageSize" value={list.pageSize} /><Button type="submit">Search</Button><Button asChild type="button" variant="ghost"><Link href="/courses">Clear</Link></Button>
            </form>

            {allApproved === 0 ? (
              <div className="mt-8">
                <section aria-labelledby="corporate-training-heading">
                  <div className="mb-8">
                    <h2 id="corporate-training-heading" className="text-2xl font-semibold tracking-tight text-foreground">Corporate Training Programs</h2>
                    <p className="mt-2 text-muted-foreground">
                      Explore practical training programs available for teams and organizations.
                    </p>
                  </div>
                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {staticPage.map((program, index) => (
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
            ) : courses.length ? (
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
            ) : <div className="mt-8 rounded-xl border border-dashed p-10 text-center"><p className="font-medium">No courses found{list.search ? ` for “${list.search}”` : ""}.</p><Button asChild variant="ghost" className="mt-2"><Link href="/courses">Clear filters</Link></Button></div>}
            <div className="mt-8 overflow-hidden rounded-xl border border-border"><UrlListPagination pagination={pagination} pageSizes={[12, 24, 48]} /></div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
