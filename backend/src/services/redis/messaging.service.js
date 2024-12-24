import RedisService from './redis.service.js'

export default class MessagingService extends RedisService {
    constructor(fastify) {
        super(fastify)
    }

    /**
     * Publica uma nova mensagem recente no canal 'recent_messages'
     * 
     * @param {Object} message - Objeto contendo os dados da mensagem
     * @param {string} message.type - Tipo da mensagem (ex: 'whatsapp')
     * @param {string} message.instance - Instância que gerou a mensagem
     * @param {Object} message.data - Dados da mensagem
     * @param {string} message.timestamp - Timestamp da mensagem
     */
    async newRecentMessage(message) {
        await this.publish('recent_messages', message)
    }

    // Inscrever no canal
    async subscribeToRecentMessages(callback) {
        await this.subscribe('recent_messages', callback)
    }

    // Desinscrever do canal
    async unsubscribeFromRecentMessages() {
        await this.unsubscribe('recent_messages')
    }

    /**
     * Adiciona uma mensagem do WhatsApp na fila de processamento
     * 
     * @param {Object} message - Dados da mensagem do WhatsApp
     */
    async queueWhatsAppMessage(message) {
        try {
            await this.publisher.lPush('whatsapp:messages:queue', JSON.stringify({
                type: 'whatsapp',
                instance: message.instance,
                data: message.data,
                timestamp: new Date().toISOString(),
                status: 'pending'
            }))

            // Também publica no canal de mensagens recentes para real-time
            await this.newRecentMessage({
                type: 'whatsapp',
                instance: message.instance,
                data: message.data,
                timestamp: new Date().toISOString()
            })
        } catch (error) {
            console.error('Erro ao adicionar mensagem na fila:', error)
            throw error
        }
    }
}