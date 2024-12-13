<script setup>
import { ref, computed } from 'vue'
import { useI18n } from '@/i18n/plugin'
import SecondarySidebar from '@/components/layout/SecondarySidebar.vue'

const { t } = useI18n()

// Configuração da sidebar para chats
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
</script>

<template>
  <div class="flex h-full">
    <SecondarySidebar :sections="sidebarSections" />
    <div class="flex-1 p-6">
      <h1 class="text-2xl font-bold mb-8">{{ t('chats.title') }}</h1>
      <!-- Conteúdo da página de chats aqui -->
    </div>
  </div>
</template> 