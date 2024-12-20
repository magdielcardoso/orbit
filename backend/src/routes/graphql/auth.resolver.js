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
    login: async (_, { email, password }, { app }) => {
      try {
        const result = await app.auth.login({ email, password })
        return result
      } catch (error) {
        console.error('Erro no login:', error)
        throw error
      }
    },
    logout: async (_, __, { app, user }) => {
      try {
        if (!user) throw new Error('Não autorizado')
        await app.auth.logout(user)
        return {
          success: true,
          message: 'Logout realizado com sucesso'
        }
      } catch (error) {
        console.error('Erro no logout:', error)
        return {
          success: false,
          message: error.message
        }
      }
    },
  },
};
