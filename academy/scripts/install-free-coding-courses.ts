import "dotenv/config"
import { createHash } from "node:crypto"
import type { Prisma, PrismaClient } from "../lib/generated/prisma/client"
import { createAcademyPrismaClient } from "../lib/create-prisma-client"
import {
  buildFreeCodingLibrary,
  FREE_CODING_LIBRARY_MANAGED_PREFIX,
  FREE_CODING_LIBRARY_VERSION,
} from "../content/free-coding-library"

function stableUuid(scope: string) {
  const chars = createHash("sha256").update(scope).digest("hex").slice(0, 32).split("")
  chars[12] = "4"
  chars[16] = "a"
  const value = chars.join("")
  return `${value.slice(0, 8)}-${value.slice(8, 12)}-${value.slice(12, 16)}-${value.slice(16, 20)}-${value.slice(20)}`
}

function json(value: unknown) {
  return value as Prisma.InputJsonValue
}

export async function installFreeCodingCourses(prisma: PrismaClient) {
  const library = buildFreeCodingLibrary()
  const results: Array<{ slug: string; action: "created" | "updated" | "preserved"; lessons: number; questions: number }> = []

  for (const course of library) {
    const managedKey = `${FREE_CODING_LIBRARY_MANAGED_PREFIX}:${course.slug}`
    const existing = await prisma.tutorial.findUnique({
      where: { slug: course.slug },
      select: { id: true, managedKey: true, managedVersion: true, updatedById: true },
    })

    if (existing && existing.managedKey !== managedKey) {
      throw new Error(`Refusing to overwrite unmanaged tutorial with reserved slug: ${course.slug}`)
    }
    if (existing?.updatedById) {
      results.push({ slug: course.slug, action: "preserved", lessons: course.lessons.length, questions: course.lessons.length * 2 })
      continue
    }
    if (existing?.managedVersion === FREE_CODING_LIBRARY_VERSION) {
      results.push({ slug: course.slug, action: "preserved", lessons: course.lessons.length, questions: course.lessons.length * 2 })
      continue
    }

    const action = existing ? "updated" : "created"
    const tutorialData = {
      title: course.title,
      shortDescription: course.shortDescription,
      description: course.description,
      icon: course.icon,
      imageUrl: null,
      difficulty: course.difficulty,
      estimatedDuration: course.durationMinutes,
      status: "published" as const,
      publishedAt: new Date("2026-09-12T00:00:00.000Z"),
      learningObjectives: json(course.objectives),
      targetAudience: course.targetAudience,
      prerequisites: course.prerequisites,
      category: course.category,
      tags: json(course.tags),
      language: "English",
      courseType: "FREE",
      ownerName: "Duradata Academy",
      finalProject: json(course.project),
      sourceReferences: json(course.references),
      managedKey,
      managedVersion: existing?.managedVersion ?? 0,
    }

    const tutorial = existing
      ? await prisma.tutorial.update({ where: { id: existing.id }, data: tutorialData })
      : await prisma.tutorial.create({
          data: { id: stableUuid(`tutorial:${course.slug}`), slug: course.slug, ...tutorialData },
        })

    for (const [moduleOrder, lesson] of course.lessons.entries()) {
      const sectionId = stableUuid(`section:${course.slug}:${lesson.slug}`)
      const section = await prisma.tutorialSection.upsert({
        where: { tutorialId_slug: { tutorialId: tutorial.id, slug: lesson.slug } },
        update: { title: lesson.title, description: lesson.summary, order: moduleOrder },
        create: { id: sectionId, tutorialId: tutorial.id, title: lesson.title, slug: lesson.slug, description: lesson.summary, order: moduleOrder },
      })
      const lessonId = stableUuid(`lesson:${course.slug}:${lesson.slug}`)
      const savedLesson = await prisma.tutorialLesson.upsert({
        where: { sectionId_slug: { sectionId: section.id, slug: lesson.slug } },
        update: { title: lesson.title, summary: lesson.summary, content: json(lesson.content), order: 0, estimatedMinutes: lesson.minutes, isPublished: true },
        create: { id: lessonId, sectionId: section.id, title: lesson.title, slug: lesson.slug, summary: lesson.summary, content: json(lesson.content), order: 0, estimatedMinutes: lesson.minutes, isPublished: true },
      })

      await prisma.tutorialCodeExample.upsert({
        where: { id: stableUuid(`example:${course.slug}:${lesson.slug}`) },
        update: { lessonId: savedLesson.id, title: lesson.example.title, language: lesson.example.language, sourceCode: lesson.example.sourceCode, expectedOutput: lesson.example.expectedOutput, explanation: lesson.example.explanation, order: 0 },
        create: { id: stableUuid(`example:${course.slug}:${lesson.slug}`), lessonId: savedLesson.id, title: lesson.example.title, language: lesson.example.language, sourceCode: lesson.example.sourceCode, expectedOutput: lesson.example.expectedOutput, explanation: lesson.example.explanation, order: 0 },
      })
      await prisma.tutorialExercise.upsert({
        where: { id: stableUuid(`exercise:${course.slug}:${lesson.slug}`) },
        update: { lessonId: savedLesson.id, title: lesson.exercise.title, instructions: lesson.exercise.instructions, starterCode: lesson.exercise.starterCode, expectedAnswer: lesson.exercise.expectedAnswer, explanation: lesson.exercise.explanation, order: 0 },
        create: { id: stableUuid(`exercise:${course.slug}:${lesson.slug}`), lessonId: savedLesson.id, title: lesson.exercise.title, instructions: lesson.exercise.instructions, starterCode: lesson.exercise.starterCode, expectedAnswer: lesson.exercise.expectedAnswer, explanation: lesson.exercise.explanation, order: 0 },
      })

      const quiz = await prisma.tutorialQuiz.upsert({
        where: { lessonId: savedLesson.id },
        update: { title: `${lesson.title} knowledge check` },
        create: { id: stableUuid(`quiz:${course.slug}:${lesson.slug}`), lessonId: savedLesson.id, title: `${lesson.title} knowledge check` },
      })
      for (const [questionOrder, questionData] of lesson.questions.entries()) {
        const questionId = stableUuid(`question:${course.slug}:${lesson.slug}:${questionOrder}`)
        const question = await prisma.tutorialQuizQuestion.upsert({
          where: { id: questionId },
          update: { quizId: quiz.id, prompt: questionData.prompt, explanation: questionData.explanation, order: questionOrder },
          create: { id: questionId, quizId: quiz.id, prompt: questionData.prompt, explanation: questionData.explanation, order: questionOrder },
        })
        for (const [optionOrder, optionText] of questionData.options.entries()) {
          const optionId = stableUuid(`option:${course.slug}:${lesson.slug}:${questionOrder}:${optionOrder}`)
          await prisma.tutorialQuizOption.upsert({
            where: { id: optionId },
            update: { questionId: question.id, text: optionText, isCorrect: optionOrder === questionData.correct, order: optionOrder },
            create: { id: optionId, questionId: question.id, text: optionText, isCorrect: optionOrder === questionData.correct, order: optionOrder },
          })
        }
      }
    }

    await prisma.tutorial.update({ where: { id: tutorial.id }, data: { managedVersion: FREE_CODING_LIBRARY_VERSION } })

    results.push({ slug: course.slug, action, lessons: course.lessons.length, questions: course.lessons.length * 2 })
  }

  return results
}

async function main() {
  const prisma = createAcademyPrismaClient()
  try {
    const results = await installFreeCodingCourses(prisma)
    const totals = results.reduce((value, item) => ({ lessons: value.lessons + item.lessons, questions: value.questions + item.questions }), { lessons: 0, questions: 0 })
    console.log(JSON.stringify({ success: true, version: FREE_CODING_LIBRARY_VERSION, courses: results, totals }, null, 2))
  } finally {
    await prisma.$disconnect()
  }
}

if (process.argv[1]?.replace(/\\/g, "/").endsWith("/install-free-coding-courses.ts")) {
  main().catch((error) => {
    console.error(error)
    process.exitCode = 1
  })
}
