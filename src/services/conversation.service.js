import { BaseService } from './base.service'

class ConversationService extends BaseService {
  async getConversations(organizationId, filters = {}) {
    const query = `
      query GetConversations($organizationId: ID!, $filters: ConversationFilters) {
        conversations(organizationId: $organizationId, filters: $filters) {
          id
          status
          priority
          subject
          unreadCount
          lastMessageAt
          assignee {
            id
            name
            avatar
          }
          contact {
            id
            name
            avatar
          }
          inbox {
            id
            name
            channelType
          }
        }
      }
    `
    return this.request(query, { organizationId, filters })
  }

  async assignConversation(id, assigneeId) {
    const mutation = `
      mutation AssignConversation($id: ID!, $assigneeId: ID) {
        assignConversation(id: $id, assigneeId: $assigneeId) {
          id
          assignee {
            id
            name
          }
        }
      }
    `
    return this.request(mutation, { id, assigneeId })
  }

  async changeStatus(id, status) {
    const mutation = `
      mutation ChangeStatus($id: ID!, $status: ConversationStatus!) {
        changeConversationStatus(id: $id, status: $status) {
          id
          status
        }
      }
    `
    return this.request(mutation, { id, status })
  }
}

export default new ConversationService() 