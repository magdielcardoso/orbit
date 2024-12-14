import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { gqlRequest } from '../utils/graphql';

export const useAuthStore = defineStore('auth', () => {
  const token = ref(localStorage.getItem('token') || '');
  const user = ref(JSON.parse(localStorage.getItem('user') || 'null'));

  const isAuthenticated = computed(() => !!token.value);
  const userRole = computed(() => user.value?.role || null);

  async function login(credentials) {
    const loginMutation = `
      mutation Login($email: String!, $password: String!) {
        login(email: $email, password: $password) {
          token
          user {
            id
            name
            email
            role
            permissions
          }
        }
      }
    `;

    const response = await gqlRequest(loginMutation, credentials);
    await setAuth(response.login, credentials.rememberMe);
    return response.login;
  }

  async function register(userData) {
    const registerMutation = `
      mutation Register($email: String!, $password: String!, $name: String!) {
        register(email: $email, password: $password, name: $name) {
          token
          user {
            id
            name
            email
            role
            permissions
          }
        }
      }
    `;

    const response = await gqlRequest(registerMutation, userData);
    await setAuth(response.register, true);
    return response.register;
  }

  function hasPermission(permission) {
    return user.value?.permissions?.includes(permission) || false;
  }

  function setAuth(authData, remember = false) {
    if (!authData) {
      console.error('Dados de autenticação inválidos');
      return;
    }

    token.value = authData.token;
    user.value = authData.user;

    localStorage.setItem('token', authData.token);
    localStorage.setItem('user', JSON.stringify(authData.user));
  }

  function logout() {
    token.value = '';
    user.value = null;
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  async function checkAuth() {
    if (!token.value) return false;

    try {
      const query = `
        query Me {
          me {
            id
            name
            email
            role
            permissions
          }
        }
      `;

      const response = await gqlRequest(query);
      
      if (response.me) {
        setAuth({
          token: token.value,
          user: response.me
        });
        return true;
      } else {
        logout();
        return false;
      }
    } catch (error) {
      console.error('Erro ao verificar autenticação:', error);
      logout();
      return false;
    }
  }

  return {
    token,
    user,
    isAuthenticated,
    userRole,
    login,
    register,
    setAuth,
    logout,
    hasPermission,
    checkAuth
  };
}); 