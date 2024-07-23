import { api } from './api-client'

interface RevokeInviteRequest {
  orgSlug: string
  inviteId: string
}

export async function revokeInvite({ orgSlug, inviteId }: RevokeInviteRequest) {
  await api.delete(`organizations/${orgSlug}/invites/${inviteId}`)
}
