import { roleSchema } from '@snipshare/auth'
import type { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { auth } from '@/http/middlewares/auth'
import { prisma } from '@/lib/prisma'

export async function getOrganizations(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get(
      '/organizations',
      {
        schema: {
          tags: ['organizations'],
          summary: 'Get organizations to which the user belongs',
          security: [{ bearerAuth: [] }],
          response: {
            200: z.object({
              organizations: z.array(
                z.object({
                  id: z.string(),
                  name: z.string(),
                  slug: z.string(),
                  avatarUrl: z.string().url().nullable(),
                  role: roleSchema,
                }),
              ),
            }),
          },
        },
      },
      async (request) => {
        const userId = await request.getCurrentUserId()

        const organizations = await prisma.organization.findMany({
          select: {
            id: true,
            name: true,
            slug: true,
            avatarUrl: true,
            memberships: {
              select: {
                role: true,
              },
              where: {
                userId,
              },
            },
          },
          where: {
            memberships: {
              some: {
                userId,
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
        })

        const organizationsWithUserRole = organizations.map(
          ({ memberships, ...organization }) => ({
            ...organization,
            role: memberships[0].role,
          }),
        )

        return { organizations: organizationsWithUserRole }
      },
    )
}
