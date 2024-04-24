import fastifyCors from '@fastify/cors'
import fastifyJWT from '@fastify/jwt'
import fastifySwagger from '@fastify/swagger'
import fastifySwaggerUI from '@fastify/swagger-ui'
import { fastify } from 'fastify'
import {
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
  ZodTypeProvider,
} from 'fastify-type-provider-zod'

import { authenticateWithPassword } from './routes/auth/authenticate-with-password'
import { createAccount } from './routes/auth/create-account'

const app = fastify().withTypeProvider<ZodTypeProvider>()

app.setSerializerCompiler(serializerCompiler)
app.setValidatorCompiler(validatorCompiler)

app.register(fastifySwagger, {
  openapi: {
    info: {
      title: 'Nodepad API',
      description:
        'Revolutionize your coding experience with Nodepad - the all-in-one platform for creating, executing, and sharing Node.js code snippets.',
      version: '1.0.0',
    },
    servers: [],
  },
  transform: jsonSchemaTransform,
})
app.register(fastifySwaggerUI, {
  routePrefix: '/docs',
})
app.register(fastifyJWT, {
  secret: 'my-jwt-secret',
})
app.register(fastifyCors)

app.register(createAccount)
app.register(authenticateWithPassword)

app.listen({ port: 3333 }).then(() => {
  console.log('HTTP server running!')
})
