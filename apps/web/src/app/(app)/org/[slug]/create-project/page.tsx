import { redirect } from 'next/navigation'

import { ability } from '@/auth/auth'
import { PageLayout } from '@/components/page-layout'

import { ProjectForm } from './project-form'

export default async function CreateProjectPage() {
  const permissions = await ability()

  if (permissions?.cannot('create', 'Project')) {
    redirect('/')
  }

  return (
    <PageLayout>
      <h1 className="text-2xl font-bold">Create project</h1>
      <ProjectForm />
    </PageLayout>
  )
}
