<script setup>
import { ref, computed } from 'vue'
import { useI18n } from '@/i18n'
import draggable from 'vuedraggable'
import { 
  Plus, Filter, SortDesc, Calendar, Tag, 
  UserPlus, MoreVertical, Archive, Star,
  AlertOctagon, MessageCircle, Share2,
  Kanban, ChevronDown, Search, X,
  Layout, ListTodo, Users2, Target,
  Layers, Settings, History, FileBarChart,
  PanelLeftClose, PanelLeft, MessageSquare, Command, Zap
} from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu'
import SecondarySidebar from '@/components/layout/SecondarySidebar.vue'

const { t } = useI18n()

// Estado do Kanban com cores melhoradas
const columns = ref([
  {
    id: 'backlog',
    title: 'Backlog',
    color: 'from-gray-500/20 to-gray-600/20',
    borderColor: 'border-gray-500/30',
    iconColor: 'text-gray-600',
    cards: []
  },
  {
    id: 'todo',
    title: 'A Fazer',
    color: 'from-blue-500/20 to-blue-600/20',
    borderColor: 'border-blue-500/30',
    iconColor: 'text-blue-600',
    cards: []
  },
  {
    id: 'in_progress',
    title: 'Em Progresso',
    color: 'from-yellow-500/20 to-yellow-600/20',
    borderColor: 'border-yellow-500/30',
    iconColor: 'text-yellow-600',
    cards: []
  },
  {
    id: 'review',
    title: 'Em Revisão',
    color: 'from-purple-500/20 to-purple-600/20',
    borderColor: 'border-purple-500/30',
    iconColor: 'text-purple-600',
    cards: []
  },
  {
    id: 'done',
    title: 'Concluído',
    color: 'from-green-500/20 to-green-600/20',
    borderColor: 'border-green-500/30',
    iconColor: 'text-green-600',
    cards: []
  }
])

// Mock de dados para exemplo com mais detalhes
const mockCards = [
  {
    id: 1,
    title: 'Implementar autenticação social',
    description: 'Adicionar login com Google e GitHub',
    tags: ['feature', 'priority'],
    dueDate: '2024-04-01',
    priority: 'high',
    members: [
      { id: 1, name: 'John Doe', avatar: '/avatars/john.jpg' },
      { id: 2, name: 'Jane Smith', avatar: '/avatars/jane.jpg' }
    ],
    progress: 75,
    attachments: 2,
    comments: 5
  },
  // ... mais cards
]

// Inicializa as colunas com dados mock
columns.value[0].cards = mockCards

// Função para gerar cor de tag baseada no nome
const getTagColor = (tagName) => {
  const colors = {
    bug: 'bg-red-100 text-red-800 border border-red-200',
    feature: 'bg-blue-100 text-blue-800 border border-blue-200',
    improvement: 'bg-green-100 text-green-800 border border-green-200',
    urgent: 'bg-yellow-100 text-yellow-800 border border-yellow-200',
    priority: 'bg-purple-100 text-purple-800 border border-purple-200',
    default: 'bg-gray-100 text-gray-800 border border-gray-200'
  }
  return colors[tagName.toLowerCase()] || colors.default
}

// Função para gerar cor baseada na prioridade
const getPriorityColor = (priority) => {
  const colors = {
    high: 'text-red-600',
    medium: 'text-yellow-600',
    low: 'text-blue-600'
  }
  return colors[priority] || colors.medium
}

// Funções de drag and drop
const handleDragEnd = (event) => {
  // Atualiza o estado após o drag & drop
  const { removed, added } = event
  if (removed && added) {
    // Aqui você pode fazer chamadas à API para persistir as mudanças
    console.log('Card movido:', { removed, added })
  }
}

// Estado para controlar cards expandidos
const expandedCards = ref(new Set())

// Função para alternar expansão do card
const toggleCard = (cardId) => {
  if (expandedCards.value.has(cardId)) {
    expandedCards.value.delete(cardId)
  } else {
    expandedCards.value.add(cardId)
  }
}

// Computed para verificar se um card está expandido
const isCardExpanded = (cardId) => {
  return expandedCards.value.has(cardId)
}

// Estado para controle da busca
const showSearch = ref(false)
const searchQuery = ref('')

// Função para limpar e fechar busca
const clearSearch = () => {
  searchQuery.value = ''
  showSearch.value = false
}

// Estado do sidebar
const showSidebar = ref(true)

// Configuração das seções do sidebar
const sidebarSections = computed(() => [
  {
    id: 'views',
    label: t('kanban.sidebar.views'),
    items: [
      {
        id: 'board',
        label: t('kanban.sidebar.board'),
        icon: 'MessageSquare'
      },
      {
        id: 'list',
        label: t('kanban.sidebar.list'),
        icon: 'Command'
      }
    ]
  },
  {
    id: 'organization',
    label: t('kanban.sidebar.organization'),
    items: [
      {
        id: 'teams',
        label: t('kanban.sidebar.teams'),
        icon: 'Users'
      },
      {
        id: 'sprints',
        label: t('kanban.sidebar.sprints'),
        icon: 'Clock'
      },
      {
        id: 'backlog',
        label: t('kanban.sidebar.backlog'),
        icon: 'MessageSquare'
      }
    ]
  },
  {
    id: 'management',
    label: t('kanban.sidebar.management'),
    items: [
      {
        id: 'settings',
        label: t('kanban.sidebar.settings'),
        icon: 'Settings'
      },
      {
        id: 'history',
        label: t('kanban.sidebar.history'),
        icon: 'Clock'
      },
      {
        id: 'analytics',
        label: t('kanban.sidebar.analytics'),
        icon: 'Zap',
        beta: true
      }
    ]
  }
])
</script>

<template>
  <div class="flex h-full">
    <!-- Secondary Sidebar -->
    <SecondarySidebar
      :sections="sidebarSections"
      :show-sidebar="showSidebar"
    />

    <div class="p-6 h-full flex flex-col flex-1">
      <!-- Header -->
      <div class="flex justify-between items-center mb-6">
        <div class="flex flex-col">
          <div class="flex items-center gap-2 mb-1">
            <Button 
              variant="ghost"
              size="icon"
              @click="showSidebar = !showSidebar"
            >
              <component 
                :is="showSidebar ? PanelLeftClose : PanelLeft" 
                class="h-4 w-4"
              />
            </Button>
            <h1 class="text-2xl font-semibold">{{ t('kanban.title') }}</h1>
          </div>
          <p class="text-sm text-muted-foreground">
            {{ t('kanban.description') }}
          </p>
        </div>
        
        <!-- Ações -->
        <div class="flex items-center gap-2">
          <!-- Busca Expansível -->
          <div class="relative flex items-center">
            <Button
              v-if="!showSearch"
              variant="outline"
              size="sm"
              @click="showSearch = true"
            >
              <Search class="h-4 w-4" />
            </Button>
            
            <div
              v-else
              class="flex items-center bg-background border rounded-md overflow-hidden animate-in slide-in-from-right-5"
            >
              <Input
                v-model="searchQuery"
                class="h-9 w-[200px] border-0 focus:ring-0 focus:outline-none"
                placeholder="Buscar cards..."
                autofocus
              />
              <Button
                variant="ghost"
                size="sm"
                class="h-9 px-2 hover:bg-muted"
                @click="clearSearch"
              >
                <X class="h-4 w-4" />
              </Button>
            </div>
          </div>

          <Button variant="outline" size="sm">
            <Filter class="h-4 w-4 mr-2" />
            {{ t('kanban.actions.filter') }}
          </Button>
          <Button variant="outline" size="sm">
            <SortDesc class="h-4 w-4 mr-2" />
            {{ t('kanban.actions.sort') }}
          </Button>
          <Button>
            <Plus class="h-4 w-4 mr-2" />
            {{ t('kanban.actions.newTask') }}
          </Button>
        </div>
      </div>

      <!-- Kanban Board -->
      <div class="flex-1 overflow-x-auto overflow-y-hidden">
        <div class="flex gap-4 h-[80vh] w-full min-w-full">
          <div
            v-for="column in columns"
            :key="column.id"
            class="flex flex-col flex-1 h-full"
          >
            <!-- Cabeçalho da Coluna -->
            <div class="flex items-center justify-between mb-3">
              <div class="flex items-center gap-2">
                <div :class="[`bg-gradient-to-br ${column.color}`, 'w-3 h-3 rounded-full border', column.borderColor]"></div>
                <h3 class="font-medium">{{ column.title }}</h3>
                <span class="text-sm text-muted-foreground">({{ column.cards.length }})</span>
              </div>
              <Button variant="ghost" size="sm">
                <Plus class="h-4 w-4" />
              </Button>
            </div>

            <!-- Lista de Cards -->
            <draggable
              v-model="column.cards"
              :group="{ name: 'cards' }"
              item-key="id"
              :class="[
                'flex flex-col gap-2 p-2 rounded-lg border flex-1 overflow-y-auto',
                `bg-gradient-to-br ${column.color}`,
                column.borderColor
              ]"
              @end="handleDragEnd"
            >
              <template #item="{ element: card }">
                <Card 
                  class="bg-card p-3 shadow-sm hover:shadow-md transition-all duration-200 cursor-move group"
                  @click="toggleCard(card.id)"
                >
                  <!-- Header do Card (sempre visível) -->
                  <div class="flex justify-between items-start mb-2">
                    <div class="flex flex-wrap gap-1">
                      <span 
                        v-for="tag in card.tags" 
                        :key="tag"
                        :class="[getTagColor(tag), 'px-2 py-0.5 rounded-full text-xs font-medium']"
                      >
                        {{ tag }}
                      </span>
                    </div>
                    <span :class="[getPriorityColor(card.priority), 'text-xs font-medium']">
                      {{ card.priority }}
                    </span>
                  </div>

                  <!-- Título (sempre visível) -->
                  <div class="flex items-center justify-between">
                    <h4 class="text-sm font-medium group-hover:text-primary transition-colors line-clamp-1">
                      {{ card.title }}
                    </h4>
                    <ChevronDown 
                      class="h-4 w-4 transition-transform duration-200"
                      :class="{ 'rotate-180': isCardExpanded(card.id) }"
                    />
                  </div>

                  <!-- Conteúdo Expansível -->
                  <div 
                    class="overflow-hidden transition-all duration-200"
                    :class="isCardExpanded(card.id) ? 'mt-3' : 'h-0'"
                  >
                    <!-- Descrição -->
                    <p class="text-sm text-muted-foreground mb-3">
                      {{ card.description }}
                    </p>

                    <!-- Progress Bar -->
                    <div v-if="card.progress" class="w-full h-1 bg-muted rounded-full mb-3">
                      <div 
                        class="h-full bg-primary rounded-full transition-all duration-300"
                        :style="{ width: `${card.progress}%` }"
                      />
                    </div>

                    <!-- Footer -->
                    <div class="flex items-center justify-between">
                      <div class="flex -space-x-2">
                        <Avatar
                          v-for="member in card.members"
                          :key="member.id"
                          class="w-6 h-6 border-2 border-background transition-transform hover:scale-110"
                        >
                          <AvatarImage :src="member.avatar" />
                          <AvatarFallback>{{ member.name.charAt(0) }}</AvatarFallback>
                        </Avatar>
                        <Button variant="ghost" size="sm" class="w-6 h-6 rounded-full ml-1">
                          <UserPlus class="h-3 w-3" />
                        </Button>
                      </div>

                      <div class="flex items-center gap-3">
                        <!-- Metadados -->
                        <div class="flex items-center gap-2 text-muted-foreground">
                          <span v-if="card.attachments" class="text-xs flex items-center gap-1">
                            <i class="i-lucide-paperclip h-3 w-3" />
                            {{ card.attachments }}
                          </span>
                          <span v-if="card.comments" class="text-xs flex items-center gap-1">
                            <i class="i-lucide-message-circle h-3 w-3" />
                            {{ card.comments }}
                          </span>
                        </div>

                        <!-- Data -->
                        <span class="text-xs text-muted-foreground flex items-center gap-1">
                          <Calendar class="h-3 w-3" />
                          {{ card.dueDate }}
                        </span>

                        <!-- Menu -->
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreVertical class="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuItem>
                              <Star class="h-4 w-4 mr-2" />
                              Favoritar
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Tag class="h-4 w-4 mr-2" />
                              Adicionar Tag
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Archive class="h-4 w-4 mr-2" />
                              Arquivar
                            </DropdownMenuItem>
                            <DropdownMenuItem class="text-destructive">
                              <AlertOctagon class="h-4 w-4 mr-2" />
                              Excluir
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </div>
                </Card>
              </template>
            </draggable>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Estilização do scroll horizontal */
.overflow-x-auto {
  scrollbar-width: thin;
  scrollbar-color: hsl(var(--primary)) transparent;
}

.overflow-x-auto::-webkit-scrollbar {
  height: 6px;
}

.overflow-x-auto::-webkit-scrollbar-track {
  background: transparent;
}

.overflow-x-auto::-webkit-scrollbar-thumb {
  background-color: hsl(var(--primary));
  border-radius: 3px;
}

/* Estilização do scroll vertical das colunas */
[role="group"] {
  scrollbar-width: thin;
  scrollbar-color: hsl(var(--primary)) transparent;
}

[role="group"]::-webkit-scrollbar {
  width: 4px;
}

[role="group"]::-webkit-scrollbar-track {
  background: transparent;
}

[role="group"]::-webkit-scrollbar-thumb {
  background-color: hsl(var(--primary)/0.3);
  border-radius: 3px;
}

[role="group"]:hover::-webkit-scrollbar-thumb {
  background-color: hsl(var(--primary)/0.5);
}

/* Animação de hover nos cards */
.card {
  transition: all 0.2s ease;
}

.card:hover {
  transform: translateY(-2px);
}

/* Estilo de drag */
.sortable-ghost {
  opacity: 0.5;
  background: hsl(var(--primary)/0.1);
  @apply border-2 border-dashed border-primary;
}

.sortable-chosen {
  cursor: grabbing;
  @apply shadow-lg;
}

/* Animação de entrada dos cards */
.card {
  animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Garante que as colunas tenham larguras iguais */
.flex-1 {
  min-width: 0; /* Permite que flex-1 funcione corretamente */
}

/* Animação suave para expansão/colapso */
.overflow-hidden {
  will-change: height;
}

/* Previne seleção de texto ao clicar para expandir */
.card {
  user-select: none;
}

/* Permite seleção de texto dentro do conteúdo expandido */
.card p, 
.card span {
  user-select: text;
}

/* Animações para o input de busca */
.animate-in {
  animation: slideIn 0.2s ease-out;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(10px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

/* Ajuste do input de busca */
input:focus {
  box-shadow: none;
  border-color: transparent;
  outline: none !important;
}

/* Remove o outline em todos os estados */
input {
  @apply focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:outline-none;
}
</style>