import bcrypt from 'bcrypt'
import { Kind } from 'graphql'
import { logActivity } from '../../utils/activity.js'

export const resolvers = {
  JSON: {
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
    // A AGREGAR
  }
}
