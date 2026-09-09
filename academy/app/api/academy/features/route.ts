import { getAcademyFeatures } from "@/lib/academy-features"

export async function GET() {
  return Response.json(await getAcademyFeatures(), {
    headers: { "Cache-Control": "no-store" },
  })
}
