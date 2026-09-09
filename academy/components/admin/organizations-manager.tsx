"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "@/hooks/use-toast"

type User = { id: string; name: string; email: string }
type Course = { id: string; title: string }
type Organization = { id: string; name: string; active: boolean; members: Array<{ id: string; role: string; user: User }>; assignments: Array<{ id: string; course: Course; dueAt?: string | null }> }

export function OrganizationsManager() {
  const [organizations, setOrganizations] = useState<Organization[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [courses, setCourses] = useState<Course[]>([])
  const [name, setName] = useState("")
  const [busy, setBusy] = useState(false)

  const load = async () => {
    const response = await fetch("/api/admin/organizations", { cache: "no-store" })
    const data = await response.json()
    if (!response.ok) throw new Error(data.error || "Unable to load organizations")
    setOrganizations(data.organizations || []); setUsers(data.users || []); setCourses(data.courses || [])
  }
  useEffect(() => { void load().catch((error) => toast({ title: "Unable to load organizations", description: error.message })) }, [])

  const mutate = async (method: string, body: object) => {
    setBusy(true)
    try {
      const response = await fetch("/api/admin/organizations", { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) })
      const data = await response.json().catch(() => ({}))
      if (!response.ok) throw new Error(data.error || "Request failed")
      await load()
    } catch (error) { toast({ title: "Organization update failed", description: error instanceof Error ? error.message : "Unknown error" }) }
    finally { setBusy(false) }
  }

  return <div className="space-y-6">
    <Card><CardHeader><CardTitle>Create organization</CardTitle></CardHeader><CardContent className="flex gap-3"><Input value={name} onChange={(event) => setName(event.target.value)} placeholder="Organization name" /><Button loading={busy} onClick={() => { void mutate("POST", { action: "createOrganization", name }); setName("") }}>Create</Button></CardContent></Card>
    {organizations.map((organization) => <Card key={organization.id}>
      <CardHeader><CardTitle className="flex items-center justify-between"><span>{organization.name}</span><span className="text-sm font-normal text-muted-foreground">{organization.active ? "Active" : "Inactive"}</span></CardTitle></CardHeader>
      <CardContent className="grid gap-6 lg:grid-cols-2">
        <section><h3 className="text-lg font-semibold">Learners and administrators</h3><div className="mt-3 flex gap-2"><select id={`user-${organization.id}`} className="h-10 min-w-0 flex-1 rounded-md border bg-background px-3"><option value="">Select user</option>{users.map((user) => <option value={user.id} key={user.id}>{user.name} ({user.email})</option>)}</select><select id={`role-${organization.id}`} className="h-10 rounded-md border bg-background px-3"><option value="learner">Learner</option><option value="manager">Manager</option><option value="administrator">Administrator</option></select><Button disabled={busy} onClick={() => { const userId = (document.getElementById(`user-${organization.id}`) as HTMLSelectElement).value; const role = (document.getElementById(`role-${organization.id}`) as HTMLSelectElement).value; if (userId) void mutate("POST", { action: "addMember", organizationId: organization.id, userId, role }) }}>Add</Button></div><ul className="mt-3 divide-y">{organization.members.map((member) => <li className="flex items-center justify-between py-2 text-sm" key={member.id}><span>{member.user.name} · {member.role}</span><Button variant="ghost" size="sm" onClick={() => void mutate("DELETE", { type: "member", id: member.id })}>Remove</Button></li>)}</ul></section>
        <section><h3 className="text-lg font-semibold">Assigned training</h3><div className="mt-3 flex gap-2"><select id={`course-${organization.id}`} className="h-10 min-w-0 flex-1 rounded-md border bg-background px-3"><option value="">Select course</option>{courses.map((course) => <option value={course.id} key={course.id}>{course.title}</option>)}</select><Button disabled={busy} onClick={() => { const courseId = (document.getElementById(`course-${organization.id}`) as HTMLSelectElement).value; if (courseId) void mutate("POST", { action: "assignCourse", organizationId: organization.id, courseId, required: true }) }}>Assign</Button></div><ul className="mt-3 divide-y">{organization.assignments.map((assignment) => <li className="flex items-center justify-between py-2 text-sm" key={assignment.id}><span>{assignment.course.title}</span><Button variant="ghost" size="sm" onClick={() => void mutate("DELETE", { type: "assignment", id: assignment.id })}>Remove</Button></li>)}</ul></section>
      </CardContent>
    </Card>)}
    {!organizations.length ? <p className="rounded-lg border border-dashed p-8 text-center text-muted-foreground">No organizations yet.</p> : null}
  </div>
}
