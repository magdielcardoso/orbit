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
    <div class="flex items-center px-1">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        @click="$emit('update:activeTab', tab.id)"
        :class="[
          'px-2.5 py-1.5 border-b-2 transition-colors flex items-center gap-1.5',
          'text-xs font-medium hover:text-orbit-500',
          activeTab === tab.id
            ? 'border-orbit-500 text-orbit-500'
            : 'border-transparent hover:border-orbit-200 text-base-content/70'
        ]"
      >
        {{ t(`chats.tabs.${tab.id}`) }}
        <span
          v-if="tab.count > 0"
          :class="[
            'px-1 py-0.5 text-[10px] rounded-full min-w-[1.25rem] text-center font-medium',
            activeTab === tab.id 
              ? 'bg-orbit-100 text-orbit-700'
              : 'bg-base-200 text-base-content/70'
          ]"
        >
          {{ tab.count }}
        </span>
      </button>
    </div>
  </div>
</template>

<style scoped>
.border-b-2 {
  @apply transition-all duration-200;
}
</style> 