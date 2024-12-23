<template>
    <div class="p-4 border-b border-orbit-200/50">
      <!-- Cabeçalho com botão de expandir/colapsar -->
      <div 
        class="flex items-center justify-between mb-4 cursor-pointer"
        @click="toggleExpanded"
      >
        <div class="flex items-center gap-2">
          <ChevronRight
            :class="[
              'h-4 w-4 transition-transform duration-200',
              isExpanded ? 'rotate-90' : ''
            ]"
          />
          <h3 class="font-medium text-base-content/80 text-sm">{{ t('contacts.quickContacts') }}</h3>
        </div>
        <div class="flex gap-2">
          <button class="btn btn-ghost btn-sm px-2" @click.stop>
            <Search class="h-4 w-4" />
          </button>
          <button 
            class="btn btn-ghost btn-sm px-2"
            @click.stop="showNewContactModal = true"
          >
            <Plus class="h-4 w-4" />
          </button>
        </div>
      </div>
  
      <!-- Conteúdo expansível -->
      <div 
        v-show="isExpanded"
        class="transition-all duration-200"
      >
        <!-- Barra de Pesquisa -->
        <div class="relative mb-4">
          <Search class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-base-content/50" />
          <input
            type="text"
            :placeholder="t('contacts.searchPlaceholder')"
            class="input input-bordered w-full pl-10 h-9 text-sm"
          />
        </div>
  
        <!-- Botões de Ação -->
        <div class="flex gap-2 mb-4">
          <button class="flex-1 btn btn-primary btn-sm gap-2 text-xs">
            <Calendar class="h-3.5 w-3.5" />
            {{ t('contacts.actions.meeting') }}
          </button>
          <button class="flex-1 btn btn-ghost btn-sm gap-2 text-xs border-orbit-300 border-dashed hover:border-solid">
            <Clock class="h-3.5 w-3.5" />
            {{ t('contacts.actions.schedule') }}
          </button>
        </div>
  
        <!-- Lista de Contatos -->
        <div class="space-y-1">
          <div v-for="contact in contacts" :key="contact.id" 
            class="flex items-center gap-3 p-2 rounded-lg hover:bg-orbit-100/10 cursor-pointer relative transition-colors duration-200"
          >
            <!-- Avatar com Status -->
            <div class="relative">
              <UserAvatar 
                :name="contact.name"
                :avatar="contact.avatar"
                size="sm"
              />
              <span 
                :class="[
                  'absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-base-100',
                  contact.online ? 'bg-success' : 'bg-base-300'
                ]"
              />
            </div>
  
            <!-- Info do Contato -->
            <div class="flex-1 min-w-0">
              <div class="font-medium truncate text-sm">{{ contact.name }}</div>
              <div class="text-xs text-base-content/60 truncate">{{ contact.status }}</div>
            </div>
  
            <!-- Indicadores -->
            <div class="flex items-center gap-2">
              <Badge v-if="contact.unread" variant="primary" class="h-5 min-w-5 flex items-center justify-center">
                {{ contact.unread }}
              </Badge>
              <button v-if="contact.online" class="btn btn-ghost btn-xs px-2">
                <MessageSquare class="h-3.5 w-3.5 text-orbit-500" />
              </button>
            </div>
          </div>
        </div>
      </div>
  
      <!-- Modal de Novo Contato -->
      <Dialog v-model:open="showNewContactModal">
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{{ t('contacts.newContact') }}</DialogTitle>
          </DialogHeader>
          
          <form @submit.prevent="handleCreateContact" class="space-y-4">
            <div class="space-y-2">
              <Label for="name">{{ t('contacts.form.name') }}</Label>
              <Input
                id="name"
                v-model="newContact.name"
                type="text"
                required
                :placeholder="t('contacts.form.namePlaceholder')"
              />
            </div>
  
            <div class="space-y-2">
              <Label for="email">{{ t('contacts.form.email') }}</Label>
              <Input
                id="email"
                v-model="newContact.email"
                type="email"
                :placeholder="t('contacts.form.emailPlaceholder')"
              />
            </div>
  
            <div class="space-y-2">
              <Label for="phone">{{ t('contacts.form.phone') }}</Label>
              <Input
                id="phone"
                v-model="newContact.phone"
                type="tel"
                :placeholder="t('contacts.form.phonePlaceholder')"
              />
            </div>
  
            <div class="space-y-2">
              <Label for="tags">{{ t('contacts.form.tags') }}</Label>
              <Input
                id="tags"
                v-model="newContact.tags"
                :placeholder="t('contacts.form.tagsPlaceholder')"
              />
            </div>
  
            <div class="space-y-2">
              <Label for="notes">{{ t('contacts.form.notes') }}</Label>
              <Textarea
                id="notes"
                v-model="newContact.notes"
                rows="3"
                :placeholder="t('contacts.form.notesPlaceholder')"
              />
            </div>
          </form>
  
          <DialogFooter>
            <Button variant="outline" @click="showNewContactModal = false">
              {{ t('common.cancel') }}
            </Button>
            <Button 
              type="submit" 
              :disabled="loading"
              @click="handleCreateContact"
            >
              {{ loading ? t('common.loading') : t('common.save') }}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  import { Plus, Search, Calendar, Clock, MessageSquare, ChevronRight } from 'lucide-vue-next'
  import { useI18n } from '@/i18n/plugin'
  import UserAvatar from '@/components/chats/UserAvatar.vue'
  import Badge from './badge/Badge.vue'
  import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from './dialog'
  import { Button } from './button'
  import { Input } from './input'
  import { Label } from './label'
  import { Textarea } from './textarea'
  import { showToast } from '@/utils/toast'
  import { useAuthStore } from '@/stores/auth.store'
  import { gqlRequest } from '@/utils/graphql'
  
  const { t } = useI18n()
  const authStore = useAuthStore()
  
  // Estado
  const showNewContactModal = ref(false)
  const loading = ref(false)
  const newContact = ref({
    name: '',
    email: '',
    phone: '',
    tags: '',
    notes: ''
  })
  
  // Adicione o estado para controlar a expansão
  const isExpanded = ref(true)
  
  // Função para alternar o estado expandido
  const toggleExpanded = () => {
    isExpanded.value = !isExpanded.value
  }
  
  // Função para criar novo contato
  async function handleCreateContact() {
    try {
      if (!newContact.value.name) {
        showToast(t('contacts.errors.nameRequired'), 'error')
        return
      }
  
      loading.value = true
      
      const input = {
        name: newContact.value.name.trim(),
        email: newContact.value.email ? newContact.value.email.trim() : null,
        phone: newContact.value.phone && newContact.value.phone.trim() !== '' 
          ? newContact.value.phone.trim() 
          : null,
        tags: newContact.value.tags 
          ? newContact.value.tags.split(',').map(tag => tag.trim()).filter(Boolean)
          : [],
        notes: newContact.value.notes ? newContact.value.notes.trim() : null,
        organizationId: authStore.currentOrganization.id
      }
  
      const mutation = `
        mutation CreateContact($input: ContactInput!) {
          createContact(input: $input) {
            id
            name
            email
            phone
            tags
            notes
            lastContactedAt
            createdAt
            updatedAt
          }
        }
      `
  
      await gqlRequest(mutation, { input })
      showNewContactModal.value = false
      newContact.value = { name: '', email: '', phone: '', tags: '', notes: '' }
      showToast(t('contacts.createSuccess'))
      
      // Emite evento para atualizar a lista de contatos
      emit('contact-created')
    } catch (error) {
      console.error('Erro ao criar contato:', error)
      if (error.message.includes('Unique constraint failed')) {
        showToast(t('contacts.errors.duplicateContact'), 'error')
      } else {
        showToast(error.message, 'error')
      }
    } finally {
      loading.value = false
    }
  }
  
  const emit = defineEmits(['contact-created'])
  
  // Mock de dados - depois virá de uma store
  const contacts = [
    {
      id: 1,
      name: 'Jonathan',
      status: 'Online',
      online: true,
      unread: 2
    },
    {
      id: 2,
      name: 'Elizabeth Jun',
      status: 'In meeting',
      online: true
    },
    {
      id: 3,
      name: 'Kevin',
      status: 'Last seen 2h ago',
      online: false
    },
    {
      id: 4,
      name: 'Michael Swan',
      status: 'Offline',
      online: false
    }
  ]
  </script>
  
  <style scoped>
  .input {
    @apply bg-base-200/50 border-base-300;
  }
  
  .input:focus {
    @apply border-orbit-500;
  }
  
  .btn-primary {
    @apply bg-orbit-500 border-orbit-600 hover:bg-orbit-600;
  }
  
  /* Estilo específico para o botão Schedule */
  .btn-ghost {
    @apply border border-dashed;
  }
  
  .btn-ghost:hover {
    @apply border-solid bg-orbit-100/10 text-orbit-500;
  }
  
  /* Adicione animação suave para o ícone de chevron */
  .rotate-90 {
    transform: rotate(90deg);
  }
  </style> 