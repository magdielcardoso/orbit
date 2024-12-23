<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useI18n } from '@/i18n/plugin'
import { useChatStore } from '@/stores/chat.store'
import { useAuthStore } from '@/stores/auth.store'
import SecondarySidebar from '@/components/layout/SecondarySidebar.vue'
import ChatSidebar from '@/components/chats/ChatSidebar.vue'
import ChatView from '@/components/chats/ChatView.vue'
import ChatEmptyState from '@/components/chats/ChatEmptyState.vue'
import { useWebSocket } from '@/composables/useWebSocket'
import { gqlRequest } from '@/utils/graphql'


const { t } = useI18n()
const chatStore = useChatStore()
const authStore = useAuthStore()

// Conecta ao WebSocket
const ws = useWebSocket()

ws.onEvent('whatsapp:message', (data) => {
  console.log('Recebido evento whatsapp:message:', data)
  
  try {
    // Cria uma nova conversa a partir da mensagem
    const newConversation = chatStore.createConversationFromWhatsApp(data)
    
    // Opcionalmente, seleciona a nova conversa
    selectedChat.value = newConversation
    chatStore.setCurrentConversation(newConversation)
  } catch (error) {
    console.error('Erro ao processar mensagem do WhatsApp:', error)
  }
})

// Estado
const activeTab = ref('all')
const selectedChat = ref(null)
const showSecondarySidebar = ref(true)

// Adicione este novo ref para armazenar as inboxes
const inboxes = ref([])
const selectedInbox = ref(null)

// Adicione esta função para buscar as inboxes
async function fetchInboxes() {
  try {
    if (!authStore.currentOrganization?.id) return
    
    const query = `
      query GetOrganization($id: ID!) {
        organization(id: $id) {
          id
          inboxes {
            id
            name
            isEnabled
            channelType
          }
        }
      }
    `

    const response = await gqlRequest(query, {
      id: authStore.currentOrganization.id
    })

    inboxes.value = response.organization?.inboxes || []
  } catch (error) {
    console.error('Erro ao carregar caixas de entrada:', error)
  }
}

// Computed para contagens
const counts = computed(() => {
  const conversations = chatStore.conversations
  return {
    mine: conversations.filter(c => c.assignee?.id === authStore.user?.id).length,
    unassigned: conversations.filter(c => !c.assignee).length,
    all: conversations.length
  }
})

// Tabs com contagens dinâmicas
const tabs = computed(() => [
  { id: 'mine', label: t('chats.tabs.mine'), count: counts.value.mine },
  { id: 'unassigned', label: t('chats.tabs.unassigned'), count: counts.value.unassigned },
  { id: 'all', label: t('chats.tabs.all'), count: counts.value.all }
])

// Configuração da sidebar
const sidebarSections = computed(() => [
  {
    id: 'chat-filters',
    label: t('chats.sidebar.filters.title'),
    items: [
      {
        id: 'all-chats',
        label: t('chats.sidebar.filters.all'),
        icon: 'MessageSquare'
      },
      {
        id: 'active-chats',
        label: t('chats.sidebar.filters.active'),
        icon: 'MessageCircle'
      },
      {
        id: 'archived-chats',
        label: t('chats.sidebar.filters.archived'),
        icon: 'Archive'
      }
    ]
  },
  {
    id: 'chat-labels',
    label: t('chats.sidebar.labels.title'),
    items: [
      {
        id: 'important',
        label: t('chats.sidebar.labels.important'),
        icon: 'Star'
      },
      {
        id: 'unread',
        label: t('chats.sidebar.labels.unread'),
        icon: 'Mail'
      },
      {
        id: 'flagged',
        label: t('chats.sidebar.labels.flagged'),
        icon: 'Flag'
      }
    ]
  },
  {
    id: 'chat-teams',
    label: t('chats.sidebar.teams.title'),
    items: [
      {
        id: 'my-team',
        label: t('chats.sidebar.teams.myTeam'),
        icon: 'Users'
      },
      {
        id: 'assigned-to-me',
        label: t('chats.sidebar.teams.assignedToMe'),
        icon: 'UserCheck'
      }
    ]
  },
  {
    id: 'chat-inboxes',
    label: t('chats.sidebar.inboxes.title'),
    items: inboxes.value.map(inbox => ({
      id: `inbox-${inbox.id}`,
      label: inbox.name,
      icon: getInboxIcon(inbox.channelType),
      onClick: () => handleInboxSelect(inbox.id),
      active: selectedInbox.value === inbox.id,
      navigate: false,
      to: null,
      badge: {
        type: selectedInbox.value === inbox.id ? 'enabled' : 'disabled',
        label: selectedInbox.value === inbox.id ? 'ativo' : 'inativo'
      }
    }))
  }
])

const handleChatSelect = (chat) => {
  selectedChat.value = chat
  chatStore.setCurrentConversation(chat)
}

const toggleSecondarySidebar = () => {
  showSecondarySidebar.value = !showSecondarySidebar.value
}

// Carrega as conversas ao montar o componente
onMounted(async () => {
  if (authStore.currentOrganization?.id) {
    try {
      await Promise.all([
        chatStore.fetchConversations(
          authStore.currentOrganization.id,
          getFiltersForTab(activeTab.value)
        ),
        fetchInboxes()
      ])
    } catch (error) {
      console.error('Erro ao carregar dados:', error)
    }
  }
})

// Observa mudanças na tab ativa para atualizar filtros
watch(activeTab, async (newTab) => {
  if (!authStore.currentOrganization?.id) return
  
  try {
    await chatStore.fetchConversations(
      authStore.currentOrganization.id,
      getFiltersForTab(newTab)
    )
  } catch (error) {
    console.error('Erro ao atualizar conversas:', error)
  }
})

// Função auxiliar para obter filtros baseado na tab
function getFiltersForTab(tab) {
  const baseFilters = {
    mine: { assigneeId: authStore.user?.id },
    unassigned: { assigneeId: null },
    all: {}
  }

  // Adiciona o filtro de inbox se houver uma selecionada
  if (selectedInbox.value) {
    return {
      ...baseFilters[tab],
      inboxId: selectedInbox.value
    }
  }

  return baseFilters[tab] || {}
}

// Adicione esta função auxiliar para mapear os ícones
function getInboxIcon(channelType) {
  const iconMap = {
    WEBCHAT: 'MessageSquare',
    WHATSAPP: 'MessageCircle',
    TELEGRAM: 'Send',
    EMAIL: 'Mail',
    API: 'Terminal'
  }
  return iconMap[channelType] || 'Inbox'
}

// Modifique a função handleInboxSelect
async function handleInboxSelect(inboxId) {
  try {
    if (selectedInbox.value === inboxId) {
      selectedInbox.value = null
    } else {
      selectedInbox.value = inboxId
    }
    
    // Atualiza as conversas com o novo filtro
    await chatStore.fetchConversations(
      authStore.currentOrganization.id,
      getFiltersForTab(activeTab.value)
    )
  } catch (error) {
    console.error('Erro ao filtrar conversas por inbox:', error)
  }
}

// Adicione um watch para atualizar as conversas quando mudar a seleção da inbox
watch(selectedInbox, async () => {
  if (!authStore.currentOrganization?.id) return
  
  try {
    await chatStore.fetchConversations(
      authStore.currentOrganization.id,
      getFiltersForTab(activeTab.value)
    )
  } catch (error) {
    console.error('Erro ao atualizar conversas:', error)
  }
})

// Adicione um watch para limpar a seleção quando a sidebar for fechada
watch(showSecondarySidebar, (newValue) => {
  if (!newValue) {
    selectedInbox.value = null
  }
})
</script>

<template>
  <div class="flex overflow-hidden">
    <SecondarySidebar 
      v-if="showSecondarySidebar" 
      :sections="sidebarSections" 
      :has-blocks="true"
      class="w-64 shrink-0" 
    />

    <div class="flex-1 flex overflow-hidden">
      <ChatSidebar
        v-model:activeTab="activeTab"
        :tabs="tabs"
        :showSecondarySidebar="showSecondarySidebar"
        @select="handleChatSelect"
        @toggle-sidebar="toggleSecondarySidebar"
      />

      <div class="flex-1 flex overflow-hidden">
        <template v-if="selectedChat">
          <ChatView :chat="selectedChat" class="flex-1" />
        </template>
        <template v-else>
          <ChatEmptyState class="flex-1" />
        </template>
      </div>
    </div>
  </div>
</template>

<style scoped>
:deep(.flex) {
  min-height: 0;
}
</style> 