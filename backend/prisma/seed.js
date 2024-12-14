import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  // Cria roles padrão
  const userRole = await prisma.role.upsert({
    where: { name: 'user' },
    update: {},
    create: {
      name: 'user',
      description: 'Usuário padrão do sistema'
    }
  })

  const adminRole = await prisma.role.upsert({
    where: { name: 'superadmin' },
    update: {},
    create: {
      name: 'superadmin',
      description: 'Super administrador do sistema'
    }
  })

  // Adiciona role agent
  const agentRole = await prisma.role.upsert({
    where: { name: 'agent' },
    update: {},
    create: {
      name: 'agent',
      description: 'Agente de atendimento'
    }
  })

  // Cria permissões padrão
  const permissions = [
    {
      name: 'manage_system',
      description: 'Gerenciar configurações do sistema'
    },
    {
      name: 'manage_users',
      description: 'Gerenciar usuários'
    },
    {
      name: 'manage_roles',
      description: 'Gerenciar papéis e permissões'
    },
    {
      name: 'use_chat',
      description: 'Usar o chat'
    },
    {
      name: 'manage_chats',
      description: 'Gerenciar conversas e atendimentos'
    }
  ]

  for (const perm of permissions) {
    await prisma.permission.upsert({
      where: { name: perm.name },
      update: {},
      create: perm
    })
  }

  // Associa permissões às roles
  const manageSystem = await prisma.permission.findUnique({
    where: { name: 'manage_system' }
  })

  const useChat = await prisma.permission.findUnique({
    where: { name: 'use_chat' }
  })

  // Permissões do admin
  await prisma.rolePermission.upsert({
    where: {
      roleId_permissionId: {
        roleId: adminRole.id,
        permissionId: manageSystem.id
      }
    },
    update: {},
    create: {
      roleId: adminRole.id,
      permissionId: manageSystem.id
    }
  })

  // Adiciona permissão manage_users ao superadmin
  const manageUsers = await prisma.permission.findUnique({
    where: { name: 'manage_users' }
  })

  await prisma.rolePermission.upsert({
    where: {
      roleId_permissionId: {
        roleId: adminRole.id,
        permissionId: manageUsers.id
      }
    },
    update: {},
    create: {
      roleId: adminRole.id,
      permissionId: manageUsers.id
    }
  })

  // Adiciona permissão manage_roles ao superadmin
  const manageRoles = await prisma.permission.findUnique({
    where: { name: 'manage_roles' }
  })

  await prisma.rolePermission.upsert({
    where: {
      roleId_permissionId: {
        roleId: adminRole.id,
        permissionId: manageRoles.id
      }
    },
    update: {},
    create: {
      roleId: adminRole.id,
      permissionId: manageRoles.id
    }
  })

  // Permissões do usuário
  await prisma.rolePermission.upsert({
    where: {
      roleId_permissionId: {
        roleId: userRole.id,
        permissionId: useChat.id
      }
    },
    update: {},
    create: {
      roleId: userRole.id,
      permissionId: useChat.id
    }
  })

  // Permissões do agent
  const manageChats = await prisma.permission.findUnique({
    where: { name: 'manage_chats' }
  })

  await prisma.rolePermission.upsert({
    where: {
      roleId_permissionId: {
        roleId: agentRole.id,
        permissionId: useChat.id
      }
    },
    update: {},
    create: {
      roleId: agentRole.id,
      permissionId: useChat.id
    }
  })

  await prisma.rolePermission.upsert({
    where: {
      roleId_permissionId: {
        roleId: agentRole.id,
        permissionId: manageChats.id
      }
    },
    update: {},
    create: {
      roleId: agentRole.id,
      permissionId: manageChats.id
    }
  })

  // Cria um usuário de teste se não existir
  const testUser = await prisma.user.upsert({
    where: { email: 'user@test.com' },
    update: {},
    create: {
      email: 'user@test.com',
      name: 'Usuário Teste',
      password: await bcrypt.hash('123456', 10),
      role: {
        connect: { name: 'user' }
      },
      active: true
    }
  })

  // Cria organizações de teste
  const organizations = [
    {
      name: 'Empresa Demo',
      slug: 'empresa-demo',
      plan: 'PROFESSIONAL',
      domain: 'demo.orbitchat.io',
      locale: 'pt-BR',
      features: {
        whatsapp: true,
        telegram: true,
        email: true,
        chatbot: true
      }
    },
    {
      name: 'Startup Tech',
      slug: 'startup-tech',
      plan: 'STARTER',
      locale: 'pt-BR',
      features: {
        whatsapp: true,
        email: true
      }
    }
  ]

  // Após criar o usuário e a organização
  async function createOrganizationUser(userId, organizationId, isAdmin = false, isOwner = false) {
    await prisma.organizationUser.upsert({
      where: {
        organizationId_userId: {
          organizationId,
          userId
        }
      },
      update: {
        isAdmin,
        isOwner
      },
      create: {
        userId,
        organizationId,
        isAdmin,
        isOwner,
        status: 'active'
      }
    })
  }

  for (const org of organizations) {
    const organization = await prisma.organization.upsert({
      where: { slug: org.slug },
      update: {},
      create: {
        ...org,
        features: org.features
      }
    })

    // Vincula o usuário de teste à organização
    await prisma.organizationUser.upsert({
      where: {
        organizationId_userId: {
          organizationId: organization.id,
          userId: testUser.id
        }
      },
      update: {
        isAdmin: true,
        isOwner: true
      },
      create: {
        organizationId: organization.id,
        userId: testUser.id,
        isAdmin: true,
        isOwner: true,
        status: 'active'
      }
    })

    // Cria times para cada organização
    const teams = [
      {
        name: 'Suporte Nível 1',
        description: 'Atendimento inicial',
        color: '#22C55E',
        icon: '🎯'
      },
      {
        name: 'Suporte Técnico',
        description: 'Problemas técnicos',
        color: '#3B82F6',
        icon: '🔧'
      },
      {
        name: 'Vendas',
        description: 'Equipe comercial',
        color: '#F59E0B',
        icon: '💰'
      }
    ]

    for (const team of teams) {
      await prisma.team.upsert({
        where: {
          id: `${organization.id}-${team.name}`.toLowerCase(),
        },
        update: {},
        create: {
          ...team,
          organizationId: organization.id
        }
      })
    }

    // Cria inboxes para cada organização
    const inboxes = [
      {
        name: 'WhatsApp Principal',
        description: 'Canal principal de WhatsApp',
        channelType: 'WHATSAPP',
        channelConfig: {
          phoneNumber: '+5511999999999',
          webhookUrl: 'https://api.orbitchat.io/webhook/whatsapp'
        }
      },
      {
        name: 'Chat Website',
        description: 'Widget de chat do site',
        channelType: 'WEBCHAT',
        channelConfig: {
          widgetColor: '#9333EA',
          welcomeMessage: 'Olá! Como posso ajudar?'
        }
      },
      {
        name: 'Email Suporte',
        description: 'Canal de email',
        channelType: 'EMAIL',
        channelConfig: {
          email: 'suporte@empresa.com.br',
          forwardTo: 'ticket@orbitchat.io'
        }
      }
    ]

    for (const inbox of inboxes) {
      await prisma.inbox.upsert({
        where: {
          id: `${organization.id}-${inbox.name}`.toLowerCase(),
        },
        update: {},
        create: {
          ...inbox,
          organizationId: organization.id,
          isEnabled: true,
          workingHours: {
            monday: { start: '09:00', end: '18:00' },
            tuesday: { start: '09:00', end: '18:00' },
            wednesday: { start: '09:00', end: '18:00' },
            thursday: { start: '09:00', end: '18:00' },
            friday: { start: '09:00', end: '18:00' }
          }
        }
      })
    }

    // Cria contatos de exemplo
    const contacts = [
      {
        name: 'João Silva',
        email: 'joao.silva@email.com',
        phone: '+5511999998888',
        tags: ['cliente-vip', 'premium'],
        customFields: {
          empresa: 'Tech Corp',
          cargo: 'Diretor',
          origem: 'Website'
        }
      },
      {
        name: 'Maria Santos',
        email: 'maria.santos@email.com',
        phone: '+5511999997777',
        tags: ['prospect', 'ecommerce'],
        customFields: {
          empresa: 'Shop Online',
          cargo: 'Gerente',
          origem: 'LinkedIn'
        }
      }
    ]

    for (const contact of contacts) {
      await prisma.contact.upsert({
        where: {
          organizationId_email: {
            organizationId: organization.id,
            email: contact.email
          }
        },
        update: {},
        create: {
          ...contact,
          organizationId: organization.id
        }
      })
    }

    // Cria automações de exemplo
    const automations = [
      {
        name: 'Atribuição Automática',
        description: 'Distribui conversas automaticamente',
        trigger: {
          event: 'conversation.created',
          channel: ['whatsapp', 'webchat']
        },
        conditions: {
          operator: 'AND',
          conditions: [
            { field: 'status', operator: 'equals', value: 'OPEN' },
            { field: 'assigneeId', operator: 'is_empty' }
          ]
        },
        actions: [
          {
            type: 'assign_to_team',
            teamId: 'support-l1',
            strategy: 'round_robin'
          }
        ]
      },
      {
        name: 'Mensagem Fora do Horário',
        description: 'Resposta automática fora do expediente',
        trigger: {
          event: 'message.created',
          channel: ['whatsapp', 'webchat']
        },
        conditions: {
          operator: 'AND',
          conditions: [
            { field: 'working_hours', operator: 'is', value: 'outside' }
          ]
        },
        actions: [
          {
            type: 'send_message',
            message: 'Olá! Nosso horário de atendimento é de seg-sex, 9h às 18h. Retornaremos assim que possível.'
          }
        ]
      }
    ]

    for (const automation of automations) {
      await prisma.automation.upsert({
        where: {
          id: `${organization.id}-${automation.name}`.toLowerCase(),
        },
        update: {},
        create: {
          ...automation,
          organizationId: organization.id,
          trigger: automation.trigger,
          conditions: automation.conditions,
          actions: automation.actions
        }
      })
    }

    // Cria algumas conversas de exemplo
    const conversations = [
      {
        subject: 'Dúvida sobre produto',
        status: 'OPEN',
        priority: 'MEDIUM',
        channelData: {
          source: 'whatsapp',
          contact: '+5511999998888'
        }
      },
      {
        subject: 'Suporte técnico urgente',
        status: 'PENDING',
        priority: 'HIGH',
        channelData: {
          source: 'webchat',
          browser: 'Chrome',
          os: 'Windows'
        }
      }
    ]

    const firstInbox = await prisma.inbox.findFirst({
      where: { organizationId: organization.id }
    })

    for (const conv of conversations) {
      const conversation = await prisma.conversation.create({
        data: {
          ...conv,
          organizationId: organization.id,
          inboxId: firstInbox.id,
          channelData: conv.channelData
        }
      })

      // Adiciona algumas mensagens à conversa
      const messages = [
        {
          content: 'Olá, preciso de ajuda com um produto',
          type: 'text',
          private: false
        },
        {
          content: 'Claro! Em que posso ajudar?',
          type: 'text',
          private: false
        },
        {
          content: 'Nota interna: Cliente VIP, priorizar atendimento',
          type: 'text',
          private: true
        }
      ]

      for (const msg of messages) {
        await prisma.message.create({
          data: {
            ...msg,
            conversationId: conversation.id,
            userId: (await prisma.user.findFirst()).id // Usa o primeiro usuário encontrado
          }
        })
      }
    }
  }

  console.log('Seed de desenvolvimento executado com sucesso!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 