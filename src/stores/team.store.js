import { defineStore } from 'pinia'
import { TeamService } from '@/services'

export const useTeamStore = defineStore('team', {
  state: () => ({
    teams: [],
    loading: false,
    error: null
  }),

  getters: {
    getTeamById: (state) => (id) => {
      return state.teams.find(team => team.id === id)
    },

    getTeamMembers: (state) => (teamId) => {
      const team = state.teams.find(t => t.id === teamId)
      return team?.members || []
    }
  },

  actions: {
    async fetchTeams(organizationId) {
      try {
        this.loading = true
        const response = await TeamService.getTeams(organizationId)
        this.teams = response.teams
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async addTeamMember(teamId, userId) {
      try {
        const response = await TeamService.addTeamMember(teamId, userId)
        const index = this.teams.findIndex(t => t.id === teamId)
        if (index !== -1) {
          this.teams[index].members = response.members
        }
      } catch (error) {
        this.error = error.message
        throw error
      }
    },

    async removeTeamMember(teamId, userId) {
      try {
        const response = await TeamService.removeTeamMember(teamId, userId)
        const index = this.teams.findIndex(t => t.id === teamId)
        if (index !== -1) {
          this.teams[index].members = response.members
        }
      } catch (error) {
        this.error = error.message
        throw error
      }
    }
  }
}) 