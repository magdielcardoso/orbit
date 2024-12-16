<script setup>
import { ref, computed, onMounted } from 'vue'
import { useI18n } from '@/i18n/plugin'
import SecondarySidebar from '@/components/layout/SecondarySidebar.vue'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { 
  Settings, 
  Users, 
  Inbox, 
  Bell, 
  Shield, 
  Key,
  Globe,
  MessageCircle,
  Clock,
  Calendar,
  Phone,
  Bold, 
  Italic, 
  Link2, 
  Image,
  User,
  Settings as SettingsIcon,
  MessageSquare,
  Mail
} from 'lucide-vue-next'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'

const { t, setLocale } = useI18n()

const languages = [
  { code: 'pt', name: 'Português' },
  { code: 'en', name: 'English' }
]

// Inicializa com o valor do localStorage ou fallback para 'pt'
const selectedLanguage = ref(localStorage.getItem('locale') || 'pt')

// Novas configurações
const timeFormat = ref(localStorage.getItem('timeFormat') || '24h')
const dateFormat = ref(localStorage.getItem('dateFormat') || 'dd/MM/yyyy')
const phoneFormat = ref(localStorage.getItem('phoneFormat') || 'BR')
const notificationSound = ref(localStorage.getItem('notificationSound') === 'true')
const autoRefreshInterval = ref(localStorage.getItem('autoRefreshInterval') || '30')

// Opções para os selects
const timeFormats = [
  { value: '24h', label: '24h (14:30)' },
  { value: '12h', label: '12h (2:30 PM)' }
]

const dateFormats = [
  { value: 'dd/MM/yyyy', label: 'DD/MM/YYYY' },
  { value: 'MM/dd/yyyy', label: 'MM/DD/YYYY' },
  { value: 'yyyy-MM-dd', label: 'YYYY-MM-DD' }
]

const phoneFormats = [
  { value: 'BR', label: '+55 (11) 98765-4321' },
  { value: 'US', label: '+1 (555) 123-4567' },
  { value: 'INT', label: '+XXX XXXXXXXXX' }
]

const refreshIntervals = [
  { value: '0', label: t('settings.autoRefresh.disabled') },
  { value: '30', label: '30 ' + t('settings.autoRefresh.seconds') },
  { value: '60', label: '1 ' + t('settings.autoRefresh.minute') },
  { value: '300', label: '5 ' + t('settings.autoRefresh.minutes') }
]

// Configuração da sidebar com ícones Lucide
const sidebarSections = computed(() => [
  {
    id: 'user-settings',
    label: t('settings.sections.user.title'),
    items: [
      {
        id: 'profile',
        label: t('settings.sections.user.profile'),
        icon: User,
        active: true
      },
      {
        id: 'general',
        label: t('settings.sections.user.general'),
        icon: SettingsIcon
      },
      {
        id: 'notifications',
        label: t('settings.sections.user.notifications'),
        icon: Bell
      }
    ]
  },
  {
    id: 'security',
    label: t('settings.sections.security.title'),
    items: [
      {
        id: 'security-settings',
        label: t('settings.sections.security.settings'),
        icon: Shield
      },
      {
        id: 'api-tokens',
        label: t('settings.sections.security.apiTokens'),
        icon: Key
      }
    ]
  },
  {
    id: 'communication',
    label: t('settings.sections.communication.title'),
    items: [
      {
        id: 'signature',
        label: t('settings.sections.communication.signature'),
        icon: MessageSquare
      },
      {
        id: 'email',
        label: t('settings.sections.communication.email'),
        icon: Mail
      }
    ]
  }
])

const handleLanguageChange = (newValue) => {
  // Garante que temos um valor válido
  if (!newValue) return
  
  // Atualiza o estado local
  selectedLanguage.value = newValue
  
  // Atualiza o i18n
  setLocale(newValue)
  
  // Persiste no localStorage
  localStorage.setItem('locale', newValue)
}

// Handlers
const handleTimeFormatChange = (newValue) => {
  timeFormat.value = newValue
  localStorage.setItem('timeFormat', newValue)
}

const handleDateFormatChange = (newValue) => {
  dateFormat.value = newValue
  localStorage.setItem('dateFormat', newValue)
}

const handlePhoneFormatChange = (newValue) => {
  phoneFormat.value = newValue
  localStorage.setItem('phoneFormat', newValue)
}

const handleNotificationSoundChange = (event) => {
  notificationSound.value = event.target.checked
  localStorage.setItem('notificationSound', event.target.checked)
}

const handleAutoRefreshChange = (newValue) => {
  autoRefreshInterval.value = newValue
  localStorage.setItem('autoRefreshInterval', newValue)
}

// Garante que o idioma inicial está sincronizado
onMounted(() => {
  const savedLocale = localStorage.getItem('locale')
  if (savedLocale) {
    selectedLanguage.value = savedLocale
    setLocale(savedLocale)
  }
})

// Dados do perfil
const displayName = ref(localStorage.getItem('displayName') || '')
const email = ref(localStorage.getItem('email') || '')
const messageSignature = ref(localStorage.getItem('messageSignature') || '')
const userAvatar = ref(localStorage.getItem('userAvatar') || '')

// Computed para iniciais do usuário
const userInitials = computed(() => {
  if (!displayName.value) return ''
  return displayName.value
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
})

// Função para salvar configurações
async function saveSettings() {
  try {
    // Salva no localStorage
    localStorage.setItem('displayName', displayName.value)
    localStorage.setItem('email', email.value)
    localStorage.setItem('messageSignature', messageSignature.value)
    
    // Aqui você pode adicionar a chamada para a API
    
    showToast(t('settings.saveSuccess'))
  } catch (error) {
    console.error('Erro ao salvar configurações:', error)
    showToast(error.message, 'error')
  }
}
</script>

<template>
  <div class="flex h-full">
    <SecondarySidebar :sections="sidebarSections" />
    
    <div class="flex-1 p-6">
      <h1 class="text-2xl font-bold mb-8 text-foreground">
        {{ t('settings.sections.preferences.profile.title') }}
      </h1>

      <!-- Configurações Rápidas -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <!-- Foto de Perfil -->
        <Card class="border-2 border-orbit-500/50 hover:border-orbit-500 transition-colors">
          <CardHeader>
            <CardTitle class="text-sm">{{ t('settings.profile.photo') }}</CardTitle>
          </CardHeader>
          <CardContent>
            <div class="flex items-center gap-4">
              <Avatar class="h-16 w-16">
                <AvatarImage :src="userAvatar" />
                <AvatarFallback class="text-lg">
                  {{ userInitials }}
                </AvatarFallback>
              </Avatar>
              <Button variant="outline" size="sm">
                {{ t('settings.profile.changePhoto') }}
              </Button>
            </div>
          </CardContent>
        </Card>

        <!-- Nome de Exibição -->
        <Card class="border-2 border-orbit-500/50 hover:border-orbit-500 transition-colors">
          <CardHeader>
            <CardTitle class="text-sm">{{ t('settings.profile.displayName') }}</CardTitle>
          </CardHeader>
          <CardContent>
            <div class="space-y-2">
              <Input 
                v-model="displayName"
                :placeholder="t('settings.profile.displayNamePlaceholder')"
              />
              <p class="text-xs text-muted-foreground">
                {{ t('settings.profile.displayNameHelp') }}
              </p>
            </div>
          </CardContent>
        </Card>

        <!-- Email -->
        <Card class="border-2 border-orbit-500/50 hover:border-orbit-500 transition-colors">
          <CardHeader>
            <CardTitle class="text-sm">{{ t('settings.profile.email') }}</CardTitle>
          </CardHeader>
          <CardContent>
            <div class="space-y-2">
              <Input 
                v-model="email"
                type="email"
                :placeholder="t('settings.profile.emailPlaceholder')"
              />
              <p class="text-xs text-muted-foreground">
                {{ t('settings.profile.emailHelp') }}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <!-- Assinatura de Mensagem -->
      <Card class="w-full mb-6 border border-border hover:border-border/80 transition-colors">
        <CardHeader>
          <CardTitle>{{ t('settings.profile.messageSignature') }}</CardTitle>
          <CardDescription>
            {{ t('settings.profile.messageSignatureDescription') }}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div class="space-y-2">
            <div class="border rounded-lg p-2">
              <!-- Barra de ferramentas do editor -->
              <div class="flex items-center gap-2 mb-2 border-b pb-2">
                <Button variant="ghost" size="sm">
                  <Bold class="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Italic class="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Link2 class="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Image class="h-4 w-4" />
                </Button>
              </div>
              <Textarea 
                v-model="messageSignature"
                :placeholder="t('settings.profile.messageSignaturePlaceholder')"
                rows="4"
              />
            </div>
            <p class="text-xs text-muted-foreground">
              {{ t('settings.profile.messageSignatureHelp') }}
            </p>
          </div>
        </CardContent>
      </Card>

      <!-- Idioma -->
      <Card class="w-full mb-6 border border-border hover:border-border/80 transition-colors">
        <CardHeader>
          <div class="flex items-center gap-2">
            <Globe class="h-5 w-5 text-muted-foreground" />
            <CardTitle>{{ t('settings.language') }}</CardTitle>
          </div>
          <CardDescription>
            {{ t('settings.languageHelp') }}
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <div class="grid w-full items-center gap-1.5">
            <Label for="language">{{ t('settings.selectLanguage') }}</Label>
            <Select 
              id="language"
              v-model="selectedLanguage"
              @update:modelValue="handleLanguageChange"
            >
              <SelectTrigger>
                <SelectValue :placeholder="t('settings.selectLanguage')">
                  {{ languages.find(l => l.code === selectedLanguage)?.name }}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem 
                  v-for="lang in languages" 
                  :key="lang.code"
                  :value="lang.code"
                >
                  {{ lang.name }}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <!-- Botão de Salvar -->
      <div class="flex justify-end">
        <Button @click="saveSettings">
          {{ t('common.save') }}
        </Button>
      </div>
    </div>
  </div>
</template>

<style scoped>
:deep(.select-content) {
  z-index: 50;
}

/* Ajuste para os cards terem a mesma altura */
.grid {
  grid-auto-rows: 1fr;
}

/* Ajuste para hover nos cards com borda cinza */
.border-border:hover {
  border-color: hsl(var(--border) / 0.8);
}
</style>