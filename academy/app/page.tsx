import { Navbar } from "@/components/navbar"
import { HeroSection } from "@/components/hero-section"
import { CategoriesSection } from "@/components/categories-section"
import { CoursesSection } from "@/components/courses-section"
import { Footer } from "@/components/footer"
import { FreeLearningSection } from "@/components/free-learning-section"
import { getAcademyFeatures } from "@/lib/academy-features"

// Public, non-personalized landing page — ISR instead of per-request
// rendering so it serves from the edge on repeat visits.
export const dynamic = "force-dynamic"

export default async function Home() {
  const features = await getAcademyFeatures()
  return (
    <main className="min-h-screen bg-background">
      <Navbar initialFeatures={features} />
      <HeroSection features={features} />
      {features.corporateLearningEnabled ? <CategoriesSection /> : null}
      {features.freeLearningEnabled ? <FreeLearningSection /> : null}
      {features.corporateLearningEnabled ? <CoursesSection /> : null}
      {!features.academicLearningEnabled && !features.corporateLearningEnabled && !features.freeLearningEnabled ? (
        <section className="mx-auto max-w-3xl px-6 py-24 text-center"><h2>Learning programmes are temporarily unavailable</h2><p className="mt-4 text-muted-foreground">An Academy administrator can enable learning modes in Academy Settings.</p></section>
      ) : null}
      <Footer />
    </main>
  )
}
