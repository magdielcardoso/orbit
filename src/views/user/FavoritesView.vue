<script setup>
import { ref, computed } from 'vue'
import { Star, MessageCircle, Clock, MoreVertical, Search } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { useAuthStore } from '@/stores/auth.store'

const authStore = useAuthStore()

// Mock de dados para favoritos
const favorites = ref([
  {
    id: 1,
    title: 'Suporte Técnico #1234',
    description: 'Problema com integração WhatsApp',
    lastMessage: 'Consegui resolver o problema, obrigado!',
    timestamp: '2 horas atrás',
    status: 'Resolvido',
    channel: 'WhatsApp',
    messages: 12
  },
  {
    id: 2,
    title: 'Dúvida sobre Planos #5678',
    description: 'Cliente interessado no plano enterprise',
    lastMessage: 'Vou analisar a proposta e retorno em breve',
    timestamp: '5 horas atrás',
    status: 'Em andamento',
    channel: 'Email',
    messages: 8
  }
])

const searchQuery = ref('')

const filteredFavorites = computed(() => {
  if (!searchQuery.value) return favorites.value
  
  const query = searchQuery.value.toLowerCase()
  return favorites.value.filter(item => 
    item.title.toLowerCase().includes(query) ||
    item.description.toLowerCase().includes(query)
  )
})

function removeFavorite(id) {
  favorites.value = favorites.value.filter(item => item.id !== id)
}

function handleAction(action, item) {
  switch(action) {
    case 'view':
      // Implementar visualização
      break
    case 'archive':
      // Implementar arquivamento
      break
    case 'delete':
      removeFavorite(item.id)
      break
  }
}
</script>

<template>
  <div class="p-6 max-w-7xl mx-auto">
    <!-- Header -->
    <div class="flex justify-between items-center mb-6">
      <div>
        <h1 class="text-2xl font-semibold text-foreground">Conversas Favoritas</h1>
        <p class="text-muted-foreground mt-1">
          Gerencie suas conversas importantes e marcadas como favoritas
        </p>
      </div>
      <Button variant="outline" class="gap-2">
        <Star class="h-4 w-4" />
        Adicionar Favorito
      </Button>
    </div>

    <!-- Barra de Pesquisa -->
    <div class="relative mb-6">
      <Search class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        v-model="searchQuery"
        type="search"
        placeholder="Buscar nos favoritos..."
        class="pl-10"
      />
    </div>

    <!-- Grid de Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <Card v-for="item in filteredFavorites" :key="item.id" class="group">
        <CardHeader>
          <div class="flex justify-between items-start">
            <div>
              <CardTitle class="text-lg">{{ item.title }}</CardTitle>
              <CardDescription class="mt-1">{{ item.description }}</CardDescription>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" class="opacity-0 group-hover:opacity-100">
                  <MoreVertical class="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem @click="handleAction('view', item)">
                  Visualizar
                </DropdownMenuItem>
                <DropdownMenuItem @click="handleAction('archive', item)">
                  Arquivar
                </DropdownMenuItem>
                <DropdownMenuItem @click="handleAction('delete', item)" class="text-destructive">
                  Remover
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>
        
        <CardContent>
          <p class="text-sm text-muted-foreground line-clamp-2">
            {{ item.lastMessage }}
          </p>
          
          <div class="flex items-center gap-4 mt-4">
            <div class="flex items-center gap-1 text-sm text-muted-foreground">
              <MessageCircle class="h-4 w-4" />
              <span>{{ item.messages }}</span>
            </div>
            <div class="flex items-center gap-1 text-sm text-muted-foreground">
              <Clock class="h-4 w-4" />
              <span>{{ item.timestamp }}</span>
            </div>
          </div>
        </CardContent>

        <CardFooter class="flex justify-between">
          <div class="flex items-center gap-2">
            <span class="text-xs px-2 py-1 rounded-full bg-secondary text-secondary-foreground">
              {{ item.channel }}
            </span>
            <span class="text-xs px-2 py-1 rounded-full bg-secondary text-secondary-foreground">
              {{ item.status }}
            </span>
          </div>
        </CardFooter>
      </Card>
    </div>

    <!-- Estado vazio -->
    <div v-if="filteredFavorites.length === 0" class="text-center py-12">
      <Star class="h-12 w-12 mx-auto text-muted-foreground/50" />
      <h3 class="mt-4 text-lg font-medium text-foreground">Nenhum favorito encontrado</h3>
      <p class="mt-1 text-sm text-muted-foreground">
        Comece adicionando conversas aos seus favoritos
      </p>
      <Button variant="outline" class="mt-4">
        Adicionar Primeiro Favorito
      </Button>
    </div>
  </div>
</template>

<style scoped>
.group {
  @apply transition-all duration-200;
}

.group:hover {
  @apply shadow-md;
}
</style> 