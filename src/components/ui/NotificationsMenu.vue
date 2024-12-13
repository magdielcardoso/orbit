<script setup>
import { ref } from 'vue'
import { X, Bell } from 'lucide-vue-next'
import { useI18n } from '@/i18n/plugin'

const { t } = useI18n()

defineProps({
  show: Boolean
})

const emit = defineEmits(['close'])

// Mock de notificações - depois virá de um store
const notifications = ref([])
const hasNotifications = ref(false)

const viewAllNotifications = () => {
  emit('close')
  // Implementar navegação para página de notificações
}
</script>

<template>
  <div 
    v-if="show"
    class="absolute left-full bottom-0 ml-2 w-80 rounded-lg bg-base-100 p-2 shadow-lg ring-1 ring-base-content/10"
    @click.stop
  >
    <!-- Header -->
    <div class="mb-2 flex items-center justify-between border-b border-base-300 pb-2">
      <h3 class="text-base font-medium">{{ t('notifications.title') }}</h3>
      <button 
        @click="$emit('close')"
        class="btn btn-ghost btn-sm p-0 h-8 w-8"
      >
        <X class="h-4 w-4" />
      </button>
    </div>

    <!-- Content -->
    <div class="max-h-[400px] overflow-y-auto">
      <!-- Empty State -->
      <div 
        v-if="!hasNotifications"
        class="flex flex-col items-center justify-center py-8 text-center"
      >
        <Bell class="h-12 w-12 text-base-content/20" />
        <p class="mt-2 text-sm text-base-content/70">
          {{ t('notifications.noUnread') }}
        </p>
      </div>

      <!-- Notifications List -->
      <div v-else class="space-y-2">
        <div 
          v-for="notification in notifications" 
          :key="notification.id"
          class="rounded-lg bg-base-200 p-3 hover:bg-base-300 cursor-pointer"
        >
          <!-- Notification Content -->
          <div class="flex items-start gap-3">
            <div class="h-2 w-2 mt-2 rounded-full bg-primary shrink-0" />
            <div>
              <p class="text-sm">{{ notification.message }}</p>
              <span class="text-xs text-base-content/70">{{ notification.time }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <div class="mt-2 border-t border-base-300 pt-2">
      <button
        @click="viewAllNotifications"
        class="btn btn-ghost btn-sm w-full justify-center text-primary"
      >
        {{ t('notifications.viewAll') }}
      </button>
    </div>
  </div>
</template> 