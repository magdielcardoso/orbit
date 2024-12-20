import { BaseService } from './base.service'
import { gqlRequest } from '@/utils/graphql'

class OrganizationService extends BaseService {
  async getOrganizations() {
    try {
      const query = `
        query GetOrganizations {
          organizations {
            id
            name
            slug
            plan
            status
            createdAt
            updatedAt
          }
        }
      `
      const response = await this.request(query)
      return response.organizations
    } catch (error) {
      console.error('Erro ao buscar organizações:', error)
      throw error
    }
  }

  async getOrganization(id) {
    try {
      const query = `
        query GetOrganization($id: ID!) {
          organization(id: $id) {
            id
            name
            slug
            plan
            status
            features
            settings
            createdAt
            updatedAt
          }
        }
      `
      const response = await this.request(query, { id })
      return response.organization
    } catch (error) {
      console.error('Erro ao buscar organização:', error)
      throw error
    }
  }

  async validateSlug(slug) {
    try {
      const query = `
        query ValidateOrganizationSlug($slug: String!) {
          validateOrganizationSlug(slug: $slug) {
            available
            organization {
              hash_id
              name
              slug
              domain
            }
          }
        }
      `
      const response = await this.request(query, { slug })
      return response.validateOrganizationSlug
    } catch (error) {
      console.error('Erro ao validar slug:', error)
      throw error
    }
  }
}

export default new OrganizationService() 