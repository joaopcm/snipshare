'use server'

import { HTTPError } from 'ky'
import { z } from 'zod'

import { requestPasswordRecover } from '@/http/request-password-recover'

const requestPasswordRecoverSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
})

export async function requestPasswordRecoverAction(data: FormData) {
  const result = requestPasswordRecoverSchema.safeParse(
    Object.fromEntries(data),
  )
  if (!result.success) {
    return {
      success: false,
      message: null,
      errors: result.error.flatten().fieldErrors,
    }
  }

  try {
    await requestPasswordRecover(result.data.email)
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
