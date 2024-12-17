<script setup>
import { useI18n } from '@/i18n/plugin'
import UserAvatar from './UserAvatar.vue'
import { formatDistanceToNow } from '@/utils/date'

const { t } = useI18n()

const props = defineProps({
  conversations: {
    type: Array,
    required: true
  },
  loading: {
    type: Boolean,
    default: false
  },
  error: {
    type: String,
    default: null
  }
})

const emit = defineEmits(['select'])
</script>

<template>
  <div class="flex-1 overflow-y-auto">
    <div v-if="loading" class="p-4 text-center">
      <span class="loading loading-spinner loading-md"></span>
    </div>

    <div v-else-if="error" class="p-4 text-error text-center">
      {{ error }}
    </div>

    <div v-else-if="conversations.length === 0" class="p-4 text-center text-muted-foreground">
      {{ t('chats.noConversations') }}
    </div>

    <div v-else class="divide-y divide-base-300">
      <button
        v-for="chat in conversations"
        :key="chat.id"
        @click="emit('select', chat)"
        class="w-full p-4 hover:bg-base-200 transition-colors text-left flex items-start gap-3"
      >
        <!-- Avatar e Status -->
        <div class="relative">
          <UserAvatar 
            :name="chat.contact?.name"
            :avatar="chat.contact?.avatar"
            size="md"
          />
          <span 
            :class="[
              'absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-base-100',
              chat.status === 'OPEN' ? 'bg-success' : 
              chat.status === 'PENDING' ? 'bg-warning' : 'bg-muted'
            ]"
          />
        </div>

        <!-- Informações -->
        <div class="flex-1 min-w-0">
          <div class="flex items-center justify-between">
            <span class="font-medium truncate">{{ chat.contact?.name }}</span>
            <span class="text-xs text-base-content/60">
              {{ formatDistanceToNow(chat.updatedAt) }}
            </span>
          </div>

          <div class="flex items-center justify-between mt-1">
            <p class="text-sm text-base-content/70 truncate">
              {{ chat.messages?.[0]?.content }}
            </p>
            <span
              v-if="chat.unreadCount > 0"
              class="px-1.5 py-0.5 text-xs rounded-full bg-primary text-primary-content"
            >
              {{ chat.unreadCount }}
            </span>
          </div>
        </div>
      </button>
    </div>
  </div>
</template> 