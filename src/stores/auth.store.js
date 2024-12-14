import { defineStore } from 'pinia';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('token') || null,
    user: JSON.parse(localStorage.getItem('user')) || null,
    currentOrganization: JSON.parse(localStorage.getItem('currentOrganization')) || null,
    sessionExpires: null,
    refreshing: false
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
    hasPermission: (state) => (permission) => {
      return state.user?.role?.permissions?.some(p => p.name === permission) || false
    },
    currentOrganizationId: (state) => state.currentOrganization?.id
  },

  actions: {
    setAuth({ token, user }) {
      this.token = token
      this.user = user
      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(user))
    },

    setCurrentOrganization(organization) {
      this.currentOrganization = organization
      localStorage.setItem('currentOrganization', JSON.stringify(organization))
    },

    clearAuth() {
      this.token = null
      this.user = null
      this.currentOrganization = null
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      localStorage.removeItem('currentOrganization')
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