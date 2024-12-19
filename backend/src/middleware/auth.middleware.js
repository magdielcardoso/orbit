import { getUserWithPermissions } from '../models/user.model.js';

export const authenticate = async (request, reply) => {
  try {
    await request.jwtVerify()
  } catch {
    reply.status(401).send({
      error: 'Unauthorized',
      message: 'Token inválido ou expirado'
    })
  }
}

export const requireSuperAdmin = async (request, reply) => {
  try {
    const user = await getUserWithPermissions(request.user.id);

    const hasPermission = user.role?.permissions.some(p => p.permission.name === 'manage_system')

    if (!hasPermission) {
      reply.status(403).send({
        error: 'Forbidden',
        message: 'Acesso negado'
      })
    }
  } catch {
    reply.status(500).send({
      error: 'Internal Server Error',
      message: 'Erro ao verificar permissões'
    })
  }
}
