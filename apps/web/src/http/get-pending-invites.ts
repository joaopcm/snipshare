import { Role } from '@snipshare/auth'

import { api } from './api-client'

interface GetPendingInvitesResponse {
  invites: {
    organization: {
      id: string
      name: string
    }
    id: string
    email: string
    role: Role
    createdAt: string
    author: {
      id: string
      name: string | null
      avatarUrl: string | null
    } | null
  }[]
}

export async function getPendingInvites() {
  const result = await api
    .get('pending-invites')
    .json<GetPendingInvitesResponse>()
  return result
}
