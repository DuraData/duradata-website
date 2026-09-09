"use client"

import { useEffect, useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { toast } from "@/hooks/use-toast"

type SettingRow = { key: string; value: string; updatedAt: string }

const fieldDefs = [
  { key: "platformName", label: "Platform name", placeholder: "e.g. Duradata Academy" },
  { key: "supportEmail", label: "Support email", placeholder: "e.g. academy@duradata.co.za" },
  { key: "commissionRateBps", label: "Commission rate (bps)", placeholder: "e.g. 1500 for 15%" },
  { key: "payoutMinimumZar", label: "Payout minimum (USD)", placeholder: "e.g. 20" },
] as const

const featureDefs = [
  { key: "academicLearningEnabled", label: "Academic Learning", description: "School subjects, examination preparation, homework, and academic learning hubs." },
  { key: "corporateLearningEnabled", label: "Corporate Learning", description: "Professional courses, business training, course management, and enrolment." },
  { key: "freeLearningEnabled", label: "Free Learning", description: "Free public tutorials and their learner progress experience." },
] as const

const featureDefaults: Record<(typeof featureDefs)[number]["key"], string> = {
  academicLearningEnabled: "false",
  corporateLearningEnabled: "true",
  freeLearningEnabled: "true",
}

export function AdminSettingsForm() {
  const [settings, setSettings] = useState<SettingRow[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  const map = useMemo(() => {
    const m = new Map<string, SettingRow>()
    for (const s of settings) m.set(s.key, s)
    return m
  }, [settings])

  const [values, setValues] = useState<Record<string, string>>({})

  const load = async (signal?: AbortSignal) => {
    setIsLoading(true)
    setError(null)
    const res = await fetch("/api/admin/settings", { cache: "no-store", signal }).catch(() => null)
    const json = res ? await res.json().catch(() => null) : null
    if (!res || !res.ok) {
      setSettings([])
      setIsLoading(false)
      setError(json?.error ?? "Failed to load settings")
      return
    }
    const rows = (json?.settings ?? []) as SettingRow[]
    setSettings(rows)
    const next: Record<string, string> = {}
    for (const def of fieldDefs) next[def.key] = rows.find((r) => r.key === def.key)?.value ?? ""
    for (const def of featureDefs) next[def.key] = rows.find((r) => r.key === def.key)?.value ?? featureDefaults[def.key]
    setValues(next)
    setIsLoading(false)
  }

  useEffect(() => {
    const controller = new AbortController()
    void load(controller.signal)
    return () => controller.abort()
  }, [])

  const save = async () => {
    const commissionBps = Number.parseInt(values.commissionRateBps ?? "", 10)
    if (!Number.isFinite(commissionBps) || commissionBps < 0 || commissionBps > 10_000) {
      toast({ title: "Commission rate must be a whole number between 0 and 10000 basis points" })
      return
    }

    setBusy(true)
    try {
      const payload = {
        settings: [...fieldDefs, ...featureDefs].map((d) => ({ key: d.key, value: values[d.key] ?? "" })),
      }
      const res = await fetch("/api/admin/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }).catch(() => null)
      const json = res ? await res.json().catch(() => null) : null
      if (!res || !res.ok) throw new Error(json?.error ?? "Save failed")
      toast({ title: "Settings saved" })
      await load()
    } catch (e) {
      toast({ title: "Failed to save settings", description: e instanceof Error ? e.message : "Unknown error" })
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Academy Learning Modes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">Changes take effect immediately across navigation, direct routes, and APIs. Disabled modes fail closed.</p>
          {featureDefs.map((feature) => (
            <div className="flex items-center justify-between gap-6 rounded-lg border border-border p-4" key={feature.key}>
              <div>
                <label className="font-medium text-foreground" htmlFor={feature.key}>{feature.label}</label>
                <p className="mt-1 text-sm text-muted-foreground">{feature.description}</p>
              </div>
              <Switch
                id={feature.key}
                checked={(values[feature.key] ?? featureDefaults[feature.key]) === "true"}
                onCheckedChange={(checked) => setValues((previous) => ({ ...previous, [feature.key]: String(checked) }))}
                aria-label={`Enable ${feature.label}`}
              />
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Platform Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {error ? <p className="text-sm text-destructive">{error}</p> : null}
          {isLoading ? <p className="text-sm text-muted-foreground">Loading...</p> : null}

          {!isLoading ? (
            <div className="grid gap-4 sm:grid-cols-2">
              {fieldDefs.map((f) => {
                const commissionBps = Number.parseInt(values.commissionRateBps ?? "", 10)
                const isValidCommission = Number.isFinite(commissionBps) && commissionBps >= 0 && commissionBps <= 10_000
                return (
                  <div key={f.key} className="space-y-2">
                    <label className="text-sm font-medium text-foreground" htmlFor={f.key}>
                      {f.label}
                    </label>
                    <Input
                      id={f.key}
                      value={values[f.key] ?? ""}
                      onChange={(e) => setValues((prev) => ({ ...prev, [f.key]: e.target.value }))}
                      placeholder={f.placeholder}
                    />
                    {f.key === "commissionRateBps" ? (
                      <p className="text-xs text-muted-foreground">
                        {isValidCommission
                          ? `= ${(commissionBps / 100).toFixed(2)}% platform commission, instructors keep ${(100 - commissionBps / 100).toFixed(2)}% of every sale.`
                          : "Enter a whole number of basis points between 0 and 10000."}
                      </p>
                    ) : null}
                    {map.get(f.key)?.updatedAt ? (
                      <p className="text-xs text-muted-foreground">
                        Updated {new Date(map.get(f.key)!.updatedAt).toLocaleString("en-ZW")}
                      </p>
                    ) : null}
                  </div>
                )
              })}
            </div>
          ) : null}

          <div className="flex justify-end">
            <Button onClick={() => void save()} disabled={isLoading} loading={busy}>
              Save changes
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Notes</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground space-y-2">
          <p>Commission rate is stored in basis points (bps). 1500 bps = 15%.</p>
          <p>All monetary values are treated as USD amounts unless a future payment configuration explicitly changes the currency.</p>
        </CardContent>
      </Card>
    </div>
  )
}
