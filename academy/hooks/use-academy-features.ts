"use client"

import { useEffect, useState } from "react"
import type { AcademyFeatures } from "@/lib/academy-features"

const closed: AcademyFeatures = { academicLearningEnabled: false, corporateLearningEnabled: false, freeLearningEnabled: false }

export function useAcademyFeatures() {
  const [features, setFeatures] = useState<AcademyFeatures>(closed)
  useEffect(() => {
    const controller = new AbortController()
    fetch("/api/academy/features", { cache: "no-store", signal: controller.signal })
      .then((response) => response.ok ? response.json() : closed)
      .then(setFeatures)
      .catch(() => setFeatures(closed))
    return () => controller.abort()
  }, [])
  return features
}
