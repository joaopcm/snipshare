import { Role } from '@snipshare/auth'

import { api } from './api-client'

interface GetMembersResponse {
  members: {
    userId: string
    id: string
    role: Role
    name: string | null
    email: string
    avatarUrl: string | null
  }[]
}

export async function getMembers(orgSlug: string) {
  const result = await api
    .get(`organizations/${orgSlug}/memberships`, {
      next: {
        tags: [`${orgSlug}/members`],
      },
    })
    .json<GetMembersResponse>()
  return result
}
