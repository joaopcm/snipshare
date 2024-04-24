import 'fastify'

import type { Membership, Organization } from '@prisma/client'

declare module 'fastify' {
  export interface FastifyRequest {
    getCurrentUserId(): Promise<string>
    getUserMembership(organizationSlug: string): Promise<{
      organization: Organization
      membership: Membership
    }>
  }
}
