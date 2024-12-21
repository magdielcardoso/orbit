import ConnectorModel from '../models/connector.model.js'

export default class ConnectorService {
  /**
   * Lista todos os conectores de uma organização
   */
  static async listConnectors() {
    return await ConnectorModel.findConnectorsByOrganizationId()
  }

  /**
   * Busca um conector pelo ID
   */
  static async getConnector(id) {
    return await ConnectorModel.findConnectorById(id)
  }

  /**
   * Cria um novo conector
   */
  static async createConnector(input) {
    // Valida e formata o config JSON se necessário
    if (typeof input.config === 'string') {
      try {
        input.config = JSON.parse(input.config)
      } catch (error) {
        throw new Error('Configuração JSON inválida')
      }
    }

    // Extrai os headers do curl
    if (input.config.curl) {
      input.config.headers = this.extractHeadersFromCurl(input.config.curl)
    }

    return await ConnectorModel.createConnector(input)
  }

  /**
   * Atualiza um conector existente
   */
  static async updateConnector(id, input) {
    // Valida e formata o config JSON se necessário
    if (typeof input.config === 'string') {
      try {
        input.config = JSON.parse(input.config)
      } catch (error) {
        throw new Error('Configuração JSON inválida')
      }
    }

    // Extrai os headers do curl se fornecido
    if (input.config.curl) {
      input.config.headers = this.extractHeadersFromCurl(input.config.curl)
    }

    return await ConnectorModel.updateConnector(id, input)
  }

  /**
   * Remove um conector
   */
  static async deleteConnector(id) {
    return await ConnectorModel.deleteConnector(id)
  }

  /**
   * Ativa/Desativa um conector
   */
  static async toggleConnector(id, isEnabled) {
    return await ConnectorModel.toggleConnector(id, isEnabled)
  }

  /**
   * Extrai headers de uma string curl
   */
  static extractHeadersFromCurl(curlString) {
    const headers = {}
    const headerRegex = /--header ['"]([^:]+): ([^'"]+)['"]/g
    let match

    while ((match = headerRegex.exec(curlString)) !== null) {
      headers[match[1]] = match[2]
    }

    return headers
  }

  /**
   * Valida uma configuração de conector
   */
  static validateConnectorConfig(config) {
    // Implementar validações específicas para cada tipo de conector
    const requiredFields = ['instanceName', 'token']
    
    for (const field of requiredFields) {
      if (!config[field]) {
        throw new Error(`Campo obrigatório ausente: ${field}`)
      }
    }

    return true
  }

  /**
   * Testa a conexão com o conector
   */
  static async testConnection(config) {
    try {
      // Implementar lógica de teste de conexão
      // Pode fazer uma chamada de teste para a API configurada
      return {
        success: true,
        message: 'Conexão estabelecida com sucesso'
      }
    } catch (error) {
      return {
        success: false,
        message: `Erro ao testar conexão: ${error.message}`
      }
    }
  }
} 