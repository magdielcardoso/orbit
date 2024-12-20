import { BaseService } from './base.service'

class LabelService extends BaseService {
  async getLabels() {
    const query = `
      query GetLabels {
        labels {
          id
          name
          color
          description
        }
      }
    `
    return this.request(query)
  }

  async addToConversation(conversationId, labelId) {
    const mutation = `
      mutation AddLabel($conversationId: ID!, $labelId: ID!) {
        addConversationLabel(conversationId: $conversationId, labelId: $labelId) {
          id
          labels {
            id
            name
            color
          }
        }
      }
    `
    return this.request(mutation, { conversationId, labelId })
  }
}

export default new LabelService() 