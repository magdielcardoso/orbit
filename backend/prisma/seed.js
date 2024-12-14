// Cria a permissão manage_system se não existir
const manageSystem = await prisma.permission.upsert({
  where: { name: 'manage_system' },
  update: {},
  create: {
    name: 'manage_system',
    description: 'Gerenciar sistema'
  }
})

// Associa a permissão ao papel de admin
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