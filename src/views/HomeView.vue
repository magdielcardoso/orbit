<template>
  <div class="min-h-screen bg-background">
    <main class="py-4 md:py-10">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Seção de Boas-vindas -->
        <Card class="mb-4 md:mb-6 border-2 border-orbit-500">
          <CardContent class="p-4 md:p-6">
            <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 md:gap-0">
              <div class="flex items-center space-x-4">
                <Avatar class="w-10 h-10 ring-2 ring-orbit-500 ring-offset-2">
                  <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" />
                  <AvatarFallback>AV</AvatarFallback>
                </Avatar>
                <div>
                  <h1 class="text-xl md:text-2xl font-semibold text-foreground flex items-center gap-2">
                    Bem-vindo ao OrbitChat 
                    <span>👋</span>
                  </h1>
                  <p class="mt-1 md:mt-2 text-muted-foreground">
                    Olá, {{ authStore.user?.name }}!
                  </p>
                </div>
              </div>
              <div class="text-left md:text-right">
                <p class="text-sm text-muted-foreground">{{ getCurrentDateTime() }}</p>
                <Badge :variant="isOnline ? 'default' : 'destructive'" class="text-xs">
                  {{ isOnline ? 'Online' : 'Offline' }}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <!-- Cards de Estatísticas -->
        <div class="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 mb-4 md:mb-6">
          <Card v-for="stat in statistics" :key="stat.title">
            <CardContent class="p-4 md:p-6">
              <div class="flex items-center">
                <div :class="stat.iconClass" class="rounded-md p-2 md:p-3">
                  <component :is="stat.icon" class="h-4 w-4 md:h-5 md:w-5" />
                </div>
                <div class="ml-3 md:ml-4">
                  <p class="text-xs md:text-sm font-medium text-muted-foreground">{{ stat.title }}</p>
                  <p class="text-lg md:text-2xl font-semibold text-foreground">{{ stat.value }}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <!-- Conversas Ativas -->
        <Card class="mb-4 md:mb-6">
          <CardContent class="p-4 md:p-6">
            <div class="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-3 md:gap-0">
              <h2 class="text-lg font-medium text-foreground">Conversas Ativas</h2>
              <div class="flex gap-2 overflow-x-auto md:overflow-visible">
                <Button variant="ghost" size="sm" class="whitespace-nowrap">
                  <Filter class="h-4 w-4" />
                  <span class="hidden md:inline ml-2">Filtrar</span>
                </Button>
                <Button variant="ghost" size="sm" class="whitespace-nowrap">
                  <SortAsc class="h-4 w-4" />
                  <span class="hidden md:inline ml-2">Ordenar</span>
                </Button>
                <Button variant="default" size="sm" class="whitespace-nowrap">
                  <Plus class="h-4 w-4" />
                  <span class="hidden md:inline ml-2">Nova Conversa</span>
                </Button>
              </div>
            </div>

            <div class="space-y-3 md:space-y-4">
              <div v-for="chat in activeChats" :key="chat.id" 
                class="flex flex-col md:flex-row md:items-center justify-between p-3 md:p-4 border rounded-lg hover:bg-accent/50 transition-colors duration-200 relative gap-3 md:gap-0">
                <!-- Badge de não lidas -->
                <Badge v-if="chat.unread" variant="default" class="absolute -top-2 -right-2">
                  {{ chat.unread }}
                </Badge>

                <!-- Informações do Chat -->
                <div class="flex items-start space-x-4">
                  <Avatar>
                    <AvatarImage :src="chat.avatar" />
                    <AvatarFallback>{{ chat.initials }}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 class="font-medium text-foreground">{{ chat.name }}</h3>
                    <p class="text-sm text-muted-foreground">{{ chat.lastMessage }}</p>
                  </div>
                </div>

                <!-- Ações Rápidas -->
                <div class="flex items-center gap-2 md:ml-4 justify-end">
                  <Button variant="ghost" size="icon" class="h-8 w-8">
                    <MessageCircle class="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" class="h-8 w-8">
                    <Share2 class="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" class="hidden md:flex h-8 w-8">
                    <Archive class="h-4 w-4" />
                  </Button>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" class="h-8 w-8">
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
                      <DropdownMenuItem class="md:hidden">
                        <Archive class="h-4 w-4 mr-2" />
                        Arquivar
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <AlertOctagon class="h-4 w-4 mr-2" />
                        Reportar
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <!-- Canais de Atendimento -->
        <Card>
          <CardContent class="p-4 md:p-6">
            <h2 class="text-lg font-medium text-foreground mb-4">Canais de Atendimento</h2>
            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
              <div v-for="channel in channels" :key="channel.name" 
                class="border rounded-lg p-3 md:p-4 hover:bg-accent/50 transition-colors duration-200">
                <div class="flex items-center justify-between">
                  <div class="flex items-center">
                    <component :is="channel.icon" class="h-5 w-5 md:h-6 md:w-6" :class="channel.iconClass" />
                    <span class="ml-2 font-medium text-sm md:text-base">{{ channel.name }}</span>
                  </div>
                  <Badge :variant="channel.status === 'Conectado' ? 'default' : 'destructive'" class="text-xs">
                    {{ channel.status }}
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth.store'
import { 
  MessageCircle, 
  Share2, 
  Archive, 
  Star, 
  Tag, 
  AlertOctagon, 
  Plus, 
  Filter, 
  SortAsc, 
  MoreVertical,
  Clock,
  Heart,
  Users,
  Phone,
  Instagram,
  Send
} from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu'

const authStore = useAuthStore()
const isOnline = ref(true)

const statistics = [
  {
    title: 'Conversas Hoje',
    value: '24',
    icon: MessageCircle,
    iconClass: 'bg-blue-100 text-blue-600'
  },
  {
    title: 'Tempo Médio Resposta',
    value: '5min',
    icon: Clock,
    iconClass: 'bg-green-100 text-green-600'
  },
  {
    title: 'Satisfação',
    value: '98%',
    icon: Heart,
    iconClass: 'bg-red-100 text-red-600'
  },
  {
    title: 'Atendimentos',
    value: '156',
    icon: Users,
    iconClass: 'bg-purple-100 text-purple-600'
  }
]

const activeChats = [
  {
    id: 1,
    name: 'João Silva',
    avatar: null,
    initials: 'JS',
    lastMessage: 'Preciso de ajuda com meu pedido',
    channel: 'WhatsApp',
    channelClass: 'bg-green-100 text-green-800',
    time: '5min',
    unread: 3
  },
  {
    id: 2,
    name: 'Maria Oliveira',
    avatar: null,
    initials: 'MO',
    lastMessage: 'Como faço para trocar o produto?',
    channel: 'Instagram',
    channelClass: 'bg-pink-100 text-pink-800',
    time: '12min',
    unread: 1
  }
]

const channels = [
  {
    name: 'WhatsApp',
    icon: Phone,
    iconClass: 'text-green-600',
    status: 'Conectado'
  },
  {
    name: 'Instagram',
    icon: Instagram,
    iconClass: 'text-pink-600',
    status: 'Conectado'
  },
  {
    name: 'Telegram',
    icon: Send,
    iconClass: 'text-blue-600',
    status: 'Desconectado'
  }
]

function getCurrentDateTime() {
  const now = new Date()
  const diasDaSemana = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado']
  const diaDaSemana = diasDaSemana[now.getDay()]
  
  const dia = now.getDate().toString().padStart(2, '0')
  const mes = (now.getMonth() + 1).toString().padStart(2, '0')
  const hora = now.getHours().toString().padStart(2, '0')
  const minutos = now.getMinutes().toString().padStart(2, '0')
  
  return `${diaDaSemana}, ${dia}/${mes} às ${hora}:${minutos}`
}
</script>

<style scoped>
.dropdown-content {
  @apply z-50;
}

/* Ajustes para mobile */
@media (max-width: 768px) {
  .tooltip:before {
    display: none;
  }
}
</style> 