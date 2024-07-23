'use server'

import { revalidateTag } from 'next/cache'

import { getCurrentOrgSlug } from '@/auth/auth'
import { removeMember } from '@/http/remove-member'

export async function removeMembershipAction(membershipId: string) {
  const currentOrgSlug = getCurrentOrgSlug()
  if (!currentOrgSlug) {
    throw new Error('Organization not found.')
  }

  await removeMember({ orgSlug: currentOrgSlug, membershipId })
  revalidateTag(`${currentOrgSlug}/members`)
}
