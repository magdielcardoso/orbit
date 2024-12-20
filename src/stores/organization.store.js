import { defineStore } from 'pinia'
import { OrganizationService } from '@/services'

export const useOrganizationStore = defineStore('organization', {
  state: () => ({
    organizations: [],
    currentOrganization: null,
    features: {},
    loading: false,
    error: null
  }),

  getters: {
    getOrganizationById: (state) => (id) => {
      return state.organizations.find(org => org.id === id)
    },

    hasFeature: (state) => (feature) => {
      return state.currentOrganization?.features?.[feature] || false
    },

    availableChannels: (state) => {
      const features = state.currentOrganization?.features || {}
      return Object.entries(features)
        .filter(([_, enabled]) => enabled)
        .map(([channel]) => channel.toUpperCase())
    }
  },

  actions: {
    async fetchOrganizations() {
      try {
        this.loading = true
        const response = await OrganizationService.getOrganizations()
        this.organizations = response.organizations
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async updateOrganization(id, input) {
      try {
        const response = await OrganizationService.updateOrganization(id, input)
        const index = this.organizations.findIndex(org => org.id === id)
        if (index !== -1) {
          this.organizations[index] = response
        }
        if (this.currentOrganization?.id === id) {
          this.currentOrganization = response
        }
        return response
      } catch (error) {
        this.error = error.message
        throw error
      }
    },

    setCurrentOrganization(organization) {
      this.currentOrganization = organization
      this.features = organization?.features || {}
    }
  }
}) 