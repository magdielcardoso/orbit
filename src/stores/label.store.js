import { defineStore } from 'pinia'
import { LabelService } from '@/services'

export const useLabelStore = defineStore('label', {
  state: () => ({
    labels: [],
    loading: false,
    error: null
  }),

  getters: {
    getLabelById: (state) => (id) => {
      return state.labels.find(label => label.id === id)
    },
    
    sortedLabels: (state) => {
      return [...state.labels].sort((a, b) => a.name.localeCompare(b.name))
    }
  },

  actions: {
    async fetchLabels() {
      try {
        this.loading = true
        const response = await LabelService.getLabels()
        this.labels = response.labels
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async addToConversation(conversationId, labelId) {
      try {
        await LabelService.addToConversation(conversationId, labelId)
      } catch (error) {
        this.error = error.message
        throw error
      }
    }
  }
}) 