import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

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

  // Limpa dados existentes na ordem correta (por causa das foreign keys)
  await prisma.message.deleteMany()
  await prisma.conversation.deleteMany()
  await prisma.contact.deleteMany()
  await prisma.organizationUser.deleteMany()
  await prisma.inbox.deleteMany()
  await prisma.organization.deleteMany()
  await prisma.connector.deleteMany()

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

  for (const org of organizations) {
    const organization = await prisma.organization.upsert({
      where: { slug: org.slug },
      update: {},
      create: {
        ...org,
        features: org.features
      }
    })

    // Cria conectores para a organização
    const connectors = [
      {
        name: 'WhatsApp Cloud API',
        description: 'Conector oficial do WhatsApp',
        source: 'WHATSAPP_API',
        config: {
          apiKey: 'test_api_key',
          phoneNumberId: '123456789',
          webhookSecret: 'test_webhook_secret'
        },
        isEnabled: true,
        organizations: {
          create: {
            organizationId: organization.id,
            isEnabled: true
          }
        }
      },
      {
        name: 'SMTP Email',
        description: 'Conector de email via SMTP',
        source: 'EMAIL',
        config: {
          host: 'smtp.gmail.com',
          port: 587,
          secure: true,
          auth: {
            user: 'test@gmail.com',
            pass: 'app_password'
          }
        },
        isEnabled: true,
        organizations: {
          create: {
            organizationId: organization.id,
            isEnabled: true
          }
        }
      }
    ]

    for (const connector of connectors) {
      await prisma.connector.create({
        data: connector
      })
    }

    // Primeiro criamos um usuário agente para as mensagens
    const agentUser = await prisma.user.upsert({
      where: { email: 'agent@orbitchat.io' },
      update: {},
      create: {
        email: 'agent@orbitchat.io',
        password: await bcrypt.hash('123456', 10),
        name: 'Agente de Suporte',
        role: {
          connect: { name: 'agent' }
        },
        active: true
      }
    })

    // Criamos a relação entre o agente e a organização
    await prisma.organizationUser.upsert({
      where: {
        organizationId_userId: {
          organizationId: organization.id,
          userId: agentUser.id
        }
      },
      update: {
        isAdmin: true,
        status: 'active'
      },
      create: {
        organizationId: organization.id,
        userId: agentUser.id,
        isAdmin: true,
        status: 'active'
      }
    })

    // Associa o usuário de teste à organização
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
        userId: testUser.id,
        organizationId: organization.id,
        isAdmin: true,
        isOwner: true,
        status: 'active'
      }
    })

    // Cria caixas de entrada de teste para a organização
    const inboxes = [
      {
        name: 'WhatsApp Principal',
        description: 'Canal principal de WhatsApp',
        channelType: 'WHATSAPP',
        isEnabled: true
      },
      {
        name: 'Chat do Site',
        description: 'Widget de chat para o site',
        channelType: 'WEBCHAT',
        isEnabled: true
      },
      {
        name: 'E-mail Suporte',
        description: 'Canal de suporte por e-mail',
        channelType: 'EMAIL',
        isEnabled: true
      }
    ]

    const createdInboxes = []
    for (const inbox of inboxes) {
      const createdInbox = await prisma.inbox.create({
        data: {
          ...inbox,
          organizationId: organization.id
        }
      })
      createdInboxes.push(createdInbox)
    }

    // Cria contatos novamente
    const contacts = [
      {
        name: 'João Silva',
        email: 'joao@teste.com',
        phone: '+5511999999999',
        organizationId: organization.id
      },
      {
        name: 'Maria Santos',
        email: 'maria@teste.com',
        phone: '+5511988888888',
        organizationId: organization.id
      }
    ]

    const createdContacts = []
    for (const contact of contacts) {
      const createdContact = await prisma.contact.create({
        data: contact
      })
      createdContacts.push(createdContact)
    }

    // Cria conversas com os novos contatos
    const conversations = [
      {
        status: 'OPEN',
        priority: 'HIGH',
        subject: 'Dúvida sobre produto',
        inboxId: createdInboxes[0].id,
        organizationId: organization.id,
        contactId: createdContacts[0].id,
        assigneeId: agentUser.id,
        messages: {
          create: [
            {
              content: 'Olá, preciso de ajuda com meu pedido',
              userId: agentUser.id,
              isFromContact: true,
              contactId: createdContacts[0].id,
              type: 'text'
            },
            {
              content: 'Claro! Em que posso ajudar?',
              userId: agentUser.id,
              isFromContact: false,
              type: 'text'
            }
          ]
        }
      },
      {
        status: 'PENDING',
        priority: 'MEDIUM',
        subject: 'Problema com entrega',
        inboxId: createdInboxes[0].id,
        organizationId: organization.id,
        contactId: createdContacts[1].id,
        assigneeId: agentUser.id,
        messages: {
          create: [
            {
              content: 'Quando meu pedido será entregue?',
              userId: agentUser.id,
              isFromContact: true,
              contactId: createdContacts[1].id,
              type: 'text'
            }
          ]
        }
      }
    ]

    // Cria as conversas
    for (const conversation of conversations) {
      await prisma.conversation.create({
        data: conversation,
        include: {
          messages: true
        }
      })
    }
  }
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })