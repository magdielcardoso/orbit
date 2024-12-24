import { getWebSocketServer } from '../../plugins/websocket.plugin.js'
import MessagingService from '../../services/redis/messaging.service.js'

export default class EvolutionHandler {
  static async handleWebhook(req, reply) {
    try {
      const io = getWebSocketServer()
      const { body } = req
      const messagingService = new MessagingService(req.server)

      if (body.event === 'messages.upsert') {
        console.log('[Evolution] Nova mensagem recebida:', {
          instance: body.instance,
          messageId: body.data?.key?.id,
          remoteJid: body.data?.key?.remoteJid
        })

        // Envia para o Redis e WebSocket
        await messagingService.queueWhatsAppMessage({
          instance: body.instance,
          data: body.data,
          event: body.event
        })

        // Emite via WebSocket também para compatibilidade
        io.emit('whatsapp:message', {
          instance: body.instance,
          data: body
        })

        console.log('[Evolution] Mensagem processada e enviada')
      }

      return reply.code(200).send({ status: 'OK' })
    } catch (error) {
      console.error('[Evolution] Erro no webhook:', error)
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