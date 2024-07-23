'use server'

import { Role, roleSchema } from '@snipshare/auth'
import { HTTPError } from 'ky'
import { revalidateTag } from 'next/cache'
import { z } from 'zod'

import { getCurrentOrgSlug } from '@/auth/auth'
import { createInvite } from '@/http/create-invite'
import { removeMember } from '@/http/remove-member'
import { revokeInvite } from '@/http/revoke-invite'
import { updateMember } from '@/http/update-member'

const inviteSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  role: roleSchema,
})

export async function createInviteAction(data: FormData) {
  const result = inviteSchema.safeParse(Object.fromEntries(data))
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

    await createInvite({
      ...result.data,
      orgSlug,
    })
    revalidateTag(`${orgSlug}/invites`)
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
    message: 'Successfully invited the user.',
    errors: null,
  }
}

export async function removeMembershipAction(membershipId: string) {
  const currentOrgSlug = getCurrentOrgSlug()
  if (!currentOrgSlug) {
    throw new Error('Organization not found.')
  }

  await removeMember({ orgSlug: currentOrgSlug, membershipId })
  revalidateTag(`${currentOrgSlug}/members`)
}

export async function updateMembershipAction(membershipId: string, role: Role) {
  const currentOrgSlug = getCurrentOrgSlug()
  if (!currentOrgSlug) {
    throw new Error('Organization not found.')
  }

  await updateMember({ orgSlug: currentOrgSlug, membershipId, role })
  revalidateTag(`${currentOrgSlug}/members`)
}

export async function revokeInviteAction(inviteId: string) {
  const currentOrgSlug = getCurrentOrgSlug()
  if (!currentOrgSlug) {
    throw new Error('Organization not found.')
  }

  await revokeInvite({ orgSlug: currentOrgSlug, inviteId })
  revalidateTag(`${currentOrgSlug}/invites`)
}
