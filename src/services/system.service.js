import { BaseService } from './base.service'

class SystemService extends BaseService {
  // Queries
  async getSystemStatus() {
    const query = `
      query GetSystemStatus {
        systemStatus {
          status
          version
          uptime
          lastBackup
          configured
          maintenance
          metrics {
            cpu
            memory
            disk
            activeUsers
            totalConversations
          }
        }
      }
    `
    return this.request(query)
  }

  async getSystemMetrics() {
    const query = `
      query GetSystemMetrics {
        systemMetrics {
          status
          cpu
          memory
          uptime
          onlineUsers
          userGrowth
          messagesPerSecond
          errorsPerMinute
        }
      }
    `
    return this.request(query)
  }

  async getSystemLogs(filters = {}) {
    const query = `
      query GetSystemLogs($filters: SystemLogFilters) {
        systemLogs(filters: $filters) {
          timestamp
          level
          message
          details
        }
      }
    `
    return this.request(query, { filters })
  }

  // Mutations
  async initiateBackup() {
    const mutation = `
      mutation InitiateBackup {
        initiateBackup {
          success
          message
          details
        }
      }
    `
    return this.request(mutation)
  }

  async restartSystem() {
    const mutation = `
      mutation RestartSystem {
        restartSystem {
          success
          message
          details
        }
      }
    `
    return this.request(mutation)
  }

  // Métodos auxiliares
  formatUptime(seconds) {
    const days = Math.floor(seconds / 86400)
    const hours = Math.floor((seconds % 86400) / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    
    return `${days}d ${hours}h ${minutes}m`
  }

  getStatusColor(status) {
    const colors = {
      HEALTHY: 'success',
      WARNING: 'warning',
      CRITICAL: 'error',
      MAINTENANCE: 'info'
    }
    return colors[status] || 'default'
  }
}

export default new SystemService() 