import { notFound } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { TutorialReader } from "@/components/tutorials/tutorial-reader"
import { TutorialOverview } from "@/components/tutorials/tutorial-overview"
import { getSession } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { getPublishedTutorial } from "@/lib/tutorials"

export async function TutorialRoute({ tutorialSlug, lessonSlug }: { tutorialSlug: string; lessonSlug?: string }) {
  const tutorial = await getPublishedTutorial(tutorialSlug)
  if (!tutorial) notFound()
  const lessons = tutorial.sections.flatMap((section) => section.lessons)
  const currentLesson = lessonSlug ? lessons.find((lesson) => lesson.slug === lessonSlug) : lessons[0]
  if (!currentLesson) notFound()

  const session = await getSession()
  const studentId = session?.role === "student" ? session.userId : null
  const [progress, bookmark, enrollment, certificate] = studentId
    ? await Promise.all([
        prisma.tutorialProgress.findMany({ where: { userId: studentId, tutorialId: tutorial.id, completedAt: { not: null } }, select: { lessonId: true } }),
        prisma.tutorialBookmark.findUnique({ where: { userId_lessonId: { userId: studentId, lessonId: currentLesson.id } }, select: { id: true } }),
        prisma.tutorialEnrollment.findUnique({ where: { userId_tutorialId: { userId: studentId, tutorialId: tutorial.id } }, select: { id: true } }),
        prisma.tutorialCertificate.findUnique({ where: { userId_tutorialId: { userId: studentId, tutorialId: tutorial.id } }, select: { id: true } }),
      ])
    : [[], null, null, null]

  const readerTutorial = {
    id: tutorial.id,
    slug: tutorial.slug,
    title: tutorial.title,
    icon: tutorial.icon,
    sections: tutorial.sections.map((section) => ({
      id: section.id,
      title: section.title,
      lessons: section.lessons.map((lesson) => ({
        id: lesson.id,
        slug: lesson.slug,
        title: lesson.title,
        summary: lesson.summary,
        estimatedMinutes: lesson.estimatedMinutes,
        content: lesson.content,
        codeExamples: lesson.codeExamples.map(({ id, title, language, sourceCode, expectedOutput, explanation }) => ({ id, title, language, sourceCode, expectedOutput, explanation })),
        exercises: lesson.exercises.map(({ id, title, instructions, starterCode, expectedAnswer, explanation }) => ({ id, title, instructions, starterCode, expectedAnswer, explanation })),
        quiz: lesson.quiz ? {
          id: lesson.quiz.id,
          title: lesson.quiz.title,
          questions: lesson.quiz.questions.map((question) => ({ id: question.id, prompt: question.prompt, options: question.options.map(({ id, text }) => ({ id, text })) })),
        } : null,
      })),
    })),
  }
  const readerLesson = readerTutorial.sections.flatMap((section) => section.lessons).find((lesson) => lesson.id === currentLesson.id)
  if (!readerLesson) notFound()

  if (!lessonSlug) {
    const objectives = Array.isArray(tutorial.learningObjectives) ? tutorial.learningObjectives.filter((value): value is string => typeof value === "string") : []
    const references = Array.isArray(tutorial.sourceReferences)
      ? tutorial.sourceReferences.flatMap((value) => value && typeof value === "object" && !Array.isArray(value) && typeof value.label === "string" && typeof value.url === "string" ? [{ label: value.label, url: value.url }] : [])
      : []
    const project = tutorial.finalProject && typeof tutorial.finalProject === "object" && !Array.isArray(tutorial.finalProject)
      ? tutorial.finalProject as { title?: string; scenario?: string; requirements?: string[] }
      : null
    return <><Navbar /><TutorialOverview authenticated={Boolean(studentId)} initiallyEnrolled={Boolean(enrollment)} tutorial={{ slug: tutorial.slug, title: tutorial.title, shortDescription: tutorial.shortDescription, description: tutorial.description, difficulty: tutorial.difficulty, estimatedDuration: tutorial.estimatedDuration, category: tutorial.category, language: tutorial.language, ownerName: tutorial.ownerName, objectives, targetAudience: tutorial.targetAudience, prerequisites: tutorial.prerequisites, sections: tutorial.sections.map((section) => ({ id: section.id, title: section.title, description: section.description, lessons: section.lessons.map((lesson) => ({ slug: lesson.slug, title: lesson.title })) })), project, references }} /></>
  }

  return <><Navbar /><TutorialReader tutorial={readerTutorial} currentLesson={readerLesson} completedLessonIds={progress.map((item) => item.lessonId)} bookmarked={Boolean(bookmark)} authenticated={Boolean(studentId)} initiallyEnrolled={Boolean(enrollment)} certificateId={certificate?.id} /></>
}
