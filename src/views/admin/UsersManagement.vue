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

    <!-- Modal de Edição -->
    <Modal v-if="showEditModal" @close="showEditModal = false">
      <template #title>{{ t('admin.users.editUser') }}</template>
      <template #content>
        <form @submit.prevent="handleUpdateUser" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700">
              {{ t('admin.users.form.name') }}
            </label>
            <input
              v-model="editingUser.name"
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
              v-model="editingUser.email"
              type="email"
              required
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">
              {{ t('admin.users.form.role') }}
            </label>
            <select
              v-model="editingUser.roleId"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm"
            >
              <option value="">{{ t('admin.users.form.selectRole') }}</option>
              <option v-for="role in roles" :key="role.id" :value="role.id">
                {{ role.name }}
              </option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">
              {{ t('admin.users.form.status.title') }}
            </label>
            <div class="mt-2">
              <label class="inline-flex items-center">
                <input
                  type="checkbox"
                  v-model="editingUser.active"
                  class="form-checkbox h-4 w-4 text-purple-600 transition duration-150 ease-in-out"
                  :title="t('admin.users.form.status.toggleActive')"
                />
                <span class="ml-2">{{ editingUser.active ? t('admin.users.form.status.active') : t('admin.users.form.status.inactive') }}</span>
              </label>
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">
              {{ t('admin.users.form.organization.title') }}
            </label>
            <div class="relative mt-1" ref="orgDropdownContainer">
              <div 
                @click="showOrgDropdown = !showOrgDropdown"
                class="cursor-pointer bg-white border border-gray-300 rounded-md px-3 py-2 flex items-center justify-between"
              >
                <div class="flex items-center gap-2">
                  <template v-if="editingUser.currentOrgId">
                    <div class="flex items-center gap-2">
                      <UserAvatar 
                        :name="organizations.find(o => o.id === editingUser.currentOrgId)?.name || ''"
                        size="sm"
                      />
                      <span class="text-sm">
                        {{ organizations.find(o => o.id === editingUser.currentOrgId)?.name }}
                      </span>
                    </div>
                  </template>
                  <span v-else class="text-gray-500 text-sm">
                    {{ t('admin.users.form.organization.select') }}
                  </span>
                </div>
                <svg class="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
                </svg>
              </div>

              <!-- Dropdown -->
              <div 
                v-if="showOrgDropdown" 
                class="absolute z-50 mt-1 w-full bg-white shadow-lg rounded-md py-1 max-h-60 overflow-auto"
                style="min-width: 100%;"
              >
                <div class="px-3 py-2">
                  <input
                    ref="searchInput"
                    v-model="orgSearchText"
                    type="text"
                    class="w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500"
                    :placeholder="t('common.search')"
                  />
                </div>
                
                <div class="mt-2">
                  <div
                    v-for="org in filteredOrganizations"
                    :key="org.id"
                    @click="() => {
                      editingUser.currentOrgId = org.id;
                      showOrgDropdown = false;
                    }"
                    class="px-3 py-2 hover:bg-purple-50 cursor-pointer"
                  >
                    <div class="flex items-center justify-between">
                      <div class="flex items-center gap-2">
                        <UserAvatar 
                          :name="org.name"
                          size="sm"
                        />
                        <div>
                          <div class="text-sm font-medium text-gray-900">{{ org.name }}</div>
                          <div class="text-xs text-gray-500">{{ org.slug }}</div>
                        </div>
                      </div>
                      <span 
                        class="badge badge-sm"
                        :class="{
                          'badge-ghost': org.plan === 'FREE',
                          'badge-primary': org.plan === 'STARTER',
                          'badge-secondary': org.plan === 'PROFESSIONAL',
                          'badge-accent': org.plan === 'ENTERPRISE'
                        }"
                      >
                        {{ org.plan }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </template>
      <template #footer>
        <button
          type="button"
          @click="showEditModal = false"
          class="mr-3 inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
        >
          {{ t('common.cancel') }}
        </button>
        <button
          type="submit"
          :disabled="loading"
          @click="handleUpdateUser"
          class="inline-flex justify-center rounded-md border border-transparent bg-purple-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
        >
          {{ loading ? t('common.loading') : t('common.save') }}
        </button>
      </template>
    </Modal>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, nextTick, watch, onUnmounted } from 'vue';
import { useI18n } from '@/i18n/plugin';
import { gqlRequest } from '@/utils/graphql';
import { useAuthStore } from '../../stores/auth.store';
import { useRouter } from 'vue-router';
import Modal from '../../components/Modal.vue';
import UserAvatar from '../../components/chats/UserAvatar.vue';

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
const showEditModal = ref(false)
const editingUser = ref(null)
const organizations = ref([])
const orgSearchText = ref('')
const showOrgDropdown = ref(false)
const selectedOrganizations = ref([])
const searchInput = ref(null)
const orgDropdownContainer = ref(null)

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

// Modifica a função fetchData para usar a query correta
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
          currentOrgId
          createdAt
          updatedAt
        }
        roles {
          id
          name
        }
        organizations {
          id
          name
          slug
          plan
        }
      }
    `;

    const response = await gqlRequest(query, null, {
      headers: {
        'Authorization': `Bearer ${authStore.token}`
      }
    });

    console.log('Dados carregados:', response);
    users.value = response.users;
    roles.value = response.roles;
    organizations.value = response.organizations || [];
    await loadPotentialParentUsers();
  } catch (error) {
    console.error('Erro ao carregar dados:', error);
    if (error.message.includes('autoriza') || error.message.includes('autentica')) {
      authStore.logout();
      router.push('/login');
    }
    showToast(error.message, 'error');
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
    showToast(t('admin.users.createSuccess'));
  } catch (error) {
    console.error('Erro ao criar usuário:', error);
    showToast(error.message, 'error');
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

    await fetchData();
    showToast(t('admin.users.deleteSuccess'));
  } catch (error) {
    console.error('Erro ao excluir usuário:', error);
    showToast(error.message, 'error');
  } finally {
    loading.value = false;
  }
}

// Estado de carregamento inicial
async function init() {
  await fetchData();
}

onMounted(init);

// Função para buscar organizações
async function fetchOrganizations() {
  try {
    const query = `
      query GetOrganizations {
        organizations {
          id
          name
          slug
        }
      }
    `

    const response = await gqlRequest(query, null, {
      headers: {
        'Authorization': `Bearer ${authStore.token}`
      }
    })

    organizations.value = response.organizations || []
  } catch (error) {
    console.error('Erro ao carregar organizações:', error)
  }
}

// Função para editar usuário
function editUser(user) {
  editingUser.value = {
    id: user.id,
    name: user.name,
    email: user.email,
    roleId: user.role?.id,
    active: user.active,
    currentOrgId: user.currentOrgId || ''
  }
  showEditModal.value = true
}

// Função para atualizar usuário
async function handleUpdateUser() {
  try {
    loading.value = true;
    const mutation = `
      mutation UpdateUser($id: ID!, $input: UserInput!) {
        updateUser(id: $id, input: $input) {
          id
          name
          email
          role {
            id
            name
          }
          active
          currentOrgId
        }
      }
    `;

    await gqlRequest(mutation, {
      id: editingUser.value.id,
      input: {
        name: editingUser.value.name,
        email: editingUser.value.email,
        roleId: editingUser.value.roleId,
        active: editingUser.value.active,
        currentOrgId: editingUser.value.currentOrgId || null
      }
    });
    
    showEditModal.value = false;
    await fetchData();
    showToast(t('admin.users.updateSuccess'));
  } catch (error) {
    console.error('Erro ao atualizar usuário:', error);
    showToast(error.message, 'error');
  } finally {
    loading.value = false;
  }
}

// Computed para filtrar organizações
const filteredOrganizations = computed(() => {
  return organizations.value.filter(org => 
    org.name.toLowerCase().includes(orgSearchText.value.toLowerCase())
  )
})

// Verifica se uma organização está selecionada
function isOrganizationSelected(org) {
  return selectedOrganizations.value.some(selected => selected.id === org.id)
}

// Adiciona/remove organização da seleção
function toggleOrganization(org) {
  const index = selectedOrganizations.value.findIndex(selected => selected.id === org.id)
  if (index === -1) {
    selectedOrganizations.value.push(org)
  } else {
    selectedOrganizations.value.splice(index, 1)
  }
}

// Remove organização da seleção
function removeOrganization(org) {
  const index = selectedOrganizations.value.findIndex(selected => selected.id === org.id)
  if (index !== -1) {
    selectedOrganizations.value.splice(index, 1)
  }
}

// Atualizar o evento de clique fora
onMounted(() => {
  document.addEventListener('click', (e) => {
    if (orgDropdownContainer.value && !orgDropdownContainer.value.contains(e.target)) {
      showOrgDropdown.value = false
    }
  })
})

// Remover o evento ao desmontar o componente
onUnmounted(() => {
  document.removeEventListener('click', (e) => {
    if (orgDropdownContainer.value && !orgDropdownContainer.value.contains(e.target)) {
      showOrgDropdown.value = false
    }
  })
})

// Função para gerar cor da badge baseada no plano da organização
function getOrgBadgeColor(org) {
  const colors = {
    'FREE': 'badge-ghost',
    'STARTER': 'badge-primary',
    'PROFESSIONAL': 'badge-secondary',
    'ENTERPRISE': 'badge-accent'
  }
  return colors[org.plan] || 'badge-neutral'
}

// Foca no input de pesquisa quando abrir o dropdown
watch(showOrgDropdown, (newValue) => {
  if (newValue) {
    nextTick(() => {
      searchInput.value?.focus()
    })
  }
})

// Função para buscar usuários
async function fetchUsers() {
  try {
    loading.value = true
    const query = `
      query GetUsers {
        users {
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
    `
    const response = await gqlRequest(query)
    users.value = response.users
  } catch (error) {
    console.error('Erro ao buscar usuários:', error)
    showToast(error.message, 'error')
  } finally {
    loading.value = false
  }
}

// Função para buscar roles
async function fetchRoles() {
  try {
    const query = `
      query GetRoles {
        roles {
          id
          name
        }
      }
    `
    const response = await gqlRequest(query)
    roles.value = response.roles
  } catch (error) {
    console.error('Erro ao buscar roles:', error)
    showToast(error.message, 'error')
  }
}

// Carregar dados iniciais
onMounted(async () => {
  await Promise.all([fetchUsers(), fetchRoles()])
})

// Adicionar fun��ão showToast
function showToast(message, type = 'success') {
  // Cria o elemento toast
  const toast = document.createElement('div');
  toast.className = 'toast toast-top toast-end z-50';

  // Cria o alerta
  const alert = document.createElement('div');
  alert.className = `alert ${type === 'success' ? 'alert-success' : 'alert-error'}`;

  // Cria o conteúdo
  const content = document.createElement('span');
  content.textContent = message;

  // Monta a estrutura
  alert.appendChild(content);
  toast.appendChild(alert);
  document.body.appendChild(toast);

  // Remove após 3 segundos
  setTimeout(() => {
    toast.remove();
  }, 3000);
}
</script> 

<style scoped>
/* Ajusta a altura do modal dinamicamente */
.modal-dynamic-height :deep(.modal-box) {
  max-height: 90vh;
  height: auto;
  min-height: fit-content;
  overflow: visible;
  transition: all 0.3s ease;
}

/* Ajusta o container do form para ter scroll quando necessário */
.modal-dynamic-height :deep(.modal-box) form {
  max-height: calc(90vh - 10rem);
  overflow-y: auto;
  padding-right: 0.5rem;
}

/* Ajusta o dropdown para não ser cortado */
.form-control {
  position: relative;
  z-index: 50;
}

/* Container do dropdown */
.form-control .relative {
  position: static; /* Permite que o dropdown expanda o modal */
}

/* Dropdown de organizações */
.form-control .relative > div[class*="absolute"] {
  position: relative;
  width: 100%;
  margin-top: 0.5rem;
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
}

/* Garante que o dropdown fique sobre outros elementos */
.dropdown-content {
  z-index: 60;
}

/* Adiciona scroll suave */
.form-control, .modal-box {
  scrollbar-width: thin;
  scrollbar-color: theme('colors.purple.500') theme('colors.gray.200');
}

/* Estiliza a scrollbar para navegadores webkit */
.form-control::-webkit-scrollbar,
.modal-box::-webkit-scrollbar {
  width: 6px;
}

.form-control::-webkit-scrollbar-track,
.modal-box::-webkit-scrollbar-track {
  background: theme('colors.gray.200');
  border-radius: 3px;
}

.form-control::-webkit-scrollbar-thumb,
.modal-box::-webkit-scrollbar-thumb {
  background-color: theme('colors.purple.500');
  border-radius: 3px;
}

/* Ajusta o espaçamento do conteúdo do modal */
.modal-dynamic-height :deep(.modal-box) {
  padding: 1.5rem;
}

/* Garante que o modal se expanda com o dropdown */
.modal-dynamic-height :deep(.modal-box) {
  overflow: visible !important;
}
</style> 