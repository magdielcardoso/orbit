import { defineStore } from 'pinia'
import { SystemService } from '@/services'

export const useSystemStore = defineStore('system', {
  state: () => ({
    status: null,
    metrics: null,
    logs: [],
    loading: false,
    error: null
  }),

  getters: {
    isHealthy: (state) => {
      return state.status?.status === 'HEALTHY'
    },

    formattedUptime: (state) => {
      return state.metrics?.uptime ? SystemService.formatUptime(state.metrics.uptime) : ''
    },

    errorLogs: (state) => {
      return state.logs.filter(log => log.level === 'ERROR')
    }
  },

  actions: {
    async fetchSystemStatus() {
      try {
        this.loading = true
        const response = await SystemService.getSystemStatus()
        this.status = response.systemStatus
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async fetchMetrics() {
      try {
        const response = await SystemService.getSystemMetrics()
        this.metrics = response.systemMetrics
      } catch (error) {
        this.error = error.message
        throw error
      }
    },

    async fetchLogs(filters = {}) {
      try {
        const response = await SystemService.getSystemLogs(filters)
        this.logs = response.systemLogs
      } catch (error) {
        this.error = error.message
        throw error
      }
    }
  }
}) 