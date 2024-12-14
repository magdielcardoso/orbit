<template>
  <div class="p-6">
    <div class="sm:flex sm:items-center">
      <div class="sm:flex-auto">
        <h1 class="text-2xl font-semibold text-gray-900">{{ t('admin.users.title') }}</h1>
        <p class="mt-2 text-sm text-gray-700">
          {{ t('admin.users.description') }}
        </p>
      </div>
      <div class="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
        <button
          @click="showNewUserModal = true"
          class="inline-flex items-center justify-center rounded-md border border-transparent bg-purple-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 sm:w-auto"
        >
          {{ t('admin.users.addUser') }}
        </button>
      </div>
    </div>

    <!-- Loading state -->
    <div v-if="loading" class="flex justify-center items-center py-8">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
    </div>

    <!-- Error state -->
    <div v-else-if="!users.length" class="text-center py-8">
      <p class="text-gray-500">{{ t('admin.users.noUsers') }}</p>
    </div>

    <!-- Tabela de Usuários -->
    <div v-else class="mt-8 flex flex-col">
      <div class="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div class="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
          <div class="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
            <table class="min-w-full divide-y divide-gray-300">
              <thead class="bg-gray-50">
                <tr>
                  <th scope="col" class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                    {{ t('admin.users.table.name') }}
                  </th>
                  <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    {{ t('admin.users.table.email') }}
                  </th>
                  <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    {{ t('admin.users.table.role') }}
                  </th>
                  <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    {{ t('admin.users.table.status') }}
                  </th>
                  <th scope="col" class="relative py-3.5 pl-3 pr-4 sm:pr-6">
                    <span class="sr-only">{{ t('common.actions') }}</span>
                  </th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200 bg-white">
                <tr v-for="user in users" :key="user.id">
                  <td class="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                    {{ user.name }}
                    <span 
                      v-if="user.role?.name === 'agent' && user.parentUser" 
                      class="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800"
                    >
                      <span class="text-blue-600 mr-1">{{ t('admin.users.agentOf') }}:</span>
                      {{ user.parentUser.name }}
                    </span>
                  </td>
                  <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    {{ user.email }}
                  </td>
                  <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    {{ user.role?.name || t('admin.users.noRole') }}
                  </td>
                  <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    <span
                      class="inline-flex rounded-full px-2 text-xs font-semibold leading-5"
                      :class="user.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'"
                    >
                      {{ user.active ? t('admin.users.status.active') : t('admin.users.status.inactive') }}
                    </span>
                  </td>
                  <td class="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                    <button
                      @click="editUser(user)"
                      class="text-purple-600 hover:text-purple-900 mr-4"
                    >
                      {{ t('common.edit') }}
                    </button>
                    <button
                      @click="deleteUser(user)"
                      class="text-red-600 hover:text-red-900"
                    >
                      {{ t('common.delete') }}
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Novo Usuário -->
    <Modal v-if="showNewUserModal" @close="showNewUserModal = false">
      <template #title>{{ t('admin.users.newUser') }}</template>
      <template #content>
        <form @submit.prevent="handleCreateUser" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700">
              {{ t('admin.users.form.name') }}
            </label>
            <input
              v-model="newUser.name"
              type="text"
              required
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">
              {{ t('admin.users.form.email') }}
            </label>
            <input
              v-model="newUser.email"
              type="email"
              required
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">
              {{ t('admin.users.form.password') }}
            </label>
            <input
              v-model="newUser.password"
              type="password"
              required
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">
              {{ t('admin.users.form.role') }}
            </label>
            <select
              v-model="newUser.roleId"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm"
              @change="checkIfAgentRole(newUser.roleId)"
            >
              <option value="">{{ t('admin.users.form.selectRole') }}</option>
              <option v-for="role in roles" :key="role.id" :value="role.id">
                {{ role.name }}
              </option>
            </select>
          </div>

          <!-- Mensagem informativa sobre agents -->
          <div v-if="isAgentRole" class="mt-2 p-4 bg-blue-50 rounded-md">
            <div class="flex">
              <div class="flex-shrink-0">
                <svg class="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
                </svg>
              </div>
              <div class="ml-3">
                <p class="text-sm text-blue-700">
                  {{ t('admin.users.form.agentInfo') }}
                </p>
              </div>
            </div>
          </div>

          <div v-if="isAgentRole">
            <label class="block text-sm font-medium text-gray-700">
              {{ t('admin.users.form.parentUser') }}
            </label>
            <select
              v-model="newUser.parentUserId"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm"
            >
              <option value="">{{ t('admin.users.form.selectParentUser') }}</option>
              <option v-for="user in potentialParentUsers" :key="user.id" :value="user.id">
                {{ user.name }}
              </option>
            </select>
          </div>
        </form>
      </template>
      <template #footer>
        <button
          type="button"
          @click="showNewUserModal = false"
          class="mr-3 inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
        >
          {{ t('common.cancel') }}
        </button>
        <button
          type="submit"
          :disabled="loading"
          @click="handleCreateUser"
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
const users = ref([]);
const roles = ref([]);
const loading = ref(false);
const showNewUserModal = ref(false);
const newUser = ref({
  name: '',
  email: '',
  password: '',
  roleId: '',
  parentUserId: ''
});
const potentialParentUsers = ref([]);
const isAgentRole = ref(false);

// Função para verificar se a role selecionada é agent
function checkIfAgentRole(roleId) {
  const selectedRole = roles.value.find(r => r.id === roleId);
  isAgentRole.value = selectedRole?.name === 'agent';
  if (!isAgentRole.value) {
    newUser.value.parentUserId = ''; // Limpa o parentUserId se não for agent
  }
}

// Função para carregar usuários que podem ser pais (users normais)
async function loadPotentialParentUsers() {
  try {
    const query = `
      query {
        users {
          id
          name
          email
          role {
            name
          }
        }
      }
    `;

    const response = await gqlRequest(query, null, {
      headers: {
        'Authorization': `Bearer ${authStore.token}`
      }
    });

    // Filtra apenas usuários com role 'user'
    potentialParentUsers.value = response.users.filter(u => u.role?.name === 'user');
  } catch (error) {
    console.error('Erro ao carregar usuários:', error);
  }
}

// Modifica a função fetchData para incluir parentUser e agents
async function fetchData() {
  try {
    loading.value = true;
    if (!authStore.isAuthenticated) {
      throw new Error('Não autenticado');
    }

    const query = `
      query {
        users {
          id
          name
          email
          active
          role {
            id
            name
          }
          parentUser {
            id
            name
          }
          createdAt
          updatedAt
        }
        roles {
          id
          name
        }
      }
    `;

    const response = await gqlRequest(query, null, {
      headers: {
        'Authorization': `Bearer ${authStore.token}`
      }
    });

    console.log('Usuários carregados:', response.users);
    users.value = response.users;
    roles.value = response.roles;
    await loadPotentialParentUsers();
  } catch (error) {
    console.error('Erro ao carregar dados:', error);
    if (error.message.includes('autoriza') || error.message.includes('autentica')) {
      authStore.logout();
      router.push('/login');
    }
  } finally {
    loading.value = false;
  }
}

// Modifica a função handleCreateUser para incluir parentUser na resposta
async function handleCreateUser() {
  try {
    loading.value = true;
    if (!newUser.value.roleId) {
      throw new Error('Selecione um papel para o usuário');
    }

    // Verifica se é um agent e se tem parentUserId selecionado
    const selectedRole = roles.value.find(r => r.id === newUser.value.roleId);
    if (selectedRole?.name === 'agent' && !newUser.value.parentUserId) {
      throw new Error('Selecione um usuário pai para o agent');
    }

    const mutation = `
      mutation CreateUser($name: String!, $email: String!, $password: String!, $roleId: String!, $parentUserId: String) {
        createUser(
          name: $name, 
          email: $email, 
          password: $password, 
          roleId: $roleId, 
          parentUserId: $parentUserId
        ) {
          id
          name
          email
          active
          role {
            id
            name
          }
        }
      }
    `;

    const variables = {
      name: newUser.value.name,
      email: newUser.value.email,
      password: newUser.value.password,
      roleId: newUser.value.roleId,
      parentUserId: selectedRole?.name === 'agent' ? newUser.value.parentUserId : null
    };

    await gqlRequest(mutation, variables, {
      headers: {
        'Authorization': `Bearer ${authStore.token}`
      }
    });

    await fetchData(); // Recarrega os dados
    showNewUserModal.value = false;
    newUser.value = { name: '', email: '', password: '', roleId: '', parentUserId: '' };
    alert('Usuário criado com sucesso!');
  } catch (error) {
    console.error('Erro ao criar usuário:', error);
    alert(error.message);
  } finally {
    loading.value = false;
  }
}

// Exclui usuário
async function deleteUser(user) {
  if (!confirm(t('admin.users.confirmDelete', { name: user.name }))) {
    return;
  }

  try {
    loading.value = true;
    const mutation = `
      mutation DeleteUser($id: ID!) {
        deleteUser(id: $id)
      }
    `;

    await gqlRequest(mutation, { id: user.id }, {
      headers: {
        'Authorization': `Bearer ${authStore.token}`
      }
    });

    await fetchData(); // Recarrega os dados
    alert('Usuário excluído com sucesso!');
  } catch (error) {
    console.error('Erro ao excluir usuário:', error);
    alert(error.message);
  } finally {
    loading.value = false;
  }
}

// Estado de carregamento inicial
async function init() {
  await fetchData();
}

onMounted(init);
</script> 