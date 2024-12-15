class MessageService {
  constructor(prisma, pubsub) {
    this.prisma = prisma
    this.pubsub = pubsub
  }

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
