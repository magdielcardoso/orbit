import ContactModel from '../models/contacts.model.js'
import OrganizationModel from '../models/organization.model.js'

export default class ContactService {
  /**
   * Obtém todos os contatos de uma organização.
   * 
   * @param {object} user
   * @param {number} organizationId
   * @returns {Promise<object[]>}
   */
  static async getContacts(user, organizationId) {
    try {
      const orgUser = await OrganizationModel.findOrganizationUser(user.id, organizationId)

      if (!orgUser) {
        throw new Error('Não autorizado: usuário não pertence a esta organização')
      }

      return await ContactModel.findContactsByOrganizationId(organizationId)
    } catch (error) {
      console.error('Erro ao buscar contatos:', error)
      throw error
    }
  }

  /**
   * Cria um novo contato.
   * 
   * @param {object} user
   * @param {object} input
   * @returns {Promise<object>}
   */
  static async createContact(user, input) {
    try {
      const orgUser = await OrganizationModel.findOrganizationUser(user.id, input.organizationId)

      if (!orgUser) {
        throw new Error('Não autorizado: usuário não pertence a esta organização')
      }

      return await ContactModel.createContact(input)
    } catch (error) {
      console.error('Erro ao criar contato:', error)
      throw error
    }
  }

  /**
   * Atualiza um contato.
   * 
   * @param {object} user
   * @param {number} id
   * @param {object} input
   * @returns {Promise<object>}
   */
  static async updateContact(user, id, input) {
    try {
      const contact = await ContactModel.findContactByIdAndOrganizationId(id, input.organizationId)

      if (!contact) {
        throw new Error('Contato não encontrado')
      }

      const orgUser = await OrganizationModel.findOrganizationUser(user.id, input.organizationId)

      if (!orgUser) {
        throw new Error('Não autorizado: usuário não pertence a esta organização')
      }

      return await ContactModel.updateContact(id, input)
    } catch (error) {
      console.error('Erro ao atualizar contato:', error)
      throw error
    }
  }

  /**
   * Deleta um contato.
   * 
   * @param {object} user
   * @param {number} id
   * @returns {Promise<void>}
   */
  static async deleteContact(user, id) {
    try {
      const contact = await ContactModel.findContactById(id)

      if (!contact) {
        throw new Error('Contato não encontrado')
      }

      const orgUser = await OrganizationModel.findOrganizationUser(user.id, contact.organizationId)

      if (!orgUser) {
        throw new Error('Não autorizado: usuário não pertence a esta organização')
      }

      return await ContactModel.deleteContact(id)
    } catch (error) {
      console.error('Erro ao deletar contato:', error)
      throw error
    }
  }
}