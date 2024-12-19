import SystemModel from '../models/system.model.js'

export default class SystemService {
  /**
   * Obtém o status do sistema.
   * 
   * @param {object} prisma
   * @returns {Promise<object>}
   */
  static async getSystemStatus(prisma) {
    try {
      const systemConfig = await SystemModel.findConfiguredSystem(prisma)

      return {
        configured: !!systemConfig,
        version: process.env.APP_VERSION || '1.0.0',
        status: systemConfig ? 'online' : 'PENDING_SETUP'
      }
    } catch (error) {
      console.error('Erro ao verificar status do sistema:', error)
      return {
        configured: false,
        version: process.env.APP_VERSION || '1.0.0',
        status: 'error'
      }
    }
  }
}