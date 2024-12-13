<script setup>
import { useI18n } from '@/i18n/plugin'

const { t } = useI18n()
</script>

<template>
  <div class="flex-1 flex flex-col items-center justify-center p-8 bg-base-100/50">
    <div class="text-center max-w-md">
      <div class="mb-4">
        <!-- Placeholder para ilustração -->
        <div class="w-32 h-32 mx-auto opacity-50 bg-base-300 rounded-full flex items-center justify-center">
          <span class="text-4xl">💬</span>
        </div>
      </div>
      <p class="text-base-content/70 mb-4">
        {{ t('chats.emptyState.title') }}
      </p>
      <div class="flex flex-col gap-2 text-sm text-base-content/60">
        <div class="flex items-center justify-center gap-2">
          <kbd class="kbd kbd-sm">⌘</kbd>
          <kbd class="kbd kbd-sm">K</kbd>
          <span>{{ t('chats.emptyState.shortcuts.command') }}</span>
        </div>
        <div class="flex items-center justify-center gap-2">
          <kbd class="kbd kbd-sm">⌘</kbd>
          <kbd class="kbd kbd-sm">/</kbd>
          <span>{{ t('chats.emptyState.shortcuts.keyboard') }}</span>
        </div>
      </div>
    </div>
  </div>
</template> 