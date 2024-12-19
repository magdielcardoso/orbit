import { Server } from 'socket.io'
import { loggerService } from './logger.controller.js'
import { channelStatusService } from '../services/channel-status.service.js'

class InboxController {
  constructor() {
    this.io = null
    this.connectedClients = new Set()
    this.app = null
    this.instanceStatuses = new Map() // Para armazenar status das instâncias
  }

  initialize(server, app) {
    this.app = app

    // Configura Socket.IO para inbox
    this.io = new Server(server, {
      path: '/inbox_status',
      cors: {
        origin: process.env.FRONTEND_URL || 'http://localhost:5173',
        methods: ['GET', 'POST'],
        credentials: true
      }
    })

    // Middleware de autenticação
    this.io.use((socket, next) => {
      const token = socket.handshake.auth.token
      if (!token) {
        return next(new Error('Authentication error'))
      }

      try {
        // Verifica o token usando o JWT do Fastify
        const decoded = app.jwt.verify(token)
        socket.user = decoded
        next()
      } catch (err) {
        next(new Error('Authentication error'))
      }
    })

    // Gerencia conexões
    this.io.on('connection', socket => {
      console.log('Cliente conectado ao inbox:', socket.id)
      this.connectedClients.add(socket)

      // Handler para subscrição em uma inbox específica
      socket.on('subscribe:inbox', async (data) => {
        const { inboxId } = data
        console.log(`Cliente ${socket.id} subscreveu à inbox ${inboxId}`)
        
        // Adiciona socket à sala específica da inbox
        socket.join(`inbox:${inboxId}`)
        
        try {
          // Busca status atual da inbox
          const inbox = await this.getInboxStatus(inboxId)
          
          // Emite status inicial
          socket.emit('inbox:status', {
            inboxId,
            status: inbox.status,
            qrcode: inbox.qrcode
          })

          loggerService.info('Cliente subscrito à inbox', {
            socketId: socket.id,
            inboxId,
            userId: socket.user.id
          })
        } catch (error) {
          loggerService.error('Erro ao buscar status da inbox:', {
            error: error.message,
            inboxId,
            socketId: socket.id
          })
        }
      })

      // Handler para desinscrição
      socket.on('unsubscribe:inbox', (data) => {
        const { inboxId } = data
        socket.leave(`inbox:${inboxId}`)
        console.log(`Cliente ${socket.id} desinscrito da inbox ${inboxId}`)
      })

      // Cleanup na desconexão
      socket.on('disconnect', () => {
        console.log('Cliente desconectado do inbox:', socket.id)
        this.connectedClients.delete(socket)
      })
    })

    loggerService.info('Serviço de Inbox inicializado')
  }

  // Método para atualizar status de uma inbox
  updateInboxStatus(inboxId, status) {
    this.instanceStatuses.set(inboxId, status)
    this.emitInboxStatus(inboxId, status)
  }

  // Método para emitir atualizações de status
  emitInboxStatus(inboxId, status) {
    if (this.io) {
      this.io.to(`inbox:${inboxId}`).emit('inbox:status', {
        inboxId,
        status: status.status,
        qrcode: status.qrcode,
        timestamp: new Date().toISOString()
      })
      
      loggerService.info('Status da inbox atualizado', { 
        inboxId, 
        status: status.status 
      })
    }
  }

  // Método para buscar status atual de uma inbox
  async getInboxStatus(inboxId) {
    try {
      const status = this.instanceStatuses.get(inboxId) || {
        status: 'connecting',
        qrcode: null
      }
      return status
    } catch (error) {
      loggerService.error('Erro ao buscar status da inbox:', {
        error: error.message,
        inboxId
      })
      throw error
    }
  }
}

export const inboxController = new InboxController()
