<template>
  <div class="p-6">
    <div class="sm:flex sm:items-center">
      <div class="sm:flex-auto">
        <h1 class="text-2xl font-semibold text-gray-900">Papéis e Permissões</h1>
        <p class="mt-2 text-sm text-gray-700">
          Gerencie os papéis e suas permissões no sistema.
        </p>
      </div>
      <div class="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
        <button
          @click="openNewRoleModal"
          class="inline-flex items-center justify-center rounded-md border border-transparent bg-purple-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 sm:w-auto"
        >
          Adicionar Papel
        </button>
      </div>
    </div>

    <!-- Lista de Papéis -->
    <div class="mt-8 space-y-8">
      <div v-for="role in roles" :key="role.id" class="bg-white shadow sm:rounded-lg">
        <div class="px-4 py-5 sm:p-6">
          <div class="sm:flex sm:items-start sm:justify-between">
            <div>
              <h3 class="text-lg font-medium leading-6 text-gray-900">
                {{ role.name }}
              </h3>
              <div class="mt-2 max-w-xl text-sm text-gray-500">
                <p>{{ role.description }}</p>
              </div>
            </div>
            <div class="mt-5 sm:mt-0 sm:ml-6 sm:flex sm:flex-shrink-0 sm:items-center">
              <button
                @click="editRole(role)"
                class="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 mr-2"
              >
                Editar
              </button>
              <button
                v-if="role.name !== 'superadmin' && role.name !== 'user'"
                @click="deleteRole(role)"
                class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Excluir
              </button>
            </div>
          </div>

          <!-- Lista de Permissões -->
          <div class="mt-6">
            <h4 class="text-sm font-medium text-gray-900">Permissões</h4>
            <div class="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
              <div
                v-for="permission in role.permissions"
                :key="permission.id"
                class="relative flex items-start"
              >
                <div class="flex items-center h-5">
                  <input
                    :id="`permission-${role.id}-${permission.id}`"
                    :name="`permission-${role.id}-${permission.id}`"
                    type="checkbox"
                    :checked="permission.enabled"
                    @change="togglePermission(role, permission)"
                    class="focus:ring-purple-500 h-4 w-4 text-purple-600 border-gray-300 rounded"
                  />
                </div>
                <div class="ml-3 text-sm">
                  <label
                    :for="`permission-${role.id}-${permission.id}`"
                    class="font-medium text-gray-700"
                  >
                    {{ permission.name }}
                  </label>
                  <p class="text-gray-500">{{ permission.description }}</p>
                </div>
              </div>
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

const authStore = useAuthStore();
const roles = ref([]);

onMounted(async () => {
  try {
    const response = await fetch('/api/admin/roles', {
      headers: {
        'Authorization': `Bearer ${authStore.token}`
      }
    });
    
    if (!response.ok) {
      throw new Error('Erro ao carregar papéis');
    }
    
    roles.value = await response.json();
  } catch (error) {
    console.error('Erro:', error);
  }
});

function openNewRoleModal() {
  // Implementar lógica do modal de novo papel
}

function editRole(role) {
  // Implementar lógica de edição
}

async function deleteRole(role) {
  if (!confirm(`Tem certeza que deseja excluir o papel ${role.name}?`)) {
    return;
  }

  try {
    const response = await fetch(`/api/admin/roles/${role.id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${authStore.token}`
      }
    });

    if (!response.ok) {
      throw new Error('Erro ao excluir papel');
    }

    // Remove o papel da lista
    roles.value = roles.value.filter(r => r.id !== role.id);
  } catch (error) {
    console.error('Erro:', error);
  }
}

async function togglePermission(role, permission) {
  try {
    const response = await fetch(`/api/admin/roles/${role.id}/permissions/${permission.id}`, {
      method: permission.enabled ? 'DELETE' : 'POST',
      headers: {
        'Authorization': `Bearer ${authStore.token}`
      }
    });

    if (!response.ok) {
      throw new Error('Erro ao atualizar permissão');
    }

    // Atualiza o estado da permissão localmente
    permission.enabled = !permission.enabled;
  } catch (error) {
    console.error('Erro:', error);
    // Reverte a mudança no checkbox em caso de erro
    permission.enabled = !permission.enabled;
  }
}
</script> 