<template>
  <div class="py-6 px-4 sm:px-6 lg:px-8">
    <div class="max-w-7xl mx-auto">
      <h1 class="text-2xl font-semibold text-gray-900 mb-6">Métricas do Sistema</h1>

      <!-- Cards de Métricas -->
      <div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <MetricCard
          title="Usuários"
          :value="metrics.totalUsers"
          :details="[
            { label: 'Ativos', value: metrics.activeUsers },
            { label: 'Inativos', value: metrics.inactiveUsers }
          ]"
        />
        <MetricCard
          title="Papéis e Permissões"
          :value="metrics.totalRoles"
          :details="[
            { label: 'Permissões', value: metrics.totalPermissions }
          ]"
        />
        <MetricCard
          title="Atividades"
          :value="metrics.totalActivities"
        />
      </div>

      <!-- Gráficos -->
      <div class="mt-8 grid grid-cols-1 gap-5 lg:grid-cols-2">
        <!-- Distribuição de Usuários por Papel -->
        <div class="bg-white rounded-lg shadow p-6">
          <h3 class="text-lg font-medium text-gray-900 mb-4">
            Distribuição de Usuários por Papel
          </h3>
          <div class="h-64">
            <PieChart :data="usersByRoleChart" />
          </div>
        </div>

        <!-- Atividades por Tipo -->
        <div class="bg-white rounded-lg shadow p-6">
          <h3 class="text-lg font-medium text-gray-900 mb-4">
            Atividades por Tipo
          </h3>
          <div class="h-64">
            <BarChart :data="activitiesByTypeChart" />
          </div>
        </div>
      </div>

      <!-- Métricas de Armazenamento -->
      <div class="mt-8">
        <h2 class="text-lg font-medium text-gray-900 mb-4">
          Métricas de Armazenamento
        </h2>
        <div class="bg-white shadow overflow-hidden sm:rounded-lg">
          <div class="px-4 py-5 sm:p-6">
            <dl class="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div>
                <dt class="text-sm font-medium text-gray-500">
                  Tamanho Total do Banco
                </dt>
                <dd class="mt-1 text-3xl font-semibold text-gray-900">
                  {{ formatBytes(metrics.storageMetrics.totalSize) }}
                </dd>
              </div>
            </dl>
            
            <!-- Tabela de Tamanhos -->
            <div class="mt-8">
              <h4 class="text-sm font-medium text-gray-500 mb-4">
                Tamanho das Tabelas
              </h4>
              <div class="overflow-x-auto">
                <table class="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th class="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tabela
                      </th>
                      <th class="px-6 py-3 bg-gray-50 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tamanho
                      </th>
                      <th class="px-6 py-3 bg-gray-50 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Registros
                      </th>
                    </tr>
                  </thead>
                  <tbody class="bg-white divide-y divide-gray-200">
                    <tr v-for="table in metrics.storageMetrics.tablesSizes" :key="table.name">
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {{ table.name }}
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                        {{ formatBytes(table.size) }}
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                        {{ table.totalRows }}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { gqlRequest } from '../../utils/graphql';
import MetricCard from '../../components/MetricCard.vue';
import PieChart from '../../components/charts/PieChart.vue';
import BarChart from '../../components/charts/BarChart.vue';

const metrics = ref({
  totalUsers: 0,
  activeUsers: 0,
  inactiveUsers: 0,
  totalRoles: 0,
  totalPermissions: 0,
  totalActivities: 0,
  activitiesByType: [],
  usersByRole: [],
  storageMetrics: {
    totalSize: 0,
    tablesSizes: [],
    indexesSizes: []
  }
});

onMounted(async () => {
  try {
    const query = `
      query DatabaseMetrics {
        databaseMetrics {
          totalUsers
          activeUsers
          inactiveUsers
          totalRoles
          totalPermissions
          totalActivities
          activitiesByType {
            type
            count
            percentage
          }
          usersByRole {
            role
            count
            percentage
          }
          storageMetrics {
            totalSize
            tablesSizes {
              name
              size
              totalRows
            }
            indexesSizes {
              name
              table
              size
            }
          }
        }
      }
    `;

    const response = await gqlRequest(query);
    metrics.value = response.databaseMetrics;
  } catch (error) {
    console.error('Erro ao carregar métricas:', error);
  }
});

function formatBytes(bytes) {
  const units = ['B', 'KB', 'MB', 'GB'];
  let size = bytes;
  let unitIndex = 0;
  
  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }
  
  return `${size.toFixed(2)} ${units[unitIndex]}`;
}

const usersByRoleChart = computed(() => ({
  labels: metrics.value.usersByRole.map(item => item.role),
  datasets: [{
    data: metrics.value.usersByRole.map(item => item.count),
    backgroundColor: [
      '#818CF8',
      '#34D399',
      '#F472B6',
      '#FBBF24',
      '#60A5FA'
    ]
  }]
}));

const activitiesByTypeChart = computed(() => ({
  labels: metrics.value.activitiesByType.map(item => item.type),
  datasets: [{
    label: 'Quantidade',
    data: metrics.value.activitiesByType.map(item => item.count),
    backgroundColor: '#818CF8'
  }]
}));
</script> 