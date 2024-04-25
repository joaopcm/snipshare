import { TokenType } from '@prisma/client'
import { EMAILS } from '@snipshare/constants'
import { env } from '@snipshare/env'
import { PasswordRecoverEmail } from '@snipshare/transactional'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'

import { prisma } from '@/lib/prisma'
import { resend } from '@/lib/resend'

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

      const { error } = await resend.emails.send({
        from: `SnipShare <${EMAILS.support}>`,
        reply_to: EMAILS.support,
        to: [email],
        subject: 'Reset your SnipShare password',
        react: PasswordRecoverEmail({
          name: userFromEmail.name,
          link: `${env.CLIENT_URL}/password/recover/${id}`,
        }),
      })

      if (error) {
        console.error(error)
      }

      return reply.status(201).send()
    },
  )
}
