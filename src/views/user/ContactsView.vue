<script setup>
import { ref, onMounted } from 'vue'
import { useI18n } from '@/i18n/plugin'
import { useAuthStore } from '@/stores/auth.store'
import { useRouter } from 'vue-router'
import { gqlRequest } from '@/utils/graphql'
import { 
  Search, 
  Plus, 
  Filter,
  MoreVertical,
  Mail,
  Phone,
  Tag,
  Building,
  Calendar
} from 'lucide-vue-next'
import Modal from '@/components/Modal.vue'

const { t } = useI18n()
const authStore = useAuthStore()
const router = useRouter()

// Estado
const contacts = ref([])
const loading = ref(true)
const searchQuery = ref('')
const selectedTags = ref([])
const showFilters = ref(false)
const error = ref(null)

// Estado para novo contato
const showNewContactModal = ref(false)
const newContact = ref({
  name: '',
  email: '',
  phone: '',
  customFields: {
    empresa: '',
    cargo: ''
  },
  tags: [],
  notes: ''
})

// Busca contatos
async function fetchData() {
  try {
    loading.value = true
    error.value = null
    console.log('Iniciando fetchData...')

    // Primeiro, busca as organizações do usuário
    const orgQuery = `
      query GetUserOrganizations {
        me {
          id
          organizations {
            organization {
              id
              name
              slug
            }
            isAdmin
            isOwner
          }
        }
      }
    `

    const orgResponse = await gqlRequest(orgQuery, null, {
      headers: {
        'Authorization': `Bearer ${authStore.token}`
      }
    })

    // Se o usuário tem organizações
    if (orgResponse?.me?.organizations?.length > 0) {
      // Se não tem organização atual selecionada, seleciona a primeira
      if (!authStore.currentOrganization) {
        const firstOrg = orgResponse.me.organizations[0].organization
        authStore.setCurrentOrganization(firstOrg)
      }

      // Agora busca os contatos da organização atual
      const contactsQuery = `
        query GetOrganizationContacts($organizationId: ID!) {
          organization(id: $organizationId) {
            contacts {
              id
              name
              email
              phone
              avatar
              tags
              customFields
              lastContactedAt
              createdAt
            }
          }
        }
      `

      const contactsResponse = await gqlRequest(contactsQuery, {
        organizationId: authStore.currentOrganizationId
      }, {
        headers: {
          'Authorization': `Bearer ${authStore.token}`
        }
      })

      contacts.value = contactsResponse?.organization?.contacts || []
    } else {
      error.value = 'Você não está vinculado a nenhuma organização. Entre em contato com o administrador.'
    }

  } catch (err) {
    console.error('Erro detalhado ao buscar dados:', err)
    error.value = 'Erro ao carregar contatos. Tente novamente.'
  } finally {
    loading.value = false
  }
}

// Busca filtrada de contatos
async function searchContacts() {
  console.log('Iniciando busca com:', {
    searchQuery: searchQuery.value,
    selectedTags: selectedTags.value
  })

  if (!searchQuery.value && !selectedTags.value.length) {
    console.log('Nenhum filtro aplicado, voltando para fetchData')
    await fetchData()
    return
  }

  try {
    loading.value = true
    error.value = null

    const query = `
      query SearchContacts($search: String, $tags: [String!]) {
        me {
          organizations {
            organization {
              contacts(search: $search, tags: $tags) {
                id
                name
                email
                phone
                avatar
                tags
                customFields
                lastContactedAt
                createdAt
              }
            }
          }
        }
      }
    `

    console.log('Enviando query de busca:', {
      query,
      variables: {
        search: searchQuery.value,
        tags: selectedTags.value
      }
    })

    const response = await gqlRequest(query, {
      search: searchQuery.value,
      tags: selectedTags.value.length ? selectedTags.value : null
    }, {
      headers: {
        'Authorization': `Bearer ${authStore.token}`
      }
    })

    console.log('Resposta da busca:', response)

    if (response?.me?.organizations?.length > 0) {
      const firstOrg = response.me.organizations[0].organization
      contacts.value = firstOrg.contacts || []
      console.log('Contatos filtrados:', contacts.value)
    }
  } catch (err) {
    console.error('Erro na busca:', {
      error: err,
      message: err.message,
      stack: err.stack
    })
    error.value = 'Erro ao filtrar contatos. Tente novamente.'
  } finally {
    loading.value = false
    console.log('Estado final da busca:', {
      loading: loading.value,
      error: error.value,
      contactsCount: contacts.value.length,
      hasError: !!error.value
    })
  }
}

// Formata data
function formatDate(date) {
  return new Date(date).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}

// Watch para busca
let searchTimeout
function handleSearch() {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(searchContacts, 300)
}

// Função para criar contato
async function handleCreateContact() {
  try {
    if (!authStore.currentOrganizationId) {
      throw new Error('Selecione uma organização primeiro')
    }

    loading.value = true
    const mutation = `
      mutation CreateContact($input: ContactInput!) {
        createContact(input: $input) {
          id
          name
          email
          phone
          avatar
          customFields
          tags
          notes
          lastContactedAt
          createdAt
        }
      }
    `

    const variables = {
      input: {
        organizationId: authStore.currentOrganizationId,
        ...newContact.value
      }
    }

    await gqlRequest(mutation, variables, {
      headers: {
        'Authorization': `Bearer ${authStore.token}`
      }
    })

    await fetchData()
    showNewContactModal.value = false
    newContact.value = {
      name: '',
      email: '',
      phone: '',
      customFields: {
        empresa: '',
        cargo: ''
      },
      tags: [],
      notes: ''
    }
    alert('Contato criado com sucesso!')
  } catch (err) {
    console.error('Erro ao criar contato:', err)
    alert(err.message)
  } finally {
    loading.value = false
  }
}

// Função para adicionar tag
function addTag(event) {
  const tag = event.target.value.trim()
  if (event.key === 'Enter' && tag && !newContact.value.tags.includes(tag)) {
    newContact.value.tags.push(tag)
    event.target.value = ''
  }
}

// Função para remover tag
function removeTag(index) {
  newContact.value.tags.splice(index, 1)
}

onMounted(fetchData)
</script>

<template>
  <div class="p-6">
    <!-- Header -->
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-semibold text-gray-900">
        {{ t('contacts.title', 'Contatos') }}
      </h1>
      <button 
        class="btn btn-primary"
        @click="showNewContactModal = true"
      >
        <Plus class="h-4 w-4 mr-2" />
        {{ t('contacts.addNew', 'Adicionar Contato') }}
      </button>
    </div>

    <!-- Mensagem de erro -->
    <div v-if="error" class="alert alert-error mb-6">
      <span>{{ error }}</span>
    </div>

    <!-- Barra de Busca e Filtros -->
    <div class="flex gap-4 mb-6">
      <div class="flex-1 relative">
        <Search class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          type="text"
          v-model="searchQuery"
          :placeholder="t('contacts.searchPlaceholder', 'Buscar contatos...')"
          class="input input-bordered w-full pl-10"
          @input="handleSearch"
        />
      </div>
      <button 
        class="btn btn-ghost" 
        @click="showFilters = !showFilters"
      >
        <Filter class="h-4 w-4 mr-2" />
        {{ t('common.filters', 'Filtros') }}
      </button>
    </div>

    <!-- Lista de Contatos -->
    <div class="bg-white rounded-lg shadow overflow-hidden">
      <!-- Loading -->
      <div v-if="loading" class="p-8 text-center">
        <span class="loading loading-spinner loading-lg"></span>
      </div>

      <!-- Lista vazia -->
      <div v-else-if="contacts.length === 0" class="p-8 text-center">
        <div class="text-gray-500">
          {{ t('contacts.empty', 'Nenhum contato encontrado') }}
        </div>
      </div>

      <!-- Tabela de contatos -->
      <table v-else class="table table-zebra w-full">
        <thead>
          <tr>
            <th>{{ t('contacts.table.name', 'Nome') }}</th>
            <th>{{ t('contacts.table.contact', 'Contato') }}</th>
            <th>{{ t('contacts.table.company', 'Empresa') }}</th>
            <th>{{ t('contacts.table.tags', 'Tags') }}</th>
            <th>{{ t('contacts.table.lastContact', 'Último Contato') }}</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="contact in contacts" :key="contact.id">
            <!-- Nome e Avatar -->
            <td class="flex items-center gap-3">
              <div class="avatar">
                <div class="w-10 h-10 rounded-full bg-primary/10">
                  <img 
                    v-if="contact.avatar" 
                    :src="contact.avatar" 
                    :alt="contact.name"
                  />
                  <span v-else class="text-lg font-medium">
                    {{ contact.name.charAt(0) }}
                  </span>
                </div>
              </div>
              <div>
                <div class="font-medium">{{ contact.name }}</div>
                <div class="text-sm text-gray-500">
                  ID: {{ contact.id.slice(0, 8) }}
                </div>
              </div>
            </td>

            <!-- Contatos -->
            <td>
              <div class="flex flex-col gap-1">
                <div v-if="contact.email" class="flex items-center gap-2">
                  <Mail class="h-4 w-4 text-gray-400" />
                  <span>{{ contact.email }}</span>
                </div>
                <div v-if="contact.phone" class="flex items-center gap-2">
                  <Phone class="h-4 w-4 text-gray-400" />
                  <span>{{ contact.phone }}</span>
                </div>
              </div>
            </td>

            <!-- Empresa -->
            <td>
              <div v-if="contact.customFields?.empresa" class="flex items-center gap-2">
                <Building class="h-4 w-4 text-gray-400" />
                <span>{{ contact.customFields.empresa }}</span>
                <span v-if="contact.customFields?.cargo" class="text-sm text-gray-500">
                  ({{ contact.customFields.cargo }})
                </span>
              </div>
            </td>

            <!-- Tags -->
            <td>
              <div class="flex flex-wrap gap-1">
                <span 
                  v-for="tag in contact.tags" 
                  :key="tag"
                  class="badge badge-sm"
                >
                  {{ tag }}
                </span>
              </div>
            </td>

            <!-- Último contato -->
            <td>
              <div v-if="contact.lastContactedAt" class="flex items-center gap-2">
                <Calendar class="h-4 w-4 text-gray-400" />
                <span>{{ formatDate(contact.lastContactedAt) }}</span>
              </div>
              <span v-else class="text-gray-400">
                {{ t('contacts.table.never', 'Nunca') }}
              </span>
            </td>

            <!-- Ações -->
            <td>
              <div class="dropdown dropdown-end">
                <label tabindex="0" class="btn btn-ghost btn-sm">
                  <MoreVertical class="h-4 w-4" />
                </label>
                <ul tabindex="0" class="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52">
                  <li>
                    <a>{{ t('contacts.actions.edit', 'Editar') }}</a>
                  </li>
                  <li>
                    <a>{{ t('contacts.actions.delete', 'Excluir') }}</a>
                  </li>
                  <li>
                    <a>{{ t('contacts.actions.newConversation', 'Nova Conversa') }}</a>
                  </li>
                </ul>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal de novo contato -->
    <Modal
      v-if="showNewContactModal"
      @close="showNewContactModal = false"
    >
      <template #title>
        {{ t('contacts.modal.title', 'Novo Contato') }}
      </template>
      
      <template #content>
        <form @submit.prevent="handleCreateContact" class="space-y-4">
          <!-- Dados básicos -->
          <div class="form-control">
            <label class="label">
              <span class="label-text">{{ t('contacts.form.name', 'Nome') }}*</span>
            </label>
            <input
              v-model="newContact.name"
              type="text"
              required
              class="input input-bordered"
              :placeholder="t('contacts.form.namePlaceholder', 'Nome do contato')"
            />
          </div>

          <div class="form-control">
            <label class="label">
              <span class="label-text">{{ t('contacts.form.email', 'Email') }}</span>
            </label>
            <input
              v-model="newContact.email"
              type="email"
              class="input input-bordered"
              :placeholder="t('contacts.form.emailPlaceholder', 'email@exemplo.com')"
            />
          </div>

          <div class="form-control">
            <label class="label">
              <span class="label-text">{{ t('contacts.form.phone', 'Telefone') }}</span>
            </label>
            <input
              v-model="newContact.phone"
              type="tel"
              class="input input-bordered"
              :placeholder="t('contacts.form.phonePlaceholder', '+55 11 99999-9999')"
            />
          </div>

          <!-- Campos customizados -->
          <div class="form-control">
            <label class="label">
              <span class="label-text">{{ t('contacts.form.company', 'Empresa') }}</span>
            </label>
            <input
              v-model="newContact.customFields.empresa"
              type="text"
              class="input input-bordered"
            />
          </div>

          <div class="form-control">
            <label class="label">
              <span class="label-text">{{ t('contacts.form.role', 'Cargo') }}</span>
            </label>
            <input
              v-model="newContact.customFields.cargo"
              type="text"
              class="input input-bordered"
            />
          </div>

          <!-- Tags -->
          <div class="form-control">
            <label class="label">
              <span class="label-text">{{ t('contacts.form.tags', 'Tags') }}</span>
            </label>
            <div class="flex flex-wrap gap-2 mb-2">
              <span 
                v-for="(tag, index) in newContact.tags" 
                :key="index"
                class="badge badge-primary gap-2"
              >
                {{ tag }}
                <button type="button" @click="removeTag(index)">&times;</button>
              </span>
            </div>
            <input
              type="text"
              class="input input-bordered"
              :placeholder="t('contacts.form.tagsPlaceholder', 'Pressione Enter para adicionar')"
              @keyup.enter="addTag"
            />
          </div>

          <!-- Notas -->
          <div class="form-control">
            <label class="label">
              <span class="label-text">{{ t('contacts.form.notes', 'Notas') }}</span>
            </label>
            <textarea
              v-model="newContact.notes"
              class="textarea textarea-bordered"
              :placeholder="t('contacts.form.notesPlaceholder', 'Observações sobre o contato')"
            ></textarea>
          </div>
        </form>
      </template>

      <template #footer>
        <button 
          type="button" 
          class="btn"
          @click="showNewContactModal = false"
        >
          {{ t('common.cancel', 'Cancelar') }}
        </button>
        <button 
          type="submit" 
          class="btn btn-primary ml-3"
          :disabled="loading"
          @click="handleCreateContact"
        >
          {{ t('common.save', 'Salvar') }}
        </button>
      </template>
    </Modal>
  </div>
</template>

<style scoped>
.table th:first-child {
  position: static;
}
</style> 