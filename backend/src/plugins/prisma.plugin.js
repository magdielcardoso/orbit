// plugins/prisma.plugin.js
import fp from 'fastify-plugin'
import { PrismaClient } from '@prisma/client'
import '../helpers/loadEnv.helper.js'

export default fp(async fastify => {
  fastify.decorate('prisma', prismaInstance)

  fastify.addHook('onClose', async instance => {
    await instance.prisma.$disconnect()
  })

  fastify.addHook('preHandler', async request => {
    request.prisma = prismaInstance
  })
})

const {
  NODE_ENV,
  DB_HOST = 'localhost',
  DB_USERNAME = 'orbitchat',
  DB_PASSWORD = 'orbitchat',
  DB_PORT = '5432',
  DB_SCHEMA = 'public'
} = process.env

const isProduction = NODE_ENV === 'production'

const databaseName = isProduction ? 'orbitchat' : 'orbitchat_dev'
const databaseUrl = `postgresql://${DB_USERNAME}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${databaseName}?schema=${DB_SCHEMA}`

// Cria a instância única do Prisma Client
export const prismaInstance = new PrismaClient({
  datasources: {
    db: {
      url: databaseUrl
    }
  }
})
