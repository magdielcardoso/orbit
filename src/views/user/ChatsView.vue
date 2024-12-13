<script setup>
import { ref, computed } from 'vue'
import { useI18n } from '@/i18n/plugin'
import SecondarySidebar from '@/components/layout/SecondarySidebar.vue'
import ChatSidebar from '@/components/chats/ChatSidebar.vue'
import ChatView from '@/components/chats/ChatView.vue'
import ChatEmptyState from '@/components/chats/ChatEmptyState.vue'

const { t } = useI18n()

// Estado
const activeTab = ref('mine')
const selectedChat = ref(null)
const showSecondarySidebar = ref(true)

// Tabs
const tabs = [
  { id: 'mine', label: 'Minhas', count: 0 },
  { id: 'unassigned', label: 'Não atribuídas', count: 2 },
  { id: 'all', label: 'Todas', count: 2 }
]

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
}

const toggleSecondarySidebar = () => {
  showSecondarySidebar.value = !showSecondarySidebar.value
}
</script>

<template>
  <div class="flex h-full overflow-hidden">
    <Transition
      enter-active-class="transition-all duration-300 ease-in-out"
      leave-active-class="transition-all duration-300 ease-in-out"
      enter-from-class="-ml-64 opacity-0"
      enter-to-class="ml-0 opacity-100"
      leave-from-class="ml-0 opacity-100"
      leave-to-class="-ml-64 opacity-0"
    >
      <SecondarySidebar v-if="showSecondarySidebar" :sections="sidebarSections" class="w-64 shrink-0" />
    </Transition>
    <div class="flex-1 flex">
      <ChatSidebar
        v-model:activeTab="activeTab"
        :tabs="tabs"
        :showSecondarySidebar="showSecondarySidebar"
        @select="handleChatSelect"
        @toggle-sidebar="toggleSecondarySidebar"
      />

      <template v-if="selectedChat">
        <ChatView :chat="selectedChat" />
      </template>
      <template v-else>
        <ChatEmptyState />
      </template>
    </div>
  </div>
</template> 