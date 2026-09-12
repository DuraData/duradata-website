import { z } from "zod"
import { prisma } from "@/lib/prisma"
import { requireStudent } from "@/lib/rbac"
import { recogniseTutorialCompletion } from "@/lib/tutorial-completion"

const BodySchema = z.object({
  quizId: z.string().uuid(),
  answers: z.array(z.object({ questionId: z.string().uuid(), optionId: z.string().uuid() })).min(1),
})

export async function POST(req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const auth = await requireStudent()
  if (auth instanceof Response) return auth
  const parsed = BodySchema.safeParse(await req.json().catch(() => null))
  if (!parsed.success) return Response.json({ error: "Invalid quiz submission" }, { status: 400 })
  const { slug } = await params

  const quiz = await prisma.tutorialQuiz.findFirst({
    where: { id: parsed.data.quizId, lesson: { isPublished: true, section: { tutorial: { slug, status: "published", courseType: "FREE" } } } },
    include: { lesson: { select: { id: true, section: { select: { tutorialId: true } } } }, questions: { orderBy: { order: "asc" }, include: { options: { orderBy: { order: "asc" } } } } },
  })
  if (!quiz) return Response.json({ error: "Quiz not found" }, { status: 404 })
  const enrollment = await prisma.tutorialEnrollment.findUnique({ where: { userId_tutorialId: { userId: auth.user.id, tutorialId: quiz.lesson.section.tutorialId } }, select: { id: true } })
  if (!enrollment) return Response.json({ error: "Enroll in this free course before submitting quizzes" }, { status: 403 })

  const submitted = new Map(parsed.data.answers.map((answer) => [answer.questionId, answer.optionId]))
  const results = quiz.questions.map((question) => {
    const selectedOptionId = submitted.get(question.id)
    const selected = question.options.find((option) => option.id === selectedOptionId)
    const correct = Boolean(selected?.isCorrect)
    return { questionId: question.id, selectedOptionId: selectedOptionId ?? null, correct, explanation: question.explanation ?? "Review the lesson explanation and worked example." }
  })
  const score = results.filter((result) => result.correct).length
  const total = quiz.questions.length
  const passed = total > 0 && score / total >= 0.7
  await prisma.tutorialQuizAttempt.create({ data: { userId: auth.user.id, quizId: quiz.id, answers: parsed.data.answers, score, total, passed } })

  let completion = await recogniseTutorialCompletion(prisma, auth.user.id, quiz.lesson.section.tutorialId).catch(() => null)
  if (passed) {
    await prisma.tutorialProgress.upsert({
      where: { userId_lessonId: { userId: auth.user.id, lessonId: quiz.lesson.id } },
      update: { completedAt: new Date(), lastViewedAt: new Date() },
      create: { userId: auth.user.id, tutorialId: quiz.lesson.section.tutorialId, lessonId: quiz.lesson.id, completedAt: new Date() },
    })
    completion = await recogniseTutorialCompletion(prisma, auth.user.id, quiz.lesson.section.tutorialId)
  }
  return Response.json({ success: true, score, total, passed, results, completion })
}
