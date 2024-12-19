import { prismaInstance } from '../plugins/prisma.plugin.js'

export default class ContactModel {
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

  static async createContact(input) {
    return await prismaInstance.contact.create({
      data: {
        ...input,
        organizationId: input.organizationId
      }
    })
  }

  static async findContactByIdAndOrganizationId(id, organizationId) {
    return await prismaInstance.contact.findFirst({
      where: {
        id,
        organizationId
      }
    })
  }

  static async updateContact(id, input) {
    return await prismaInstance.contact.update({
      where: { id },
      data: {
        ...input,
        organizationId: input.organizationId
      }
    })
  }

  static async findContactById(id) {
    return await prismaInstance.contact.findUnique({
      where: { id }
    })
  }

  static async deleteContact(id) {
    return await prismaInstance.contact.delete({
      where: { id }
    })
  }
}