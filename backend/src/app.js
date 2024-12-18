import Fastify from 'fastify'
import cors from '@fastify/cors'
import jwt from '@fastify/jwt'
import prismaPlugin from './plugins/prisma.plugin.js'
import loadServices from './plugins/services.plugin.js'
import graphqlPlugin from './plugins/graphql.plugin.js'
import websocketPlugin from './plugins/websocket.plugin.js'
import Auth from './services/auth.service.js'
import { loggerService } from './services/logger.service.js'
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

// Setup do servidor
async function setup() {
  try {
    // Primeiro registra os plugins básicos
    fastify.log.info('[MAIN] Registrando CORS...')
    await fastify.register(cors, {
      origin: [
        'https://orbit.stacklab.digital',
        'https://orbit-api.stacklab.digital',
        process.env.FRONTEND_URL,
        'http://localhost:5173'
      ],
      credentials: true,
      methods: ['GET', 'PUT', 'POST', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
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
    // Inicializa o WebSocket
    await fastify.register(websocketPlugin)

    // Inicializa o logger depois que o Fastify está configurado
    loggerService.initialize(fastify)

    fastify.log.info('[MAIN] Registrando GraphQL e Altair...')
    await graphqlPlugin(fastify);

    // Log de teste
   /* loggerService.log('info', 'Sistema iniciado com sucesso', {
      service: 'app',
      action: 'startup'
    })*/
  } catch (err) {
    fastify.log.error('[MAIN] Erro durante o setup:', err)
    throw err
  }
}

// Inicia o servidor
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

    // Lista todas as rotas registradas
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

start()
