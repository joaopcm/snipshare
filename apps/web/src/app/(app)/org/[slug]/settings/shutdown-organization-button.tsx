import { XCircle } from 'lucide-react'
import { revalidateTag } from 'next/cache'
import { redirect } from 'next/navigation'

import { getCurrentOrgSlug } from '@/auth/auth'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
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
    revalidateTag('organizations')
    redirect('/')
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button type="submit" variant="destructive" className="w-56">
          <XCircle className="mr-2 size-4" />
          Shutdown organization
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action is irreversible. It will permanently delete all data
            related to this organization. You will no longer be able to access
            it.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <form action={shutdownOrganizationAction}>
            <AlertDialogAction type="submit">
              Yes, shutdown organization
            </AlertDialogAction>
          </form>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
