import { BaseService } from './base.service'

class InboxService extends BaseService {
  async getInboxes(organizationId) {
    const query = `
      query GetInboxes($organizationId: ID!) {
        inboxes(organizationId: $organizationId) {
          id
          name
          description
          channelType
          isEnabled
          settings
          createdAt
          updatedAt
        }
      }
    `
    return this.request(query, { organizationId })
  }

  async createInbox(input) {
    const mutation = `
      mutation CreateInbox($input: InboxInput!) {
        createInbox(input: $input) {
          id
          name
          description
          channelType
          isEnabled
          settings
        }
      }
    `
    return this.request(mutation, { input })
  }

  async updateInbox(id, input) {
    const mutation = `
      mutation UpdateInbox($id: ID!, $input: InboxInput!) {
        updateInbox(id: $id, input: $input) {
          id
          name
          description
          channelType
          isEnabled
          settings
        }
      }
    `
    return this.request(mutation, { id, input })
  }

  // Métodos auxiliares
  getChannelTypeIcon(type) {
    const icons = {
      WHATSAPP: 'mdi-whatsapp',
      EMAIL: 'mdi-email',
      WEBCHAT: 'mdi-chat',
      TELEGRAM: 'mdi-telegram',
      INSTAGRAM: 'mdi-instagram',
      MESSENGER: 'mdi-facebook-messenger'
    }
    return icons[type] || 'mdi-chat'
  }

  getChannelTypeLabel(type) {
    const labels = {
      WHATSAPP: 'WhatsApp',
      EMAIL: 'E-mail',
      WEBCHAT: 'Chat do Site',
      TELEGRAM: 'Telegram',
      INSTAGRAM: 'Instagram',
      MESSENGER: 'Messenger'
    }
    return labels[type] || type
  }
}

export default new InboxService() 