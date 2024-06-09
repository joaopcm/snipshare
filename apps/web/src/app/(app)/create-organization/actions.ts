'use server'

import { HTTPError } from 'ky'
import { z } from 'zod'

import { createOrganization as createOrganizationRequest } from '@/http/create-organization'

const organizationSchema = z
  .object({
    name: z
      .string()
      .min(4, { message: 'Organization name must be at least 4 characters.' }),
    domain: z
      .string()
      .nullable()
      .refine(
        (value) => {
          if (!value) return true
          const domainRegex = /^[a-zA-Z0-9.-]+.[a-zA-Z]{2,}$/
          return domainRegex.test(value)
        },
        {
          message: 'Invalid domain.',
        },
      ),
    shouldAttachUsersByDomain: z
      .union([z.literal('on'), z.literal('off'), z.boolean()])
      .transform((value) => value === 'on' || value === true)
      .default(false),
  })
  .refine(
    (data) => {
      if (!data.domain && data.shouldAttachUsersByDomain) {
        return false
      }
      return true
    },
    {
      message: 'Domain is required when attaching users by domain.',
      path: ['domain'],
    },
  )

export async function createOrganization(data: FormData) {
  const result = organizationSchema.safeParse(Object.fromEntries(data))
  if (!result.success) {
    return {
      success: false,
      message: null,
      errors: result.error.flatten().fieldErrors,
    }
  }

  try {
    await createOrganizationRequest(result.data)
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
    message: 'Successfully saved the organization.',
    errors: null,
  }
}
