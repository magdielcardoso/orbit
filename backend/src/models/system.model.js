import { prismaInstance } from '../plugins/prisma.plugin.js'

export default class SystemModel {
  /**
   * Encontra a configuração do sistema.
   * 
   * @returns {Promise<object|null>}
   */
  static async findConfiguredSystem() {
    return await prismaInstance.systemConfig.findFirst({
      where: {
        status: 'CONFIGURED'
      }
    })
  }
}