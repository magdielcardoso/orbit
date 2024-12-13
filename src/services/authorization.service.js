import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

class AuthorizationService {
  async createRole(roleData) {
    const { name, description } = roleData;
    
    const existingRole = await prisma.role.findUnique({
      where: { name }
    });

    if (existingRole) {
      throw new Error('Papel já existe');
    }

    return prisma.role.create({
      data: { name, description }
    });
  }

  async createPermission(permissionData) {
    const { name, description } = permissionData;
    
    const existingPermission = await prisma.permission.findUnique({
      where: { name }
    });

    if (existingPermission) {
      throw new Error('Permissão já existe');
    }

    return prisma.permission.create({
      data: { name, description }
    });
  }

  async assignPermissionToRole(roleId, permissionId) {
    const existingAssignment = await prisma.rolePermission.findFirst({
      where: {
        roleId,
        permissionId
      }
    });

    if (existingAssignment) {
      throw new Error('Permissão já atribuída a este papel');
    }

    return prisma.rolePermission.create({
      data: {
        roleId,
        permissionId
      }
    });
  }

  async assignRoleToUser(userId, roleId) {
    return prisma.user.update({
      where: { id: userId },
      data: { roleId }
    });
  }

  async getUserPermissions(userId) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
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
    });

    if (!user || !user.role) {
      return [];
    }

    return user.role.permissions.map(p => p.permission);
  }

  async hasPermission(userId, permissionName) {
    const permissions = await this.getUserPermissions(userId);
    return permissions.some(p => p.name === permissionName);
  }
}

export default new AuthorizationService(); 