import { defineStore } from 'pinia';
import { jwtDecode } from 'jwt-decode';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: null,
    isAuthenticated: false,
    permissions: []
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
      
      if (data.token) {
        try {
          const decoded = jwtDecode(data.token);
          console.log('Token decodificado:', decoded);
          this.permissions = decoded.permissions || [];
          console.log('Permissões carregadas:', this.permissions);
        } catch (error) {
          console.error('Erro ao decodificar token:', error);
          this.permissions = [];
        }
      }
      
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
      this.permissions = [];
      localStorage.removeItem('auth');
      sessionStorage.removeItem('auth');
    },

    initAuth() {
      const auth = localStorage.getItem('auth') || sessionStorage.getItem('auth');
      if (auth) {
        console.log('Iniciando autenticação com dados salvos');
        const data = JSON.parse(auth);
        this.setAuth(data);
      }
    },

    hasPermission(permissionName) {
      console.log('Verificando permissão:', permissionName);
      console.log('Permissões disponíveis:', this.permissions);
      return this.permissions?.includes(permissionName) ?? false;
    }
  },

  getters: {
    userRole: (state) => state.user?.role,
    userPermissions: (state) => state.permissions
  }
}); 