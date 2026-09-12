"use client"

import Link from "next/link"
import { useState } from "react"
import { Award, BookOpen, CheckCircle2, Clock3, ExternalLink, Target } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

type Project = { title?: string; scenario?: string; requirements?: string[] }
type Reference = { label: string; url: string }

export function TutorialOverview({ tutorial, authenticated, initiallyEnrolled }: {
  tutorial: { slug: string; title: string; shortDescription: string; description: string; difficulty: string; estimatedDuration: number; category: string | null; language: string; ownerName: string; objectives: string[]; targetAudience: string | null; prerequisites: string | null; sections: Array<{ id: string; title: string; description: string | null; lessons: Array<{ slug: string; title: string }> }>; project: Project | null; references: Reference[] }
  authenticated: boolean
  initiallyEnrolled: boolean
}) {
  const [enrolled, setEnrolled] = useState(initiallyEnrolled)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const firstLesson = tutorial.sections.flatMap((section) => section.lessons)[0]

  async function enroll() {
    setBusy(true)
    setError(null)
    const response = await fetch(`/api/tutorials/${tutorial.slug}/enroll`, { method: "POST" })
    const body = await response.json().catch(() => null)
    setBusy(false)
    if (response.ok) setEnrolled(true)
    else setError(body?.error ?? "Could not enrol")
  }

  return <div className="min-h-screen bg-background"><section className="border-b border-border bg-gradient-to-br from-primary/10 via-background to-secondary/10 pt-28 pb-14"><div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8"><Link href="/learn" className="text-sm font-semibold text-primary hover:underline">← Free Learning</Link><div className="mt-7 flex flex-wrap gap-2"><Badge>Free Learning</Badge><Badge variant="secondary" className="capitalize">{tutorial.difficulty}</Badge>{tutorial.category ? <Badge variant="outline">{tutorial.category}</Badge> : null}</div><h1 className="mt-5 max-w-4xl text-4xl font-semibold tracking-tight sm:text-5xl">{tutorial.title}</h1><p className="mt-5 max-w-3xl text-lg leading-8 text-muted-foreground">{tutorial.shortDescription}</p><div className="mt-6 flex flex-wrap gap-5 text-sm text-muted-foreground"><span className="flex items-center gap-2"><Clock3 className="h-4 w-4" />{Math.round(tutorial.estimatedDuration / 60)} hours</span><span className="flex items-center gap-2"><BookOpen className="h-4 w-4" />{tutorial.sections.length} modules</span><span className="flex items-center gap-2"><Award className="h-4 w-4" />Certificate of Completion</span></div><div className="mt-8 flex flex-wrap items-center gap-3">{!authenticated ? <Button asChild><Link href={`/login?next=/learn/${tutorial.slug}`}>Log in to enrol</Link></Button> : !enrolled ? <Button onClick={() => void enroll()} loading={busy}>Enrol free — no payment</Button> : firstLesson ? <Button asChild><Link href={`/learn/${tutorial.slug}/${firstLesson.slug}`}>Start course</Link></Button> : null}<span className="text-sm text-muted-foreground">Owned by {tutorial.ownerName} · {tutorial.language}</span></div>{error ? <p className="mt-3 text-sm text-destructive">{error}</p> : null}</div></section>
    <main className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[minmax(0,1fr)_330px] lg:px-8"><div className="space-y-10"><section><h2 className="text-2xl font-semibold">About this course</h2><p className="mt-4 leading-8 text-muted-foreground">{tutorial.description}</p></section><section><h2 className="text-2xl font-semibold">What you will learn</h2><div className="mt-5 grid gap-3 sm:grid-cols-2">{tutorial.objectives.map((objective) => <p key={objective} className="flex gap-3 rounded-lg border border-border p-4 text-sm"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />{objective}</p>)}</div></section><section><h2 className="text-2xl font-semibold">Curriculum</h2><div className="mt-5 space-y-3">{tutorial.sections.map((section, index) => <Card key={section.id}><CardHeader className="pb-2"><p className="text-xs font-semibold uppercase tracking-wider text-primary">Module {index + 1}</p><CardTitle className="text-lg">{section.title}</CardTitle></CardHeader><CardContent><p className="text-sm text-muted-foreground">{section.description}</p>{section.lessons[0] ? <Link href={`/learn/${tutorial.slug}/${section.lessons[0].slug}`} className="mt-3 inline-flex text-sm font-semibold text-primary hover:underline">Open lesson</Link> : null}</CardContent></Card>)}</div></section></div>
      <aside className="space-y-5"><Card><CardHeader><CardTitle className="flex items-center text-lg"><Target className="mr-2 h-5 w-5 text-primary" />Who this is for</CardTitle></CardHeader><CardContent className="space-y-4 text-sm text-muted-foreground"><p>{tutorial.targetAudience}</p><div><p className="font-medium text-foreground">Prerequisites</p><p className="mt-1">{tutorial.prerequisites}</p></div></CardContent></Card>{tutorial.project ? <Card><CardHeader><CardTitle className="text-lg">Final project</CardTitle></CardHeader><CardContent className="space-y-3 text-sm text-muted-foreground"><p className="font-medium text-foreground">{tutorial.project.title}</p><p>{tutorial.project.scenario}</p><ul className="ml-5 list-disc space-y-1">{tutorial.project.requirements?.map((item) => <li key={item}>{item}</li>)}</ul></CardContent></Card> : null}<Card><CardHeader><CardTitle className="text-lg">Research references</CardTitle></CardHeader><CardContent className="space-y-3">{tutorial.references.map((reference) => <a key={reference.url} href={reference.url} target="_blank" rel="noopener noreferrer" className="flex items-start justify-between gap-2 text-sm font-medium text-primary hover:underline">{reference.label}<ExternalLink className="mt-0.5 h-4 w-4 shrink-0" /></a>)}</CardContent></Card></aside></main></div>
}
