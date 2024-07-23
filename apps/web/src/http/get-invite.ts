import { Role } from '@snipshare/auth'

import { api } from './api-client'

interface GetInviteResponse {
  invite: {
    id: string
    email: string
    role: Role
    createdAt: string
    author: {
      id: string
      name: string | null
      avatarUrl: string | null
    } | null
    organization: {
      id: string
      name: string
    }
  }
}

export async function getInvite(inviteId: string) {
  const result = await api
    .get(`invites/${inviteId}`, {})
    .json<GetInviteResponse>()
  return result
}
