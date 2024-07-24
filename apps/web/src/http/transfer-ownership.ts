import { api } from './api-client'

interface TransferOwnershipRequest {
  destinationUserId: string
  orgSlug: string
}

export async function transferOwnership({
  orgSlug,
  destinationUserId,
}: TransferOwnershipRequest) {
  await api.patch(`organizations/${orgSlug}/owner`, {
    json: {
      transferToUserId: destinationUserId,
    },
  })
}
