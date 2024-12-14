import { defineStore } from 'pinia';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('token') || null,
    user: JSON.parse(localStorage.getItem('user')) || null
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
    hasPermission: (state) => (permission) => {
      console.log('Checking permission:', permission)
      console.log('User:', state.user)
      console.log('User role:', state.user?.role)
      console.log('User permissions:', state.user?.role?.permissions)
      
      // Verifica se o usuário tem a role e as permissões
      return state.user?.role?.permissions?.some(p => p.name === permission) || false
    }
  },

  actions: {
    setAuth({ token, user }) {
      console.log('Setting auth with user:', user) // Debug
      this.token = token
      this.user = user
      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(user))
    },

    clearAuth() {
      this.token = null
      this.user = null
      localStorage.removeItem('token')
      localStorage.removeItem('user')
    },

    async logout() {
      this.clearAuth()
    }
  }
}); 