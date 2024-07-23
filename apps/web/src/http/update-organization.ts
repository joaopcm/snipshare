import { api } from './api-client'

interface UpdateOrganizationRequest {
  orgSlug: string
  name: string
  domain: string | null
  shouldAttachUsersByDomain: boolean
}

interface UpdateOrganizationResponse {
  organizationId: string
}

export async function updateOrganization({
  orgSlug,
  name,
  domain,
  shouldAttachUsersByDomain,
}: UpdateOrganizationRequest) {
  await api
    .put(`organizations/${orgSlug}`, {
      json: {
        name,
        domain,
        shouldAttachUsersByDomain,
      },
    })
    .json<UpdateOrganizationResponse>()
}
