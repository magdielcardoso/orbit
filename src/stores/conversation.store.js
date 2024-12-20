import { defineStore } from 'pinia'
import { ChatService as ConversationService } from '@/services'

export const useConversationStore = defineStore('conversation', {
  state: () => ({
    conversations: [],
    currentConversation: null,
    filters: {
      status: null,
      priority: null,
      assigneeId: null
    },
    loading: false,
    error: null
  }),

  getters: {
    getConversationById: (state) => (id) => {
      return state.conversations.find(conv => conv.id === id)
    },
    
    unreadCount: (state) => {
      return state.conversations.reduce((acc, conv) => acc + (conv.unreadCount || 0), 0)
    },

    filteredConversations: (state) => {
      return state.conversations.filter(conv => {
        if (state.filters.status && conv.status !== state.filters.status) return false
        if (state.filters.priority && conv.priority !== state.filters.priority) return false
        if (state.filters.assigneeId && conv.assignee?.id !== state.filters.assigneeId) return false
        return true
      })
    }
  },

  actions: {
    async fetchConversations(organizationId) {
      try {
        this.loading = true
        const response = await ConversationService.getConversations(organizationId, this.filters)
        this.conversations = response.conversations
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async assignConversation(conversationId, assigneeId) {
      try {
        const response = await ConversationService.assignConversation(conversationId, assigneeId)
        const index = this.conversations.findIndex(c => c.id === conversationId)
        if (index !== -1) {
          this.conversations[index].assignee = response.assignee
        }
      } catch (error) {
        this.error = error.message
        throw error
      }
    },

    async changeStatus(conversationId, status) {
      try {
        await ConversationService.changeStatus(conversationId, status)
        const index = this.conversations.findIndex(c => c.id === conversationId)
        if (index !== -1) {
          this.conversations[index].status = status
        }
      } catch (error) {
        this.error = error.message
        throw error
      }
    },

    setFilters(filters) {
      this.filters = { ...this.filters, ...filters }
    },

    clearFilters() {
      this.filters = {
        status: null,
        priority: null,
        assigneeId: null
      }
    }
  }
}) 