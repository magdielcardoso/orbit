<template>
  <div class="p-6">
    <div class="sm:flex sm:items-center">
      <div class="sm:flex-auto">
        <h1 class="text-2xl font-semibold text-gray-900">Configurações do Sistema</h1>
        <p class="mt-2 text-sm text-gray-700">
          Gerencie as configurações globais do sistema.
        </p>
      </div>
    </div>

    <div class="mt-8">
      <form @submit.prevent="saveSettings" class="space-y-8 divide-y divide-gray-200 bg-white p-8 rounded-lg shadow-lg border-2 border-purple-500">
        <div class="space-y-8 divide-y divide-gray-200">
          <!-- Configurações Gerais -->
          <div>
            <div>
              <h3 class="text-lg font-medium leading-6 text-gray-900">Configurações Gerais</h3>
              <p class="mt-1 text-sm text-gray-500">
                Configurações básicas do sistema.
              </p>
            </div>

            <div class="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
              <div class="sm:col-span-4">
                <label for="systemName" class="block text-sm font-medium text-gray-700">
                  Nome do Sistema
                </label>
                <div class="mt-1">
                  <input
                    type="text"
                    name="systemName"
                    id="systemName"
                    v-model="settings.systemName"
                    class="shadow-sm focus:ring-purple-500 focus:border-purple-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              </div>

              <div class="sm:col-span-4">
                <label for="timezone" class="block text-sm font-medium text-gray-700">
                  Fuso Horário
                </label>
                <div class="mt-1">
                  <select
                    id="timezone"
                    name="timezone"
                    v-model="settings.timezone"
                    class="shadow-sm focus:ring-purple-500 focus:border-purple-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  >
                    <option value="America/Sao_Paulo">America/Sao_Paulo</option>
                    <option value="UTC">UTC</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <!-- Configurações de Email -->
          <div class="pt-8">
            <div>
              <h3 class="text-lg font-medium leading-6 text-gray-900">Configurações de Email</h3>
              <p class="mt-1 text-sm text-gray-500">
                Configure o servidor de email para envio de notificações.
              </p>
            </div>

            <div class="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
              <div class="sm:col-span-4">
                <label for="smtpHost" class="block text-sm font-medium text-gray-700">
                  Servidor SMTP
                </label>
                <div class="mt-1">
                  <input
                    type="text"
                    name="smtpHost"
                    id="smtpHost"
                    v-model="settings.smtpHost"
                    class="shadow-sm focus:ring-purple-500 focus:border-purple-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              </div>

              <div class="sm:col-span-4">
                <label for="smtpPort" class="block text-sm font-medium text-gray-700">
                  Porta SMTP
                </label>
                <div class="mt-1">
                  <input
                    type="number"
                    name="smtpPort"
                    id="smtpPort"
                    v-model="settings.smtpPort"
                    class="shadow-sm focus:ring-purple-500 focus:border-purple-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              </div>

              <div class="sm:col-span-4">
                <label for="smtpUser" class="block text-sm font-medium text-gray-700">
                  Usuário SMTP
                </label>
                <div class="mt-1">
                  <input
                    type="text"
                    name="smtpUser"
                    id="smtpUser"
                    v-model="settings.smtpUser"
                    class="shadow-sm focus:ring-purple-500 focus:border-purple-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              </div>

              <div class="sm:col-span-4">
                <label for="smtpPassword" class="block text-sm font-medium text-gray-700">
                  Senha SMTP
                </label>
                <div class="mt-1">
                  <input
                    type="password"
                    name="smtpPassword"
                    id="smtpPassword"
                    v-model="settings.smtpPassword"
                    class="shadow-sm focus:ring-purple-500 focus:border-purple-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="pt-5">
          <div class="flex justify-end">
            <button
              type="button"
              @click="resetSettings"
              class="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
            >
              Resetar
            </button>
            <button
              type="submit"
              :disabled="loading"
              class="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
            >
              {{ loading ? 'Salvando...' : 'Salvar' }}
            </button>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useAuthStore } from '../../stores/auth.store';

const authStore = useAuthStore();
const settings = ref({
  systemName: '',
  timezone: 'America/Sao_Paulo',
  smtpHost: '',
  smtpPort: 587,
  smtpUser: '',
  smtpPassword: ''
});
const loading = ref(false);
const originalSettings = ref(null);

onMounted(async () => {
  try {
    const response = await fetch('/api/admin/system-settings', {
      headers: {
        'Authorization': `Bearer ${authStore.token}`
      }
    });
    
    if (!response.ok) {
      throw new Error('Erro ao carregar configurações');
    }
    
    const data = await response.json();
    settings.value = { ...data };
    originalSettings.value = { ...data };
  } catch (error) {
    console.error('Erro:', error);
  }
});

async function saveSettings() {
  loading.value = true;
  
  try {
    const response = await fetch('/api/admin/system-settings', {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${authStore.token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(settings.value)
    });

    if (!response.ok) {
      throw new Error('Erro ao salvar configurações');
    }

    originalSettings.value = { ...settings.value };
    alert('Configurações salvas com sucesso!');
  } catch (error) {
    console.error('Erro:', error);
    alert('Erro ao salvar configurações');
  } finally {
    loading.value = false;
  }
}

function resetSettings() {
  if (originalSettings.value) {
    settings.value = { ...originalSettings.value };
  }
}
</script> 