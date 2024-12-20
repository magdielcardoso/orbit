import { defineStore } from 'pinia'
import { AutomationService } from '@/services'

export const useAutomationStore = defineStore('automation', {
  state: () => ({
    automations: [],
    loading: false,
    error: null
  }),

  getters: {
    activeAutomations: (state) => {
      return state.automations.filter(auto => auto.isActive)
    },

    getAutomationById: (state) => (id) => {
      return state.automations.find(auto => auto.id === id)
    }
  },

  actions: {
    async fetchAutomations(organizationId) {
      try {
        this.loading = true
        const response = await AutomationService.getAutomations(organizationId)
        this.automations = response.automations
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async toggleAutomation(id) {
      try {
        const response = await AutomationService.toggleAutomation(id)
        const index = this.automations.findIndex(a => a.id === id)
        if (index !== -1) {
          this.automations[index].isActive = response.isActive
        }
      } catch (error) {
        this.error = error.message
        throw error
      }
    }
  }
}) 