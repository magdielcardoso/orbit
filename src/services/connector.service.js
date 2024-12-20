import { BaseService } from './base.service'

class ConnectorService extends BaseService {
  // Queries
  async getConnectors(organizationId) {
    const query = `
      query GetConnectors($organizationId: ID!) {
        connectors(organizationId: $organizationId) {
          id
          name
          type
          config
          isEnabled
          createdAt
          updatedAt
        }
      }
    `
    return this.request(query, { organizationId })
  }

  async getConnectorById(id) {
    const query = `
      query GetConnector($id: ID!) {
        connector(id: $id) {
          id
          name
          type
          config
          isEnabled
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
          type
          config
          isEnabled
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
          type
          config
          isEnabled
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

  async testConnector(config) {
    const mutation = `
      mutation TestConnector($config: JSONObject!) {
        testConnector(config: $config) {
          success
          message
        }
      }
    `
    return this.request(mutation, { config })
  }
}

export default new ConnectorService() 