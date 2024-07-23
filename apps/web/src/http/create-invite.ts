import { Role } from '@snipshare/auth'

import { api } from './api-client'

interface CreateInviteRequest {
  orgSlug: string
  email: string
  role: Role
}

interface CreateInviteResponse {
  inviteId: string
}

export async function createInvite({
  orgSlug,
  email,
  role,
}: CreateInviteRequest) {
  await api
    .post(`organizations/${orgSlug}/invites`, {
      json: {
        email,
        role,
      },
    })
    .json<CreateInviteResponse>()
}
