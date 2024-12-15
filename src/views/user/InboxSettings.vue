<template>
  <div class="flex h-full">
    <SecondarySidebar :sections="sidebarSections" />
    <div class="flex-1 p-6">
      <div>
        <!-- Seção de Caixas de Entrada -->
        <div class="mb-8">
          <div class="flex justify-between items-center mb-6 pr-4">
            <div>
              <h1 class="text-2xl font-bold">{{ t('settings.sections.inbox.title') }}</h1>
              <p class="text-sm text-base-content/70 mt-1">
                Um canal é o modo de comunicação que seu cliente escolhe para interagir com você.
              </p>
            </div>
            <button class="btn btn-primary" @click="showInboxModal = true">
              <span class="i-lucide-plus mr-2" />
              {{ t('settings.sections.inbox.addInbox') }}
            </button>
          </div>

          <!-- Loading state -->
          <div v-if="loading" class="flex justify-center items-center py-8">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-orbit-500"></div>
          </div>

          <!-- Empty state -->
          <div v-else-if="!inboxes.length" class="text-center py-12 bg-base-200 rounded-lg">
            <div class="i-lucide-inbox text-4xl mb-4 mx-auto opacity-50" />
            <p class="text-base-content/70">{{ t('settings.sections.inbox.noInboxes') }}</p>
            <p class="text-sm text-base-content/60 mt-2">
              {{ t('settings.sections.inbox.addInboxHelp') }}
            </p>
          </div>

          <!-- Tabela de Caixas de Entrada -->
          <div v-else class="overflow-x-auto">
            <div class="inline-block min-w-full align-middle">
              <div class="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                <table class="min-w-full divide-y divide-gray-300">
                  <thead class="bg-gray-50">
                    <tr>
                      <th scope="col" class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                        Nome
                      </th>
                      <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Tipo de Canal
                      </th>
                      <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Status
                      </th>
                      <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Times
                      </th>
                      <th scope="col" class="relative py-3.5 pl-3 pr-4 sm:pr-6">
                        <span class="sr-only">Ações</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-gray-200 bg-white">
                    <tr v-for="inbox in inboxes" :key="inbox.id">
                      <td class="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                        <div class="flex items-center">
                          <div class="h-8 w-8 rounded-full bg-orbit-100 flex items-center justify-center">
                            <span class="i-lucide-inbox h-4 w-4 text-orbit-600" />
                          </div>
                          <div class="ml-4">
                            <div class="font-medium text-gray-900">{{ inbox.name }}</div>
                            <div class="text-gray-500 text-xs">{{ inbox.description }}</div>
                          </div>
                        </div>
                      </td>
                      <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {{ formatChannelType(inbox.channelType) }}
                      </td>
                      <td class="whitespace-nowrap px-3 py-4 text-sm">
                        <span :class="[
                          'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                          inbox.isEnabled ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        ]">
                          {{ inbox.isEnabled ? 'Ativo' : 'Inativo' }}
                        </span>
                      </td>
                      <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {{ inbox.teams?.length || 0 }} times
                      </td>
                      <td class="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                        <button
                          @click="editInbox(inbox)"
                          class="text-orbit-600 hover:text-orbit-900 mr-4"
                        >
                          Editar
                        </button>
                        <button
                          @click="deleteInbox(inbox)"
                          class="text-red-600 hover:text-red-900"
                        >
                          Excluir
                        </button>
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

    <!-- Modal de Caixa de Entrada -->
    <Modal v-if="showInboxModal" @close="closeInboxModal">
      <template #title>
        {{ editingInbox ? 'Editar Caixa de Entrada' : 'Nova Caixa de Entrada' }}
      </template>
      <template #content>
        <form @submit.prevent="handleSubmit" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700">Nome</label>
            <input
              v-model="inboxForm.name"
              type="text"
              required
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orbit-500 focus:ring-orbit-500 sm:text-sm"
              placeholder="Ex: Chat do Site"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">Descrição</label>
            <textarea
              v-model="inboxForm.description"
              rows="2"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orbit-500 focus:ring-orbit-500 sm:text-sm"
              placeholder="Uma breve descrição desta caixa de entrada"
            ></textarea>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">Tipo de Canal</label>
            <select
              v-model="inboxForm.channelType"
              required
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orbit-500 focus:ring-orbit-500 sm:text-sm"
            >
              <option value="WEBCHAT">Chat do Site</option>
              <option value="WHATSAPP">WhatsApp</option>
              <option value="TELEGRAM">Telegram</option>
              <option value="EMAIL">E-mail</option>
              <option value="API">API</option>
            </select>
          </div>

          <div class="flex items-center">
            <input
              v-model="inboxForm.isEnabled"
              type="checkbox"
              class="h-4 w-4 rounded border-gray-300 text-orbit-600 focus:ring-orbit-500"
            />
            <label class="ml-2 block text-sm text-gray-900">Ativo</label>
          </div>
        </form>
      </template>
      <template #footer>
        <button
          type="button"
          @click="closeInboxModal"
          class="mr-3 inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orbit-500 focus:ring-offset-2"
        >
          Cancelar
        </button>
        <button
          type="submit"
          :disabled="loading"
          @click="handleSubmit"
          class="inline-flex justify-center rounded-md border border-transparent bg-orbit-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-orbit-700 focus:outline-none focus:ring-2 focus:ring-orbit-500 focus:ring-offset-2"
        >
          {{ loading ? 'Salvando...' : 'Salvar' }}
        </button>
      </template>
    </Modal>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useI18n } from '@/i18n/plugin'
import { useAuthStore } from '@/stores/auth.store'
import { useRouter } from 'vue-router'
import { gqlRequest } from '@/utils/graphql'
import SecondarySidebar from '@/components/layout/SecondarySidebar.vue'
import Modal from '@/components/Modal.vue'

const { t } = useI18n()
const authStore = useAuthStore()
const router = useRouter()

const loading = ref(false)
const inboxes = ref([])
const showInboxModal = ref(false)
const editingInbox = ref(null)
const inboxForm = ref({
  name: '',
  description: '',
  channelType: 'WEBCHAT',
  isEnabled: true
})

// Configuração da sidebar
const sidebarSections = computed(() => [
  {
    id: 'user-preferences',
    label: t('settings.sections.preferences.title'),
    items: [
      {
        id: 'settings-general',
        label: t('settings.sections.preferences.general.title'),
        icon: 'Settings'
      },
      {
        id: 'settings-profile',
        label: t('settings.sections.preferences.profile.title'),
        icon: 'Users'
      }
    ]
  },
  {
    id: 'inbox',
    label: t('settings.sections.inbox.title'),
    items: [
      {
        id: 'inbox-settings',
        label: t('settings.sections.inbox.inboxes'),
        icon: 'Inbox',
        to: '/settings/inbox'
      }
    ]
  },
  {
    id: 'notifications',
    label: t('settings.sections.notifications.title'),
    items: [
      {
        id: 'notification-preferences',
        label: t('settings.sections.notifications.preferences.title'),
        icon: 'Bell'
      }
    ]
  },
  {
    id: 'security',
    label: t('settings.sections.security.title'),
    items: [
      {
        id: 'security-settings',
        label: t('settings.sections.security.settings.title'),
        icon: 'Shield'
      },
      {
        id: 'api-tokens',
        label: t('settings.sections.security.apiTokens.title'),
        icon: 'Key'
      }
    ]
  }
])

// Função para buscar caixas de entrada
async function fetchInboxes() {
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
      query GetOrganization($id: ID!) {
        organization(id: $id) {
          id
          inboxes {
            id
            name
            description
            isEnabled
            channelType
            teams {
              id
              team {
                name
              }
            }
            createdAt
            updatedAt
          }
        }
      }
    `

    const response = await gqlRequest(query, {
      id: authStore.currentOrganization.id
    }, {
      headers: {
        'Authorization': `Bearer ${authStore.token}`
      }
    })

    inboxes.value = response.organization?.inboxes || []
  } catch (error) {
    console.error('Erro ao carregar caixas de entrada:', error)
    if (error.message.includes('autoriza') || error.message.includes('autentica')) {
      authStore.logout()
      router.push('/login')
    }
    showToast(error.message, 'error')
  } finally {
    loading.value = false
  }
}

// Função para formatar o tipo de canal
function formatChannelType(type) {
  const types = {
    WEBCHAT: 'Chat Web',
    WHATSAPP: 'WhatsApp',
    TELEGRAM: 'Telegram',
    EMAIL: 'E-mail',
    API: 'API'
  }
  return types[type] || type
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

// Função para fechar o modal e limpar o formulário
function closeInboxModal() {
  showInboxModal.value = false
  editingInbox.value = null
  inboxForm.value = {
    name: '',
    description: '',
    channelType: 'WEBCHAT',
    isEnabled: true
  }
}

// Função para editar caixa de entrada
function editInbox(inbox) {
  editingInbox.value = inbox
  inboxForm.value = {
    name: inbox.name,
    description: inbox.description || '',
    channelType: inbox.channelType,
    isEnabled: inbox.isEnabled
  }
  showInboxModal.value = true
}

// Função para salvar caixa de entrada
async function handleSubmit() {
  try {
    loading.value = true

    const mutation = editingInbox.value
      ? `
        mutation UpdateInbox($id: ID!, $input: InboxInput!) {
          updateInbox(id: $id, input: $input) {
            id
            name
            description
            isEnabled
            channelType
            teams {
              id
              team {
                name
              }
            }
          }
        }
      `
      : `
        mutation CreateInbox($input: InboxInput!) {
          createInbox(input: $input) {
            id
            name
            description
            isEnabled
            channelType
            teams {
              id
              team {
                name
              }
            }
          }
        }
      `

    const variables = editingInbox.value
      ? {
          id: editingInbox.value.id,
          input: {
            name: inboxForm.value.name,
            description: inboxForm.value.description,
            channelType: inboxForm.value.channelType,
            organizationId: authStore.currentOrganization.id
          }
        }
      : {
          input: {
            name: inboxForm.value.name,
            description: inboxForm.value.description,
            channelType: inboxForm.value.channelType,
            organizationId: authStore.currentOrganization.id
          }
        }

    await gqlRequest(mutation, variables)
    
    await fetchInboxes()
    showToast(editingInbox.value ? 'Caixa de entrada atualizada com sucesso!' : 'Caixa de entrada criada com sucesso!')
    closeInboxModal()
  } catch (error) {
    console.error('Erro ao salvar caixa de entrada:', error)
    showToast(error.message, 'error')
  } finally {
    loading.value = false
  }
}

// Função para excluir caixa de entrada
async function deleteInbox(inbox) {
  if (!confirm(`Tem certeza que deseja excluir a caixa de entrada "${inbox.name}"?`)) {
    return
  }

  try {
    loading.value = true

    const mutation = `
      mutation DeleteInbox($id: ID!) {
        deleteInbox(id: $id)
      }
    `

    await gqlRequest(mutation, { id: inbox.id })
    
    await fetchInboxes()
    showToast('Caixa de entrada excluída com sucesso!')
  } catch (error) {
    console.error('Erro ao excluir caixa de entrada:', error)
    showToast(error.message, 'error')
  } finally {
    loading.value = false
  }
}

onMounted(fetchInboxes)
</script> 