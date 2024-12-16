<script setup>
import { ref, computed } from 'vue'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { useI18n } from '@/i18n'
import { 
  MessageCircle, 
  X, 
  Phone, 
  Mail, 
  Tag, 
  Clock, 
  CalendarDays,
  Pencil,
  Trash2,
  ChevronRight,
  Target,
  Flag
} from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'

const { t } = useI18n()

const props = defineProps({
  contact: {
    type: Object,
    required: true
  },
  show: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close', 'edit', 'delete'])

// Função para formatar data
function formatDate(date) {
  if (!date) return '-'
  return format(new Date(date), 'dd/MM/yyyy HH:mm', { locale: ptBR })
}

// Função para obter iniciais do nome
function getInitials(name) {
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

// Status do funil traduzido
const funnelStages = computed(() => [
  { id: 'lead', name: t('contacts.details.funnel.stages.lead'), color: 'bg-yellow-500' },
  { id: 'contact', name: t('contacts.details.funnel.stages.contact'), color: 'bg-blue-500' },
  { id: 'negotiation', name: t('contacts.details.funnel.stages.negotiation'), color: 'bg-purple-500' },
  { id: 'proposal', name: t('contacts.details.funnel.stages.proposal'), color: 'bg-pink-500' },
  { id: 'closed', name: t('contacts.details.funnel.stages.closed'), color: 'bg-green-500' }
])

const currentStage = ref('negotiation')

// Mapa de cores para tags
const tagStyles = {
  cliente: 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100',
  lead: 'bg-purple-100 text-purple-800 dark:bg-purple-800 dark:text-purple-100',
  vip: 'bg-pink-100 text-pink-800 dark:bg-pink-800 dark:text-pink-100',
  prospect: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-800 dark:text-indigo-100',
  ativo: 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100',
  inativo: 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100',
  pendente: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100',
  novo: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-800 dark:text-cyan-100',
  retorno: 'bg-orange-100 text-orange-800 dark:bg-orange-800 dark:text-orange-100',
  qualificado: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-800 dark:text-emerald-100',
  indicacao: 'bg-violet-100 text-violet-800 dark:bg-violet-800 dark:text-violet-100',
  site: 'bg-sky-100 text-sky-800 dark:bg-sky-800 dark:text-sky-100',
  evento: 'bg-amber-100 text-amber-800 dark:bg-amber-800 dark:text-amber-100'
}

// Cores de fallback para tags sem estilo definido
const fallbackStyles = [
  'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100',
  'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100',
  'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100',
  'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100',
  'bg-purple-100 text-purple-800 dark:bg-purple-800 dark:text-purple-100',
  'bg-pink-100 text-pink-800 dark:bg-pink-800 dark:text-pink-100',
  'bg-indigo-100 text-indigo-800 dark:bg-indigo-800 dark:text-indigo-100'
]

function getTagStyle(tag) {
  if (!tag) return fallbackStyles[0]
  
  // Normaliza a tag para comparação
  const normalizedTag = tag.toLowerCase().trim()
  
  // Retorna o estilo específico ou gera um baseado no hash da string
  if (tagStyles[normalizedTag]) {
    return tagStyles[normalizedTag]
  }
  
  // Gera um hash consistente para a tag
  const hash = normalizedTag.split('').reduce((acc, char) => {
    return char.charCodeAt(0) + ((acc << 5) - acc)
  }, 0)
  
  // Usa o hash para selecionar uma cor do fallback
  return fallbackStyles[Math.abs(hash) % fallbackStyles.length]
}

// Função para gerar um número aleatório entre min e max
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

// Função para gerar URL do avatar aleatório
function getRandomAvatar() {
  const avatarNumber = getRandomInt(1, 6)
  return `/assets/avatars/${avatarNumber}.png`
}
</script>

<template>
  <Transition
    enter-active-class="transition-all duration-300 ease-out"
    leave-active-class="transition-all duration-300 ease-in"
    enter-from-class="translate-x-full opacity-0"
    enter-to-class="translate-x-0 opacity-100"
    leave-from-class="translate-x-0 opacity-100"
    leave-to-class="translate-x-full opacity-0"
  >
    <div v-if="show" class="fixed inset-0 z-40">
      <!-- Overlay com blur -->
      <div 
        class="absolute inset-0 bg-black/20 backdrop-blur-sm"
        @click="$emit('close')"
      ></div>

      <!-- Sidebar -->
      <div 
        class="contact-details-sidebar absolute right-0 top-0 h-full flex flex-col"
      >
        <!-- Header Fixo -->
        <div class="p-4 border-b bg-card">
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center gap-3">
              <Avatar class="h-10 w-10 ring-2 ring-orbit-500 ring-offset-2 ring-offset-background">
                <AvatarImage 
                  :src="contact.avatar || getRandomAvatar()" 
                  :alt="contact.name" 
                />
                <AvatarFallback class="text-primary font-medium">
                  {{ getInitials(contact.name) }}
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 class="text-lg font-semibold">{{ contact.name }}</h2>
                <p class="text-sm text-muted-foreground">{{ contact.email }}</p>
              </div>
            </div>
            <Button variant="ghost" size="icon" @click="$emit('close')">
              <X class="h-4 w-4" />
            </Button>
          </div>

          <!-- Quick Actions -->
          <div class="flex gap-2">
            <Button class="flex-1">
              <MessageCircle class="h-4 w-4 mr-2" />
              {{ t('contacts.details.startChat') }}
            </Button>
            <Button 
              variant="outline" 
              size="icon" 
              @click="$emit('edit', contact)"
            >
              <Pencil class="h-4 w-4" />
            </Button>
            <Button 
              variant="outline" 
              size="icon" 
              class="text-destructive hover:text-destructive"
              @click="$emit('delete', contact)"
            >
              <Trash2 class="h-4 w-4" />
            </Button>
          </div>
        </div>

        <!-- Conteúdo Scrollável -->
        <ScrollArea class="flex-1">
          <div class="p-4 space-y-6">
            <!-- Funnel Status -->
            <Card>
              <CardHeader>
                <CardTitle class="text-sm font-medium flex items-center gap-2">
                  <Target class="h-4 w-4" />
                  {{ t('contacts.details.funnel.title') }}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div class="space-y-4">
                  <!-- Progress Bar -->
                  <div class="relative h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      v-for="(stage, index) in funnelStages" 
                      :key="stage.id"
                      :class="[
                        'absolute h-full transition-all',
                        stage.color,
                        index <= funnelStages.findIndex(s => s.id === currentStage) ? 'opacity-100' : 'opacity-20'
                      ]"
                      :style="{
                        left: `${(index * 100) / funnelStages.length}%`,
                        width: `${100 / funnelStages.length}%`
                      }"
                    />
                  </div>
                  
                  <!-- Current Stage -->
                  <div class="flex items-center justify-between">
                    <span class="text-sm font-medium">
                      {{ funnelStages.find(s => s.id === currentStage)?.name }}
                    </span>
                    <Button variant="ghost" size="sm">
                      {{ t('contacts.details.funnel.change') }}
                      <ChevronRight class="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <!-- Contact Info -->
            <Card>
              <CardHeader>
                <CardTitle class="text-sm font-medium">
                  {{ t('contacts.details.contactInfo') }}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div class="space-y-4">
                  <div v-if="contact.phone" class="flex items-center gap-2">
                    <Phone class="h-4 w-4 text-muted-foreground" />
                    <a :href="'tel:' + contact.phone" class="text-sm hover:underline">
                      {{ contact.phone }}
                    </a>
                  </div>
                  <div v-if="contact.email" class="flex items-center gap-2">
                    <Mail class="h-4 w-4 text-muted-foreground" />
                    <a :href="'mailto:' + contact.email" class="text-sm hover:underline">
                      {{ contact.email }}
                    </a>
                  </div>
                  <div v-if="contact.tags?.length" class="flex flex-wrap gap-1.5">
                    <Tag class="h-4 w-4 text-muted-foreground" />
                    <span 
                      v-for="tag in contact.tags" 
                      :key="tag"
                      :class="[
                        'px-2 py-0.5 rounded-full text-xs font-medium',
                        getTagStyle(tag)
                      ]"
                    >
                      {{ tag }}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <!-- Notes -->
            <Card>
              <CardHeader>
                <CardTitle class="text-sm font-medium">
                  {{ t('contacts.details.notes.title') }}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p class="text-sm text-muted-foreground">
                  {{ contact.notes || t('contacts.details.notes.empty') }}
                </p>
              </CardContent>
            </Card>

            <!-- History -->
            <Card>
              <CardHeader>
                <CardTitle class="text-sm font-medium flex items-center gap-2">
                  <Clock class="h-4 w-4" />
                  {{ t('contacts.details.history.title') }}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div class="space-y-2 text-sm">
                  <div class="flex items-center justify-between text-muted-foreground">
                    <span>{{ t('contacts.details.history.lastContact') }}</span>
                    <span>{{ formatDate(contact.lastContactedAt) }}</span>
                  </div>
                  <Separator />
                  <div class="flex items-center justify-between text-muted-foreground">
                    <span>{{ t('contacts.details.history.created') }}</span>
                    <span>{{ formatDate(contact.createdAt) }}</span>
                  </div>
                  <Separator />
                  <div class="flex items-center justify-between text-muted-foreground">
                    <span>{{ t('contacts.details.history.updated') }}</span>
                    <span>{{ formatDate(contact.updatedAt) }}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <!-- Goals/Objectives -->
            <Card>
              <CardHeader>
                <CardTitle class="text-sm font-medium flex items-center gap-2">
                  <Flag class="h-4 w-4" />
                  {{ t('contacts.details.goals.title') }}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div class="space-y-2">
                  <div class="flex items-center justify-between">
                    <span class="text-sm text-muted-foreground">
                      {{ t('contacts.details.goals.salesTarget') }}
                    </span>
                    <Badge variant="success">R$ 50.000</Badge>
                  </div>
                  <div class="flex items-center justify-between">
                    <span class="text-sm text-muted-foreground">
                      {{ t('contacts.details.goals.proposals') }}
                    </span>
                    <Badge>3/5</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </ScrollArea>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.contact-details-sidebar {
  width: 384px;
  background-color: hsl(var(--background));
  border-left: 1px solid hsl(var(--border));
  will-change: transform, opacity;
  /* Adiciona uma sombra suave */
  box-shadow: -4px 0 15px rgba(0, 0, 0, 0.1);
}

/* Animação hover nas tags */
[class*="bg-"] {
  @apply transition-all duration-200;
}

[class*="bg-"]:hover {
  filter: brightness(0.95);
  transform: translateY(-1px);
}

/* Efeito de sombra suave */
[class*="bg-"] {
  @apply shadow-sm hover:shadow;
}

/* Animação de entrada das tags */
.tag-enter-active {
  animation: tag-in 0.2s ease-out;
}

@keyframes tag-in {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

/* Animação do overlay */
.transition-all {
  transition-property: all;
}

/* Ajuste para o overlay em modo escuro */
:root[data-theme="dark"] .bg-black\/20 {
  background-color: rgba(0, 0, 0, 0.5);
}
</style> 