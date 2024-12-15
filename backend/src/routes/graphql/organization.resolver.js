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
    organizations: async (_, __, { prisma, user }) => {
      try {
        // Verifica se é superadmin
        const userWithRole = await prisma.user.findUnique({
          where: { id: user.id },
          include: {
            role: true
          }
        })

        if (userWithRole?.role?.name !== 'superadmin') {
          throw new Error('Não autorizado: apenas superadmin pode listar todas as organizações')
        }

        return prisma.organization.findMany({
          include: {
            users: true
          }
        })
      } catch (error) {
        console.error('Erro ao buscar organizações:', error)
        throw error
      }
    },
    organization: async (_, { id }, { prisma, user }) => {
      try {
        // Verifica se o usuário tem acesso à organização
        const orgUser = await prisma.organizationUser.findFirst({
          where: {
            userId: user.id,
            organizationId: id
          }
        })

        if (!orgUser) {
          throw new Error('Não autorizado: usuário não pertence a esta organização')
        }

        // Busca a organização com suas caixas de entrada
        return prisma.organization.findUnique({
          where: { id },
          include: {
            inboxes: {
              include: {
                teams: {
                  include: {
                    team: true
                  }
                }
              }
            }
          }
        })
      } catch (error) {
        console.error('Erro ao buscar organização:', error)
        throw error
      }
    },
    validateOrganizationSlug: async (_, { slug }, { prisma }) => {
      try {
        const organization = await prisma.organization.findUnique({
          where: { slug },
          select: {
            id: true,
            name: true,
            slug: true,
            domain: true
          }
        })

        if (organization) {
          // Criptografa o ID da organização
          const hash_id = await bcrypt.hash(organization.id, 10)
          console.log('Organization found:', { ...organization, hash_id }) // Debug log
          return {
            available: false,
            organization: {
              hash_id,
              name: organization.name,
              slug: organization.slug,
              domain: organization.domain
            }
          }
        }

        return {
          available: true,
          organization: null
        }
      } catch (error) {
        console.error('Erro ao validar slug:', error)
        throw error
      }
    }
  },

  Mutation: {
    createOrganization: async (_, { input }, { prisma, user }) => {
      try {
        // Verifica se é superadmin
        const userWithRole = await prisma.user.findUnique({
          where: { id: user.id },
          include: {
            role: true
          }
        })

        if (userWithRole?.role?.name !== 'superadmin') {
          throw new Error('Não autorizado: apenas superadmin pode criar organizações')
        }

        // Cria a organização
        const organization = await prisma.organization.create({
          data: {
            name: input.name,
            slug: input.slug,
            plan: input.plan,
            domain: input.domain,
            timezone: input.timezone || 'UTC',
            locale: input.locale || 'pt-BR',
            features: input.features || {},
            paymentStatus: 'ACTIVE',
            maxUsers: 5,
            maxTeams: 1,
            maxInboxes: 2
          }
        })

        // Cria a relação com o usuário que criou
        await prisma.organizationUser.create({
          data: {
            organizationId: organization.id,
            userId: user.id,
            isAdmin: true,
            isOwner: true,
            status: 'active'
          }
        })

        return organization
      } catch (error) {
        console.error('Erro ao criar organização:', error)
        throw error
      }
    }
  }
}
