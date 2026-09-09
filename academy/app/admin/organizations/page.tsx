import { OrganizationsManager } from "@/components/admin/organizations-manager"

export default function OrganizationsPage() {
  return <div className="space-y-6"><div><p className="text-sm font-semibold uppercase tracking-wider text-primary">Corporate Learning</p><h1 className="mt-2">Organizations</h1><p className="mt-2 text-muted-foreground">Manage organizations, learners, organization administrators, and assigned training.</p></div><OrganizationsManager /></div>
}
