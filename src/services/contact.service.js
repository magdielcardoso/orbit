import { BaseService } from './base.service'

class ContactService extends BaseService {
  // Queries
  async getContacts(organizationId) {
    const query = `
      query GetContacts($organizationId: ID!) {
        contacts(organizationId: $organizationId) {
          id
          name
          email
          phone
          avatar
          tags
          notes
          lastContactedAt
          createdAt
          updatedAt
        }
      }
    `
    return this.request(query, { organizationId })
  }

  async getContactById(id) {
    const query = `
      query GetContact($id: ID!) {
        contact(id: $id) {
          id
          name
          email
          phone
          avatar
          tags
          notes
          lastContactedAt
          conversations {
            id
            status
            subject
          }
          createdAt
          updatedAt
        }
      }
    `
    return this.request(query, { id })
  }

  // Mutations
  async createContact(input) {
    const mutation = `
      mutation CreateContact($input: ContactInput!) {
        createContact(input: $input) {
          id
          name
          email
          phone
          avatar
          tags
          notes
        }
      }
    `
    return this.request(mutation, { input })
  }

  async updateContact(id, input) {
    const mutation = `
      mutation UpdateContact($id: ID!, $input: ContactInput!) {
        updateContact(id: $id, input: $input) {
          id
          name
          email
          phone
          avatar
          tags
          notes
        }
      }
    `
    return this.request(mutation, { id, input })
  }

  // Métodos auxiliares
  formatPhoneNumber(phone) {
    if (!phone) return ''
    return phone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3')
  }

  getAvatarFallback(name) {
    return name ? name.charAt(0).toUpperCase() : '?'
  }
}

export default new ContactService() 