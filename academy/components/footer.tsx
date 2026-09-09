"use client"

import Link from "next/link"
import { BookOpen, Briefcase, LifeBuoy, Mail } from "lucide-react"
import { useAcademyFeatures } from "@/hooks/use-academy-features"

type FeatureName = "academic" | "corporate" | "free"
type FooterLink = { label: string; href: string; feature?: FeatureName }

const footerLinks: Record<string, FooterLink[]> = {
  Product: [
    { label: "Courses", href: "/courses", feature: "corporate" },
    { label: "Categories", href: "/categories", feature: "corporate" },
    { label: "Academic Learning Hub", href: "/academic-learning", feature: "academic" },
    { label: "For Business", href: "/for-business", feature: "corporate" },
  ],
  "Duradata Academy": [
    { label: "Home", href: "/" },
    { label: "Login", href: "/login" },
    { label: "Register", href: "/register" },
    { label: "Dashboard", href: "/dashboard" },
  ],
  Resources: [
    { label: "Help Center", href: "/help" },
    { label: "My Courses", href: "/dashboard/courses", feature: "corporate" },
    { label: "Certificates", href: "/dashboard/certificates", feature: "corporate" },
    { label: "Achievements", href: "/dashboard/achievements", feature: "corporate" },
  ],
  Legal: [
    { label: "Privacy", href: "/privacy" },
    { label: "Terms", href: "/terms" },
  ],
}

const quickLinks: Array<{ name: string; icon: typeof BookOpen; href: string; feature?: FeatureName }> = [
  { name: "Courses", icon: BookOpen, href: "/courses", feature: "corporate" },
  { name: "Business", icon: Briefcase, href: "/for-business#request-training", feature: "corporate" },
  { name: "Support", icon: LifeBuoy, href: "/help" },
  { name: "Email", icon: Mail, href: "mailto:academy@duradata.co.za" },
]

export function Footer() {
  const features = useAcademyFeatures()
  const featureVisible = (feature?: FeatureName) => !feature || features[`${feature}LearningEnabled`]
  return (
    <footer className="border-t border-primary/15 bg-gradient-to-b from-background via-primary/5 to-secondary/10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="py-12 md:py-16">
          <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-6">
            <div className="md:col-span-2">
              <Link href="/" className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-md bg-primary shadow-xs">
                  <span className="text-lg font-bold text-primary-foreground">D</span>
                </div>
                <span className="text-lg font-semibold text-foreground">Duradata Academy</span>
              </Link>
              <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
                Practical, flexible learning pathways for individuals and organisations in one secure platform.
              </p>
              <div className="mt-6 flex gap-4">
                {quickLinks.filter((item) => featureVisible(item.feature)).map((item) => {
                  const Icon = item.icon
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="flex h-9 w-9 items-center justify-center rounded-md border border-primary/25 bg-background/90 text-muted-foreground transition-colors hover:border-primary hover:bg-primary hover:text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                      aria-label={item.name}
                    >
                      <Icon className="h-4 w-4" />
                    </Link>
                  )
                })}
              </div>
            </div>
            {Object.entries(footerLinks).map(([category, links]) => (
              <div key={category}>
                <h3 className="text-sm font-semibold uppercase tracking-wide text-primary">{category}</h3>
                <ul className="mt-4 space-y-3">
                  {links.filter((link) => featureVisible(link.feature)).map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="text-sm text-muted-foreground transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-col items-center justify-between gap-4 border-t border-primary/20 py-6 sm:flex-row">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Duradata Academy. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="text-sm text-muted-foreground transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-sm text-muted-foreground transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
