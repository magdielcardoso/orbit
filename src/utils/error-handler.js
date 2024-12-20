import { useAuthStore } from '@/stores/auth.store'
import { showToast } from '@/utils/toast'

export function handleError(error) {
  console.error('Erro:', error)

  // Erros de autenticação/autorização
  if (error.message.includes('autoriza') || error.message.includes('autentica')) {
    const authStore = useAuthStore()
    authStore.logout()
    router.push('/login')
    showToast('Sessão expirada. Por favor, faça login novamente.', 'error')
    return
  }

  // Erros de validação
  if (error.message.includes('validação')) {
    showToast(error.message, 'warning')
    return
  }

  // Erros de conexão
  if (error.message.includes('Failed to fetch')) {
    showToast('Erro de conexão. Verifique sua internet.', 'error')
    return
  }

  // Outros erros
  showToast(error.message, 'error')
} 