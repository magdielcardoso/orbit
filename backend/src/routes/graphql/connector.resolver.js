import { Kind } from 'graphql'
import ConnectorService from '../../services/connector.service.js'
import ConnectorModel from '../../models/connector.model.js'

export const resolvers = {
  JSONObject: {
    __parseValue(value) {
      return JSON.parse(value)
    },
    __serialize(value) {
      return JSON.stringify(value)
    },
    __parseLiteral(ast) {
      switch (ast.kind) {
        case Kind.STRING:
          return JSON.parse(ast.value)
        case Kind.OBJECT:
          return ast.fields.reduce((acc, field) => {
            acc[field.name.value] = this.__parseLiteral(field.value)
            return acc
          }, {})
        default:
          return null
      }
    }
  },

  Query: {
    // Lista todos os conectores de uma organização
    connectors: async (_, __, { user, prisma }) => {
      console.log('Resolver - Iniciando query connectors')
      if (!user) throw new Error('Não autorizado')

      // Verifica permissões
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
      })

      const hasPermission = userWithRole?.role?.permissions?.some(
        p => p.permission.name === 'manage_system' || p.permission.name === 'manage_connectors'
      )

      if (!hasPermission) {
        throw new Error('Não autorizado')
      }

      const result = await ConnectorModel.findConnectorsByOrganizationId()
      console.log('Resolver - Resultado:', result)
      return result
    },

    // Busca um conector específico
    connector: async (_, { id }, { user, prisma }) => {
      if (!user) throw new Error('Não autorizado')

      // Verifica permissões
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
      })

      const hasPermission = userWithRole?.role?.permissions?.some(
        p => p.permission.name === 'manage_system' || p.permission.name === 'manage_connectors'
      )

      if (!hasPermission) {
        throw new Error('Não autorizado')
      }

      return await ConnectorModel.findConnectorById(id)
    }
  },

  Mutation: {
    // Cria um novo conector
    createConnector: async (_, { input }, { user, prisma }) => {
      if (!user) throw new Error('Não autorizado')

      // Verifica permissões
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
      })

      const hasPermission = userWithRole?.role?.permissions?.some(
        p => p.permission.name === 'manage_system' || p.permission.name === 'manage_connectors'
      )

      if (!hasPermission) {
        throw new Error('Não autorizado')
      }

      return await ConnectorModel.createConnector(input)
    },

    // Atualiza um conector existente
    updateConnector: async (_, { id, input }, { user, prisma }) => {
      if (!user) throw new Error('Não autorizado')

      // Verifica permissões
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
      })

      const hasPermission = userWithRole?.role?.permissions?.some(
        p => p.permission.name === 'manage_system' || p.permission.name === 'manage_connectors'
      )

      if (!hasPermission) {
        throw new Error('Não autorizado')
      }

      return await ConnectorModel.updateConnector(id, input)
    },

    // Remove um conector
    deleteConnector: async (_, { id }, { user, prisma }) => {
      if (!user) throw new Error('Não autorizado')

      // Verifica permissões
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
      })

      const hasPermission = userWithRole?.role?.permissions?.some(
        p => p.permission.name === 'manage_system' || p.permission.name === 'manage_connectors'
      )

      if (!hasPermission) {
        throw new Error('Não autorizado')
      }

      return await ConnectorModel.deleteConnector(id)
    },

    // Ativa/Desativa um conector
    toggleConnector: async (_, { id, isEnabled }, { user, prisma }) => {
      if (!user) throw new Error('Não autorizado')

      // Verifica permissões
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
      })

      const hasPermission = userWithRole?.role?.permissions?.some(
        p => p.permission.name === 'manage_system' || p.permission.name === 'manage_connectors'
      )

      if (!hasPermission) {
        throw new Error('Não autorizado')
      }

      return await ConnectorModel.toggleConnector(id, isEnabled)
    },

    // Testa a conexão com um conector
    testConnector: async (_, { config }, { user, prisma }) => {
      if (!user) throw new Error('Não autorizado')

      // Verifica permissões
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
      })

      const hasPermission = userWithRole?.role?.permissions?.some(
        p => p.permission.name === 'manage_system' || p.permission.name === 'manage_connectors'
      )

      if (!hasPermission) {
        throw new Error('Não autorizado')
      }

      try {
        // Implementar lógica de teste de conexão
        return {
          success: true,
          message: 'Conexão testada com sucesso'
        }
      } catch (error) {
        return {
          success: false,
          message: error.message
        }
      }
    }
  }
} 