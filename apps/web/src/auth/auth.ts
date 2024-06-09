import { defineAbilityFor } from '@snipshare/auth'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

import { getMembership } from '@/http/get-membership'
import { getProfile } from '@/http/get-profile'

export function isAuthenticated() {
  return !!cookies().get('token')?.value
}

export function getCurrentOrgSlug() {
  return cookies().get('org')?.value ?? null
}

export async function getCurrentMembership() {
  const orgSlug = getCurrentOrgSlug()
  if (!orgSlug) {
    return null
  }

  const { membership } = await getMembership(orgSlug)
  return membership
}

export async function ability() {
  const membership = await getCurrentMembership()
  if (!membership) {
    return null
  }

  const ability = defineAbilityFor({
    __typename: 'User',
    id: membership.userId,
    role: membership.role,
  })
  return ability
}

export async function auth() {
  const token = cookies().get('token')?.value
  if (!token) {
    redirect('/auth/sign-in')
  }

  try {
    const response = await getProfile()
    return response
  } catch {}

  redirect('/api/auth/sign-out')
}
