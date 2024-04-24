import { TokenType } from '@prisma/client'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'

import { prisma } from '@/lib/prisma'

export async function requestPasswordRecover(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/password/recover',
    {
      schema: {
        tags: ['auth'],
        summary: 'Request password recover',
        body: z.object({
          email: z.string().email(),
        }),
        response: {
          201: z.null(),
        },
      },
    },
    async (request, reply) => {
      const { email } = request.body

      const userFromEmail = await prisma.user.findUnique({
        where: {
          email,
        },
      })

      if (!userFromEmail) {
        // We don't want people to know that the user doesn't exist
        return reply.status(201).send()
      }

      const { id } = await prisma.token.create({
        data: {
          type: TokenType.PASSWORD_RECOVER,
          userId: userFromEmail.id,
        },
      })

      // TODO: Send email with password recover link
      console.log(`Password recover link: ${id}`)

      return reply.status(201).send()
    },
  )
}
