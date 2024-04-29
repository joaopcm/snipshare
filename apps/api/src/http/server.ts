import fastifyCompress from '@fastify/compress'
import fastifyCors from '@fastify/cors'
import fastifyCSRFProtection from '@fastify/csrf-protection'
import fastifyHelmet from '@fastify/helmet'
import fastifyJWT from '@fastify/jwt'
import fastifyRateLimit from '@fastify/rate-limit'
import fastifySwagger from '@fastify/swagger'
import fastifySwaggerUI from '@fastify/swagger-ui'
import GracefulServer from '@gquittet/graceful-server'
import * as Sentry from '@sentry/node'
import { env } from '@snipshare/env'
import { fastify } from 'fastify'
import {
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
  ZodTypeProvider,
} from 'fastify-type-provider-zod'

import { errorHandler } from './error-handler'
import { reqId } from './middlewares/req-id'
import { authenticateWithGitHub } from './routes/auth/authenticate-with-github'
import { authenticateWithPassword } from './routes/auth/authenticate-with-password'
import { createAccount } from './routes/auth/create-account'
import { getProfile } from './routes/auth/get-profile'
import { requestPasswordRecover } from './routes/auth/request-password-recover'
import { resetPassword } from './routes/auth/reset-password'
import { getOrganizationBilling } from './routes/billing/get-organization-billing'
import { acceptInvite } from './routes/invites/accept-invite'
import { createInvite } from './routes/invites/create-invite'
import { getInvite } from './routes/invites/get-invite'
import { getInvites } from './routes/invites/get-invites'
import { getPendingInvites } from './routes/invites/get-pending-invites'
import { rejectInvite } from './routes/invites/reject-invite'
import { revokeInvite } from './routes/invites/revoke-invite'
import { deleteMembership } from './routes/memberships/delete-membership'
import { getMemberships } from './routes/memberships/get-memberships'
import { updateMembership } from './routes/memberships/update-membership'
import { createOrganization } from './routes/orgs/create-organization'
import { getMembership } from './routes/orgs/get-membership'
import { getOrganization } from './routes/orgs/get-organization'
import { getOrganizations } from './routes/orgs/get-organizations'
import { shutdownOrganization } from './routes/orgs/shutdown-organization'
import { transferOrganization } from './routes/orgs/transfer-organization'
import { updateOrganization } from './routes/orgs/update-organization'
import { createProject } from './routes/projects/create-project'
import { deleteProject } from './routes/projects/delete-project'
import { getProject } from './routes/projects/get-project'
import { getProjects } from './routes/projects/get-projects'
import { updateProject } from './routes/projects/update-project'

Sentry.init({
  dsn: 'https://3eb9c06d9dbe01bde2147de8bf9dd3ff@o4507148608471040.ingest.us.sentry.io/4507148610437120',
  tracesSampleRate: 1.0,
})
const app = fastify({
  logger: true,
}).withTypeProvider<ZodTypeProvider>()
Sentry.setupFastifyErrorHandler(app)

const gracefulServer = GracefulServer(app.server)
gracefulServer.on(GracefulServer.READY, () => {
  console.log('Server is ready')
})
gracefulServer.on(GracefulServer.SHUTTING_DOWN, () => {
  console.warn('Server is shutting down...')
})
gracefulServer.on(GracefulServer.SHUTDOWN, (error) => {
  console.warn('Server is down because of', error.message)
})

app.setSerializerCompiler(serializerCompiler)
app.setValidatorCompiler(validatorCompiler)
app.setErrorHandler(errorHandler)

app.register(fastifyHelmet)
app.register(fastifyCSRFProtection)
app.register(fastifyRateLimit, {
  max: 100,
  timeWindow: '1 minute',
})
app.register(reqId)
app.register(fastifyCompress)
app.register(fastifySwagger, {
  openapi: {
    info: {
      title: 'SnipShare API',
      description:
        'Revolutionize your coding experience with SnipShare - the all-in-one platform for creating, executing, and sharing Node.js code snippets.',
      version: '1.0.0',
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  transform: jsonSchemaTransform,
})
app.register(fastifySwaggerUI, {
  routePrefix: '/docs',
})
app.register(fastifyJWT, {
  secret: env.JWT_SECRET,
})
app.register(fastifyCors)

app.register(createAccount)
app.register(authenticateWithPassword)
app.register(getProfile)
app.register(requestPasswordRecover)
app.register(resetPassword)
app.register(authenticateWithGitHub)
app.register(createOrganization)
app.register(getMembership)
app.register(getOrganizations)
app.register(getOrganization)
app.register(updateOrganization)
app.register(shutdownOrganization)
app.register(transferOrganization)
app.register(createProject)
app.register(deleteProject)
app.register(getProject)
app.register(getProjects)
app.register(updateProject)
app.register(getMemberships)
app.register(updateMembership)
app.register(deleteMembership)
app.register(createInvite)
app.register(getInvite)
app.register(getInvites)
app.register(acceptInvite)
app.register(rejectInvite)
app.register(revokeInvite)
app.register(getPendingInvites)
app.register(getOrganizationBilling)

const start = async () => {
  try {
    await app.listen({ port: env.SERVER_PORT })
    app.log.info(`Server listening on ${env.SERVER_PORT}`)
    gracefulServer.setReady()
  } catch (error) {
    app.log.error(error)
    process.exit(1)
  }
}

start()
