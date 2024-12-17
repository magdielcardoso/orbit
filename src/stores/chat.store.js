import { defineStore } from 'pinia'
import { chatService } from '@/services/chat.service'
import { useAuthStore } from './auth.store'

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
        this.conversations = await chatService.getConversations(
          authStore.currentOrganizationId,
          filters
        )
      } catch (error) {
        this.error = error.message
        console.error('Erro ao buscar conversas:', error)
      } finally {
        this.loading = false
      }
    },

    async sendMessage(conversationId, content) {
      try {
        const message = await chatService.sendMessage({
          conversationId,
          content,
          type: 'text'
        })

        // Atualiza a conversa localmente
        const conversation = this.conversations.find(c => c.id === conversationId)
        if (conversation) {
          conversation.messages.push(message)
          conversation.lastMessage = {
            content: message.content,
            createdAt: message.createdAt
          }
        }

        return message
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