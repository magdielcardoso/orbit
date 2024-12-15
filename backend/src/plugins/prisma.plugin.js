// plugins/prisma.plugin.js
import fp from 'fastify-plugin';
import prisma from '../helpers/prisma.helper.js';

export default fp(async (fastify) => {
    fastify.decorate('prisma', prisma);
  
    // Hook para desconectar ao fechar a aplicação
    fastify.addHook('onClose', async (instance) => {
      await instance.prisma.$disconnect();
    });
  
    // Adicionar o Prisma ao contexto HTTP
    fastify.addHook('preHandler', async (request, reply) => {
      request.prisma = prisma;
    });
});
