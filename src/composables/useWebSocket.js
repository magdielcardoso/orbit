import { io } from 'socket.io-client'
import { useAuthStore } from '@/stores/auth.store'

export function useWebSocket(namespace = '') {
  // Pega a URL base do WebSocket do env
  const wsUrl = import.meta.env.VITE_WS_URL || 'wss://api.orbitchat.io'
  
  // Remove trailing slash se existir
  const baseUrl = wsUrl.endsWith('/') ? wsUrl.slice(0, -1) : wsUrl
  
  // Constrói a URL completa
  const socketUrl = `${baseUrl}${namespace}`

  console.log('Conectando WebSocket:', socketUrl) // Debug

  const socket = io(socketUrl, {
    auth: {
      token: useAuthStore().token
    },
    transports: ['websocket'],
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    reconnectionAttempts: 5
  })

  const onMessage = (callback) => {
    socket.on('message', callback)
  }

  const onEvent = (event, callback) => {
    socket.on(event, callback)
  }

  const send = (event, data) => {
    socket.emit(event, data)
  }

  const close = () => {
    socket.disconnect()
  }

  return {
    socket,
    onMessage,
    onEvent,
    send,
    close
  }
} 