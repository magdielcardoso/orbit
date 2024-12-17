const resolvers = {
  Query: {
    conversations: async (_, { organizationId, filters = {} }, { prisma, user }) => {
      try {
        // Verifica se o usuário tem acesso à organização
        const orgUser = await prisma.organizationUser.findFirst({
          where: {
            userId: user.id,
            organizationId
          }
        })

        if (!orgUser) {
          throw new Error('Não autorizado: usuário não pertence a esta organização')
        }

        // Constrói o where com os filtros
        const where = {
          organizationId,
          ...(filters.assigneeId && { assigneeId: filters.assigneeId }),
          ...(filters.status && { status: filters.status }),
          ...(filters.priority && { priority: filters.priority }),
          ...(filters.inboxId && { inboxId: filters.inboxId })
        }

        const conversations = await prisma.conversation.findMany({
          where,
          include: {
            contact: true,
            assignee: true,
            inbox: true,
            messages: {
              orderBy: {
                createdAt: 'asc'
              },
              include: {
                user: true,
                contact: true
              }
            }
          },
          orderBy: {
            updatedAt: 'desc'
          }
        })

        return conversations.map(conversation => ({
          ...conversation,
          unreadCount: 0, // Implementar lógica de contagem depois
          lastMessageAt: conversation.messages[conversation.messages.length - 1]?.createdAt || conversation.createdAt
        }))
      } catch (error) {
        console.error('Erro ao buscar conversas:', error)
        throw error
      }
    }
  },

  Conversation: {
    messages: async (parent, { last }, { prisma }) => {
      const messages = await prisma.message.findMany({
        where: { conversationId: parent.id },
        orderBy: { createdAt: 'asc' },
        take: last || undefined,
        include: {
          user: true,
          contact: true
        }
      })
      return messages
    }
  }
}

export default resolvers 