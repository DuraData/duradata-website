import { unstable_noStore as noStore } from "next/cache"
import { prisma } from "@/lib/prisma"

export const ACADEMY_FEATURE_KEYS = {
  academic: "academicLearningEnabled",
  corporate: "corporateLearningEnabled",
  free: "freeLearningEnabled",
} as const

export type AcademyFeatures = {
  academicLearningEnabled: boolean
  corporateLearningEnabled: boolean
  freeLearningEnabled: boolean
}

export const DEFAULT_ACADEMY_FEATURES: AcademyFeatures = {
  academicLearningEnabled: false,
  corporateLearningEnabled: true,
  freeLearningEnabled: true,
}

export async function getAcademyFeatures(): Promise<AcademyFeatures> {
  noStore()
  try {
    const rows = await prisma.platformSetting.findMany({
      where: { key: { in: Object.values(ACADEMY_FEATURE_KEYS) } },
      select: { key: true, value: true },
    })
    const values = new Map(rows.map((row) => [row.key, row.value]))
    return {
      academicLearningEnabled: parseBoolean(values.get(ACADEMY_FEATURE_KEYS.academic), DEFAULT_ACADEMY_FEATURES.academicLearningEnabled),
      corporateLearningEnabled: parseBoolean(values.get(ACADEMY_FEATURE_KEYS.corporate), DEFAULT_ACADEMY_FEATURES.corporateLearningEnabled),
      freeLearningEnabled: parseBoolean(values.get(ACADEMY_FEATURE_KEYS.free), DEFAULT_ACADEMY_FEATURES.freeLearningEnabled),
    }
  } catch (error) {
    // A broken or unreachable database must never make a disabled module available.
    console.error("[academy] Feature configuration unavailable; failing closed", error)
    return {
      academicLearningEnabled: false,
      corporateLearningEnabled: false,
      freeLearningEnabled: false,
    }
  }
}

export function parseBoolean(value: string | undefined, fallback: boolean) {
  if (value === "true") return true
  if (value === "false") return false
  return fallback
}

type FeatureName = "academic" | "corporate" | "free"

const FEATURE_PATHS: Record<FeatureName, string[]> = {
  academic: [
    "/academic-learning",
    "/zimbabwe-learning-hub",
    "/sa-learning-hub",
    "/api/zimbabwe-hub",
    "/api/sa-hub",
    "/api/subject-progress",
    "/api/subject-quiz",
    "/admin/subjects",
    "/api/admin/subjects",
    "/instructor/subjects",
    "/api/instructor/subjects",
    "/internal-instructor/subjects",
    "/api/internal-instructor/subjects",
  ],
  corporate: [
    "/courses",
    "/course",
    "/categories",
    "/for-business",
    "/business-training",
    "/api/courses",
    "/api/categories",
    "/api/enroll",
    "/api/my-courses",
    "/api/progress",
    "/api/favorites",
    "/api/certificates",
    "/api/achievements",
    "/api/billing",
    "/admin/courses",
    "/api/admin/courses",
    "/instructor/courses",
    "/api/instructor/courses",
    "/internal-instructor/courses",
    "/api/internal-instructor/courses",
    "/admin/organizations",
    "/api/admin/organizations",
    "/admin/categories",
    "/admin/enrollments",
    "/dashboard/courses",
    "/dashboard/wishlist",
    "/dashboard/billing",
    "/dashboard/certificates",
    "/dashboard/achievements",
    "/internal-instructor/categories",
    "/internal-instructor/enrollments",
  ],
  free: [
    "/api/tutorials",
    "/api/content/tutorials",
    "/admin/tutorials",
    "/internal-instructor/tutorials",
  ],
}

export function featureForPath(pathname: string): FeatureName | null {
  if (pathname === "/learn") return "free"
  if (pathname.startsWith("/learn/")) {
    const firstSegment = pathname.split("/")[2] ?? ""
    return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(firstSegment)
      ? "corporate"
      : "free"
  }
  for (const [feature, prefixes] of Object.entries(FEATURE_PATHS) as [FeatureName, string[]][]) {
    if (prefixes.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`))) return feature
  }
  return null
}

export function isFeatureEnabled(features: AcademyFeatures, feature: FeatureName) {
  return features[`${feature}LearningEnabled`]
}
