<template>
  <div class="p-6">
    <!-- Cabeçalho -->
    <div class="sm:flex sm:items-center mb-8">
      <div class="sm:flex-auto">
        <h1 class="text-2xl font-semibold text-gray-900">Configurações do Sistema</h1>
        <p class="mt-2 text-sm text-gray-700">
          Gerencie todas as configurações globais do sistema.
        </p>
      </div>
    </div>

    <!-- Ações Rápidas -->
    <div class="mb-8">
      <h2 class="text-lg font-medium text-gray-900 mb-4">Ações Rápidas</h2>
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <!-- Status do Sistema -->
        <div class="bg-white overflow-hidden shadow rounded-lg">
          <div class="p-5">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <div :class="systemStatus.color" class="rounded-md p-3">
                  <component :is="systemStatus.icon" class="h-6 w-6 text-white" />
                </div>
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-gray-500 truncate">Status</dt>
                  <dd class="flex items-baseline">
                    <div class="text-2xl font-semibold text-gray-900">
                      {{ systemStatus.label }}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div class="bg-gray-50 px-5 py-3">
            <div class="text-sm">
              <button @click="toggleSystemStatus" class="font-medium text-purple-700 hover:text-purple-900">
                {{ systemStatus.action }}
              </button>
            </div>
          </div>
        </div>

        <!-- Manutenção Programada -->
        <div class="bg-white overflow-hidden shadow rounded-lg">
          <div class="p-5">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <div class="bg-yellow-500 rounded-md p-3">
                  <Clock class="h-6 w-6 text-white" />
                </div>
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-gray-500 truncate">Manutenção</dt>
                  <dd class="flex items-baseline">
                    <div class="text-2xl font-semibold text-gray-900">
                      {{ maintenanceMode ? 'Ativada' : 'Desativada' }}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div class="bg-gray-50 px-5 py-3">
            <div class="text-sm">
              <button @click="toggleMaintenance" class="font-medium text-purple-700 hover:text-purple-900">
                {{ maintenanceMode ? 'Desativar Manutenção' : 'Agendar Manutenção' }}
              </button>
            </div>
          </div>
        </div>

        <!-- Cache do Sistema -->
        <div class="bg-white overflow-hidden shadow rounded-lg">
          <div class="p-5">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <div class="bg-blue-500 rounded-md p-3">
                  <Database class="h-6 w-6 text-white" />
                </div>
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-gray-500 truncate">Cache</dt>
                  <dd class="flex items-baseline">
                    <div class="text-2xl font-semibold text-gray-900">
                      {{ formatBytes(cacheSize) }}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div class="bg-gray-50 px-5 py-3">
            <div class="text-sm">
              <button @click="clearCache" class="font-medium text-purple-700 hover:text-purple-900">
                Limpar Cache
              </button>
            </div>
          </div>
        </div>

        <!-- Backup -->
        <div class="bg-white overflow-hidden shadow rounded-lg">
          <div class="p-5">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <div class="bg-green-500 rounded-md p-3">
                  <Save class="h-6 w-6 text-white" />
                </div>
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-gray-500 truncate">Último Backup</dt>
                  <dd class="flex items-baseline">
                    <div class="text-sm font-semibold text-gray-900">
                      {{ lastBackup ? formatDate(lastBackup) : 'Nunca' }}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div class="bg-gray-50 px-5 py-3">
            <div class="text-sm">
              <button @click="createBackup" class="font-medium text-purple-700 hover:text-purple-900">
                Criar Backup
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Cards de Configurações -->
    <div class="mb-8">
      <h2 class="text-lg font-medium text-gray-900 mb-4">Configurações</h2>
      <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <!-- Geral -->
        <div class="bg-white overflow-hidden shadow rounded-lg divide-y divide-gray-200">
          <div class="px-4 py-5 sm:p-6">
            <div class="flex items-center justify-between">
              <div class="flex items-center">
                <Settings class="h-8 w-8 text-gray-400" />
                <div class="ml-4">
                  <h3 class="text-lg font-medium text-gray-900">Geral</h3>
                  <p class="text-sm text-gray-500">
                    Nome, idioma, tema e fuso horário
                  </p>
                </div>
              </div>
              <router-link 
                to="/admin/settings/general"
                class="inline-flex items-center p-2 rounded-full text-gray-400 hover:text-gray-500"
              >
                <ChevronRight class="h-5 w-5" />
              </router-link>
            </div>
          </div>
        </div>

        <!-- Branding -->
        <div class="bg-white overflow-hidden shadow rounded-lg divide-y divide-gray-200">
          <div class="px-4 py-5 sm:p-6">
            <div class="flex items-center justify-between">
              <div class="flex items-center">
                <Palette class="h-8 w-8 text-gray-400" />
                <div class="ml-4">
                  <h3 class="text-lg font-medium text-gray-900">Branding</h3>
                  <p class="text-sm text-gray-500">
                    Logo, cores e identidade visual
                  </p>
                </div>
              </div>
              <router-link 
                to="/admin/settings/branding"
                class="inline-flex items-center p-2 rounded-full text-gray-400 hover:text-gray-500"
              >
                <ChevronRight class="h-5 w-5" />
              </router-link>
            </div>
          </div>
        </div>

        <!-- Chat -->
        <div class="bg-white overflow-hidden shadow rounded-lg divide-y divide-gray-200">
          <div class="px-4 py-5 sm:p-6">
            <div class="flex items-center justify-between">
              <div class="flex items-center">
                <MessageSquare class="h-8 w-8 text-gray-400" />
                <div class="ml-4">
                  <h3 class="text-lg font-medium text-gray-900">Chat</h3>
                  <p class="text-sm text-gray-500">
                    Aparência e comportamento do chat
                  </p>
                </div>
              </div>
              <router-link 
                to="/admin/settings/chat"
                class="inline-flex items-center p-2 rounded-full text-gray-400 hover:text-gray-500"
              >
                <ChevronRight class="h-5 w-5" />
              </router-link>
            </div>
          </div>
        </div>

        <!-- Integrações -->
        <div class="bg-white overflow-hidden shadow rounded-lg divide-y divide-gray-200">
          <div class="px-4 py-5 sm:p-6">
            <div class="flex items-center justify-between">
              <div class="flex items-center">
                <Plug class="h-8 w-8 text-gray-400" />
                <div class="ml-4">
                  <h3 class="text-lg font-medium text-gray-900">Integrações</h3>
                  <p class="text-sm text-gray-500">
                    WhatsApp, Telegram e outros
                  </p>
                </div>
              </div>
              <router-link 
                to="/admin/settings/integrations"
                class="inline-flex items-center p-2 rounded-full text-gray-400 hover:text-gray-500"
              >
                <ChevronRight class="h-5 w-5" />
              </router-link>
            </div>
          </div>
        </div>

        <!-- Notificações -->
        <div class="bg-white overflow-hidden shadow rounded-lg divide-y divide-gray-200">
          <div class="px-4 py-5 sm:p-6">
            <div class="flex items-center justify-between">
              <div class="flex items-center">
                <Bell class="h-8 w-8 text-gray-400" />
                <div class="ml-4">
                  <h3 class="text-lg font-medium text-gray-900">Notificações</h3>
                  <p class="text-sm text-gray-500">
                    Email, push e alertas
                  </p>
                </div>
              </div>
              <router-link 
                to="/admin/settings/notifications"
                class="inline-flex items-center p-2 rounded-full text-gray-400 hover:text-gray-500"
              >
                <ChevronRight class="h-5 w-5" />
              </router-link>
            </div>
          </div>
        </div>

        <!-- Segurança -->
        <div class="bg-white overflow-hidden shadow rounded-lg divide-y divide-gray-200">
          <div class="px-4 py-5 sm:p-6">
            <div class="flex items-center justify-between">
              <div class="flex items-center">
                <Shield class="h-8 w-8 text-gray-400" />
                <div class="ml-4">
                  <h3 class="text-lg font-medium text-gray-900">Segurança</h3>
                  <p class="text-sm text-gray-500">
                    Autenticação e permissões
                  </p>
                </div>
              </div>
              <router-link 
                to="/admin/settings/security"
                class="inline-flex items-center p-2 rounded-full text-gray-400 hover:text-gray-500"
              >
                <ChevronRight class="h-5 w-5" />
              </router-link>
            </div>
          </div>
        </div>

        <!-- Armazenamento -->
        <div class="bg-white overflow-hidden shadow rounded-lg divide-y divide-gray-200">
          <div class="px-4 py-5 sm:p-6">
            <div class="flex items-center justify-between">
              <div class="flex items-center">
                <HardDrive class="h-8 w-8 text-gray-400" />
                <div class="ml-4">
                  <h3 class="text-lg font-medium text-gray-900">Armazenamento</h3>
                  <p class="text-sm text-gray-500">
                    Arquivos e retenção de dados
                  </p>
                </div>
              </div>
              <router-link 
                to="/admin/settings/storage"
                class="inline-flex items-center p-2 rounded-full text-gray-400 hover:text-gray-500"
              >
                <ChevronRight class="h-5 w-5" />
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useAuthStore } from '../../stores/auth.store';
import { useRouter } from 'vue-router';
import { 
  Settings, MessageSquare, Plug, Bell, Shield, 
  HardDrive, ChevronRight, Clock, Database, Save,
  Power, Activity, Palette
} from 'lucide-vue-next';
import { gqlRequest } from '../../utils/graphql';

const router = useRouter();
const authStore = useAuthStore();

// Estados
const loading = ref(false);
const maintenanceMode = ref(false);
const cacheSize = ref(0);
const lastBackup = ref(null);

// Estado do sistema
const systemStatus = ref({
  label: 'Online',
  color: 'bg-green-500',
  icon: Activity,
  action: 'Colocar em Manutenção'
});

// Funções de ação rápida
async function toggleSystemStatus() {
  try {
    loading.value = true;
    const mutation = `
      mutation ToggleSystemStatus {
        toggleSystemStatus
      }
    `;
    
    await gqlRequest(mutation, null, {
      headers: {
        'Authorization': `Bearer ${authStore.token}`
      }
    });
    
    // Atualiza o status
    systemStatus.value = systemStatus.value.label === 'Online' 
      ? {
          label: 'Manutenção',
          color: 'bg-yellow-500',
          icon: Power,
          action: 'Voltar ao Normal'
        }
      : {
          label: 'Online',
          color: 'bg-green-500',
          icon: Activity,
          action: 'Colocar em Manutenção'
        };
  } catch (error) {
    console.error('Erro ao alterar status:', error);
    alert(error.message);
  } finally {
    loading.value = false;
  }
}

async function toggleMaintenance() {
  try {
    loading.value = true;
    maintenanceMode.value = !maintenanceMode.value;
    // Implementar lógica de manutenção
  } catch (error) {
    console.error('Erro ao alterar modo de manutenção:', error);
  } finally {
    loading.value = false;
  }
}

async function clearCache() {
  try {
    loading.value = true;
    // Implementar limpeza de cache
    cacheSize.value = 0;
  } catch (error) {
    console.error('Erro ao limpar cache:', error);
  } finally {
    loading.value = false;
  }
}

async function createBackup() {
  try {
    loading.value = true;
    // Implementar criação de backup
    lastBackup.value = new Date();
  } catch (error) {
    console.error('Erro ao criar backup:', error);
  } finally {
    loading.value = false;
  }
}

// Funções utilitárias
function formatBytes(bytes) {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

function formatDate(date) {
  if (!date) return '';
  return new Date(date).toLocaleString('pt-BR');
}

onMounted(async () => {
  try {
    // Carregar dados iniciais
    const query = `
      query GetSystemSettings {
        systemStatus
        maintenanceMode
        cacheSize
        lastBackup
      }
    `;
    
    const response = await gqlRequest(query, null, {
      headers: {
        'Authorization': `Bearer ${authStore.token}`
      }
    });
    
    // Atualizar estados
    if (response) {
      maintenanceMode.value = response.maintenanceMode;
      cacheSize.value = response.cacheSize;
      lastBackup.value = response.lastBackup;
    }
  } catch (error) {
    console.error('Erro ao carregar configurações:', error);
  }
});
</script> 