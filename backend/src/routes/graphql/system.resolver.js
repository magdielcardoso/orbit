import { Kind } from 'graphql';
import SystemService from '../../services/system.service.js';

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
    systemStatus: async (_, __, { prisma }) => {
      return await SystemService.getSystemStatus(prisma);
    },
  },

  Mutation: {
    // A AGREGAR
  },
};
