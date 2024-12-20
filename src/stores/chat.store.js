import { defineStore } from 'pinia'
import { ChatService } from '@/services'

export const useChatStore = defineStore('chat', {
  state: () => ({
    conversations: [],
    currentConversation: null,
    loading: false,
    error: null,
    filters: {
      status: 'all',
      assignee: 'all',
      search: ''
    }
  }),

  getters: {
    filteredConversations: (state) => {
      return state.conversations.filter(conversation => {
        // Filtro por status
        if (state.filters.status !== 'all' && conversation.status !== state.filters.status) {
          return false
        }

        // Filtro por responsável
        if (state.filters.assignee !== 'all' && conversation.assigneeId !== state.filters.assignee) {
          return false
        }

        // Filtro por busca
        if (state.filters.search) {
          const searchTerm = state.filters.search.toLowerCase()
          return (
            conversation.contact?.name?.toLowerCase().includes(searchTerm) ||
            conversation.lastMessage?.content?.toLowerCase().includes(searchTerm)
          )
        }

        return true
      })
    },

    getConversationById: (state) => (id) => {
      return state.conversations.find(c => c.id === id)
    }
  },

  actions: {
    async fetchConversations(organizationId) {
      try {
        this.loading = true
        const conversations = await ChatService.getConversations(organizationId)
        this.conversations = conversations || []
      } catch (error) {
        this.error = error.message
        this.conversations = []
        throw error
      } finally {
        this.loading = false
      }
    },

    async createConversation(input) {
      try {
        const response = await ChatService.createConversation(input)
        this.conversations.unshift(response)
        return response
      } catch (error) {
        this.error = error.message
        throw error
      }
    },

    async updateConversation(id, input) {
      try {
        const response = await ChatService.updateConversation(id, input)
        const index = this.conversations.findIndex(c => c.id === id)
        if (index !== -1) {
          this.conversations[index] = response
        }
        return response
      } catch (error) {
        this.error = error.message
        throw error
      }
    },

    setCurrentConversation(conversation) {
      this.currentConversation = conversation
    },

    updateFilters(filters) {
      this.filters = { ...this.filters, ...filters }
    },

    // Métodos para WebSocket
    addConversation(conversation) {
      this.conversations.unshift(conversation)
    },

    updateConversationStatus(id, status) {
      const conversation = this.conversations.find(c => c.id === id)
      if (conversation) {
        conversation.status = status
      }
    },

    updateAssignee(id, assigneeId) {
      const conversation = this.conversations.find(c => c.id === id)
      if (conversation) {
        conversation.assigneeId = assigneeId
      }
    }
  }
}) 