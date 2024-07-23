'use server'

import { Role } from '@snipshare/auth'
import { revalidateTag } from 'next/cache'

import { getCurrentOrgSlug } from '@/auth/auth'
import { removeMember } from '@/http/remove-member'
import { updateMember } from '@/http/update-member'

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
