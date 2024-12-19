class MessageService {
  constructor(prisma, pubsub) {
    this.prisma = prisma
    this.pubsub = pubsub
  }

  /**
   * Cria uma nova mensagem.
   * 
   * @param {object} data
   * @returns {Promise<object>}
   */
  async createMessage(data) {
    const message = await this.prisma.message.create({
      data,
      include: {
        user: true
      }
    })

    this.pubsub.publish('MESSAGE_CREATED', {
      messageCreated: message
    })

    return message
  }

  /**
   * Obtém mensagens com base nas opções fornecidas.
   * 
   * @param {object} options
   * @returns {Promise<object[]>}
   */
  async getMessages(options = {}) {
    return this.prisma.message.findMany({
      ...options,
      include: {
        user: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })
  }
}

export default MessageService
