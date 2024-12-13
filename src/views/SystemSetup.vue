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
        <form class="space-y-6" @submit.prevent="handleSetup">
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
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth.store';
import { Eye, EyeOff } from 'lucide-vue-next';

const router = useRouter();
const authStore = useAuthStore();

const form = ref({
  name: '',
  email: '',
  password: '',
  systemName: '',
  timezone: 'America/Sao_Paulo'
});

const loading = ref(false);
const error = ref('');
const showPassword = ref(false);
const showSuccessToast = ref(false);

async function handleSetup() {
  try {
    loading.value = true;
    error.value = '';
    showSuccessToast.value = false;

    const response = await fetch('/api/system/setup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(form.value)
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Erro ao configurar o sistema');
    }
    
    console.log('Setup concluído:', data);
    
    // Atualiza o estado de autenticação
    authStore.setAuth(data, true);

    // Define o sistema como configurado
    localStorage.setItem('systemConfigured', 'true');

    // Mostra o toast de sucesso
    showSuccessToast.value = true;

    // Aguarda um pouco para o usuário ver o toast
    setTimeout(() => {
      console.log('Redirecionando para o painel admin...');
      // Redireciona para o painel de admin
      router.push('/admin').catch(err => {
        console.error('Erro no redirecionamento:', err);
        // Tenta redirecionar usando o nome da rota
        router.push({ name: 'admin-panel' }).catch(err => {
          console.error('Erro no redirecionamento alternativo:', err);
        });
      });
    }, 1500);
  } catch (err) {
    console.error('Erro no setup:', err);
    error.value = err.message;
    // Remove o erro após 3 segundos
    setTimeout(() => {
      error.value = '';
    }, 3000);
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
.toast {
  z-index: 9999;
}
</style> 