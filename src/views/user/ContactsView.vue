<template>
  <div class="flex h-full overflow-hidden">
    <SecondarySidebar 
      :sections="sidebarSections" 
      :show-sidebar="showSecondarySidebar"
    />
    <div class="flex-1 flex overflow-hidden">
      <div class="flex-1 p-6 overflow-y-auto">
        <div class="sm:flex sm:items-center">
          <div class="sm:flex-auto">
            <div class="flex items-center gap-3">
              <Button 
                variant="ghost"
                size="icon"
                @click="showSecondarySidebar = !showSecondarySidebar"
              >
                <component 
                  :is="showSecondarySidebar ? PanelLeftClose : PanelLeft" 
                  class="h-4 w-4"
                />
              </Button>
              <h1 class="text-2xl font-semibold text-foreground">
                {{ t('contacts.title') }}
              </h1>
            </div>
            <p class="mt-2 text-sm text-muted-foreground">
              {{ t('contacts.description') }}
            </p>
          </div>
          <div class="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
            <Button @click="showNewContactModal = true">
              <Plus class="h-4 w-4 mr-2" />
              {{ t('contacts.addContact') }}
            </Button>
          </div>
        </div>

        <!-- Loading state -->
        <div v-if="loading" class="flex justify-center items-center py-8">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>

        <!-- Empty state -->
        <div v-else-if="!contacts.length" class="text-center py-8">
          <p class="text-muted-foreground">{{ t('contacts.noContacts') }}</p>
        </div>

        <!-- Contacts Table -->
        <div v-else class="mt-8 rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{{ t('contacts.table.name') }}</TableHead>
                <TableHead>{{ t('contacts.table.email') }}</TableHead>
                <TableHead>{{ t('contacts.table.phone') }}</TableHead>
                <TableHead>{{ t('contacts.table.lastContact') }}</TableHead>
                <TableHead class="text-right">{{ t('common.actions') }}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow v-for="contact in contacts" :key="contact.id">
                <TableCell>
                  <div class="flex items-center cursor-pointer" @click="handleContactClick(contact)">
                    <Avatar class="h-8 w-8 ring-2 ring-orbit-500 ring-offset-2 ring-offset-background">
                      <AvatarImage 
                        :src="contact.avatar || getRandomAvatar()" 
                        :alt="contact.name" 
                      />
                      <AvatarFallback class="text-primary font-medium">
                        {{ getInitials(contact.name) }}
                      </AvatarFallback>
                    </Avatar>
                    <div class="ml-4">
                      <div class="font-medium">{{ contact.name }}</div>
                      <div v-if="contact.tags?.length" class="mt-1 flex flex-wrap gap-1.5">
                        <span 
                          v-for="tag in contact.tags" 
                          :key="tag"
                          :class="[
                            'px-2 py-0.5 rounded-full text-xs font-medium transition-all duration-200 shadow-sm hover:shadow',
                            getTagStyle(tag)
                          ]"
                        >
                          {{ tag }}
                        </span>
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{{ contact.email }}</TableCell>
                <TableCell>{{ contact.phone }}</TableCell>
                <TableCell>{{ formatDate(contact.lastContactedAt) }}</TableCell>
                <TableCell class="text-right space-x-2">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    @click.stop="editContact(contact)"
                    class="hover:bg-accent/50"
                  >
                    <Pencil class="h-4 w-4 mr-2" />
                    {{ t('contacts.details.actions.edit') }}
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    @click.stop="deleteContact(contact)"
                    class="hover:bg-destructive/10 hover:text-destructive"
                  >
                    <Trash2 class="h-4 w-4 mr-2" />
                    {{ t('contacts.details.actions.delete') }}
                  </Button>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>

        <!-- New Contact Dialog -->
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

        <!-- Edit Contact Dialog -->
        <Dialog v-model:open="showEditModal">
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{{ t('contacts.editContact') }}</DialogTitle>
              <DialogDescription>
                {{ t('contacts.form.editDescription') }}
              </DialogDescription>
            </DialogHeader>
            
            <form v-if="editingContact" @submit.prevent="handleUpdateContact" class="space-y-4">
              <div class="space-y-2">
                <Label for="edit-name">{{ t('contacts.form.name') }}</Label>
                <Input
                  id="edit-name"
                  v-model="editingContact.name"
                  type="text"
                  required
                  :placeholder="t('contacts.form.namePlaceholder')"
                />
              </div>

              <div class="space-y-2">
                <Label for="edit-email">{{ t('contacts.form.email') }}</Label>
                <Input
                  id="edit-email"
                  v-model="editingContact.email"
                  type="email"
                  :placeholder="t('contacts.form.emailPlaceholder')"
                />
              </div>

              <div class="space-y-2">
                <Label for="edit-phone">{{ t('contacts.form.phone') }}</Label>
                <Input
                  id="edit-phone"
                  v-model="editingContact.phone"
                  type="tel"
                  :placeholder="t('contacts.form.phonePlaceholder')"
                />
              </div>

              <div class="space-y-2">
                <Label for="edit-tags">{{ t('contacts.form.tags') }}</Label>
                <Input
                  id="edit-tags"
                  v-model="editingContact.tags"
                  :placeholder="t('contacts.form.tagsPlaceholder')"
                />
              </div>

              <div class="space-y-2">
                <Label for="edit-notes">{{ t('contacts.form.notes') }}</Label>
                <Textarea
                  id="edit-notes"
                  v-model="editingContact.notes"
                  rows="3"
                  :placeholder="t('contacts.form.notesPlaceholder')"
                />
              </div>
            </form>

            <DialogFooter>
              <Button variant="outline" @click="closeEditModal">
                {{ t('common.cancel') }}
              </Button>
              <Button 
                type="submit" 
                :disabled="loading"
                @click="handleUpdateContact"
              >
                {{ loading ? t('common.loading') : t('common.save') }}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <!-- Contact Details Sidebar -->
      <ContactDetailsSidebar
        v-if="selectedContact"
        :contact="{
          ...selectedContact,
          avatar: selectedContact.avatar || getRandomAvatar()
        }"
        :show="!!selectedContact"
        @close="selectedContact = null"
        @edit="editContact"
        @delete="deleteContact"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useI18n } from '@/i18n'
import { gqlRequest } from '@/utils/graphql'
import { useAuthStore } from '@/stores/auth.store'
import { useRouter } from 'vue-router'
import SecondarySidebar from '@/components/layout/SecondarySidebar.vue'
import ContactDetailsSidebar from '@/components/contacts/ContactDetailsSidebar.vue'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

// Componentes Shadcn
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { 
  Dialog, 
  DialogContent, 
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
  DialogDescription
} from '@/components/ui/dialog'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

// Ícones do Lucide
import { 
  PanelLeftClose, 
  PanelLeft,
  Plus,
  Pencil,
  Trash2,
  MessageCircle,
  Share2,
  Archive,
  Star,
  Tag,
  AlertOctagon,
  Filter,
  SortAsc,
  MoreVertical
} from 'lucide-vue-next'

const { t } = useI18n()
const authStore = useAuthStore()
const router = useRouter()
const contacts = ref([])
const loading = ref(false)
const showNewContactModal = ref(false)
const showEditModal = ref(false)
const editingContact = ref({
  id: '',
  name: '',
  email: '',
  phone: '',
  tags: '',
  notes: ''
})
const selectedContact = ref(null)
const showSecondarySidebar = ref(true)

const newContact = ref({
  name: '',
  email: '',
  phone: '',
  tags: '',
  notes: ''
})

// Configuração das seções da sidebar
const sidebarSections = computed(() => [
  {
    id: 'contacts-management',
    label: t('contacts.management'),
    items: [
      {
        id: 'all-contacts',
        label: t('contacts.allContacts'),
        icon: 'Users'
      },
      {
        id: 'favorites',
        label: t('contacts.favorites'),
        icon: 'Star'
      },
      {
        id: 'recent',
        label: t('contacts.recent'),
        icon: 'Clock'
      }
    ]
  },
  {
    id: 'segments',
    label: t('contacts.segments.title'),
    items: [
      {
        id: 'customers',
        label: t('contacts.segments.customers'),
        icon: 'UserCheck'
      },
      {
        id: 'leads',
        label: t('contacts.segments.leads'),
        icon: 'Flag'
      },
      {
        id: 'archived',
        label: t('contacts.segments.archived'),
        icon: 'Archive'
      }
    ]
  }
])

// Função para buscar contatos
async function fetchContacts() {
  try {
    loading.value = true
    if (!authStore.isAuthenticated) {
      throw new Error('Não autenticado')
    }

    // Verifica se tem organização selecionada
    if (!authStore.currentOrganization?.id) {
      throw new Error('Selecione uma organização primeiro')
    }

    const query = `
      query GetContacts($organizationId: ID!) {
        contacts(organizationId: $organizationId) {
          id
          name
          email
          phone
          avatar
          tags
          notes
          lastContactedAt
          createdAt
          updatedAt
        }
      }
    `

    const response = await gqlRequest(query, {
      organizationId: authStore.currentOrganization.id
    }, {
      headers: {
        'Authorization': `Bearer ${authStore.token}`
      }
    })

    contacts.value = response.contacts
  } catch (error) {
    console.error('Erro ao carregar contatos:', error)
    if (error.message.includes('autoriza') || error.message.includes('autentica')) {
      authStore.logout()
      router.push('/login')
    }
    showToast(error.message, 'error')
  } finally {
    loading.value = false
  }
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

// Função para criar novo contato
async function handleCreateContact() {
  try {
    if (!newContact.value.name) {
      showToast(t('contacts.errors.nameRequired'), 'error')
      return
    }

    loading.value = true
    
    // Limpa e valida os campos
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
      avatar: getRandomAvatar(),
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
          avatar
          notes
          lastContactedAt
          createdAt
          updatedAt
        }
      }
    `

    await gqlRequest(mutation, { input })
    await fetchContacts()
    showNewContactModal.value = false
    newContact.value = { 
      name: '', 
      email: '', 
      phone: '', 
      tags: '', 
      notes: '' 
    }
    showToast(t('contacts.createSuccess'))
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

// Função para editar contato
async function editContact(contact) {
  if (!contact) return
  
  editingContact.value = {
    ...contact,
    tags: Array.isArray(contact.tags) ? contact.tags.join(', ') : ''
  }
  showEditModal.value = true
  selectedContact.value = null // Fecha o sidebar ao editar
}

// Função para fechar o modal de edição
function closeEditModal() {
  showEditModal.value = false
  editingContact.value = {
    id: '',
    name: '',
    email: '',
    phone: '',
    tags: '',
    notes: ''
  }
}

// Função para atualizar contato
async function handleUpdateContact() {
  try {
    if (!editingContact.value?.name) {
      showToast(t('contacts.errors.nameRequired'), 'error')
      return
    }

    loading.value = true

    // Limpa e valida os campos
    const input = {
      name: editingContact.value.name.trim(),
      email: editingContact.value.email ? editingContact.value.email.trim() : null,
      phone: editingContact.value.phone && editingContact.value.phone.trim() !== '' 
        ? editingContact.value.phone.trim() 
        : null,
      tags: editingContact.value.tags 
        ? editingContact.value.tags.split(',').map(tag => tag.trim()).filter(Boolean)
        : [],
      notes: editingContact.value.notes ? editingContact.value.notes.trim() : null,
      organizationId: authStore.currentOrganization.id
    }

    const mutation = `
      mutation UpdateContact($id: ID!, $input: ContactInput!) {
        updateContact(id: $id, input: $input) {
          id
          name
          email
          phone
          tags
          avatar
          notes
          lastContactedAt
          createdAt
          updatedAt
        }
      }
    `

    await gqlRequest(mutation, {
      id: editingContact.value.id,
      input
    })
    
    await fetchContacts()
    showEditModal.value = false
    editingContact.value = {
      id: '',
      name: '',
      email: '',
      phone: '',
      tags: '',
      notes: ''
    }
    showToast(t('contacts.updateSuccess'))
  } catch (error) {
    console.error('Erro ao atualizar contato:', error)
    if (error.message.includes('Unique constraint failed')) {
      showToast(t('contacts.errors.duplicateContact'), 'error')
    } else {
      showToast(error.message, 'error')
    }
  } finally {
    loading.value = false
  }
}

// Função para excluir contato
async function deleteContact(contact) {
  if (!confirm(t('contacts.confirmDelete', { name: contact.name }))) {
    return
  }

  try {
    loading.value = true
    const mutation = `
      mutation DeleteContact($id: ID!) {
        deleteContact(id: $id)
      }
    `

    await gqlRequest(mutation, { id: contact.id })
    await fetchContacts()
    showToast(t('contacts.deleteSuccess'))
  } catch (error) {
    console.error('Erro ao excluir contato:', error)
    showToast(error.message, 'error')
  } finally {
    loading.value = false
  }
}

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

// Função para mostrar toast (usando a implementação existente)
function showToast(message, type = 'success') {
  // Remove toasts anteriores
  const existingToasts = document.querySelectorAll('.toast')
  existingToasts.forEach(toast => toast.remove())

  // Cria o elemento toast
  const toast = document.createElement('div')
  toast.className = `toast toast-top toast-end z-50`

  // Cria o alerta dentro do toast
  const alert = document.createElement('div')
  alert.className = `alert ${type === 'success' ? 'alert-success' : 'alert-error'} shadow-lg`

  // Cria o conteúdo do alerta
  const content = document.createElement('div')
  content.className = 'flex items-center gap-2'

  // Ícone
  const icon = document.createElement('span')
  icon.className = 'text-lg'
  icon.textContent = type === 'success' ? '✓' : '✕'
  
  // Texto
  const text = document.createElement('span')
  text.textContent = message

  // Monta a estrutura
  content.appendChild(icon)
  content.appendChild(text)
  alert.appendChild(content)
  toast.appendChild(alert)

  // Adiciona o toast ao body
  document.body.appendChild(toast)

  // Remove após 3 segundos
  setTimeout(() => {
    toast.remove()
  }, 3000)
}

// Modifique a função de clique na linha da tabela
function handleContactClick(contact) {
  selectedContact.value = contact
}

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

onMounted(fetchContacts)
</script>

<style scoped>
/* Estilos base */
.table-row-link {
  @apply hover:bg-muted/50 transition-colors cursor-pointer;
}

.tag {
  @apply inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium 
         bg-primary/10 text-primary transition-colors hover:bg-primary/20;
}

.avatar-fallback {
  @apply h-8 w-8 rounded-full flex items-center justify-center
         text-primary font-medium transition-all;
}

/* Animações */
.dialog-content {
  animation: contentShow 0.2s ease-out;
}

.sidebar-enter-active,
.sidebar-leave-active {
  transition: transform 0.3s ease-out;
}

.sidebar-enter-from,
.sidebar-leave-to {
  transform: translateX(100%);
}

/* Loading Spinner */
.loading-spinner {
  @apply animate-spin rounded-full h-8 w-8 border-2 border-primary/30 border-t-primary;
}

/* Table Styles */
:deep(.table) {
  @apply w-full text-sm;
}

:deep(.table-header) {
  @apply bg-muted/50;
}

:deep(.table-row:hover) {
  @apply bg-muted/30;
}

:deep(.table-cell) {
  @apply p-4 align-middle [&:has([role=checkbox])]:pr-0;
}

/* Toast Animations */
.toast-enter-active {
  animation: toast-in 0.2s ease-out;
}

.toast-leave-active {
  animation: toast-out 0.2s ease-in forwards;
}

@keyframes toast-in {
  from {
    transform: translateY(100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

@keyframes toast-out {
  from {
    transform: translateY(0);
    opacity: 1;
  }
  to {
    transform: translateY(100%);
    opacity: 0;
  }
}

@keyframes contentShow {
  from {
    opacity: 0;
    transform: scale(0.96);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

/* Adicione os estilos do toast existente */
.toast {
  position: fixed;
  top: 1rem;
  right: 1rem;
  z-index: 50;
}

.alert {
  padding: 1rem;
  border-radius: 0.5rem;
  color: white;
}

.alert-success {
  background-color: hsl(var(--success));
}

.alert-error {
  background-color: hsl(var(--error));
}

/* Ajuste para o sidebar de detalhes */
:deep(.contact-details-sidebar) {
  @apply border-l bg-card;
  width: 384px; /* w-96 */
  transition: transform 0.3s ease-in-out;
}

:deep(.contact-details-sidebar.hidden) {
  transform: translateX(100%);
}

/* Adicione novos estilos de variantes ao seu CSS global ou no componente Badge */
:deep(.badge) {
  &[data-variant='info'] {
    @apply bg-blue-100 text-blue-900 dark:bg-blue-900 dark:text-blue-100;
  }
  
  &[data-variant='warning'] {
    @apply bg-yellow-100 text-yellow-900 dark:bg-yellow-900 dark:text-yellow-100;
  }
  
  &[data-variant='premium'] {
    @apply bg-purple-100 text-purple-900 dark:bg-purple-900 dark:text-purple-100;
  }
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
</style> 