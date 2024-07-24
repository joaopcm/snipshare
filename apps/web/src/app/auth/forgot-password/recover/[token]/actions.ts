'use server'

import { HTTPError } from 'ky'
import { z } from 'zod'

import { resetPassword } from '@/http/reset-password'

const recoverPasswordSchema = z
  .object({
    code: z.string(),
    password: z
      .string()
      .min(6, { message: 'Password must be at least 6 characters long' }),
    passwordConfirmation: z.string(),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: 'Passwords do not match',
    path: ['passwordConfirmation'],
  })

export async function resetPasswordAction(data: FormData) {
  const result = recoverPasswordSchema.safeParse(Object.fromEntries(data))
  if (!result.success) {
    return {
      success: false,
      message: null,
      errors: result.error.flatten().fieldErrors,
    }
  }

  try {
    await resetPassword(result.data)
  } catch (error) {
    if (error instanceof HTTPError) {
      const { message } = await error.response.json()
      return {
        success: false,
        message,
        errors: null,
      }
    }

    console.error(error)
    return {
      success: false,
      message: 'An unexpected error occurred. Please try again.',
      errors: null,
    }
  }

  return {
    success: true,
    message: null,
    errors: null,
  }
}
