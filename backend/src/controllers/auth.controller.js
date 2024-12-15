import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import Logger from '../helpers/logger.helper.js'
import * as UserModel from '../models/user.model.js'
export default class Auth {
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
      const user = UserModel.createUser(name, email, passwordHash, userRole)

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

  async login({ email, password }) {
    try {
      const user = await UserModel.findUserByEmail(email)

      console.log('Found user:', JSON.stringify(user, null, 2)) // Debug

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

      Logger.log('info', 'Login realizado com sucesso', {
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
      Logger.log('error', 'Erro no login', {
        service: 'auth',
        action: 'login',
        error: error.message,
        stack: error.stack
      })
      throw error
    }
  }
}
