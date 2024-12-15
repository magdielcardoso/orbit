import mercurius from 'mercurius'
import { typeDefs } from '../models/graphql/schema.js'
import path from 'path'
import { fileURLToPath } from 'url'
import { readdir } from 'fs/promises'

// Emula __dirname no ESM
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export default async function graphqlPlugin(fastify) {
  try {
    fastify.log.info('Registrando plugin GraphQL...')

    const resolversPath = path.join(__dirname, '../routes/graphql')
    const resolverFiles = await readdir(resolversPath)

    // Inicializa o objeto resolvers no formato esperado
    const resolvers = {
      JSON: {},
      Query: {},
      Mutation: {}
    }

    for (const file of resolverFiles) {
      if (file.endsWith('.resolver.js')) {
        const resolverModule = await import(path.join(resolversPath, file))
        const resolverDef = resolverModule.default || resolverModule

        // Agrega diretamente no formato esperado
        for (const [key, resolverObject] of Object.entries(resolverDef.resolvers || resolverDef)) {
          if (key === 'JSON' || key === 'Query' || key === 'Mutation') {
            Object.assign(resolvers[key], resolverObject)
          } else {
            fastify.log.warn(`Tipo desconhecido nos resolvers do arquivo ${file}: ${key}`)
          }
        }
      }
    }

    // Verifica e loga o objeto resolvers antes de registrar o plugin
    fastify.log.error('Resolvers finais:', resolvers)

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
          fastify.log.error('Erro ao verificar token JWT:', err)
        }

        if (!fastify.auth) {
          throw new Error('Controller auth não está registrado')
        }

        return {
          prisma: fastify.prisma,
          auth: fastify.auth,
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
