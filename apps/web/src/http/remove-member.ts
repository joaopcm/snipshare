import { api } from './api-client'

interface RemoveMemberRequest {
  orgSlug: string
  membershipId: string
}

export async function removeMember({
  orgSlug,
  membershipId,
}: RemoveMemberRequest) {
  await api.delete(`organizations/${orgSlug}/memberships/${membershipId}`)
}
