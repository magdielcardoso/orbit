import { BaseService } from './base.service'

class ActivityService extends BaseService {
  async getActivities(filters = {}) {
    const query = `
      query GetActivities($filters: ActivityFilters) {
        activities(filters: $filters) {
          id
          type
          level
          source
          action
          description
          metadata
          user {
            id
            name
            avatar
          }
          createdAt
        }
      }
    `
    return this.request(query, { filters })
  }

  // Métodos auxiliares
  getActivityIcon(type) {
    const icons = {
      USER_ACTION: 'mdi-account',
      SYSTEM_EVENT: 'mdi-cog',
      ERROR: 'mdi-alert',
      AUTH: 'mdi-shield',
      API_CALL: 'mdi-api'
    }
    return icons[type] || 'mdi-information'
  }

  getActivityColor(level) {
    const colors = {
      INFO: 'info',
      WARNING: 'warning',
      ERROR: 'error',
      DEBUG: 'default'
    }
    return colors[level] || 'default'
  }
}

export default new ActivityService() 