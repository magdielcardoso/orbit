import { defineStore } from 'pinia'
import { MessageService, ChatService } from '@/services'

export const useMessageStore = defineStore('message', {
  state: () => ({
    messages: {},  // Organizado por conversationId
    typing: {},    // Status de digitação por conversationId
    loading: false,
    error: null
  }),

  getters: {
    getMessagesByConversation: (state) => (conversationId) => {
      return state.messages[conversationId] || []
    },

    isTyping: (state) => (conversationId) => {
      return state.typing[conversationId] || false
    }
  },

  actions: {
    async sendMessage(input) {
      try {
        const response = await MessageService.sendMessage(input)
        if (!this.messages[input.conversationId]) {
          this.messages[input.conversationId] = []
        }
        this.messages[input.conversationId].push(response)
        return response
      } catch (error) {
        this.error = error.message
        throw error
      }
    },

    async fetchMessages(conversationId) {
      try {
        this.loading = true
        const response = await ChatService.getMessages(conversationId)
        this.messages[conversationId] = response.messages
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    // Websocket actions
    addMessage(conversationId, message) {
      if (!this.messages[conversationId]) {
        this.messages[conversationId] = []
      }
      this.messages[conversationId].push(message)
    },

    setTypingStatus(conversationId, isTyping) {
      this.typing[conversationId] = isTyping
    },

    updateMessageStatus(messageId, status) {
      Object.keys(this.messages).forEach(conversationId => {
        const message = this.messages[conversationId].find(m => m.id === messageId)
        if (message) {
          message.status = status
        }
      })
    }
  }
}) 