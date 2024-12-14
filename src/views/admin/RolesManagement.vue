<template>
  <div class="p-6">
    <!-- Cabeçalho -->
    <div class="sm:flex sm:items-center">
      <div class="sm:flex-auto">
        <h1 class="text-2xl font-semibold text-gray-900">{{ t('admin.roles.title') }}</h1>
        <p class="mt-2 text-sm text-gray-700">
          {{ t('admin.roles.description') }}
        </p>
      </div>
      <div class="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
        <button
          @click="showNewRoleModal = true"
          class="inline-flex items-center justify-center rounded-md border border-transparent bg-purple-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 sm:w-auto"
        >
          {{ t('admin.roles.addRole') }}
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
                    :checked="hasPermission(role, permission)"
                    disabled
                    @change="togglePermission(role, permission)"
                    class="focus:ring-purple-500 h-4 w-4 text-purple-600 border-gray-300 rounded appearance-none checked:bg-purple-600 checked:border-transparent"
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

    <!-- Modal Novo Papel -->
    <Modal v-if="showNewRoleModal" @close="showNewRoleModal = false">
      <template #title>{{ t('admin.roles.newRole') }}</template>
      <template #content>
        <form @submit.prevent="handleCreateRole" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700">
              {{ t('admin.roles.name') }}
            </label>
            <input
              v-model="newRole.name"
              type="text"
              required
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700">
              {{ t('admin.roles.description') }}
            </label>
            <textarea
              v-model="newRole.description"
              rows="3"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm"
            />
          </div>

          <div class="mt-4 space-y-2">
            <h4 class="text-sm font-medium text-gray-900">{{ t('admin.roles.permissions') }}</h4>
            <div class="grid grid-cols-2 gap-4">
              <div v-for="perm in permissions" :key="perm.id" class="flex items-center">
                <input
                  :id="`perm-${perm.id}`"
                  type="checkbox"
                  v-model="newRole.permissions"
                  :value="perm.id"
                  class="h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                />
                <label :for="`perm-${perm.id}`" class="ml-2 text-sm text-gray-700">
                  {{ perm.name }}
                </label>
              </div>
            </div>
          </div>
        </form>
      </template>
      <template #footer>
        <button
          type="button"
          @click="showNewRoleModal = false"
          class="mr-3 inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
        >
          {{ t('common.cancel') }}
        </button>
        <button
          type="submit"
          :disabled="loading"
          @click="handleCreateRole"
          class="inline-flex justify-center rounded-md border border-transparent bg-purple-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
        >
          {{ loading ? t('common.loading') : t('common.save') }}
        </button>
      </template>
    </Modal>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useI18n } from '@/i18n';
import { gqlRequest } from '../../utils/graphql';
import { useAuthStore } from '../../stores/auth.store';
import { useRouter } from 'vue-router';
import Modal from '../../components/Modal.vue';

const { t } = useI18n();
const authStore = useAuthStore();
const router = useRouter();
const roles = ref([]);
const permissions = ref([]);
const loading = ref(false);
const showNewRoleModal = ref(false);
const newRole = ref({
  name: '',
  description: '',
  permissions: []
});

// Busca papéis e permissões
async function fetchData() {
  try {
    if (!authStore.isAuthenticated) {
      throw new Error('Não autenticado');
    }

    const query = `
      query {
        roles {
          id
          name
          description
          permissions {
            id
            name
            description
          }
        }
        permissions {
          id
          name
          description
        }
      }
    `;

    const response = await gqlRequest(query, null, {
      headers: {
        'Authorization': `Bearer ${authStore.token}`
      }
    });

    roles.value = response.roles;
    permissions.value = response.permissions;
  } catch (error) {
    console.error('Erro ao carregar dados:', error);
    if (error.message.includes('autoriza') || error.message.includes('autentica')) {
      authStore.logout();
      router.push('/login');
    }
  }
}

// Cria novo papel
async function handleCreateRole() {
  try {
    loading.value = true;
    const mutation = `
      mutation CreateRole($name: String!, $description: String) {
        createRole(name: $name, description: $description) {
          id
          name
          description
        }
      }
    `;

    const response = await gqlRequest(mutation, {
      name: newRole.value.name,
      description: newRole.value.description
    }, {
      headers: {
        'Authorization': `Bearer ${authStore.token}`
      }
    });

    // Adiciona permissões ao papel
    for (const permId of newRole.value.permissions) {
      await gqlRequest(`
        mutation AddPermission($roleId: ID!, $permissionId: ID!) {
          addPermissionToRole(roleId: $roleId, permissionId: $permissionId) {
            id
          }
        }
      `, {
        roleId: response.createRole.id,
        permissionId: permId
      }, {
        headers: {
          'Authorization': `Bearer ${authStore.token}`
        }
      });
    }

    await fetchData(); // Recarrega os dados
    showNewRoleModal.value = false;
    newRole.value = { name: '', description: '', permissions: [] };
    alert('Papel criado com sucesso!');
  } catch (error) {
    console.error('Erro ao criar papel:', error);
    alert(error.message);
  } finally {
    loading.value = false;
  }
}

// Exclui papel
async function deleteRole(role) {
  if (!confirm(t('admin.roles.confirmDelete', { name: role.name }))) {
    return;
  }

  try {
    loading.value = true;
    const mutation = `
      mutation DeleteRole($id: ID!) {
        deleteRole(id: $id)
      }
    `;

    await gqlRequest(mutation, { id: role.id }, {
      headers: {
        'Authorization': `Bearer ${authStore.token}`
      }
    });

    await fetchData(); // Recarrega os dados
    alert('Papel excluído com sucesso!');
  } catch (error) {
    console.error('Erro ao excluir papel:', error);
    alert(error.message);
  } finally {
    loading.value = false;
  }
}

// Toggle permissão
async function togglePermission(role, permission) {
  try {
    loading.value = true;
    const mutation = permission.enabled ? 'removePermissionFromRole' : 'addPermissionToRole';

    await gqlRequest(`
      mutation TogglePermission($roleId: ID!, $permissionId: ID!) {
        ${mutation}(roleId: $roleId, permissionId: $permissionId) {
          id
        }
      }
    `, {
      roleId: role.id,
      permissionId: permission.id
    }, {
      headers: {
        'Authorization': `Bearer ${authStore.token}`
      }
    });

    await fetchData(); // Recarrega os dados
  } catch (error) {
    console.error('Erro ao alterar permissão:', error);
    alert(error.message);
  } finally {
    loading.value = false;
  }
}

// Computed para verificar se a permissão está associada ao papel
function hasPermission(role, permission) {
  // Se for superadmin, todas as permissões estão marcadas
  if (role.name === 'superadmin') {
    return true;
  }
  
  // Se for user, apenas use_chat está marcada
  if (role.name === 'user') {
    return permission.name === 'use_chat';
  }
  
  // Para outros papéis, verifica se a permissão está na lista
  return role.permissions.some(p => p.id === permission.id);
}

onMounted(fetchData);
</script>

<style scoped>
input[type="checkbox"] {
  position: relative;
  cursor: not-allowed; /* Mudando o cursor para indicar que está desabilitado */
  appearance: none;
  background-color: #fff;
  border: 2px solid #d1d5db;
  border-radius: 0.25rem;
  width: 1rem;
  height: 1rem;
}

input[type="checkbox"]:checked {
  background-color: #22c55e;
  border-color: #22c55e;
  opacity: 0.8; /* Adicionando uma leve opacidade para indicar que está desabilitado */
}

input[type="checkbox"]:checked::after {
  content: '';
  position: absolute;
  left: 52%;
  top: 45%;
  transform: translate(-50%, -50%) rotate(45deg);
  width: 4px;
  height: 8px;
  border: solid white;
  border-width: 0 2px 2px 0;
}

input[type="checkbox"]:focus {
  outline: none;
  box-shadow: 0 0 0 2px rgba(34, 197, 94, 0.2);
}

input[type="checkbox"]:hover:not(:checked) {
  border-color: #22c55e;
}

/* Estilo específico para checkbox desabilitado */
input[type="checkbox"]:disabled {
  background-color: #f3f4f6;
}

input[type="checkbox"]:disabled:checked {
  background-color: #22c55e;
  opacity: 0.7;
}
</style> 