import { gqlRequest } from '@/utils/graphql'
import { useAuthStore } from '@/stores/auth.store'

export class BaseService {
  get authStore() {
    return useAuthStore()
  }

  async request(query, variables = {}, options = {}) {
    try {
      console.log('BaseService - Request iniciada:', { query, variables, options })
      
      if (this.authStore?.token) {
        options.headers = {
          ...options.headers,
          Authorization: `Bearer ${this.authStore.token}`
        }
      }

      const response = await gqlRequest(query, variables, options)
      console.log('BaseService - Resposta recebida:', response)
      return response
    } catch (error) {
      console.error('BaseService - Erro na requisição:', error)
      this.handleError(error)
    }
  }

  handleError(error) {
    // Tratamento centralizado de erros
    if (error.message.includes('autoriza') || error.message.includes('autentica')) {
      this.authStore?.logout()
      router.push('/login')
    }
    throw error
  }
}