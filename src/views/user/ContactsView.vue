<template>
  <div class="flex h-full overflow-hidden">
    <SecondarySidebar 
      :sections="sidebarSections" 
      :show-sidebar="showSecondarySidebar"
    />
    <div class="flex-1 p-6">
      <div class="sm:flex sm:items-center">
        <div class="sm:flex-auto">
          <div class="flex items-center gap-3">
            <button 
              class="btn btn-sm btn-ghost"
              @click="showSecondarySidebar = !showSecondarySidebar"
            >
              <component 
                :is="showSecondarySidebar ? PanelLeftClose : PanelLeft" 
                class="h-4 w-4"
              />
            </button>
            <h1 class="text-2xl font-semibold text-gray-900">{{ t('contacts.title') }}</h1>
          </div>
          <p class="mt-2 text-sm text-gray-700">
            {{ t('contacts.description') }}
          </p>
        </div>
        <div class="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <button
            @click="showNewContactModal = true"
            class="inline-flex items-center justify-center rounded-md border border-transparent bg-orbit-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-orbit-700 focus:outline-none focus:ring-2 focus:ring-orbit-500 focus:ring-offset-2 sm:w-auto"
          >
            {{ t('contacts.addContact') }}
          </button>
        </div>
      </div>

      <!-- Loading state -->
      <div v-if="loading" class="flex justify-center items-center py-8">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-orbit-500"></div>
      </div>

      <!-- Error state -->
      <div v-else-if="!contacts.length" class="text-center py-8">
        <p class="text-gray-500">{{ t('contacts.noContacts') }}</p>
      </div>

      <!-- Tabela de Contatos -->
      <div v-else class="mt-8 flex flex-col">
        <div class="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div class="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
            <div class="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
              <table class="min-w-full divide-y divide-gray-300">
                <thead class="bg-gray-50">
                  <tr>
                    <th scope="col" class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                      {{ t('contacts.table.name') }}
                    </th>
                    <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      {{ t('contacts.table.email') }}
                    </th>
                    <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      {{ t('contacts.table.phone') }}
                    </th>
                    <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      {{ t('contacts.table.lastContact') }}
                    </th>
                    <th scope="col" class="relative py-3.5 pl-3 pr-4 sm:pr-6">
                      <span class="sr-only">{{ t('common.actions') }}</span>
                    </th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-200 bg-white">
                  <tr v-for="contact in contacts" :key="contact.id">
                    <td class="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                      <div class="flex items-center cursor-pointer" @click="handleContactClick(contact)">
                        <div v-if="contact.avatar" class="h-8 w-8 flex-shrink-0">
                          <img :src="contact.avatar" :alt="contact.name" class="h-8 w-8 rounded-full" />
                        </div>
                        <div v-else class="h-8 w-8 rounded-full bg-orbit-100 flex items-center justify-center">
                          <span class="text-orbit-600 font-medium">{{ getInitials(contact.name) }}</span>
                        </div>
                        <div class="ml-4">
                          <div class="font-medium text-gray-900">{{ contact.name }}</div>
                          <div v-if="contact.tags?.length" class="mt-1">
                            <span 
                              v-for="tag in contact.tags" 
                              :key="tag"
                              class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-orbit-100 text-orbit-800 mr-1"
                            >
                              {{ tag }}
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {{ contact.email }}
                    </td>
                    <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {{ contact.phone }}
                    </td>
                    <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {{ formatDate(contact.lastContactedAt) }}
                    </td>
                    <td class="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                      <button
                        @click="editContact(contact)"
                        class="text-orbit-600 hover:text-orbit-900 mr-4"
                      >
                        {{ t('common.edit') }}
                      </button>
                      <button
                        @click="deleteContact(contact)"
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

      <!-- Modal Novo Contato -->
      <Modal v-if="showNewContactModal" @close="showNewContactModal = false">
        <template #title>{{ t('contacts.newContact') }}</template>
        <template #content>
          <form @submit.prevent="handleCreateContact" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700">
                {{ t('contacts.form.name') }}
              </label>
              <input
                v-model="newContact.name"
                type="text"
                required
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orbit-500 focus:ring-orbit-500 sm:text-sm"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700">
                {{ t('contacts.form.email') }}
              </label>
              <input
                v-model="newContact.email"
                type="email"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orbit-500 focus:ring-orbit-500 sm:text-sm"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700">
                {{ t('contacts.form.phone') }}
              </label>
              <input
                v-model="newContact.phone"
                type="tel"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orbit-500 focus:ring-orbit-500 sm:text-sm"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700">
                {{ t('contacts.form.tags') }}
              </label>
              <input
                v-model="newContact.tags"
                type="text"
                placeholder="Separe as tags por vírgula"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orbit-500 focus:ring-orbit-500 sm:text-sm"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700">
                {{ t('contacts.form.notes') }}
              </label>
              <textarea
                v-model="newContact.notes"
                rows="3"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orbit-500 focus:ring-orbit-500 sm:text-sm"
              ></textarea>
            </div>
          </form>
        </template>
        <template #footer>
          <button
            type="button"
            @click="showNewContactModal = false"
            class="mr-3 inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orbit-500 focus:ring-offset-2"
          >
            {{ t('common.cancel') }}
          </button>
          <button
            type="submit"
            :disabled="loading"
            @click="handleCreateContact"
            class="inline-flex justify-center rounded-md border border-transparent bg-orbit-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-orbit-700 focus:outline-none focus:ring-2 focus:ring-orbit-500 focus:ring-offset-2"
          >
            {{ loading ? t('common.loading') : t('common.save') }}
          </button>
        </template>
      </Modal>

      <!-- Modal de Edição -->
      <Modal v-if="showEditModal" @close="showEditModal = false">
        <template #title>{{ t('contacts.editContact') }}</template>
        <template #content>
          <form @submit.prevent="handleUpdateContact" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700">
                {{ t('contacts.form.name') }}
              </label>
              <input
                v-model="editingContact.name"
                type="text"
                required
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orbit-500 focus:ring-orbit-500 sm:text-sm"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700">
                {{ t('contacts.form.email') }}
              </label>
              <input
                v-model="editingContact.email"
                type="email"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orbit-500 focus:ring-orbit-500 sm:text-sm"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700">
                {{ t('contacts.form.phone') }}
              </label>
              <input
                v-model="editingContact.phone"
                type="tel"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orbit-500 focus:ring-orbit-500 sm:text-sm"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700">
                {{ t('contacts.form.tags') }}
              </label>
              <input
                v-model="editingContact.tags"
                type="text"
                placeholder="Separe as tags por vírgula"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orbit-500 focus:ring-orbit-500 sm:text-sm"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700">
                {{ t('contacts.form.notes') }}
              </label>
              <textarea
                v-model="editingContact.notes"
                rows="3"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orbit-500 focus:ring-orbit-500 sm:text-sm"
              ></textarea>
            </div>
          </form>
        </template>
        <template #footer>
          <button
            type="button"
            @click="showEditModal = false"
            class="mr-3 inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orbit-500 focus:ring-offset-2"
          >
            {{ t('common.cancel') }}
          </button>
          <button
            type="submit"
            :disabled="loading"
            @click="handleUpdateContact"
            class="inline-flex justify-center rounded-md border border-transparent bg-orbit-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-orbit-700 focus:outline-none focus:ring-2 focus:ring-orbit-500 focus:ring-offset-2"
          >
            {{ loading ? t('common.loading') : t('common.save') }}
          </button>
        </template>
      </Modal>
    </div>
    
    <!-- Sidebar Direita de Detalhes -->
    <div v-if="selectedContact" 
      class="w-96 border-l border-base-300 bg-base-100 overflow-y-auto flex flex-col h-full">
      <!-- Cabeçalho -->
      <div class="p-4 border-b border-base-300">
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center">
            <div v-if="selectedContact.avatar" class="h-10 w-10 flex-shrink-0">
              <img :src="selectedContact.avatar" :alt="selectedContact.name" class="h-10 w-10 rounded-full" />
            </div>
            <div v-else class="h-10 w-10 rounded-full bg-orbit-100 flex items-center justify-center">
              <span class="text-orbit-600 font-medium">{{ getInitials(selectedContact.name) }}</span>
            </div>
            <div class="ml-3">
              <h2 class="text-lg font-medium text-base-content">{{ selectedContact.name }}</h2>
              <p class="text-sm text-base-content/70">{{ selectedContact.email }}</p>
            </div>
          </div>
          <button @click="selectedContact = null" class="text-base-content/70 hover:text-base-content">
            <span class="sr-only">Fechar</span>
            <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
            </svg>
          </button>
        </div>

        <!-- Botões de Ação -->
        <div class="flex gap-2">
          <button class="btn btn-sm btn-primary flex-1">Iniciar Conversa</button>
          <button @click="editContact(selectedContact)" class="btn btn-sm btn-ghost">Editar</button>
          <button @click="deleteContact(selectedContact)" class="btn btn-sm btn-ghost text-error">Excluir</button>
        </div>
      </div>

      <!-- Blocos de Informação -->
      <div class="p-4 space-y-6">
        <!-- Bloco de Ações do Kanban -->
        <div class="space-y-2">
          <h3 class="text-sm font-medium text-base-content/70">Ações do Kanban</h3>
          <div class="bg-base-200 rounded-lg p-4">
            <div class="space-y-4">
              <div>
                <h4 class="text-sm font-medium">Funil</h4>
                <button class="btn btn-sm btn-ghost w-full justify-start mt-1">
                  <span class="text-base-content/70">Definir funil</span>
                </button>
              </div>
              <div>
                <h4 class="text-sm font-medium">Status</h4>
                <div class="bg-info/10 text-info rounded p-2 mt-1">
                  <span class="text-sm">Negociação</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Bloco de Informações de Contato -->
        <div class="space-y-2">
          <h3 class="text-sm font-medium text-base-content/70">Informações de Contato</h3>
          <div class="space-y-3">
            <div v-if="selectedContact.phone" class="flex items-center gap-2">
              <span class="text-base-content/70">Telefone:</span>
              <a :href="'tel:' + selectedContact.phone" class="text-primary">{{ selectedContact.phone }}</a>
            </div>
            <div v-if="selectedContact.email" class="flex items-center gap-2">
              <span class="text-base-content/70">Email:</span>
              <a :href="'mailto:' + selectedContact.email" class="text-primary">{{ selectedContact.email }}</a>
            </div>
            <div v-if="selectedContact.tags?.length" class="flex flex-wrap gap-1">
              <span 
                v-for="tag in selectedContact.tags" 
                :key="tag"
                class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-orbit-100 text-orbit-800"
              >
                {{ tag }}
              </span>
            </div>
          </div>
        </div>

        <!-- Bloco de Notas -->
        <div class="space-y-2">
          <h3 class="text-sm font-medium text-base-content/70">Notas</h3>
          <p class="text-sm text-base-content/70">{{ selectedContact.notes || 'Nenhuma nota adicionada' }}</p>
        </div>

        <!-- Bloco de Histórico -->
        <div class="space-y-2">
          <h3 class="text-sm font-medium text-base-content/70">Histórico</h3>
          <div class="text-sm text-base-content/70">
            <p>Último contato: {{ formatDate(selectedContact.lastContactedAt) || 'Nunca contatado' }}</p>
            <p>Criado em: {{ formatDate(selectedContact.createdAt) }}</p>
            <p>Atualizado em: {{ formatDate(selectedContact.updatedAt) }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useI18n } from '@/i18n'
import { gqlRequest } from '@/utils/graphql'
import { useAuthStore } from '@/stores/auth.store'
import { useRouter } from 'vue-router'
import Modal from '@/components/Modal.vue'
import SecondarySidebar from '@/components/layout/SecondarySidebar.vue'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { PanelLeftClose, PanelLeft } from 'lucide-vue-next'

const { t } = useI18n()
const authStore = useAuthStore()
const router = useRouter()
const contacts = ref([])
const loading = ref(false)
const showNewContactModal = ref(false)
const showEditModal = ref(false)
const editingContact = ref(null)
const selectedContact = ref(null)
const showSecondarySidebar = ref(true)

const newContact = ref({
  name: '',
  email: '',
  phone: '',
  tags: '',
  notes: ''
})

// Configuração das seções da sidebar
const sidebarSections = computed(() => [
  {
    id: 'contacts-management',
    label: t('contacts.management'),
    items: [
      {
        id: 'all-contacts',
        label: t('contacts.allContacts'),
        icon: 'Users'
      },
      {
        id: 'favorites',
        label: t('contacts.favorites'),
        icon: 'Star'
      },
      {
        id: 'recent',
        label: t('contacts.recent'),
        icon: 'Clock'
      }
    ]
  },
  {
    id: 'segments',
    label: t('contacts.segments.title'),
    items: [
      {
        id: 'customers',
        label: t('contacts.segments.customers'),
        icon: 'UserCheck'
      },
      {
        id: 'leads',
        label: t('contacts.segments.leads'),
        icon: 'Flag'
      },
      {
        id: 'archived',
        label: t('contacts.segments.archived'),
        icon: 'Archive'
      }
    ]
  }
])

// Função para buscar contatos
async function fetchContacts() {
  try {
    loading.value = true
    if (!authStore.isAuthenticated) {
      throw new Error('Não autenticado')
    }

    // Verifica se tem organização selecionada
    if (!authStore.currentOrganization?.id) {
      throw new Error('Selecione uma organização primeiro')
    }

    const query = `
      query GetContacts($organizationId: ID!) {
        contacts(organizationId: $organizationId) {
          id
          name
          email
          phone
          avatar
          tags
          notes
          lastContactedAt
          createdAt
          updatedAt
        }
      }
    `

    const response = await gqlRequest(query, {
      organizationId: authStore.currentOrganization.id
    }, {
      headers: {
        'Authorization': `Bearer ${authStore.token}`
      }
    })

    contacts.value = response.contacts
  } catch (error) {
    console.error('Erro ao carregar contatos:', error)
    if (error.message.includes('autoriza') || error.message.includes('autentica')) {
      authStore.logout()
      router.push('/login')
    }
    showToast(error.message, 'error')
  } finally {
    loading.value = false
  }
}

// Função para criar novo contato
async function handleCreateContact() {
  try {
    if (!newContact.value.name) {
      showToast(t('contacts.errors.nameRequired'), 'error')
      return
    }

    loading.value = true
    const tagsArray = newContact.value.tags ? newContact.value.tags.split(',').map(tag => tag.trim()) : []
    const { data } = await gqlRequest(
      `
      mutation CreateContact($input: ContactInput!) {
        createContact(input: $input) {
          id
          name
          email
          phone
          tags
          notes
          lastContactedAt
          createdAt
        }
      }
      `,
      {
        input: {
          name: newContact.value.name,
          email: newContact.value.email || null,
          phone: newContact.value.phone || null,
          tags: tagsArray,
          notes: newContact.value.notes || null,
          organizationId: authStore.currentOrganization.id
        }
      }
    )

    await fetchContacts()
    showNewContactModal.value = false
    newContact.value = { name: '', email: '', phone: '', tags: '', notes: '' }
    showToast(t('contacts.createSuccess'))
  } catch (error) {
    console.error('Erro ao criar contato:', error)
    showToast(error.message, 'error')
  } finally {
    loading.value = false
  }
}

// Função para editar contato
async function editContact(contact) {
  editingContact.value = {
    ...contact,
    tags: contact.tags?.join(', ') || ''
  }
  showEditModal.value = true
}

// Função para atualizar contato
async function handleUpdateContact() {
  try {
    if (!authStore.currentOrganization?.id) {
      throw new Error('Selecione uma organização primeiro')
    }

    loading.value = true
    const mutation = `
      mutation UpdateContact($id: ID!, $input: ContactInput!) {
        updateContact(id: $id, input: $input) {
          id
          name
          email
          phone
          tags
          notes
        }
      }
    `

    const variables = {
      id: editingContact.value.id,
      input: {
        name: editingContact.value.name,
        email: editingContact.value.email || null,
        phone: editingContact.value.phone || null,
        tags: editingContact.value.tags.split(',').map(tag => tag.trim()),
        notes: editingContact.value.notes || null,
        organizationId: authStore.currentOrganization.id
      }
    }

    await gqlRequest(mutation, variables, {
      headers: {
        'Authorization': `Bearer ${authStore.token}`
      }
    })

    await fetchContacts()
    showEditModal.value = false
    editingContact.value = null
    showToast(t('contacts.updateSuccess'))
  } catch (error) {
    console.error('Erro ao atualizar contato:', error)
    showToast(error.message, 'error')
  } finally {
    loading.value = false
  }
}

// Função para excluir contato
async function deleteContact(contact) {
  if (!confirm(t('contacts.confirmDelete', { name: contact.name }))) {
    return
  }

  try {
    loading.value = true
    const mutation = `
      mutation DeleteContact($id: ID!) {
        deleteContact(id: $id)
      }
    `

    await gqlRequest(mutation, { id: contact.id }, {
      headers: {
        'Authorization': `Bearer ${authStore.token}`
      }
    })

    await fetchContacts()
    showToast(t('contacts.deleteSuccess'))
  } catch (error) {
    console.error('Erro ao excluir contato:', error)
    showToast(error.message, 'error')
  } finally {
    loading.value = false
  }
}

// Função para formatar data
function formatDate(date) {
  if (!date) return '-'
  return format(new Date(date), 'dd/MM/yyyy HH:mm', { locale: ptBR })
}

// Função para obter iniciais do nome
function getInitials(name) {
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

// Função para mostrar toast
function showToast(message, type = 'success') {
  const toast = document.createElement('div')
  toast.className = `toast toast-top toast-end z-50`

  const alert = document.createElement('div')
  alert.className = `alert ${type === 'success' ? 'alert-success' : 'alert-error'} shadow-lg`

  const content = document.createElement('div')
  content.className = 'flex items-center gap-2'

  const icon = document.createElement('span')
  icon.className = 'text-lg'
  icon.textContent = type === 'success' ? '✓' : '✕'
  
  const text = document.createElement('span')
  text.textContent = message

  content.appendChild(icon)
  content.appendChild(text)
  alert.appendChild(content)
  toast.appendChild(alert)

  document.body.appendChild(toast)

  setTimeout(() => {
    toast.remove()
  }, 3000)
}

// Modifique a função de clique na linha da tabela
function handleContactClick(contact) {
  selectedContact.value = contact
}

onMounted(fetchContacts)
</script>

<style scoped>
.toast {
  position: fixed;
  top: 1rem;
  right: 1rem;
  z-index: 1000;
}

.alert {
  min-width: 200px;
  max-width: 400px;
}

/* Adicione estilos para a sidebar direita */
.sidebar-right-enter-active,
.sidebar-right-leave-active {
  transition: transform 0.3s ease-in-out;
}

.sidebar-right-enter-from,
.sidebar-right-leave-to {
  transform: translateX(100%);
}
</style> 