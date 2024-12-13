import { defineStore } from 'pinia';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: null,
    isAuthenticated: false
  }),

  actions: {
    async login(credentials) {
      try {
        const response = await fetch('/api/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(credentials)
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.message);
        }

        const data = await response.json();
        this.setAuth(data, credentials.rememberMe);
        return data;
      } catch (error) {
        throw error;
      }
    },

    async register(userData) {
      try {
        const response = await fetch('/api/auth/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(userData)
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.message);
        }

        const data = await response.json();
        this.setAuth(data, true);
        return data;
      } catch (error) {
        throw error;
      }
    },

    setAuth(data, rememberMe = false) {
      this.user = data.user;
      this.token = data.token;
      this.isAuthenticated = true;
      
      if (rememberMe) {
        localStorage.setItem('auth', JSON.stringify(data));
      } else {
        sessionStorage.setItem('auth', JSON.stringify(data));
      }
    },

    logout() {
      this.user = null;
      this.token = null;
      this.isAuthenticated = false;
      localStorage.removeItem('auth');
      sessionStorage.removeItem('auth');
    },

    initAuth() {
      const auth = localStorage.getItem('auth') || sessionStorage.getItem('auth');
      if (auth) {
        const data = JSON.parse(auth);
        this.setAuth(data);
      }
    },

    hasPermission(permissionName) {
      return this.user?.permissions?.includes(permissionName) ?? false;
    }
  },

  getters: {
    userRole: (state) => state.user?.role
  }
}); 