import { Kind } from 'graphql';
import ConversationService from '../../services/conversation.service.js';

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

  Query: {
    conversations: async (_, { organizationId, filters = {} }, { user }) => {
      return await ConversationService.getConversations(user, organizationId, filters);
    }
  },

  Mutation: {
    changeConversationStatus: async (_, { id, status }, { user }) => {
      return await ConversationService.updateStatus(user, id, status);
    },

    assignConversation: async (_, { id, assigneeId }, { user }) => {
      return await ConversationService.assignConversation(user, id, assigneeId);
    }
  }
};