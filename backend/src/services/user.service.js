import bcrypt from 'bcrypt'
import { logActivity } from '../utils/activity.js'
import UserModel from '../models/user.model.js'

export default class UserService {
  /**
   * Cria um novo usuário.
   * 
   * @param {object} args
   * @param {object} user
   * @returns {Promise<object>}
   */
  static async createUser(args, user) {
    const userWithRole = await UserModel.findUserByEmail(user.email)

    const hasPermission = userWithRole?.role?.permissions?.some(
      p => p.permission.name === 'manage_users'
    )

    if (!hasPermission) {
      throw new Error('Não autorizado')
    }

    if (args.parentUserId) {
      const parentUser = await UserModel.findUserById(args.parentUserId)

      if (!parentUser) {
        throw new Error('Usuário pai não encontrado')
      }

      if (parentUser.role?.name !== 'user') {
        throw new Error('O usuário pai deve ter a role "user"')
      }
    }

    const role = await UserModel.findRole(args.roleId)

    if (role?.name === 'agent' && !args.parentUserId) {
      throw new Error('Um agent precisa ter um usuário pai')
    }

    if (role?.name !== 'agent' && args.parentUserId) {
      throw new Error('Apenas agents podem ter um usuário pai')
    }

    const hashedPassword = await bcrypt.hash(args.password, 10)
    const newUser = await UserModel.createUser(args.name, args.email, hashedPassword, role)

    await logActivity({
      type: 'USER_ACTION',
      level: 'INFO',
      source: 'BACKEND',
      action: 'CREATE_USER',
      description: `Usuário ${newUser.name} criado${args.parentUserId ? ' como agent' : ''}`,
      userId: user.id,
      metadata: {
        newUserId: newUser.id,
        isAgent: !!args.parentUserId,
        parentUserId: args.parentUserId
      }
    })

    return newUser
  }

  /**
   * Deleta um usuário.
   * 
   * @param {number} id
   * @param {object} user
   * @returns {Promise<boolean>}
   */
  static async deleteUser(id, user) {
    const userWithRole = await UserModel.findUserByEmail(user.email)

    const hasPermission = userWithRole?.role?.permissions?.some(
      p => p.permission.name === 'manage_users'
    )

    if (!hasPermission) {
      throw new Error('Não autorizado')
    }

    const userToDelete = await UserModel.findUserById(id)

    if (!userToDelete) {
      throw new Error('Usuário não encontrado')
    }

    if (userToDelete.id === user.id) {
      throw new Error('Não é possível deletar o próprio usuário')
    }

    await UserModel.deleteUser(id)

    await logActivity({
      type: 'USER_ACTION',
      level: 'INFO',
      source: 'BACKEND',
      action: 'DELETE_USER',
      description: `Usuário ${userToDelete.name} deletado`,
      userId: user.id,
      metadata: { deletedUserId: userToDelete.id }
    })

    return true
  }

  /**
   * Atualiza um usuário.
   * 
   * @param {number} id
   * @param {object} input
   * @param {object} user
   * @returns {Promise<object>}
   */
  static async updateUser(id, input, user) {
    const userWithRole = await UserModel.findUserByEmail(user.email)

    const hasPermission = userWithRole?.role?.permissions?.some(
      p => p.permission.name === 'manage_users'
    )

    if (!hasPermission) {
      throw new Error('Não autorizado')
    }

    const updatedUser = await UserModel.updateUser(id, input)

    if (input.currentOrgId) {
      await UserModel.upsertOrganizationUser(id, input.currentOrgId, input.isAdmin, input.isOwner)
    }

    return updatedUser
  }
}