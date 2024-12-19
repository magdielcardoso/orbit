import axios from 'axios'
import { loggerService } from '../controllers/logger.controller.js'
import { inboxController } from '../controllers/inbox.controller.js'

export class EvolutionApiService {
  constructor(serverUrl, apiKey) {
    this.serverUrl = serverUrl.endsWith('/') ? serverUrl : `${serverUrl}/`
    this.apiKey = apiKey
    this.pollingInterval = null
    this.axios = axios.create({
      baseURL: this.serverUrl,
      headers: {
        'Content-Type': 'application/json',
        'apikey': apiKey
      }
    })
  }

  async createInstance(settings) {
    try {
      // Primeiro verifica se a instância já existe
      try {
        const existingInstance = await this.axios.get(`instance/exists/${settings.instanceName}`)
        if (existingInstance.data?.exists) {
          return { instance: { instanceId: settings.instanceName, status: 'connected' } }
        }
      } catch (error) {
        // Ignora erro se a instância não existir
      }

      // Cria uma nova instância com configuração mínima
      const response = await this.axios.post('instance/create', {
        instanceName: settings.instanceName,
        token: this.apiKey,
        qrcode: true,
        integration: 'WHATSAPP-BAILEYS'
      })

      if (!response.data?.instance) {
        loggerService.error('Resposta inválida da Evolution API:', {
          response: response.data
        })
        throw new Error('Resposta inválida da Evolution API')
      }

      return response.data
    } catch (error) {
      loggerService.error('Erro ao criar instância na Evolution API:', {
        error: error.message,
        settings,
        response: error.response?.data
      })
      throw new Error('Falha ao criar instância do WhatsApp')
    }
  }

  async getInstanceStatus(instanceName) {
    try {
      const [connectionState, qrCode] = await Promise.all([
        this.axios.get(`instance/connectionState/${instanceName}`),
        this.getInstanceQRCode(instanceName).catch(() => null)
      ])

      return {
        ...connectionState.data,
        qrcode: qrCode
      }
    } catch (error) {
      loggerService.error('Erro ao buscar status da instância:', {
        error: error.message,
        instanceName,
        response: error.response?.data
      })
      throw new Error('Falha ao verificar status da instância')
    }
  }

  async deleteInstance(instanceName) {
    try {
      const response = await this.axios.delete(`instance/delete/${instanceName}`)
      return response.data
    } catch (error) {
      loggerService.error('Erro ao deletar instância:', {
        error: error.message,
        instanceName,
        response: error.response?.data
      })
      throw new Error('Falha ao deletar instância')
    }
  }

  async getInstanceQRCode(instanceName) {
    try {
      const response = await this.axios.get(`instance/connect/${instanceName}`)
      return response.data
    } catch (error) {
      loggerService.error('Erro ao buscar QR code:', {
        error: error.message,
        instanceName,
        response: error.response?.data
      })
      throw new Error('Falha ao obter QR code')
    }
  }

  async makeRequest(endpoint) {
    try {
      const response = await this.axios.get(endpoint)
      return response.data
    } catch (error) {
      if (error.response?.status === 404) {
        return {
          status: 404,
          error: "Not Found",
          response: {
            message: [error.response.data.message || "Instance does not exist"]
          }
        }
      }
      throw error
    }
  }

  async updateInstanceStatus(instanceId) {
    try {
      const response = await this.makeRequest(`instance/connectionState/${instanceId}`)
      
      // Verifica se a resposta tem o formato correto da Evolution API
      if (response?.instance?.state) {
        const stateMap = {
          'open': 'connected',
          'close': 'disconnected',
          'connecting': 'connecting',
          'disconnecting': 'disconnecting',
          'refused': 'error'
        }

        const currentState = stateMap[response.instance.state] || 'unknown'
        
        // Se está conectado, não precisa buscar QR code
        if (response.instance.state === 'open') {
          inboxController.updateInboxStatus(instanceId, {
            status: 'connected',
            qrcode: null
          })
          return
        }
        
        // Se está conectando, tenta buscar QR code
        if (currentState === 'connecting') {
          try {
            const qrResponse = await this.makeRequest(`instance/qrcode/${instanceId}`)
            if (qrResponse?.qrcode) {
              inboxController.updateInboxStatus(instanceId, {
                status: currentState,
                qrcode: qrResponse.qrcode,
                pairingCode: qrResponse.pairingCode
              })
              return
            }
          } catch (qrError) {
            // Ignora erro ao buscar QR code
          }
        }

        inboxController.updateInboxStatus(instanceId, {
          status: currentState,
          qrcode: null
        })
      } else if (response?.status === 404) {
        loggerService.warn('Instância não encontrada:', {
          instanceId,
          message: response.response?.message?.[0]
        })
        
        inboxController.updateInboxStatus(instanceId, {
          status: 'not_found',
          qrcode: null
        })
      }

    } catch (error) {
      loggerService.error('Erro ao atualizar status da instância:', {
        error: error.message,
        instanceId
      })
      
      inboxController.updateInboxStatus(instanceId, {
        status: 'error',
        qrcode: null
      })
    }
  }

  // Método para iniciar o polling de status
  startStatusPolling(instanceId, interval = 5000) {
    // Limpa intervalo existente se houver
    if (this.pollingInterval) {
      clearInterval(this.pollingInterval)
    }

    // Faz primeira atualização imediatamente
    this.updateInstanceStatus(instanceId)

    // Inicia polling
    this.pollingInterval = setInterval(() => {
      this.updateInstanceStatus(instanceId)
    }, interval)

    loggerService.info('Polling de status iniciado', { instanceId, interval })
  }

  // Método para parar o polling
  stopStatusPolling() {
    if (this.pollingInterval) {
      clearInterval(this.pollingInterval)
      this.pollingInterval = null
      loggerService.info('Polling de status parado')
    }
  }
} 