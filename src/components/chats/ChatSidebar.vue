<script setup>
import { ref } from 'vue'
import { useI18n } from '@/i18n/plugin'
import { Search, Command, Keyboard, PanelLeftClose, PanelLeft } from 'lucide-vue-next'
import UserAvatar from './UserAvatar.vue'

const { t } = useI18n()

// Estado
const searchQuery = ref('')

// Mock de dados para exemplo
const chats = [
  {
    id: 1,
    name: 'João Silva',
    avatar: null,
    lastMessage: 'Olá, preciso de ajuda com meu pedido',
    time: '10:30',
    unread: 2,
    status: 'online'
  },
  {
    id: 2,
    name: 'Maria Santos',
    avatar: 'https://i.pravatar.cc/150?u=maria',
    lastMessage: 'Quando meu pedido será entregue?',
    time: '09:45',
    unread: 0,
    status: 'offline'
  }
]

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
</script>

<template>
  <div class="w-96 border-r border-base-300 flex flex-col">
    <!-- Header -->
    <div class="p-4 border-b border-base-300">
      <div class="flex items-center justify-between mb-4">
        <div class="flex items-center gap-3">
          <button 
            class="btn btn-sm btn-ghost"
            @click="$emit('toggle-sidebar')"
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

      <!-- Barra de pesquisa -->
      <div class="relative">
        <Search class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-base-content/50" />
        <input
          type="text"
          v-model="searchQuery"
          :placeholder="t('chats.searchPlaceholder')"
          class="input input-bordered w-full pl-10"
        />
      </div>
    </div>

    <!-- Tabs -->
    <div class="border-b border-base-300">
      <div class="flex">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          @click="$emit('update:activeTab', tab.id)"
          :class="[
            'px-4 py-2 border-b-2 transition-colors flex items-center gap-2',
            activeTab === tab.id
              ? 'border-primary text-primary'
              : 'border-transparent hover:border-base-300'
          ]"
        >
          {{ t(`chats.tabs.${tab.id}`) }}
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
    <div class="flex-1 overflow-y-auto">
      <div class="divide-y divide-base-300">
        <button
          v-for="chat in chats"
          :key="chat.id"
          @click="emit('select', chat)"
          class="w-full p-4 hover:bg-base-200 transition-colors text-left flex items-center gap-3"
        >
          <UserAvatar 
            :name="chat.name"
            :avatar="chat.avatar"
            size="sm"
          />
          <div class="flex-1 min-w-0">
            <div class="flex items-center justify-between">
              <span class="font-medium">{{ chat.name }}</span>
              <span class="text-xs text-base-content/60">{{ chat.time }}</span>
            </div>
            <div class="flex items-center justify-between">
              <p class="text-sm text-base-content/70 truncate">
                {{ chat.lastMessage }}
              </p>
              <span
                v-if="chat.unread > 0"
                class="px-1.5 py-0.5 text-xs rounded-full bg-primary text-primary-content shrink-0 ml-2"
              >
                {{ chat.unread }}
              </span>
            </div>
          </div>
        </button>
      </div>
    </div>
  </div>
</template> 