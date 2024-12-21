import { Kind } from 'graphql';
import InboxService from '../../services/inbox.service.js';

export const resolvers = {
  JSON: {
    __parseValue(value) {
      console.log('GraphQL JSON parseValue:', {
        value,
        type: typeof value,
        isString: typeof value === 'string'
      })
      return typeof value === 'string' ? JSON.parse(value) : value;
    },
    __serialize(value) {
      console.log('GraphQL JSON serialize:', {
        value,
        type: typeof value,
        isString: typeof value === 'string'
      })
      return typeof value === 'string' ? value : JSON.stringify(value);
    },
    __parseLiteral(ast) {
      console.log('GraphQL JSON parseLiteral:', {
        kind: ast.kind,
        value: ast.value
      })
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

  Query: {
    inbox: async (_, { id }, { prisma }) => {
      const inbox = await prisma.inbox.findUnique({
        where: { id }
      })

      console.log('Inbox encontrada:', {
        id,
        settings: inbox?.settings,
        channelType: inbox?.channelType
      })

      return inbox
    }
  },

  Mutation: {
    createInbox: async (_, { input }, { user }) => {
      try {
        console.log('1. Mutation createInbox recebeu:', {
          input,
          settings: input.settings,
          settingsType: typeof input.settings
        })

        const result = await InboxService.createInbox(user, input)
        
        console.log('2. Resultado do createInbox:', result)
        return result
      } catch (error) {
        console.error('3. Erro no resolver:', error)
        throw error
      }
    },
    updateInbox: async (_, { id, input }, { user }) => {
      return await InboxService.updateInbox(user, id, input);
    },
    deleteInbox: async (_, { id }, { user }) => {
      return await InboxService.deleteInbox(user, id);
    },
  },
};