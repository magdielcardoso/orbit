import { BaseService } from './base.service'

class TeamService extends BaseService {
  async getTeams(organizationId) {
    const query = `
      query GetTeams($organizationId: ID!) {
        teams(organizationId: $organizationId) {
          id
          name
          description
          members {
            id
            name
            email
            avatar
            role
          }
          createdAt
          updatedAt
        }
      }
    `
    return this.request(query, { organizationId })
  }

  async createTeam(input) {
    const mutation = `
      mutation CreateTeam($input: TeamInput!) {
        createTeam(input: $input) {
          id
          name
          description
          members {
            id
            name
            email
          }
        }
      }
    `
    return this.request(mutation, { input })
  }

  async updateTeam(id, input) {
    const mutation = `
      mutation UpdateTeam($id: ID!, $input: TeamInput!) {
        updateTeam(id: $id, input: $input) {
          id
          name
          description
          members {
            id
            name
            email
          }
        }
      }
    `
    return this.request(mutation, { id, input })
  }

  async addTeamMember(teamId, userId) {
    const mutation = `
      mutation AddTeamMember($teamId: ID!, $userId: ID!) {
        addTeamMember(teamId: $teamId, userId: $userId) {
          id
          members {
            id
            name
            email
          }
        }
      }
    `
    return this.request(mutation, { teamId, userId })
  }

  async removeTeamMember(teamId, userId) {
    const mutation = `
      mutation RemoveTeamMember($teamId: ID!, $userId: ID!) {
        removeTeamMember(teamId: $teamId, userId: $userId) {
          id
          members {
            id
            name
            email
          }
        }
      }
    `
    return this.request(mutation, { teamId, userId })
  }
}

export default new TeamService() 