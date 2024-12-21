import { Kind } from 'graphql';

export const resolvers = {
  JSON: {
    __parseValue(value) {
      return JSON.parse(value);
    },
    __serialize(value) {
      return JSON.stringify(value);
    },
    __parseLiteral(ast) {
      switch (ast.kind) {
        case Kind.STRING:
          return JSON.parse(ast.value);
        case Kind.OBJECT:
          return ast.fields.reduce((acc, field) => {
            acc[field.name.value] = this.__parseLiteral(field.value);
            return acc;
          }, {});
        default:
          return null;
      }
    },
  },

  Query: {},

  Mutation: {
    sendMessage: async (_, { input }, { user, prisma }) => {
      if (!user) throw new Error('Usuário não autenticado');

      const { conversationId, content, type = 'text', isFromContact = false } = input;

      // Verifica se a conversa existe
      const conversation = await prisma.conversation.findUnique({
        where: { id: conversationId },
        include: {
          inbox: {
            include: {
              organization: {
                include: {
                  users: {
                    where: { userId: user.id }
                  }
                }
              }
            }
          }
        }
      });

      if (!conversation) {
        throw new Error('Conversa não encontrada');
      }

      // Verifica se o usuário tem acesso à organização da conversa
      if (!conversation.inbox.organization.users.length) {
        throw new Error('Usuário não tem permissão para enviar mensagens nesta conversa');
      }

      // Cria a mensagem
      const message = await prisma.message.create({
        data: {
          content,
          type,
          isFromContact,
          userId: user.id,
          conversationId,
          metadata: {}
        },
        include: {
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
      });

      // Atualiza o updatedAt da conversa
      await prisma.conversation.update({
        where: { id: conversationId },
        data: { updatedAt: new Date() }
      });

      return message;
    }
  }
}; 