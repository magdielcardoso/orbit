import bcrypt from 'bcrypt'

export const resolvers = {
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
            role: true
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
          p => p.permission.name === 'manage_users' || p.permission.name === 'manage_system'
        );

        if (!hasPermission) {
          throw new Error('Não autorizado');
        }

        return prisma.role.findMany();
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

        // Mock de atividades enquanto não há dados reais
        return [
          {
            id: '1',
            type: 'system_config',
            description: 'Sistema configurado com sucesso',
            user: userWithRole.name,
            timestamp: new Date().toISOString()
          }
        ];

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
    }
  },

  Mutation: {
    register: async (_, args, { authService }) => {
      if (!authService) throw new Error('AuthService não disponível');
      return await authService.register(args);
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

        // Cria o usuário
        const hashedPassword = await bcrypt.hash(args.password, 10);
        const newUser = await prisma.user.create({
          data: {
            name: args.name,
            email: args.email,
            password: hashedPassword,
            roleId: args.roleId,
            active: true
          },
          include: {
            role: true
          }
        });

        // Registra a atividade
        await prisma.activity.create({
          data: {
            type: 'user_created',
            description: `Usuário ${newUser.name} criado`,
            userId: user.id
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
            type: 'user_deleted',
            description: `Usuário ${userToDelete.name} deletado`,
            userId: user.id
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