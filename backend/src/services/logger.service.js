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

  /**
   * Configura o logger.
   */
  setupLogger() {
    this.logger = setupLogger(this)
  }

  /**
   * Intercepta as saídas do console.
   */
  interceptOutputs() {
    interceptOutputs(this)
  }

  /**
   * Inicializa o serviço de logger.
   * 
   * @param {object} app
   */
  initialize(app) {
    this.app = app
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

  /**
   * Transmite um log para os clientes conectados.
   * 
   * @param {object} logEntry
   */
  broadcastLog(logEntry) {
    this.recentLogs.push(logEntry)
    if (this.recentLogs.length > this.maxRecentLogs) {
      this.recentLogs.shift()
    }
    if (this.websocket) {
      const clients = this.websocket.of('/logs').sockets
      for (const clientId in clients) {
        const client = clients[clientId]
        if (client) {
          client.emit('new-log', logEntry)
        }
      }
    }
  }

  /**
   * Registra uma mensagem de log.
   * 
   * @param {string} level
   * @param {string} message
   * @param {object} [metadata={}]
   */
  log(level, message, metadata = {}) {
    const timestamp = new Date().toISOString()

    const processInfo = {
      pid: process.pid,
      memory: process.memoryUsage(),
      uptime: process.uptime()
    }

    const stack = metadata.error?.stack || new Error().stack

    const logEntry = {
      timestamp,
      level,
      message,
      process: processInfo,
      stack: level === 'error' ? stack : undefined,
      ...metadata
    }

    this.recentLogs.push(logEntry)
    if (this.recentLogs.length > this.maxRecentLogs) {
      this.recentLogs.shift()
    }

    this.logger.log(level, message, logEntry)

    this.broadcastLog(logEntry)
  }

  /**
   * Registra uma mensagem de erro.
   * 
   * @param {string} message
   * @param {object} [metadata={}]
   */
  error(message, metadata = {}) {
    this.log('error', message, metadata)
  }

  /**
   * Registra uma mensagem de aviso.
   * 
   * @param {string} message
   * @param {object} [metadata={}]
   */
  warn(message, metadata = {}) {
    this.log('warn', message, metadata)
  }

  /**
   * Registra uma mensagem informativa.
   * 
   * @param {string} message
   * @param {object} [metadata={}]
   */
  info(message, metadata = {}) {
    this.log('info', message, metadata)
  }

  /**
   * Registra uma mensagem de depuração.
   * 
   * @param {string} message
   * @param {object} [metadata={}]
   */
  debug(message, metadata = {}) {
    this.log('debug', message, metadata)
  }

  /**
   * Registra uma mensagem detalhada.
   * 
   * @param {string} message
   * @param {object} [metadata={}]
   */
  verbose(message, metadata = {}) {
    this.log('verbose', message, metadata)
  }

  /**
   * Registra uma mensagem HTTP.
   * 
   * @param {string} message
   * @param {object} [metadata={}]
   */
  http(message, metadata = {}) {
    this.log('http', message, metadata)
  }

  /**
   * Inicia a captura de logs do sistema.
   */
  startSystemLogs() {
    process.removeAllListeners('uncaughtException')
    process.removeAllListeners('unhandledRejection')

    process.on('uncaughtException', error => {
      this.error('Uncaught Exception', { error })
    })

    process.on('unhandledRejection', (reason, promise) => {
      this.error('Unhandled Rejection', { reason, promise })
    })

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

      const io = getWebSocketServer()
      io.emit('system-stats', stats)

      this.info('System Status', stats)
    }, 60000)
  }

  /**
   * Manipula a saída do console.
   * 
   * @param {string} type
   * @param {...any} args
   */
  handleConsoleOutput(type, ...args) {
    const formattedArgs = formatArgs(args)
    const logEntry = createLogEntry(type, formattedArgs.join(' '), 'console')
    this.broadcastLog(logEntry)
  }

  /**
   * Manipula a saída do stream.
   * 
   * @param {string} stream
   * @param {Buffer|string} chunk
   */
  handleStreamOutput(stream, chunk) {
    const logEntry = createLogEntry(stream === 'stderr' ? 'error' : 'log', chunk.toString(), stream)
    this.broadcastLog(logEntry)
  }
}

export const loggerService = new LoggerService()