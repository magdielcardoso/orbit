import { BaseService } from './base.service'

class ConnectorService extends BaseService {
  // Queries
  async listConnectors() {
    const query = `
      query ListConnectors {
        connectors {
          id
          name
          description
          source
          config
          isEnabled
          status
          createdAt
          updatedAt
        }
      }
    `
    console.log('ConnectorService - Iniciando listConnectors')
    const response = await this.request(query)
    console.log('ConnectorService - Resposta bruta:', response)
    return response.connectors || []
  }

  async getConnector(id) {
    const query = `
      query GetConnector($id: ID!) {
        connector(id: $id) {
          id
          name
          description
          source
          config
          isEnabled
          status
          createdAt
          updatedAt
        }
      }
    `
    return this.request(query, { id })
  }

  // Mutations
  async createConnector(input) {
    const mutation = `
      mutation CreateConnector($input: ConnectorInput!) {
        createConnector(input: $input) {
          id
          name
          description
          source
          config
          isEnabled
          status
        }
      }
    `
    return this.request(mutation, { input })
  }

  async updateConnector(id, input) {
    const mutation = `
      mutation UpdateConnector($id: ID!, $input: ConnectorInput!) {
        updateConnector(id: $id, input: $input) {
          id
          name
          description
          source
          config
          isEnabled
          status
        }
      }
    `
    return this.request(mutation, { id, input })
  }

  async deleteConnector(id) {
    const mutation = `
      mutation DeleteConnector($id: ID!) {
        deleteConnector(id: $id)
      }
    `
    return this.request(mutation, { id })
  }

  async toggleConnector(id, isEnabled) {
    const mutation = `
      mutation ToggleConnector($id: ID!, $isEnabled: Boolean!) {
        toggleConnector(id: $id, isEnabled: $isEnabled) {
          id
          isEnabled
        }
      }
    `
    return this.request(mutation, { id, isEnabled })
  }
}

export default new ConnectorService() 