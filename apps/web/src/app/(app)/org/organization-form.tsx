'use client'

import { AlertTriangle, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { toast } from 'sonner'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useFormState } from '@/hooks/use-form-state'

import {
  createOrganization,
  OrganizationSchema,
  updateOrganization,
} from './actions'

interface OrganizationFormProps {
  isUpdating?: boolean
  initialData?: OrganizationSchema
}

export function OrganizationForm({
  isUpdating = false,
  initialData,
}: OrganizationFormProps) {
  const router = useRouter()
  const formAction = isUpdating ? updateOrganization : createOrganization
  const [{ success, errors, message }, handleSubmit, isPending] = useFormState(
    formAction,
    () => {
      if (!isUpdating) {
        router.back()
      }
    },
  )

  useEffect(() => {
    if (success && message) {
      toast.success(message)
    }
  }, [success, message])

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {!success && message && (
        <Alert variant="destructive">
          <AlertTriangle className="size-4" />
          <AlertTitle>Failed to save organization</AlertTitle>
          <AlertDescription>
            <p>{message}</p>
          </AlertDescription>
        </Alert>
      )}

      <div className="space-y-1">
        <Label htmlFor="name">Organization name</Label>
        <Input name="name" id="name" defaultValue={initialData?.name} />

        {errors?.name && (
          <p className="text-xs font-medium text-red-500 dark:text-red-400">
            {errors.name[0]}
          </p>
        )}
      </div>

      <div className="space-y-1">
        <Label htmlFor="domain">Domain</Label>
        <Input
          name="domain"
          type="text"
          id="domain"
          inputMode="url"
          placeholder="snipshare.co"
          defaultValue={initialData?.domain ?? undefined}
        />

        {errors?.domain && (
          <p className="text-xs font-medium text-red-500 dark:text-red-400">
            {errors.domain[0]}
          </p>
        )}
      </div>

      <div className="items-top flex space-x-2">
        <Checkbox
          id="shouldAttachUsersByDomain"
          name="shouldAttachUsersByDomain"
          defaultChecked={initialData?.shouldAttachUsersByDomain}
        />
        <div className="grid gap-1.5 leading-none">
          <label
            htmlFor="shouldAttachUsersByDomain"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Auto-join new members
          </label>
          <p className="text-sm text-muted-foreground">
            Automatically add new users with the email domain to this
            organization.
          </p>
        </div>
      </div>

      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          'Save organization'
        )}
      </Button>
    </form>
  )
}
