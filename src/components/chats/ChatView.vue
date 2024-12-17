<script setup>
import { ref, onMounted, watch } from 'vue'
import { useI18n } from '@/i18n/plugin'
import { Send, Paperclip, MoreVertical } from 'lucide-vue-next'
import UserAvatar from './UserAvatar.vue'
import { useChatStore } from '@/stores/chat.store'
import { useAuthStore } from '@/stores/auth.store'
import { showToast } from '@/utils/toast'

const { t } = useI18n()
const chatStore = useChatStore()
const authStore = useAuthStore()

const props = defineProps({
  chat: {
    type: Object,
    required: true
  },
  showSecondarySidebar: {
    type: Boolean,
    required: true
  }
})

// Estado
const newMessage = ref('')
const loading = ref(false)

// Envia mensagem
const sendMessage = async () => {
  if (!newMessage.value.trim()) return
  
  try {
    loading.value = true
    await chatStore.sendMessage(props.chat.id, newMessage.value)
    newMessage.value = ''
  } catch (error) {
    showToast(error.message, 'error')
  } finally {
    loading.value = false
  }
}

// Formata data/hora
const formatTime = (dateString) => {
  return new Date(dateString).toLocaleTimeString('pt-BR', { 
    hour: '2-digit', 
    minute: '2-digit' 
  })
}

// Monitora mudanças na conversa selecionada
watch(() => props.chat, async (newChat) => {
  if (newChat?.id) {
    chatStore.setSelectedConversation(newChat)
  }
}, { immediate: true })

onMounted(() => {
  if (props.chat?.id) {
    chatStore.setSelectedConversation(props.chat)
  }
})
</script>

<template>
  <div class="flex-1 flex flex-col h-full">
    <!-- Header do Chat -->
    <div class="p-4 border-b border-base-300 flex items-center justify-between">
      <div class="flex items-center gap-3">
        <UserAvatar 
          :name="chat.contact?.name"
          :avatar="chat.contact?.avatar"
        />
        <div>
          <h2 class="font-medium">{{ chat.contact?.name }}</h2>
          <span class="text-sm text-success">{{ chat.status }}</span>
        </div>
      </div>
      <button class="btn btn-ghost btn-sm">
        <MoreVertical class="h-4 w-4" />
      </button>
    </div>

    <!-- Área de Mensagens -->
    <div class="flex-1 overflow-y-auto p-4 space-y-4">
      <div
        v-for="message in chat.messages"
        :key="message.id"
        :class="[
          'chat',
          message.sender.id === authStore.user?.id ? 'chat-end' : 'chat-start'
        ]"
      >
        <div class="chat-header opacity-50">
          {{ message.sender.name }}
          <time class="text-xs opacity-50 ml-1">{{ formatTime(message.createdAt) }}</time>
        </div>
        <div 
          :class="[
            'chat-bubble max-w-[80%]',
            message.sender.id === authStore.user?.id ? 'chat-bubble-accent' : 'chat-bubble-primary'
          ]"
        >
          {{ message.content }}
        </div>
      </div>
    </div>

    <!-- Input de Mensagem -->
    <div class="p-4 border-t border-base-300">
      <div class="flex items-center gap-2">
        <button class="btn btn-ghost btn-circle">
          <Paperclip class="h-5 w-5" />
        </button>
        <input
          v-model="newMessage"
          type="text"
          class="flex-1 input input-bordered"
          :placeholder="t('chats.typeMessage')"
          @keyup.enter="sendMessage"
        />
        <button 
          class="btn btn-primary btn-circle"
          :disabled="loading || !newMessage.trim()"
          @click="sendMessage"
        >
          <Send class="h-5 w-5" />
        </button>
      </div>
    </div>
  </div>
</template> 