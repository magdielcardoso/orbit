import InboxModel from '../models/inbox.model.js'
import OrganizationModel from '../models/organization.model.js'
import EvolutionService from './integrations/evolution.service.js'

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
      console.log('1. InboxService.createInbox recebeu:', {
        input,
        settings: input.settings,
        settingsType: typeof input.settings
      })

      const orgUser = await OrganizationModel.findOrganizationUser(user.id, input.organizationId)

      if (!orgUser) {
        throw new Error('Não autorizado: usuário não pertence a esta organização')
      }

      // Se for um canal WhatsApp e tiver configurações da Evolution
      if (input.channelType === 'WHATSAPP' && input.settings?.evolution) {
        console.log('2. Configurações Evolution detectadas:', input.settings.evolution)

        // Cria a instância na Evolution API
        const evolutionInstance = await EvolutionService.createInstance({
          serverUrl: input.settings.evolution.serverUrl,
          apiKey: input.settings.evolution.apiKey,
          instanceName: input.settings.evolution.instanceName,
          phoneNumber: input.settings.evolution.phoneNumber,
          webhookUrl: input.settings.evolution.webhookUrl
        })

        console.log('3. Resposta da Evolution API:', evolutionInstance)

        // Adiciona os dados retornados da Evolution à configuração
        input.settings.evolution.instanceId = evolutionInstance.instance.instanceId
      }

      const result = await InboxModel.createInbox(input)
      console.log('4. Resultado final do createInbox:', result)
      return result
    } catch (error) {
      console.error('5. Erro no InboxService:', error)
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

      // Se for um canal WhatsApp com Evolution configurada, deleta a instância
      if (inbox.channelType === 'WHATSAPP' && inbox.settings?.evolution) {
        await EvolutionService.deleteInstance({
          serverUrl: inbox.settings.evolution.serverUrl,
          apiKey: inbox.settings.evolution.apiKey,
          instanceName: inbox.settings.evolution.instanceName
        })
      }

      return await InboxModel.deleteInbox(id)
    } catch (error) {
      console.error('Erro ao excluir caixa de entrada:', error)
      throw error
    }
  }
}
