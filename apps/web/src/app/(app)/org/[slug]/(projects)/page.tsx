import { Plus } from 'lucide-react'
import Link from 'next/link'

import { ability, getCurrentOrgSlug } from '@/auth/auth'
import { Button } from '@/components/ui/button'

import { ProjectList } from './project-list'

export default async function OrgHomePage() {
  const permissions = await ability()
  const currentOrgSlug = getCurrentOrgSlug()

  const canCreateProject = permissions?.can('create', 'Project')
  const canListProjects = permissions?.can('get', 'Project')

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Projects</h1>

        {canCreateProject && (
          <Button size="sm" asChild>
            <Link href={`/org/${currentOrgSlug}/create-project`}>
              <Plus className="mr-2 size-4" />
              Create project
            </Link>
          </Button>
        )}
      </div>

      {canListProjects ? (
        <ProjectList />
      ) : (
        <p className="text-sm text-muted-foreground">
          You don't have permission to list projects.
        </p>
      )}
    </div>
  )
}
