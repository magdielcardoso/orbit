<template>
  <div class="py-6 px-4 sm:px-6 lg:px-8">
    <div class="max-w-7xl mx-auto">
      <h1 class="text-2xl font-semibold text-gray-900">Painel de Administração</h1>
    </div>
    <div class="max-w-7xl mx-auto">
      <div class="py-4">
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <!-- Gestão de Usuários -->
          <div class="bg-white overflow-hidden shadow rounded-lg">
            <div class="p-5">
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <Users class="h-6 w-6 text-gray-400" />
                </div>
                <div class="ml-5 w-0 flex-1">
                  <dl>
                    <dt class="text-sm font-medium text-gray-500 truncate">
                      Usuários Cadastrados
                    </dt>
                    <dd class="flex items-baseline">
                      <div class="text-2xl font-semibold text-gray-900">
                        {{ stats.totalUsers }}
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
            <div class="bg-gray-50 px-5 py-3">
              <div class="text-sm">
                <router-link
                  to="/admin/users"
                  class="font-medium text-purple-700 hover:text-purple-900"
                >
                  Gerenciar Usuários
                </router-link>
              </div>
            </div>
          </div>

          <!-- Gestão de Roles -->
          <div class="bg-white overflow-hidden shadow rounded-lg">
            <div class="p-5">
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <Shield class="h-6 w-6 text-gray-400" />
                </div>
                <div class="ml-5 w-0 flex-1">
                  <dl>
                    <dt class="text-sm font-medium text-gray-500 truncate">
                      Papéis e Permissões
                    </dt>
                    <dd class="flex items-baseline">
                      <div class="text-2xl font-semibold text-gray-900">
                        {{ stats.totalRoles }}
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
            <div class="bg-gray-50 px-5 py-3">
              <div class="text-sm">
                <router-link
                  to="/admin/roles"
                  class="font-medium text-purple-700 hover:text-purple-900"
                >
                  Gerenciar Roles
                </router-link>
              </div>
            </div>
          </div>

          <!-- Configurações do Sistema -->
          <div class="bg-white overflow-hidden shadow rounded-lg">
            <div class="p-5">
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <Settings class="h-6 w-6 text-gray-400" />
                </div>
                <div class="ml-5 w-0 flex-1">
                  <dl>
                    <dt class="text-sm font-medium text-gray-500 truncate">
                      Configurações
                    </dt>
                    <dd class="flex items-baseline">
                      <div class="text-sm text-gray-900">
                        Sistema: {{ systemConfig.name }}
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
            <div class="bg-gray-50 px-5 py-3">
              <div class="text-sm">
                <router-link
                  to="/admin/settings"
                  class="font-medium text-purple-700 hover:text-purple-900"
                >
                  Configurações do Sistema
                </router-link>
              </div>
            </div>
          </div>
        </div>

        <!-- Lista de Atividades Recentes -->
        <div class="mt-8">
          <h2 class="text-lg leading-6 font-medium text-gray-900 mb-4">
            Atividades Recentes
          </h2>
          <div class="bg-white shadow overflow-hidden sm:rounded-md">
            <ul role="list" class="divide-y divide-gray-200">
              <li v-for="activity in recentActivities" :key="activity.id">
                <div class="px-4 py-4 sm:px-6">
                  <div class="flex items-center justify-between">
                    <p class="text-sm font-medium text-purple-600 truncate">
                      {{ activity.description }}
                    </p>
                    <div class="ml-2 flex-shrink-0 flex">
                      <p class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                         :class="getActivityStatusClass(activity.type)">
                        {{ activity.type }}
                      </p>
                    </div>
                  </div>
                  <div class="mt-2 sm:flex sm:justify-between">
                    <div class="sm:flex">
                      <p class="flex items-center text-sm text-gray-500">
                        <User class="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                        {{ activity.user }}
                      </p>
                    </div>
                    <div class="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                      <Clock class="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                      <p>
                        {{ formatDate(activity.timestamp) }}
                      </p>
                    </div>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { Users, Shield, Settings, User, Clock } from 'lucide-vue-next';
import { useAuthStore } from '../stores/auth.store';
import { useRouter } from 'vue-router';
import { gqlRequest } from '../utils/graphql';
import { checkSystemStatus } from '../utils/system';

const router = useRouter();
const authStore = useAuthStore();
const stats = ref({
  totalUsers: 0,
  totalRoles: 0
});
const systemConfig = ref({
  name: ''
});
const recentActivities = ref([]);

// Função para buscar dados com verificação de autorização
async function fetchData() {
  try {
    if (!authStore.hasPermission('manage_system')) {
      throw new Error('Sem permissão para acessar o painel administrativo');
    }

    // Carrega dados do sistema
    const systemStatus = await checkSystemStatus();
    if (systemStatus) {
      systemConfig.value = {
        name: `Sistema v${systemStatus.version}`,
        status: systemStatus.status
      };
    }

    const query = `
      query GetAdminPanelData {
        me {
          id
          role {
            name
            permissions {
              name
            }
          }
        }
        adminStats {
          totalUsers
          totalRoles
          roles {
            id
            name
            createdAt
          }
        }
        recentActivities {
          id
          type
          description
          user
          timestamp
        }
      }
    `;

    const response = await gqlRequest(query);
    
    if (response?.me && response?.adminStats) {
      stats.value = {
        totalUsers: response.adminStats.totalUsers,
        totalRoles: response.adminStats.totalRoles
      };

      // Usa as atividades recentes do backend
      recentActivities.value = response.recentActivities || [];
    }
    
  } catch (error) {
    console.error('Erro ao carregar dados do painel:', error);
    if (error.message.includes('autoriza')) {
      router.push('/dashboard');
    }
  }
}

onMounted(fetchData);

function getActivityStatusClass(type) {
  const classes = {
    'user_created': 'bg-green-100 text-green-800',
    'role_updated': 'bg-yellow-100 text-yellow-800',
    'system_config': 'bg-blue-100 text-blue-800',
    'security_alert': 'bg-red-100 text-red-800'
  };
  return classes[type] || 'bg-gray-100 text-gray-800';
}

function formatDate(timestamp) {
  return new Date(timestamp).toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}
</script> 