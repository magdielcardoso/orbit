<script setup>
import { ref, onMounted } from 'vue'
import { Moon, Sun, X, Layout, Menu, MessageCircle, Bell } from 'lucide-vue-next'
import { useI18n } from '@/i18n/plugin'

const { t } = useI18n()

const props = defineProps({
  show: Boolean,
  currentTheme: String
})

const emit = defineEmits(['close', 'update:theme'])

const selectedTheme = ref(props.currentTheme || 'light')
const previewTheme = ref(props.currentTheme || 'light')

const themes = [
  {
    id: 'light',
    icon: Sun
  },
  {
    id: 'dark',
    icon: Moon
  }
]

const handleThemeSelect = (themeId) => {
  previewTheme.value = themeId
}

const applyTheme = () => {
  selectedTheme.value = previewTheme.value
  localStorage.setItem('theme', previewTheme.value)
  document.documentElement.setAttribute('data-theme', previewTheme.value)
  emit('update:theme', previewTheme.value)
  emit('close')
}

onMounted(() => {
  const savedTheme = localStorage.getItem('theme') || 'light'
  selectedTheme.value = savedTheme
  previewTheme.value = savedTheme
  document.documentElement.setAttribute('data-theme', savedTheme)
})
</script>

<template>
  <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center">
    <!-- Overlay -->
    <div 
      class="absolute inset-0 bg-black/50" 
      @click="$emit('close')"
    />

    <!-- Modal -->
    <div class="relative w-full max-w-2xl rounded-lg bg-base-100 p-6 shadow-xl">
      <!-- Header -->
      <div class="mb-6 flex items-center justify-between">
        <h3 class="text-lg font-semibold">{{ t('settings.selectTheme') }}</h3>
        <button 
          @click="$emit('close')"
          class="btn btn-ghost btn-sm p-0 h-8 w-8"
        >
          <X class="h-4 w-4" />
        </button>
      </div>

      <!-- Themes Grid -->
      <div class="grid grid-cols-2 gap-4">
        <div 
          v-for="theme in themes" 
          :key="theme.id"
          class="relative rounded-lg border-2 overflow-hidden cursor-pointer transition-all duration-300"
          :class="previewTheme === theme.id ? 'border-primary' : 'border-base-300 hover:border-base-content/20'"
          :data-theme="theme.id"
          @click="handleThemeSelect(theme.id)"
        >
          <!-- Theme Preview -->
          <div class="h-48 bg-base-100 transition-colors duration-300">
            <!-- Navbar -->
            <div class="flex items-center justify-between bg-base-200 p-2 transition-colors duration-300">
              <div class="flex items-center gap-2">
                <Menu class="h-4 w-4 text-base-content transition-colors duration-300" />
                <span class="text-xs font-medium text-base-content transition-colors duration-300">
                  {{ t('themePreview.menu') }}
                </span>
              </div>
              <div class="flex items-center gap-2">
                <Bell class="h-4 w-4 text-base-content transition-colors duration-300" />
                <div class="avatar w-6 h-6 rounded-full bg-primary transition-colors duration-300" />
              </div>
            </div>

            <!-- Content -->
            <div class="p-3 space-y-3">
              <!-- Card -->
              <div class="rounded bg-base-200 p-2 transition-colors duration-300">
                <div class="flex items-center gap-2">
                  <Layout class="h-4 w-4 text-primary transition-colors duration-300" />
                  <span class="text-xs text-base-content transition-colors duration-300">
                    {{ t('themePreview.cardTitle') }}
                  </span>
                </div>
                <div class="mt-2 h-2 w-3/4 rounded bg-base-content/10 transition-colors duration-300" />
                <div class="mt-1 h-2 w-1/2 rounded bg-base-content/10 transition-colors duration-300" />
              </div>

              <!-- Button Examples -->
              <div class="flex gap-2">
                <div class="btn btn-primary btn-xs transition-colors duration-300">
                  {{ t('themePreview.primary') }}
                </div>
                <div class="btn btn-ghost btn-xs transition-colors duration-300">
                  {{ t('themePreview.ghost') }}
                </div>
              </div>

              <!-- Chat Example -->
              <div class="flex items-center gap-2 rounded bg-primary/10 p-2 transition-colors duration-300">
                <MessageCircle class="h-3 w-3 text-primary transition-colors duration-300" />
                <div class="h-2 w-16 rounded bg-base-content/20 transition-colors duration-300" />
              </div>
            </div>
          </div>

          <!-- Theme Info -->
          <div class="absolute inset-x-0 bottom-0 bg-base-100/80 backdrop-blur p-3">
            <div class="flex items-center gap-2">
              <component :is="theme.icon" class="h-4 w-4" />
              <span class="font-medium">{{ t(`settings.themes.${theme.id}`) }}</span>
            </div>
          </div>

          <!-- Selected Indicator -->
          <div 
            v-if="previewTheme === theme.id"
            class="absolute inset-0 border-2 border-primary ring-2 ring-primary ring-offset-2 ring-offset-base-100 transition-colors duration-300"
          />
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="mt-6 flex justify-end gap-2">
        <button 
          @click="$emit('close')"
          class="btn btn-ghost"
        >
          {{ t('themePreview.cancel') }}
        </button>
        <button 
          @click="applyTheme"
          class="btn btn-primary"
          :disabled="previewTheme === selectedTheme"
        >
          {{ t('themePreview.apply') }}
        </button>
      </div>
    </div>
  </div>
</template> 