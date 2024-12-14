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

  console.log('Seed executado com sucesso!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 