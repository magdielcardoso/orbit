import { io } from 'socket.io-client'
import { useAuthStore } from '@/stores/auth.store'

export function setupWebSocket() {
  const socket = io(import.meta.env.VITE_WS_URL, {
    transports: ['websocket'],
    autoConnect: false
  })

  socket.on('connect', () => {
    const authStore = useAuthStore()
    if (authStore.token) {
      socket.emit('authenticate', { token: authStore.token })
    }
  })

  return socket
} 