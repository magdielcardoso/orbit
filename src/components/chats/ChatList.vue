<script setup>
import { ref } from 'vue'
import { useI18n } from '@/i18n/plugin'

const { t } = useI18n()

// Mock de dados para exemplo
const chats = [
  {
    id: 1,
    name: 'João Silva',
    lastMessage: 'Olá, preciso de ajuda com meu pedido',
    time: '10:30',
    unread: 2,
    status: 'online'
  },
  {
    id: 2,
    name: 'Maria Santos',
    lastMessage: 'Quando meu pedido será entregue?',
    time: '09:45',
    unread: 0,
    status: 'offline'
  }
]

const emit = defineEmits(['select'])
</script>

<template>
  <div class="w-80 border-r border-base-300 overflow-y-auto">
    <div class="divide-y divide-base-300">
      <button
        v-for="chat in chats"
        :key="chat.id"
        @click="emit('select', chat)"
        class="w-full p-4 hover:bg-base-200 transition-colors text-left flex flex-col gap-1"
      >
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
            class="px-1.5 py-0.5 text-xs rounded-full bg-primary text-primary-content"
          >
            {{ chat.unread }}
          </span>
        </div>
      </button>
    </div>
  </div>
</template> 