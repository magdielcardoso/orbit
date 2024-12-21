import FastifyPlugin from 'fastify-plugin'
import FastifySocketIO from 'fastify-socket.io'
import EvolutionHandler from '../websocket/handlers/evolution.handler.js'

let io

const websocketPlugin = async (fastify) => {
  fastify.register(FastifySocketIO, {
    cors: {
      origin: process.env.FRONTEND_URL,
      credentials: true
    },
    path: '/socket.io',
    transports: ['websocket']
  })

  fastify.after(() => {
    io = fastify.io

    io.on('connection', (socket) => {
      console.log('Cliente WebSocket conectado')
      EvolutionHandler.handleConnection(socket)
    })
  })
}

export const getWebSocketServer = () => {
  if (!io) {
    throw new Error('WebSocket não inicializado')
  }
  return io
}

export default FastifyPlugin(websocketPlugin)