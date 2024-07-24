import { cookies } from 'next/headers'

import { acceptInvite } from '@/http/accept-invite'

export async function acceptInviteIfAny() {
  const inviteId = cookies().get('inviteId')?.value
  if (inviteId) {
    try {
      await acceptInvite(inviteId)
    } catch {}
    cookies().delete('inviteId')
  }
}
