import { Kind } from 'graphql';
import UserModel from '../../models/user.model.js';
import UserService from '../../services/user.service.js';

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
    me: async (_, __, { user }) => {
      if (!user) return null;
      const userWithRole = await UserModel.findUserById(user.id);

      if (!userWithRole) return null;

      if (!userWithRole.role) {
        return {
          ...userWithRole,
          role: null,
        };
      }

      return {
        ...userWithRole,
        role: {
          ...userWithRole.role,
          permissions: userWithRole.role.permissions.map(p => p.permission),
        },
      };
    },
    users: async () => {
      return UserModel.findAllUsers();
    },
    roles: async (_, __, { user }) => {
      try {
        if (!user) throw new Error('Não autorizado');

        const userWithRole = await UserModel.findUserById(user.id);

        const hasPermission = userWithRole?.role?.permissions?.some(
          p =>
            p.permission.name === 'manage_roles' ||
            p.permission.name === 'manage_system' ||
            p.permission.name === 'manage_users'
        );

        if (!hasPermission) {
          throw new Error('Não autorizado');
        }

        return UserModel.findAllRoles();
      } catch (error) {
        console.error('Erro ao buscar papéis:', error);
        throw error;
      }
    },
    recentActivities: async (_, __, { user }) => {
      if (!user) return [];

      try {
        if (!user) throw new Error('Não autorizado');

        const userWithRole = await UserModel.findUserById(user.id);

        const hasPermission = userWithRole?.role?.permissions?.some(
          p => p.permission.name === 'manage_system'
        );

        if (!hasPermission) {
          throw new Error('Não autorizado');
        }

        const activities = await UserModel.findRecentActivities();

        return activities.map(activity => ({
          ...activity,
          createdAt: activity.createdAt.toISOString(),
          updatedAt: activity.updatedAt.toISOString(),
        }));
      } catch (error) {
        console.error('Erro ao buscar atividades:', error);
        throw error;
      }
    },
    adminStats: async (_, __, { user }) => {
      try {
        if (!user) throw new Error('Não autorizado');

        const userWithRole = await UserModel.findUserById(user.id);

        const hasPermission = userWithRole?.role?.permissions?.some(
          p => p.permission.name === 'manage_system'
        );

        if (!hasPermission) {
          throw new Error('Não autorizado');
        }

        const stats = await UserModel.findAdminStats();

        return stats;
      } catch (error) {
        console.error('Erro ao buscar estatísticas:', error);
        throw error;
      }
    },
    permissions: async (_, __, { user }) => {
      try {
        if (!user) throw new Error('Não autorizado');

        const userWithRole = await UserModel.findUserById(user.id);

        const hasPermission = userWithRole?.role?.permissions?.some(
          p => p.permission.name === 'manage_roles' || p.permission.name === 'manage_system'
        );

        if (!hasPermission) {
          throw new Error('Não autorizado');
        }

        return UserModel.findAllPermissions();
      } catch (error) {
        console.error('Erro ao buscar permissões:', error);
        throw error;
      }
    },
    activities: async (_, args, { user }) => {
      try {
        const userWithRole = await UserModel.findUserById(user.id);

        const hasPermission = userWithRole?.role?.permissions?.some(
          p => p.permission.name === 'manage_system'
        );

        if (!hasPermission) {
          throw new Error('Não autorizado');
        }

        const where = {};
        if (args.type) where.type = args.type;
        if (args.level) where.level = args.level;
        if (args.source) where.source = args.source;

        return await UserModel.findActivities(where, args.limit, args.offset);
      } catch (error) {
        console.error('Erro ao buscar atividades:', error);
        throw error;
      }
    },
  },

  Mutation: {
    createUser: async (_, args, { user }) => {
      return UserService.createUser(args, user);
    },
    deleteUser: async (_, { id }, { user }) => {
      return UserService.deleteUser(id, user);
    },
    updateUser: async (_, { id, input }, { user }) => {
      return UserService.updateUser(id, input, user);
    },
  },
};
