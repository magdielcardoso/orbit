import { io } from 'socket.io-client'
import { useAuthStore } from '@/stores/auth.store'

class WebSocketService {
  constructor() {
    this.socket = null
    this.authStore = useAuthStore()
    this.listeners = new Map()
  }

  connect() {
    if (this.socket?.connected) return

    this.socket = io(import.meta.env.VITE_WS_URL, {
      auth: {
        token: this.authStore.token
      },
      transports: ['websocket'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5
    })

    this.setupListeners()
  }

  setupListeners() {
    this.socket.on('connect', () => {
      console.log('WebSocket conectado')
      this.joinUserRooms()
    })

    this.socket.on('disconnect', () => {
      console.log('WebSocket desconectado')
    })

    this.socket.on('error', (error) => {
      console.error('Erro no WebSocket:', error)
    })
  }

  joinUserRooms() {
    if (this.authStore.currentOrganization?.id) {
      this.socket.emit('join:organization', this.authStore.currentOrganization.id)
    }
    
    if (this.authStore.user?.id) {
      this.socket.emit('join:user', this.authStore.user.id)
    }
  }

  // Métodos para gerenciar eventos
  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set())
    }
    this.listeners.get(event).add(callback)
    this.socket?.on(event, callback)
  }

  off(event, callback) {
    const callbacks = this.listeners.get(event)
    if (callbacks) {
      callbacks.delete(callback)
      this.socket?.off(event, callback)
    }
  }

  emit(event, data) {
    this.socket?.emit(event, data)
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect()
      this.socket = null
    }
  }
}

export default new WebSocketService() 