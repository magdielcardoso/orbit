<template>
  <div class="p-4 border-b border-orbit-200/50">
    <!-- Cabeçalho -->
    <div class="flex items-center justify-between mb-4">
      <h3 class="font-medium text-base-content/80 text-sm">{{ t('contacts.quickContacts') }}</h3>
      <div class="flex gap-2">
        <button class="btn btn-ghost btn-sm px-2">
          <Search class="h-4 w-4" />
        </button>
        <button class="btn btn-ghost btn-sm px-2">
          <Plus class="h-4 w-4" />
        </button>
      </div>
    </div>

    <!-- Barra de Pesquisa -->
    <div class="relative mb-4">
      <Search class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-base-content/50" />
      <input
        type="text"
        :placeholder="t('contacts.searchPlaceholder')"
        class="input input-bordered w-full pl-10 h-9 text-sm"
      />
    </div>

    <!-- Botões de Ação -->
    <div class="flex gap-2 mb-4">
      <button class="flex-1 btn btn-primary btn-sm gap-2 text-xs">
        <Calendar class="h-3.5 w-3.5" />
        {{ t('contacts.actions.meeting') }}
      </button>
      <button class="flex-1 btn btn-ghost btn-sm gap-2 text-xs border-orbit-300 border-dashed hover:border-solid">
        <Clock class="h-3.5 w-3.5" />
        {{ t('contacts.actions.schedule') }}
      </button>
    </div>

    <!-- Lista de Contatos -->
    <div class="space-y-1">
      <div v-for="contact in contacts" :key="contact.id" 
        class="flex items-center gap-3 p-2 rounded-lg hover:bg-orbit-100/10 cursor-pointer relative transition-colors duration-200"
      >
        <!-- Avatar com Status -->
        <div class="relative">
          <UserAvatar 
            :name="contact.name"
            :avatar="contact.avatar"
            size="sm"
          />
          <span 
            :class="[
              'absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-base-100',
              contact.online ? 'bg-success' : 'bg-base-300'
            ]"
          />
        </div>

        <!-- Info do Contato -->
        <div class="flex-1 min-w-0">
          <div class="font-medium truncate text-sm">{{ contact.name }}</div>
          <div class="text-xs text-base-content/60 truncate">{{ contact.status }}</div>
        </div>

        <!-- Indicadores -->
        <div class="flex items-center gap-2">
          <Badge v-if="contact.unread" variant="primary" class="h-5 min-w-5 flex items-center justify-center">
            {{ contact.unread }}
          </Badge>
          <button v-if="contact.online" class="btn btn-ghost btn-xs px-2">
            <MessageSquare class="h-3.5 w-3.5 text-orbit-500" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Plus, Search, Calendar, Clock, MessageSquare } from 'lucide-vue-next'
import { useI18n } from '@/i18n/plugin'
import UserAvatar from '@/components/chats/UserAvatar.vue'
import Badge from './badge/Badge.vue'

const { t } = useI18n()

// Mock de dados - depois virá de uma store
const contacts = [
  {
    id: 1,
    name: 'Jonathan',
    status: 'Online',
    online: true,
    unread: 2
  },
  {
    id: 2,
    name: 'Elizabeth Jun',
    status: 'In meeting',
    online: true
  },
  {
    id: 3,
    name: 'Kevin',
    status: 'Last seen 2h ago',
    online: false
  },
  {
    id: 4,
    name: 'Michael Swan',
    status: 'Offline',
    online: false
  }
]
</script>

<style scoped>
.input {
  @apply bg-base-200/50 border-base-300;
}

.input:focus {
  @apply border-orbit-500;
}

.btn-primary {
  @apply bg-orbit-500 border-orbit-600 hover:bg-orbit-600;
}

/* Estilo específico para o botão Schedule */
.btn-ghost {
  @apply border border-dashed;
}

.btn-ghost:hover {
  @apply border-solid bg-orbit-100/10 text-orbit-500;
}
</style> 