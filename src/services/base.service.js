import { gqlRequest } from '@/utils/graphql'
import { useAuthStore } from '@/stores/auth.store'

export class BaseService {
  get authStore() {
    return useAuthStore()
  }

  async request(query, variables = {}, options = {}) {
    try {
      // Adiciona token automaticamente se existir
      if (this.authStore?.token) {
        options.headers = {
          ...options.headers,
          Authorization: `Bearer ${this.authStore.token}`
        }
      }

      const response = await gqlRequest(query, variables, options)
      return response
    } catch (error) {
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