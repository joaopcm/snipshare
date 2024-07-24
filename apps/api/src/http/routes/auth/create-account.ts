import { TokenType } from '@prisma/client'
import { EMAILS } from '@snipshare/constants'
import { env } from '@snipshare/env'
import { VerifyAccountEmail } from '@snipshare/transactional'
import { hash } from 'bcryptjs'
import type { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { ErrorResponse } from 'resend'
import { z } from 'zod'

import { prisma } from '@/lib/prisma'
import { resend } from '@/lib/resend'
import { newId } from '@/utils/new-id'

import { BadRequestError } from '../_errors/bad-request-error'

export async function sendAccountVerificationEmail(
  userId: string,
  email: string,
  name: string,
  onError: (error: ErrorResponse) => void,
) {
  const [, token] = await prisma.$transaction([
    prisma.token.deleteMany({
      where: { userId, type: TokenType.ACCOUNT_VERIFICATION },
    }),
    prisma.token.create({
      data: {
        id: newId('token'),
        type: TokenType.ACCOUNT_VERIFICATION,
        userId,
      },
    }),
  ])

  const { error } = await resend.emails.send({
    from: `Snipshare <${EMAILS.support}>`,
    reply_to: EMAILS.support,
    to: [email],
    subject: 'Verify your Snipshare account',
    react: VerifyAccountEmail({
      name,
      link: `${env.NEXT_PUBLIC_API_URL}/users/verify/${token.id}`,
    }),
  })
  if (error) {
    onError(error)
  }
}

export async function createAccount(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/users',
    {
      schema: {
        tags: ['auth'],
        summary: 'Create a new user account',
        body: z.object({
          name: z.string(),
          email: z.string().email(),
          password: z.string().min(6),
        }),
        response: {
          201: z.null(),
        },
      },
    },
    async (request, reply) => {
      const { name, email, password } = request.body

      const userWithSameEmail = await prisma.user.findUnique({
        where: {
          email,
        },
      })
      if (userWithSameEmail) {
        throw new BadRequestError('User with same email already exists.')
      }

      const [, domain] = email.split('@')
      const autoJoinOrganization = await prisma.organization.findFirst({
        where: {
          domain,
          shouldAttachUsersByDomain: true,
        },
      })

      const newUser = await prisma.user.create({
        data: {
          id: newId('user'),
          name,
          email,
          passwordHash: await hash(password, 6),
          memberships: autoJoinOrganization
            ? {
                create: {
                  organizationId: autoJoinOrganization.id,
                },
              }
            : undefined,
        },
      })

      await sendAccountVerificationEmail(newUser.id, email, name, (error) => {
        app.log.error(error)
      })

      return reply.status(201).send()
    },
  )
}
