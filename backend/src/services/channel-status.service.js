import { PubSub } from 'graphql-subscriptions'
import { loggerService } from '../controllers/logger.controller.js'
import { EvolutionApiService } from './evolution-api.service.js'

const pubsub = new PubSub()

export class ChannelStatusService {
  constructor() {
    this.CHANNEL_STATUS_CHANGED = 'CHANNEL_STATUS_CHANGED'
    this.activeInstances = new Map() // Armazena instâncias ativas
  }

  async startInstanceMonitoring(instanceConfig) {
    const { instanceId, serverUrl, apiKey } = instanceConfig
    
    // Cria nova instância do serviço Evolution API
    const evolutionApi = new EvolutionApiService(serverUrl, apiKey)
    
    // Inicia monitoramento
    await evolutionApi.startStatusPolling(instanceId, (status) => {
      this.updateChannelStatus(instanceId, status.status, {
        qrcode: status.qrcode,
        lastUpdate: new Date()
      })
    })

    // Armazena instância para limpeza posterior
    this.activeInstances.set(instanceId, evolutionApi)
  }

  stopInstanceMonitoring(instanceId) {
    const instance = this.activeInstances.get(instanceId)
    if (instance) {
      instance.stopStatusPolling()
      this.activeInstances.delete(instanceId)
    }
  }

  async updateChannelStatus(inboxId, status, metadata = {}) {
    try {
      const statusUpdate = {
        inboxId,
        status,
        metadata,
        lastUpdate: new Date()
      }

      // Publica a atualização de status
      await pubsub.publish(`${this.CHANNEL_STATUS_CHANGED}.${inboxId}`, {
        channelStatusChanged: statusUpdate
      })

      loggerService.info('Status do canal atualizado', {
        inboxId,
        status,
        metadata
      })

      return statusUpdate
    } catch (error) {
      loggerService.error('Erro ao atualizar status do canal:', {
        error: error.message,
        inboxId,
        status
      })
      throw error
    }
  }

  getStatusSubscription(inboxId) {
    return pubsub.asyncIterator([`${this.CHANNEL_STATUS_CHANGED}.${inboxId}`])
  }
}

export const channelStatusService = new ChannelStatusService() 