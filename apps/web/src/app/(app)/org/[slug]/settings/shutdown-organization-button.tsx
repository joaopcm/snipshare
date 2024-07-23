import { XCircle } from 'lucide-react'
import { redirect } from 'next/navigation'

import { getCurrentOrgSlug } from '@/auth/auth'
import { Button } from '@/components/ui/button'
import { shutdownOrganization } from '@/http/shutdown-organization'

export function ShutdownOrganizationButton() {
  async function shutdownOrganizationAction() {
    'use server'

    const currentOrgSlug = getCurrentOrgSlug()
    if (!currentOrgSlug) {
      throw new Error('Organization not found.')
    }

    await shutdownOrganization({ orgSlug: currentOrgSlug })
    redirect('/')
  }

  return (
    <form action={shutdownOrganizationAction}>
      <Button type="submit" variant="destructive" className="w-56">
        <XCircle className="mr-2 size-4" />
        Shutdown organization
      </Button>
    </form>
  )
}
