import type { Metadata } from "next"
import { MarketingApp } from "@/components/marketing-app"

export const metadata: Metadata = {
  title: "Duradata | Data, AI, Cloud and Automation",
  description:
    "Duradata helps organisations turn data, AI, cloud and automation into practical business outcomes.",
}

export default function DuradataWebsitePage() {
  return <MarketingApp />
}
