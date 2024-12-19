import InboxModel from '../models/inbox.model.js'
import OrganizationModel from '../models/organization.model.js'

export default class InboxService {
  /**
   * Cria uma nova caixa de entrada.
   * 
   * @param {object} user
   * @param {object} input
   * @returns {Promise<object>}
   */
  static async createInbox(user, input) {
    try {
      const orgUser = await OrganizationModel.findOrganizationUser(user.id, input.organizationId)

      if (!orgUser) {
        throw new Error('Não autorizado: usuário não pertence a esta organização')
      }

      return await InboxModel.createInbox(input)
    } catch (error) {
      console.error('Erro ao criar caixa de entrada:', error)
      throw error
    }
  }

  /**
   * Atualiza uma caixa de entrada.
   * 
   * @param {object} user
   * @param {number} id
   * @param {object} input
   * @returns {Promise<object>}
   */
  static async updateInbox(user, id, input) {
    try {
      const inbox = await InboxModel.findInboxById(id)

      if (!inbox) {
        throw new Error('Caixa de entrada não encontrada')
      }

      const orgUser = await OrganizationModel.findOrganizationUser(user.id, inbox.organizationId)

      if (!orgUser) {
        throw new Error('Não autorizado: usuário não pertence a esta organização')
      }

      return await InboxModel.updateInbox(id, input)
    } catch (error) {
      console.error('Erro ao atualizar caixa de entrada:', error)
      throw error
    }
  }

  /**
   * Deleta uma caixa de entrada.
   * 
   * @param {object} user
   * @param {number} id
   * @returns {Promise<object>}
   */
  static async deleteInbox(user, id) {
    try {
      const inbox = await InboxModel.findInboxById(id)

      if (!inbox) {
        throw new Error('Caixa de entrada não encontrada')
      }

      const orgUser = await OrganizationModel.findOrganizationUser(user.id, inbox.organizationId)

      if (!orgUser) {
        throw new Error('Não autorizado: usuário não pertence a esta organização')
      }

      return await InboxModel.deleteInbox(id)
    } catch (error) {
      console.error('Erro ao excluir caixa de entrada:', error)
      throw error
    }
  }
}
