import { prismaInstance } from '../plugins/prisma.plugin.js'

export default class InboxModel {
  /**
   * Cria uma nova inbox.
   * 
   * @param {Object} input
   * @returns {Promise<Object>}
   */
  static async createInbox(input) {
    console.log('InboxModel createInbox input:', {
      input,
      settings: input.settings,
      settingsType: typeof input.settings
    })

    const data = {
      name: input.name,
      description: input.description,
      channelType: input.channelType,
      isEnabled: input.isEnabled ?? true,
      organization: {
        connect: { id: input.organizationId }
      }
    }

    if (input.settings) {
      try {
        console.log('Processando settings:', {
          original: input.settings,
          type: typeof input.settings
        })
        
        data.settings = typeof input.settings === 'string' 
          ? JSON.parse(input.settings)
          : input.settings

        console.log('Settings processado:', {
          result: data.settings,
          type: typeof data.settings
        })
      } catch (error) {
        console.error('Erro ao processar settings:', error)
        throw new Error('Configurações inválidas')
      }
    }

    return await prismaInstance.inbox.create({
      data,
      include: {
        teams: {
          include: {
            team: true
          }
        }
      }
    })
  }

  /**
   * Encontra uma inbox pelo ID.
   * 
   * @param {number} id
   * @returns {Promise<Object>}
   */
  static async findInboxById(id) {
    return await prismaInstance.inbox.findUnique({
      where: { id },
      include: {
        organization: true
      }
    })
  }

  /**
   * Atualiza uma inbox existente.
   * 
   * @param {number} id
   * @param {Object} input
   * @returns {Promise<Object>}
   */
  static async updateInbox(id, input) {
    return await prismaInstance.inbox.update({
      where: { id },
      data: {
        name: input.name,
        description: input.description,
        channelType: input.channelType,
        isEnabled: input.isEnabled
      },
      include: {
        teams: {
          include: {
            team: true
          }
        }
      }
    })
  }

  /**
   * Deleta uma inbox pelo ID.
   * 
   * @param {number} id
   * @returns {Promise<Object>}
   */
  static async deleteInbox(id) {
    return await prismaInstance.inbox.delete({
      where: { id }
    })
  }
}
