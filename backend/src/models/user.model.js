// models/user.model.js

import prisma from '../helpers/prisma.helper.js'

// USER
export const createUser = async (name, email, passwordHash, userRole) => {
  return await prisma.user.create({
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

export const findUserIfExists = async email => {
  return await prisma.user.findUnique({ where: { email } })
}

export const findUserByEmail = async email => {
  return await prisma.user.findUnique({
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

// ROLES
export const findRole = async name => {
  return await prisma.role.findUnique({
    where: { name: name }
  })
}

export const createRole = async name => {
  return await prisma.role.create({
    data: {
      name: name,
      description: 'Usuário padrão do sistema'
    }
  })
}

// PERMISSIONS
export const createPermissionIfNotExists = async (name, description) => {
  return await prisma.permission.upsert({
    where: { name: name },
    update: {},
    create: {
      name: name,
      description: description
    }
  })
}

export const relatesRolePermission = async (userRole, useChat) => {
  return await prisma.rolePermission.create({
    data: {
      roleId: userRole.id,
      permissionId: useChat.id
    }
  })
}
