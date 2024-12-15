import winston from 'winston';
import 'winston-daily-rotate-file';
import { Server } from 'socket.io';

// Configuração do formato dos logs
const logFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.json()
);

// Transporte para arquivos rotativos
const fileRotateTransport = new winston.transports.DailyRotateFile({
  filename: 'logs/system-%DATE%.log',
  datePattern: 'YYYY-MM-DD',
  maxSize: '20m',
  maxFiles: '14d'
});

// Criação do logger
export const logger = winston.createLogger({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  format: logFormat,
  transports: [
    fileRotateTransport,
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      )
    })
  ]
});

// Classe para gerenciar logs e WebSocket
class LoggerService {
  constructor() {
    this.io = null;
    this.connectedClients = new Set();
  }

  initialize(server) {
    this.io = new Server(server, {
      cors: {
        origin: process.env.FRONTEND_URL,
        credentials: true
      },
      path: '/logs'
    });

    this.io.on('connection', (socket) => {
      this.connectedClients.add(socket);
      
      socket.on('disconnect', () => {
        this.connectedClients.delete(socket);
      });
    });

    // Intercepta logs do Winston e envia para clientes conectados
    logger.on('data', (log) => {
      this.broadcastLog(log);
    });
  }

  broadcastLog(logEntry) {
    if (this.io) {
      this.io.emit('new-log', logEntry);
    }
  }

  log(level, message, metadata = {}) {
    const logEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      ...metadata
    };

    // Adiciona cores ao console baseado no nível
    const colors = {
      error: '\x1b[31m', // vermelho
      warn: '\x1b[33m',  // amarelo
      info: '\x1b[36m',  // ciano
      debug: '\x1b[32m', // verde
      reset: '\x1b[0m'   // reset
    };

    console.log(
      `${colors[level] || ''}[${level.toUpperCase()}] ${message}${colors.reset}`,
      metadata
    );

    logger.log(level, message, metadata);
    this.broadcastLog(logEntry);
  }

  // Métodos de conveniência
  error(message, metadata = {}) {
    this.log('error', message, metadata);
  }

  warn(message, metadata = {}) {
    this.log('warn', message, metadata);
  }

  info(message, metadata = {}) {
    this.log('info', message, metadata);
  }

  debug(message, metadata = {}) {
    this.log('debug', message, metadata);
  }
}

export const loggerService = new LoggerService(); 