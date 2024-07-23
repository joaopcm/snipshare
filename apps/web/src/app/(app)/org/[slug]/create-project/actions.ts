'use server'

import { HTTPError } from 'ky'
import { z } from 'zod'

import { getCurrentOrgSlug } from '@/auth/auth'
import { createProject as createProjectRequest } from '@/http/create-project'

const projectSchema = z.object({
  name: z
    .string()
    .min(4, { message: 'Project name must be at least 4 characters.' }),
  description: z.string(),
})

export async function createProject(data: FormData) {
  const result = projectSchema.safeParse(Object.fromEntries(data))
  if (!result.success) {
    return {
      success: false,
      message: null,
      errors: result.error.flatten().fieldErrors,
    }
  }

  const orgSlug = getCurrentOrgSlug()

  try {
    if (!orgSlug) {
      throw new Error('Organization not found.')
    }

    await createProjectRequest({
      ...result.data,
      orgSlug,
    })
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
    message: 'Successfully saved the project.',
    errors: null,
  }
}
