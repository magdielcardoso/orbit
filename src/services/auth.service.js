import { BaseService } from './base.service'
import { setAuthToken } from '@/utils/graphql'

class AuthService extends BaseService {
  async login(email, password) {
    const mutation = `
      mutation Login($email: String!, $password: String!) {
        login(email: $email, password: $password) {
          token
          user {
            id
            name
            email
            role {
              name
              permissions {
                name
              }
            }
          }
        }
      }
    `
    
    const response = await this.request(mutation, { email, password })
    if (response?.login?.token) {
      setAuthToken(response.login.token)
      return response.login
    }
    throw new Error('Resposta inválida do servidor')
  }

  async logout() {
    const mutation = `
      mutation Logout {
        logout {
          success
          message
        }
      }
    `
    
    try {
      await this.request(mutation)
    } finally {
      setAuthToken(null)
    }
  }

  async register(input) {
    const mutation = `
      mutation Register($input: RegisterInput!) {
        register(input: $input) {
          token
          user {
            id
            name
            email
            role {
              name
              permissions {
                name
              }
            }
          }
        }
      }
    `
    
    const response = await this.request(mutation, { input })
    if (response?.register?.token) {
      setAuthToken(response.register.token)
    }
    return response.register
  }

  async forgotPassword(email) {
    const mutation = `
      mutation ForgotPassword($email: String!) {
        forgotPassword(email: $email) {
          success
          message
        }
      }
    `
    
    return this.request(mutation, { email })
  }

  async resetPassword(token, password) {
    const mutation = `
      mutation ResetPassword($token: String!, $password: String!) {
        resetPassword(token: $token, password: $password) {
          success
          message
        }
      }
    `
    
    return this.request(mutation, { token, password })
  }

  async verifyEmail(token) {
    const mutation = `
      mutation VerifyEmail($token: String!) {
        verifyEmail(token: $token) {
          success
          message
        }
      }
    `
    
    return this.request(mutation, { token })
  }
}

export default new AuthService()