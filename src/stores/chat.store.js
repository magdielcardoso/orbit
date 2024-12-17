import { defineStore } from 'pinia'
import chatService from '@/services/chat.service.js'
import { useAuthStore } from './auth.store'
import { showToast } from '@/utils/toast'

export const useChatStore = defineStore('chat', {
  state: () => ({
    conversations: [],
    selectedConversation: null,
    loading: false,
    error: null
  }),

  getters: {
    sortedConversations: (state) => {
      return [...state.conversations].sort((a, b) => {
        return new Date(b.updatedAt) - new Date(a.updatedAt)
      })
    }
  },

  actions: {
    async fetchConversations(filters = {}) {
      const authStore = useAuthStore()
      if (!authStore.currentOrganizationId) return

      try {
        this.loading = true
        this.error = null
        const conversations = await chatService.getConversations(
          authStore.currentOrganizationId,
          filters
        )
        this.conversations = conversations
      } catch (error) {
        console.error('Erro ao buscar conversas:', error)
        this.error = error.message
      } finally {
        this.loading = false
      }
    },

    async sendMessage(conversationId, content) {
      try {
        const response = await chatService.sendMessage(conversationId, content)
        
        // Atualiza a conversa localmente
        const conversation = this.conversations.find(c => c.id === conversationId)
        if (conversation) {
          if (!conversation.messages) {
            conversation.messages = []
          }
          conversation.messages.push(response)
          conversation.updatedAt = new Date().toISOString()
        }
        
        return response
      } catch (error) {
        console.error('Erro ao enviar mensagem:', error)
        throw error
      }
    },

    setSelectedConversation(conversation) {
      this.selectedConversation = conversation
    }
  }
}) 