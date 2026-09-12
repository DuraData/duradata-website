import Link from "next/link"
import { ArrowRight, Braces, Code2, Database, FileCode2, GitBranch, Palette } from "lucide-react"

const topics = [
  { name: "Python", href: "/learn/python-programming-for-beginners", icon: Code2 },
  { name: "JavaScript", href: "/learn/javascript-programming-fundamentals", icon: Braces },
  { name: "HTML & CSS", href: "/learn/html-css-fundamentals", icon: FileCode2 },
  { name: "React", href: "/learn/react-fundamentals", icon: Palette },
  { name: "SQL", href: "/learn/sql-relational-database-fundamentals", icon: Database },
  { name: "Git & GitHub", href: "/learn/git-github-essentials", icon: GitBranch },
]

export function FreeLearningSection() {
  return <section aria-labelledby="free-courses-heading" className="border-y border-border bg-muted/25 py-16"><div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"><div className="flex flex-wrap items-end justify-between gap-5"><div><p className="text-sm font-semibold uppercase tracking-wider text-primary">Free Learning</p><h2 id="free-courses-heading" className="mt-2 text-3xl font-semibold tracking-tight">Build practical coding skills at no cost</h2><p className="mt-3 max-w-2xl text-muted-foreground">Take original step-by-step courses with examples, exercises, scored quizzes, saved progress, and completion certificates.</p></div><Link href="/learn" className="inline-flex items-center font-semibold text-primary hover:underline">Explore all 10 free courses <ArrowRight className="ml-2 h-4 w-4" /></Link></div><div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">{topics.map((topic) => <Link key={topic.name} href={topic.href} className="rounded-xl border border-border bg-card p-4 transition hover:border-primary/40 hover:shadow-sm"><topic.icon className="h-6 w-6 text-primary" /><p className="mt-3 font-medium">{topic.name}</p><p className="mt-1 text-xs text-muted-foreground">Start free course</p></Link>)}</div></div></section>
}
