import bcrypt from 'bcrypt'
import OrganizationModel from '../models/organization.model.js'
import UserModel from '../models/user.model.js'

export default class OrganizationService {
  /**
   * Obtém todas as organizações.
   * 
   * @param {object} user
   * @returns {Promise<object[]>}
   */
  static async getOrganizations(user) {
    try {
      const userWithRole = await UserModel.findUserById(user.id)

      if (userWithRole?.role?.name !== 'superadmin') {
        throw new Error('Não autorizado: apenas superadmin pode listar todas as organizações')
      }

      return await OrganizationModel.findAllOrganizations()
    } catch (error) {
      console.error('Erro ao buscar organizações:', error)
      throw error
    }
  }

  /**
   * Obtém uma organização pelo ID.
   * 
   * @param {object} user
   * @param {number} id
   * @returns {Promise<object|null>}
   */
  static async getOrganization(user, id) {
    try {
      const orgUser = await OrganizationModel.findOrganizationUser(user.id, id)

      if (!orgUser) {
        throw new Error('Não autorizado: usuário não pertence a esta organização')
      }

      return await OrganizationModel.findOrganizationById(id)
    } catch (error) {
      console.error('Erro ao buscar organização:', error)
      throw error
    }
  }

  /**
   * Valida o slug da organização.
   * 
   * @param {string} slug
   * @returns {Promise<object>}
   */
  static async validateOrganizationSlug(slug) {
    try {
      const organization = await OrganizationModel.findOrganizationBySlug(slug)

      if (organization) {
        const hash_id = await bcrypt.hash(organization.id, 10)
        console.log('Organization found:', { ...organization, hash_id })
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

  /**
   * Cria uma nova organização.
   * 
   * @param {object} user
   * @param {object} input
   * @returns {Promise<object>}
   */
  static async createOrganization(user, input) {
    try {
      const userWithRole = await UserModel.findUserById(user.id)

      if (userWithRole?.role?.name !== 'superadmin') {
        throw new Error('Não autorizado: apenas superadmin pode criar organizações')
      }

      const organization = await OrganizationModel.createOrganization(input)

      await OrganizationModel.createOrganizationUser(organization.id, user.id)

      return organization
    } catch (error) {
      console.error('Erro ao criar organização:', error)
      throw error
    }
  }
}