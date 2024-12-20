import { BaseService } from './base.service'

class AutomationService extends BaseService {
  async getAutomations(organizationId) {
    const query = `
      query GetAutomations($organizationId: ID!) {
        automations(organizationId: $organizationId) {
          id
          name
          description
          trigger
          conditions
          actions
          isActive
          createdAt
          updatedAt
        }
      }
    `
    return this.request(query, { organizationId })
  }

  async createAutomation(input) {
    const mutation = `
      mutation CreateAutomation($input: AutomationInput!) {
        createAutomation(input: $input) {
          id
          name
          description
          trigger
          conditions
          actions
          isActive
        }
      }
    `
    return this.request(mutation, { input })
  }

  async updateAutomation(id, input) {
    const mutation = `
      mutation UpdateAutomation($id: ID!, $input: AutomationInput!) {
        updateAutomation(id: $id, input: $input) {
          id
          name
          description
          trigger
          conditions
          actions
          isActive
        }
      }
    `
    return this.request(mutation, { id, input })
  }

  async toggleAutomation(id) {
    const mutation = `
      mutation ToggleAutomation($id: ID!) {
        toggleAutomation(id: $id) {
          id
          isActive
        }
      }
    `
    return this.request(mutation, { id })
  }

  // Métodos auxiliares
  getTriggerLabel(trigger) {
    const labels = {
      MESSAGE_RECEIVED: 'Mensagem recebida',
      CONTACT_CREATED: 'Contato criado',
      CONVERSATION_OPENED: 'Conversa iniciada',
      CONVERSATION_CLOSED: 'Conversa encerrada',
      TAG_ADDED: 'Etiqueta adicionada'
    }
    return labels[trigger] || trigger
  }

  getActionTypeLabel(type) {
    const labels = {
      SEND_MESSAGE: 'Enviar mensagem',
      ADD_TAG: 'Adicionar etiqueta',
      ASSIGN_TEAM: 'Atribuir equipe',
      NOTIFY_USER: 'Notificar usuário',
      UPDATE_CONTACT: 'Atualizar contato'
    }
    return labels[type] || type
  }
}

export default new AutomationService() 