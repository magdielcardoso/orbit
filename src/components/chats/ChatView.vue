<script setup>
import { ref } from 'vue'
import { useI18n } from '@/i18n/plugin'
import { Send, Paperclip, MoreVertical } from 'lucide-vue-next'
import UserAvatar from './UserAvatar.vue'

const { t } = useI18n()

const props = defineProps({
  chat: {
    type: Object,
    required: true
  }
})

// Estado
const newMessage = ref('')

// Mock de mensagens para exemplo
const messages = [
  {
    id: 1,
    text: 'Olá, preciso de ajuda com meu pedido',
    time: '10:30',
    sender: 'user',
    status: 'read'
  },
  {
    id: 2,
    text: 'Claro! Em que posso ajudar?',
    time: '10:31',
    sender: 'agent',
    status: 'read'
  },
  {
    id: 3,
    text: 'Meu pedido está atrasado e não consigo rastrear',
    time: '10:32',
    sender: 'user',
    status: 'read'
  },
  {
    id: 4,
    text: 'Pode me informar o número do pedido?',
    time: '10:33',
    sender: 'agent',
    status: 'read'
  },
  {
    id: 5,
    text: '#123456',
    time: '10:34',
    sender: 'user',
    status: 'read'
  }
]

const sendMessage = () => {
  if (!newMessage.value.trim()) return

  messages.push({
    id: messages.length + 1,
    text: newMessage.value,
    time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
    sender: 'agent',
    status: 'sent'
  })

  newMessage.value = ''
}
</script>

<template>
  <div class="flex-1 flex flex-col h-full">
    <!-- Header do Chat -->
    <div class="p-4 border-b border-base-300 flex items-center justify-between">
      <div class="flex items-center gap-3">
        <UserAvatar 
          :name="chat.name"
          :avatar="chat.avatar"
        />
        <div>
          <h2 class="font-medium">{{ chat.name }}</h2>
          <span class="text-sm text-success">online</span>
        </div>
      </div>
      <button class="btn btn-ghost btn-sm">
        <MoreVertical class="h-4 w-4" />
      </button>
    </div>

    <!-- Área de Mensagens -->
    <div class="flex-1 overflow-y-auto p-4 space-y-4">
      <div
        v-for="message in messages"
        :key="message.id"
        :class="[
          'chat',
          message.sender === 'user' ? 'chat-start' : 'chat-end'
        ]"
      >
        <div class="chat-header opacity-50">
          {{ message.sender === 'user' ? chat.name : 'Você' }}
          <time class="text-xs opacity-50 ml-1">{{ message.time }}</time>
        </div>
        <div 
          :class="[
            'chat-bubble max-w-[80%]',
            message.sender === 'user' ? 'chat-bubble-primary' : 'chat-bubble-accent'
          ]"
        >
          {{ message.text }}
        </div>
        <div class="chat-footer opacity-50">
          {{ message.status }}
        </div>
      </div>
    </div>

    <!-- Área de Input -->
    <div class="p-4 border-t border-base-300">
      <div class="flex items-center gap-2">
        <button class="btn btn-ghost btn-sm">
          <Paperclip class="h-4 w-4" />
        </button>
        <input
          v-model="newMessage"
          type="text"
          :placeholder="t('chats.messagePlaceholder')"
          class="input input-bordered flex-1"
          @keyup.enter="sendMessage"
        />
        <button 
          class="btn btn-primary btn-sm"
          @click="sendMessage"
          :disabled="!newMessage.trim()"
        >
          <Send class="h-4 w-4" />
        </button>
      </div>
    </div>
  </div>
</template> 