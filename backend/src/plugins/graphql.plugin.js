import mercurius from 'mercurius'
import path from 'path'
import { fileURLToPath } from 'url'
import { readdir, readFile } from 'fs/promises'
import { makeExecutableSchema } from '@graphql-tools/schema'
import gql from 'graphql-tag'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export default async function graphqlPlugin(fastify) {
  fastify.log.info('[GraphQL] Iniciando...')
  try {
    return fastify.register(mercurius, {
      schema: makeExecutableSchema({
        typeDefs: await loadSchemas(fastify),
        resolvers: await loadResolvers(fastify)
      }),
      context: async request => {
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
    fastify.log.error('[Graphql] Erro ao carregar plugin GraphQL:', error)
    throw error
  }
}

async function loadResolvers(fastify) {
  try {
    const resolversPath = path.join(__dirname, '../routes/graphql')
    const resolverFiles = await readdir(resolversPath)

    const resolvers = {
      JSON: {},
      Query: {},
      Mutation: {}
    }

    for (const file of resolverFiles) {
      if (file.endsWith('.resolver.js')) {
        const resolverModule = await import(path.join(resolversPath, file))
        const resolverDef = resolverModule.default || resolverModule

        for (const [key, resolverObject] of Object.entries(resolverDef.resolvers || resolverDef)) {
          if (key === 'JSON' || key === 'Query' || key === 'Mutation') {
            Object.assign(resolvers[key], resolverObject)
          } else {
            fastify.log.warn(`[Graphql] Tipo desconhecido nos resolvers do arquivo ${file}: ${key}`)
          }
        }
        fastify.log.info(`[Graphql] Resolver ${file} carregado...`)
      }
    }
    return resolvers
  } catch (error) {
    fastify.log.error('[Graphql] Erro ao carregar os resolvers:', error)
    throw error
  }
}

async function loadSchemas(fastify) {
  try {
    const schemaPath = path.join(__dirname, '../models/graphql')
    const schemaFiles = await readdir(schemaPath)
    const typeDefs = []

    for (const file of schemaFiles) {
      if (file.endsWith('.graphql')) {
        const schemaContent = await readFile(path.join(schemaPath, file), 'utf-8')
        typeDefs.push(gql(schemaContent))
        fastify.log.info(`[Graphql] Schema ${file} carregado...`)
      }
    }

    return typeDefs
  } catch (error) {
    fastify.log.error('[Graphql] Erro ao carregar os Schemas:', error)
    throw error
  }
}
