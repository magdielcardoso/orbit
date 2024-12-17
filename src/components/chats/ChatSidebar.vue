<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useI18n } from '@/i18n/plugin'
import { Search, Command, Keyboard, PanelLeftClose, PanelLeft } from 'lucide-vue-next'
import UserAvatar from './UserAvatar.vue'
import ChatList from './ChatList.vue'
import { useChatStore } from '@/stores/chat.store'
import { useAuthStore } from '@/stores/auth.store'

const { t } = useI18n()
const chatStore = useChatStore()
const authStore = useAuthStore()

// Estado
const searchQuery = ref('')

const props = defineProps({
  activeTab: {
    type: String,
    required: true
  },
  tabs: {
    type: Array,
    required: true
  },
  showSecondarySidebar: {
    type: Boolean,
    required: true
  }
})

const emit = defineEmits(['select', 'update:activeTab', 'toggle-sidebar'])

// Computed para filtrar conversas baseado na tab ativa
const filteredConversations = computed(() => {
  const conversations = chatStore.sortedConversations
  
  switch (props.activeTab) {
    case 'mine':
      return conversations.filter(c => c.assigneeId === authStore.user?.id)
    case 'unassigned':
      return conversations.filter(c => !c.assigneeId)
    default:
      return conversations
  }
})

// Handler para seleção de chat
const handleChatSelect = (chat) => {
  chatStore.setSelectedConversation(chat)
  emit('select', chat)
}

// Carrega as conversas ao montar o componente
onMounted(async () => {
  if (authStore.currentOrganizationId) {
    await chatStore.fetchConversations()
  }
})

// Observa mudanças na tab ativa para atualizar filtros
watch(props.activeTab, async (newTab) => {
  const filters = {
    mine: { assigneeId: authStore.user?.id },
    unassigned: { assigneeId: null },
    all: {}
  }

  await chatStore.fetchConversations(filters[newTab])
})
</script>

<template>
  <div class="w-96 border-r border-base-300 flex flex-col overflow-hidden">
    <!-- Header -->
    <div class="shrink-0 p-4 border-b border-base-300">
      <div class="flex items-center justify-between mb-4">
        <div class="flex items-center gap-3">
          <button 
            class="btn btn-sm btn-ghost"
            @click="emit('toggle-sidebar')"
          >
            <component 
              :is="showSecondarySidebar ? PanelLeftClose : PanelLeft" 
              class="h-4 w-4"
            />
          </button>
          <h1 class="text-xl font-semibold flex items-center gap-2">
            {{ t('chats.title') }}
            <span class="text-xs px-2 py-0.5 rounded bg-base-200">{{ t('chats.status.open') }}</span>
          </h1>
        </div>
        <div class="flex items-center gap-2">
          <button class="btn btn-sm btn-ghost">
            <Command class="h-4 w-4" />
          </button>
          <button class="btn btn-sm btn-ghost">
            <Keyboard class="h-4 w-4" />
          </button>
        </div>
      </div>

      <div class="relative">
        <Search class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-base-content/50" />
        <input
          v-model="searchQuery"
          type="text"
          class="input input-bordered w-full pl-10"
          :placeholder="t('chats.searchPlaceholder')"
        />
      </div>
    </div>

    <!-- Tabs -->
    <div class="shrink-0 border-b border-base-300">
      <div class="flex">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          class="flex-1 px-4 py-2 border-b-2 transition-colors flex items-center gap-2 justify-center"
          :class="[
            activeTab === tab.id
              ? 'border-primary text-primary'
              : 'border-transparent hover:border-base-300'
          ]"
          @click="emit('update:activeTab', tab.id)"
        >
          {{ tab.label }}
          <span
            v-if="tab.count > 0"
            class="px-1.5 py-0.5 text-xs rounded-full bg-base-200"
          >
            {{ tab.count }}
          </span>
        </button>
      </div>
    </div>

    <!-- Lista de Chats -->
    <div class="flex-1 overflow-auto">
      <ChatList
        :conversations="filteredConversations"
        :loading="chatStore.loading"
        :error="chatStore.error"
        @select="handleChatSelect"
      />
    </div>
  </div>
</template> 