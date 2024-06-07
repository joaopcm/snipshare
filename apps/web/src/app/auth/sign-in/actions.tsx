'use server'

import { HTTPError } from 'ky'
import { z } from 'zod'

import { signInWithPassword } from '@/http/sign-in-with-password'

const signInSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  password: z
    .string()
    .min(6, { message: 'Password must be at least 6 characters long' }),
})

export async function signInWithEmailAndPassword(data: FormData) {
  const result = signInSchema.safeParse(Object.fromEntries(data))
  if (!result.success) {
    return {
      success: false,
      message: null,
      errors: result.error.flatten().fieldErrors,
    }
  }

  try {
    const { token } = await signInWithPassword(result.data)
    console.log({ token })
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
