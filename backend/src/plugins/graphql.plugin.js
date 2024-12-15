import mercurius from 'mercurius';
import { typeDefs } from '../graphql/schema.js';
import { resolvers } from '../graphql/resolvers.js';

export default async function graphqlPlugin(fastify) {
  try {
    fastify.log.info('Registrando plugin GraphQL...');

    return fastify.register(mercurius, {
      schema: typeDefs,
      resolvers,
      context: async (request, reply) => {
        let user = null;
        try {
          if (request.headers.authorization) {
            const token = request.headers.authorization.replace('Bearer ', '');
            user = await fastify.jwt.verify(token);
          } else {
            fastify.log.warn('Token JWT não encontrado no cabeçalho.');
          }
        } catch (err) {
          fastify.log.error('Erro ao verificar token JWT:', err);
        }

        if (!fastify.auth) {
          throw new Error('Controller auth não está registrado');
        }

        return {
          prisma: fastify.prisma,
          auth: fastify.auth,
          user,
          app: fastify,
        };
      },
      graphiql: true,
    });
  } catch (error) {
    fastify.log.error('Erro ao registrar plugin GraphQL:', error);
    throw error;
  }
}
