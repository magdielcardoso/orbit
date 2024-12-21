<template>
  <div class="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
    <!-- Toasts Container -->
    <div class="toast toast-top toast-end">
      <div v-if="showSuccessToast" class="alert alert-success">
        <span>Sistema configurado com sucesso!</span>
      </div>
      <div v-if="error" class="alert alert-error">
        <span>{{ error }}</span>
      </div>
    </div>

    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
        Configuração Inicial do Sistema
      </h2>
      <p class="mt-2 text-center text-sm text-gray-600">
        Configure o primeiro usuário superadmin e as configurações básicas do sistema
      </p>
    </div>

    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 border-2 border-purple-500">
        <form class="space-y-6" @submit.prevent="handleSubmit">
          <!-- Superadmin Info -->
          <div>
            <h3 class="text-lg font-medium text-gray-900 mb-4">Superadmin</h3>
            
            <div class="space-y-4">
              <div>
                <label for="name" class="block text-sm font-medium text-gray-700">
                  Nome Completo
                </label>
                <div class="mt-1">
                  <input
                    id="name"
                    v-model="form.name"
                    type="text"
                    required
                    class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                  />
                </div>
              </div>

              <div>
                <label for="email" class="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <div class="mt-1">
                  <input
                    id="email"
                    v-model="form.email"
                    type="email"
                    required
                    class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                  />
                </div>
              </div>

              <div>
                <label for="password" class="block text-sm font-medium text-gray-700">
                  Senha
                </label>
                <div class="mt-1 relative">
                  <input
                    id="password"
                    v-model="form.password"
                    :type="showPassword ? 'text' : 'password'"
                    required
                    class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm pr-10"
                  />
                  <button
                    type="button"
                    @click="showPassword = !showPassword"
                    class="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    <Eye v-if="!showPassword" class="h-5 w-5 text-gray-400 hover:text-gray-500" />
                    <EyeOff v-else class="h-5 w-5 text-gray-400 hover:text-gray-500" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- System Settings -->
          <div>
            <h3 class="text-lg font-medium text-gray-900 mb-4">Configurações do Sistema</h3>
            
            <div class="space-y-4">
              <div>
                <label for="systemName" class="block text-sm font-medium text-gray-700">
                  Nome do Sistema
                </label>
                <div class="mt-1">
                  <input
                    id="systemName"
                    v-model="form.systemName"
                    type="text"
                    required
                    class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                  />
                </div>
              </div>

              <div>
                <label for="timezone" class="block text-sm font-medium text-gray-700">
                  Fuso Horário
                </label>
                <div class="mt-1">
                  <select
                    id="timezone"
                    v-model="form.timezone"
                    class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm rounded-md"
                  >
                    <option value="America/Sao_Paulo">America/Sao_Paulo</option>
                    <option value="UTC">UTC</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              :disabled="loading"
              class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
            >
              <span v-if="loading">Configurando...</span>
              <span v-else>Concluir Configuração</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth.store'
import { Eye, EyeOff } from 'lucide-vue-next'
import { gqlRequest } from '../utils/graphql'
import { setAuthToken } from '../utils/graphql'

const router = useRouter()
const authStore = useAuthStore()
const loading = ref(false)
const error = ref(null)
const showSuccessToast = ref(false)
const showPassword = ref(false)

const form = ref({
  name: '',
  email: '',
  password: '',
  systemName: '',
  timezone: 'America/Sao_Paulo'
})

async function handleSubmit() {
  try {
    loading.value = true
    error.value = null
    
    const setupMutation = `
      mutation RegisterSuperAdmin($input: RegisterSuperAdminInput!) {
        registerSuperAdmin(input: $input) {
          token
          user {
            id
            name
            email
            active
            role {
              name
              permissions {
                name
              }
            }
          }
          systemConfig {
            id
            systemName
            timezone
          }
        }
      }
    `
    
    const response = await gqlRequest(setupMutation, {
      input: {
        name: form.value.name,
        email: form.value.email,
        password: form.value.password,
        systemConfig: {
          systemName: form.value.systemName,
          timezone: form.value.timezone
        }
      }
    })

    // Atualiza o estado de autenticação
    authStore.setAuth({
      token: response.registerSuperAdmin.token,
      user: response.registerSuperAdmin.user
    })

    // Define o sistema como configurado
    localStorage.setItem('systemConfigured', 'true')
    
    // Mostra o toast de sucesso
    showSuccessToast.value = true
    
    // Atualiza o token nos headers das requisições
    setAuthToken(response.registerSuperAdmin.token)
    
    // Redireciona para o dashboard
    setTimeout(() => {
      router.push('/admin')
    }, 1500)
    
  } catch (err) {
    console.error('Erro na configuração:', err)
    error.value = err.message
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.toast {
  z-index: 9999;
}
</style> 