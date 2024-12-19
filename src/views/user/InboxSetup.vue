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
              Selecione um provedor de email da lista abaixo. Se você não vir seu provedor de email na lista, pode selecionar a opção de outro provedor e fornecer as Credenciais IMAP e SMTP.
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
                <option value="evolution_api">Evolution API</option>
              </select>
            </div>

            <!-- Campos específicos da Evolution API -->
            <template v-if="inboxForm.provider === 'evolution_api'">
              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700">URL do Servidor</label>
                  <input
                    v-model="inboxForm.evolutionApi.serverUrl"
                    type="url"
                    required
                    placeholder="https://seu-servidor-evolution.com"
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orbit-500 focus:ring-orbit-500 sm:text-sm"
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700">API Key</label>
                  <input
                    v-model="inboxForm.evolutionApi.apiKey"
                    type="password"
                    required
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orbit-500 focus:ring-orbit-500 sm:text-sm"
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700">Nome da Instância</label>
                  <input
                    v-model="inboxForm.evolutionApi.instanceName"
                    type="text"
                    required
                    placeholder="minha-instancia"
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orbit-500 focus:ring-orbit-500 sm:text-sm"
                  />
                </div>

                <div class="space-y-2">
                  <label class="block text-sm font-medium text-gray-700">Configurações Adicionais</label>
                  
                  <div class="flex items-center gap-2">
                    <input
                      v-model="inboxForm.evolutionApi.readMessages"
                      type="checkbox"
                      class="rounded border-gray-300 text-orbit-500 focus:ring-orbit-500"
                    />
                    <span class="text-sm text-gray-600">Marcar mensagens como lidas</span>
                  </div>

                  <div class="flex items-center gap-2">
                    <input
                      v-model="inboxForm.evolutionApi.alwaysOnline"
                      type="checkbox"
                      class="rounded border-gray-300 text-orbit-500 focus:ring-orbit-500"
                    />
                    <span class="text-sm text-gray-600">Manter sempre online</span>
                  </div>

                  <div class="flex items-center gap-2">
                    <input
                      v-model="inboxForm.evolutionApi.rejectCalls"
                      type="checkbox"
                      class="rounded border-gray-300 text-orbit-500 focus:ring-orbit-500"
                    />
                    <span class="text-sm text-gray-600">Rejeitar chamadas</span>
                  </div>
                </div>
              </div>
            </template>
          </template>
        </div>
      </div>

      <!-- Step 4: QR Code do WhatsApp -->
      <div v-else-if="currentStep === 3" class="max-w-2xl">
        <div class="flex flex-col items-center gap-6">
          <div class="text-center">
            <h2 class="text-xl font-semibold mb-2">Conecte seu WhatsApp</h2>
            <p class="text-sm text-base-content/70">
              Abra o WhatsApp no seu celular e escaneie o QR Code abaixo para conectar sua conta
            </p>
          </div>

          <!-- QR Code Container -->
          <div class="p-8 bg-white rounded-lg shadow-lg">
            <img 
              v-if="qrCodeData" 
              :src="qrCodeData" 
              alt="WhatsApp QR Code" 
              class="w-64 h-64 invert"
            />
            <div 
              v-else 
              class="w-64 h-64 flex items-center justify-center bg-base-200"
            >
              <span class="loading loading-spinner loading-lg text-orbit-500"></span>
            </div>
          </div>

          <p class="text-sm text-base-content/70 mt-4">
            O QR Code será atualizado automaticamente a cada 20 segundos
          </p>
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
        
        <!-- Botão Conectar (apenas no step 2 e quando for Evolution API) -->
        <button
          v-if="currentStep === 2 && selectedChannel === 'WHATSAPP' && inboxForm.provider === 'evolution_api'"
          @click="createEvolutionInstance"
          :disabled="loading || !canConnectEvolution"
          class="btn btn-secondary mr-2"
        >
          {{ loading ? 'Conectando...' : 'Conectar' }}
        </button>

        <!-- Botão Próximo -->
        <button
          v-if="currentStep < totalSteps - 1"
          @click="handleStepAction"
          :disabled="!canProceed"
          class="btn btn-primary"
        >
          Próximo
        </button>
        <button
          v-else
          @click="finishSetup"
          class="btn btn-primary"
        >
          Concluir
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue'
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

const steps = ref([
  {
    title: 'Escolha do Canal',
    description: 'Selecione o tipo de canal que deseja configurar'
  },
  {
    title: 'Informações Básicas',
    description: 'Configure as informações básicas da caixa de entrada'
  },
  {
    title: 'Configuração do Canal',
    description: 'Configure as opções específicas do canal selecionado'
  },
  {
    title: 'Conectar WhatsApp',
    description: 'Escaneie o QR Code para conectar sua conta'
  }
])

const currentStep = ref(0)
const loading = ref(false)
const selectedChannel = ref(null)
const inboxForm = ref({
  name: '',
  description: '',
  channelType: '',
  provider: '',
  evolutionApi: {
    serverUrl: '',
    apiKey: '',
    instanceName: '',
    readMessages: true,
    alwaysOnline: true,
    rejectCalls: false,
    webhookEvents: ['messages', 'status', 'qrcode', 'connection', 'presence'],
    syncFullHistory: false
  }
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

const instanceCreated = ref(false)

const canProceed = computed(() => {
  if (currentStep.value === 0) return !!selectedChannel.value
  if (currentStep.value === 1) {
    if (selectedChannel.value === 'EMAIL') {
      return !!inboxForm.value.name && !!inboxForm.value.emailProvider
    }
    return !!inboxForm.value.name
  }
  if (currentStep.value === 2 && 
      selectedChannel.value === 'WHATSAPP' && 
      inboxForm.value.provider === 'evolution_api') {
    return instanceCreated.value
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

// Computed para total de steps
const totalSteps = computed(() => steps.value.length)

// Função nextStep atualizada
function nextStep() {
  if (currentStep.value < totalSteps.value - 1) {
    currentStep.value++
  }
}

// Adicione o ref para o QR code
const qrCodeData = ref(null)

// Observar mudanças no qrCodeData
watch(qrCodeData, (newValue) => {
  console.log('qrCodeData mudou:', {
    value: !!newValue,
    currentStep: currentStep.value,
    canProceed: canProceed.value
  })
})

// Função para finalizar o setup
function finishSetup() {
  showToast('Caixa de entrada criada com sucesso!')
  router.push('/settings/inbox')
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

// Computed para verificar se pode conectar Evolution API
const canConnectEvolution = computed(() => {
  console.log('Verificando canConnectEvolution:', {
    serverUrl: inboxForm.value.evolutionApi?.serverUrl,
    apiKey: inboxForm.value.evolutionApi?.apiKey,
    instanceName: inboxForm.value.evolutionApi?.instanceName
  })
  
  if (!inboxForm.value.evolutionApi) return false
  const evolutionApi = inboxForm.value.evolutionApi
  return (
    evolutionApi.serverUrl &&
    evolutionApi.apiKey &&
    evolutionApi.instanceName
  )
})

// Adicione a função showToast
function showToast(message, type = 'success') {
  const toast = document.createElement('div')
  toast.className = `toast toast-top toast-end z-50`

  const alert = document.createElement('div')
  alert.className = `alert ${type === 'success' ? 'alert-success' : 'alert-error'} shadow-lg`

  const content = document.createElement('div')
  content.className = 'flex items-center gap-2'
  content.textContent = message

  alert.appendChild(content)
  toast.appendChild(alert)
  document.body.appendChild(toast)

  setTimeout(() => {
    toast.remove()
  }, 3000)
}

// Função para criar apenas a instância da Evolution API
async function createEvolutionInstance() {
  try {
    loading.value = true
    console.log('Iniciando createEvolutionInstance')
    
    const input = {
      name: inboxForm.value.name,
      description: inboxForm.value.description,
      channelType: 'WHATSAPP_EVOLUTION',
      organizationId: authStore.currentOrganization.id,
      isEnabled: true,
      settings: JSON.stringify({
        provider: 'evolution_api',
        evolutionApi: {
          serverUrl: inboxForm.value.evolutionApi.serverUrl,
          apiKey: inboxForm.value.evolutionApi.apiKey,
          instanceName: inboxForm.value.evolutionApi.instanceName,
          readMessages: inboxForm.value.evolutionApi.readMessages,
          alwaysOnline: inboxForm.value.evolutionApi.alwaysOnline,
          rejectCalls: inboxForm.value.evolutionApi.rejectCalls,
          webhookEvents: ['messages', 'status', 'qrcode', 'connection', 'presence'],
          syncFullHistory: inboxForm.value.evolutionApi.syncFullHistory
        }
      })
    }

    const mutation = `
      mutation CreateInbox($input: InboxInput!) {
        createInbox(input: $input) {
          id name description channelType isEnabled settings
          teams { team { id name } }
          organization { id name }
        }
      }
    `

    const result = await gqlRequest(mutation, { input })
    
    if (!result?.createInbox) {
      console.error('Resposta inválida:', result)
      showToast('Erro ao criar instância: resposta inválida do servidor', 'error')
      return false
    }

    try {
      // O settings vem como string dentro de string, precisamos fazer parse duas vezes
      const settings = JSON.parse(JSON.parse(result.createInbox.settings))
      console.log('Settings parseados:', settings)
      
      if (settings?.qrcode?.base64) {
        qrCodeData.value = settings.qrcode.base64
        showToast('Instância criada com sucesso! Escaneie o QR Code para conectar.')
      } else {
        showToast('Instância criada com sucesso!')
      }

      // Marca como sucesso e avança para próximo step
      instanceCreated.value = true
      nextStep()
      
      return true
    } catch (parseError) {
      console.error('Erro ao parsear settings:', parseError)
      instanceCreated.value = true
      showToast('Instância criada com sucesso!')
      nextStep()
      return true
    }
  } catch (error) {
    console.error('Erro ao criar instância:', error)
    showToast(error.message || 'Erro ao criar instância', 'error')
    return false
  } finally {
    loading.value = false
  }
}

// Função para lidar com as ações de cada step
function handleStepAction() {
  console.log('handleStepAction chamado', {
    canProceed: canProceed.value,
    currentStep: currentStep.value,
    qrCodeData: !!qrCodeData.value
  })

  if (canProceed.value) {
    // Se estiver no step 2 e tiver QR code, vai para o step 4
    if (currentStep.value === 2 && 
        selectedChannel.value === 'WHATSAPP' && 
        inboxForm.value.provider === 'evolution_api' && 
        qrCodeData.value) {
      currentStep.value = 3 // Step 4 (índice 3)
    } else {
      nextStep()
    }
  }
}
</script> 