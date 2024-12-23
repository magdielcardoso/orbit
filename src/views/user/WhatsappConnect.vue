<template>
  <div class="flex flex-col items-center justify-center min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div class="text-center">
        <h2 class="mt-6 text-3xl font-extrabold text-gray-900">
          Conectar WhatsApp
        </h2>
        <p class="mt-2 text-sm text-gray-600">
          {{ connectionStatus }}
        </p>
      </div>

      <!-- QR Code -->
      <div v-if="qrCode" class="mt-8 flex justify-center">
        <img :src="qrCode" alt="QR Code WhatsApp" class="w-64 h-64" />
      </div>

      <!-- Status da Conexão -->
      <div class="mt-8">
        <div class="flex items-center justify-center space-x-2">
          <div :class="statusColorClass" class="w-3 h-3 rounded-full"></div>
          <span class="text-sm font-medium text-gray-700">{{ connectionStatusText }}</span>
        </div>
      </div>

      <!-- Instruções -->
      <div class="mt-8 text-sm text-gray-600">
        <h3 class="font-medium text-gray-900">Como conectar:</h3>
        <ol class="mt-4 list-decimal list-inside space-y-2">
          <li>Abra o WhatsApp no seu celular</li>
          <li>Toque em Menu ou Configurações e selecione WhatsApp Web</li>
          <li>Aponte seu celular para esta tela para capturar o código QR</li>
        </ol>
      </div>

      <!-- Botões -->
      <div class="mt-8 flex justify-center space-x-4">
        <button
          @click="refreshQRCode"
          class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-orbit-600 hover:bg-orbit-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orbit-500"
        >
          Atualizar QR Code
        </button>
        <button
          @click="goToInbox"
          class="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orbit-500"
        >
          Voltar para Caixas de Entrada
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useWebSocket } from '@/composables/useWebSocket'
import { gqlRequest } from '@/utils/graphql'

const route = useRoute()
const router = useRouter()
const inboxId = route.params.id
const instanceName = ref(null)

// Busca os dados da inbox para pegar o instanceName
async function fetchInboxData() {
  try {
    const query = `
      query GetInbox($id: ID!) {
        inbox(id: $id) {
          id
          settings
          channelType
        }
      }
    `
    const response = await gqlRequest(query, { id: inboxId })
    console.log('Resposta da query:', response) // Debug

    if (response.inbox && response.inbox.settings) {
      let settings
      try {
        // Tenta fazer o parse se for string
        settings = typeof response.inbox.settings === 'string' 
          ? JSON.parse(response.inbox.settings) 
          : response.inbox.settings

        console.log('Settings parseado:', settings) // Debug

        if (settings.evolution && settings.evolution.instanceName) {
          instanceName.value = settings.evolution.instanceName
          console.log('InstanceName encontrado:', instanceName.value)
        } else {
          console.error('Settings não contém instanceName:', settings)
        }
      } catch (e) {
        console.error('Erro ao fazer parse dos settings:', e)
      }
    } else {
      console.error('Inbox ou settings não encontrados:', response)
    }
    
    console.log('Dados da inbox carregados:', {
      inboxId,
      settings: response.inbox?.settings,
      instanceName: instanceName.value
    })
  } catch (error) {
    console.error('Erro ao carregar dados da inbox:', error)
  }
}

const qrCode = ref(null)
const connectionStatus = ref('Aguardando conexão...')
const connectionStatusText = ref('Desconectado')
const statusColorClass = ref('bg-gray-400')

// Conecta ao WebSocket
const ws = useWebSocket()

// Monitora eventos do WebSocket
ws.onEvent('whatsapp:qr', (data) => {
  qrCode.value = data.qr
  connectionStatus.value = 'Escaneie o código QR para conectar'
})

ws.onEvent('whatsapp:connection', (data) => {
  console.log('Recebido evento whatsapp:connection:', {
    received: data,
    expecting: instanceName.value,
    matches: data.instance === instanceName.value
  })

  // Verifica se o nome da instância corresponde
  if (data.instance === instanceName.value) {
    handleConnectionStatus(data.state)
  } else {
    console.log('Nome da instância não corresponde:', {
      receivedInstance: data.instance,
      expectedInstance: instanceName.value
    })
  }
})

function handleConnectionStatus(status) {
  console.log('Status da conexão:', status)
  switch (status) {
    case 'connecting':
      connectionStatusText.value = 'Conectando...'
      statusColorClass.value = 'bg-yellow-400'
      connectionStatus.value = 'Estabelecendo conexão...'
      break
    
    case 'close':
    case 'disconnected':
      connectionStatusText.value = 'Desconectado'
      statusColorClass.value = 'bg-red-400'
      connectionStatus.value = 'Conexão perdida. Tente novamente.'
      break
    
    case 'open':
    case 'connected':
      connectionStatusText.value = 'Conectado'
      statusColorClass.value = 'bg-green-400'
      connectionStatus.value = 'WhatsApp conectado com sucesso!'
      // Redireciona após 3 segundos
      setTimeout(() => router.push('/'), 3000)
      break
  }
}

// Carrega os dados ao montar o componente
onMounted(async () => {
  await fetchInboxData()
  ws.send('whatsapp:join', { 
    inboxId,
    instanceName: instanceName.value 
  })
})

// Limpa a conexão ao desmontar
onUnmounted(() => {
  ws.close()
})
</script> 