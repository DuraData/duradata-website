"use client"

import Link from "next/link"
import { useMemo, useState } from "react"
import { ArrowDown, ArrowRight, Atom, BookOpen, Boxes, Braces, Clock3, Code2, Database, FileCode2, FileType2, GitBranch, Network, Search, Server } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

type TutorialCard = {
  id: string
  slug: string
  title: string
  shortDescription: string
  icon: string | null
  difficulty: string
  estimatedDuration: number
  category: string | null
  tags: string[]
  lessonCount: number
}

const ICONS: Record<string, typeof Code2> = { Atom, Boxes, Braces, Code2, Database, FileCode2, FileType2, GitBranch, Network, Server }
const ACCENTS = ["from-orange-500 to-blue-600", "from-yellow-400 to-amber-600", "from-blue-500 to-yellow-500", "from-sky-500 to-indigo-700", "from-orange-600 to-slate-800", "from-blue-500 to-blue-800", "from-cyan-400 to-blue-700", "from-green-500 to-slate-800", "from-purple-500 to-indigo-800", "from-rose-500 to-violet-700"]

const primaryPath = ["HTML & CSS Fundamentals", "JavaScript Programming Fundamentals", "Git & GitHub Essentials", "TypeScript Fundamentals", "React Fundamentals", "Node.js & REST API Development"]
const parallelPaths = [["Python Programming for Beginners", "Data Structures, Algorithms & Problem Solving"], ["SQL & Relational Database Fundamentals"], ["C# & .NET Fundamentals"]]

function duration(minutes: number) {
  const hours = Math.round(minutes / 60)
  return `${hours} hour${hours === 1 ? "" : "s"}`
}

export function FreeLearningCatalogue({ tutorials }: { tutorials: TutorialCard[] }) {
  const [query, setQuery] = useState("")
  const [category, setCategory] = useState("All")
  const [difficulty, setDifficulty] = useState("All")
  const categories = useMemo(() => ["All", ...Array.from(new Set(tutorials.map((item) => item.category).filter((item): item is string => Boolean(item))))], [tutorials])
  const filtered = tutorials.filter((tutorial) => {
    const haystack = [tutorial.title, tutorial.shortDescription, tutorial.category, ...tutorial.tags].join(" ").toLowerCase()
    return haystack.includes(query.trim().toLowerCase()) && (category === "All" || tutorial.category === category) && (difficulty === "All" || tutorial.difficulty === difficulty)
  })
  const slugByTitle = new Map(tutorials.map((tutorial) => [tutorial.title, tutorial.slug]))

  return <>
    <section aria-labelledby="learning-path-heading" className="border-b border-border bg-muted/20 py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 id="learning-path-heading" className="text-2xl font-semibold">Recommended beginner learning path</h2>
        <p className="mt-2 text-muted-foreground">Follow the main web-development path or take a parallel foundation independently.</p>
        <div className="mt-6 grid gap-6 lg:grid-cols-[2fr_1fr]">
          <div className="grid gap-2 sm:grid-cols-3 lg:grid-cols-6">{primaryPath.map((title, index) => <div key={title} className="relative"><Link href={`/learn/${slugByTitle.get(title)}`} className="flex h-full min-h-24 items-center rounded-lg border border-border bg-card p-3 text-sm font-medium hover:border-primary/50 hover:text-primary">{index + 1}. {title}</Link>{index < primaryPath.length - 1 ? <ArrowRight className="absolute -right-4 top-10 z-10 hidden h-4 w-4 text-muted-foreground lg:block" /> : null}</div>)}</div>
          <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">{parallelPaths.map((path) => <div key={path.join("-")} className="rounded-lg border border-border bg-card p-3">{path.map((title, index) => <div key={title}><Link href={`/learn/${slugByTitle.get(title)}`} className="text-sm font-medium hover:text-primary">{title}</Link>{index < path.length - 1 ? <ArrowDown className="my-1 h-4 w-4 text-muted-foreground" /> : null}</div>)}</div>)}</div>
        </div>
      </div>
    </section>

    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-7"><h2 className="text-2xl font-semibold">Free coding courses</h2><p className="mt-2 text-muted-foreground">Ten published courses with lessons, exercises, quizzes, saved progress, and completion recognition.</p></div>
      <div className="mb-8 grid gap-3 md:grid-cols-[minmax(0,1fr)_220px_auto]">
        <label className="relative"><Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" /><Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search Python, HTML, SQL, React, C#, Git…" className="pl-9" aria-label="Search free courses" /></label>
        <select value={category} onChange={(event) => setCategory(event.target.value)} className="h-10 rounded-md border border-input bg-background px-3 text-sm" aria-label="Filter by category">{categories.map((value) => <option key={value}>{value}</option>)}</select>
        <div className="flex gap-2">{["All", "beginner", "intermediate"].map((value) => <Button key={value} type="button" size="sm" variant={difficulty === value ? "default" : "outline"} onClick={() => setDifficulty(value)} className="capitalize">{value}</Button>)}</div>
      </div>

      {filtered.length ? <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">{filtered.map((tutorial) => { const Icon = (tutorial.icon && ICONS[tutorial.icon]) || Code2; const index = tutorials.findIndex((item) => item.id === tutorial.id); return <Link key={tutorial.id} href={`/learn/${tutorial.slug}`} className="group overflow-hidden rounded-xl border border-border bg-card shadow-sm transition hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md"><div className={`flex min-h-36 items-end bg-gradient-to-br ${ACCENTS[index % ACCENTS.length]} p-5 text-white`}><div><Icon className="h-9 w-9" /><p className="mt-4 text-xs font-semibold uppercase tracking-[0.2em] text-white/80">Duradata Academy</p><h3 className="mt-1 text-xl font-semibold">{tutorial.title}</h3></div></div><div className="p-5"><div className="flex flex-wrap gap-2"><Badge>Free Learning</Badge><Badge variant="secondary" className="capitalize">{tutorial.difficulty}</Badge>{tutorial.category ? <Badge variant="outline">{tutorial.category}</Badge> : null}</div><p className="mt-4 min-h-12 text-sm leading-6 text-muted-foreground">{tutorial.shortDescription}</p><div className="mt-5 flex flex-wrap gap-3 text-xs text-muted-foreground"><span className="flex items-center gap-1"><BookOpen className="h-4 w-4" />{tutorial.lessonCount} lessons</span><span className="flex items-center gap-1"><Clock3 className="h-4 w-4" />{duration(tutorial.estimatedDuration)}</span></div><span className="mt-5 inline-flex items-center text-sm font-semibold text-primary">Open free course <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" /></span></div></Link> })}</div> : <div className="rounded-xl border border-dashed border-border p-10 text-center"><p className="font-medium">No courses match these filters.</p><button type="button" onClick={() => { setQuery(""); setCategory("All"); setDifficulty("All") }} className="mt-2 text-sm font-semibold text-primary hover:underline">Clear filters</button></div>}
    </section>
  </>
}
