import { isSafeE2ETestMode } from "@/lib/test-database"

function required(name: string) {
  const value = process.env[name]?.trim()
  if (!value) throw new Error(`Missing required environment variable: ${name}`)
  return value
}

export function validateProductionEnvironment() {
  required("ACADEMY_DATABASE_URL")
  if (process.env.NODE_ENV !== "production") return
  // `next build` always sets NODE_ENV=production. Permit local E2E builds only
  // when both an explicit test flag and an unmistakably isolated test database
  // are present. This cannot bypass production validation with a live DB URL.
  if (isSafeE2ETestMode()) return
  const appUrl = new URL(required("NEXT_PUBLIC_APP_URL"))
  if (appUrl.protocol !== "https:") throw new Error("NEXT_PUBLIC_APP_URL must use HTTPS in production")
  // Paynow is optional: preparePaynowCheckout() and verifyPaynowPayment()
  // already degrade to a clear "not configured" result/error at the point
  // of use when these are absent, so checkout is the only thing affected.
  if (process.env.PASSWORD_RESET_TOKEN_PEPPER?.trim().length && process.env.PASSWORD_RESET_TOKEN_PEPPER.trim().length < 32) throw new Error("PASSWORD_RESET_TOKEN_PEPPER must be at least 32 characters")
}
