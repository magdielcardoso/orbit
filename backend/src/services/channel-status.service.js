import { PubSub } from 'graphql-subscriptions'
import { loggerService } from '../controllers/logger.controller.js'

const pubsub = new PubSub()

export class ChannelStatusService {
  constructor() {
    this.CHANNEL_STATUS_CHANGED = 'CHANNEL_STATUS_CHANGED'
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
      await pubsub.publish(this.CHANNEL_STATUS_CHANGED, {
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
    return pubsub.asyncIterator([this.CHANNEL_STATUS_CHANGED])
  }
}

export const channelStatusService = new ChannelStatusService() 