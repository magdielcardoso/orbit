import winston from 'winston'
import 'winston-daily-rotate-file'
import util from 'util'

export function setupLogger() {
  const colors = {
    error: '\x1b[31m',
    warn: '\x1b[33m',
    info: '\x1b[36m',
    debug: '\x1b[32m',
    verbose: '\x1b[35m',
    reset: '\x1b[0m'
  }

  const fileRotateTransport = new winston.transports.DailyRotateFile({
    filename: 'logs/system-%DATE%.log',
    datePattern: 'YYYY-MM-DD',
    maxSize: '20m',
    maxFiles: '14d'
  })

  const customFormat = winston.format.printf(({ level, message, timestamp, ...metadata }) => {
    const color = colors[level] || colors.info
    const formattedMessage = typeof message === 'object' 
      ? util.inspect(message, { depth: null }) 
      : message

    return `${color}[${timestamp}] ${level}: ${formattedMessage} ${
      Object.keys(metadata).length ? JSON.stringify(metadata) : ''
    }${colors.reset}`
  })

  return winston.createLogger({
    level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
    format: winston.format.combine(
      winston.format.timestamp({
        format: 'YYYY-MM-DD HH:mm:ss.SSS'
      }),
      winston.format.errors({ stack: true }),
      winston.format.splat(),
      winston.format.json(),
      customFormat
    ),
    transports: [
      new winston.transports.Console({
        format: winston.format.combine(winston.format.colorize(), customFormat)
      }),
      fileRotateTransport
    ]
  })
}

export function interceptOutputs(context) {
  console.log = (...args) => context.handleConsoleOutput('log', ...args)
  console.error = (...args) => context.handleConsoleOutput('error', ...args)
  console.warn = (...args) => context.handleConsoleOutput('warn', ...args)
  console.info = (...args) => context.handleConsoleOutput('info', ...args)
  console.debug = (...args) => context.handleConsoleOutput('debug', ...args)

  // Intercepta stdout e stderr
  const stdout = process.stdout.write
  const stderr = process.stderr.write

  process.stdout.write = (chunk, encoding, callback) => {
    context.handleStreamOutput('stdout', chunk)
    stdout.apply(process.stdout, [chunk, encoding, callback])
  }

  process.stderr.write = (chunk, encoding, callback) => {
    context.handleStreamOutput('stderr', chunk)
    stderr.apply(process.stderr, [chunk, encoding, callback])
  }
}