import { createApp } from 'vue'
import { setupInterceptors } from '@/utils/interceptors'
import { setupWebSocket } from '@/utils/websocket'

export default {
  install(app) {
    setupInterceptors()
    const socket = setupWebSocket()
    
    app.config.globalProperties.$socket = socket
    app.provide('socket', socket)
  }
} 