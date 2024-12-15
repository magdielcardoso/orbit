<script setup>
import { ref, computed, onMounted } from 'vue'
import { useI18n } from '@/i18n/plugin'
import SecondarySidebar from '@/components/layout/SecondarySidebar.vue'

const { t, setLocale } = useI18n()

const languages = [
  { code: 'pt', name: 'Português' },
  { code: 'en', name: 'English' }
]

// Inicializa com o valor do localStorage ou fallback para 'pt'
const selectedLanguage = ref(localStorage.getItem('locale') || 'pt')

// Configuração da sidebar
const sidebarSections = computed(() => [
  {
    id: 'user-preferences',
    label: t('settings.sections.preferences.title'),
    items: [
      {
        id: 'settings-general',
        label: t('settings.sections.preferences.general.title'),
        icon: 'Settings'
      },
      {
        id: 'settings-profile',
        label: t('settings.sections.preferences.profile.title'),
        icon: 'Users'
      }
    ]
  },
  {
    id: 'inbox',
    label: t('settings.sections.inbox.title'),
    items: [
      {
        id: 'inbox-settings',
        label: t('settings.sections.inbox.inboxes'),
        icon: 'Inbox',
        to: '/settings/inbox'
      }
    ]
  },
  {
    id: 'notifications',
    label: t('settings.sections.notifications.title'),
    items: [
      {
        id: 'notification-preferences',
        label: t('settings.sections.notifications.preferences.title'),
        icon: 'Bell'
      }
    ]
  },
  {
    id: 'security',
    label: t('settings.sections.security.title'),
    items: [
      {
        id: 'security-settings',
        label: t('settings.sections.security.settings.title'),
        icon: 'Shield'
      },
      {
        id: 'api-tokens',
        label: t('settings.sections.security.apiTokens.title'),
        icon: 'Key'
      }
    ]
  }
])

const handleLanguageChange = (event) => {
  const newLocale = event.target.value
  setLocale(newLocale)
  selectedLanguage.value = newLocale
  localStorage.setItem('locale', newLocale)
}

onMounted(() => {
  // Garante que o idioma inicial está sincronizado
  const savedLocale = localStorage.getItem('locale')
  if (savedLocale) {
    selectedLanguage.value = savedLocale
    setLocale(savedLocale)
  }
})
</script>

<template>
  <div class="flex h-full">
    <SecondarySidebar :sections="sidebarSections" />
    <div class="flex-1 p-6">
      <h1 class="text-2xl font-bold mb-8">{{ t('settings.sections.preferences.general.title') }}</h1>

      <!-- Seção de Idioma -->
      <div class="max-w-xl">
        <h2 class="text-lg font-semibold mb-4">{{ t('settings.language') }}</h2>
        
        <div class="form-control w-full max-w-xs">
          <label class="label">
            <span class="label-text">{{ t('settings.selectLanguage') }}</span>
          </label>
          <select 
            class="select select-bordered w-full"
            :value="selectedLanguage"
            @change="handleLanguageChange"
          >
            <option 
              v-for="lang in languages" 
              :key="lang.code"
              :value="lang.code"
            >
              {{ lang.name }}
            </option>
          </select>
          <label class="label">
            <span class="label-text-alt text-base-content/70">
              {{ t('settings.languageHelp') }}
            </span>
          </label>
        </div>
      </div>
    </div>
  </div>
</template>