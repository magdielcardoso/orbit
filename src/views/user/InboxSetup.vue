<template>
  <div class="flex h-full">
    <SecondarySidebar 
      :sections="sidebarSections" 
      :show-sidebar="showSecondarySidebar"
    />
    <!-- Timeline Vertical -->
    <div class="w-96 bg-base-100 border-x border-base-200 p-6">
      <div class="flex flex-col gap-8">
        <div class="flex items-center gap-4">
          <button 
            class="btn btn-sm btn-ghost"
            @click="showSecondarySidebar = !showSecondarySidebar"
          >
            <component 
              :is="showSecondarySidebar ? PanelLeftClose : PanelLeft" 
              class="h-4 w-4"
            />
          </button>
          <h1 class="text-xl font-bold">Nova Caixa de Entrada</h1>
        </div>

        <div class="flex flex-col gap-6">
          <div v-for="(step, index) in steps" :key="index" class="flex gap-4 relative">
            <div class="flex flex-col items-center relative">
              <!-- Linha vertical de conexão -->
              <div 
                class="absolute w-0.5 h-[calc(100%+1.5rem)] top-8 left-1/2 -translate-x-1/2"
                :class="{
                  'bg-orbit-500': currentStep > index,
                  'bg-base-200/30': currentStep <= index
                }"
              ></div>
              
              <!-- Círculo do passo -->
              <div :class="[
                'w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium relative z-10',
                currentStep > index ? 'bg-orbit-500 text-white' : 
                currentStep === index ? 'bg-orbit-100 text-orbit-600 ring-2 ring-orbit-500' : 
                'bg-base-200 text-base-content/50'
              ]">
                {{ index + 1 }}
              </div>
            </div>
            <div class="flex flex-col gap-1 pb-6">
              <h3 :class="[
                'font-medium',
                currentStep >= index ? 'text-base-content' : 'text-base-content/50'
              ]">{{ step.title }}</h3>
              <p class="text-sm text-base-content/70">{{ step.description }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Conteúdo do Step -->
    <div class="flex-1 p-6 overflow-auto">
      <!-- Step 1: Escolha do Canal -->
      <div v-if="currentStep === 0">
        <div class="grid grid-cols-3 gap-4">
          <div
            v-for="(channel, key) in channels.channels"
            :key="key"
            @click="selectChannel(key)"
            :class="[
              'p-6 rounded-lg border-2 cursor-pointer transition-all hover:border-orbit-500 hover:shadow-md',
              selectedChannel === key ? 'border-orbit-500 ring-2 ring-orbit-500/20 bg-orbit-50/10' : 'border-orbit-100'
            ]"
          >
            <div class="flex items-center gap-4">
              <img :src="channel.icon" :alt="channel.title" class="w-12 h-12" />
              <div class="flex-1 min-w-0">
                <h3 class="font-medium text-base truncate">{{ channel.title }}</h3>
                <p class="text-xs text-base-content/70 line-clamp-2">{{ channel.description }}</p>
              </div>
              <span v-if="selectedChannel === key" class="i-lucide-check text-orbit-500 w-5 h-5"></span>
            </div>
          </div>
        </div>
      </div>

      <!-- Step 2: Configuração de Agentes ou Provedor de Email -->
      <div v-else-if="currentStep === 1" class="max-w-2xl">
        <!-- Configuração de Provedor de Email -->
        <template v-if="selectedChannel === 'EMAIL'">
          <div>
            <h2 class="text-xl font-semibold mb-2">Selecione seu provedor de email</h2>
            <p class="text-sm text-base-content/70 mb-6">
              Selecione um provedor de email da lista abaixo. Se você n��o vir seu provedor de email na lista, pode selecionar a opção de outro provedor e fornecer as Credenciais IMAP e SMTP.
            </p>

            <div class="grid grid-cols-3 gap-6">
              <!-- Microsoft -->
              <div
                @click="selectEmailProvider('microsoft')"
                :class="[
                  'p-6 rounded-lg border-2 cursor-pointer transition-all hover:border-orbit-500 hover:shadow-md flex flex-col items-center gap-4',
                  inboxForm.emailProvider === 'microsoft' ? 'border-orbit-500 ring-2 ring-orbit-500/20 bg-orbit-50/10' : 'border-orbit-100'
                ]"
              >
                <div class="w-16 h-16 bg-[#F3F3F3] rounded-lg grid grid-cols-2 gap-1 p-2">
                  <div class="bg-[#F25022]"></div>
                  <div class="bg-[#7FBA00]"></div>
                  <div class="bg-[#00A4EF]"></div>
                  <div class="bg-[#FFB900]"></div>
                </div>
                <span class="font-medium">Microsoft</span>
              </div>

              <!-- Google -->
              <div
                @click="selectEmailProvider('google')"
                :class="[
                  'p-6 rounded-lg border-2 cursor-pointer transition-all hover:border-orbit-500 hover:shadow-md flex flex-col items-center gap-4',
                  inboxForm.emailProvider === 'google' ? 'border-orbit-500 ring-2 ring-orbit-500/20 bg-orbit-50/10' : 'border-orbit-100'
                ]"
              >
                <div class="w-16 h-16 flex items-center justify-center">
                  <span class="i-lucide-mail-search h-12 w-12"></span>
                </div>
                <span class="font-medium">Google</span>
              </div>

              <!-- Outros Provedores -->
              <div
                @click="selectEmailProvider('other')"
                :class="[
                  'p-6 rounded-lg border-2 cursor-pointer transition-all hover:border-orbit-500 hover:shadow-md flex flex-col items-center gap-4',
                  inboxForm.emailProvider === 'other' ? 'border-orbit-500 ring-2 ring-orbit-500/20 bg-orbit-50/10' : 'border-orbit-100'
                ]"
              >
                <div class="w-16 h-16 flex items-center justify-center">
                  <span class="i-lucide-mail h-12 w-12"></span>
                </div>
                <span class="font-medium">Outros Provedores</span>
              </div>
            </div>
          </div>
        </template>

        <!-- Configuração de Agentes (para outros canais) -->
        <template v-else>
          <div class="space-y-6">
            <div>
              <label class="block text-sm font-medium text-gray-700">Nome da Caixa de Entrada</label>
              <input
                v-model="inboxForm.name"
                type="text"
                required
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orbit-500 focus:ring-orbit-500 sm:text-sm"
                :placeholder="`Ex: ${selectedChannelConfig?.title || 'Chat do Site'}`"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700">Descrição</label>
              <textarea
                v-model="inboxForm.description"
                rows="2"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orbit-500 focus:ring-orbit-500 sm:text-sm"
                :placeholder="selectedChannelConfig?.description || 'Uma breve descrição desta caixa de entrada'"
              ></textarea>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Agentes</label>
              <p class="text-sm text-base-content/70 mb-4">
                Aqui você pode adicionar agentes para gerenciar sua nova caixa de entrada criada. Somente esses agentes selecionados terão acesso à sua caixa de entrada. Agentes que não fazem parte desta caixa de entrada não poderão ver ou responder mensagens nesta caixa de entrada quando fizerem login.
              </p>
              <p class="text-sm text-base-content/70 mb-4 font-medium">
                PS: Como administrador, se você precisar de acesso a todas as caixas de entrada, deve se adicionar como agente a todas as caixas de entrada que criar.
              </p>
              
              <!-- Select de Agentes -->
              <div class="relative" ref="agentsDropdownRef">
                <!-- Dropdown Trigger -->
                <div
                  @click.stop="showAgentsDropdown = !showAgentsDropdown"
                  class="mt-1 relative w-full cursor-pointer rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 text-left shadow-sm focus:border-orbit-500 focus:outline-none focus:ring-1 focus:ring-orbit-500 sm:text-sm"
                >
                  <span class="block truncate">
                    {{ selectedAgents.length ? `${selectedAgents.length} agente(s) selecionado(s)` : 'Selecione os agentes' }}
                  </span>
                  <span class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                    <span class="i-lucide-chevron-down h-4 w-4 text-gray-400" aria-hidden="true"></span>
                  </span>
                </div>

                <!-- Dropdown Menu -->
                <div
                  v-if="showAgentsDropdown"
                  class="absolute z-10 mt-1 w-full rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                >
                  <div class="p-2">
                    <!-- Search Input -->
                    <div class="relative mb-2">
                      <span class="i-lucide-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4"></span>
                      <input
                        v-model="agentSearch"
                        type="text"
                        class="block w-full rounded-md border-0 py-1.5 pl-10 pr-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-orbit-500 sm:text-sm sm:leading-6"
                        placeholder="Buscar agentes..."
                        @click.stop
                      >
                    </div>

                    <!-- Users List -->
                    <div class="max-h-60 overflow-auto">
                      <div
                        v-for="user in filteredUsers"
                        :key="user.id"
                        @click.stop="toggleAgent(user.id)"
                        :class="[
                          'relative flex items-center gap-2 px-3 py-2 cursor-pointer rounded-md transition-all duration-200',
                          selectedAgents.includes(user.id) 
                            ? 'bg-orbit-50 border-2 border-orbit-500' 
                            : 'hover:bg-orbit-50/50 border-2 border-transparent'
                        ]"
                      >
                        <!-- Avatar ou Iniciais -->
                        <div class="flex-shrink-0 h-8 w-8 rounded-full bg-orbit-100 flex items-center justify-center">
                          <span class="text-sm font-medium text-orbit-600">
                            {{ user.name.charAt(0).toUpperCase() }}
                          </span>
                        </div>

                        <!-- User Info -->
                        <div class="flex-1 min-w-0">
                          <p class="text-sm font-medium text-gray-900 truncate">{{ user.name }}</p>
                          <p class="text-xs text-gray-500 truncate">{{ user.email }}</p>
                        </div>

                        <!-- Role Badge -->
                        <span 
                          :class="[
                            'inline-flex items-center px-2 py-0.5 rounded text-xs font-medium',
                            user.role?.name === 'agent' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                          ]"
                        >
                          {{ user.role?.name === 'agent' ? 'Agente' : 'Usuário' }}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </template>
      </div>

      <!-- Step 3: Configuração do Canal -->
      <div v-else-if="currentStep === 2" class="max-w-2xl">
        <div class="space-y-6">
          <!-- Campos específicos do canal -->
          <template v-if="selectedChannel === 'WHATSAPP'">
            <div>
              <label class="block text-sm font-medium text-gray-700">Provedor de API</label>
              <select
                v-model="inboxForm.provider"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orbit-500 focus:ring-orbit-500 sm:text-sm"
              >
                <option value="">Selecione um provedor</option>
                <option value="whatsapp_cloud">WhatsApp Cloud</option>
                <option value="360dialog">360dialog</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700">Número de telefone</label>
              <input
                v-model="inboxForm.phoneNumber"
                type="text"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orbit-500 focus:ring-orbit-500 sm:text-sm"
                placeholder="Por favor, insira o número de telefone do qual a mensagem será enviada."
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700">ID do número de telefone</label>
              <input
                v-model="inboxForm.phoneNumberId"
                type="text"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orbit-500 focus:ring-orbit-500 sm:text-sm"
                placeholder="Por favor, insira o ID do número de telefone obtido no painel de desenvolvedores do Facebook."
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700">ID da conta comercial</label>
              <input
                v-model="inboxForm.businessAccountId"
                type="text"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orbit-500 focus:ring-orbit-500 sm:text-sm"
                placeholder="Por favor, insira o ID da conta comercial obtido no painel de desenvolvedores do Facebook."
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700">Chave API</label>
              <input
                v-model="inboxForm.apiKey"
                type="password"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orbit-500 focus:ring-orbit-500 sm:text-sm"
                placeholder="Chave API"
              />
            </div>
          </template>
        </div>
      </div>

      <!-- Botões de Navegação -->
      <div class="mt-8 flex justify-between">
        <button
          v-if="currentStep > 0"
          @click="currentStep--"
          class="btn btn-ghost"
        >
          Voltar
        </button>
        <div class="flex-1"></div>
        <button
          v-if="currentStep < steps.length - 1"
          @click="nextStep"
          :disabled="!canProceed"
          class="btn btn-primary"
        >
          Próximo
        </button>
        <button
          v-else
          @click="handleSubmit"
          :disabled="loading"
          class="btn btn-primary"
        >
          {{ loading ? 'Salvando...' : 'Concluir' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'
import { useI18n } from '@/i18n/plugin'
import { gqlRequest } from '@/utils/graphql'
import channels from '@/../config/channels.yml'
import SecondarySidebar from '@/components/layout/SecondarySidebar.vue'
import { PanelLeftClose, PanelLeft } from 'lucide-vue-next'

const router = useRouter()
const authStore = useAuthStore()
const { t } = useI18n()
const showSecondarySidebar = ref(true)

const steps = [
  {
    title: 'Escolha o Canal',
    description: 'Selecione o tipo de canal que você deseja configurar'
  },
  {
    title: 'Agentes',
    description: 'Selecione os agentes que terão acesso a este canal'
  },
  {
    title: 'Configuração',
    description: 'Configure as informações específicas do canal'
  }
]

const currentStep = ref(0)
const loading = ref(false)
const selectedChannel = ref(null)
const inboxForm = ref({
  name: '',
  description: '',
  channelType: '',
  organizationId: authStore.currentOrganization?.id,
  agents: [],
  // Campos específicos do Email
  emailProvider: '',
  // Campos específicos do WhatsApp
  provider: '',
  phoneNumber: '',
  phoneNumberId: '',
  businessAccountId: '',
  apiKey: ''
})

const selectedChannelConfig = computed(() => {
  if (!selectedChannel.value) return null
  return channels.channels[selectedChannel.value]
})

const users = ref([])
const selectedAgents = ref([])

// Função para buscar usuários
async function fetchUsers() {
  try {
    const query = `
      query GetUsers {
        users {
          id
          name
          email
          role {
            id
            name
          }
          active
        }
      }
    `

    const response = await gqlRequest(query)
    users.value = response.users.filter(user => user.active && ['agent', 'user'].includes(user.role?.name))
  } catch (error) {
    console.error('Erro ao buscar usuários:', error)
  }
}

// Chama a função ao montar o componente
onMounted(async () => {
  await fetchUsers()
})

const canProceed = computed(() => {
  if (currentStep.value === 0) {
    return selectedChannel.value !== null
  }
  if (currentStep.value === 1) {
    if (selectedChannel.value === 'EMAIL') {
      return inboxForm.value.emailProvider !== ''
    }
    return inboxForm.value.name.trim() !== '' && selectedAgents.value.length > 0
  }
  if (currentStep.value === 2) {
    if (selectedChannel.value === 'EMAIL') {
      return inboxForm.value.name.trim() !== '' && selectedAgents.value.length > 0
    }
    // Validação específica para WhatsApp
    if (selectedChannel.value === 'WHATSAPP') {
      return (
        inboxForm.value.provider &&
        inboxForm.value.phoneNumber &&
        inboxForm.value.phoneNumberId &&
        inboxForm.value.businessAccountId &&
        inboxForm.value.apiKey
      )
    }
    return true
  }
  return true
})

const channelTypeMap = {
  WHATSAPP: 'WHATSAPP',
  INSTAGRAM: 'INSTAGRAM',
  MESSENGER: 'MESSENGER',
  TWITTER: 'API', // Mapeia Twitter para API
  MERCADOLIVRE: 'MERCADOLIVRE',
  SHOPEE: 'SHOPEE',
  TELEGRAM: 'TELEGRAM',
  EMAIL: 'EMAIL',
  API: 'API',
  IFOOD: 'IFOOD',
  WEBCHAT: 'WEBCHAT'
}

function selectChannel(channel) {
  selectedChannel.value = channel
  inboxForm.value.channelType = channelTypeMap[channel] || 'API'
}

function nextStep() {
  if (currentStep.value < steps.length - 1 && canProceed.value) {
    currentStep.value++
  }
}

async function handleSubmit() {
  try {
    loading.value = true
    
    // Atualiza o inboxForm com os agentes selecionados
    inboxForm.value.agents = selectedAgents.value

    const mutation = `
      mutation CreateInbox($input: InboxInput!) {
        createInbox(input: $input) {
          id
          name
          description
          channelType
          isEnabled
          teams {
            id
            team {
              name
            }
          }
        }
      }
    `

    await gqlRequest(mutation, {
      input: inboxForm.value
    })

    router.push('/settings/inbox')
  } catch (error) {
    console.error('Erro ao criar caixa de entrada:', error)
    showToast(error.message, 'error')
  } finally {
    loading.value = false
  }
}

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

function selectEmailProvider(provider) {
  inboxForm.value.emailProvider = provider
}

const showAgentsDropdown = ref(false)
const agentSearch = ref('')

const filteredUsers = computed(() => {
  if (!agentSearch.value) return users.value
  const search = agentSearch.value.toLowerCase()
  return users.value.filter(user => 
    user.name.toLowerCase().includes(search) || 
    user.email.toLowerCase().includes(search)
  )
})

function toggleAgent(userId) {
  const index = selectedAgents.value.indexOf(userId)
  if (index === -1) {
    selectedAgents.value.push(userId)
  } else {
    selectedAgents.value.splice(index, 1)
  }
}

const agentsDropdownRef = ref(null)

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

function handleClickOutside(e) {
  if (agentsDropdownRef.value && !agentsDropdownRef.value.contains(e.target)) {
    showAgentsDropdown.value = false
  }
}
</script> 