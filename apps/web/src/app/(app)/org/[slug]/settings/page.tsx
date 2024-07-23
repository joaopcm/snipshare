import { OrganizationForm } from '@/app/(app)/org/organization-form'
import { ability } from '@/auth/auth'
import { PageLayout } from '@/components/page-layout'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

import { ShutdownOrganizationButton } from './shutdown-organization-button'

export default async function SettingsPage() {
  const permissions = await ability()

  const canUpdateOrganization = permissions?.can('update', 'Organization')
  const canGetBillingDetails = permissions?.can('get', 'Billing')
  const canShutdownOrganization = permissions?.can('delete', 'Organization')

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
              <OrganizationForm />
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
