import bcrypt from 'bcrypt'
import { logActivity } from '../utils/activity.js'
import jwt from 'jsonwebtoken'
import { loggerService } from './logger.service.js'
import UserModel from '../models/user.model.js'

export default class AuthService {
  /**
   * Registra um novo usuário.
   * 
   * @param {object}
   * @param {string} email
   * @param {string} password.
   * @returns {object}
   */
  async register({ email, password }) {
    try {
      const existingUser = await UserModel.findUserIfExists(email)

      if (existingUser) {
        throw new Error('Email já cadastrado')
      }

      let userRole = await UserModel.findRole('user')

      if (!userRole) {
        userRole = await UserModel.createRole('user')

        const useChat = await UserModel.createPermissionIfNotExists('user_chat', 'Usar o chat')

        await UserModel.relatesRolePermission(userRole, useChat)
      }

      const passwordHash = await bcrypt.hash(password, 10)
      const user = await UserModel.createUser(name, email, passwordHash, userRole)

      const token = jwt.sign(
        {
          id: user.id,
          email: user.email,
          role: user.role?.name,
          permissions: user.role?.permissions.map(p => p.permission.name)
        },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      )

      return {
        token,
        user: {
          ...user,
          role: {
            ...user.role,
            permissions: user.role?.permissions.map(p => p.permission)
          }
        }
      }
    } catch (error) {
      console.error('Erro no registro:', error)
      throw error
    }
  }

  /**
   * Registra um superadministrador.
   * 
   * @param {object} args
   * @param {object} app
   * @returns {object}
   */
  static async registerSuperAdmin(args, app) {
    const existingSuperAdmin = await UserModel.findUserIfExists('superadmin')

    if (existingSuperAdmin) {
      throw new Error('Já existe um superadmin registrado')
    }

    const superadminRole = await UserModel.findRole('superadmin')

    if (!superadminRole) {
      throw new Error('Role de superadmin não encontrada')
    }

    const hashedPassword = await bcrypt.hash(args.password, 10)
    const user = await UserModel.createUser(args.name, args.email, hashedPassword, superadminRole)

    const systemConfig = await UserModel.createSystemConfig(args.systemConfig)

    await logActivity({
      type: 'SYSTEM_EVENT',
      level: 'INFO',
      source: 'SYSTEM',
      action: 'SYSTEM_SETUP',
      description: 'Sistema configurado com sucesso',
      userId: user.id,
      metadata: {
        systemName: args.systemConfig.systemName,
        timezone: args.systemConfig.timezone
      }
    })

    const token = await app.jwt.sign({
      id: user.id,
      email: user.email,
      role: user.role?.name,
      permissions: user.role?.permissions.map(p => p.permission.name)
    })

    return {
      token,
      user,
      systemConfig
    }
  }

  /**
   * Realiza o login de um usuário.
   * 
   * @param {object}
   * @param {string} email
   * @param {string} password
   * @returns {object}
   */
  async login({ email, password }) {
    try {
      const user = await UserModel.findUserByEmail(email)

      console.log('Found user:', JSON.stringify(user, null, 2))

      if (!user) {
        throw new Error('Usuário não encontrado')
      }

      const valid = await bcrypt.compare(password, user.password)
      if (!valid) {
        throw new Error('Senha inválida')
      }

      const permissions = user.role.permissions.map(rp => ({
        name: rp.permission.name
      }))

      loggerService.log('info', 'Login realizado com sucesso', {
        service: 'auth',
        action: 'login',
        userId: user.id,
        email: user.email
      })

      return {
        token: jwt.sign(
          {
            id: user.id,
            email: user.email,
            role: user.role.name,
            permissions: permissions.map(p => p.name)
          },
          process.env.JWT_SECRET,
          { expiresIn: '7d' }
        ),
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          active: user.active,
          role: {
            name: user.role.name,
            permissions: permissions
          }
        }
      }
    } catch (error) {
      loggerService.log('error', 'Erro no login', {
        service: 'auth',
        action: 'login',
        error: error.message,
        stack: error.stack
      })
      throw error
    }
  }
}
