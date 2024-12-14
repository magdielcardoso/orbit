<template>
  <div class="p-6">
    <div class="sm:flex sm:items-center">
      <div class="sm:flex-auto">
        <h1 class="text-2xl font-semibold text-gray-900">{{ t('admin.organizations.title') }}</h1>
        <p class="mt-2 text-sm text-gray-700">
          {{ t('admin.organizations.description') }}
        </p>
      </div>
      <div class="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
        <button
          @click="showNewOrgModal = true"
          class="inline-flex items-center justify-center rounded-md border border-transparent bg-purple-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 sm:w-auto"
        >
          {{ t('admin.organizations.addOrganization') }}
        </button>
      </div>
    </div>

    <!-- Loading state -->
    <div v-if="loading" class="flex justify-center items-center py-8">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
    </div>

    <!-- Error state -->
    <div v-else-if="!organizations.length" class="text-center py-8">
      <p class="text-gray-500">{{ t('admin.organizations.noOrganizations') }}</p>
    </div>

    <!-- Tabela de Organizações -->
    <div v-else class="mt-8 flex flex-col">
      <div class="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div class="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
          <div class="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
            <table class="min-w-full divide-y divide-gray-300">
              <thead class="bg-gray-50">
                <tr>
                  <th scope="col" class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                    {{ t('admin.organizations.table.name') }}
                  </th>
                  <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    {{ t('admin.organizations.table.slug') }}
                  </th>
                  <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    {{ t('admin.organizations.table.plan') }}
                  </th>
                  <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    {{ t('admin.organizations.table.users') }}
                  </th>
                  <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    {{ t('admin.organizations.table.status') }}
                  </th>
                  <th scope="col" class="relative py-3.5 pl-3 pr-4 sm:pr-6">
                    <span class="sr-only">{{ t('common.actions') }}</span>
                  </th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200 bg-white">
                <tr v-for="org in organizations" :key="org.id">
                  <td class="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                    {{ org.name }}
                  </td>
                  <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    {{ org.slug }}
                  </td>
                  <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    {{ t(`admin.organizations.plans.${org.plan.toLowerCase()}`) }}
                  </td>
                  <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    {{ org.users?.length || 0 }}
                  </td>
                  <td class="whitespace-nowrap px-3 py-4 text-sm">
                    <span
                      class="inline-flex rounded-full px-2 text-xs font-semibold leading-5"
                      :class="getStatusClass(org.paymentStatus)"
                    >
                      {{ t(`admin.organizations.status.${org.paymentStatus.toLowerCase()}`) }}
                    </span>
                  </td>
                  <td class="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                    <button
                      @click="editOrganization(org)"
                      class="text-purple-600 hover:text-purple-900 mr-4"
                    >
                      {{ t('common.edit') }}
                    </button>
                    <button
                      @click="deleteOrganization(org)"
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

    <!-- Modal de Nova Organização -->
    <Modal
      v-if="showNewOrgModal"
      @close="showNewOrgModal = false"
    >
      <template #title>
        {{ t('admin.organizations.newOrganization') }}
      </template>

      <template #content>
        <form id="createOrgForm" @submit.prevent="handleCreateOrganization" class="space-y-4">
          <!-- Nome -->
          <div class="form-control">
            <label class="label">
              <span class="label-text">{{ t('admin.organizations.form.name') }}*</span>
            </label>
            <input
              v-model="newOrg.name"
              type="text"
              required
              class="input input-bordered w-full"
              :placeholder="t('admin.organizations.form.namePlaceholder')"
            />
          </div>

          <!-- Slug -->
          <div class="form-control">
            <label class="label">
              <span class="label-text">{{ t('admin.organizations.form.slug') }}*</span>
            </label>
            <input
              v-model="newOrg.slug"
              type="text"
              required
              class="input input-bordered w-full"
              :placeholder="t('admin.organizations.form.slugPlaceholder')"
            />
          </div>

          <!-- Plano -->
          <div class="form-control">
            <label class="label">
              <span class="label-text">{{ t('admin.organizations.form.plan') }}*</span>
            </label>
            <select
              v-model="newOrg.plan"
              required
              class="select select-bordered w-full"
            >
              <option value="">{{ t('admin.organizations.form.selectPlan') }}</option>
              <option value="FREE">{{ t('admin.organizations.plans.free') }}</option>
              <option value="STARTER">{{ t('admin.organizations.plans.starter') }}</option>
              <option value="PROFESSIONAL">{{ t('admin.organizations.plans.professional') }}</option>
              <option value="ENTERPRISE">{{ t('admin.organizations.plans.enterprise') }}</option>
            </select>
          </div>

          <!-- Domínio -->
          <div class="form-control">
            <label class="label">
              <span class="label-text">{{ t('admin.organizations.form.domain') }}</span>
            </label>
            <input
              v-model="newOrg.domain"
              type="text"
              class="input input-bordered w-full"
              :placeholder="t('admin.organizations.form.domainPlaceholder')"
            />
          </div>

          <!-- Timezone -->
          <div class="form-control">
            <label class="label">
              <span class="label-text">{{ t('admin.organizations.form.timezone') }}</span>
            </label>
            <select
              v-model="newOrg.timezone"
              class="select select-bordered w-full"
            >
              <option value="UTC">UTC</option>
              <option value="America/Sao_Paulo">America/Sao_Paulo</option>
              <!-- Adicione mais timezones conforme necessário -->
            </select>
          </div>

          <!-- Locale -->
          <div class="form-control">
            <label class="label">
              <span class="label-text">{{ t('admin.organizations.form.locale') }}</span>
            </label>
            <select
              v-model="newOrg.locale"
              class="select select-bordered w-full"
            >
              <option value="pt-BR">Português (Brasil)</option>
              <option value="en">English</option>
              <!-- Adicione mais idiomas conforme necessário -->
            </select>
          </div>
        </form>
      </template>

      <template #footer>
        <button 
          type="button" 
          class="btn"
          @click="showNewOrgModal = false"
        >
          {{ t('common.cancel') }}
        </button>
        <button 
          type="submit"
          form="createOrgForm"
          class="btn btn-primary ml-3"
          :disabled="loading"
          @click="handleCreateOrganization"
        >
          <span v-if="loading" class="loading loading-spinner"></span>
          {{ loading ? t('common.loading') : t('common.save') }}
        </button>
      </template>
    </Modal>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useI18n } from '@/i18n'
import { useAuthStore } from '@/stores/auth.store'
import { useRouter } from 'vue-router'
import { gqlRequest } from '@/utils/graphql'
import Modal from '@/components/Modal.vue'

const { t } = useI18n()
const authStore = useAuthStore()
const router = useRouter()

const organizations = ref([])
const loading = ref(false)
const showNewOrgModal = ref(false)
const newOrg = ref({
  name: '',
  slug: '',
  plan: '',
  domain: '',
  timezone: 'America/Sao_Paulo',
  locale: 'pt-BR',
  features: {}
})

// Busca organizações
async function fetchOrganizations() {
  try {
    loading.value = true
    const query = `
      query GetOrganizations {
        organizations {
          id
          name
          slug
          domain
          plan
          paymentStatus
          maxUsers
          maxTeams
          maxInboxes
          timezone
          locale
          users {
            id
            isAdmin
            isOwner
            status
          }
          createdAt
          updatedAt
        }
      }
    `

    const response = await gqlRequest(query, null, {
      headers: {
        'Authorization': `Bearer ${authStore.token}`
      }
    })

    organizations.value = response.organizations || []
    console.log('Organizações carregadas:', organizations.value)
  } catch (error) {
    console.error('Erro ao carregar organizações:', error)
  } finally {
    loading.value = false
  }
}

// Função para criar organização
async function handleCreateOrganization() {
  try {
    loading.value = true
    const mutation = `
      mutation CreateOrganization($input: OrganizationInput!) {
        createOrganization(input: $input) {
          id
          name
          slug
          plan
          paymentStatus
          maxUsers
          maxTeams
          maxInboxes
          timezone
          locale
          features
          createdAt
        }
      }
    `

    const input = {
      name: newOrg.value.name,
      slug: newOrg.value.slug,
      plan: newOrg.value.plan,
      domain: newOrg.value.domain || null,
      timezone: newOrg.value.timezone || 'UTC',
      locale: newOrg.value.locale || 'pt-BR',
      features: newOrg.value.features || {}
    }

    console.log('Input da mutation:', input)

    await gqlRequest(mutation, { input }, {
      headers: {
        'Authorization': `Bearer ${authStore.token}`
      }
    })

    // Recarrega a lista e fecha o modal
    await fetchOrganizations()
    showNewOrgModal.value = false
    
    // Limpa o formulário
    newOrg.value = {
      name: '',
      slug: '',
      plan: '',
      domain: '',
      timezone: 'America/Sao_Paulo',
      locale: 'pt-BR',
      features: {}
    }

    // Mostra mensagem de sucesso usando o novo toast
    showToast(t('admin.organizations.createSuccess'))
  } catch (error) {
    console.error('Erro ao criar organização:', error)
    showToast(error.message, 'error')
  } finally {
    loading.value = false
  }
}

// Classes de status
function getStatusClass(status) {
  const classes = {
    'ACTIVE': 'bg-green-100 text-green-800',
    'PENDING': 'bg-yellow-100 text-yellow-800',
    'OVERDUE': 'bg-red-100 text-red-800',
    'CANCELLED': 'bg-gray-100 text-gray-800'
  }
  return classes[status] || 'bg-gray-100 text-gray-800'
}

// Função para mostrar toast
function showToast(message, type = 'success') {
  // Remove toasts anteriores
  const existingToasts = document.querySelectorAll('.toast')
  existingToasts.forEach(toast => toast.remove())

  // Cria o elemento toast
  const toast = document.createElement('div')
  toast.className = `toast toast-top toast-end z-50`

  // Cria o alerta dentro do toast
  const alert = document.createElement('div')
  alert.className = `alert ${type === 'success' ? 'alert-success' : 'alert-error'} shadow-lg`

  // Cria o conteúdo do alerta
  const content = document.createElement('div')
  content.className = 'flex items-center gap-2'

  // Ícone
  const icon = document.createElement('span')
  icon.className = 'text-lg'
  icon.textContent = type === 'success' ? '✓' : '✕'
  
  // Texto
  const text = document.createElement('span')
  text.textContent = message

  // Monta a estrutura
  content.appendChild(icon)
  content.appendChild(text)
  alert.appendChild(content)
  toast.appendChild(alert)

  // Adiciona o toast ao body
  document.body.appendChild(toast)

  // Remove após 3 segundos
  setTimeout(() => {
    toast.remove()
  }, 3000)
}

onMounted(fetchOrganizations)
</script> 