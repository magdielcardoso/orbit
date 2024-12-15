export default async function authRoutes(fastify) {
  fastify.post('/auth/register', async (request, reply) => {
    try {
      const result = await fastify.auth.register(request.body)
      return result
    } catch (error) {
      reply.status(400).send({
        error: 'Registration Error',
        message: error.message
      })
    }
  })

  fastify.post('/auth/login', async (request, reply) => {
    try {
      const result = await fastify.auth.login(request.body)
      return result
    } catch (error) {
      reply.status(401).send({
        error: 'Authentication Error',
        message: error.message
      })
    }
  })
}
