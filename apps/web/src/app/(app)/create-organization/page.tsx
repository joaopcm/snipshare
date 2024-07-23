import { PageLayout } from '@/components/page-layout'

import { OrganizationForm } from '../org/organization-form'

export default function CreateOrganizationPage() {
  return (
    <PageLayout>
      <h1 className="text-2xl font-bold">Create organization</h1>
      <OrganizationForm />
    </PageLayout>
  )
}
