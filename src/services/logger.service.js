import { BaseService } from './base.service'

class LoggerService extends BaseService {
  constructor() {
    super()
    this.logs = []
    this.maxLogs = 1000
  }

  // Queries
  async getLogs(filters = {}) {
    const query = `
      query GetLogs($filters: LogFilters) {
        logs(filters: $filters) {
          id
          type
          level
          source
          action
          description
          metadata
          userId
          organizationId
          createdAt
        }
      }
    `
    return this.request(query, { filters })
  }

  // Mutations
  async createLog(input) {
    const mutation = `
      mutation CreateLog($input: LogInput!) {
        createLog(input: $input) {
          id
          type
          level
          source
          action
          description
          createdAt
        }
      }
    `
    return this.request(mutation, { input })
  }

  // Métodos locais
  addLog(log) {
    this.logs.push(log)
    if (this.logs.length > this.maxLogs) {
      this.logs.shift()
    }
  }

  clearLogs() {
    this.logs = []
  }

  // Métodos auxiliares
  getLogLevelColor(level) {
    const colors = {
      ERROR: 'error',
      WARNING: 'warning',
      INFO: 'info',
      DEBUG: 'default'
    }
    return colors[level] || 'default'
  }

  formatLogDate(date) {
    return new Date(date).toLocaleString('pt-BR')
  }
}

export default new LoggerService() 