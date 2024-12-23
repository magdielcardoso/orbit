import { Kind } from 'graphql';
import InboxService from '../../services/inbox.service.js';

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
    createInbox: async (_, { input }, { user }) => {
      return await InboxService.createInbox(user, input);
    },
    updateInbox: async (_, { id, input }, { user }) => {
      return await InboxService.updateInbox(user, id, input);
    },
    deleteInbox: async (_, { id }, { user }) => {
      return await InboxService.deleteInbox(user, id);
    },
  },
};