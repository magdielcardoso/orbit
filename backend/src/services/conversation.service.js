import { prismaInstance as prisma } from '../plugins/prisma.plugin.js';

class ConversationService {
  async getConversations(user, organizationId, filters = {}) {
    if (!user) throw new Error('Usuário não autenticado');

    // Verifica se o usuário tem acesso à organização
    const organization = await prisma.organization.findUnique({
      where: { id: organizationId },
      include: {
        users: {
          where: { userId: user.id }
        }
      }
    });

    if (!organization || organization.users.length === 0) {
      throw new Error('Usuário não tem acesso a esta organização');
    }

    // Monta o where baseado nos filtros
    const where = {
      organizationId,
      ...(filters.assigneeId === null 
        ? { assigneeId: null }
        : filters.assigneeId 
          ? { assigneeId: filters.assigneeId }
          : {}),
      ...(filters.status ? { status: filters.status } : {}),
      ...(filters.priority ? { priority: filters.priority } : {})
    };

    return await prisma.conversation.findMany({
      where,
      include: {
        messages: {
          take: 1,
          orderBy: { createdAt: 'desc' },
          include: {
            user: {
              select: {
                id: true,
                name: true,
                avatar: true
              }
            }
          }
        },
        contact: {
          select: {
            id: true,
            name: true,
            avatar: true,
            email: true,
            phone: true
          }
        },
        assignee: {
          select: {
            id: true,
            name: true,
            avatar: true
          }
        },
        inbox: {
          select: {
            id: true,
            name: true,
            channelType: true
          }
        }
      },
      orderBy: {
        updatedAt: 'desc'
      }
    });
  }

  async updateStatus(user, conversationId, status) {
    if (!user) throw new Error('Usuário não autenticado');

    const conversation = await prisma.conversation.findUnique({
      where: { id: conversationId },
      include: { 
        inbox: {
          include: {
            organization: {
              include: {
                users: {
                  where: { userId: user.id }
                }
              }
            }
          }
        }
      }
    });

    if (!conversation) throw new Error('Conversa não encontrada');
    if (!conversation.inbox.organization.users.length) {
      throw new Error('Usuário não tem permissão para atualizar esta conversa');
    }

    return await prisma.conversation.update({
      where: { id: conversationId },
      data: {
        status,
        ...(status === 'CLOSED' ? { closedAt: new Date() } : {}),
        ...(status === 'RESOLVED' ? { resolvedAt: new Date() } : {}),
        ...(status === 'OPEN' && conversation.status === 'CLOSED' ? { reopenedAt: new Date() } : {})
      }
    });
  }

  async assignConversation(user, conversationId, assigneeId) {
    if (!user) throw new Error('Usuário não autenticado');

    const conversation = await prisma.conversation.findUnique({
      where: { id: conversationId },
      include: { 
        inbox: {
          include: {
            organization: {
              include: {
                users: {
                  where: { userId: user.id }
                }
              }
            }
          }
        }
      }
    });

    if (!conversation) throw new Error('Conversa não encontrada');
    if (!conversation.inbox.organization.users.length) {
      throw new Error('Usuário não tem permissão para atribuir esta conversa');
    }

    return await prisma.conversation.update({
      where: { id: conversationId },
      data: { assigneeId }
    });
  }
}

export default new ConversationService(); 