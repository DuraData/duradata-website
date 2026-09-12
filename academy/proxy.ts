import { NextRequest, NextResponse } from "next/server"
import { featureForPath, getAcademyFeatures, isFeatureEnabled } from "@/lib/academy-features"

const SESSION_COOKIE_NAME = "duradata_academy_session"

const MUTATING_METHODS = new Set(["POST", "PUT", "PATCH", "DELETE"])
const SERVER_CALLBACK_PATHS = new Set(["/api/payments/paynow/callback"])

function requestHost(request: NextRequest) {
  return (request.headers.get("x-forwarded-host") || request.headers.get("host") || "")
    .split(",")[0]
    .trim()
    .toLowerCase()
    .replace(/:\d+$/, "")
}

function isAcademyHost(host: string) {
  const configured = (process.env.ACADEMY_HOSTS || "academy.duradata.co.za,academy.localhost")
    .split(",")
    .map((value) => value.trim().toLowerCase())
  return configured.includes(host) || host.startsWith("academy.")
}

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // One Next.js deployment serves both products. Main-domain requests are
  // internally rewritten to the preserved Duradata marketing application.
  if (!isAcademyHost(requestHost(request))) {
    if (pathname.startsWith("/_next/") || pathname === "/favicon.ico" || /\.[a-z0-9]+$/i.test(pathname)) {
      return NextResponse.next()
    }
    if (pathname === "/api/send-email") {
      return NextResponse.rewrite(new URL("/api/website/send-email", request.url))
    }
    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ error: "Not found" }, { status: 404 })
    }
    if (!pathname.startsWith("/website-shell")) {
      return NextResponse.rewrite(new URL(`/website-shell${pathname}`, request.url))
    }
  }

  if (isAcademyHost(requestHost(request)) && pathname.startsWith("/website-shell")) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  if (pathname === "/api/certificates" || pathname.startsWith("/api/certificates/") || pathname === "/dashboard/certificates" || pathname.startsWith("/dashboard/certificates/")) {
    const features = await getAcademyFeatures()
    if (!features.corporateLearningEnabled && !features.freeLearningEnabled) {
      if (pathname.startsWith("/api/")) return NextResponse.json({ error: "Certificates are currently disabled" }, { status: 404 })
      return NextResponse.rewrite(new URL("/feature-disabled", request.url), { status: 404 })
    }
  }

  if (pathname === "/api/my-courses" || pathname === "/dashboard/courses") {
    const features = await getAcademyFeatures()
    if (!features.corporateLearningEnabled && !features.freeLearningEnabled) {
      if (pathname.startsWith("/api/")) return NextResponse.json({ error: "Courses are currently disabled" }, { status: 404 })
      return NextResponse.rewrite(new URL("/feature-disabled", request.url), { status: 404 })
    }
  }

  const feature = featureForPath(pathname)
  if (feature) {
    const features = await getAcademyFeatures()
    if (!isFeatureEnabled(features, feature)) {
      if (pathname.startsWith("/api/")) {
        return NextResponse.json({ error: `${feature} learning is currently disabled` }, { status: 404 })
      }
      return NextResponse.rewrite(new URL(`/feature-disabled?feature=${feature}`, request.url), { status: 404 })
    }
  }

  if (["/register", "/become-instructor", "/api/auth/register", "/api/instructor/apply"].some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`))) {
    const features = await getAcademyFeatures()
    if (!features.academicLearningEnabled && !features.corporateLearningEnabled && !features.freeLearningEnabled) {
      if (pathname.startsWith("/api/")) return NextResponse.json({ error: "Academy registration is currently unavailable" }, { status: 404 })
      return NextResponse.rewrite(new URL("/feature-disabled", request.url))
    }
  }

  if (
    pathname.startsWith("/api/") &&
    MUTATING_METHODS.has(request.method) &&
    !SERVER_CALLBACK_PATHS.has(request.nextUrl.pathname) &&
    request.cookies.has(SESSION_COOKIE_NAME)
  ) {
    const origin = request.headers.get("origin")
    const host = request.headers.get("x-forwarded-host") || request.headers.get("host")
    const protocol = request.headers.get("x-forwarded-proto") || request.nextUrl.protocol.replace(":", "")
    const allowedOrigins = new Set([request.nextUrl.origin, host ? `${protocol}://${host}` : request.nextUrl.origin])
    const configuredUrl = process.env.ACADEMY_URL || process.env.NEXT_PUBLIC_APP_URL
    if (configuredUrl) {
      try {
        allowedOrigins.add(new URL(configuredUrl).origin)
      } catch {
        // Environment validation reports malformed configuration separately.
      }
    }

    if (origin && !allowedOrigins.has(origin)) {
      return NextResponse.json({ error: "Cross-origin request rejected" }, { status: 403 })
    }
  }

  return NextResponse.next()
}

export const config = { matcher: "/((?!_next/static|_next/image).*)" }
