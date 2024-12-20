import { BaseService } from './base.service'

class MessageService extends BaseService {
  async sendMessage(input) {
    const mutation = `
      mutation SendMessage($input: MessageInput!) {
        sendMessage(input: $input) {
          id
          content
          type
          isFromContact
          metadata
          createdAt
          user {
            id
            name
            avatar
          }
          contact {
            id
            name
            avatar
          }
        }
      }
    `
    return this.request(mutation, { input })
  }

  // Métodos auxiliares
  formatMessageTime(date) {
    return new Date(date).toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  getMessageStatusIcon(status) {
    const icons = {
      SENT: 'mdi-check',
      DELIVERED: 'mdi-check-all',
      READ: 'mdi-check-all text-primary',
      FAILED: 'mdi-alert-circle text-error'
    }
    return icons[status] || 'mdi-clock-outline'
  }
}

export default new MessageService() 