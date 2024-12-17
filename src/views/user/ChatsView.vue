<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useI18n } from '@/i18n/plugin'
import { useChatStore } from '@/stores/chat.store'
import { useAuthStore } from '@/stores/auth.store'
import SecondarySidebar from '@/components/layout/SecondarySidebar.vue'
import ChatSidebar from '@/components/chats/ChatSidebar.vue'
import ChatView from '@/components/chats/ChatView.vue'
import ChatEmptyState from '@/components/chats/ChatEmptyState.vue'

const { t } = useI18n()
const chatStore = useChatStore()
const authStore = useAuthStore()

// Estado
const activeTab = ref('all')
const selectedChat = ref(null)
const showSecondarySidebar = ref(true)

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
  }
])

const handleChatSelect = (chat) => {
  selectedChat.value = chat
  chatStore.setSelectedConversation(chat)
}

const toggleSecondarySidebar = () => {
  showSecondarySidebar.value = !showSecondarySidebar.value
}

// Carrega as conversas ao montar o componente
onMounted(async () => {
  if (authStore.currentOrganizationId) {
    await chatStore.fetchConversations()
  }
})

// Observa mudanças na tab ativa para atualizar filtros
watch(activeTab, async (newTab) => {
  const filters = {
    mine: { assigneeId: authStore.user?.id },
    unassigned: { assigneeId: null },
    all: {}
  }

  await chatStore.fetchConversations(filters[newTab])
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