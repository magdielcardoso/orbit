<script setup>
import { useI18n } from '@/i18n/plugin'

const { t } = useI18n()

defineProps({
  activeTab: {
    type: String,
    required: true
  },
  tabs: {
    type: Array,
    required: true
  }
})

defineEmits(['update:activeTab'])
</script>

<template>
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
</template> 