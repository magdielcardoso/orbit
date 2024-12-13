<script setup>
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useI18n } from '@/i18n/plugin'
import { 
  Settings, 
  Users, 
  Inbox,
  Tags,
  Puzzle,
  Command,
  MessageSquare,
  Clock,
  Zap,
  FileJson,
  Timer,
  Bell,
  Shield,
  Key,
  MessageCircle,
  Archive,
  Star,
  Mail,
  Flag,
  UserCheck
} from 'lucide-vue-next'
import BetaTag from '../ui/BetaTag.vue'

// Definição das props
const props = defineProps({
  sections: {
    type: Array,
    default: () => [],
    validator: (value) => {
      return value.every(section => {
        return typeof section.id === 'string' &&
               typeof section.label === 'string' &&
               Array.isArray(section.items) &&
               section.items.every(item => {
                 return typeof item.id === 'string' &&
                        typeof item.label === 'string' &&
                        typeof item.icon === 'string'
               })
      })
    }
  }
})

const router = useRouter()
const route = useRoute()
const { t } = useI18n()

const currentSection = ref('settings')

// Mapeamento de ícones disponíveis
const iconMap = {
  Settings,
  Users,
  Inbox,
  Tags,
  Puzzle,
  Command,
  MessageSquare,
  Clock,
  Zap,
  FileJson,
  Timer,
  Bell,
  Shield,
  Key,
  MessageCircle,
  Archive,
  Star,
  Mail,
  Flag,
  UserCheck
}

// Computed property que usa as props ou fallback para dados padrão
const menuItems = computed(() => {
  if (props.sections && props.sections.length > 0) {
    return props.sections.map(section => ({
      ...section,
      items: section.items.map(item => ({
        ...item,
        icon: iconMap[item.icon] || Settings // Fallback para Settings se o ícone não existir
      }))
    }))
  }
  
  // Dados padrão como fallback
  return [
    {
      id: 'team-management',
      label: t('sidebar.teamManagement'),
      items: [
        { 
          id: 'account-settings',
          label: t('sidebar.accountSettings'),
          icon: Settings
        },
        { 
          id: 'agents',
          label: t('sidebar.agents'),
          icon: Users
        },
        { 
          id: 'teams',
          label: t('sidebar.teams'),
          icon: Users
        }
      ]
    },
    {
      id: 'workflow',
      label: t('sidebar.workflow'),
      items: [
        {
          id: 'inbox',
          label: t('sidebar.inbox'),
          icon: Inbox
        },
        {
          id: 'tags',
          label: t('sidebar.tags'),
          icon: Tags
        },
        {
          id: 'custom-fields',
          label: t('sidebar.customFields'),
          icon: Puzzle
        },
        {
          id: 'macros',
          label: t('sidebar.macros'),
          icon: Command
        },
        {
          id: 'canned-responses',
          label: t('sidebar.cannedResponses'),
          icon: MessageSquare
        },
        {
          id: 'audit-logs',
          label: t('sidebar.auditLogs'),
          icon: Clock
        }
      ]
    },
    {
      id: 'advanced-features',
      label: t('sidebar.advancedFeatures'),
      beta: true,
      items: [
        {
          id: 'custom-functions',
          label: t('sidebar.customFunctions'),
          icon: FileJson
        },
        {
          id: 'sla',
          label: t('sidebar.sla'),
          icon: Timer
        }
      ]
    }
  ]
})

const isItemActive = (itemId) => {
  return route.name === itemId
}

const navigate = (itemId) => {
  router.push({ name: itemId })
}
</script>

<template>
  <aside class="w-64 border-r border-base-300 bg-base-100">
    <div class="flex h-full flex-col">
      <!-- Seções do Menu -->
      <div class="flex-1 space-y-2 overflow-y-auto p-4">
        <div v-for="section in menuItems" :key="section.id" class="mb-6">
          <!-- Título da Seção -->
          <div class="mb-2 text-sm font-medium text-base-content/70 text-left pl-3 flex items-center gap-2">
            {{ section.label }}
            <BetaTag v-if="section.beta" />
          </div>

          <!-- Items da Seção -->
          <div class="space-y-1">
            <template v-for="item in section.items" :key="item.id">
              <!-- Regular Item -->
              <button
                @click="navigate(item.id)"
                :class="[
                  'flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors',
                  isItemActive(item.id)
                    ? 'bg-primary/10 text-primary'
                    : 'text-base-content hover:bg-base-200'
                ]"
              >
                <component :is="item.icon" class="h-4 w-4 shrink-0" />
                <span class="leading-tight">{{ item.label }}</span>
              </button>
            </template>
          </div>
        </div>
      </div>
    </div>
  </aside>
</template>

<style scoped>
.beta-tag {
  @apply ml-auto rounded bg-primary/20 px-1.5 py-0.5 text-xs font-medium text-primary;
}
</style> 