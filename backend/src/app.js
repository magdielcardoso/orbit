import Fastify from 'fastify'
import cors from '@fastify/cors'
import jwt from '@fastify/jwt'
import sensible from '@fastify/sensible'
import { PrismaClient } from '@prisma/client'
import graphqlPlugin from './plugins/graphql.js'
import AuthService from './services/auth.service.js'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

// Configura o path para o arquivo .env na raiz do projeto
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
dotenv.config({ path: path.join(__dirname, '../..', '.env') })

const fastify = Fastify({
  logger: {
    transport: {
      target: 'pino-pretty'
    }
  }
})

// Setup do servidor
async function setup() {
  try {
    fastify.log.info('Registrando CORS...')
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

    fastify.log.info('Registrando JWT...')
    await fastify.register(jwt, {
      secret: process.env.JWT_SECRET
    })

    fastify.log.info('Registrando serviços...')
    const prisma = new PrismaClient()
    const authService = new AuthService(prisma)

    fastify.decorate('prisma', prisma)
    fastify.decorate('authService', authService)

    fastify.log.info('Registrando GraphQL...')
    await fastify.register(graphqlPlugin)

  } catch (err) {
    fastify.log.error('Erro durante o setup:', err)
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
    fastify.log.info(`Servidor rodando em ${baseUrl}`)
    fastify.log.info(`GraphQL endpoint: ${baseUrl}/graphql`)
    fastify.log.info(`GraphiQL interface: ${baseUrl}/graphql`)
    
    // Lista todas as rotas registradas
    fastify.log.info('Rotas disponíveis:')
    fastify.printRoutes()
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}

fastify.get('/', async (request, reply) => {
  return { 
    status: 'ok',
    version: process.env.APP_VERSION || '1.0.0'
  }
})

start()