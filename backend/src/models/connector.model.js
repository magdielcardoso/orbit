import { prismaInstance } from '../plugins/prisma.plugin.js'

export default class ConnectorModel {
  /**
   * Encontra todos os conectores de uma organização.
   * 
   * @param {string} organizationId
   * @returns {Promise<Array>}
   */
  static async findConnectorsByOrganizationId(organizationId) {
    return await prismaInstance.connector.findMany({
      include: {
        organizations: {
          include: {
            organization: true
          }
        },
        channels: true
      }
    })
  }

  /**
   * Encontra um conector pelo ID.
   * 
   * @param {string} id
   * @returns {Promise<Object>}
   */
  static async findConnectorById(id) {
    return await prismaInstance.connector.findUnique({
      where: { id },
      include: {
        organization: true
      }
    })
  }

  /**
   * Cria um novo conector.
   * 
   * @param {Object} input
   * @returns {Promise<Object>}
   */
  static async createConnector(input) {
    const { organizationId, ...connectorData } = input
    
    return await prismaInstance.connector.create({
      data: {
        ...connectorData,
        source: input.source || 'OFFICIAL',
        organizations: {
          create: {
            organizationId,
            isEnabled: input.isEnabled || false
          }
        }
      },
      include: {
        organizations: {
          include: {
            organization: true
          }
        }
      }
    })
  }

  /**
   * Atualiza um conector existente.
   * 
   * @param {string} id
   * @param {Object} input
   * @returns {Promise<Object>}
   */
  static async updateConnector(id, input) {
    return await prismaInstance.connector.update({
      where: { id },
      data: {
        name: input.name,
        description: input.description,
        type: input.type,
        config: input.config,
        isEnabled: input.isEnabled
      }
    })
  }

  /**
   * Deleta um conector.
   * 
   * @param {string} id
   * @returns {Promise<Object>}
   */
  static async deleteConnector(id) {
    return await prismaInstance.connector.delete({
      where: { id }
    })
  }

  /**
   * Ativa/Desativa um conector.
   * 
   * @param {string} id
   * @param {boolean} isEnabled
   * @returns {Promise<Object>}
   */
  static async toggleConnector(id, isEnabled) {
    return await prismaInstance.connector.update({
      where: { id },
      data: {
        isEnabled
      }
    })
  }
} 