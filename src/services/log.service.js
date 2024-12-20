import { BaseService } from './base.service'

class LogService extends BaseService {
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

export default new LogService() 