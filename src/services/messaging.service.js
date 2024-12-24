import { io } from 'socket.io-client'

class MessagingService {
  constructor() {
    const wsUrl = import.meta.env.VITE_WS_URL || 'http://localhost:4000'
    
    this.socket = io(wsUrl, {
      transports: ['websocket'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      timeout: 20000,
    })

    this.socket.on('connect', () => {
      console.log('[Socket] Conectado com sucesso')
    })

    this.socket.on('connect_error', (error) => {
      console.error('[Socket] Erro na conexão:', error)
    })
  }

  async subscribeToRecentMessages(callback) {
    // Escuta mensagens do Redis
    this.socket.on('recent_messages', (message) => {
      console.log('[Socket] Mensagem Redis recebida:', message)
      callback(message)
    })

    // Mantém compatibilidade com WebSocket
    this.socket.on('whatsapp:message', (message) => {
      console.log('[Socket] Mensagem WebSocket recebida:', message)
      callback(message)
    })
  }

  async unsubscribeFromRecentMessages() {
    this.socket.off('recent_messages')
    this.socket.off('whatsapp:message')
  }
}

export default new MessagingService() 