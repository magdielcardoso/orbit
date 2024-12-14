export const resolvers = {
  Query: {
    me: async (_, __, { user, prisma }) => {
      if (!user) return null
      
      return await prisma.user.findUnique({
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
      })
    },
    users: async (_, __, { prisma, user }) => {
      if (!user?.role?.permissions?.includes('manage_users')) {
        throw new Error('Não autorizado')
      }

      return await prisma.user.findMany({
        include: {
          role: true
        }
      })
    },
    systemStatus: async (_, __, { prisma }) => {
      try {
        const userCount = await prisma.user.count();
        
        return {
          configured: userCount > 0,
          version: process.env.APP_VERSION || '1.0.0',
          status: 'online'
        };
      } catch (error) {
        console.error('Erro ao verificar status do sistema:', error);
        return {
          configured: false,
          version: process.env.APP_VERSION || '1.0.0',
          status: 'error'
        };
      }
    }
  },

  Mutation: {
    register: async (_, args, { authService }) => {
      if (!authService) throw new Error('AuthService não disponível');
      return await authService.register(args);
    },
    
    login: async (_, args, { authService }) => {
      if (!authService) throw new Error('AuthService não disponível');
      return await authService.login(args);
    }
  }
} 