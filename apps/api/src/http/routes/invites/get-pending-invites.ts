import { roleSchema } from '@nodepad/auth'
import type { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { auth } from '@/http/middlewares/auth'
import { prisma } from '@/lib/prisma'

import { NotFoundError } from '../_errors/not-found-error'

export async function getPendingInvites(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get(
      '/pending-invites',
      {
        schema: {
          tags: ['invites'],
          summary: 'Get all user pending invites',
          response: {
            response: {
              200: z.object({
                invites: z.array(
                  z.object({
                    id: z.string().uuid(),
                    email: z.string().email(),
                    role: roleSchema,
                    createdAt: z.date(),
                    author: z
                      .object({
                        id: z.string().uuid(),
                        name: z.string().nullable(),
                        avatarUrl: z.string().url().nullable(),
                      })
                      .nullable(),
                    organization: z.object({
                      id: z.string().uuid(),
                      name: z.string(),
                    }),
                  }),
                ),
              }),
            },
          },
        },
      },
      async (request) => {
        const userId = await request.getCurrentUserId()

        const user = await prisma.user.findUnique({
          where: {
            id: userId,
          },
        })
        if (!user) {
          throw new NotFoundError('User not found.')
        }

        const invites = await prisma.invite.findMany({
          select: {
            id: true,
            email: true,
            role: true,
            createdAt: true,
            author: {
              select: {
                id: true,
                name: true,
                avatarUrl: true,
              },
            },
            organization: {
              select: {
                id: true,
                name: true,
              },
            },
          },
          where: {
            email: user.email,
          },
        })

        return {
          invites,
        }
      },
    )
}
