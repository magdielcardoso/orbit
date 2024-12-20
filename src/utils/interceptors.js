import axios from 'axios'
import { useAuthStore } from '@/stores/auth.store'

export function setupInterceptors() {
  axios.interceptors.request.use(config => {
    const authStore = useAuthStore()
    if (authStore.token) {
      config.headers.Authorization = `Bearer ${authStore.token}`
    }
    return config
  })

  axios.interceptors.response.use(
    response => response,
    error => {
      if (error.response?.status === 401) {
        const authStore = useAuthStore()
        authStore.logout()
      }
      return Promise.reject(error)
    }
  )
} 