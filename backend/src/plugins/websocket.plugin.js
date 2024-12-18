import FastifyPlugin from 'fastify-plugin'
import FastifySocketIO from 'fastify-socket.io'

let io

const websocketPlugin = async (fastify) => {
  fastify.register(FastifySocketIO, {
    cors: {
      origin: process.env.FRONTEND_URL,
      credentials: true
    },
    path: '/socket'
  })

  fastify.after(() => {
    io = fastify.io
  })
}

export const getWebSocketServer = () => {
  if (!io) {
    throw new Error('WebSocket não inicializado. Chame initializeWebSocket primeiro.')
  }
  return io
}

export default FastifyPlugin(websocketPlugin)