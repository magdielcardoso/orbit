import { getWebSocketServer } from '../../plugins/websocket.plugin.js'

export default class EvolutionHandler {
  static async handleWebhook(req, reply) {
    try {
      console.log('Webhook recebido:', {
        event: req.body.event,
        instance: req.body.instance,
        state: req.body.data.state
      })

      const io = getWebSocketServer()
      const { body } = req

      if (body.event === 'connection.update') {
        const stateMap = {
          'close': 'disconnected',
          'connecting': 'connecting',
          'open': 'connected'
        }

        const mappedState = stateMap[body.data.state] || body.data.state

        console.log('Emitindo evento connection.update:', {
          instance: body.instance,
          state: mappedState,
          originalState: body.data.state
        })

        io.emit('whatsapp:connection', {
          instance: body.instance,
          state: mappedState,
          statusReason: body.data.statusReason
        })
      }

      return reply.code(200).send({ status: 'OK' })
    } catch (error) {
      console.error('Erro no webhook Evolution:', error)
      return reply.code(500).send({ error: error.message })
    }
  }

  static handleConnection(socket) {
    console.log('Cliente conectado ao socket')
    
    socket.on('whatsapp:join', (data) => {
      console.log('Cliente solicitou join:', data)
      const { inboxId } = data
      socket.join(`whatsapp:${inboxId}`)
    })
  }
} 