import { defineStore } from 'pinia'
import { ContactService } from '@/services'

export const useContactStore = defineStore('contact', {
  state: () => ({
    contacts: [],
    currentContact: null,
    loading: false,
    error: null
  }),

  getters: {
    getContactById: (state) => (id) => {
      return state.contacts.find(contact => contact.id === id)
    },

    sortedContacts: (state) => {
      return [...state.contacts].sort((a, b) => a.name.localeCompare(b.name))
    }
  },

  actions: {
    async fetchContacts(organizationId, filters = {}) {
      try {
        this.loading = true
        const response = await ContactService.getContacts(organizationId, filters)
        this.contacts = response.contacts
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async createContact(input) {
      try {
        const response = await ContactService.createContact(input)
        this.contacts.push(response)
        return response
      } catch (error) {
        this.error = error.message
        throw error
      }
    },

    async updateContact(id, input) {
      try {
        const response = await ContactService.updateContact(id, input)
        const index = this.contacts.findIndex(c => c.id === id)
        if (index !== -1) {
          this.contacts[index] = response
        }
        return response
      } catch (error) {
        this.error = error.message
        throw error
      }
    },

    setCurrentContact(contact) {
      this.currentContact = contact
    }
  }
}) 