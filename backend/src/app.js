import Fastify from 'fastify'
import cors from '@fastify/cors'
import jwt from '@fastify/jwt'
import prismaPlugin from './plugins/prisma.plugin.js'
import loadServices from './plugins/services.plugin.js'
import graphqlPlugin from './plugins/graphql.plugin.js'
import websocketPlugin from './plugins/websocket.plugin.js'
import Auth from './services/auth.service.js'
import { loggerService } from './services/logger.service.js'
import EvolutionHandler from './websocket/handlers/evolution.handler.js'

const envToLogger = {
  development: {
    transport: {
      target: 'pino-pretty',
      options: {
        translateTime: 'HH:MM:ss Z',
        ignore: 'pid,hostname',
      },
    },
  },
  production: true,
  test: false,
}

const fastify = Fastify({
  logger: envToLogger[process.env.NODE_ENV] ?? true
})

async function registerPlugins() {
  fastify.log.info('[MAIN] Registrando CORS...')
  await fastify.register(cors, {
    origin: [
      'https://orbit.stacklab.digital',
      'https://orbit-api.stacklab.digital',
      'https://evo.stacklab.digital',
      process.env.FRONTEND_URL,
      'http://localhost:5173'
    ],
    credentials: true,
    methods: ['GET', 'PUT', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'apikey'],
    exposedHeaders: ['Content-Range', 'X-Content-Range']
  })


  fastify.log.info('[MAIN] Registrando JWT...')
  await fastify.register(jwt, {
    secret: process.env.JWT_SECRET
  })

  fastify.log.info('[MAIN] Registrando controladores...')
  await loadServices(fastify)
  await fastify.register(prismaPlugin)
  const auth = new Auth(fastify.prisma)
  fastify.decorate('auth', auth)

  await fastify.register(websocketPlugin)
  loggerService.initialize(fastify)

  fastify.log.info('[MAIN] Registrando GraphQL e Altair...')
  await graphqlPlugin(fastify);
}

async function setup() {
  try {
    await registerPlugins()
  } catch (err) {
    fastify.log.error('[MAIN] Erro durante o setup:', err)
    throw err
  }
}

const start = async () => {
  try {
    await setup()
    const port = process.env.PORT || 4000
    await fastify.listen({
      port,
      host: '0.0.0.0'
    })

    const baseUrl = `http://localhost:${port}`
    fastify.log.info(`[MAIN] Servidor rodando em ${baseUrl}`)
    fastify.log.info(`[MAIN] GraphQL endpoint: ${baseUrl}/graphql`)
    fastify.log.info(`[MAIN] GraphiQL interface: ${baseUrl}/altair`)

    fastify.log.info('[MAIN] Rotas disponíveis:')
    fastify.printRoutes()
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}

fastify.get('/', async () => {
  return {
    status: 'ok',
    version: process.env.APP_VERSION || '0.1.0'
  }
})


  // Rota principal do webhook
  fastify.post('/webhook/evolution', {
    schema: {
      body: {
        type: 'object',
        required: ['event', 'instance', 'data'],
        properties: {
          event: { type: 'string' },
          instance: { type: 'string' },
          data: { type: 'object' }
        }
      }
    },
    handler: async (request, reply) => {
      fastify.log.info('Webhook Evolution recebido:', request.body)
      return await EvolutionHandler.handleWebhook(request, reply)
    }
  })

start()
