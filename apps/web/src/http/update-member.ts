import { Role } from '@snipshare/auth'

import { api } from './api-client'

interface UpdateMemberRequest {
  orgSlug: string
  membershipId: string
  role: Role
}

export async function updateMember({
  orgSlug,
  membershipId,
  role,
}: UpdateMemberRequest) {
  await api.put(`organizations/${orgSlug}/memberships/${membershipId}`, {
    json: {
      role,
    },
  })
}
