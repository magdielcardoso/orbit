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
    }
  },

  Mutation: {
    register: async (_, args, { authService }) => {
      if (!authService) throw new Error('AuthService não disponível');
      return await authService.register(args);
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
    }
  }
} 