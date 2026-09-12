import type { PrismaClient } from "@/lib/generated/prisma/client"

export async function getTutorialCompletion(prisma: PrismaClient, userId: string, tutorialId: string) {
  const [totalLessons, completedLessons] = await Promise.all([
    prisma.tutorialLesson.count({ where: { isPublished: true, section: { tutorialId } } }),
    prisma.tutorialProgress.count({ where: { userId, tutorialId, completedAt: { not: null }, lesson: { isPublished: true } } }),
  ])
  return {
    totalLessons,
    completedLessons,
    percent: totalLessons === 0 ? 0 : Math.round((completedLessons / totalLessons) * 100),
    complete: totalLessons > 0 && completedLessons === totalLessons,
  }
}

export async function recogniseTutorialCompletion(prisma: PrismaClient, userId: string, tutorialId: string) {
  const completion = await getTutorialCompletion(prisma, userId, tutorialId)
  if (!completion.complete) return { ...completion, certificate: null }

  const enrollment = await prisma.tutorialEnrollment.update({
    where: { userId_tutorialId: { userId, tutorialId } },
    data: { completedAt: new Date() },
  })
  const certificateId = `DA-FREE-${enrollment.id.replace(/-/g, "").slice(0, 16).toUpperCase()}`
  const certificate = await prisma.tutorialCertificate.upsert({
    where: { userId_tutorialId: { userId, tutorialId } },
    update: {},
    create: { userId, tutorialId, certificateId },
  })
  return { ...completion, certificate }
}
