import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { FreeLearningCatalogue } from "@/components/tutorials/free-learning-catalogue"
import { prisma } from "@/lib/prisma"

export const dynamic = "force-dynamic"

export default async function FreeLearningPage() {
  const tutorials = await prisma.tutorial.findMany({
    where: { status: "published", courseType: "FREE", managedKey: { startsWith: "duradata-free-coding:" } },
    include: { sections: { include: { _count: { select: { lessons: { where: { isPublished: true } } } } } } },
    orderBy: [{ publishedAt: "desc" }, { title: "asc" }],
  })
  const cards = tutorials.map((tutorial) => ({
    id: tutorial.id,
    slug: tutorial.slug,
    title: tutorial.title,
    shortDescription: tutorial.shortDescription,
    icon: tutorial.icon,
    difficulty: tutorial.difficulty,
    estimatedDuration: tutorial.estimatedDuration,
    category: tutorial.category,
    tags: Array.isArray(tutorial.tags) ? tutorial.tags.filter((tag): tag is string => typeof tag === "string") : [],
    lessonCount: tutorial.sections.reduce((sum, section) => sum + section._count.lessons, 0),
  }))

  return <div className="min-h-screen bg-background"><Navbar /><main className="pt-16"><section className="border-b border-border bg-gradient-to-br from-primary/10 via-background to-secondary/10"><div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24"><p className="text-sm font-semibold uppercase tracking-wider text-primary">Duradata Free Learning</p><h1 className="mt-3 max-w-3xl text-4xl font-semibold tracking-tight sm:text-5xl">Build real coding skills at no cost.</h1><p className="mt-5 max-w-2xl text-lg leading-8 text-muted-foreground">Study original lessons, run practical examples, complete independent exercises, pass knowledge checks, save progress, and earn a Duradata Academy Certificate of Completion.</p></div></section><FreeLearningCatalogue tutorials={cards} /></main><Footer /></div>
}
