import { prismaInstance } from '../plugins/prisma.plugin.js'

export default class OrganizationModel {
  /**
   * Encontra todas as organizações.
   * 
   * @returns {Promise<object[]>}
   */
  static async findAllOrganizations() {
    return await prismaInstance.organization.findMany({
      include: {
        users: true
      }
    })
  }

  /**
   * Encontra uma organização pelo ID.
   * 
   * @param {number} id
   * @returns {Promise<object|null>}
   */
  static async findOrganizationById(id) {
    return await prismaInstance.organization.findUnique({
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
  }

  /**
   * Encontra uma organização pelo slug.
   * 
   * @param {string} slug
   * @returns {Promise<object|null>}
   */
  static async findOrganizationBySlug(slug) {
    return await prismaInstance.organization.findUnique({
      where: { slug },
      select: {
        id: true,
        name: true,
        slug: true,
        domain: true
      }
    })
  }

  /**
   * Cria uma nova organização.
   * 
   * @param {object} input
   * @returns {Promise<object>}
   */
  static async createOrganization(input) {
    return await prismaInstance.organization.create({
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
  }

  /**
   * Cria um usuário da organização.
   * 
   * @param {number} organizationId
   * @param {number} userId
   * @returns {Promise<object>}
   */
  static async createOrganizationUser(organizationId, userId) {
    return await prismaInstance.organizationUser.create({
      data: {
        organizationId,
        userId,
        isAdmin: true,
        isOwner: true,
        status: 'active'
      }
    })
  }

  /**
   * Encontra um usuário da organização.
   * 
   * @param {number} userId
   * @param {number} organizationId
   * @returns {Promise<object|null>}
   */
  static async findOrganizationUser(userId, organizationId) {
    return await prismaInstance.organizationUser.findFirst({
      where: {
        userId,
        organizationId
      }
    })
  }
}