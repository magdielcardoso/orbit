import { defineStore } from 'pinia'
import { ChatService } from '@/services'

export const useChatStore = defineStore('chat', {
  state: () => ({
    conversations: [],
    currentConversation: null,
    loading: false,
    error: null,
    selectedInbox: null,
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
    async fetchConversations(organizationId, filters) {
      try {
        this.loading = true
        const conversations = await ChatService.getConversations(organizationId, filters)
        this.conversations = conversations || []
      } catch (error) {
        this.error = error.message
        this.conversations = []
        throw error
      } finally {
        this.loading = false
      }
    },

    async sendMessage(conversationId, content) {
      try {
        this.loading = true
        const message = await ChatService.sendMessage(conversationId, content)
        
        // Atualiza a conversa com a nova mensagem
        const conversation = this.conversations.find(c => c.id === conversationId)
        if (conversation) {
          if (!conversation.messages) {
            conversation.messages = []
          }
          conversation.messages.push(message)
          conversation.updatedAt = new Date().toISOString()
        }
        
        return message
      } catch (error) {
        this.error = error.message
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
    },

    // Método para criar conversa a partir de mensagem do WhatsApp
    createConversationFromWhatsApp(data) {
      try {
        const whatsappData = data.data.data
        const isGroup = whatsappData.remoteJid?.includes('@g.us')

        // Extrai os dados relevantes da mensagem
        const messageData = {
          id: whatsappData.id,
          remoteJid: whatsappData.remoteJid,
          fromMe: whatsappData.fromMe,
          sender: whatsappData.sender,
          pushName: whatsappData.pushName,
          status: whatsappData.status,
          content: whatsappData.message?.conversation || '',
          timestamp: new Date().toISOString(),
          messageType: whatsappData.messageType,
          instanceId: whatsappData.instanceId,
          participant: whatsappData.participant // Importante para grupos
        }

        if (!messageData.remoteJid) {
          console.error('RemoteJid não encontrado:', data)
          throw new Error('RemoteJid não encontrado na mensagem')
        }

        // Cria uma nova mensagem
        const newMessage = {
          id: messageData.id,
          content: messageData.content,
          createdAt: messageData.timestamp,
          isFromContact: !messageData.fromMe,
          status: messageData.status,
          metadata: {
            messageType: messageData.messageType,
            instanceId: messageData.instanceId,
            remoteJid: messageData.remoteJid,
            participant: messageData.participant,
            senderName: isGroup ? messageData.pushName : undefined
          }
        }

        // Verifica se já existe uma conversa com este remoteJid
        const existingConversation = this.conversations.find(
          c => c.metadata?.remoteJid === messageData.remoteJid
        )

        if (existingConversation) {
          // Adiciona a nova mensagem à conversa existente
          existingConversation.messages.push(newMessage)
          existingConversation.updatedAt = messageData.timestamp
          existingConversation.lastMessage = messageData.content
          return existingConversation
        } else {
          // Cria uma nova conversa
          const newConversation = {
            id: `whatsapp-${messageData.remoteJid}`,
            status: 'PENDING',
            messages: [newMessage],
            contact: {
              name: isGroup ? 'Grupo WhatsApp' : (messageData.pushName || 'Contato WhatsApp'),
              phone: messageData.sender?.split('@')[0],
              whatsappId: messageData.sender
            },
            updatedAt: messageData.timestamp,
            lastMessage: messageData.content,
            channelType: 'WHATSAPP',
            metadata: {
              instanceName: data.instance,
              instanceId: messageData.instanceId,
              remoteJid: messageData.remoteJid,
              isGroup: isGroup,
              groupInfo: isGroup ? {
                participantCount: 0, // Será atualizado quando implementarmos a busca de info do grupo
                participants: [messageData.participant], // Lista inicial com o remetente
                name: messageData.pushName || 'Grupo WhatsApp'
              } : undefined
            }
          }

          // Adiciona a nova conversa no início do array
          this.conversations.unshift(newConversation)
          return newConversation
        }
      } catch (error) {
        console.error('Erro ao criar conversa do WhatsApp:', error, data)
        this.error = error.message
        throw error
      }
    }
  }
}) 