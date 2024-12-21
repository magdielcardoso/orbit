<template>
  <div class="p-6">
    <!-- Cabeçalho -->
    <div class="sm:flex sm:items-center">
      <div class="sm:flex-auto">
        <h1 class="text-2xl font-semibold text-foreground">
          {{ t('admin.connectors.title') }}
        </h1>
        <p class="mt-2 text-sm text-muted-foreground">
          {{ t('admin.connectors.description') }}
        </p>
      </div>
      <div class="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
        <Button @click="showNewConnectorModal = true">
          <Plus class="h-4 w-4 mr-2" />
          {{ t('admin.connectors.addConnector') }}
        </Button>
      </div>
    </div>

    <!-- Loading state -->
    <div v-if="loading" class="flex justify-center items-center py-8">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>

    <!-- Lista de Conectores -->
    <div v-else class="mt-8 rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{{ t('admin.connectors.name') }}</TableHead>
            <TableHead>{{ t('admin.connectors.type') }}</TableHead>
            <TableHead>{{ t('admin.connectors.status') }}</TableHead>
            <TableHead class="text-right">{{ t('common.actions') }}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow v-for="connector in localConnectors" :key="connector.id">
            <TableCell>
              <div class="flex items-center">
                <component 
                  :is="getConnectorIcon(connector.source)"
                  class="h-5 w-5 mr-2"
                />
                <span>{{ connector.name }}</span>
              </div>
            </TableCell>
            <TableCell>
              {{ t(`admin.connectors.types.${connector.source}`) }}
            </TableCell>
            <TableCell>
              <Badge
                :variant="connector.isEnabled ? 'success' : 'destructive'"
              >
                {{ connector.isEnabled ? t('common.active') : t('common.inactive') }}
              </Badge>
            </TableCell>
            <TableCell class="text-right space-x-2">
              <Button 
                variant="ghost" 
                size="sm"
                @click="testConnector(connector)"
              >
                <Zap class="h-4 w-4 mr-2" />
                {{ t('admin.connectors.test') }}
              </Button>
              <Button 
                variant="ghost" 
                size="sm"
                @click="editConnector(connector)"
              >
                <Pencil class="h-4 w-4 mr-2" />
                {{ t('common.edit') }}
              </Button>
              <Button 
                variant="ghost" 
                size="sm"
                @click="toggleConnector(connector)"
              >
                <Power class="h-4 w-4 mr-2" />
                {{ connector.isEnabled ? t('common.disable') : t('common.enable') }}
              </Button>
              <Button 
                variant="ghost" 
                size="sm"
                @click="deleteConnector(connector)"
                class="hover:bg-destructive/10 hover:text-destructive"
              >
                <Trash2 class="h-4 w-4 mr-2" />
                {{ t('common.delete') }}
              </Button>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>

    <!-- Modal de Conector -->
    <Dialog v-model:open="showConnectorModal">
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {{ currentConnector ? t('admin.connectors.editConnector') : t('admin.connectors.newConnector') }}
          </DialogTitle>
        </DialogHeader>
        
        <form @submit.prevent="saveConnector" class="space-y-4">
          <div class="space-y-2">
            <Label for="name">{{ t('admin.connectors.form.name') }}</Label>
            <Input
              id="name"
              v-model="form.name"
              type="text"
              required
              :placeholder="t('admin.connectors.form.namePlaceholder')"
            />
          </div>

          <div class="space-y-2">
            <Label for="type">{{ t('admin.connectors.form.type') }}</Label>
            <Select v-model="form.source">
              <option v-for="type in connectorTypes" :key="type" :value="type">
                {{ t(`admin.connectors.types.${type}`) }}
              </option>
            </Select>
          </div>

          <div class="space-y-2">
            <Label for="config">{{ t('admin.connectors.form.config') }}</Label>
            <Textarea
              id="config"
              v-model="form.config"
              rows="6"
              required
              :placeholder="t('admin.connectors.form.configPlaceholder')"
            />
          </div>

          <div class="flex items-center space-x-2">
            <Switch
              id="isEnabled"
              v-model="form.isEnabled"
            />
            <Label for="isEnabled">{{ t('admin.connectors.form.isEnabled') }}</Label>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" @click="showConnectorModal = false">
              {{ t('common.cancel') }}
            </Button>
            <Button type="submit">
              {{ t('common.save') }}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, toRefs } from 'vue'
import { useI18n } from '@/i18n'
import { useConnectorStore } from '@/stores'
import { useAuthStore } from '@/stores'
import { ConnectorService } from '@/services'
import { storeToRefs } from 'pinia'

// Componentes Shadcn
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { 
  Dialog,
  DialogContent, 
  DialogHeader,
  DialogTitle,
  DialogFooter 
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
import { Plus, Pencil, Trash2, Power, Zap, MessageSquare, Send, Mail, Globe, Webhook } from 'lucide-vue-next'

const { t } = useI18n()
const connectorStore = useConnectorStore()
const authStore = useAuthStore()
const { connectors } = storeToRefs(connectorStore)

// Estado local
const loading = ref(false)
const showConnectorModal = ref(false)
const currentConnector = ref(null)
const form = ref({
  name: '',
  source: '',
  config: '',
  isEnabled: true
})

// Computed
const connectorTypes = ['WHATSAPP', 'TELEGRAM', 'EMAIL', 'API', 'WEBHOOK']

const localConnectors = ref([])

// Métodos
const fetchConnectors = async () => {
  console.log('ConnectorsManagement - Iniciando fetchConnectors')
  loading.value = true
  try {
    const connectors = await ConnectorService.listConnectors()
    console.log('ConnectorsManagement - Connectors recebidos:', connectors)
    localConnectors.value = [...(connectors || [])]
    console.log('ConnectorsManagement - LocalConnectors atualizado:', localConnectors.value)
  } catch (error) {
    console.error('ConnectorsManagement - Erro:', error)
  } finally {
    loading.value = false
  }
}

const editConnector = (connector) => {
  currentConnector.value = connector
  form.value = {
    name: connector.name,
    source: connector.source,
    description: connector.description,
    config: JSON.stringify(connector.config, null, 2),
    isEnabled: connector.isEnabled
  }
  showConnectorModal.value = true
}

// Função para mostrar toast
function showToast(message, type = 'success') {
  const toast = document.createElement('div')
  toast.className = `toast toast-top toast-end z-50`

  const alert = document.createElement('div')
  alert.className = `alert ${type === 'success' ? 'alert-success' : 'alert-error'} shadow-lg`

  const content = document.createElement('div')
  content.className = 'flex items-center gap-2'

  // Ícone
  const icon = document.createElement('span')
  icon.className = 'text-lg'
  icon.textContent = type === 'success' ? '✅' : '❌'
  
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

const saveConnector = async () => {
  try {
    if (currentConnector.value) {
      await connectorStore.updateConnector(currentConnector.value.id, form.value)
      showToast(t('admin.connectors.updateSuccess'), 'success')
    } else {
      await connectorStore.createConnector(form.value)
      showToast(t('admin.connectors.createSuccess'), 'success')
    }
    showConnectorModal.value = false
    await fetchConnectors()
  } catch (error) {
    console.error('Erro ao salvar conector:', error)
    showToast(t(currentConnector.value ? 'admin.connectors.errors.updateError' : 'admin.connectors.errors.createError'), 'error')
  }
}

const deleteConnector = async (connector) => {
  if (confirm(t('admin.connectors.confirmDelete', { name: connector.name }))) {
    try {
      await connectorStore.deleteConnector(connector.id)
      showToast(t('admin.connectors.deleteSuccess'), 'success')
      await fetchConnectors()
    } catch (error) {
      console.error('Erro ao deletar conector:', error)
      showToast(t('admin.connectors.errors.deleteError'), 'error')
    }
  }
}

const toggleConnector = async (connector) => {
  try {
    await connectorStore.toggleConnector(connector.id, !connector.isEnabled)
  } catch (error) {
    console.error('Erro ao alternar status do conector:', error)
    showToast(t('admin.connectors.errors.updateError'), 'error')
  }
}

const testConnector = async (connector) => {
  try {
    const result = await connectorStore.testConnector(connector.config)
    showToast(t('admin.connectors.testSuccess'), 'success')
  } catch (error) {
    console.error('Erro ao testar conector:', error)
    showToast(t('admin.connectors.errors.testError'), 'error')
  }
}

// Função para retornar o ícone correto baseado no tipo
const getConnectorIcon = (source) => {
  const icons = {
    WHATSAPP: MessageSquare,
    WHATSAPP_API: MessageSquare,
    TELEGRAM: Send,
    EMAIL: Mail,
    API: Globe,
    WEBHOOK: Webhook
  }
  return icons[source] || Globe
}

// Lifecycle
onMounted(fetchConnectors)
</script> 