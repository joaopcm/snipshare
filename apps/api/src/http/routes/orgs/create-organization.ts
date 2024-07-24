import { Role } from '@prisma/client'
import type { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { auth } from '@/http/middlewares/auth'
import { prisma } from '@/lib/prisma'
import { createUniqueSlug } from '@/utils/create-unique-slug'
import { newId } from '@/utils/new-id'

import { BadRequestError } from '../_errors/bad-request-error'

export async function createOrganization(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .post(
      '/organizations',
      {
        schema: {
          tags: ['organizations'],
          summary: 'Create an organization',
          security: [{ bearerAuth: [] }],
          body: z.object({
            name: z.string(),
            domain: z.string().nullish(),
            shouldAttachUsersByDomain: z.boolean().optional(),
          }),
          response: {
            201: z.object({
              organizationId: z.string(),
            }),
          },
        },
      },
      async (request, reply) => {
        const userId = await request.getCurrentUserId()
        const { name, domain, shouldAttachUsersByDomain } = request.body

        if (domain) {
          const organizationByDomain = await prisma.organization.findUnique({
            where: {
              domain,
            },
          })

          if (organizationByDomain) {
            throw new BadRequestError(
              'Organization with same domain already exists.',
            )
          }
        }

        const organization = await prisma.organization.create({
          data: {
            id: newId('organization'),
            name,
            slug: await createUniqueSlug(
              name,
              async (slug: string) =>
                !!(await prisma.organization.findUnique({ where: { slug } })),
            ),
            domain: domain || null,
            shouldAttachUsersByDomain,
            ownerId: userId,
            memberships: {
              create: {
                userId,
                role: Role.ADMIN,
              },
            },
          },
        })

        return reply.status(201).send({
          organizationId: organization.id,
        })
      },
    )
}
