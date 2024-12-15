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

      <!-- Step 2: Configuração do Canal -->
      <div v-else-if="currentStep === 1" class="max-w-2xl">
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

          <!-- Campos específicos do canal serão adicionados aqui -->
        </div>
      </div>

      <!-- Step 3: Configuração de Times -->
      <div v-else-if="currentStep === 2" class="max-w-2xl">
        <div class="space-y-6">
          <!-- Seleção de times será adicionada aqui -->
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
import { ref, computed } from 'vue'
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
    title: 'Configuração',
    description: 'Configure as informações básicas do canal'
  },
  {
    title: 'Times',
    description: 'Defina quais times terão acesso a este canal'
  }
]

const currentStep = ref(0)
const loading = ref(false)
const selectedChannel = ref(null)
const inboxForm = ref({
  name: '',
  description: '',
  channelType: '',
  organizationId: authStore.currentOrganization?.id
})

const selectedChannelConfig = computed(() => {
  if (!selectedChannel.value) return null
  return channels.channels[selectedChannel.value]
})

const canProceed = computed(() => {
  if (currentStep.value === 0) {
    return selectedChannel.value !== null
  }
  if (currentStep.value === 1) {
    return inboxForm.value.name.trim() !== ''
  }
  return true
})

function selectChannel(channel) {
  selectedChannel.value = channel
  inboxForm.value.channelType = channel
}

function nextStep() {
  if (currentStep.value < steps.length - 1 && canProceed.value) {
    currentStep.value++
  }
}

async function handleSubmit() {
  try {
    loading.value = true

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
    // Adicione aqui a lógica para mostrar o erro ao usuário
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
</script> 