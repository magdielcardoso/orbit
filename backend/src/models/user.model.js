import { prismaInstance } from '../plugins/prisma.plugin.js'

export default class UserModel {
  /**
   * Cria um novo usuário.
   * 
   * @param {string} name
   * @param {string} email
   * @param {string} passwordHash
   * @param {object} userRole
   * @returns {Promise<object>}
   */
  static async createUser(name, email, passwordHash, userRole) {
    return await prismaInstance.user.create({
      data: {
        email,
        password: passwordHash,
        name,
        roleId: userRole.id,
        active: true
      },
      include: {
        role: {
          include: {
            permissions: {
              include: {
                permission: true
              }
            }
          }
        }
      }
    })
  }

  /**
   * Encontra um usuário pelo email.
   * 
   * @param {string} email
   * @returns {Promise<object|null>}
   */
  static async findUserIfExists(email) {
    return await prismaInstance.user.findUnique({ where: { email } })
  }

  /**
   * Encontra um usuário pelo email.
   * 
   * @param {string} email
   * @returns {Promise<object|null>}
   */
  static async findUserByEmail(email) {
    return await prismaInstance.user.findUnique({
      where: { email },
      include: {
        role: {
          include: {
            permissions: {
              include: {
                permission: true
              }
            }
          }
        }
      }
    })
  }

  /**
   * Encontra um usuário pelo ID.
   * 
   * @param {number} id
   * @returns {Promise<object|null>}
   */
  static async findUserById(id) {
    return await prismaInstance.user.findUnique({
      where: { id },
      include: {
        role: {
          include: {
            permissions: {
              include: {
                permission: true
              }
            }
          }
        }
      }
    })
  }

  /**
   * Encontra todos os usuários.
   * 
   * @returns {Promise<object[]>}
   */
  static async findAllUsers() {
    return await prismaInstance.user.findMany({
      include: {
        role: true,
        parentUser: true,
        organizations: {
          include: {
            organization: true
          }
        }
      }
    })
  }

  /**
   * Encontra todos os papéis.
   * 
   * @returns {Promise<object[]>}
   */
  static async findAllRoles() {
    return await prismaInstance.role.findMany({
      include: {
        permissions: {
          include: {
            permission: true
          }
        }
      }
    })
  }

  /**
   * Encontra as atividades recentes.
   * 
   * @returns {Promise<object[]>}
   */
  static async findRecentActivities() {
    return await prismaInstance.activity.findMany({
      take: 5,
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        user: true
      }
    })
  }

  /**
   * Encontra as estatísticas do administrador.
   * 
   * @returns {Promise<object>}
   */
  static async findAdminStats() {
    const [users, roles] = await Promise.all([
      prismaInstance.user.findMany({
        where: { active: true }
      }),
      prismaInstance.role.findMany({
        include: {
          permissions: {
            include: { permission: true }
          }
        }
      })
    ])

    return {
      totalUsers: users.length,
      totalRoles: roles.length,
      roles: roles.map(role => ({
        id: role.id,
        name: role.name,
        createdAt: role.createdAt
      }))
    }
  }

  /**
   * Encontra todas as permissões.
   * 
   * @returns {Promise<object[]>}
   */
  static async findAllPermissions() {
    return await prismaInstance.permission.findMany()
  }

  /**
   * Encontra atividades com base nos critérios fornecidos.
   * 
   * @param {object} where
   * @param {number} limit
   * @param {number} offset
   * @returns {Promise<object[]>}
   */
  static async findActivities(where, limit, offset) {
    return await prismaInstance.activity.findMany({
      where,
      take: limit || 50,
      skip: offset || 0,
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        user: true
      }
    })
  }

  /**
   * Atualiza um usuário.
   * 
   * @param {number} id
   * @param {object} input
   * @returns {Promise<object>}
   */
  static async updateUser(id, input) {
    return await prismaInstance.user.update({
      where: { id },
      data: {
        name: input.name,
        email: input.email,
        role: input.roleId
          ? {
              connect: { id: input.roleId }
            }
          : undefined,
        parentUser: input.parentUserId
          ? {
              connect: { id: input.parentUserId }
            }
          : undefined,
        active: input.active,
        currentOrg: input.currentOrgId
          ? {
              connect: { id: input.currentOrgId }
            }
          : undefined
      },
      include: {
        role: true,
        parentUser: true,
        currentOrg: true,
        organizations: {
          include: {
            organization: true
          }
        }
      }
    })
  }

  /**
   * Deleta um usuário.
   * 
   * @param {number} id
   * @returns {Promise<object>}
   */
  static async deleteUser(id) {
    return await prismaInstance.user.delete({
      where: { id }
    })
  }

  /**
   * Cria uma configuração do sistema.
   * 
   * @param {object} systemConfig
   * @returns {Promise<object>}
   */
  static async createSystemConfig(systemConfig) {
    return await prismaInstance.systemConfig.create({
      data: {
        systemName: systemConfig.systemName,
        timezone: systemConfig.timezone,
        status: 'CONFIGURED',
        setupCompletedAt: new Date()
      }
    })
  }

  /**
   * Insere ou atualiza um usuário da organização.
   * 
   * @param {number} userId
   * @param {number} organizationId
   * @param {boolean} isAdmin
   * @param {boolean} isOwner
   * @returns {Promise<object>}
   */
  static async upsertOrganizationUser(userId, organizationId, isAdmin, isOwner) {
    return await prismaInstance.organizationUser.upsert({
      where: {
        organizationId_userId: {
          organizationId,
          userId
        }
      },
      create: {
        organizationId,
        userId,
        isAdmin: isAdmin || false,
        isOwner: isOwner || false,
        status: 'active'
      },
      update: {
        isAdmin: isAdmin || false,
        isOwner: isOwner || false
      }
    })
  }

  /**
   * Encontra um papel pelo nome.
   * 
   * @param {string} name
   * @returns {Promise<object|null>}
   */
  static async findRole(name) {
    return await prismaInstance.role.findUnique({
      where: { name: name }
    })
  }

  /**
   * Cria um novo papel.
   * 
   * @param {string} name
   * @returns {Promise<object>}
   */
  static async createRole(name) {
    return await prismaInstance.role.create({
      data: {
        name: name,
        description: 'Usuário padrão do sistema'
      }
    })
  }

  /**
   * Cria uma permissão se não existir.
   * 
   * @param {string} name
   * @param {string} description
   * @returns {Promise<object>}
   */
  static async createPermissionIfNotExists(name, description) {
    return await prismaInstance.permission.upsert({
      where: { name: name },
      update: {},
      create: {
        name: name,
        description: description
      }
    })
  }

  /**
   * Relaciona um papel a uma permissão.
   * 
   * @param {object} userRole
   * @param {object} useChat
   * @returns {Promise<object>}
   */
  static async relatesRolePermission(userRole, useChat) {
    return await prismaInstance.rolePermission.create({
      data: {
        roleId: userRole.id,
        permissionId: useChat.id
      }
    })
  }

  /**
   * Encontra um usuário com permissões.
   * 
   * @param {number} userId
   * @returns {Promise<object|null>}
   */
  static async getUserWithPermissions(userId) {
    return await prismaInstance.user.findUnique({
      where: { id: userId },
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
  }
}
