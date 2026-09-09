"use client"

import dynamic from "next/dynamic"

const DuradataWebsite = dynamic(() => import("../../src/App"), {
  ssr: false,
  loading: () => <div className="min-h-screen bg-brand-deep" aria-label="Loading Duradata website" />,
})

export function MarketingApp() {
  return <div className="duradata-site"><DuradataWebsite /></div>
}
