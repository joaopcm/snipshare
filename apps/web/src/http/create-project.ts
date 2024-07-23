import { api } from './api-client'

interface CreateProjectRequest {
  orgSlug: string
  name: string
  description: string
}

interface CreateProjectResponse {
  organizationId: string
}

export async function createProject({
  orgSlug,
  name,
  description,
}: CreateProjectRequest) {
  await api
    .post(`organizations/${orgSlug}/projects`, {
      json: {
        name,
        description,
      },
    })
    .json<CreateProjectResponse>()
}
