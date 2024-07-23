import { OrganizationForm } from '@/app/(app)/org/organization-form'
import { ability, getCurrentOrgSlug } from '@/auth/auth'
import { PageLayout } from '@/components/page-layout'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { getOrganization } from '@/http/get-organization'

import { ShutdownOrganizationButton } from './shutdown-organization-button'

export default async function SettingsPage() {
  const currentOrgSlug = getCurrentOrgSlug()
  const permissions = await ability()

  const canUpdateOrganization = permissions?.can('update', 'Organization')
  const canGetBillingDetails = permissions?.can('get', 'Billing')
  const canShutdownOrganization = permissions?.can('delete', 'Organization')

  const { organization } = currentOrgSlug
    ? await getOrganization(currentOrgSlug)
    : { organization: undefined }

  return (
    <PageLayout>
      <h1 className="text-2xl font-bold">Settings</h1>

      <div className="space-y-4">
        {canUpdateOrganization && (
          <Card>
            <CardHeader>
              <CardTitle>Organization settings</CardTitle>
              <CardDescription>
                Update your organization's details
              </CardDescription>
            </CardHeader>

            <CardContent>
              <OrganizationForm isUpdating initialData={organization} />
            </CardContent>
          </Card>
        )}

        {canGetBillingDetails && <div>Billing</div>}

        {canShutdownOrganization && (
          <Card>
            <CardHeader>
              <CardTitle>Shutdown organization</CardTitle>
              <CardDescription>
                Shutdown your organization and delete all its data. You cannot
                undo this action.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <ShutdownOrganizationButton />
            </CardContent>
          </Card>
        )}
      </div>
    </PageLayout>
  )
}
