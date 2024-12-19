import { prismaInstance } from '../plugins/prisma.plugin.js'

export default class ContactModel {
  /**
   * Encontra contatos pelo ID da organização.
   * 
   * @param {number} organizationId
   * @returns {Promise<Array>}
   */
  static async findContactsByOrganizationId(organizationId) {
    return await prismaInstance.contact.findMany({
      where: {
        organizationId
      },
      orderBy: {
        createdAt: 'desc'
      }
    })
  }

  /**
   * Cria um novo contato.
   * 
   * @param {Object} input
   * @returns {Promise<Object>}
   */
  static async createContact(input) {
    return await prismaInstance.contact.create({
      data: {
        ...input,
        organizationId: input.organizationId
      }
    })
  }

  /**
   * Encontra um contato pelo ID e ID da organização.
   * 
   * @param {number} id
   * @param {number} organizationId
   * @returns {Promise<Object>}
   */
  static async findContactByIdAndOrganizationId(id, organizationId) {
    return await prismaInstance.contact.findFirst({
      where: {
        id,
        organizationId
      }
    })
  }

  /**
   * Atualiza um contato existente.
   * 
   * @param {number} id
   * @param {Object} input
   * @returns {Promise<Object>}
   */
  static async updateContact(id, input) {
    return await prismaInstance.contact.update({
      where: { id },
      data: {
        ...input,
        organizationId: input.organizationId
      }
    })
  }

  /**
   * Encontra um contato pelo ID.
   * 
   * @param {number} id
   * @returns {Promise<Object>}
   */
  static async findContactById(id) {
    return await prismaInstance.contact.findUnique({
      where: { id }
    })
  }

  /**
   * Deleta um contato pelo ID.
   * 
   * @param {number} id
   * @returns {Promise<Object>}
   */
  static async deleteContact(id) {
    return await prismaInstance.contact.delete({
      where: { id }
    })
  }
}