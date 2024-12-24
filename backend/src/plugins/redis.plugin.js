import { createClient } from 'redis'
import '../helpers/loadEnv.helper.js'
import fp from 'fastify-plugin'

export default fp(async function redisPlugin(fastify, options) {
  try {
    // Cliente para operações gerais
    const client = createClient({
      url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`
    })

    // Cliente específico para pub/sub
    const subscriber = createClient({
      url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`
    })

    await Promise.all([
      client.connect(),
      subscriber.connect()
    ])
    
    fastify.decorate('redis', {
      client,
      subscriber
    })
    
    // Desconecta ambos os clientes ao fechar
    fastify.addHook('onClose', async () => {
      await Promise.all([
        client.disconnect(),
        subscriber.disconnect()
      ])
    })

    fastify.log.info('[REDIS] Conectado com sucesso')
  } catch (err) {
    fastify.log.error('[REDIS] Erro ao conectar:', err)
    throw err
  }
})
