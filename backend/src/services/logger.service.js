import { setupLogger, interceptOutputs } from '../config/logger.config.js'
import { addFastifyHooks } from '../hooks/logger.hooks.js'
import { formatArgs, createLogEntry } from '../utils/logger.utils.js'
import { getWebSocketServer } from '../plugins/websocket.plugin.js'

class LoggerService {
  constructor() {
    if (LoggerService.instance) {
      return LoggerService.instance
    }
    
    LoggerService.instance = this
    this.setupLogger()
    this.interceptOutputs()
    this.connectedClients = new Set()
    this.recentLogs = []
    this.maxRecentLogs = 1000
    this.websocket = null
  }

  setupLogger() {
    this.logger = setupLogger(this)
  }

  interceptOutputs() {
    interceptOutputs(this)
  }

  initialize(app) {
    this.app =  app
    addFastifyHooks(app, this)
    this.startSystemLogs()

    this.websocket = getWebSocketServer()
    this.websocket.of('/logs').on('connection', socket => {
      this.connectedClients.add(socket)

      socket.emit('recent-logs', this.recentLogs)

      socket.on('disconnect', () => {
        this.connectedClients.delete(socket)
      })
    })
  }

  broadcastLog(logEntry) {
    this.recentLogs.push(logEntry)
    if (this.recentLogs.length > this.maxRecentLogs) {
      this.recentLogs.shift()
    }
    if (this.websocket) {
      this.websocket.of('/logs').on('connection', socket => {
        socket.emit('new-log', logEntry)
    })
  }
}


  log(level, message, metadata = {}) {
    const timestamp = new Date().toISOString()

    // Adiciona informações do processo
    const processInfo = {
      pid: process.pid,
      memory: process.memoryUsage(),
      uptime: process.uptime()
    }

    // Captura stack trace para erros
    const stack = metadata.error?.stack || new Error().stack

    const logEntry = {
      timestamp,
      level,
      message,
      process: processInfo,
      stack: level === 'error' ? stack : undefined,
      ...metadata
    }

    // Adiciona ao histórico de logs
    this.recentLogs.push(logEntry)
    if (this.recentLogs.length > this.maxRecentLogs) {
      this.recentLogs.shift()
    }

    this.logger.log(level, message, logEntry)

    // Envia para clientes conectados
    this.broadcastLog(logEntry)
  }

  // Métodos de conveniência
  error(message, metadata = {}) {
    this.log('error', message, metadata)
  }

  warn(message, metadata = {}) {
    this.log('warn', message, metadata)
  }

  info(message, metadata = {}) {
    this.log('info', message, metadata)
  }

  debug(message, metadata = {}) {
    this.log('debug', message, metadata)
  }

  verbose(message, metadata = {}) {
    this.log('verbose', message, metadata)
  }

  http(message, metadata = {}) {
    this.log('http', message, metadata)
  }

  startSystemLogs() {
    // Log de erros não tratados
    process.on('uncaughtException', error => {
      this.error('Uncaught Exception', { error })
    })

    process.on('unhandledRejection', (reason, promise) => {
      this.error('Unhandled Rejection', { reason, promise })
    })

    // Logs periódicos do sistema
    setInterval(() => {
      const memory = process.memoryUsage()
      const stats = {
        memory: {
          heapUsed: memory.heapUsed,
          heapTotal: memory.heapTotal,
          rss: memory.rss
        },
        uptime: process.uptime()
      }

      // Emite para todos os clientes conectados
      const io = getWebSocketServer()
      io.emit('system-stats', stats)

      // Também registra como log
      this.info('System Status', stats)
    }, 60000) // A cada minuto
  }

  handleConsoleOutput(type, ...args) {
    const formattedArgs = formatArgs(args)
    const logEntry = createLogEntry(type, formattedArgs.join(' '), 'console')
    this.broadcastLog(logEntry)
  }

  handleStreamOutput(stream, chunk) {
    const logEntry = createLogEntry(stream === 'stderr' ? 'error' : 'log', chunk.toString(), stream)
    this.broadcastLog(logEntry)
  }
}

export const loggerService = new LoggerService()