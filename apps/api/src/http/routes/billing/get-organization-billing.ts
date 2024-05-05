import { Role } from '@prisma/client'
import type { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { auth } from '@/http/middlewares/auth'
import { prisma } from '@/lib/prisma'
import { getUserPermissions } from '@/utils/get-user-permissions'

import { UnauthorizedError } from '../_errors/unauthorized-error'

export async function getOrganizationBilling(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get(
      '/organizations/:slug/billing',
      {
        schema: {
          tags: ['billing'],
          summary: 'Get billing details of an organization',
          security: [{ bearerAuth: [] }],
          params: z.object({
            slug: z.string(),
          }),
          response: {
            200: z.object({
              billing: z.object({
                seats: z.object({
                  amount: z.number(),
                  unit: z.number(),
                  price: z.number(),
                }),
                projects: z.object({
                  amount: z.number(),
                  unit: z.number(),
                  price: z.number(),
                }),
                total: z.number(),
              }),
            }),
          },
        },
      },
      async (request) => {
        const { slug } = request.params
        const userId = await request.getCurrentUserId()
        const { organization, membership } =
          await request.getUserMembership(slug)

        const { cannot } = getUserPermissions(userId, membership.role)
        if (cannot('get', 'Billing')) {
          throw new UnauthorizedError(
            "You don't have permission to get billing details.",
          )
        }

        const [membershipsCount, projectsCount] = await Promise.all([
          prisma.membership.count({
            where: {
              organizationId: organization.id,
              role: {
                not: Role.BILLING,
              },
            },
          }),

          prisma.project.count({
            where: {
              organizationId: organization.id,
            },
          }),
        ])

        // TODO: Define real billing logic and prices
        return {
          billing: {
            seats: {
              amount: membershipsCount,
              unit: 10,
              price: membershipsCount * 10,
            },
            projects: {
              amount: projectsCount,
              unit: 20,
              price: projectsCount * 20,
            },
            total: membershipsCount * 10 + projectsCount * 20,
          },
        }
      },
    )
}
