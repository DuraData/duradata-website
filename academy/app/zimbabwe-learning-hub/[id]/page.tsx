import { redirect } from "next/navigation"

export default async function LegacyAcademicPackageRedirectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  redirect(`/academic-learning/${id}`)
}
