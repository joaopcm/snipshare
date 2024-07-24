import { roleSchema } from '@snipshare/auth'
import { EMAILS } from '@snipshare/constants'
import { env } from '@snipshare/env'
import { InviteEmail } from '@snipshare/transactional'
import type { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { auth } from '@/http/middlewares/auth'
import { prisma } from '@/lib/prisma'
import { resend } from '@/lib/resend'
import { getUserPermissions } from '@/utils/get-user-permissions'
import { newId } from '@/utils/new-id'

import { BadRequestError } from '../_errors/bad-request-error'
import { UnauthorizedError } from '../_errors/unauthorized-error'

export async function createInvite(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .post(
      '/organizations/:slug/invites',
      {
        schema: {
          tags: ['invites'],
          summary: 'Create an invite',
          security: [{ bearerAuth: [] }],
          body: z.object({
            email: z.string().email(),
            role: roleSchema,
          }),
          params: z.object({
            slug: z.string(),
          }),
          response: {
            201: z.object({
              inviteId: z.string(),
            }),
          },
        },
      },
      async (request, reply) => {
        const userId = await request.getCurrentUserId()
        const { slug } = request.params
        const { organization, membership } =
          await request.getUserMembership(slug)

        const { cannot } = getUserPermissions(userId, membership.role)
        if (cannot('create', 'Invite')) {
          throw new UnauthorizedError(
            "You don't have permission to create an invite.",
          )
        }

        const { email, role } = request.body

        const inviteWithSameEmail = await prisma.invite.findUnique({
          where: {
            email_organizationId: {
              email,
              organizationId: organization.id,
            },
          },
        })
        if (inviteWithSameEmail) {
          throw new BadRequestError(
            'Another invite with this email already exists.',
          )
        }

        const memberWithSameEmail = await prisma.membership.findFirst({
          where: {
            organizationId: organization.id,
            user: {
              email,
            },
          },
        })
        if (memberWithSameEmail) {
          throw new BadRequestError(
            'Another member with this email already belongs to this organization.',
          )
        }

        const author = await prisma.user.findUnique({
          where: {
            id: userId,
          },
        })
        if (!author) {
          throw new Error('Author user not found.')
        }
        if (!author.name) {
          throw new Error(
            "Author doesn't have a name to display in the invitation email.",
          )
        }

        const invite = await prisma.invite.create({
          data: {
            id: newId('invite'),
            organizationId: organization.id,
            email,
            role,
            authorId: userId,
          },
        })

        const { error } = await resend.emails.send({
          from: `Snipshare <${EMAILS.support}>`,
          reply_to: EMAILS.support,
          to: [email],
          subject:
            'You just got an invite to join an organization on Snipshare!',
          react: InviteEmail({
            invitee: {
              email,
            },
            author: {
              name: author.name,
              email: author.email,
            },
            organization: {
              name: organization.name,
              avatarUrl: organization.avatarUrl,
            },
            invite: {
              link: `${env.CLIENT_URL}/invite/${invite.id}`,
            },
          }),
        })
        if (error) {
          app.log.error(error)
        }

        return reply.status(201).send({
          inviteId: invite.id,
        })
      },
    )
}
