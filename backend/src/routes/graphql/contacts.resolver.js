import { Kind } from 'graphql';
import ContactService from '../../services/contacts.service.js';

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
    contacts: async (_, { organizationId }, { user }) => {
      return await ContactService.getContacts(user, organizationId);
    },
  },

  Mutation: {
    createContact: async (_, { input }, { user }) => {
      return await ContactService.createContact(user, input);
    },
    updateContact: async (_, { id, input }, { user }) => {
      return await ContactService.updateContact(user, id, input);
    },
    deleteContact: async (_, { id }, { user }) => {
      return await ContactService.deleteContact(user, id);
    },
  },
};
