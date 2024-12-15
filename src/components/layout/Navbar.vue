<template>
  <nav class="sticky top-0 z-30 py-2.5 border-b border-base-300 dark:border-base-800 bg-base-100/95 dark:bg-base-900/95 backdrop-blur-sm shadow-[0_1px_3px_0_rgba(0,0,0,0.05)] dark:shadow-none relative">
    <div class="flex items-center justify-between w-full">
      <!-- Lado Esquerdo: Seletor de Organização e Ações Rápidas -->
      <div class="flex items-center gap-2 pl-4">
        <OrganizationSelector />
        
        <!-- Divider Vertical -->
        <div class="h-5 w-px bg-base-300 dark:bg-base-700 mx-2"></div>
        
        <!-- Funções Rápidas -->
        <div class="flex items-center gap-1">
          <button 
            v-for="action in quickActions" 
            :key="action.name"
            class="btn btn-ghost btn-xs gap-1 hover:bg-orbit-200 hover:border-orbit-300 dark:hover:bg-orbit-900 dark:hover:border-orbit-800 normal-case h-7 min-h-0 px-2 font-normal"
            :class="{ 'text-orbit-500 dark:text-orbit-400': action.highlight }"
          >
            <component :is="action.icon" class="h-3.5 w-3.5" />
            <span class="text-xs">{{ t(`navbar.quickActions.${action.name}`) }}</span>
          </button>
        </div>
      </div>

      <!-- Lado Direito: Busca -->
      <div class="pr-4">
        <button class="btn btn-ghost btn-xs h-7 w-7 min-h-0 hover:bg-orbit-200 hover:border-orbit-300 dark:hover:bg-orbit-900 dark:hover:border-orbit-800 p-0">
          <Search class="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
    <!-- Linha de separação sutil -->
    <div class="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-base-300/50 via-base-300 to-base-300/50 dark:from-orbit-800/20 dark:via-orbit-700/20 dark:to-orbit-800/20"></div>
  </nav>
</template>

<script setup>
import { ref } from 'vue'
import { useI18n } from '@/i18n'
import OrganizationSelector from '../OrganizationSelector.vue'
import { Search, Plus, Users, MessageCircle, Calendar } from 'lucide-vue-next'

const { t } = useI18n()

const quickActions = [
  {
    label: t('navbar.quickActions.newChat'),
    icon: Plus,
    name: 'newChat',
    highlight: true
  },
  {
    label: t('navbar.quickActions.meetings'),
    icon: Calendar,
    name: 'meetings'
  },
  {
    label: t('navbar.quickActions.groups'),
    icon: Users,
    name: 'groups'
  },
  {
    label: t('navbar.quickActions.messages'),
    icon: MessageCircle,
    name: 'messages'
  }
]
</script>

<style scoped>
.btn-ghost {
  @apply transition-all duration-200;
  border: 1px solid transparent;
  min-height: unset;
  line-height: 1;
}

.btn-ghost:hover {
  border: 1px solid rgb(var(--orbit-300));
}

:root[data-theme="dark"] .btn-ghost:hover {
  border: 1px solid rgb(var(--orbit-800));
}
</style> 