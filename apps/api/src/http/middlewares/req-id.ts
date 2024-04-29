import type { FastifyInstance } from 'fastify'
import { fastifyPlugin } from 'fastify-plugin'

import { newId } from '@/utils/new-id'

export const reqId = fastifyPlugin(async (app: FastifyInstance) => {
  app.decorateRequest('reqId', '')
  app.decorateRequest('sesId', '')
  app.decorateRequest('ids', null)

  app.addHook('onRequest', (request, _reply, next) => {
    request.reqId =
      request.headers['x-request-id']?.toString() || newId('request')
    request.sesId =
      request.headers['x-session-id']?.toString() || newId('session')
    request.ids = {
      reqId: request.reqId,
      sesId: request.sesId,
    }

    next()
  })

  app.addHook('onSend', (request, reply, _payload, next) => {
    reply.header('x-request-id', request.reqId)
    reply.header('x-session-id', request.sesId)
    next()
  })
})
