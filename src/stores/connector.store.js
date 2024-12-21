import { defineStore } from 'pinia'
import { ConnectorService } from '@/services'

export const useConnectorStore = defineStore('connector', {
  state: () => ({
    connectors: [],
    currentConnector: null,
    loading: false,
    error: null
  }),

  getters: {
    getConnectorById: (state) => (id) => {
      return state.connectors.find(connector => connector.id === id)
    },

    activeConnectors: (state) => {
      return state.connectors.filter(connector => connector.isEnabled)
    },

    connectorsByType: (state) => (type) => {
      return state.connectors.filter(connector => connector.type === type)
    }
  },

  actions: {
    async fetchConnectors() {
      try {
        console.log('ConnectorStore - Iniciando fetchConnectors')
        this.loading = true
        const connectors = await ConnectorService.listConnectors()
        console.log('ConnectorStore - Connectors recebidos:', connectors)
        this.$patch({
          connectors: Array.isArray(connectors) ? [...connectors] : []
        })
        console.log('ConnectorStore - Estado atualizado:', this.connectors)
      } catch (error) {
        console.error('ConnectorStore - Erro:', error)
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async createConnector(input) {
      try {
        this.loading = true
        const response = await ConnectorService.createConnector(input)
        this.connectors.push(response)
        return response
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async updateConnector(id, input) {
      try {
        this.loading = true
        const response = await ConnectorService.updateConnector(id, input)
        const index = this.connectors.findIndex(c => c.id === id)
        if (index !== -1) {
          this.connectors[index] = response
        }
        return response
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async deleteConnector(id) {
      try {
        this.loading = true
        await ConnectorService.deleteConnector(id)
        const index = this.connectors.findIndex(c => c.id === id)
        if (index !== -1) {
          this.connectors.splice(index, 1)
        }
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async toggleConnector(id, isEnabled) {
      try {
        this.loading = true
        const response = await ConnectorService.toggleConnector(id, isEnabled)
        const index = this.connectors.findIndex(c => c.id === id)
        if (index !== -1) {
          this.connectors[index].isEnabled = response.isEnabled
        }
        return response
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async testConnector(config) {
      try {
        this.loading = true
        return await ConnectorService.testConnector(config)
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    setCurrentConnector(connector) {
      this.currentConnector = connector
    },

    clearError() {
      this.error = null
    }
  }
}) 