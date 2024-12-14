import { defineStore } from 'pinia';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('token') || null,
    user: JSON.parse(localStorage.getItem('user')) || null,
    sessionExpires: null,
    refreshing: false
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
    },

    async checkAndRefreshToken() {
      if (!this.token || !this.sessionExpires) return;
      
      const expiresIn = new Date(this.sessionExpires).getTime() - Date.now();
      if (expiresIn < 300000) { // 5 minutos
        await this.refreshToken();
      }
    },

    async refreshToken() {
      if (this.refreshing) return;
      this.refreshing = true;

      try {
        const query = `
          mutation RefreshToken {
            refreshToken {
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
                sessionExpires
              }
            }
          }
        `;

        const response = await gqlRequest(query);
        if (response?.refreshToken) {
          this.setAuth({
            token: response.refreshToken.token,
            user: response.refreshToken.user
          });
        }
      } catch (error) {
        console.error('Erro ao atualizar token:', error);
        this.logout();
      } finally {
        this.refreshing = false;
      }
    }
  }
}); 