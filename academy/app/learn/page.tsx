import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { FreeLearningCatalogue } from "@/components/tutorials/free-learning-catalogue"
import { FREE_CODING_LIBRARY_SLUGS } from "@/content/free-coding-library"
import { CATALOGUE_PAGE_SIZES, paginationMetadata, parseListQuery } from "@/lib/list-query"
import { prisma } from "@/lib/prisma"

export const dynamic = "force-dynamic"

export default async function FreeLearningPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const raw = await searchParams
  const params = new URLSearchParams()
  for (const [key, value] of Object.entries(raw)) if (typeof value === "string") params.set(key, value)
  let list
  try {
    list = parseListQuery(params, { defaultPageSize: 12, allowedPageSizes: CATALOGUE_PAGE_SIZES, defaultSort: "title", allowedSorts: ["title", "publishedAt", "updatedAt"] as const, defaultSortDirection: "asc" })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Invalid catalogue query"
    return <div className="min-h-screen bg-background"><Navbar /><main className="mx-auto max-w-7xl px-4 pb-16 pt-28"><h1>Invalid catalogue query</h1><p className="mt-3 text-muted-foreground">{message}</p></main><Footer /></div>
  }
  const difficulty = params.get("difficulty")
  const category = params.get("category")
  const where: Record<string, unknown> = { status: "published", courseType: "FREE", slug: { in: FREE_CODING_LIBRARY_SLUGS } }
  if (difficulty && ["beginner", "intermediate", "advanced"].includes(difficulty)) where.difficulty = difficulty
  if (category) where.category = category
  if (list.search) where.OR = [
    { title: { contains: list.search } }, { shortDescription: { contains: list.search } },
    { description: { contains: list.search } }, { category: { contains: list.search } },
    ...(["beginner", "intermediate", "advanced"].includes(list.search.toLowerCase()) ? [{ difficulty: list.search.toLowerCase() }] : []),
  ]
  const [tutorials, totalItems, categories] = await prisma.$transaction([
    prisma.tutorial.findMany({ where, include: { sections: { include: { _count: { select: { lessons: { where: { isPublished: true } } } } } } }, orderBy: [{ [list.sort]: list.sortDirection }, { title: "asc" }], skip: list.skip, take: list.take }),
    prisma.tutorial.count({ where }),
    prisma.tutorial.groupBy({ by: ["category"], where: { status: "published", courseType: "FREE", slug: { in: FREE_CODING_LIBRARY_SLUGS }, category: { not: null } }, orderBy: { category: "asc" } }),
  ])
  const cards = tutorials.map((tutorial) => ({ id: tutorial.id, slug: tutorial.slug, title: tutorial.title, shortDescription: tutorial.shortDescription, icon: tutorial.icon, difficulty: tutorial.difficulty, estimatedDuration: tutorial.estimatedDuration, category: tutorial.category, tags: Array.isArray(tutorial.tags) ? tutorial.tags.filter((tag): tag is string => typeof tag === "string") : [], lessonCount: tutorial.sections.reduce((sum, section) => sum + section._count.lessons, 0) }))
  return <div className="min-h-screen bg-background"><Navbar /><main className="pt-16"><section className="border-b border-border bg-gradient-to-br from-primary/10 via-background to-secondary/10"><div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24"><p className="text-sm font-semibold uppercase tracking-wider text-primary">Duradata Free Learning</p><h1 className="mt-3 max-w-3xl text-4xl font-semibold tracking-tight sm:text-5xl">Build real coding skills at no cost.</h1><p className="mt-5 max-w-2xl text-lg leading-8 text-muted-foreground">Study original lessons, run practical examples, complete independent exercises, pass knowledge checks, save progress, and earn a Duradata Academy Certificate of Completion.</p></div></section><FreeLearningCatalogue tutorials={cards} pagination={paginationMetadata(list.page, list.pageSize, totalItems)} categories={categories.map((row) => row.category).filter((value): value is string => Boolean(value))} /></main><Footer /></div>
}
