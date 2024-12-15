<script setup>
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

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
</script>

<template>
  <Transition
    enter-active-class="transition-all duration-300 ease-in-out"
    leave-active-class="transition-all duration-300 ease-in-out"
    enter-from-class="translate-x-full"
    enter-to-class="translate-x-0"
    leave-from-class="translate-x-0"
    leave-to-class="translate-x-full"
  >
    <div 
      v-show="show"
      class="w-96 border-l border-base-300 bg-base-100 overflow-y-auto flex flex-col h-full shrink-0"
    >
      <!-- Cabeçalho -->
      <div class="p-4 border-b border-base-300">
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center">
            <div v-if="contact.avatar" class="h-10 w-10 flex-shrink-0">
              <img :src="contact.avatar" :alt="contact.name" class="h-10 w-10 rounded-full" />
            </div>
            <div v-else class="h-10 w-10 rounded-full bg-orbit-100 flex items-center justify-center">
              <span class="text-orbit-600 font-medium">{{ getInitials(contact.name) }}</span>
            </div>
            <div class="ml-3">
              <h2 class="text-lg font-medium text-base-content">{{ contact.name }}</h2>
              <p class="text-sm text-base-content/70">{{ contact.email }}</p>
            </div>
          </div>
          <button @click="$emit('close')" class="text-base-content/70 hover:text-base-content">
            <span class="sr-only">Fechar</span>
            <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
            </svg>
          </button>
        </div>

        <!-- Botões de Ação -->
        <div class="flex gap-2">
          <button class="btn btn-sm btn-primary flex-1">Iniciar Conversa</button>
          <button @click="$emit('edit', contact)" class="btn btn-sm btn-ghost">Editar</button>
          <button @click="$emit('delete', contact)" class="btn btn-sm btn-ghost text-error">Excluir</button>
        </div>
      </div>

      <!-- Blocos de Informação -->
      <div class="p-4 space-y-6">
        <!-- Bloco de Ações do Kanban -->
        <div class="space-y-2">
          <h3 class="text-sm font-medium text-base-content/70">Ações do Kanban</h3>
          <div class="bg-base-200 rounded-lg p-4">
            <div class="space-y-4">
              <div>
                <h4 class="text-sm font-medium">Funil</h4>
                <button class="btn btn-sm btn-ghost w-full justify-start mt-1">
                  <span class="text-base-content/70">Definir funil</span>
                </button>
              </div>
              <div>
                <h4 class="text-sm font-medium">Status</h4>
                <div class="bg-info/10 text-info rounded p-2 mt-1">
                  <span class="text-sm">Negociação</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Bloco de Informações de Contato -->
        <div class="space-y-2">
          <h3 class="text-sm font-medium text-base-content/70">Informações de Contato</h3>
          <div class="space-y-3">
            <div v-if="contact.phone" class="flex items-center gap-2">
              <span class="text-base-content/70">Telefone:</span>
              <a :href="'tel:' + contact.phone" class="text-primary">{{ contact.phone }}</a>
            </div>
            <div v-if="contact.email" class="flex items-center gap-2">
              <span class="text-base-content/70">Email:</span>
              <a :href="'mailto:' + contact.email" class="text-primary">{{ contact.email }}</a>
            </div>
            <div v-if="contact.tags?.length" class="flex flex-wrap gap-1">
              <span 
                v-for="tag in contact.tags" 
                :key="tag"
                class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-orbit-100 text-orbit-800"
              >
                {{ tag }}
              </span>
            </div>
          </div>
        </div>

        <!-- Bloco de Notas -->
        <div class="space-y-2">
          <h3 class="text-sm font-medium text-base-content/70">Notas</h3>
          <p class="text-sm text-base-content/70">{{ contact.notes || 'Nenhuma nota adicionada' }}</p>
        </div>

        <!-- Bloco de Histórico -->
        <div class="space-y-2">
          <h3 class="text-sm font-medium text-base-content/70">Histórico</h3>
          <div class="text-sm text-base-content/70">
            <p>Último contato: {{ formatDate(contact.lastContactedAt) || 'Nunca contatado' }}</p>
            <p>Criado em: {{ formatDate(contact.createdAt) }}</p>
            <p>Atualizado em: {{ formatDate(contact.updatedAt) }}</p>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template> 