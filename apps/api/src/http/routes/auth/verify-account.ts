import { TokenType } from '@prisma/client'
import { env } from '@snipshare/env'
import type { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { prisma } from '@/lib/prisma'

import { NotFoundError } from '../_errors/not-found-error'

export async function verifyAccount(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    '/users/verify/:token',
    {
      schema: {
        tags: ['auth'],
        summary: 'Verify a user account',
        params: z.object({
          token: z.string(),
        }),
        response: {
          302: z.null(),
        },
      },
    },
    async (request, reply) => {
      const { token } = request.params

      const tokenFromCode = await prisma.token.findUnique({
        where: {
          id: token,
          type: TokenType.ACCOUNT_VERIFICATION,
        },
        include: {
          user: true,
        },
      })
      if (!tokenFromCode) {
        throw new NotFoundError('Token not found.')
      }

      await prisma.$transaction([
        prisma.user.update({
          where: {
            id: tokenFromCode.userId,
          },
          data: {
            verified: true,
          },
        }),
        prisma.token.delete({ where: { id: token } }),
      ])

      return reply.redirect(env.CLIENT_URL)
    },
  )
}
