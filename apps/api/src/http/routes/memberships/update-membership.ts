import { roleSchema } from '@nodepad/auth'
import type { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { auth } from '@/http/middlewares/auth'
import { prisma } from '@/lib/prisma'
import { getUserPermissions } from '@/utils/get-user-permissions'

import { UnauthorizedError } from '../_errors/unauthorized-error'

export async function updateMembership(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .put(
      '/organizations/:slug/memberships/:membershipId',
      {
        schema: {
          tags: ['memberships'],
          summary: 'Update a membership',
          security: [{ bearerAuth: [] }],
          params: z.object({
            slug: z.string(),
            membershipId: z.string().uuid(),
          }),
          body: z.object({
            role: roleSchema,
          }),
          response: {
            204: z.null(),
          },
        },
      },
      async (request, reply) => {
        const userId = await request.getCurrentUserId()
        const { slug, membershipId } = request.params
        const { organization, membership } =
          await request.getUserMembership(slug)

        const { cannot } = getUserPermissions(userId, membership.role)
        if (cannot('update', 'User')) {
          throw new UnauthorizedError(
            "You don't have permission to update this membership.",
          )
        }

        const { role } = request.body
        await prisma.membership.update({
          where: {
            id: membershipId,
            organizationId: organization.id,
          },
          data: {
            role,
          },
        })

        return reply.status(204).send()
      },
    )
}
