'use client'

import { AlertTriangle, Loader2 } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import { toast } from 'sonner'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useFormState } from '@/hooks/use-form-state'

import { resetPasswordAction } from './actions'

export function ResetPasswordForm() {
  const { token } = useParams<{ token: string }>()
  const router = useRouter()
  const [{ success, errors, message }, handleSubmit, isPending] = useFormState(
    resetPasswordAction,
    () => {
      toast.success('Password reset successfully')
      router.push('/auth/sign-in')
    },
  )

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input type="hidden" name="code" value={token} />

      {!success && message && (
        <Alert variant="destructive">
          <AlertTriangle className="size-4" />
          <AlertTitle>Failed to recover password</AlertTitle>
          <AlertDescription>
            <p>{message}</p>
          </AlertDescription>
        </Alert>
      )}

      <div className="space-y-1">
        <Label htmlFor="password">Password</Label>
        <Input name="password" type="password" id="password" />

        {errors?.password && (
          <p className="text-xs font-medium text-red-500 dark:text-red-400">
            {errors.password[0]}
          </p>
        )}
      </div>

      <div className="space-y-1">
        <Label htmlFor="password-confirmation">Confirm your password</Label>
        <Input
          name="passwordConfirmation"
          type="password"
          id="password-confirmation"
        />

        {errors?.passwordConfirmation && (
          <p className="text-xs font-medium text-red-500 dark:text-red-400">
            {errors.passwordConfirmation[0]}
          </p>
        )}
      </div>

      <Button type="submit" className="w-full">
        {isPending ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          'Reset password'
        )}
      </Button>
    </form>
  )
}
