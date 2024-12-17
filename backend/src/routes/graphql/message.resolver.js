const resolvers = {
  Mutation: {
    sendMessage: async (_, { input }, { prisma, user }) => {
      try {
        // Verifica se a conversa existe
        const conversation = await prisma.conversation.findUnique({
          where: { id: input.conversationId },
          include: { 
            organization: true,
            contact: true
          }
        })

        if (!conversation) {
          throw new Error('Conversa não encontrada')
        }

        // Verifica se o usuário tem acesso à organização
        const orgUser = await prisma.organizationUser.findFirst({
          where: {
            userId: user.id,
            organizationId: conversation.organizationId
          }
        })

        if (!orgUser) {
          throw new Error('Não autorizado: usuário não pertence a esta organização')
        }

        // Cria a mensagem
        const message = await prisma.message.create({
          data: {
            content: input.content,
            type: input.type || 'text',
            isFromContact: input.isFromContact || false,
            metadata: {},
            conversation: {
              connect: { id: input.conversationId }
            },
            user: {
              connect: { id: user.id }
            },
            contact: conversation.contact ? {
              connect: { id: conversation.contact.id }
            } : undefined
          },
          include: {
            conversation: true,
            user: {
              select: {
                id: true,
                name: true,
                avatar: true
              }
            },
            contact: {
              select: {
                id: true,
                name: true,
                avatar: true
              }
            }
          }
        })

        // Atualiza o timestamp da conversa
        await prisma.conversation.update({
          where: { id: input.conversationId },
          data: { updatedAt: new Date() }
        })

        return message
      } catch (error) {
        console.error('Erro ao enviar mensagem:', error)
        throw error
      }
    }
  }
}

export default resolvers 