import winston from 'winston'
import 'winston-daily-rotate-file'
import { Server } from 'socket.io'
import util from 'util'
import '../helpers/loadEnv.helper.js'

// Intercepta console.log e outros outputs
const originalConsoleLog = console.log
const originalConsoleError = console.error
const originalConsoleWarn = console.warn
const originalConsoleInfo = console.info
const originalConsoleDebug = console.debug

// Transporte para arquivos rotativos
const fileRotateTransport = new winston.transports.DailyRotateFile({
  filename: 'logs/system-%DATE%.log',
  datePattern: 'YYYY-MM-DD',
  maxSize: '20m',
  maxFiles: '14d'
})

// Adiciona formato personalizado para logs detalhados
const detailedFormat = winston.format.printf(({ level, message, timestamp, ...metadata }) => {
  const color = {
    error: '\x1b[31m',
    warn: '\x1b[33m',
    info: '\x1b[36m',
    debug: '\x1b[32m',
    verbose: '\x1b[35m',
    reset: '\x1b[0m'
  }

  // Formata o stack trace se existir
  const stack = metadata.stack ? `\n${metadata.stack}` : ''

  // Formata metadados extras
  const extras = Object.keys(metadata).length ? `\n${JSON.stringify(metadata, null, 2)}` : ''

  return `${color[level]}[${timestamp}] [${level.toUpperCase()}] ${message}${stack}${extras}${color.reset}`
})

export const logger = winston.createLogger({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  format: winston.format.combine(
    winston.format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss.SSS'
    }),
    winston.format.errors({ stack: true }),
    winston.format.splat(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(winston.format.colorize(), detailedFormat)
    }),
    fileRotateTransport
  ]
})

class LoggerService {
  constructor() {
    this.io = null
    this.connectedClients = new Set()
    this.recentLogs = []
    this.maxRecentLogs = 1000
    this.interceptConsole()
  }

  interceptConsole() {
    // Intercepta todos os logs do console
    console.log = (...args) => {
      this.handleConsoleOutput('log', ...args)
      originalConsoleLog.apply(console, args)
    }

    console.error = (...args) => {
      this.handleConsoleOutput('error', ...args)
      originalConsoleError.apply(console, args)
    }

    console.warn = (...args) => {
      this.handleConsoleOutput('warn', ...args)
      originalConsoleWarn.apply(console, args)
    }

    console.info = (...args) => {
      this.handleConsoleOutput('info', ...args)
      originalConsoleInfo.apply(console, args)
    }

    console.debug = (...args) => {
      this.handleConsoleOutput('debug', ...args)
      originalConsoleDebug.apply(console, args)
    }

    // Intercepta stdout e stderr
    const stdout = process.stdout.write
    const stderr = process.stderr.write

    process.stdout.write = (chunk, encoding, callback) => {
      this.handleStreamOutput('stdout', chunk)
      stdout.apply(process.stdout, [chunk, encoding, callback])
    }

    process.stderr.write = (chunk, encoding, callback) => {
      this.handleStreamOutput('stderr', chunk)
      stderr.apply(process.stderr, [chunk, encoding, callback])
    }
  }

  handleConsoleOutput(type, ...args) {
    const formattedArgs = args.map(arg => {
      if (typeof arg === 'object') {
        return util.inspect(arg, { depth: null, colors: true })
      }
      return arg
    })

    const logEntry = {
      timestamp: new Date().toISOString(),
      type,
      message: formattedArgs.join(' '),
      source: 'console',
      pid: process.pid,
      memory: process.memoryUsage(),
      uptime: process.uptime()
    }

    this.broadcastLog(logEntry)
  }

  handleStreamOutput(stream, chunk) {
    const logEntry = {
      timestamp: new Date().toISOString(),
      type: stream === 'stderr' ? 'error' : 'log',
      message: chunk.toString(),
      source: stream,
      pid: process.pid,
      memory: process.memoryUsage(),
      uptime: process.uptime()
    }

    this.broadcastLog(logEntry)
  }

  initialize(server, app) {
    this.app = app
    this.io = new Server(server, {
      cors: {
        origin: process.env.FRONTEND_URL,
        credentials: true
      },
      path: '/logs'
    })

    this.io.on('connection', socket => {
      console.log('Cliente conectado aos logs')
      this.connectedClients.add(socket)

      // Envia últimos logs ao conectar
      socket.emit('recent-logs', this.recentLogs)

      // Prepara para receber comandos (implementação futura)
      socket.on('execute-command', async command => {
        try {
          // TODO: Implementar execução de comandos
          console.log('Comando recebido:', command)
          socket.emit('command-response', {
            success: true,
            message: `Comando "${command}" recebido (não implementado)`
          })
        } catch (error) {
          socket.emit('command-response', {
            success: false,
            error: error.message
          })
        }
      })

      socket.on('disconnect', () => {
        console.log('Cliente desconectado dos logs')
        this.connectedClients.delete(socket)
      })
    })

    // Captura logs do Fastify
    app.addHook('onRequest', (request, reply, done) => {
      request.startTime = process.hrtime()
      this.log('http', `${request.method} ${request.url}`, {
        headers: request.headers,
        query: request.query,
        params: request.params,
        ip: request.ip
      })
      done()
    })

    app.addHook('onResponse', (request, reply, done) => {
      const hrtime = process.hrtime(request.startTime)
      const responseTime = (hrtime[0] * 1e3 + hrtime[1] / 1e6).toFixed(2)

      this.log('http', `Response ${reply.statusCode}`, {
        method: request.method,
        url: request.url,
        statusCode: reply.statusCode,
        responseTime: `${responseTime}ms`,
        success: reply.statusCode < 400
      })
      done()
    })

    this.startSystemLogs()
  }

  broadcastLog(logEntry) {
    // Adiciona ao histórico
    this.recentLogs.push(logEntry)
    if (this.recentLogs.length > this.maxRecentLogs) {
      this.recentLogs.shift()
    }

    // Envia para todos os clientes conectados
    if (this.io) {
      this.io.emit('new-log', logEntry)
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

    logger.log(level, message, logEntry)

    // Envia para clientes conectados
    if (this.io) {
      this.io.emit('new-log', logEntry)
    }
  }

  // M��todos de conveniência
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
    // Log de requisições HTTP
    this.app?.addHook('onRequest', (request, reply, done) => {
      this.http(`${request.method} ${request.url}`, {
        headers: request.headers,
        query: request.query,
        ip: request.ip
      })
      done()
    })

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
      if (this.io) {
        this.io.emit('system-stats', stats)
      }

      // Também registra como log
      this.info('System Status', stats)
    }, 60000) // A cada minuto
  }
}

export const loggerService = new LoggerService()
