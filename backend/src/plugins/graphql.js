import mercurius from 'mercurius'
import { typeDefs } from '../graphql/schema.js'
import { resolvers } from '../graphql/resolvers.js'

export default async function graphqlPlugin(fastify) {
  try {
    fastify.log.info('Registrando plugin GraphQL...')
    
    return fastify.register(mercurius, {
      schema: typeDefs,
      resolvers,
      context: async (request, reply) => {
        let user = null
        try {
          if (request.headers.authorization) {
            const token = request.headers.authorization.replace('Bearer ', '')
            user = await fastify.jwt.verify(token)
          }
        } catch (err) {
          fastify.log.error('Erro ao verificar token:', err)
        }

        if (!fastify.authService) {
          throw new Error('AuthService não está registrado')
        }

        return {
          prisma: fastify.prisma,
          authService: fastify.authService,
          user,
          app: fastify
        }
      },
      graphiql: true
    })
  } catch (error) {
    fastify.log.error('Erro ao registrar plugin GraphQL:', error)
    throw error
  }
} 