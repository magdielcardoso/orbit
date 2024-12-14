import bcrypt from 'bcrypt'
import { Kind } from 'graphql'
import { logActivity } from '../utils/activity.js'

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
    }
  },

  Query: {
    me: async (_, __, { user, prisma }) => {
      if (!user) return null;
      
      const userWithRole = await prisma.user.findUnique({
        where: { id: user.id },
        include: {
          role: {
            include: {
              permissions: {
                select: {
                  permission: {
                    select: {
                      id: true,
                      name: true
                    }
                  }
                }
              }
            }
          },
          agents: {
            include: {
              role: true
            }
          },
          parentUser: {
            include: {
              role: true
            }
          }
        }
      });

      if (!userWithRole) return null;
      
      if (!userWithRole.role) {
        return {
          ...userWithRole,
          role: null
        };
      }

      // Formata as permissões corretamente
      return {
        ...userWithRole,
        role: {
          ...userWithRole.role,
          permissions: userWithRole.role.permissions.map(p => p.permission)
        }
      };
    },
    users: async (_, __, { prisma, user }) => {
      try {
        // Verifica autenticação básica
        if (!user) throw new Error('Não autorizado');

        // Busca usuário com permissões
        const userWithRole = await prisma.user.findUnique({
          where: { id: user.id },
          include: {
            role: {
              include: {
                permissions: {
                  include: { permission: true }
                }
              }
            }
          }
        });

        // Verifica permissão específica
        const hasPermission = userWithRole?.role?.permissions?.some(
          p => p.permission.name === 'manage_users' || p.permission.name === 'manage_system'
        );

        if (!hasPermission) {
          throw new Error('Não autorizado');
        }

        return prisma.user.findMany({
          include: {
            role: true,
            parentUser: true,
            agents: true
          }
        });
      } catch (error) {
        console.error('Erro ao buscar usuários:', error);
        throw error;
      }
    },
    roles: async (_, __, { prisma, user }) => {
      try {
        // Verifica autenticação básica
        if (!user) throw new Error('Não autorizado');

        // Busca usuário com permissões
        const userWithRole = await prisma.user.findUnique({
          where: { id: user.id },
          include: {
            role: {
              include: {
                permissions: {
                  include: { permission: true }
                }
              }
            }
          }
        });

        // Verifica permissão específica
        const hasPermission = userWithRole?.role?.permissions?.some(
          p => p.permission.name === 'manage_roles' || p.permission.name === 'manage_system' || p.permission.name === 'manage_users'
        );

        if (!hasPermission) {
          throw new Error('Não autorizado');
        }

        return prisma.role.findMany({
          include: {
            permissions: {
              include: {
                permission: true
              }
            }
          }
        }).then(roles => roles.map(role => ({
          ...role,
          permissions: role.permissions.map(rp => rp.permission)
        })));
      } catch (error) {
        console.error('Erro ao buscar papéis:', error);
        throw error;
      }
    },
    systemStatus: async (_, __, { prisma }) => {
      try {
        const systemConfig = await prisma.systemConfig.findFirst({
          where: {
            status: 'CONFIGURED'
          }
        })
        
        console.log('System config found:', systemConfig) // Debug
        
        return {
          configured: !!systemConfig,
          version: process.env.APP_VERSION || '1.0.0',
          status: systemConfig ? 'online' : 'PENDING_SETUP'
        }
      } catch (error) {
        console.error('Erro ao verificar status do sistema:', error)
        return {
          configured: false,
          version: process.env.APP_VERSION || '1.0.0',
          status: 'error'
        }
      }
    },
    recentActivities: async (_, __, { prisma, user }) => {
      if (!user) return [];

      try {
        // Verifica autenticação básica
        if (!user) throw new Error('Não autorizado');

        // Busca usuário com permissões
        const userWithRole = await prisma.user.findUnique({
          where: { id: user.id },
          include: {
            role: {
              include: {
                permissions: {
                  select: {
                    permission: {
                      select: {
                        id: true,
                        name: true
                      }
                    }
                  }
                }
              }
            }
          }
        });

        // Verifica permissão específica
        const hasPermission = userWithRole?.role?.permissions?.some(
          p => p.permission.name === 'manage_system'
        );

        if (!hasPermission) {
          throw new Error('Não autorizado');
        }

        // Busca as últimas 5 atividades
        const activities = await prisma.activity.findMany({
          take: 5,
          orderBy: {
            createdAt: 'desc'
          },
          include: {
            user: true
          }
        });

        // Formata as datas para ISO string
        return activities.map(activity => ({
          ...activity,
          createdAt: activity.createdAt.toISOString(),
          updatedAt: activity.updatedAt.toISOString()
        }));

      } catch (error) {
        console.error('Erro ao buscar atividades:', error);
        throw error;
      }
    },
    adminStats: async (_, __, { prisma, user }) => {
      try {
        // Verifica autenticação básica
        if (!user) throw new Error('Não autorizado');

        // Busca usuário com permissões
        const userWithRole = await prisma.user.findUnique({
          where: { id: user.id },
          include: {
            role: {
              include: {
                permissions: {
                  include: { permission: true }
                }
              }
            }
          }
        });

        // Verifica permissão específica
        const hasPermission = userWithRole?.role?.permissions?.some(
          p => p.permission.name === 'manage_system'
        );

        if (!hasPermission) {
          throw new Error('Não autorizado');
        }

        // Busca estatísticas usando prisma
        const [users, roles] = await Promise.all([
          prisma.user.findMany({
            where: { active: true }
          }),
          prisma.role.findMany({
            include: {
              permissions: {
                include: { permission: true }
              }
            }
          })
        ]);

        return {
          totalUsers: users.length,
          totalRoles: roles.length,
          roles: roles.map(role => ({
            id: role.id,
            name: role.name,
            createdAt: role.createdAt
          }))
        };
      } catch (error) {
        console.error('Erro ao buscar estatísticas:', error);
        throw error;
      }
    },
    permissions: async (_, __, { prisma, user }) => {
      try {
        // Verifica autenticação básica
        if (!user) throw new Error('Não autorizado');

        // Busca usuário com permissões
        const userWithRole = await prisma.user.findUnique({
          where: { id: user.id },
          include: {
            role: {
              include: {
                permissions: {
                  include: { permission: true }
                }
              }
            }
          }
        });

        // Verifica permissão específica
        const hasPermission = userWithRole?.role?.permissions?.some(
          p => p.permission.name === 'manage_roles' || p.permission.name === 'manage_system'
        );

        if (!hasPermission) {
          throw new Error('Não autorizado');
        }

        return prisma.permission.findMany();
      } catch (error) {
        console.error('Erro ao buscar permissões:', error);
        throw error;
      }
    },
    activities: async (_, args, { prisma, user }) => {
      try {
        // Verifica permissão
        const userWithRole = await prisma.user.findUnique({
          where: { id: user.id },
          include: {
            role: {
              include: {
                permissions: true
              }
            }
          }
        });

        const hasPermission = userWithRole?.role?.permissions?.some(
          p => p.permission.name === 'manage_system'
        );

        if (!hasPermission) {
          throw new Error('Não autorizado');
        }

        // Constrói o where baseado nos filtros
        const where = {};
        if (args.type) where.type = args.type;
        if (args.level) where.level = args.level;
        if (args.source) where.source = args.source;

        return await prisma.activity.findMany({
          where,
          take: args.limit || 50,
          skip: args.offset || 0,
          orderBy: {
            createdAt: 'desc'
          },
          include: {
            user: true
          }
        });
      } catch (error) {
        console.error('Erro ao buscar atividades:', error);
        throw error;
      }
    }
  },

  Mutation: {
    register: async (_, args, { authService, prisma }) => {
      try {
        if (!authService) throw new Error('AuthService não disponível');
        
        // Executa o registro
        const result = await authService.register(args);

        // Registra a atividade
        await logActivity({
          type: 'USER_ACTION',
          level: 'INFO',
          source: 'FRONTEND',
          action: 'SELF_REGISTER',
          description: `Novo usuário ${result.user.name} registrado via formulário de registro`,
          userId: result.user.id,
          metadata: {
            newUserId: result.user.id,
            email: result.user.email,
            roleId: result.user.roleId
          }
        });

        return result;
      } catch (error) {
        console.error('Erro no registro:', error);
        throw error;
      }
    },
    
    registerSuperAdmin: async (_, args, { prisma, app }) => {
      try {
        // Verifica se já existe um superadmin
        const existingSuperAdmin = await prisma.user.findFirst({
          where: {
            role: {
              name: 'superadmin'
            }
          }
        });

        if (existingSuperAdmin) {
          throw new Error('Já existe um superadmin registrado');
        }

        // Busca a role de superadmin
        const superadminRole = await prisma.role.findUnique({
          where: { name: 'superadmin' }
        });

        if (!superadminRole) {
          throw new Error('Role de superadmin não encontrada');
        }

        // Cria o usuário superadmin
        const hashedPassword = await bcrypt.hash(args.password, 10);
        const user = await prisma.user.create({
          data: {
            name: args.name,
            email: args.email,
            password: hashedPassword,
            roleId: superadminRole.id,
            active: true
          },
          include: {
            role: {
              include: {
                permissions: {
                  include: {
                    permission: true
                  }
                }
              }
            }
          }
        });

        // Formata o usuário para retornar as permissões corretamente
        const formattedUser = {
          ...user,
          role: {
            ...user.role,
            permissions: user.role.permissions.map(p => p.permission)
          }
        };

        // Configura o sistema
        const systemConfig = await prisma.systemConfig.create({
          data: {
            systemName: args.systemConfig.systemName,
            timezone: args.systemConfig.timezone,
            status: 'CONFIGURED',
            setupCompletedAt: new Date()
          }
        });

        // Registra a atividade
        await logActivity({
          type: 'SYSTEM_EVENT',
          level: 'INFO',
          source: 'SYSTEM',
          action: 'SYSTEM_SETUP',
          description: 'Sistema configurado com sucesso',
          userId: user.id,
          metadata: {
            systemName: args.systemConfig.systemName,
            timezone: args.systemConfig.timezone
          }
        });

        // Gera o token
        const token = await app.jwt.sign({
          id: user.id,
          email: user.email,
          role: user.role?.name,
          permissions: user.role?.permissions.map(p => p.permission.name)
        });

        return {
          token,
          user: formattedUser,
          systemConfig
        };
      } catch (error) {
        console.error('Erro ao registrar superadmin:', error);
        throw error;
      }
    },

    login: async (_, args, { authService }) => {
      try {
        if (!authService) throw new Error('AuthService não disponível')
        const result = await authService.login(args)
        console.log('Login result:', result) // Debug
        return result
      } catch (error) {
        console.error('Login error:', error) // Debug
        throw error
      }
    },

    createUser: async (_, args, { prisma, user }) => {
      try {
        // Verifica se o usuário tem permissão
        const userWithRole = await prisma.user.findUnique({
          where: { id: user.id },
          include: {
            role: {
              include: {
                permissions: {
                  include: { permission: true }
                }
              }
            }
          }
        });

        const hasPermission = userWithRole?.role?.permissions?.some(
          p => p.permission.name === 'manage_users'
        );

        if (!hasPermission) {
          throw new Error('Não autorizado');
        }

        // Se for um agent, verifica se o parentUserId é válido
        if (args.parentUserId) {
          const parentUser = await prisma.user.findUnique({
            where: { id: args.parentUserId },
            include: {
              role: true
            }
          });

          if (!parentUser) {
            throw new Error('Usuário pai não encontrado');
          }

          if (parentUser.role?.name !== 'user') {
            throw new Error('O usuário pai deve ter a role "user"');
          }
        }

        // Verifica se a role é agent e se tem parentUserId
        const role = await prisma.role.findUnique({
          where: { id: args.roleId }
        });

        if (role?.name === 'agent' && !args.parentUserId) {
          throw new Error('Um agent precisa ter um usuário pai');
        }

        if (role?.name !== 'agent' && args.parentUserId) {
          throw new Error('Apenas agents podem ter um usuário pai');
        }

        // Cria o usuário
        const hashedPassword = await bcrypt.hash(args.password, 10);
        const newUser = await prisma.user.create({
          data: {
            name: args.name,
            email: args.email,
            password: hashedPassword,
            role: {
              connect: { id: args.roleId }
            },
            parentUser: args.parentUserId ? {
              connect: { id: args.parentUserId }
            } : undefined,
            active: true
          },
          include: {
            role: true,
            parentUser: true,
            agents: true
          }
        });

        // Registra a atividade
        await logActivity({
          type: 'USER_ACTION',
          level: 'INFO',
          source: 'BACKEND',
          action: 'CREATE_USER',
          description: `Usuário ${newUser.name} criado${args.parentUserId ? ' como agent' : ''}`,
          userId: user.id,
          metadata: { 
            newUserId: newUser.id,
            isAgent: !!args.parentUserId,
            parentUserId: args.parentUserId
          }
        });

        return newUser;
      } catch (error) {
        console.error('Erro ao criar usuário:', error);
        throw error;
      }
    },

    deleteUser: async (_, { id }, { prisma, user }) => {
      try {
        // Verifica se o usuário tem permissão
        const userWithRole = await prisma.user.findUnique({
          where: { id: user.id },
          include: {
            role: {
              include: {
                permissions: {
                  include: { permission: true }
                }
              }
            }
          }
        });

        const hasPermission = userWithRole?.role?.permissions?.some(
          p => p.permission.name === 'manage_users'
        );

        if (!hasPermission) {
          throw new Error('Não autorizado');
        }

        // Busca o usuário a ser deletado
        const userToDelete = await prisma.user.findUnique({
          where: { id }
        });

        if (!userToDelete) {
          throw new Error('Usuário não encontrado');
        }

        // Não permite deletar o próprio usuário
        if (userToDelete.id === user.id) {
          throw new Error('Não é possível deletar o próprio usuário');
        }

        // Deleta o usuário
        await prisma.user.delete({
          where: { id }
        });

        // Registra a atividade
        await prisma.activity.create({
          data: {
            type: 'USER_ACTION',
            level: 'INFO',
            source: 'BACKEND',
            action: 'DELETE_USER',
            description: `Usuário ${userToDelete.name} deletado`,
            userId: user.id,
            metadata: { deletedUserId: userToDelete.id }
          }
        });

        return true;
      } catch (error) {
        console.error('Erro ao deletar usuário:', error);
        throw error;
      }
    }
  }
} 