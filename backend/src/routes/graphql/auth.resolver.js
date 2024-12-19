import { Kind } from 'graphql';
import AuthService from '../../services/auth.service.js';

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
    registerSuperAdmin: async (_, args, { app }) => {
      return AuthService.registerSuperAdmin(args, app);
    },
    login: async (_, args, { auth }) => {
      return AuthService.login(args, auth);
    },
  },
};
