import { gqlRequest } from '@/utils/graphql'

export class ChatService {
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

  async sendMessage(conversationId, content) {
    const mutation = `
      mutation SendMessage($input: MessageInput!) {
        sendMessage(input: $input) {
          id
          conversationId
          content
          type
          isFromContact
          createdAt
          updatedAt
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

    const variables = {
      input: {
        conversationId,
        content
      }
    }

    const response = await gqlRequest(mutation, variables)
    return response.sendMessage
  }
}

export default new ChatService() 