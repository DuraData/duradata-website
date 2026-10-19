import Link from "next/link"
import { notFound } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import {
  BookOpen,
  BriefcaseBusiness,
  CheckCircle2,
  CircleHelp,
  Clock3,
  GraduationCap,
  ListChecks,
  MonitorUp,
  Target,
  Users,
} from "lucide-react"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { businessTrainingPrograms, getBusinessTrainingProgram, type TrainingBadge } from "@/lib/business-training"

const badgeVariant = (badge: TrainingBadge) => {
  if (badge === "Most Popular") return "default"
  if (badge === "Enterprise Favorite") return "secondary"
  if (badge === "New") return "outline"
  return "default"
}

export function generateStaticParams() {
  return businessTrainingPrograms.map((program) => ({ slug: program.slug }))
}

export default async function BusinessTrainingDetailsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const program = getBusinessTrainingProgram(slug)

  if (!program) notFound()

  const salesSubject = encodeURIComponent(`${program.title} corporate training enquiry`)

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-16">
        <section className="py-10 md:py-14">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="space-y-6">
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink asChild>
                      <Link href="/">Home</Link>
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbLink asChild>
                      <Link href="/for-business">For Business</Link>
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage>{program.title}</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>

              <div className="grid gap-6 lg:grid-cols-5">
                <div className="lg:col-span-3 space-y-4">
                  <div className="flex flex-wrap gap-2">
                    <Badge variant={badgeVariant(program.badge)}>{program.badge}</Badge>
                    {program.deliveryOptions.map((option) => (
                      <Badge key={option} variant="outline">
                        {option}
                      </Badge>
                    ))}
                  </div>

                  <div>
                    <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">{program.title}</h1>
                    <p className="mt-4 max-w-3xl text-lg text-muted-foreground">{program.shortDescription}</p>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-3">
                    <Card className="shadow-sm">
                      <CardHeader className="pb-2">
                        <CardTitle className="flex items-center gap-2 text-base">
                          <Clock3 className="size-4 text-primary" aria-hidden="true" />
                          Duration
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">{program.duration}</p>
                      </CardContent>
                    </Card>
                    <Card className="shadow-sm sm:col-span-2">
                      <CardHeader className="pb-2">
                        <CardTitle className="flex items-center gap-2 text-base">
                          <MonitorUp className="size-4 text-primary" aria-hidden="true" />
                          Delivery Options
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">{program.deliveryOptions.join(", ")}</p>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                <div className="lg:col-span-2">
                  <Card className="shadow-sm">
                    <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BriefcaseBusiness className="size-5 text-primary" aria-hidden="true" />
                      Corporate Training Request
                    </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <p className="text-sm text-muted-foreground">
                        Plan a private team cohort with tailored labs, custom examples, and flexible scheduling.
                      </p>
                      <Button asChild className="w-full">
                        <Link href="/for-business#request-training">Request Corporate Training</Link>
                      </Button>
                      <Button asChild variant="outline" className="w-full">
                        <a href={`mailto:sales@zimlearning.co.zw?subject=${salesSubject}`}>Contact Sales</a>
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </div>

              <div className="grid gap-6 lg:grid-cols-3">
                <Card className="lg:col-span-2 shadow-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BookOpen className="size-5 text-primary" aria-hidden="true" />
                      Overview
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm leading-6 text-muted-foreground">{program.overview}</p>
                  </CardContent>
                </Card>

                <Card className="shadow-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <ListChecks className="size-5 text-primary" aria-hidden="true" />
                      Prerequisites
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      {program.prerequisites.map((item) => (
                        <li key={item} className="flex gap-2 rounded-lg border border-border bg-muted/30 p-3">
                          <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>

              <div className="grid gap-6 lg:grid-cols-2">
                <Card className="shadow-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="size-5 text-primary" aria-hidden="true" />
                      Learning Outcomes
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {program.learningOutcomes.map((item) => (
                        <li key={item} className="flex gap-3 rounded-lg border border-border bg-muted/30 p-4 text-sm text-muted-foreground">
                          <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                <Card className="shadow-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="size-5 text-primary" aria-hidden="true" />
                      Who Should Attend
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {program.whoShouldAttend.map((item) => (
                        <li key={item} className="rounded-lg border border-border bg-muted/30 p-4 text-sm text-muted-foreground">
                          {item}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>

              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <GraduationCap className="size-5 text-primary" aria-hidden="true" />
                    Detailed Course Curriculum / Syllabus
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Accordion type="multiple" className="space-y-3">
                    {program.curriculum.map((module, index) => {
                      const separatorIndex = module.indexOf(":")
                      const title = separatorIndex === -1 ? module : module.slice(0, separatorIndex)
                      const details = separatorIndex === -1 ? "Select to view the module focus and learning activities." : module.slice(separatorIndex + 1).trim()

                      return (
                        <AccordionItem
                          key={module}
                          value={`module-${index + 1}`}
                          className="rounded-lg border border-border bg-muted/30 px-4"
                        >
                          <AccordionTrigger className="hover:no-underline">
                            <span className="flex items-center gap-3 text-left">
                              <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                                {index + 1}
                              </span>
                              <span>{title}</span>
                            </span>
                          </AccordionTrigger>
                          <AccordionContent className="pl-11 pr-2 text-sm leading-6 text-muted-foreground">
                            {details}
                          </AccordionContent>
                        </AccordionItem>
                      )
                    })}
                  </Accordion>
                </CardContent>
              </Card>

              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CircleHelp className="size-5 text-primary" aria-hidden="true" />
                    Frequently Asked Questions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible className="space-y-3">
                    {program.faqs.map((faq, index) => (
                      <AccordionItem
                        key={faq.question}
                        value={`faq-${index + 1}`}
                        className="rounded-lg border border-border bg-muted/30 px-4"
                      >
                        <AccordionTrigger className="hover:no-underline">{faq.question}</AccordionTrigger>
                        <AccordionContent className="pr-6 text-sm leading-6 text-muted-foreground">
                          {faq.answer}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </CardContent>
              </Card>

              <Card className="shadow-sm">
                <CardContent className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h2 className="text-xl font-semibold text-foreground">Ready to train your team?</h2>
                    <p className="mt-2 text-sm text-muted-foreground">
                      Request a private cohort or speak with our team about tailoring this programme to your business.
                    </p>
                  </div>
                  <div className="flex flex-col gap-3 sm:flex-row">
                    <Button asChild>
                      <Link href="/for-business#request-training">Request Corporate Training</Link>
                    </Button>
                    <Button asChild variant="outline">
                      <a href={`mailto:sales@zimlearning.co.zw?subject=${salesSubject}`}>Contact Sales</a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
