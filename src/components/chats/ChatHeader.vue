<script setup>
import { Search, Command, Keyboard } from 'lucide-vue-next'
import { useI18n } from '@/i18n/plugin'

const { t } = useI18n()

defineProps({
  searchQuery: {
    type: String,
    required: true
  }
})

defineEmits(['update:searchQuery'])
</script>

<template>
  <div class="p-4 border-b border-base-300">
    <div class="flex items-center justify-between mb-4">
      <h1 class="text-xl font-semibold flex items-center gap-2">
        {{ t('chats.title') }}
        <span class="text-xs px-2 py-0.5 rounded bg-base-200">{{ t('chats.status.open') }}</span>
      </h1>
      <div class="flex items-center gap-2">
        <button class="btn btn-sm btn-ghost">
          <Command class="h-4 w-4" />
        </button>
        <button class="btn btn-sm btn-ghost">
          <Keyboard class="h-4 w-4" />
        </button>
      </div>
    </div>

    <!-- Barra de pesquisa -->
    <div class="relative">
      <Search class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-base-content/50" />
      <input
        type="text"
        :value="searchQuery"
        @input="$emit('update:searchQuery', $event.target.value)"
        :placeholder="t('chats.searchPlaceholder')"
        class="input input-bordered w-full pl-10"
      />
    </div>
  </div>
</template> 