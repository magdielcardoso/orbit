export const authenticate = async (request, reply) => {
  try {
    await request.jwtVerify()
  } catch (err) {
    reply.status(401).send({
      error: 'Unauthorized',
      message: 'Token inválido ou expirado'
    })
  }
}

export const requireSuperAdmin = async (request, reply) => {
  try {
    const user = await request.prisma.user.findUnique({
      where: { id: request.user.id },
      include: {
        role: {
          include: {
            permissions: {
              include: { permission: true }
            }
          }
        }
      }
    })

    const hasPermission = user.role?.permissions.some(p => p.permission.name === 'manage_system')

    if (!hasPermission) {
      reply.status(403).send({
        error: 'Forbidden',
        message: 'Acesso negado'
      })
    }
  } catch (err) {
    reply.status(500).send({
      error: 'Internal Server Error',
      message: 'Erro ao verificar permissões'
    })
  }
}
