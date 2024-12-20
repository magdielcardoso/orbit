import { defineStore } from 'pinia'
import { InboxService } from '@/services'

export const useInboxStore = defineStore('inbox', {
  state: () => ({
    inboxes: [],
    loading: false,
    error: null
  }),

  getters: {
    getInboxById: (state) => (id) => {
      return state.inboxes.find(inbox => inbox.id === id)
    },

    activeInboxes: (state) => {
      return state.inboxes.filter(inbox => inbox.isEnabled)
    },

    inboxesByType: (state) => (type) => {
      return state.inboxes.filter(inbox => inbox.channelType === type)
    }
  },

  actions: {
    async fetchInboxes(organizationId) {
      try {
        this.loading = true
        const response = await InboxService.getInboxes(organizationId)
        this.inboxes = response.inboxes
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async createInbox(input) {
      try {
        const response = await InboxService.createInbox(input)
        this.inboxes.push(response)
        return response
      } catch (error) {
        this.error = error.message
        throw error
      }
    },

    async updateInbox(id, input) {
      try {
        const response = await InboxService.updateInbox(id, input)
        const index = this.inboxes.findIndex(i => i.id === id)
        if (index !== -1) {
          this.inboxes[index] = response
        }
        return response
      } catch (error) {
        this.error = error.message
        throw error
      }
    }
  }
}) 