import Link from "next/link"

export default async function FeatureDisabledPage({ searchParams }: { searchParams: Promise<{ feature?: string }> }) {
  const { feature } = await searchParams
  const label = feature ? `${feature[0].toUpperCase()}${feature.slice(1)} learning` : "This learning mode"
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6">
      <div className="max-w-lg rounded-xl border border-border bg-card p-8 text-center shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-wider text-primary">Duradata Academy</p>
        <h1 className="mt-3 text-3xl font-semibold">{label} is unavailable</h1>
        <p className="mt-4 text-muted-foreground">This learning mode is currently disabled by an Academy administrator.</p>
        <Link className="mt-6 inline-flex rounded-md bg-primary px-4 py-2 font-semibold text-primary-foreground" href="/">Return to Academy</Link>
      </div>
    </main>
  )
}
