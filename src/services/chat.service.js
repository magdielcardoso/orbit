import { gqlRequest } from '@/utils/graphql'

class ChatService {
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
          updatedAt
          contact {
            id
            name
            avatar
          }
          assignee {
            id
            name
            avatar
          }
          inbox {
            id
            name
            channelType
          }
          messages(last: 1) {
            id
            content
            type
            isFromContact
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
      }
    `

    const response = await gqlRequest(query, {
      organizationId,
      filters
    })

    return response.conversations
  }

  async sendMessage(input) {
    const mutation = `
      mutation SendMessage($input: MessageInput!) {
        createMessage(input: $input) {
          id
          content
          createdAt
          sender {
            id
            name
            avatar
          }
        }
      }
    `

    const response = await gqlRequest(mutation, { input })
    return response.createMessage
  }
}

export const chatService = new ChatService() 