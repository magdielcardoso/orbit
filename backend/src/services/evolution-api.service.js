import axios from 'axios'
import { loggerService } from '../controllers/logger.controller.js'

export class EvolutionApiService {
  constructor(serverUrl, apiKey) {
    this.serverUrl = serverUrl.endsWith('/') ? serverUrl : `${serverUrl}/`
    this.apiKey = apiKey
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
      const response = await this.axios.get(`instance/connectionState/${instanceName}`)
      return response.data
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
} 