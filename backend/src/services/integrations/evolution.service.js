/**
 * Serviço para integração com a Evolution API
 */
export default class EvolutionService {
  /**
   * Cria uma nova instância na Evolution API
   * 
   * @param {object} config Configurações da instância
   * @returns {Promise<object>} Dados da instância criada
   */
  static async createInstance(config) {
    try {
      // Garante que a URL termine com '/'
      const serverUrl = config.serverUrl.endsWith('/')
        ? config.serverUrl
        : config.serverUrl + '/'

      console.log('1. Tentando criar instância na Evolution API:', {
        url: `${serverUrl}instance/create`,
        config
      })

      const response = await fetch(`${serverUrl}instance/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': config.apiKey
        },
        body: JSON.stringify({
          instanceName: config.instanceName,
          token: config.token || '',
          number: config.phoneNumber,
          qrcode: true,
          integration: 'WHATSAPP-BAILEYS',
          webhook: {
            url: config.webhookUrl,
            events: [
              'MESSAGES_UPSERT',
              'MESSAGES_UPDATE',
              'MESSAGES_DELETE',
              'SEND_MESSAGE',
              'CONNECTION_UPDATE'
            ]
          },
          settings: {
            reject_call: true,
            msg_call: 'Desculpe, não atendemos chamadas neste número.',
            groups_ignore: true,
            always_online: true,
            read_messages: true,
            read_status: true
          }
        })
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error('2. Resposta de erro da Evolution API:', {
          status: response.status,
          statusText: response.statusText,
          body: errorText
        })
        throw new Error(`Erro ao criar instância: ${response.status} - ${errorText || response.statusText}`)
      }

      const result = await response.json()
      console.log('3. Resposta bem-sucedida da Evolution API:', result)
      return result
    } catch (error) {
      console.error('4. Erro ao criar instância na Evolution API:', error)
      throw error
    }
  }

  /**
   * Verifica o estado de conexão de uma instância
   * 
   * @param {object} config Configurações da instância
   * @returns {Promise<object>} Estado da conexão
   */
  static async checkConnectionState(config) {
    try {
      const response = await fetch(`${config.serverUrl}/instance/connectionState/${config.instanceName}`, {
        method: 'GET',
        headers: {
          'apikey': config.apiKey
        }
      })

      if (!response.ok) {
        throw new Error(`Erro ao verificar estado: ${response.statusText}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Erro ao verificar estado da instância:', error)
      throw error
    }
  }

  /**
   * Deleta uma instância
   * 
   * @param {object} config Configurações da instância
   * @returns {Promise<void>}
   */
  static async deleteInstance(config) {
    try {
      const response = await fetch(`${config.serverUrl}/instance/delete/${config.instanceName}`, {
        method: 'DELETE',
        headers: {
          'apikey': config.apiKey
        }
      })

      if (!response.ok) {
        throw new Error(`Erro ao deletar instância: ${response.statusText}`)
      }
    } catch (error) {
      console.error('Erro ao deletar instância na Evolution API:', error)
      throw error
    }
  }
} 